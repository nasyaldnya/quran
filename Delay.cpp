// Delay.cpp — M2 bridge shim.
//
// The delay() loop and its atomics (bAbortDelay, bReplayDelay) are removed;
// SlideshowEngine now owns the timing loop. The remaining public functions
// (setSlideshowStatus, replayDelay, abortDelay) bridge to SlideshowEngine via
// a static pointer set by Delay::init(). Delay::slideshowStatus and
// Delay::uDelayed are kept as read-only shims for Player::draw() and
// Player::updateTimer() until they are removed in Step 3.
//
// TODO(M2 Step 3): retire this file entirely once Player and TrayWindow
// read engine state directly.

#include <windows.h>

#include "Delay.h"
#include "SlideshowEngine.h"
#include "Settings.h"
#include "Filesystem.h"

std::atomic<bool>                    Delay::exiting{ false };
std::atomic<Delay::SlideshowStatus>  Delay::slideshowStatus{ Delay::SlideshowStatus::playing };

namespace Delay
{
	// uDelayed is written by SlideshowEngine (shim) and read by
	// getRemainingDelay() / Player::updateTimer().
	std::atomic<unsigned long> uDelayed{ 0 };

	static Settings*        s_settings = nullptr;
	static SlideshowEngine* s_engine   = nullptr;
}

void Delay::init(Settings& settings, SlideshowEngine& engine)
{
	s_settings = &settings;
	s_engine   = &engine;
}

// ─── Session persistence (unchanged) ─────────────────────────────────────────

void Delay::saveSession(Wallpaper* pCurrent)
{
	wchar_t wsPath[MAX_PATH];
	Filesystem::getRoamingDir(wsPath);
	wcscat_s(wsPath, MAX_PATH, L"Session.dat\0");
	FILE* pFile;
	_wfopen_s(&pFile, wsPath, L"wb");
	if (pFile == NULL)
		return;
	const SlideshowStatus statusSnapshot = slideshowStatus.load();
	const unsigned long uDelayedSnapshot = uDelayed.load();
	fwrite(&statusSnapshot,  sizeof(statusSnapshot),  1, pFile);
	fwrite(&uDelayedSnapshot, sizeof(uDelayedSnapshot), 1, pFile);
	CollectionType type = CollectionType::none;
	if (pCurrent)
		type = pCurrent->getType();
	fwrite(&type, sizeof(CollectionType), 1, pFile);
	switch (type)
	{
	case CollectionType::local:   fwrite(pCurrent->getPathW(), sizeof(wchar_t), MAX_PATH, pFile); break;
	case CollectionType::user:    fwrite(pCurrent->getPathW(), sizeof(wchar_t), 255,      pFile); break;
	case CollectionType::search:  fwrite(pCurrent->getPathW(), sizeof(wchar_t), 1024,     pFile); break;
	default: break;
	}
	fclose(pFile);
}

void Delay::loadSession(Wallpaper*& pCurrent)
{
	wchar_t wsPath[MAX_PATH];
	Filesystem::getRoamingDir(wsPath);
	wcscat_s(wsPath, MAX_PATH, L"Session.dat\0");
	FILE* pFile;
	_wfopen_s(&pFile, wsPath, L"rb");
	if (pFile == NULL)
		return;
	SlideshowStatus statusLoad;
	unsigned long uDelayedLoad = 0;
	fread(&statusLoad,    sizeof(statusLoad),    1, pFile);
	fread(&uDelayedLoad,  sizeof(uDelayedLoad),  1, pFile);
	slideshowStatus.store(statusLoad);
	uDelayed.store(uDelayedLoad);
	if (pCurrent == nullptr)
	{
		CollectionType type;
		fread(&type, sizeof(CollectionType), 1, pFile);
		pCurrent = new Wallpaper(type);
		switch (type)
		{
		case CollectionType::local:   fread(pCurrent->getPathW(), sizeof(wchar_t), MAX_PATH, pFile); break;
		case CollectionType::user:    fread(pCurrent->getPathW(), sizeof(wchar_t), 255,      pFile); break;
		case CollectionType::search:  fread(pCurrent->getPathW(), sizeof(wchar_t), 1024,     pFile); break;
		default: break;
		}
	}
	fclose(pFile);
	DeleteFileW(wsPath);
}

// ─── Bridge functions → SlideshowEngine ──────────────────────────────────────

unsigned long Delay::getRemainingDelay()
{
	if (s_engine)
		return s_engine->getRemainingMs();
	// Fallback if engine not yet initialised (e.g. during startup).
	const unsigned long configured = s_settings ? s_settings->delay : 300000UL;
	const unsigned long current    = uDelayed.load();
	return configured > current ? configured - current : 0UL;
}

void Delay::abortDelay()
{
	if (s_engine)
		s_engine->enqueue(SlideshowEngine::Command::Next);
}

void Delay::replayDelay()
{
	if (s_engine)
		s_engine->enqueue(SlideshowEngine::Command::ResetTimer);
}

void Delay::setSlideshowStatus(const SlideshowStatus status)
{
	if (!s_engine) return;
	switch (status)
	{
	case SlideshowStatus::playing: s_engine->enqueue(SlideshowEngine::Command::Play);  break;
	case SlideshowStatus::paused:  s_engine->enqueue(SlideshowEngine::Command::Pause); break;
	case SlideshowStatus::stopped: s_engine->enqueue(SlideshowEngine::Command::Stop);  break;
	}
}

void Delay::exitEngine()
{
	// Enqueues Command::Exit — wakes the engine thread to shut down cleanly.
	// Does NOT advance the wallpaper or modify any session state.
	// This is the only correct way to signal engine shutdown from TrayWindow.
	if (s_engine)
		s_engine->enqueue(SlideshowEngine::Command::Exit);
	else
		exiting.store(true); // fallback if engine was never initialised
}
