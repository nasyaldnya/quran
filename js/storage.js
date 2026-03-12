// ============================================================
// storage.js — localStorage abstraction with safe error handling
// All keys are namespaced under 'qp_' (quran player)
// ============================================================

const KEYS = {
  FAVORITES:      'qp_favorites',
  RECENTLY_PLAYED:'qp_recently_played',
  BOOKMARKS:      'qp_bookmarks',
  QUEUE:          'qp_queue',
  QUEUE_INDEX:    'qp_queue_index',
  REPEAT_MODE:    'qp_repeat_mode',
  PLAYBACK_RATE:  'qp_playback_rate',
  LANGUAGE:       'qp_language',
  THEME:          'qp_theme',
  SLEEP_END_TIME: 'qp_sleep_end',
};

// ── Low-level helpers ────────────────────────────────────────

function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    console.warn(`[storage] Failed to read key: ${key}`);
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Quota exceeded or private browsing — fail silently
    console.warn(`[storage] Failed to write key: ${key}`, e.message);
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

// ── Favorites ────────────────────────────────────────────────

export const loadFavorites = () => load(KEYS.FAVORITES, []);

export const saveFavorites = (ids) => save(KEYS.FAVORITES, ids);

export const toggleFavorite = (id) => {
  const favs = loadFavorites();
  const updated = favs.includes(id)
    ? favs.filter((f) => f !== id)
    : [...favs, id];
  saveFavorites(updated);
  return updated;
};

// ── Recently Played ──────────────────────────────────────────

const MAX_RECENT = 10;

export const loadRecentlyPlayed = () => load(KEYS.RECENTLY_PLAYED, []);

export const addToRecentlyPlayed = (track) => {
  const recent = loadRecentlyPlayed();
  // Remove duplicate if same surah/reciter already in list
  const filtered = recent.filter(
    (t) =>
      !(
        t.surah?.id === track.surah?.id &&
        t.reciter?.id === track.reciter?.id &&
        t.moshaf?.id === track.moshaf?.id
      )
  );
  const updated = [{ ...track, playedAt: Date.now() }, ...filtered].slice(
    0,
    MAX_RECENT
  );
  save(KEYS.RECENTLY_PLAYED, updated);
  return updated;
};

// ── Bookmarks ────────────────────────────────────────────────

export const loadBookmarks = () => load(KEYS.BOOKMARKS, {});

export const saveBookmark = (key, timeInSeconds) => {
  const bookmarks = loadBookmarks();
  bookmarks[key] = timeInSeconds;
  save(KEYS.BOOKMARKS, bookmarks);
  return bookmarks;
};

export const removeBookmark = (key) => {
  const bookmarks = loadBookmarks();
  delete bookmarks[key];
  save(KEYS.BOOKMARKS, bookmarks);
  return bookmarks;
};

export const getBookmark = (key) => {
  const bookmarks = loadBookmarks();
  return bookmarks[key] ?? null;
};

// ── Playback Session ─────────────────────────────────────────

export const saveSession = ({ queue, currentIndex, repeatMode, playbackRate }) => {
  if (!queue?.length) {
    remove(KEYS.QUEUE);
    remove(KEYS.QUEUE_INDEX);
    return;
  }
  save(KEYS.QUEUE, queue);
  save(KEYS.QUEUE_INDEX, currentIndex);
  save(KEYS.REPEAT_MODE, repeatMode);
  save(KEYS.PLAYBACK_RATE, playbackRate);
};

export const loadSession = () => {
  const queue = load(KEYS.QUEUE, []);
  if (!queue.length) return null;
  return {
    queue,
    currentIndex: load(KEYS.QUEUE_INDEX, 0),
    repeatMode: load(KEYS.REPEAT_MODE, 'off'),
    playbackRate: load(KEYS.PLAYBACK_RATE, 1),
  };
};

// ── Preferences ──────────────────────────────────────────────

export const loadLanguage = () => load(KEYS.LANGUAGE, 'ar');
export const saveLanguage = (lang) => save(KEYS.LANGUAGE, lang);

export const loadTheme = () => load(KEYS.THEME, null);
export const saveTheme = (theme) => save(KEYS.THEME, theme); // 'dark' | 'light'

// ── Sleep Timer ──────────────────────────────────────────────

export const saveSleepEndTime = (timestamp) => save(KEYS.SLEEP_END_TIME, timestamp);
export const loadSleepEndTime = () => load(KEYS.SLEEP_END_TIME, null);
export const clearSleepEndTime = () => remove(KEYS.SLEEP_END_TIME);
