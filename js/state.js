// ============================================================
// state.js — Single source of truth for the entire application
// Every module imports from here. No prop drilling.
// ============================================================

export const state = {
  // ── Data ────────────────────────────────────────────────
  allSurahs: [],
  allLanguages: [],
  allRiwayat: [],
  masterReciters: [],   // Full unfiltered list from API
  reciters: [],         // Currently displayed (filtered) list

  // ── Playback ────────────────────────────────────────────
  queue: [],
  currentIndex: -1,
  repeatMode: 'off',    // 'off' | 'one' | 'all'
  isShuffled: false,
  playbackRate: 1,

  // ── Filters ─────────────────────────────────────────────
  activeLanguage: 'ar',
  activeRiwaya: '',
  activeSurah: '',
  searchQuery: '',

  // ── Sleep Timer ─────────────────────────────────────────
  sleepTimer: null,
  sleepInterval: null,
  sleepEndTime: null,

  // ── User Data ───────────────────────────────────────────
  favorites: [],
  recentlyPlayed: [],   // Last 10 tracks [{reciter, moshaf, surah, playedAt}]
  bookmarks: {},        // { "reciterId-moshafId-surahId": timeInSeconds }

  // ── UI ──────────────────────────────────────────────────
  isLoading: false,
  activeView: 'home',   // 'home' | 'reciter'
};

/**
 * Update state properties and return the updated state.
 * Supports dot-notation keys for nested updates.
 * @param {Partial<typeof state>} updates
 */
export function setState(updates) {
  Object.assign(state, updates);
  return state;
}
