#pragma once

#include <atomic>
#include "Wallpaper.h"

class Settings;
class SlideshowEngine;

namespace Delay
{
	enum class SlideshowStatus : unsigned char
	{
		paused,
		playing,
		stopped
	};

	// Atomics read by Player::draw() and Player::updateTimer() as a shim.
	// Written by SlideshowEngine. TODO(M2 Step 3): retire once Player reads
	// engine state directly.
	extern std::atomic<bool> exiting;
	extern std::atomic<SlideshowStatus> slideshowStatus;
	extern std::atomic<unsigned long>   uDelayed;

	/// Must be called from WinMain after Settings::load() and after the
	/// SlideshowEngine is constructed. Both references must remain valid for
	/// the lifetime of the Delay bridge.
	void init(Settings& settings, SlideshowEngine& engine);

	void saveSession(Wallpaper* pCurrent = nullptr);
	void loadSession(Wallpaper*& pCurrent);

	/// Returns ms remaining in the current interval.
	/// Delegates to SlideshowEngine::getRemainingMs() after init().
	unsigned long getRemainingDelay();

	/// Bridge: enqueues SlideshowEngine::Command::Next.
	void abortDelay();

	/// Bridge: enqueues SlideshowEngine::Command::ResetTimer.
	void replayDelay();

	/// Bridge: translates status → SlideshowEngine command and enqueues it.
	void setSlideshowStatus(const SlideshowStatus status);

	/// Sends a clean shutdown signal to the engine (Command::Exit).
	/// Call this from TrayWindow::~TrayWindow instead of abortDelay().
	/// Unlike abortDelay(), this does NOT advance the wallpaper or change
	/// any session state — it only wakes the engine thread to exit.
	void exitEngine();
}
