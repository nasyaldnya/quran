// ============================================================
// main.js — App bootstrap. Wires everything together.
// ============================================================

import { state, setState }       from './state.js';
import * as api                  from './api.js';
import * as ui                   from './ui.js';
import * as player               from './player.js';
import * as storage              from './storage.js';
import { initI18n, setLanguage, translateDOM, t, getLang } from './i18n.js';
import { $, $$, debounce, setUrlParams } from './utils.js';

// ── Event handler registry (shared with player.js via window) ─

const handlers = {
  playSurah:     (track) => { state.queue = [track]; setState({ currentIndex: 0 }); player.playFromQueue(); },
  addToQueue:    (track) => player.addTrackToQueue(track, false),
  handlePlayAll: (reciter, moshaf, replace) => player.handlePlayAll(reciter, moshaf, replace),
  playTrackAtIndex: (i)  => player.playTrackAtIndex(i),
  removeFromQueue:  (i)  => player.removeFromQueue(i),
  toggleFavoriteCurrentReciter: () => {
    const track = state.queue[state.currentIndex];
    if (track?.reciter) toggleFavorite(track.reciter.id);
  },
};

// Expose to player.js (avoids circular imports)
window.__handlers = handlers;

// ── Favorites ─────────────────────────────────────────────────

function toggleFavorite(id) {
  const updated = storage.toggleFavorite(id);
  setState({ favorites: updated });
  // Re-render with the full master list so the favorites tab can find all favorited reciters
  ui.renderReciters(state.masterReciters, handlers.selectReciter, toggleFavorite);
}

handlers.selectReciter = (reciter) => {
  ui.renderReciterDetails(reciter, handlers);
};

// ── Data Loading ─────────────────────────────────────────────

let fetchCtrl = null;

async function loadReciters() {
  fetchCtrl?.abort();
  fetchCtrl = new AbortController();

  ui.showSkeletons();

  const data = await api.getReciters({
    lang:   state.activeLanguage,
    riwaya: state.activeRiwaya,
    surah:  state.activeSurah,
  }, fetchCtrl.signal);

  if (fetchCtrl.signal.aborted) return;

  const reciters = data?.reciters ?? [];
  setState({ reciters });
  // Only refresh masterReciters when there are no active filters
  if (!state.activeRiwaya && !state.activeSurah) {
    setState({ masterReciters: reciters });
  }
  ui.renderReciters(reciters, handlers.selectReciter, toggleFavorite);
}

async function loadInitialData() {
  ui.showSkeletons();

  const lang = storage.loadLanguage();
  initI18n(lang);
  setState({ activeLanguage: lang });

  const ctrl = new AbortController();
  const data = await api.loadInitialData(lang, ctrl.signal);

  if (!data) {
    ui.showToast(t('errorLoad'), 'error');
    return;
  }

  setState({
    allSurahs:     data.surahs,
    masterReciters: data.reciters,
    reciters:      data.reciters,
  });

  ui.renderLanguages(data.languages, lang);
  ui.renderRiwayat(data.riwayat);
  ui.renderSurahFilter(data.surahs);
  ui.renderReciters(data.reciters, handlers.selectReciter, toggleFavorite);

  // Translate after DOM is populated
  translateDOM();

  // Restore session
  restoreSession();

  // Apply deep link after short delay (allows DOM to settle)
  setTimeout(player.applyDeepLink, 300);
}

function restoreSession() {
  const session = storage.loadSession();
  if (!session) return;

  setState({
    queue:        session.queue,
    currentIndex: session.currentIndex,
    repeatMode:   session.repeatMode,
    playbackRate: session.playbackRate,
  });

  const speedEl = $('playback-speed');
  if (speedEl) speedEl.value = session.playbackRate;
  ui.updateSpeedDisplay(session.playbackRate);
  ui.renderQueue(handlers);
  ui.updateRepeatBtn();

  // Restore sleep timer if it was active
  const sleepEnd = storage.loadSleepEndTime();
  if (sleepEnd && sleepEnd > Date.now()) {
    const remainingMin = (sleepEnd - Date.now()) / 60000;
    player.setSleepTimer(remainingMin);
  }
}

// ── Theme ─────────────────────────────────────────────────────

function applyTheme() {
  const saved = storage.loadTheme();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;
  document.documentElement.classList.toggle('dark', isDark);
  updateThemeBtn(isDark);
}

function updateThemeBtn(isDark) {
  const icon = $('theme-icon');
  const text = $('theme-text');
  if (icon) icon.innerHTML = isDark
    ? `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79zm-1.98 6.16H2v2h2.78zm14.44 0H22v2h-2.78zm-1.98-4.34 1.79-1.79-1.41-1.41-1.79 1.79zM17.24 18.16l1.79 1.8 1.41-1.41-1.8-1.79zM20 11c0-4.42-3.58-8-8-8s-8 3.58-8 8 3.58 8 8 8 8-3.58 8-8zm-8 6c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9.93V2h2v5.07A4.994 4.994 0 0 0 12 7c-.34 0-.67.03-1 .07zM4.69 17.1l-1.41 1.41 1.8 1.79 1.41-1.41zm14.62 1.41-1.41-1.41-1.79 1.8 1.41 1.41z"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`;
  if (text) text.setAttribute('data-i18n', isDark ? 'themeLight' : 'themeDark');
  translateDOM();
}

