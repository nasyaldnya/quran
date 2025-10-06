/*
 * قاموس يحتوي على ترجمات واجهة المستخدم
 */
const translations = {
  // اللغة العربية
  ar: {
    mainTitle: "مكتبة القرآن الكريم الصوتية",
    mainSubtitle: "استمع إلى القرآن الكريم بأصوات نخبة من القراء من جميع أنحاء العالم",
    themeToggle: "تبديل الوضع",
    themeNight: "الوضع الليلي",
    themeLight: "الوضع الفاتح",
    selectLanguageLabel: "اختر اللغة",
    selectRiwayaLabel: "اختر الرواية",
    selectSurahLabel: "البحث بالقراء حسب السورة",
    allRiwayat: "كل الروايات",
    allSurahs: "كل السور",
    recitersListTitle: "قائمة القراء",
    searchReciterPlaceholder: "ابحث عن قارئ...",
    availableRecitationsTitle: "التلاوات المتاحة",
    detailsPlaceholder: "الرجاء اختر قارئًا من القائمة لعرض تلاواته",
    noReciterFound: "لم يُعثَر على قراء.",
    queueTitle: "قائمة التشغيل",
    queuePlaceholder: "قائمة التشغيل فارغة.",
    nowPlayingDefault: "لم يتم تحديد أي مقطع",
    sleepTimer: "مؤقت النوم",
    cancelSleepTimer: "إلغاء",
    playbackSpeed: "السرعة",
    repeat: "تكرار",
    shuffle: "خَلْط",
    eq: "معادل الصوت"
  },
  // English Language
  eng: {
    mainTitle: "Quran Audio Library",
    mainSubtitle: "Listen to the Holy Quran by elite reciters from around the world",
    themeToggle: "Toggle Mode",
    themeNight: "Night Mode",
    themeLight: "Light Mode",
    selectLanguageLabel: "Select Language",
    selectRiwayaLabel: "Select Riwaya",
    selectSurahLabel: "Find reciters who recited Surah",
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
    sleepTimer: "Sleep Timer",
    cancelSleepTimer: "Cancel",
    playbackSpeed: "Speed",
    repeat: "Repeat",
    shuffle: "Shuffle",
    eq: "Equalizer"
  },
  // French Language
  fr: {
    mainTitle: "Bibliothèque Audio du Coran",
    mainSubtitle: "Écoutez le Saint Coran par des récitants d'élite du monde entier",
    themeToggle: "Changer de mode",
    themeNight: "Mode Nuit",
    themeLight: "Mode Jour",
    selectLanguageLabel: "Choisir la langue",
    selectRiwayaLabel: "Choisir la Riwaya",
    selectSurahLabel: "Rechercher des récitants par Sourate",
    allRiwayat: "Toutes les Riwayat",
    allSurahs: "Toutes les Sourates",
    recitersListTitle: "Liste des Récitants",
    searchReciterPlaceholder: "Rechercher un récitant...",
    availableRecitationsTitle: "Récitations Disponibles",
    detailsPlaceholder: "Veuillez sélectionner un récitant de la liste pour voir ses récitations",
    noReciterFound: "Aucun récitant trouvé.",
    queueTitle: "Liste de lecture",
    queuePlaceholder: "La liste de lecture est vide.",
    nowPlayingDefault: "Aucun morceau sélectionné",
    sleepTimer: "Minuterie de sommeil",
    cancelSleepTimer: "Annuler",
    playbackSpeed: "Vitesse",
    repeat: "Répéter",
    shuffle: "Aléatoire",
    eq: "Égaliseur"
  },
  // Russian Language
  ru: {
    mainTitle: "Аудиотека Корана",
    mainSubtitle: "Слушайте Священный Коран в исполнении лучших чтецов со всего мира",
    themeToggle: "Переключить режим",
    themeNight: "Ночной режим",
    themeLight: "Дневной режим",
    selectLanguageLabel: "Выберите язык",
    selectRiwayaLabel: "Выберите риваят",
    selectSurahLabel: "Найти чтецов по суре",
    allRiwayat: "Все риваяты",
    allSurahs: "Все суры",
    recitersListTitle: "Список чтецов",
    searchReciterPlaceholder: "Поиск чтеца...",
    availableRecitationsTitle: "Доступные записи",
    detailsPlaceholder: "Пожалуйста, выберите чтеца из списка для просмотра записей",
    noReciterFound: "Чтецы не найдены.",
    queueTitle: "Плейлист",
    queuePlaceholder: "Плейлист пуст.",
    nowPlayingDefault: "Трек не выбран",
    sleepTimer: "Таймер сна",
    cancelSleepTimer: "Отмена",
    playbackSpeed: "Скорость",
    repeat: "Повтор",
    shuffle: "Перемешать",
    eq: "Эквалайзер"
  },
  // German Language
  de: {
    mainTitle: "Koran-Audiobibliothek",
    mainSubtitle: "Hören Sie den Heiligen Koran von erstklassigen Rezitatoren aus der ganzen Welt",
    themeToggle: "Modus wechseln",
    themeNight: "Nachtmodus",
    themeLight: "Tagmodus",
    selectLanguageLabel: "Sprache auswählen",
    selectRiwayaLabel: "Riwaya auswählen",
    selectSurahLabel: "Rezitatoren nach Sure suchen",
    allRiwayat: "Alle Riwaya",
    allSurahs: "Alle Suren",
    recitersListTitle: "Liste der Rezitatoren",
    searchReciterPlaceholder: "Suche nach einem Rezitator...",
    availableRecitationsTitle: "Verfügbare Rezitationen",
    detailsPlaceholder: "Bitte wählen Sie einen Rezitator aus der Liste, um seine Rezitationen anzuzeigen",
    noReciterFound: "Keine Rezitatoren gefunden.",
    queueTitle: "Wiedergabeliste",
    queuePlaceholder: "Die Wiedergabeliste ist leer.",
    nowPlayingDefault: "Kein Titel ausgewählt",
    sleepTimer: "Schlaf-Timer",
    cancelSleepTimer: "Abbrechen",
    playbackSpeed: "Geschwindigkeit",
    repeat: "Wiederholen",
    shuffle: "Zufallswiedergabe",
    eq: "Equalizer"
  },
  // Spanish Language
  es: {
    mainTitle: "Biblioteca de Audio del Corán",
    mainSubtitle: "Escuche el Sagrado Corán por recitadores de élite de todo el mundo",
    themeToggle: "Cambiar modo",
    themeNight: "Modo Nocturno",
    themeLight: "Modo Diurno",
    selectLanguageLabel: "Seleccionar idioma",
    selectRiwayaLabel: "Seleccionar Riwaya",
    selectSurahLabel: "Buscar recitadores por Sura",
    allRiwayat: "Todos los Riwaya",
    allSurahs: "Todas las Suras",
    recitersListTitle: "Lista de Recitadores",
    searchReciterPlaceholder: "Buscar un recitador...",
    availableRecitationsTitle: "Recitaciones Disponibles",
    detailsPlaceholder: "Por favor, seleccione un recitador de la lista para ver sus recitaciones",
    noReciterFound: "No se encontraron recitadores.",
    queueTitle: "Lista de reproducción",
    queuePlaceholder: "La lista de reproducción está vacía.",
    nowPlayingDefault: "Ninguna pista seleccionada",
    sleepTimer: "Temporizador de sueño",
    cancelSleepTimer: "Cancelar",
    playbackSpeed: "Velocidad",
    repeat: "Repetir",
    shuffle: "Aleatorio",
    eq: "Ecualizador"
  },
  // Turkish Language
  tr: {
    mainTitle: "Kur'an Ses Kütüphanesi",
    mainSubtitle: "Dünyanın dört bir yanından seçkin okuyucularla Kur'an-ı Kerim'i dinleyin",
    themeToggle: "Modu Değiştir",
    themeNight: "Gece Modu",
    themeLight: "Gündüz Modu",
    selectLanguageLabel: "Dil Seçin",
    selectRiwayaLabel: "Rivayet Seçin",
    selectSurahLabel: "Sureye göre okuyucuları bul",
    allRiwayat: "Tüm Rivayetler",
    allSurahs: "Tüm Sureler",
    recitersListTitle: "Okuyucu Listesi",
    searchReciterPlaceholder: "Okuyucu ara...",
    availableRecitationsTitle: "Mevcut Tilavetler",
    detailsPlaceholder: "Tilavetlerini görmek için lütfen listeden bir okuyucu seçin",
    noReciterFound: "Okuyucu bulunamadı.",
    queueTitle: "Çalma Listesi",
    queuePlaceholder: "Çalma listesi boş.",
    nowPlayingDefault: "Parça seçilmedi",
    sleepTimer: "Uyku Zamanlayıcısı",
    cancelSleepTimer: "İptal",
    playbackSpeed: "Hız",
    repeat: "Tekrarla",
    shuffle: "Karıştır",
    eq: "Ekolayzır"
  },
  // Bengali Language
  bn: {
    mainTitle: "কুরআন অডিও লাইব্রেরি",
    mainSubtitle: "বিশ্বজুড়ে সেরা কারীদের কণ্ঠে পবিত্র কুরআন শুনুন",
    themeToggle: "মোড পরিবর্তন করুন",
    themeNight: "রাত মোড",
    themeLight: "দিন মোড",
    selectLanguageLabel: "ভাষা নির্বাচন করুন",
    selectRiwayaLabel: "রিওয়ায়া নির্বাচন করুন",
    selectSurahLabel: "সূরা দ্বারা কারী খুঁজুন",
    allRiwayat: "সমস্ত রিওয়ায়া",
    allSurahs: "সমস্ত সূরা",
    recitersListTitle: "কারী তালিকা",
    searchReciterPlaceholder: "কারী অনুসন্ধান করুন...",
    availableRecitationsTitle: "উপলব্ধ তেলাওয়াত",
    detailsPlaceholder: "তার তেলাওয়াত দেখতে তালিকা থেকে একজন কারী নির্বাচন করুন",
    noReciterFound: "কোন কারী পাওয়া যায়নি।",
    queueTitle: "প্লেলিস্ট",
    queuePlaceholder: "প্লেলিস্ট খালি।",
    nowPlayingDefault: "কোন ট্র্যাক নির্বাচন করা হয়নি",
    sleepTimer: "ঘুম টাইমার",
    cancelSleepTimer: "বাতিল",
    playbackSpeed: "গতি",
    repeat: "পুনরাবৃত্তি",
    shuffle: " এলোমেলো",
    eq: "ইকুয়ালাইজার"
  },
  // Kurdish Language
  kur: {
    mainTitle: "کتێبخانەی دەنگی قورئان",
    mainSubtitle: "گوێ لە قورئانی پیرۆز بگرە بە دەنگی باشترین قورئانخوێنانی جیهان",
    themeToggle: "گۆڕینی دۆخ",
    themeNight: "دۆخی شەو",
    themeLight: "دۆخی ڕۆژ",
    selectLanguageLabel: "زمان هەڵبژێرە",
    selectRiwayaLabel: "ڕیوایەت هەڵبژێرە",
    selectSurahLabel: "گەڕان بەدوای قورئانخوێنان بەپێی سوورەت",
    allRiwayat: "هەموو ڕیوایەتەکان",
    allSurahs: "هەموو سوورەتەکان",
    recitersListTitle: "لیستی قورئانخوێنان",
    searchReciterPlaceholder: "بۆ قورئانخوێنێک بگەڕێ...",
    availableRecitationsTitle: "خوێندنەوە بەردەستەکان",
    detailsPlaceholder: "تکایە قورئانخوێنێک لە لیستەکە هەڵبژێرە بۆ بینینی خوێندنەوەکانی",
    noReciterFound: "هیچ قورئانخوێنێک نەدۆزرایەوە.",
    queueTitle: "لیستی لێدان",
    queuePlaceholder: "لیستی لێدان بەتاڵە.",
    nowPlayingDefault: "هیچ گۆرانییەک هەڵنەبژێردراوە",
    sleepTimer: "کاتی خەوتن",
    cancelSleepTimer: "هەڵوەشاندنەوە",
    playbackSpeed: "خێرایی",
    repeat: "دووبارەکردنەوە",
    shuffle: "تێکەڵکردن",
    eq: "یەکسانکار"
  },
  // Persian Language
  fa: {
    mainTitle: "کتابخانه صوتی قرآن",
    mainSubtitle: "به قرآن کریم با صدای قاریان نخبه از سراسر جهان گوش دهید",
    themeToggle: "تغییر حالت",
    themeNight: "حالت شب",
    themeLight: "حالت روز",
    selectLanguageLabel: "انتخاب زبان",
    selectRiwayaLabel: "انتخاب روایت",
    selectSurahLabel: "یافتن قاریان بر اساس سوره",
    allRiwayat: "همه روایات",
    allSurahs: "همه سوره ها",
    recitersListTitle: "لیست قاریان",
    searchReciterPlaceholder: "جستجوی یک قاری...",
    availableRecitationsTitle: "تلاوت های موجود",
    detailsPlaceholder: "لطفاً یک قاری از لیست انتخاب کنید تا تلاوت های او را مشاهده کنید",
    noReciterFound: "هیچ قاری پیدا نشد.",
    queueTitle: "لیست پخش",
    queuePlaceholder: "لیست پخش خالی است.",
    nowPlayingDefault: "هیچ قطعه ای انتخاب نشده است",
    sleepTimer: "تایمر خواب",
    cancelSleepTimer: "لغو",
    playbackSpeed: "سرعت",
    repeat: "تکرار",
    shuffle: "درهم",
    eq: "اکولایزر"
  },
  // Indonesian Language
  id: {
    mainTitle: "Perpustakaan Audio Al-Qur'an",
    mainSubtitle: "Dengarkan Al-Qur'an oleh para qari elit dari seluruh dunia",
    themeToggle: "Ubah Mode",
    themeNight: "Mode Malam",
    themeLight: "Mode Siang",
    selectLanguageLabel: "Pilih Bahasa",
    selectRiwayaLabel: "Pilih Riwayat",
    selectSurahLabel: "Cari qari berdasarkan Surah",
    allRiwayat: "Semua Riwayat",
    allSurahs: "Semua Surah",
    recitersListTitle: "Daftar Qari",
    searchReciterPlaceholder: "Cari seorang qari...",
    availableRecitationsTitle: "Bacaan yang Tersedia",
    detailsPlaceholder: "Silakan pilih seorang qari dari daftar untuk melihat bacaannya",
    noReciterFound: "Tidak ada qari yang ditemukan.",
    queueTitle: "Daftar Putar",
    queuePlaceholder: "Daftar putar kosong.",
    nowPlayingDefault: "Tidak ada trek yang dipilih",
    sleepTimer: "Timer Tidur",
    cancelSleepTimer: "Batal",
    playbackSpeed: "Kecepatan",
    repeat: "Ulangi",
    shuffle: "Acak",
    eq: "Equalizer"
  },
  // Urdu Language
  ur: {
    mainTitle: "قرآن آڈیو لائبریری",
    mainSubtitle: "دنیا بھر کے بہترین قاریوں کی آواز میں قرآن مجید سنیں",
    themeToggle: "موڈ تبدیل کریں",
    themeNight: "نائٹ موڈ",
    themeLight: "ڈے موڈ",
    selectLanguageLabel: "زبان منتخب کریں",
    selectRiwayaLabel: "روایت منتخب کریں",
    selectSurahLabel: "سورت کے مطابق قاری تلاش کریں",
    allRiwayat: "تمام روایات",
    allSurahs: "تمام سورتیں",
    recitersListTitle: "قاریوں کی فہرست",
    searchReciterPlaceholder: "ایک قاری تلاش کریں...",
    availableRecitationsTitle: "دستیاب تلاوتیں",
    detailsPlaceholder: "براہ کرم فہرست سے ایک قاری منتخب کریں تاکہ ان کی تلاوتیں دیکھی جا سکیں",
    noReciterFound: "کوئی قاری نہیں ملا۔",
    queueTitle: "پلے لسٹ",
    queuePlaceholder: "پلے لسٹ خالی ہے۔",
    nowPlayingDefault: "کوئی ٹریک منتخب نہیں ہے",
    sleepTimer: "سلیپ ٹائمر",
    cancelSleepTimer: "منسوخ کریں",
    playbackSpeed: "رفتار",
    repeat: "دہرائیں",
    shuffle: "شفل",
    eq: "ایکوالائزر"
  },
  // Bosnian Language
  bs: {
    mainTitle: "Audio Biblioteka Kur'ana",
    mainSubtitle: "Slušajte Časni Kur'an od strane elitnih učača iz cijelog svijeta",
    themeToggle: "Promijeni način",
    themeNight: "Noćni način",
    themeLight: "Dnevni način",
    selectLanguageLabel: "Odaberi jezik",
    selectRiwayaLabel: "Odaberi Riwayah",
    selectSurahLabel: "Pronađi učače po Suri",
    allRiwayat: "Svi Riwayah",
    allSurahs: "Sve Sure",
    recitersListTitle: "Lista učača",
    searchReciterPlaceholder: "Traži učača...",
    availableRecitationsTitle: "Dostupne recitacije",
    detailsPlaceholder: "Molimo odaberite učača sa liste da vidite njegove recitacije",
    noReciterFound: "Nema pronađenih učača.",
    queueTitle: "Lista za reprodukciju",
    queuePlaceholder: "Lista za reprodukciju je prazna.",
    nowPlayingDefault: "Nijedna pjesma nije odabrana",
    sleepTimer: "Tajmer za spavanje",
    cancelSleepTimer: "Otkaži",
    playbackSpeed: "Brzina",
    repeat: "Ponovi",
    shuffle: "Nasumično",
    eq: "Ekvilajzer"
  }
};

let currentLanguage = 'ar';

/*
 * دالة لتطبيق الترجمات على واجهة المستخدم
 */
export const translateUI = () => {
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
  document.documentElement.dir = ['ar', 'fa', 'ur', 'kur'].includes(currentLanguage) ? 'rtl' : 'ltr';
};

/*
 * دالة لضبط اللغة الحالية
 */
export const setLanguage = (lang) => {
  currentLanguage = lang || 'ar';
  localStorage.setItem('quranLang', currentLanguage);
  translateUI();
};

/*
 * دالة للبدء، تقرأ اللغة المحفوظة وتطبقها
 */
export const initI18n = () => {
  const savedLang = localStorage.getItem('quranLang') || 'ar';
  setLanguage(savedLang);
};