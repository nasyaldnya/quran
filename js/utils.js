// ============================================================
// utils.js — Pure helpers. Zero side effects. No DOM access.
// ============================================================

// ── String Helpers ──────────────────────────────────────────

/** Zero-pad surah number to 3 digits: 1 → "001" */
export const padSurahNumber = (n) => String(n).padStart(3, '0');

/** Ensure URL ends with a slash */
export const withSlash = (url) => url.endsWith('/') ? url : `${url}/`;

/** Build audio URL from moshaf server + surah id */
export const buildAudioUrl = (moshaf, surah) =>
  `${withSlash(moshaf.server)}${padSurahNumber(surah.id)}.mp3`;

/** Format seconds → "mm:ss" */
export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/** Format seconds → human readable "٣٠ دقيقة" / "30 min" */
export const formatDuration = (seconds, lang = 'ar') => {
  if (!seconds || isNaN(seconds)) return '';
  const m = Math.round(seconds / 60);
  return lang === 'ar' ? `${m} دقيقة` : `${m} min`;
};

// ── Arabic Text Helpers ─────────────────────────────────────

/**
 * Normalize Arabic text for fuzzy search:
 * unify alef forms, taa marbuta, alef maqsura, diacritics
 */
export const normalizeArabic = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, '')  // Strip diacritics (tashkeel)
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\u0600-\u06FF\s\da-z]/g, '');
};

/** Arabic-aware string comparator for sorting */
export const arabicCollator = new Intl.Collator('ar', {
  sensitivity: 'base',
  numeric: true,
});

// ── Array / Object Helpers ──────────────────────────────────

/** Deduplicate array by a key function */
export const uniqueBy = (arr, keyFn) => {
  const seen = new Set();
  return arr.filter((item) => {
    const k = keyFn(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

/** Shuffle array (Fisher-Yates) — returns new array */
export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Clamp a number between min and max */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// ── Function Helpers ────────────────────────────────────────

/** Debounce: delay fn execution until after `ms` of inactivity */
export const debounce = (fn, ms = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

/** Throttle: call fn at most once per `ms` */
export const throttle = (fn, ms = 100) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
};

// ── URL / Routing Helpers ───────────────────────────────────

/** Parse current URL search params into a plain object */
export const getUrlParams = () =>
  Object.fromEntries(new URLSearchParams(location.search));

/** Update URL without reloading (replaceState) */
export const setUrlParams = (params) => {
  try {
    const search = new URLSearchParams(params).toString();
    const path = location.pathname.includes('blob:') ? '' : location.pathname;
    history.replaceState(null, '', search ? `${path}?${search}` : path);
  } catch {
    // Silently fail in restricted environments
  }
};

/** Generate a unique bookmark key */
export const bookmarkKey = (reciterId, moshafId, surahId) =>
  `${reciterId}-${moshafId}-${surahId}`;

// ── DOM Helpers ─────────────────────────────────────────────

/** Create element with optional className and textContent */
export const el = (tag, className = '', text = '') => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

/** Get element by ID (throws if not found in dev) */
export const $ = (id) => {
  const node = document.getElementById(id);
  if (!node) console.warn(`[DOM] Element #${id} not found`);
  return node;
};

/** Get all elements matching selector */
export const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

// ── Icons (inline SVG strings) ──────────────────────────────

// All SVGs include class="w-full h-full" so they fill whatever wrapper they're placed in
export const Icons = {
  play:         `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  pause:        `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`,
  next:         `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/></svg>`,
  prev:         `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>`,
  shuffle:      `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17zm4.76-.18 3.65 3.65-3.65 3.65V14h-.34c-.96 0-1.86-.48-2.56-1.24l-1.4-1.57-1.42 1.42 1.37 1.53C11.68 15.38 13.09 16 14.65 16H16v2l4-4-4-4v2h-.65zm-4.76 7.01L8.08 17.6 9.5 19l5.17-5.17-1.41-1.42z"/></svg>`,
  repeat:       `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>`,
  repeatOne:    `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/></svg>`,
  heart:        `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
  heartOutline: `<svg class="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  queue:        `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/></svg>`,
  download:     `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z"/></svg>`,
  share:        `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>`,
  moon:         `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`,
  sun:          `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79zm-1.98 6.16H2v2h2.78zm14.44 0H22v2h-2.78zm-1.98-4.34 1.79-1.79-1.41-1.41-1.79 1.79zM17.24 18.16l1.79 1.8 1.41-1.41-1.8-1.79zM20 11c0-4.42-3.58-8-8-8s-8 3.58-8 8 3.58 8 8 8 8-3.58 8-8zm-8 6c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9.93V2h2v5.07A4.994 4.994 0 0 0 12 7c-.34 0-.67.03-1 .07zM4.69 17.1l-1.41 1.41 1.8 1.79 1.41-1.41zm14.62 1.41-1.41-1.41-1.79 1.8 1.41 1.41z"/></svg>`,
  close:        `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
  check:        `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
  makkah:       '🕋',
  madinah:      '🕌',
  playing:      `<svg class="w-full h-full animate-pulse" viewBox="0 0 24 24" fill="currentColor"><path d="M6 7H4v10h2V7zm4-3H8v16h2V4zm4 6h-2v4h2v-4zm4-3h-2v10h2V7z"/></svg>`,
  bookmark:     `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>`,
  bookmarkOutline: `<svg class="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  clock:        `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>`,
  history:      `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>`,
  search:       `<svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="m15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
};
