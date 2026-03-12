// ============================================================
// player.js — Audio engine using Howler.js
// ============================================================

import { state, setState } from './state.js';
import { $, buildAudioUrl, formatTime, bookmarkKey, setUrlParams } from './utils.js';
import {
  updateNowPlaying, updateProgress, updatePlayerControls,
  updateRepeatBtn, updateShuffleBtn, renderQueue, showToast, updateSleepTimerDisplay
} from './ui.js';
import {
  addToRecentlyPlayed, saveSession, saveBookmark,
  removeBookmark, getBookmark, saveSleepEndTime, clearSleepEndTime
} from './storage.js';
import { t } from './i18n.js';

// ── Module-level audio state ─────────────────────────────────

let sound         = null;   // Current Howl instance
let rafId         = null;   // requestAnimationFrame id
let isTransitioning = false;

// ── Queue Management ─────────────────────────────────────────

export function addTrackToQueue(track, playNow = false) {
  const duplicate = state.queue.some(
    (t) =>
      t.surah?.id   === track.surah?.id &&
      t.reciter?.id === track.reciter?.id &&
      t.moshaf?.id  === track.moshaf?.id
  );

  if (duplicate) {
    showToast(t('addToQueue') + ' — ' + (getLang() === 'ar' ? 'موجودة بالفعل' : 'already in queue'), 'warning');
    return;
  }

  state.queue.push(track);
  showToast(t('addToQueue') + ' ✓');

  if (playNow) {
    setState({ currentIndex: state.queue.length - 1 });
    playFromQueue();
  }

  renderQueue(window.__handlers);
}

export function handlePlayAll(reciter, moshaf, replace) {
  if (replace) {
    state.queue = [];
    setState({ currentIndex: -1 });
  }

  const available = new Set(moshaf.surah_list.split(',').map(Number));
  const toAdd = state.allSurahs.filter((s) => s && available.has(s.id));
  toAdd.forEach((surah) => state.queue.push({ reciter, moshaf, surah }));

  if (replace && state.queue.length > 0) {
    setState({ currentIndex: 0 });
    playFromQueue();
  }

  renderQueue(window.__handlers);
}

export function playTrackAtIndex(index) {
  setState({ currentIndex: index });
  playFromQueue();
}

export function removeFromQueue(index) {
  const wasPlaying = index === state.currentIndex;
  state.queue.splice(index, 1);

  if (wasPlaying) {
    if (!state.queue.length) {
      stopSound();
      setState({ currentIndex: -1 });
      updateNowPlaying(null);
    } else {
      if (state.currentIndex >= state.queue.length) {
        setState({ currentIndex: 0 });
      }
      playFromQueue();
    }
  } else if (index < state.currentIndex) {
    setState({ currentIndex: state.currentIndex - 1 });
  }

  renderQueue(window.__handlers);
}

// ── Core Playback ────────────────────────────────────────────

export function playFromQueue() {
  const track = state.queue[state.currentIndex];
  if (!track) return;

  cancelAnimationFrame(rafId);

  const createSound = () => {
    const src = buildAudioUrl(track.moshaf, track.surah);

    sound = new Howl({
      src: [src],
      html5: true,
      volume: 0,
      rate: state.playbackRate,

      onplay: () => {
        isTransitioning = false;
        sound.fade(0, 1, 600);
        updatePlayerControls(true);
        updateNowPlaying(track);
        tick();

        // Restore bookmark if exists
        const bKey = bookmarkKey(track.reciter.id, track.moshaf.id, track.surah.id);
        const saved = getBookmark(bKey);
        if (saved && saved > 5) {
          sound.seek(saved);
          showToast(`${t('resumeFrom')} ${formatTime(saved)}`);
        }
      },

      onpause: () => {
        updatePlayerControls(false);
        cancelAnimationFrame(rafId);
      },

      onend: () => {
        cancelAnimationFrame(rafId);
        onTrackEnded();
      },

      onloaderror: (_, err) => {
        console.error('[player] Load error:', err);
        showToast(t('errorAudio'), 'error');
        setTimeout(playNext, 1200);
      },

      onstop: () => {
        updatePlayerControls(false);
        cancelAnimationFrame(rafId);
      },
    });

    sound.play();

    // Persist to recently played
    const updated = addToRecentlyPlayed(track);
    setState({ recentlyPlayed: updated });

    // Update URL for sharing
    updateShareUrl(track);

    // Update media session
    updateMediaSession(track);

    renderQueue(window.__handlers);
  };

  if (sound && !isTransitioning) {
    isTransitioning = true;
    const old = sound;
    old.fade(old.volume(), 0, 500);
    old.once('fade', () => {
      old.unload();
      createSound();
    });
  } else {
    if (sound) sound.unload();
    createSound();
  }
}

