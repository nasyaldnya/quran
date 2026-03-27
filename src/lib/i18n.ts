import { useLanguageStore } from '@/store/languageStore'

// ── Translation keys ─────────────────────────────────
// Every UI string is keyed here. Add new keys as needed.

export interface Translations {
  // Nav
  nav_home: string
  nav_reciters: string
  nav_surahs: string
  nav_favorites: string
  nav_history: string
  nav_search: string
  nav_playlists: string
  nav_compare: string
  nav_stats: string

  // Hero
  hero_badge: string
  hero_title: string
  hero_subtitle: string
  hero_browse_reciters: string
  hero_view_surahs: string
  stat_surahs: string
  stat_verses: string
  stat_reciters: string

  // Featured
  featured_label: string
  featured_title: string
  view_all: string

  // Quran banner
  banner_translation: string
  banner_ref: string

  // Reciters page
  reciters_title: string
  reciters_subtitle: string
  search_reciters: string
  reciters_found: string
  riwaya: string
  riwayat: string
  surah: string
  surahs_word: string
  surahs_available: string
  failed_load_reciters: string
  no_reciters_found: string

  // Surahs page
  surahs_title: string
  surahs_subtitle: string
  search_surahs: string
  verses: string

  // Reciter detail
  play_all: string
  pause_all: string
  search_surahs_dots: string

  // Favorites
  favorites_title: string
  favorites_empty: string
  no_fav_reciters: string
  no_fav_reciters_desc: string
  no_fav_surahs: string
  no_fav_surahs_desc: string
  clear_all: string
  added: string
  browse_reciters: string
  browse_surahs: string
  saved_items: string

  // History
  history_title: string
  history_empty: string
  history_empty_desc: string
  clear_history: string
  recently_played: string
  today: string
  yesterday: string
  just_now: string

  // Audio player
  sleep_timer: string
  end_of_surah: string
  cancel_timer: string
  pausing_in: string
  pausing_after_surah: string

  // Quran text panel
  quran_text: string
  translation: string
  tafsir: string
  no_surah_playing: string
  no_surah_playing_desc: string
  failed_to_load: string
  failed_to_load_desc: string
  ayahs: string
  loading_translation: string
  loading_tafsir: string

  // Footer
  footer_credit: string
  footer_love: string

  // General
  all: string
  off: string
  remove_favorite: string
  add_favorite: string

  // Batch A — Keyboard shortcuts
  shortcuts_hint: string

  // Batch A — Daily Ayah
  daily_ayah: string
  daily_ayah_subtitle: string
  read_more: string

  // Batch A — Font size
  font_size_decrease: string
  font_size_increase: string

  // Batch A — Playback speed
  playback_speed: string
  speed_normal: string

  // Batch B — Nav additions
  nav_juz: string
  nav_bookmarks: string

  // Batch B — Bookmarks
  bookmarks_title: string
  bookmarks_empty: string
  bookmarks_empty_desc: string
  bookmarks_saved: string
  remove_bookmark: string

  // Batch B — Juz navigation
  juz_navigation: string
  juz_title: string
  juz_subtitle: string
  juz_label: string

  // Batch B — Reading progress
  progress_title: string
  progress_listened: string
  progress_read: string
  progress_reset: string

  // Batch C — Search
  search_quran: string
  search_title: string
  search_subtitle: string
  search_placeholder: string
  search_no_results: string
  search_try_again: string
  search_results_found: string

  // Batch C — Playlists
  playlists_label: string
  playlists_title: string
  playlists_subtitle: string
  playlists_empty: string
  playlists_empty_desc: string
  playlist_new_placeholder: string
  playlist_create: string

  // Batch C — Reciter comparison
  compare_label: string
  compare_title: string
  compare_subtitle: string
  compare_select_surah: string
  compare_reciter: string
  compare_choose: string

  // Batch D — Analytics
  stats_label: string
  stats_title: string
  stats_subtitle: string
  stats_total_time: string
  stats_surahs_played: string
  stats_streak: string
  stats_weekly: string
  stats_most_played: string

  // Batch D — Notifications
  reminder_title: string
  reminder_enable: string
  reminder_disable: string
  reminder_time: string

  // New — Queue
  queue_title: string

  // New — Repeat Range
  repeat_range: string
  repeat_ab_loop: string
  repeat_looping: string
  repeat_count: string

  // New — Recitation Styles
  style_murattal: string
  style_murattal_desc: string
  style_mujawwad: string
  style_mujawwad_desc: string
  style_muallim: string
  style_muallim_desc: string
  style_filter: string
  style_all: string

  // New — Similar Reciters
  similar_reciters: string

  // New — Reading features
  tajweed_mode: string
  mushaf_mode: string
  memorization_mode: string
  hide_level: string
  show_all: string
  mark_memorized: string
  memorized: string
  page_label: string
  word_meaning: string

  // New — Repeat Ayah
  repeat_ayah: string
  repeat_single: string
  repeat_ayah_num: string
  repeat_from: string
  repeat_to: string
  repeat_times: string
  repeat_stop: string

  // New — Word-by-Word
  loading_word_by_word: string
  word_by_word_title: string

  // New — Tajweed
  tajweed_title: string
  tajweed_toggle: string

  // New — Mushaf
  mushaf_page: string
  mushaf_next_page: string
  mushaf_prev_page: string
  nav_mushaf: string

  // New — Memorization
  memorization_title: string
  memorization_level: string

  // New — Recitation style labels
  style_murattal_label: string
  style_mujawwad_label: string
  style_muallim_label: string

  // Toggle button labels
  word_by_word: string
  tajweed: string
  memorization: string
}

// ── Translations per locale ──────────────────────────

