// ============================================================
// i18n.js — AR/EN translations + RTL/LTR switching
// ============================================================

import { saveLanguage } from './storage.js';

// ── Translation Dictionary ───────────────────────────────────

const translations = {
  ar: {
    // App
    appName:          'مكتبة القرآن الكريم الصوتية',
    appTagline:       'استمع إلى كلام الله بأصوات نخبة من القراء',

    // Navigation / Filters
    language:         'اللغة',
    riwaya:           'الرواية',
    surah:            'السورة',
    allRiwayat:       'جميع الروايات',
    allSurahs:        'جميع السور',
    searchPlaceholder:'ابحث عن قارئ…',

    // Reciters
    reciters:         'القراء',
    noReciters:       'لم يُعثر على قراء بهذه الفلاتر',
    favorites:        'المفضلة',
    recentlyPlayed:   'تم تشغيله مؤخرًا',

    // Surah list
    surahList:        'قائمة السور',
    makki:            'مكية',
    madani:           'مدنية',
    playAll:          'تشغيل الكل',
    addAll:           'إضافة الكل للقائمة',

    // Player
    nowPlaying:       'يُشغَّل الآن',
    queue:            'قائمة التشغيل',
    emptyQueue:       'قائمة التشغيل فارغة',
    addToQueue:       'إضافة للقائمة',
    removeFromQueue:  'إزالة من القائمة',
    playNow:          'تشغيل الآن',

    // Controls
    play:             'تشغيل',
    pause:            'إيقاف مؤقت',
    next:             'التالي',
    previous:         'السابق',
    shuffle:          'تشغيل عشوائي',
    repeat:           'تكرار',
    repeatOne:        'تكرار السورة',
    repeatAll:        'تكرار القائمة',
    speed:            'السرعة',

    // Sleep Timer
    sleepTimer:       'مؤقت النوم',
    setSleepTimer:    'ضبط مؤقت النوم',
    cancelTimer:      'إلغاء المؤقت',
    min15:            '١٥ دقيقة',
    min30:            '٣٠ دقيقة',
    min60:            'ساعة',
    min90:            'ساعة ونصف',
    customDuration:   'مدة مخصصة',
    timerActive:      'المؤقت نشط',

    // Bookmarks
    bookmark:         'إشارة مرجعية',
    bookmarkSaved:    'تم حفظ الإشارة المرجعية',
    bookmarkRemoved:  'تم إزالة الإشارة المرجعية',
    resumeFrom:       'استئناف من',

    // Actions
    copyLink:         'نسخ الرابط',
    linkCopied:       'تم نسخ الرابط',
    download:         'تحميل',
    share:            'مشاركة',
    addFavorite:      'إضافة للمفضلة',
    removeFavorite:   'إزالة من المفضلة',

    // Theme
    themeLight:       'الوضع النهاري',
    themeDark:        'الوضع الليلي',

    // Errors / Status
    errorLoad:        'فشل تحميل البيانات. تحقق من اتصالك بالإنترنت.',
    errorReciters:    'فشل تحميل قائمة القراء.',
    errorAudio:       'تعذر تحميل المقطع. يتم الانتقال للتالي.',
    loading:          'جارٍ التحميل…',

    // Keyboard shortcuts
    shortcuts:        'اختصارات لوحة المفاتيح',
    shortcutPlay:     'تشغيل / إيقاف',
    shortcutNext:     'التالي',
    shortcutPrev:     'السابق',
    shortcutVolUp:    'رفع الصوت',
    shortcutVolDown:  'خفض الصوت',
    shortcutFav:      'مفضلة القارئ الحالي',
    shortcutSleep:    'مؤقت النوم',
    shortcutHelp:     'عرض الاختصارات',
    close:            'إغلاق',
  },

  en: {
    // App
    appName:          'Quran Audio Library',
    appTagline:       'Listen to the word of Allah by the finest reciters',

    // Navigation / Filters
    language:         'Language',
    riwaya:           'Riwaya',
    surah:            'Surah',
    allRiwayat:       'All Riwayat',
    allSurahs:        'All Surahs',
    searchPlaceholder:'Search for a reciter…',

    // Reciters
    reciters:         'Reciters',
    noReciters:       'No reciters found for these filters',
    favorites:        'Favorites',
    recentlyPlayed:   'Recently Played',

    // Surah list
    surahList:        'Surah List',
    makki:            'Makki',
    madani:           'Madani',
    playAll:          'Play All',
    addAll:           'Add All to Queue',

    // Player
    nowPlaying:       'Now Playing',
    queue:            'Queue',
    emptyQueue:       'Queue is empty',
    addToQueue:       'Add to Queue',
    removeFromQueue:  'Remove from Queue',
    playNow:          'Play Now',

    // Controls
    play:             'Play',
    pause:            'Pause',
    next:             'Next',
    previous:         'Previous',
    shuffle:          'Shuffle',
    repeat:           'Repeat',
    repeatOne:        'Repeat Surah',
    repeatAll:        'Repeat Queue',
    speed:            'Speed',

    // Sleep Timer
    sleepTimer:       'Sleep Timer',
    setSleepTimer:    'Set Sleep Timer',
    cancelTimer:      'Cancel Timer',
    min15:            '15 minutes',
    min30:            '30 minutes',
    min60:            '1 hour',
    min90:            '1.5 hours',
    customDuration:   'Custom duration',
    timerActive:      'Timer active',

    // Bookmarks
    bookmark:         'Bookmark',
    bookmarkSaved:    'Bookmark saved',
    bookmarkRemoved:  'Bookmark removed',
    resumeFrom:       'Resume from',

    // Actions
    copyLink:         'Copy Link',
    linkCopied:       'Link copied!',
    download:         'Download',
    share:            'Share',
    addFavorite:      'Add to Favorites',
    removeFavorite:   'Remove from Favorites',

    // Theme
    themeLight:       'Light Mode',
    themeDark:        'Dark Mode',

    // Errors / Status
    errorLoad:        'Failed to load data. Check your internet connection.',
    errorReciters:    'Failed to load reciters.',
    errorAudio:       'Could not load track. Skipping to next.',
    loading:          'Loading…',

    // Keyboard shortcuts
    shortcuts:        'Keyboard Shortcuts',
    shortcutPlay:     'Play / Pause',
    shortcutNext:     'Next track',
    shortcutPrev:     'Previous track',
    shortcutVolUp:    'Volume up',
    shortcutVolDown:  'Volume down',
    shortcutFav:      'Favorite current reciter',
    shortcutSleep:    'Sleep timer',
    shortcutHelp:     'Show shortcuts',
    close:            'Close',
  },
};

// ── Active Language State ────────────────────────────────────

let currentLang = 'ar';

export const getLang = () => currentLang;

export const t = (key) =>
  translations[currentLang]?.[key] ??
  translations['ar']?.[key] ??
  key;

// ── Language Switching ───────────────────────────────────────

/**
 * Set UI language and update document direction + lang attribute.
 * @param {'ar'|'en'} lang
 */
export function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  saveLanguage(lang);
  applyDocumentDirection(lang);
  translateDOM();
}

function applyDocumentDirection(lang) {
  const isRtl = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir  = isRtl ? 'rtl' : 'ltr';
}

/**
 * Translate all elements with [data-i18n] attribute.
 * Supports:
 *   data-i18n="key"              → sets textContent
 *   data-i18n-placeholder="key" → sets placeholder
 *   data-i18n-aria="key"        → sets aria-label
 */
export function translateDOM() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (key) el.setAttribute('aria-label', t(key));
  });
}

/**
 * Initialize i18n from stored preference.
 * Call once on DOMContentLoaded.
 */
export function initI18n(savedLang) {
  currentLang = savedLang || 'ar';
  applyDocumentDirection(currentLang);
  // DOM translation happens after renderUI populates elements
}