function tick() {
  if (!sound || !sound.playing()) {
    // Still update progress when paused so seek works correctly
  }
  updateProgress(sound?.seek() || 0, sound?.duration() || 0);
  rafId = requestAnimationFrame(tick);
}

function stopSound() {
  if (sound) {
    cancelAnimationFrame(rafId);
    sound.stop();
    sound.unload();
    sound = null;
  }
  updatePlayerControls(false);
  updateProgress(0, 0);
}

const onTrackEnded = () => {
  if (state.repeatMode === 'one') {
    sound.seek(0);
    sound.play();
    return;
  }
  if (state.currentIndex < state.queue.length - 1) {
    playNext();
  } else if (state.repeatMode === 'all' && state.queue.length > 0) {
    setState({ currentIndex: 0 });
    playFromQueue();
  } else {
    updatePlayerControls(false);
  }
};

// ── Transport Controls ───────────────────────────────────────

export function playNext() {
  if (state.currentIndex < state.queue.length - 1) {
    setState({ currentIndex: state.currentIndex + 1 });
    playFromQueue();
  } else if (state.repeatMode === 'all' && state.queue.length > 0) {
    setState({ currentIndex: 0 });
    playFromQueue();
  }
}

export function playPrev() {
  // If more than 3 seconds in, restart current track
  if (sound && sound.seek() > 3) {
    sound.seek(0);
    return;
  }
  if (state.currentIndex > 0) {
    setState({ currentIndex: state.currentIndex - 1 });
    playFromQueue();
  }
}

export function togglePlayPause() {
  if (!sound) {
    if (state.queue.length) {
      if (state.currentIndex === -1) setState({ currentIndex: 0 });
      playFromQueue();
    }
    return;
  }

  if (sound.playing()) {
    sound.fade(sound.volume(), 0, 400);
    sound.once('fade', () => sound.pause());
  } else {
    sound.volume(0);
    sound.play();
    sound.fade(0, 1, 400);
  }
}

export function seek(pct) {
  if (!sound || !sound.duration()) return;
  sound.seek(sound.duration() * pct);
}

export function setPlaybackRate(rate) {
  setState({ playbackRate: rate });
  if (sound) sound.rate(rate);
}

export function cycleRepeat() {
  const modes = ['off', 'one', 'all'];
  const next = modes[(modes.indexOf(state.repeatMode) + 1) % modes.length];
  setState({ repeatMode: next });
  updateRepeatBtn();
}

export function toggleShuffle() {
  setState({ isShuffled: !state.isShuffled });
  updateShuffleBtn();
  if (state.isShuffled) showToast(getLang() === 'ar' ? 'تشغيل عشوائي' : 'Shuffle on');
}

// ── Bookmark ─────────────────────────────────────────────────

export function toggleBookmark() {
  const track = state.queue[state.currentIndex];
  if (!track || !sound) return;

  const bKey = bookmarkKey(track.reciter.id, track.moshaf.id, track.surah.id);
  const existing = getBookmark(bKey);

  if (existing !== null) {
    const updated = removeBookmark(bKey);
    setState({ bookmarks: updated });
    showToast(t('bookmarkRemoved'));
  } else {
    const time = sound.seek() || 0;
    const updated = saveBookmark(bKey, time);
    setState({ bookmarks: updated });
    showToast(`${t('bookmarkSaved')} — ${formatTime(time)}`);
  }
}

// ── Sleep Timer ──────────────────────────────────────────────

