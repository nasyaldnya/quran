// ============================================================
// api.js — All mp3quran.net API calls with retry + abort logic
// ============================================================

const BASE = 'https://mp3quran.net/api/v3';

// ── Core Fetch with Retry ────────────────────────────────────

/**
 * Fetch with exponential backoff retry.
 * @param {string} url
 * @param {AbortSignal} signal
 * @param {number} retries
 * @returns {Promise<any>}
 */
async function fetchWithRetry(url, signal, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (err.name === 'AbortError') throw err; // Don't retry on abort
      if (attempt === retries - 1) throw err;   // Last attempt, throw
      const delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
      console.warn(`[api] Attempt ${attempt + 1} failed. Retrying in ${delay}ms…`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

/**
 * Core fetch wrapper — returns data or null on failure.
 * @param {string} endpoint  - e.g. "reciters?language=ar"
 * @param {AbortSignal} [signal]
 */
export async function fetchData(endpoint, signal) {
  try {
    return await fetchWithRetry(`${BASE}/${endpoint}`, signal);
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(`[api] Failed: ${endpoint}`, err);
    }
    return null;
  }
}

// ── Named API Calls ──────────────────────────────────────────

/**
 * Fetch all supported languages
 */
export const getLanguages = (signal) =>
  fetchData('languages', signal);

/**
 * Fetch riwayat (recitation styles) in a given language
 */
export const getRiwayat = (lang = 'ar', signal) =>
  fetchData(`riwayat?language=${lang}`, signal);

/**
 * Fetch all surahs with metadata in a given language
 */
export const getSurahs = (lang = 'ar', signal) =>
  fetchData(`suwar?language=${lang}`, signal);

/**
 * Fetch reciters with optional filters
 * @param {{ lang, riwaya, surah }} options
 */
export const getReciters = ({ lang = 'ar', riwaya = '', surah = '' } = {}, signal) => {
  let endpoint = `reciters?language=${lang}`;
  if (riwaya) endpoint += `&rewaya=${riwaya}`;
  if (surah)  endpoint += `&sura=${surah}`;
  return fetchData(endpoint, signal);
};

/**
 * Load all initial data in parallel (single abort controller)
 * @param {string} lang
 * @param {AbortSignal} signal
 * @returns {{ languages, riwayat, surahs, reciters }}
 */
export async function loadInitialData(lang = 'ar', signal) {
  const [languages, riwayat, surahs, recitersData] = await Promise.all([
    getLanguages(signal),
    getRiwayat(lang, signal),
    getSurahs(lang, signal),
    getReciters({ lang }, signal),
  ]);

  return {
    languages:  languages?.languages  ?? [],
    riwayat:    riwayat?.riwayat      ?? [],
    surahs:     surahs?.suwar         ?? [],
    reciters:   recitersData?.reciters ?? [],
  };
}