// ── Event Listeners ───────────────────────────────────────────

function setupEventListeners() {
  // ── Filters
  $('language-select')?.addEventListener('change', (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setState({ activeLanguage: lang, activeRiwaya: '', activeSurah: '' });
    $('riwaya-select').value = '';
    $('surah-select').value  = '';
    loadReciters();
  });

  $('riwaya-select')?.addEventListener('change', (e) => {
    setState({ activeRiwaya: e.target.value, searchQuery: '' });
    $('search-input').value = '';
    loadReciters();
  });

  $('surah-select')?.addEventListener('change', (e) => {
    setState({ activeSurah: e.target.value, searchQuery: '' });
    $('search-input').value = '';
    loadReciters();
  });

  $('search-input')?.addEventListener('input', debounce((e) => {
    setState({ searchQuery: e.target.value });
    // Search filters the currently active list (not master)
    ui.renderReciters(state.reciters, handlers.selectReciter, toggleFavorite);
  }, 200));

  // ── Player transport
  $('play-pause-btn')?.addEventListener('click', player.togglePlayPause);
  $('next-btn')?.addEventListener('click', player.playNext);
  $('prev-btn')?.addEventListener('click', player.playPrev);
  $('repeat-btn')?.addEventListener('click', player.cycleRepeat);
  $('shuffle-btn')?.addEventListener('click', player.toggleShuffle);
  $('bookmark-btn')?.addEventListener('click', player.toggleBookmark);

  // ── Progress bar (supports click anywhere)
  $('progress-container')?.addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isRtl = document.documentElement.dir === 'rtl';
    const pct = isRtl
      ? (rect.right - e.clientX) / rect.width
      : (e.clientX - rect.left) / rect.width;
    player.seek(Math.max(0, Math.min(1, pct)));
  });

  // ── Speed control
  $('playback-speed')?.addEventListener('change', (e) => {
    const rate = parseFloat(e.target.value);
    player.setPlaybackRate(rate);
    ui.updateSpeedDisplay(rate);
  });

  // ── Queue toggle
  $('queue-toggle-btn')?.addEventListener('click', () => {
    $('queue-panel')?.classList.toggle('queue-open');
  });

  // ── Sleep timer buttons
  $$('.sleep-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const min = parseFloat(btn.dataset.min);
      player.setSleepTimer(min);
      $('sleep-timer-panel')?.classList.add('hidden');
    });
  });

  $('sleep-timer-toggle')?.addEventListener('click', () => {
    $('sleep-timer-panel')?.classList.toggle('hidden');
  });

  $('cancel-sleep-btn')?.addEventListener('click', player.cancelSleepTimer);

  // ── Custom sleep duration
  $('custom-sleep-btn')?.addEventListener('click', () => {
    const val = parseFloat($('custom-sleep-input')?.value);
    if (val > 0 && val <= 300) {
      player.setSleepTimer(val);
      $('sleep-timer-panel')?.classList.add('hidden');
    }
  });

  // ── Copy link
  $('copy-link-btn')?.addEventListener('click', () => {
    const track = state.queue[state.currentIndex];
    if (!track) return;
    const url = location.href;
    navigator.clipboard.writeText(url).then(() => showToast(t('linkCopied')));
  });

  // ── Download
  $('download-btn')?.addEventListener('click', () => {
    const track = state.queue[state.currentIndex];
    if (!track) return;
    const { moshaf, surah, reciter } = track;
    const src = `${moshaf.server.endsWith('/') ? moshaf.server : moshaf.server + '/'}${String(surah.id).padStart(3,'0')}.mp3`;
    const a = Object.assign(document.createElement('a'), {
      href: src,
      download: `${reciter.name} - ${surah.name}.mp3`,
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // ── Theme toggle
  $('theme-toggle')?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    storage.saveTheme(isDark ? 'dark' : 'light');
    updateThemeBtn(isDark);
  });

  // ── Shortcuts modal
  $('shortcuts-toggle')?.addEventListener('click', () => {
    $('shortcuts-modal')?.classList.toggle('hidden');
  });
  $('shortcuts-close')?.addEventListener('click', () => {
    $('shortcuts-modal')?.classList.add('hidden');
  });

  // ── Save session on unload
  window.addEventListener('beforeunload', () => {
    storage.saveSession({
      queue:        state.queue,
      currentIndex: state.currentIndex,
      repeatMode:   state.repeatMode,
      playbackRate: state.playbackRate,
    });
  });

  // ── Keyboard shortcuts
  player.setupKeyboardShortcuts(handlers);

  // ── Media session
  player.setupMediaSession();
}

// ── Helper (accessible inside this module) ───────────────────

function showToast(msg, type) { ui.showToast(msg, type); }

// ── Boot ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  setState({ favorites: storage.loadFavorites() });
  setState({ recentlyPlayed: storage.loadRecentlyPlayed() });
  setState({ bookmarks: storage.loadBookmarks() });

  applyTheme();
  setupEventListeners();
  loadInitialData();
});

// ── Service Worker Registration ───────────────────────────────

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('[SW] Registered:', reg.scope))
      .catch((err) => console.error('[SW] Failed:', err));
  });
}