export function setSleepTimer(minutes) {
  clearSleepTimerInternal();

  const totalMs = minutes * 60 * 1000;
  const fadeMs  = 30_000; // 30 second fade
  const endTime = Date.now() + totalMs;

  saveSleepEndTime(endTime);
  setState({ sleepEndTime: endTime });

  // Countdown display
  state.sleepInterval = setInterval(() => {
    const remaining = Math.round((endTime - Date.now()) / 1000);
    updateSleepTimerDisplay(remaining);
    if (remaining <= 0) clearSleepTimerInternal();
  }, 1000);

  // Fade + pause
  const fadeDelay = Math.max(0, totalMs - fadeMs);
  state.sleepTimer = setTimeout(() => {
    if (sound && sound.playing()) {
      sound.fade(sound.volume(), 0, fadeMs);
      sound.once('fade', () => {
        sound.pause();
        clearSleepTimerInternal();
      });
    } else {
      clearSleepTimerInternal();
    }
  }, fadeDelay);

  showToast(
    getLang() === 'ar'
      ? `مؤقت النوم: ${minutes} دقيقة`
      : `Sleep timer: ${minutes} min`
  );

  updateSleepTimerDisplay(minutes * 60);
}

export function cancelSleepTimer() {
  clearSleepTimerInternal();
  clearSleepEndTime();
  updateSleepTimerDisplay(0);
  showToast(getLang() === 'ar' ? 'تم إلغاء المؤقت' : 'Timer cancelled');
}

function clearSleepTimerInternal() {
  clearTimeout(state.sleepTimer);
  clearInterval(state.sleepInterval);
  setState({ sleepTimer: null, sleepInterval: null, sleepEndTime: null });
}

// ── Media Session API ────────────────────────────────────────

export function setupMediaSession() {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.setActionHandler('play',          () => togglePlayPause());
  navigator.mediaSession.setActionHandler('pause',         () => togglePlayPause());
  navigator.mediaSession.setActionHandler('nexttrack',     playNext);
  navigator.mediaSession.setActionHandler('previoustrack', playPrev);
  navigator.mediaSession.setActionHandler('seekto', (details) => {
    if (details.seekTime !== undefined) seek(details.seekTime / (sound?.duration() || 1));
  });
}

function updateMediaSession(track) {
  if (!('mediaSession' in navigator) || !track) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title:  track.surah?.name  ?? '',
    artist: track.reciter?.name ?? '',
    album:  track.moshaf?.name  ?? '',
  });
}

// ── Deep Link ────────────────────────────────────────────────

export function applyDeepLink() {
  const params = Object.fromEntries(new URLSearchParams(location.search));
  const { reciter: rid, moshaf: mid, surah: sid } = params;
  if (!rid || !mid || !sid) return;

  // Use masterReciters (the complete list) — this was the bug in the original
  const reciter = state.masterReciters.find((r) => String(r.id) === rid);
  if (!reciter) return;

  const moshaf = reciter.moshaf?.find((m) => String(m.id) === mid);
  if (!moshaf) return;

  const surah = state.allSurahs.find((s) => String(s.id) === sid);
  if (!surah) return;

  state.queue = [{ reciter, moshaf, surah }];
  setState({ currentIndex: 0 });
  playFromQueue();
}

function updateShareUrl(track) {
  if (!track) return;
  setUrlParams({
    reciter: track.reciter.id,
    moshaf:  track.moshaf.id,
    surah:   track.surah.id,
  });
}

// ── Getters (used by main.js for saving state) ───────────────

export const getCurrentTime = () => sound?.seek() || 0;
export const getCurrentRate = () => state.playbackRate;
export const isPlaying      = () => sound?.playing() ?? false;

// ── Keyboard Shortcuts ───────────────────────────────────────

export function setupKeyboardShortcuts(handlers) {
  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

    switch (e.code) {
      case 'Space':      e.preventDefault(); togglePlayPause(); break;
      case 'ArrowRight': e.preventDefault(); playNext(); break;
      case 'ArrowLeft':  e.preventDefault(); playPrev(); break;
      case 'ArrowUp':    e.preventDefault(); adjustVolume(0.1); break;
      case 'ArrowDown':  e.preventDefault(); adjustVolume(-0.1); break;
      case 'KeyF':       handlers.toggleFavoriteCurrentReciter(); break;
      case 'KeyS':       $('sleep-timer-panel')?.classList.toggle('hidden'); break;
      case 'Slash':
        if (e.shiftKey) $('shortcuts-modal')?.classList.toggle('hidden');
        break;
    }
  });
}

function adjustVolume(delta) {
  if (!sound) return;
  const newVol = Math.min(1, Math.max(0, sound.volume() + delta));
  sound.volume(newVol);
}

// Helper to get current lang without circular import
function getLang() {
  return document.documentElement.lang || 'ar';
}
