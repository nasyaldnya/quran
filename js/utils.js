// --- DOM Elements ---
export const DOM = {
    languageSelect: document.getElementById('language-select'),
    riwayaSelect: document.getElementById('riwaya-select'),
    surahSelect: document.getElementById('surah-select'),
    recitersList: document.getElementById('reciters-list'),
    reciterDetails: document.getElementById('reciter-details'),
    loader: document.getElementById('loader'),
    detailsPlaceholder: document.getElementById('details-placeholder'),
    searchReciterInput: document.getElementById('search-reciter-input'),
    playerContainer: document.getElementById('player-container'),
    queuePanel: document.getElementById('queue-panel'),
    queueHandle: document.getElementById('queue-handle'),
    toggleQueueBtn: document.getElementById('toggle-queue-btn'),
    queueList: document.getElementById('queue-list'),
    queuePlaceholder: document.getElementById('queue-placeholder'),
    audioPlayer: document.getElementById('audio-player'),
    nowPlaying: document.getElementById('now-playing'),
    playPauseBtn: document.getElementById('play-pause-btn'),
    playIcon: document.getElementById('play-icon'),
    pauseIcon: document.getElementById('pause-icon'),
    nextBtn: document.getElementById('next-btn'),
    prevBtn: document.getElementById('prev-btn'),
    progressBarContainer: document.getElementById('progress-bar-container'),
    progressBar: document.getElementById('progress-bar'),
    currentTimeEl: document.getElementById('current-time'),
    totalDurationEl: document.getElementById('total-duration'),
    playbackSpeed: document.getElementById('playback-speed'),
    sleepTimerBtns: document.querySelectorAll('.sleep-timer-btn'),
    sleepTimerDisplay: document.getElementById('sleep-timer-display'),
    cancelSleepTimerBtn: document.getElementById('cancel-sleep-timer-btn'),
    copyLinkBtn: document.getElementById('copy-link-btn'),
    downloadBtn: document.getElementById('download-btn'),
    shuffleBtnPlayer: document.getElementById('shuffle-btn-player'),
    repeatBtn: document.getElementById('repeat-btn'),
    themeToggleBtn: document.getElementById('theme-toggle'),
    themeText: document.getElementById('theme-text'),
    visualizerCanvas: document.getElementById('visualizer'),
    toastContainer: document.getElementById('toast-container'),
    statusAnnouncer: document.createElement('div'), // For accessibility
};

// Add accessibility announcer to body
DOM.statusAnnouncer.id = 'status-announcer';
DOM.statusAnnouncer.setAttribute('aria-live', 'polite');
DOM.statusAnnouncer.setAttribute('aria-atomic', 'true');
DOM.statusAnnouncer.className = 'sr-only'; // Visually hidden
document.body.appendChild(DOM.statusAnnouncer);


// --- Helper Functions ---
export const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    let bgColor = 'bg-green-500';
    if (type === 'warning') bgColor = 'bg-yellow-500';
    if (type === 'error') bgColor = 'bg-red-500';

    toast.className = `p-3 rounded-lg text-white shadow-lg animate-toast ${bgColor}`;
    toast.textContent = message;
    
    // Announce the message for screen readers
    DOM.statusAnnouncer.textContent = message;

    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
};

export const padSurahNumber = (number) => String(number).padStart(3, '0');

export const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const showLoader = (show) => {
    DOM.loader.style.display = show ? 'flex' : 'none';
    if (show) DOM.recitersList.innerHTML = '';
};

export const normalizeArabic = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[أإآا]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/[^\u0600-\u06FF\s\d]/g, '');
};

export const debounce = (fn, ms = 300) => {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
};

export const withSlash = (u) => (u.endsWith('/') ? u : `${u}/`);

// Collator for sorting Arabic strings
export const collator = new Intl.Collator('ar', { sensitivity: 'base', numeric: true });

// --- Assets ---
export const makkiIcon = `<span title="سورة مكية" aria-label="سورة مكية">🕋</span>`;
export const madaniIcon = `<span title="سورة مدنية" aria-label="سورة مدنية">🕌</span>`;
export const playingIcon = `<svg class="w-4 h-4 text-primary animate-pulse" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 7H4V17H6V7ZM10 4H8V20H10V4ZM14 10H12V14H14V10ZM18 7H16V17H18V7Z"/></svg>`;