#include <future>
#include <thread>

#include "AppMutex.h"
#include "Logger.h"
#include "TrayWindow.h"
#include "CollectionManager.h"
#include "Settings.h"
#include "Filesystem.h"
#include "Delay.h"
#include "SlideshowEngine.h"

int WINAPI WinMain(_In_ HINSTANCE, _In_opt_ HINSTANCE, _In_ LPSTR, _In_ int)
{
    try
	{
		AppMutex appMutex("Wallomizer");
		SetPriorityClass(GetCurrentProcess(), BELOW_NORMAL_PRIORITY_CLASS);

		Filesystem::initialize();

		{
			wchar_t logPath[MAX_PATH], bakPath[MAX_PATH];
			Filesystem::getRoamingDirNative(logPath);
			Filesystem::getRoamingDirNative(bakPath);
			wcscat_s(logPath, MAX_PATH, L"wallomizer.log");
			wcscat_s(bakPath, MAX_PATH, L"wallomizer.log.bak");
			Logger::get().init(logPath, bakPath);
		}
		LOG_INFO("Wallomizer starting up.");

		Settings settings;
		settings.load();

		CollectionManager collectionManager(settings);
		Delay::loadSession(collectionManager.pCurrent);

		// SlideshowEngine needs the TrayWindow's HWND to post WM_ENGINE_*
		// messages. TrayWindow is created on the tray thread, so we pass the
		// engine a placeholder HWND of nullptr here and the tray thread calls
		// engine.setUiHwnd() once the window is live. For the initial M2 build
		// we adopt a simpler approach: the engine is created after the tray
		// window is ready by using a one-shot HWND rendezvous.
		//
		// Rendezvous: the tray thread sets TrayWindow::s_pTrayWindow and then
		// signals the main thread via collectionManager.isReady() (already used
		// for MainWindow). We wait for TrayWindow::s_pTrayWindow != nullptr.

		// Promise/future rendezvous for TrayWindow startup.
		// The tray thread fulfills hwndPromise with the window HWND on success,
		// or calls set_exception() if construction throws. WinMain blocks on
		// hwndFuture.get(): on failure, get() rethrows the exception into the
		// main thread's catch blocks, ensuring correct cleanup.
		std::promise<HWND> hwndPromise;
		std::future<HWND>  hwndFuture = hwndPromise.get_future();

		std::exception_ptr trayWindowException = nullptr;
		std::thread trayWindowThread(
		    [&collectionManager, &hwndPromise, &trayWindowException]()
		{
			try
			{
				TrayWindow trayWindow(&collectionManager, hwndPromise);
				trayWindow.windowLoop();
			}
			catch (...)
			{
				trayWindowException = std::current_exception();
				// If the window was never ready, hwndPromise hasn't been fulfilled
				// yet. Set the exception so WinMain unblocks from hwndFuture.get().
				try { hwndPromise.set_exception(std::current_exception()); }
				catch (const std::future_error&) { /* already fulfilled — ignore */ }
			}
		});

		// Block until the window is ready (or construction failed).
		// On failure hwndFuture.get() rethrows into the main thread catch blocks.
		const HWND uiHwnd = hwndFuture.get();

		// Construct and start the engine. The engine thread begins immediately.
		SlideshowEngine engine(collectionManager, settings, uiHwnd);
		Delay::init(settings, engine);

		// Restore previous session state.
		{
			const auto restoredStatus = Delay::slideshowStatus.load();
			if (restoredStatus == Delay::SlideshowStatus::playing)
				engine.enqueue(SlideshowEngine::Command::Play);
			// Paused and Stopped start in the Stopped state (safe default).
		}

		// Block until the engine processes an Exit command (sent by
		// TrayWindow::~TrayWindow when the user clicks Exit).
		// The engine destructor will join the thread.
		while (engine.getState() != SlideshowEngine::State::Exiting)
		{
			if (Delay::exiting.load())
			{
				engine.enqueue(SlideshowEngine::Command::Exit);
				break;
			}
			Sleep(50);
		}

		trayWindowThread.join();
		if (trayWindowException)
			std::rethrow_exception(trayWindowException);
		LOG_INFO("Wallomizer shut down cleanly.");
		return 0;
	}
	catch (const std::exception& e)
	{
		LOG_ERROR(e.what());
		MessageBox(nullptr, e.what(), "Exception", MB_OK | MB_ICONEXCLAMATION);
	}
	catch (...)
	{
		LOG_ERROR("Unknown unhandled exception.");
		MessageBox(nullptr, "No details available", "Unknown Exception", MB_OK | MB_ICONEXCLAMATION);
	}
	return -1;
}