const translations: Record<string, Translations> = {
  ar: {
    nav_home: 'الرئيسية',
    nav_reciters: 'القراء',
    nav_surahs: 'السور',
    nav_favorites: 'المفضلة',
    nav_history: 'السجل',
    nav_search: 'بحث',
    nav_playlists: 'قوائم التشغيل',
    nav_compare: 'مقارنة',
    nav_stats: 'الإحصائيات',
    hero_badge: 'مدعوم من Mp3Quran · أكثر من 100 قارئ عالمي',
    hero_title: 'القرآن الكريم',
    hero_subtitle: 'استمع إلى كلام الله بأصوات أشهر القراء في العالم. رحلة استماع مميزة عبر 114 سورة.',
    hero_browse_reciters: 'تصفح القراء',
    hero_view_surahs: 'عرض السور',
    stat_surahs: 'سور',
    stat_verses: 'آيات',
    stat_reciters: 'قراء',
    featured_label: 'قراء مميزون',
    featured_title: 'أصوات بارزة في تلاوة القرآن',
    view_all: 'عرض الكل',
    banner_translation: '"إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ"',
    banner_ref: 'سورة الحجر ١٥:٩',
    reciters_title: 'جميع القراء',
    reciters_subtitle: 'اكتشف أشهر قراء القرآن الكريم وأساليب تلاوتهم المتعددة.',
    search_reciters: 'ابحث عن قارئ...',
    reciters_found: 'قارئ',
    riwaya: 'رواية',
    riwayat: 'روايات',
    surah: 'سورة',
    surahs_word: 'سور',
    surahs_available: 'سورة متاحة',
    failed_load_reciters: 'فشل تحميل القراء',
    no_reciters_found: 'لم يتم العثور على قراء',
    surahs_title: 'جميع السور',
    surahs_subtitle: 'تصفح جميع سور القرآن الكريم الـ 114.',
    search_surahs: 'ابحث عن سورة...',
    verses: 'آيات',
    play_all: 'تشغيل الكل',
    pause_all: 'إيقاف الكل',
    search_surahs_dots: 'ابحث في السور…',
    favorites_title: 'المفضلة',
    favorites_empty: 'لا توجد مفضلات بعد — ابدأ بإضافة بعضها!',
    no_fav_reciters: 'لا يوجد قراء مفضلون',
    no_fav_reciters_desc: 'اضغط على أيقونة القلب على أي قارئ لحفظه هنا.',
    no_fav_surahs: 'لا توجد سور مفضلة',
    no_fav_surahs_desc: 'اضغط على أيقونة القلب على أي سورة لحفظها هنا.',
    clear_all: 'مسح الكل',
    added: 'أُضيف',
    browse_reciters: 'تصفح القراء',
    browse_surahs: 'تصفح السور',
    saved_items: 'عنصر محفوظ',
    history_title: 'سجل الاستماع',
    history_empty: 'لم يتم تشغيل أي شيء بعد',
    history_empty_desc: 'ستظهر السور التي استمعت إليها مؤخراً هنا.',
    clear_history: 'مسح السجل',
    recently_played: 'تم تشغيلها مؤخراً',
    today: 'اليوم',
    yesterday: 'أمس',
    just_now: 'الآن',
    sleep_timer: 'مؤقت النوم',
    end_of_surah: 'نهاية السورة',
    cancel_timer: 'إلغاء المؤقت',
    pausing_in: 'إيقاف مؤقت خلال',
    pausing_after_surah: 'إيقاف مؤقت بعد انتهاء هذه السورة',
    quran_text: 'نص القرآن',
    translation: 'ترجمة',
    tafsir: 'تفسير',
    no_surah_playing: 'لا توجد سورة قيد التشغيل',
    no_surah_playing_desc: 'ابدأ تشغيل سورة لعرض نصها هنا.',
    failed_to_load: 'فشل التحميل',
    failed_to_load_desc: 'تعذر جلب نص السورة. يرجى التحقق من الاتصال.',
    ayahs: 'آيات',
    loading_translation: 'جارٍ تحميل الترجمة',
    loading_tafsir: 'جارٍ تحميل التفسير',
    footer_credit: 'الصوتيات من',
    footer_love: 'صُنع بحب للقرآن الكريم',
    all: 'الكل',
    off: 'إيقاف',
    remove_favorite: 'إزالة من المفضلة',
    add_favorite: 'إضافة إلى المفضلة',
    shortcuts_hint: 'مسافة: تشغيل/إيقاف · ←→: التالي/السابق · ↑↓: الصوت · M: كتم · T: النص',
    daily_ayah: 'آية اليوم',
    daily_ayah_subtitle: 'تأمل يومي من القرآن الكريم',
    read_more: 'اقرأ المزيد',
    font_size_decrease: 'تصغير الخط',
    font_size_increase: 'تكبير الخط',
    playback_speed: 'سرعة التشغيل',
    speed_normal: 'عادي',
    nav_juz: 'الأجزاء',
    nav_bookmarks: 'الإشارات المرجعية',
    bookmarks_title: 'الآيات المحفوظة',
    bookmarks_empty: 'لا توجد إشارات مرجعية بعد',
    bookmarks_empty_desc: 'اضغط على أيقونة الإشارة المرجعية على أي آية لحفظها.',
    bookmarks_saved: 'آيات محفوظة',
    remove_bookmark: 'إزالة الإشارة المرجعية',
    juz_navigation: 'تصفح الأجزاء',
    juz_title: 'تصفح بالجزء',
    juz_subtitle: 'القرآن الكريم مقسم إلى 30 جزءاً لتسهيل القراءة.',
    juz_label: 'الجزء',
    progress_title: 'التقدم',
    progress_listened: 'تم الاستماع',
    progress_read: 'تمت القراءة',
    progress_reset: 'إعادة تعيين التقدم',
    search_quran: 'البحث في القرآن',
    search_title: 'البحث عن آيات',
    search_subtitle: 'ابحث عن كلمة أو عبارة في القرآن الكريم.',
    search_placeholder: 'اكتب للبحث...',
    search_no_results: 'لا توجد نتائج',
    search_try_again: 'جرّب كلمة مفتاحية مختلفة.',
    search_results_found: 'نتيجة',
    playlists_label: 'قوائم التشغيل',
    playlists_title: 'قوائم التشغيل',
    playlists_subtitle: 'أنشئ قوائم تشغيل مخصصة من السور المفضلة لديك.',
    playlists_empty: 'لا توجد قوائم تشغيل',
    playlists_empty_desc: 'أنشئ قائمة التشغيل الأولى للبدء.',
    playlist_new_placeholder: 'اسم القائمة...',
    playlist_create: 'إنشاء',
    compare_label: 'مقارنة',
    compare_title: 'مقارنة القراء',
    compare_subtitle: 'استمع إلى نفس السورة من قارئين مختلفين.',
    compare_select_surah: 'اختر السورة',
    compare_reciter: 'القارئ',
    compare_choose: 'اختر قارئاً...',
    stats_label: 'الإحصائيات',
    stats_title: 'إحصائياتي',
    stats_subtitle: 'تابع رحلتك في الاستماع للقرآن الكريم.',
    stats_total_time: 'إجمالي الاستماع',
    stats_surahs_played: 'السور المسموعة',
    stats_streak: 'أيام متتالية',
    stats_weekly: 'النشاط الأسبوعي',
    stats_most_played: 'الأكثر استماعاً',
    reminder_title: 'التذكير',
    reminder_enable: 'تفعيل التذكير اليومي',
    reminder_disable: 'تعطيل',
    reminder_time: 'وقت التذكير',
    nav_mushaf: 'المصحف',
    repeat_ayah: 'تكرار الآية',
    repeat_single: 'آية واحدة',
    repeat_ayah_num: 'رقم الآية',
    repeat_from: 'من',
    repeat_to: 'إلى',
    repeat_times: 'عدد المرات',
    repeat_stop: 'إيقاف التكرار',
    loading_word_by_word: 'جارٍ تحميل الكلمات...',
    word_by_word: 'كلمة بكلمة',
    tajweed_colors: 'ألوان التجويد',
    mushaf_page: 'صفحة المصحف',
    mushaf_next_page: 'الصفحة التالية',
    mushaf_prev_page: 'الصفحة السابقة',
    memorization_title: 'وضع الحفظ',
    memorization_level: 'المستوى',
    queue_title: 'قائمة الانتظار',
    repeat_ab_loop: 'تكرار مقطع',
    repeat_looping: 'جارٍ التكرار',
    repeat_count: 'عدد التكرار',
    style_murattal: 'مرتل',
    style_murattal_desc: 'تلاوة بطيئة للتعلم',
    style_mujawwad: 'مجود',
    style_mujawwad_desc: 'تلاوة ملحنة',
    style_muallim: 'معلم',
    style_muallim_desc: 'تلاوة تعليمية',
    style_filter: 'تصفية حسب الأسلوب',
    style_all: 'الكل',
    similar_reciters: 'قراء مشابهون',
    repeat_range: 'نطاق',
    style_murattal_label: 'مرتل',
    style_mujawwad_label: 'مجود',
    style_muallim_label: 'معلم',
    tajweed_title: 'أحكام التجويد',
    tajweed_toggle: 'تفعيل التجويد',
    word_by_word_title: 'كلمة بكلمة',
    tajweed: 'تجويد',
    memorization: 'حفظ',
    tajweed_mode: 'وضع التجويد',
    mushaf_mode: 'وضع المصحف',
    memorization_mode: 'وضع الحفظ',
    hide_level: 'مستوى الإخفاء',
    show_all: 'إظهار الكل',
    mark_memorized: 'تم الحفظ',
    memorized: 'محفوظ',
    page_label: 'الصفحة',
    word_meaning: 'معنى الكلمة',
  },

  eng: {
    nav_home: 'Home',
    nav_reciters: 'Reciters',
    nav_surahs: 'Surahs',
    nav_favorites: 'Favorites',
    nav_history: 'History',
    nav_search: 'Search',
    nav_playlists: 'Playlists',
    nav_compare: 'Compare',
    nav_stats: 'Stats',
    hero_badge: 'Powered by Mp3Quran · 100+ World-Renowned Reciters',
    hero_title: 'The Holy Quran',
    hero_subtitle: 'Experience the divine words in the voices of the world\'s finest reciters. A premium, immersive listening journey through all 114 Surahs.',
    hero_browse_reciters: 'Browse Reciters',
    hero_view_surahs: 'View All Surahs',
    stat_surahs: 'Surahs',
    stat_verses: 'Verses',
    stat_reciters: 'Reciters',
    featured_label: 'Featured Reciters',
    featured_title: 'Master Voices of the Quran',
    view_all: 'View All',
    banner_translation: '"Indeed, it is We who sent down the Quran, and indeed, We will be its guardian."',
    banner_ref: 'Surah Al-Hijr 15:9',
    reciters_title: 'All Reciters',
    reciters_subtitle: 'Discover world-renowned Quran reciters and their multiple recitation styles.',
    search_reciters: 'Search reciters by name…',
    reciters_found: 'reciters found',
    riwaya: 'Riwaya',
    riwayat: 'Riwayat',
    surah: 'Surah',
    surahs_word: 'Surahs',
    surahs_available: 'Surahs available',
    failed_load_reciters: 'Failed to load reciters',
    no_reciters_found: 'No reciters found',
    surahs_title: 'All Surahs',
    surahs_subtitle: 'Browse all 114 Surahs of the Holy Quran.',
    search_surahs: 'Search surahs…',
    verses: 'verses',
    play_all: 'Play All',
    pause_all: 'Pause All',
    search_surahs_dots: 'Search surahs…',
    favorites_title: 'My Favorites',
    favorites_empty: 'No favorites yet — start adding some!',
    no_fav_reciters: 'No favorite reciters',
    no_fav_reciters_desc: 'Tap the heart icon on any reciter to save them here.',
    no_fav_surahs: 'No favorite surahs',
    no_fav_surahs_desc: 'Tap the heart icon on any surah to save it here.',
    clear_all: 'Clear All',
    added: 'Added',
    browse_reciters: 'Browse Reciters',
    browse_surahs: 'Browse Surahs',
    saved_items: 'saved items',
    history_title: 'Listening History',
    history_empty: 'Nothing played yet',
    history_empty_desc: 'Your recently played surahs will appear here.',
    clear_history: 'Clear History',
    recently_played: 'recently played tracks',
    today: 'Today',
    yesterday: 'Yesterday',
    just_now: 'Just now',
    sleep_timer: 'Sleep Timer',
    end_of_surah: 'End of Surah',
    cancel_timer: 'Cancel Timer',
    pausing_in: 'Pausing in',
    pausing_after_surah: 'Pausing after this surah ends',
    quran_text: 'Quran Text',
    translation: 'Translation',
    tafsir: 'Tafsir',
    no_surah_playing: 'No surah playing',
    no_surah_playing_desc: 'Start playing a surah to see its text here.',
    failed_to_load: 'Failed to load',
    failed_to_load_desc: 'Could not fetch the surah text. Please check your connection.',
    ayahs: 'Ayahs',
    loading_translation: 'Loading translation',
    loading_tafsir: 'Loading tafsir',
    footer_credit: 'Audio provided by',
    footer_love: 'Built with love for the Holy Quran',
    all: 'All',
    off: 'Off',
    remove_favorite: 'Remove from favorites',
    add_favorite: 'Add to favorites',
    shortcuts_hint: 'Space: play/pause · ←→: prev/next · ↑↓: volume · M: mute · T: text panel',
    daily_ayah: 'Ayah of the Day',
    daily_ayah_subtitle: 'Daily reflection from the Holy Quran',
    read_more: 'Read more',
    font_size_decrease: 'Decrease font size',
    font_size_increase: 'Increase font size',
    playback_speed: 'Playback Speed',
    speed_normal: 'Normal',
    nav_juz: 'Juz',
    nav_bookmarks: 'Bookmarks',
    bookmarks_title: 'Bookmarked Ayahs',
    bookmarks_empty: 'No bookmarks yet',
    bookmarks_empty_desc: 'Tap the bookmark icon on any ayah to save it here.',
    bookmarks_saved: 'ayahs bookmarked',
    remove_bookmark: 'Remove bookmark',
    juz_navigation: 'Juz Navigation',
    juz_title: 'Browse by Juz',
    juz_subtitle: 'The Quran is divided into 30 Juz for structured reading.',
    juz_label: 'Juz',
    progress_title: 'Progress',
    progress_listened: 'Listened',
    progress_read: 'Read',
    progress_reset: 'Reset progress',
    search_quran: 'Search Quran',
    search_title: 'Search Ayahs',
    search_subtitle: 'Search for words or phrases across the entire Holy Quran.',
    search_placeholder: 'Type to search...',
    search_no_results: 'No results found',
    search_try_again: 'Try a different keyword.',
    search_results_found: 'results found',
    playlists_label: 'Playlists',
    playlists_title: 'My Playlists',
    playlists_subtitle: 'Create custom playlists from your favorite surahs.',
    playlists_empty: 'No playlists yet',
    playlists_empty_desc: 'Create your first playlist to get started.',
    playlist_new_placeholder: 'Playlist name...',
    playlist_create: 'Create',
    compare_label: 'Compare',
    compare_title: 'Compare Reciters',
    compare_subtitle: 'Listen to the same surah from two different reciters side by side.',
    compare_select_surah: 'Select Surah',
    compare_reciter: 'Reciter',
    compare_choose: 'Choose a reciter...',
    stats_label: 'Statistics',
    stats_title: 'My Statistics',
    stats_subtitle: 'Track your Quran listening journey.',
    stats_total_time: 'Total listening',
    stats_surahs_played: 'Surahs played',
    stats_streak: 'Day streak',
    stats_weekly: 'Weekly activity',
    stats_most_played: 'Most played',
    reminder_title: 'Reminder',
    reminder_enable: 'Enable daily reminder',
    reminder_disable: 'Disable',
    reminder_time: 'Reminder time',
    nav_mushaf: "Mushaf",
    repeat_ayah: "Repeat Ayah",
    repeat_single: "Single Ayah",
    repeat_ayah_num: "Ayah Number",
    repeat_from: "From",
    repeat_to: "To",
    repeat_times: "Repeat Count",
    repeat_stop: "Stop Repeat",
    loading_word_by_word: "Loading word meanings...",
    word_by_word: "Word by Word",
    tajweed_colors: "Tajweed Colors",
    mushaf_page: "Page",
    mushaf_next_page: "Next Page",
    mushaf_prev_page: "Previous Page",
    memorization_title: "Memorization Mode",
    memorization_level: "Level",
    queue_title: "Up Next",
    repeat_ab_loop: "A-B Loop",
    repeat_looping: "Looping",
    repeat_count: "Times",
    style_murattal: "Murattal",
    style_murattal_desc: "Steady pace for daily reading",
    style_mujawwad: "Mujawwad",
    style_mujawwad_desc: "Melodic recitation style",
    style_muallim: "Muallim",
    style_muallim_desc: "Teaching style with pauses",
    style_filter: "Filter by Style",
    style_all: "All Styles",
    similar_reciters: "Similar Reciters",
    repeat_range: 'Range',
    style_murattal_label: 'Murattal',
    style_mujawwad_label: 'Mujawwad',
    style_muallim_label: 'Muallim',
    tajweed_title: 'Tajweed Rules',
    tajweed_toggle: 'Toggle Tajweed',
    word_by_word_title: 'Word by Word',
    tajweed: 'Tajweed',
    memorization: 'Memorization',
    tajweed_mode: "Tajweed Mode",
    mushaf_mode: "Mushaf Mode",
    memorization_mode: "Memorization Mode",
    hide_level: "Hide Level",
    show_all: "Show All",
    mark_memorized: "Mark Memorized",
    memorized: "Memorized",
    page_label: "Page",
    word_meaning: "Word Meaning",
  },

  fr: {
    nav_home: 'Accueil',
    nav_reciters: 'Récitants',
    nav_surahs: 'Sourates',
    nav_favorites: 'Favoris',
    nav_history: 'Historique',
    nav_search: 'Recherche',
    nav_playlists: 'Listes',
    nav_compare: 'Comparer',
    nav_stats: 'Statistiques',
    hero_badge: 'Propulsé par Mp3Quran · Plus de 100 récitants renommés',
    hero_title: 'Le Saint Coran',
    hero_subtitle: 'Écoutez les paroles divines par les voix des meilleurs récitants du monde. Un voyage d\'écoute à travers les 114 sourates.',
    hero_browse_reciters: 'Parcourir les récitants',
    hero_view_surahs: 'Voir les sourates',
    stat_surahs: 'Sourates',
    stat_verses: 'Versets',
    stat_reciters: 'Récitants',
    featured_label: 'Récitants en vedette',
    featured_title: 'Voix magistrales du Coran',
    view_all: 'Voir tout',
    banner_translation: '"C\'est Nous qui avons fait descendre le Rappel et c\'est Nous qui en sommes les gardiens."',
    banner_ref: 'Sourate Al-Hijr 15:9',
    reciters_title: 'Tous les récitants',
    reciters_subtitle: 'Découvrez les récitants du Coran et leurs styles de récitation.',
    search_reciters: 'Rechercher un récitant…',
    reciters_found: 'récitants trouvés',
    riwaya: 'Riwaya',
    riwayat: 'Riwayat',
    surah: 'Sourate',
    surahs_word: 'Sourates',
    surahs_available: 'sourates disponibles',
    failed_load_reciters: 'Échec du chargement des récitants',
    no_reciters_found: 'Aucun récitant trouvé',
    surahs_title: 'Toutes les sourates',
    surahs_subtitle: 'Parcourez les 114 sourates du Saint Coran.',
    search_surahs: 'Rechercher une sourate…',
    verses: 'versets',
    play_all: 'Tout lire',
    pause_all: 'Tout mettre en pause',
    search_surahs_dots: 'Rechercher des sourates…',
    favorites_title: 'Mes favoris',
    favorites_empty: 'Pas encore de favoris — commencez à en ajouter !',
    no_fav_reciters: 'Pas de récitants favoris',
    no_fav_reciters_desc: 'Appuyez sur le cœur sur un récitant pour le sauvegarder ici.',
    no_fav_surahs: 'Pas de sourates favorites',
    no_fav_surahs_desc: 'Appuyez sur le cœur sur une sourate pour la sauvegarder ici.',
    clear_all: 'Tout effacer',
    added: 'Ajouté',
    browse_reciters: 'Parcourir les récitants',
    browse_surahs: 'Parcourir les sourates',
    saved_items: 'éléments sauvegardés',
    history_title: 'Historique d\'écoute',
    history_empty: 'Rien n\'a été lu encore',
    history_empty_desc: 'Vos sourates récemment lues apparaîtront ici.',
    clear_history: 'Effacer l\'historique',
    recently_played: 'pistes récemment lues',
    today: 'Aujourd\'hui',
    yesterday: 'Hier',
    just_now: 'À l\'instant',
    sleep_timer: 'Minuterie de sommeil',
    end_of_surah: 'Fin de la sourate',
    cancel_timer: 'Annuler la minuterie',
    pausing_in: 'Pause dans',
    pausing_after_surah: 'Pause après la fin de cette sourate',
    quran_text: 'Texte du Coran',
    translation: 'Traduction',
    tafsir: 'Tafsir',
    no_surah_playing: 'Aucune sourate en lecture',
    no_surah_playing_desc: 'Lancez une sourate pour voir son texte ici.',
    failed_to_load: 'Échec du chargement',
    failed_to_load_desc: 'Impossible de récupérer le texte. Vérifiez votre connexion.',
    ayahs: 'Versets',
    loading_translation: 'Chargement de la traduction',
    loading_tafsir: 'Chargement du tafsir',
    footer_credit: 'Audio fourni par',
    footer_love: 'Fait avec amour pour le Saint Coran',
    all: 'Tous',
    off: 'Désactivé',
    remove_favorite: 'Retirer des favoris',
    add_favorite: 'Ajouter aux favoris',
    shortcuts_hint: 'Espace: lecture/pause · ←→: précédent/suivant · ↑↓: volume · M: muet · T: texte',
    daily_ayah: 'Verset du jour',
    daily_ayah_subtitle: 'Réflexion quotidienne du Saint Coran',
    read_more: 'Lire la suite',
    font_size_decrease: 'Réduire la police',
    font_size_increase: 'Agrandir la police',
    playback_speed: 'Vitesse',
    speed_normal: 'Normale',
    nav_juz: 'Juz',
    nav_bookmarks: 'Signets',
    bookmarks_title: 'Versets marqués',
    bookmarks_empty: 'Aucun signet pour le moment',
    bookmarks_empty_desc: `Appuyez sur le signet d'un verset pour le sauvegarder.`,
    bookmarks_saved: 'versets marqués',
    remove_bookmark: 'Supprimer le signet',
    juz_navigation: 'Navigation par Juz',
    juz_title: 'Explorer par Juz',
    juz_subtitle: 'Le Coran est divisé en 30 juz pour une lecture structurée.',
    juz_label: 'Juz',
    progress_title: 'Progression',
    progress_listened: 'Écoutées',
    progress_read: 'Lues',
    progress_reset: 'Réinitialiser',
    search_quran: 'Rechercher dans le Coran',
    search_title: 'Rechercher des versets',
    search_subtitle: 'Recherchez un mot ou une expression dans tout le Coran.',
    search_placeholder: 'Tapez pour rechercher...',
    search_no_results: 'Aucun résultat',
    search_try_again: 'Essayez un autre mot-clé.',
    search_results_found: 'résultats trouvés',
    playlists_label: 'Listes de lecture',
    playlists_title: 'Mes listes',
    playlists_subtitle: 'Créez des listes personnalisées avec vos sourates préférées.',
    playlists_empty: 'Aucune liste encore',
    playlists_empty_desc: 'Créez votre première liste pour commencer.',
    playlist_new_placeholder: 'Nom de la liste...',
    playlist_create: 'Créer',
    compare_label: 'Comparer',
    compare_title: 'Comparer les récitants',
    compare_subtitle: 'Écoutez la même sourate de deux récitants différents.',
    compare_select_surah: 'Sélectionner une sourate',
    compare_reciter: 'Récitant',
    compare_choose: 'Choisir un récitant...',
    stats_label: 'Statistiques',
    stats_title: 'Mes statistiques',
    stats_subtitle: `Suivez votre parcours d'écoute du Coran.`,
    stats_total_time: 'Temps total',
    stats_surahs_played: 'Sourates écoutées',
    stats_streak: 'Jours consécutifs',
    stats_weekly: 'Activité hebdomadaire',
    stats_most_played: 'Les plus écoutées',
    reminder_title: 'Rappel',
    reminder_enable: 'Activer le rappel',
    reminder_disable: 'Désactiver',
    reminder_time: 'Heure du rappel',
    nav_mushaf: "Mushaf",
    repeat_ayah: "Répéter le verset",
    repeat_single: "Verset unique",
    repeat_ayah_num: "Numéro du verset",
    repeat_from: "De",
    repeat_to: "À",
    repeat_times: "Nombre de répétitions",
    repeat_stop: "Arrêter",
    loading_word_by_word: "Chargement des sens...",
    word_by_word: "Mot à mot",
    tajweed_colors: "Couleurs Tajweed",
    mushaf_page: "Page",
    mushaf_next_page: "Page suivante",
    mushaf_prev_page: "Page précédente",
    memorization_title: "Mode mémorisation",
    memorization_level: "Niveau",
    queue_title: "À suivre",
    repeat_ab_loop: "Boucle A-B",
    repeat_looping: "En boucle",
    repeat_count: "Fois",
    style_murattal: "Murattal",
    style_murattal_desc: "Rythme régulier pour la lecture",
    style_mujawwad: "Mujawwad",
    style_mujawwad_desc: "Récitation mélodique",
    style_muallim: "Muallim",
    style_muallim_desc: "Style pédagogique avec pauses",
    style_filter: "Filtrer par style",
    style_all: "Tous les styles",
    similar_reciters: "Récitants similaires",
    repeat_range: 'Plage',
    style_murattal_label: 'Murattal',
    style_mujawwad_label: 'Mujawwad',
    style_muallim_label: 'Muallim',
    tajweed_title: 'Règles de Tajweed',
    tajweed_toggle: 'Activer le Tajweed',
    word_by_word_title: 'Mot par Mot',
    tajweed: 'Tajweed',
    memorization: 'Mémorisation',
    tajweed_mode: "Mode Tajweed",
    mushaf_mode: "Mode Mushaf",
    memorization_mode: "Mode mémorisation",
    hide_level: "Niveau masquage",
    show_all: "Tout afficher",
    mark_memorized: "Mémorisé",
    memorized: "Mémorisé",
    page_label: "Page",
    word_meaning: "Sens du mot",
  },

  tr: {
    nav_home: 'Ana Sayfa',
    nav_reciters: 'Kariler',
    nav_surahs: 'Sureler',
    nav_favorites: 'Favoriler',
    nav_history: 'Geçmiş',
    nav_search: 'Ara',
    nav_playlists: 'Listeler',
    nav_compare: 'Karşılaştır',
    nav_stats: 'İstatistik',
    hero_badge: 'Mp3Quran tarafından desteklenmektedir · 100+ dünyaca ünlü kari',
    hero_title: 'Kur\'an-ı Kerim',
    hero_subtitle: 'Dünyanın en iyi karilerinin sesleriyle ilahi kelimeleri dinleyin. 114 sure boyunca etkileyici bir dinleme yolculuğu.',
    hero_browse_reciters: 'Karilere Göz At',
    hero_view_surahs: 'Tüm Sureleri Gör',
    stat_surahs: 'Sure',
    stat_verses: 'Ayet',
    stat_reciters: 'Kari',
    featured_label: 'Öne Çıkan Kariler',
    featured_title: 'Kur\'an\'ın Usta Sesleri',
    view_all: 'Tümünü Gör',
    banner_translation: '"Şüphesiz o Zikr\'i Biz indirdik ve onu koruyacak olan da Biziz."',
    banner_ref: 'Hicr Suresi 15:9',
    reciters_title: 'Tüm Kariler',
    reciters_subtitle: 'Dünyaca ünlü Kur\'an karilerini ve tilavet tarzlarını keşfedin.',
    search_reciters: 'Kari ara…',
    reciters_found: 'kari bulundu',
    riwaya: 'Rivayet',
    riwayat: 'Rivayetler',
    surah: 'Sure',
    surahs_word: 'Sure',
    surahs_available: 'sure mevcut',
    failed_load_reciters: 'Kariler yüklenemedi',
    no_reciters_found: 'Kari bulunamadı',
    surahs_title: 'Tüm Sureler',
    surahs_subtitle: 'Kur\'an-ı Kerim\'in 114 suresine göz atın.',
    search_surahs: 'Sure ara…',
    verses: 'ayet',
    play_all: 'Tümünü Oynat',
    pause_all: 'Tümünü Duraklat',
    search_surahs_dots: 'Sure ara…',
    favorites_title: 'Favorilerim',
    favorites_empty: 'Henüz favori yok — eklemeye başlayın!',
    no_fav_reciters: 'Favori kari yok',
    no_fav_reciters_desc: 'Buraya kaydetmek için herhangi bir karideki kalp simgesine dokunun.',
    no_fav_surahs: 'Favori sure yok',
    no_fav_surahs_desc: 'Buraya kaydetmek için herhangi bir suredeki kalp simgesine dokunun.',
    clear_all: 'Tümünü Temizle',
    added: 'Eklendi',
    browse_reciters: 'Karilere Göz At',
    browse_surahs: 'Surelere Göz At',
    saved_items: 'kayıtlı öğe',
    history_title: 'Dinleme Geçmişi',
    history_empty: 'Henüz bir şey dinlenmedi',
    history_empty_desc: 'Son dinlediğiniz sureler burada görünecek.',
    clear_history: 'Geçmişi Temizle',
    recently_played: 'son dinlenen parçalar',
    today: 'Bugün',
    yesterday: 'Dün',
    just_now: 'Az önce',
    sleep_timer: 'Uyku Zamanlayıcısı',
    end_of_surah: 'Sure Sonu',
    cancel_timer: 'Zamanlayıcıyı İptal Et',
    pausing_in: 'Duraklatılacak',
    pausing_after_surah: 'Bu sure bittikten sonra duraklatılacak',
    quran_text: 'Kur\'an Metni',
    translation: 'Çeviri',
    tafsir: 'Tefsir',
    no_surah_playing: 'Oynatılan sure yok',
    no_surah_playing_desc: 'Metnini görmek için bir sure başlatın.',
    failed_to_load: 'Yükleme başarısız',
    failed_to_load_desc: 'Sure metni alınamadı. Bağlantınızı kontrol edin.',
    ayahs: 'Ayet',
    loading_translation: 'Çeviri yükleniyor',
    loading_tafsir: 'Tefsir yükleniyor',
    footer_credit: 'Ses kaynağı',
    footer_love: 'Kur\'an-ı Kerim sevgisiyle yapıldı',
    all: 'Tümü',
    off: 'Kapalı',
    remove_favorite: 'Favorilerden kaldır',
    add_favorite: 'Favorilere ekle',
    shortcuts_hint: 'Boşluk: oynat/duraklat · ←→: önceki/sonraki · ↑↓: ses · M: sessiz · T: metin',
    daily_ayah: 'Günün Ayeti',
    daily_ayah_subtitle: `Kur'an-ı Kerim'den günlük tefekkür`,
    read_more: 'Devamını oku',
    font_size_decrease: 'Yazı küçült',
    font_size_increase: 'Yazı büyüt',
    playback_speed: 'Hız',
    speed_normal: 'Normal',
    nav_juz: 'Cüz',
    nav_bookmarks: 'Yer İmleri',
    bookmarks_title: 'İşaretli Ayetler',
    bookmarks_empty: 'Henüz yer imi yok',
    bookmarks_empty_desc: 'Kaydetmek için herhangi bir ayetteki yer imi simgesine dokunun.',
    bookmarks_saved: 'ayet işaretlendi',
    remove_bookmark: 'Yer imini kaldır',
    juz_navigation: 'Cüz Gezintisi',
    juz_title: 'Cüzlere Göz At',
    juz_subtitle: `Kur'an-ı Kerim yapılandırılmış okuma için 30 cüze ayrılmıştır.`,
    juz_label: 'Cüz',
    progress_title: 'İlerleme',
    progress_listened: 'Dinlenen',
    progress_read: 'Okunan',
    progress_reset: 'İlerlemeyi sıfırla',
    search_quran: `Kur'an'da Ara`,
    search_title: 'Ayet Ara',
    search_subtitle: `Kur'an-ı Kerim'de kelime veya cümle arayın.`,
    search_placeholder: 'Aramak için yazın...',
    search_no_results: 'Sonuç bulunamadı',
    search_try_again: 'Farklı bir anahtar kelime deneyin.',
    search_results_found: 'sonuç bulundu',
    playlists_label: 'Çalma Listeleri',
    playlists_title: 'Çalma Listelerim',
    playlists_subtitle: 'Seçtiğiniz surelerden özel çalma listeleri oluşturun.',
    playlists_empty: 'Henüz çalma listesi yok',
    playlists_empty_desc: 'İlk çalma listenizi oluşturun.',
    playlist_new_placeholder: 'Liste adı...',
    playlist_create: 'Oluştur',
    compare_label: 'Karşılaştır',
    compare_title: 'Karileri Karşılaştır',
    compare_subtitle: 'Aynı sureyi iki farklı kariden dinleyin.',
    compare_select_surah: 'Sure Seçin',
    compare_reciter: 'Kari',
    compare_choose: 'Kari seçin...',
    stats_label: 'İstatistikler',
    stats_title: 'İstatistiklerim',
    stats_subtitle: `Kur'an dinleme yolculuğunuzu takip edin.`,
    stats_total_time: 'Toplam süre',
    stats_surahs_played: 'Dinlenen sureler',
    stats_streak: 'Ardışık gün',
    stats_weekly: 'Haftalık aktivite',
    stats_most_played: 'En çok dinlenen',
    reminder_title: 'Hatırlatıcı',
    reminder_enable: 'Hatırlatıcıyı aç',
    reminder_disable: 'Kapat',
    reminder_time: 'Hatırlatma saati',
    nav_mushaf: "Mushaf",
    repeat_ayah: "Ayeti Tekrarla",
    repeat_single: "Tek Ayet",
    repeat_ayah_num: "Ayet Numarası",
    repeat_from: "Başlangıç",
    repeat_to: "Bitiş",
    repeat_times: "Tekrar Sayısı",
    repeat_stop: "Tekrarı Durdur",
    loading_word_by_word: "Kelime anlamları yükleniyor...",
    word_by_word: "Kelime Kelime",
    tajweed_colors: "Tecvid Renkleri",
    mushaf_page: "Sayfa",
    mushaf_next_page: "Sonraki Sayfa",
    mushaf_prev_page: "Önceki Sayfa",
    memorization_title: "Ezberleme Modu",
    memorization_level: "Seviye",
    queue_title: "Sıradaki",
    repeat_ab_loop: "A-B Döngü",
    repeat_looping: "Döngüde",
    repeat_count: "Kez",
    style_murattal: "Murattal",
    style_murattal_desc: "Düzenli okuma hızı",
    style_mujawwad: "Mücevved",
    style_mujawwad_desc: "Melodik tilavet",
    style_muallim: "Muallim",
    style_muallim_desc: "Öğretici tarz",
    style_filter: "Tarza Göre Filtrele",
    style_all: "Tüm Tarzlar",
    similar_reciters: "Benzer Kariler",
    repeat_range: 'Aralık',
    style_murattal_label: 'Murattal',
    style_mujawwad_label: 'Mujawwad',
    style_muallim_label: 'Muallim',
    tajweed_title: 'Tecvid Kuralları',
    tajweed_toggle: 'Tecvidi Aç',
    word_by_word_title: 'Kelime Kelime',
    tajweed: 'Tecvid',
    memorization: 'Ezberleme',
    tajweed_mode: "Tecvid Modu",
    mushaf_mode: "Mushaf Modu",
    memorization_mode: "Ezberleme Modu",
    hide_level: "Gizleme Seviyesi",
    show_all: "Tümünü Göster",
    mark_memorized: "Ezberledim",
    memorized: "Ezberlenmiş",
    page_label: "Sayfa",
    word_meaning: "Kelime Anlamı",
  },

  es: {
    nav_home: 'Inicio',
    nav_reciters: 'Recitadores',
    nav_surahs: 'Suras',
    nav_favorites: 'Favoritos',
    nav_history: 'Historial',
    nav_search: 'Buscar',
    nav_playlists: 'Listas',
    nav_compare: 'Comparar',
    nav_stats: 'Estadísticas',
    hero_badge: 'Desarrollado por Mp3Quran · Más de 100 recitadores de renombre mundial',
    hero_title: 'El Sagrado Corán',
    hero_subtitle: 'Escucha las palabras divinas con las voces de los mejores recitadores del mundo. Un viaje de escucha a través de las 114 suras.',
    hero_browse_reciters: 'Explorar recitadores',
    hero_view_surahs: 'Ver todas las suras',
    stat_surahs: 'Suras',
    stat_verses: 'Versículos',
    stat_reciters: 'Recitadores',
    featured_label: 'Recitadores destacados',
    featured_title: 'Voces maestras del Corán',
    view_all: 'Ver todo',
    banner_translation: '"Ciertamente Nosotros hemos hecho descender el Recuerdo y somos sus guardianes."',
    banner_ref: 'Sura Al-Hijr 15:9',
    reciters_title: 'Todos los recitadores',
    reciters_subtitle: 'Descubre recitadores del Corán y sus múltiples estilos de recitación.',
    search_reciters: 'Buscar recitadores…',
    reciters_found: 'recitadores encontrados',
    riwaya: 'Riwaya',
    riwayat: 'Riwayat',
    surah: 'Sura',
    surahs_word: 'Suras',
    surahs_available: 'suras disponibles',
    failed_load_reciters: 'Error al cargar recitadores',
    no_reciters_found: 'No se encontraron recitadores',
    surahs_title: 'Todas las suras',
    surahs_subtitle: 'Explora las 114 suras del Sagrado Corán.',
    search_surahs: 'Buscar suras…',
    verses: 'versículos',
    play_all: 'Reproducir todo',
    pause_all: 'Pausar todo',
    search_surahs_dots: 'Buscar suras…',
    favorites_title: 'Mis favoritos',
    favorites_empty: 'Aún no hay favoritos — ¡empieza a agregar algunos!',
    no_fav_reciters: 'Sin recitadores favoritos',
    no_fav_reciters_desc: 'Toca el corazón en cualquier recitador para guardarlo aquí.',
    no_fav_surahs: 'Sin suras favoritas',
    no_fav_surahs_desc: 'Toca el corazón en cualquier sura para guardarla aquí.',
    clear_all: 'Borrar todo',
    added: 'Añadido',
    browse_reciters: 'Explorar recitadores',
    browse_surahs: 'Explorar suras',
    saved_items: 'elementos guardados',
    history_title: 'Historial de escucha',
    history_empty: 'Nada reproducido aún',
    history_empty_desc: 'Tus suras reproducidas recientemente aparecerán aquí.',
    clear_history: 'Borrar historial',
    recently_played: 'pistas reproducidas recientemente',
    today: 'Hoy',
    yesterday: 'Ayer',
    just_now: 'Ahora mismo',
    sleep_timer: 'Temporizador de sueño',
    end_of_surah: 'Fin de la sura',
    cancel_timer: 'Cancelar temporizador',
    pausing_in: 'Pausa en',
    pausing_after_surah: 'Pausa después de que termine esta sura',
    quran_text: 'Texto del Corán',
    translation: 'Traducción',
    tafsir: 'Tafsir',
    no_surah_playing: 'Ninguna sura reproduciéndose',
    no_surah_playing_desc: 'Reproduce una sura para ver su texto aquí.',
    failed_to_load: 'Error al cargar',
    failed_to_load_desc: 'No se pudo obtener el texto. Verifica tu conexión.',
    ayahs: 'Aleyas',
    loading_translation: 'Cargando traducción',
    loading_tafsir: 'Cargando tafsir',
    footer_credit: 'Audio proporcionado por',
    footer_love: 'Hecho con amor por el Sagrado Corán',
    all: 'Todos',
    off: 'Desactivado',
    remove_favorite: 'Quitar de favoritos',
    add_favorite: 'Añadir a favoritos',
    shortcuts_hint: 'Espacio: reproducir/pausar · ←→: anterior/siguiente · ↑↓: volumen · M: silenciar · T: texto',
    daily_ayah: 'Aleya del día',
    daily_ayah_subtitle: 'Reflexión diaria del Sagrado Corán',
    read_more: 'Leer más',
    font_size_decrease: 'Reducir fuente',
    font_size_increase: 'Aumentar fuente',
    playback_speed: 'Velocidad',
    speed_normal: 'Normal',
    nav_juz: 'Juz',
    nav_bookmarks: 'Marcadores',
    bookmarks_title: 'Aleyas marcadas',
    bookmarks_empty: 'Sin marcadores aún',
    bookmarks_empty_desc: 'Toca el ícono de marcador en cualquier aleya para guardarla.',
    bookmarks_saved: 'aleyas marcadas',
    remove_bookmark: 'Eliminar marcador',
    juz_navigation: 'Navegación por Juz',
    juz_title: 'Explorar por Juz',
    juz_subtitle: 'El Corán está dividido en 30 juz para una lectura estructurada.',
    juz_label: 'Juz',
    progress_title: 'Progreso',
    progress_listened: 'Escuchadas',
    progress_read: 'Leídas',
    progress_reset: 'Resetear progreso',
    search_quran: 'Buscar en el Corán',
    search_title: 'Buscar Aleyas',
    search_subtitle: 'Busca palabras o frases en todo el Sagrado Corán.',
    search_placeholder: 'Escribe para buscar...',
    search_no_results: 'Sin resultados',
    search_try_again: 'Intenta con otra palabra.',
    search_results_found: 'resultados encontrados',
    playlists_label: 'Listas',
    playlists_title: 'Mis Listas',
    playlists_subtitle: 'Crea listas personalizadas con tus suras favoritas.',
    playlists_empty: 'Aún no hay listas',
    playlists_empty_desc: 'Crea tu primera lista para comenzar.',
    playlist_new_placeholder: 'Nombre de la lista...',
    playlist_create: 'Crear',
    compare_label: 'Comparar',
    compare_title: 'Comparar Recitadores',
    compare_subtitle: 'Escucha la misma sura de dos recitadores diferentes.',
    compare_select_surah: 'Seleccionar Sura',
    compare_reciter: 'Recitador',
    compare_choose: 'Elegir recitador...',
    stats_label: 'Estadísticas',
    stats_title: 'Mis estadísticas',
    stats_subtitle: 'Sigue tu progreso de escucha del Corán.',
    stats_total_time: 'Tiempo total',
    stats_surahs_played: 'Suras reproducidas',
    stats_streak: 'Días consecutivos',
    stats_weekly: 'Actividad semanal',
    stats_most_played: 'Más reproducidas',
    reminder_title: 'Recordatorio',
    reminder_enable: 'Activar recordatorio',
    reminder_disable: 'Desactivar',
    reminder_time: 'Hora del recordatorio',
    nav_mushaf: 'Mushaf',
    repeat_ayah: 'Repetir Aleya',
    repeat_single: 'Una Aleya',
    repeat_range: 'Rango',
    repeat_ayah_num: 'Número de Aleya',
    repeat_from: 'Desde',
    repeat_to: 'Hasta',
    repeat_times: 'Repeticiones',
    repeat_stop: 'Detener repetición',
    repeat_count: 'Veces',
    repeat_ab_loop: 'Bucle A-B',
    repeat_looping: 'Repitiendo',
    loading_word_by_word: 'Cargando palabra por palabra...',
    word_by_word_title: 'Palabra por Palabra',
    word_by_word: 'Palabra por Palabra',
    tajweed: 'Tajweed',
    memorization: 'Memorización',
    word_meaning: 'Significado',
    tajweed_title: 'Reglas de Tajweed',
    tajweed_toggle: 'Activar Tajweed',
    tajweed_mode: 'Modo Tajweed',
    mushaf_mode: 'Modo Mushaf',
    mushaf_page: 'Página',
    mushaf_next_page: 'Siguiente',
    mushaf_prev_page: 'Anterior',
    page_label: 'Página',
    memorization_title: 'Memorización',
    memorization_mode: 'Modo Memorización',
    memorization_level: 'Nivel',
    memorized: 'Memorizado',
    mark_memorized: 'Marcar como memorizado',
    hide_level: 'Nivel de ocultamiento',
    show_all: 'Mostrar todo',
    queue_title: 'Cola de reproducción',
    similar_reciters: 'Recitadores similares',
    style_filter: 'Estilo de recitación',
    style_all: 'Todos',
    style_murattal: 'Murattal',
    style_murattal_desc: 'Recitación pausada para estudio',
    style_murattal_label: 'Murattal',
    style_mujawwad: 'Mujawwad',
    style_mujawwad_desc: 'Recitación melódica',
    style_mujawwad_label: 'Mujawwad',
    style_muallim: 'Muallim',
    style_muallim_desc: 'Estilo de enseñanza',
    style_muallim_label: 'Muallim',
  },

  id: {
    nav_home: 'Beranda',
    nav_reciters: 'Qari',
    nav_surahs: 'Surah',
    nav_favorites: 'Favorit',
    nav_history: 'Riwayat',
    nav_search: 'Cari',
    nav_playlists: 'Daftar Putar',
    nav_compare: 'Bandingkan',
    nav_stats: 'Statistik',
    hero_badge: 'Didukung oleh Mp3Quran · 100+ Qari Terkenal Dunia',
    hero_title: 'Al-Quran Al-Karim',
    hero_subtitle: 'Dengarkan firman Allah dengan suara para qari terbaik dunia. Perjalanan mendengarkan 114 surah.',
    hero_browse_reciters: 'Jelajahi Qari',
    hero_view_surahs: 'Lihat Semua Surah',
    stat_surahs: 'Surah',
    stat_verses: 'Ayat',
    stat_reciters: 'Qari',
    featured_label: 'Qari Unggulan',
    featured_title: 'Suara Terbaik Al-Quran',
    view_all: 'Lihat Semua',
    banner_translation: '"Sesungguhnya Kamilah yang menurunkan Al-Quran dan pasti Kami pula yang menjaganya."',
    banner_ref: 'Surah Al-Hijr 15:9',
    reciters_title: 'Semua Qari',
    reciters_subtitle: 'Temukan qari Al-Quran terkenal dan gaya tilawah mereka.',
    search_reciters: 'Cari qari…',
    reciters_found: 'qari ditemukan',
    riwaya: 'Riwayat',
    riwayat: 'Riwayat',
    surah: 'Surah',
    surahs_word: 'Surah',
    surahs_available: 'surah tersedia',
    failed_load_reciters: 'Gagal memuat qari',
    no_reciters_found: 'Qari tidak ditemukan',
    surahs_title: 'Semua Surah',
    surahs_subtitle: 'Jelajahi 114 surah Al-Quran.',
    search_surahs: 'Cari surah…',
    verses: 'ayat',
    play_all: 'Putar Semua',
    pause_all: 'Jeda Semua',
    search_surahs_dots: 'Cari surah…',
    favorites_title: 'Favorit Saya',
    favorites_empty: 'Belum ada favorit — mulai tambahkan!',
    no_fav_reciters: 'Belum ada qari favorit',
    no_fav_reciters_desc: 'Ketuk ikon hati pada qari mana pun untuk menyimpannya di sini.',
    no_fav_surahs: 'Belum ada surah favorit',
    no_fav_surahs_desc: 'Ketuk ikon hati pada surah mana pun untuk menyimpannya di sini.',
    clear_all: 'Hapus Semua',
    added: 'Ditambahkan',
    browse_reciters: 'Jelajahi Qari',
    browse_surahs: 'Jelajahi Surah',
    saved_items: 'item tersimpan',
    history_title: 'Riwayat Mendengarkan',
    history_empty: 'Belum ada yang diputar',
    history_empty_desc: 'Surah yang baru diputar akan muncul di sini.',
    clear_history: 'Hapus Riwayat',
    recently_played: 'baru diputar',
    today: 'Hari ini',
    yesterday: 'Kemarin',
    just_now: 'Baru saja',
    sleep_timer: 'Timer Tidur',
    end_of_surah: 'Akhir Surah',
    cancel_timer: 'Batalkan Timer',
    pausing_in: 'Jeda dalam',
    pausing_after_surah: 'Jeda setelah surah ini selesai',
    quran_text: 'Teks Al-Quran',
    translation: 'Terjemahan',
    tafsir: 'Tafsir',
    no_surah_playing: 'Tidak ada surah diputar',
    no_surah_playing_desc: 'Mulai putar surah untuk melihat teksnya di sini.',
    failed_to_load: 'Gagal memuat',
    failed_to_load_desc: 'Tidak dapat mengambil teks surah. Periksa koneksi Anda.',
    ayahs: 'Ayat',
    loading_translation: 'Memuat terjemahan',
    loading_tafsir: 'Memuat tafsir',
    footer_credit: 'Audio disediakan oleh',
    footer_love: 'Dibuat dengan cinta untuk Al-Quran Al-Karim',
    all: 'Semua',
    off: 'Mati',
    remove_favorite: 'Hapus dari favorit',
    add_favorite: 'Tambah ke favorit',
    shortcuts_hint: 'Spasi: putar/jeda · ←→: sebelum/berikut · ↑↓: volume · M: bisukan · T: teks',
    daily_ayah: 'Ayat Hari Ini',
    daily_ayah_subtitle: 'Renungan harian dari Al-Quran',
    read_more: 'Baca selengkapnya',
    font_size_decrease: 'Perkecil font',
    font_size_increase: 'Perbesar font',
    playback_speed: 'Kecepatan putar',
    speed_normal: 'Normal',
    nav_juz: 'Juz',
    nav_bookmarks: 'Penanda',
    bookmarks_title: 'Penanda Ayat',
    bookmarks_empty: 'Belum ada penanda',
    bookmarks_empty_desc: 'Ketuk ikon penanda pada ayat untuk menyimpannya.',
    bookmarks_saved: 'ayat ditandai',
    remove_bookmark: 'Hapus penanda',
    juz_navigation: 'Navigasi Juz',
    juz_title: 'Jelajahi Juz',
    juz_subtitle: 'Al-Quran terbagi menjadi 30 juz untuk memudahkan pembacaan.',
    juz_label: 'Juz',
    progress_title: 'Progres',
    progress_listened: 'Didengarkan',
    progress_read: 'Dibaca',
    progress_reset: 'Reset progres',
    search_quran: 'Cari di Al-Quran',
    search_title: 'Cari Ayat',
    search_subtitle: 'Cari kata atau frasa di seluruh Al-Quran.',
    search_placeholder: 'Ketik untuk mencari...',
    search_no_results: 'Tidak ada hasil',
    search_try_again: 'Coba kata kunci lain.',
    search_results_found: 'hasil ditemukan',
    playlists_label: 'Daftar Putar',
    playlists_title: 'Daftar Putar Saya',
    playlists_subtitle: 'Buat daftar putar kustom dari surah pilihan Anda.',
    playlists_empty: 'Belum ada daftar putar',
    playlists_empty_desc: 'Buat daftar putar pertama Anda untuk memulai.',
    playlist_new_placeholder: 'Nama daftar putar...',
    playlist_create: 'Buat',
    compare_label: 'Bandingkan',
    compare_title: 'Bandingkan Qari',
    compare_subtitle: 'Dengarkan surah yang sama dari dua qari berbeda.',
    compare_select_surah: 'Pilih Surah',
    compare_reciter: 'Qari',
    compare_choose: 'Pilih qari...',
    stats_label: 'Statistik',
    stats_title: 'Statistik Saya',
    stats_subtitle: 'Lacak perjalanan mendengarkan Al-Quran Anda.',
    stats_total_time: 'Total mendengarkan',
    stats_surahs_played: 'Surah diputar',
    stats_streak: 'Hari berturut-turut',
    stats_weekly: 'Aktivitas mingguan',
    stats_most_played: 'Paling sering diputar',
    reminder_title: 'Pengingat',
    reminder_enable: 'Aktifkan pengingat',
    reminder_disable: 'Nonaktifkan',
    reminder_time: 'Waktu pengingat',
    nav_mushaf: 'Mushaf',
    repeat_ayah: 'Ulangi Ayat',
    repeat_single: 'Satu Ayat',
    repeat_range: 'Rentang',
    repeat_ayah_num: 'Nomor Ayat',
    repeat_from: 'Dari',
    repeat_to: 'Sampai',
    repeat_times: 'Pengulangan',
    repeat_stop: 'Hentikan pengulangan',
    repeat_count: 'Kali',
    repeat_ab_loop: 'Loop A-B',
    repeat_looping: 'Mengulang',
    loading_word_by_word: 'Memuat kata per kata...',
    word_by_word_title: 'Kata per Kata',
    word_by_word: 'Kata per Kata',
    tajweed: 'Tajweed',
    memorization: 'Hafalan',
    word_meaning: 'Arti',
    tajweed_title: 'Aturan Tajweed',
    tajweed_toggle: 'Aktifkan Tajweed',
    tajweed_mode: 'Mode Tajweed',
    mushaf_mode: 'Mode Mushaf',
    mushaf_page: 'Halaman',
    mushaf_next_page: 'Berikutnya',
    mushaf_prev_page: 'Sebelumnya',
    page_label: 'Halaman',
    memorization_title: 'Hafalan',
    memorization_mode: 'Mode Hafalan',
    memorization_level: 'Tingkat',
    memorized: 'Dihafal',
    mark_memorized: 'Tandai dihafal',
    hide_level: 'Tingkat sembunyikan',
    show_all: 'Tampilkan semua',
    queue_title: 'Antrian putar',
    similar_reciters: 'Qari serupa',
    style_filter: 'Gaya tilawah',
    style_all: 'Semua',
    style_murattal: 'Murattal',
    style_murattal_desc: 'Bacaan pelan untuk belajar',
    style_murattal_label: 'Murattal',
    style_mujawwad: 'Mujawwad',
    style_mujawwad_desc: 'Bacaan melodis',
    style_mujawwad_label: 'Mujawwad',
    style_muallim: 'Muallim',
    style_muallim_desc: 'Gaya mengajar',
    style_muallim_label: 'Muallim',
  },
}

// ── Hook to get translations ─────────────────────────

export function useT(): Translations {
  const locale = useLanguageStore((s) => s.locale)
  return translations[locale] ?? translations['eng']
}

// ── Static getter (for non-React contexts) ───────────

export function getT(): Translations {
  const locale = useLanguageStore.getState().locale
  return translations[locale] ?? translations['eng']
}
