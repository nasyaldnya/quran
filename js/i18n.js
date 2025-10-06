// قاموس يحتوي على ترجمات واجهة المستخدم
const translations = {
  // اللغة العربية
  ar: {
    mainTitle: "مكتبة القرآن الكريم الصوتية",
    mainSubtitle: "استمع إلى القرآن الكريم بأصوات نخبة من القراء من جميع أنحاء العالم",
    themeToggle: "تبديل الوضع",
    themeNight: "الوضع الليلي",
    themeLight: "الوضع الفاتح",
    selectLanguageLabel: "اختر اللغة:",
    selectRiwayaLabel: "اختر الرواية:",
    selectSurahLabel: "ابحث بالقراء الذين قرأوا سورة:",
    allRiwayat: "كل الروايات",
    allSurahs: "كل السور",
    recitersListTitle: "قائمة القراء",
    searchReciterPlaceholder: "ابحث عن قارئ...",
    availableRecitationsTitle: "التلاوات المتاحة",
    detailsPlaceholder: "الرجاء اختيار قارئ من القائمة لعرض تلاواته",
    noReciterFound: "لم يتم العثور على قراء.",
    queueTitle: "قائمة التشغيل",
    queuePlaceholder: "قائمة التشغيل فارغة.",
    nowPlayingDefault: "لم يتم تحديد أي مقطع",
    sleepTimer: "مؤقت النوم:",
    cancelSleepTimer: "إلغاء",
    playbackSpeed: "السرعة:",
    repeat: "تكرار",
    shuffle: "عشوائي",
    eq: "معادل الصوت"
  },
  // English Language
  en: {
    mainTitle: "Quran Audio Library",
    mainSubtitle: "Listen to the Holy Quran by elite reciters from around the world",
    themeToggle: "Toggle Mode",
    themeNight: "Night Mode",
    themeLight: "Light Mode",
    selectLanguageLabel: "Select Language:",
    selectRiwayaLabel: "Select Riwaya:",
    selectSurahLabel: "Find reciters who recited Surah:",
    allRiwayat: "All Riwayat",
    allSurahs: "All Surahs",
    recitersListTitle: "Reciters List",
    searchReciterPlaceholder: "Search for a reciter...",
    availableRecitationsTitle: "Available Recitations",
    detailsPlaceholder: "Please select a reciter from the list to view their recitations",
    noReciterFound: "No reciters found.",
    queueTitle: "Playlist",
    queuePlaceholder: "The playlist is empty.",
    nowPlayingDefault: "No track selected",
    sleepTimer: "Sleep Timer:",
    cancelSleepTimer: "Cancel",
    playbackSpeed: "Speed:",
    repeat: "Repeat",
    shuffle: "Shuffle",
    eq: "Equalizer"
  }
};

let currentLanguage = 'ar';

// دالة لتطبيق الترجمات على واجهة المستخدم
const translateUI = () => {
  const elements = document.querySelectorAll('[data-i18n-key]');
  const langTranslations = translations[currentLanguage];

  if (!langTranslations) return;

  elements.forEach(el => {
    const key = el.dataset.i18nKey;
    const translation = langTranslations[key];
    if (translation) {
      if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.placeholder) {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    }
  });

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
};

// دالة لضبط اللغة الحالية
export const setLanguage = (lang) => {
  currentLanguage = lang || 'ar';
  localStorage.setItem('quranLang', currentLanguage);
  translateUI();
};

// دالة للبدء: تقرأ اللغة المحفوظة وتطبقها
export const initI18n = () => {
  const savedLang = localStorage.getItem('quranLang') || 'ar';
  setLanguage(savedLang);
};