#pragma once

#include <future>
#include <list>

#include "IWindow.h"
#include "Button.h"
#include "Player.h"
#include "CollectionManager.h"

class TrayWindow : public IWindow
{
public:
	/// @param hwndPromise  fulfilled with hWnd() once the window is ready, or
	///                     set_exception on construction failure. WinMain waits
	///                     on the corresponding future before constructing the
	///                     engine. If construction throws, the exception
	///                     propagates back to WinMain via the future.
	TrayWindow(CollectionManager* pCollectionManager,
	           std::promise<HWND>& hwndPromise);
	~TrayWindow();
	LRESULT HandleMessage(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
	
	static constexpr int width = 220, height = 90;
	static TrayWindow *s_pTrayWindow;

private: 
	CollectionManager* m_pCollectionManager;

public:
	Button btnSettings, btnExit;

private:
	Player player;
	HICON hStatusIcon = nullptr;
	LPCSTR pszIDStatusIcon = nullptr;
};