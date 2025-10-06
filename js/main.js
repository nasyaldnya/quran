import { DOM, debounce, showToast, showLoader, withSlash } from './utils.js';
import * as api from './api.js';
import * as ui from './ui.js';
import * as player from './player.js';
import * as storage from './storage.js';
import { initI18n, setLanguage } from './i18n.js';

const state = {
    allSurahs: [],
    allReciters: [],
    favorites: [],
    queue: [],
    currentQueueIndex: -1,
    sleepTimerId: null,
    sleepIntervalId: null,
    isShuffled: false,
    repeatMode: 'off', // 'off', 'one', 'all'
    currentFetchCtrl: null,
    eventHandlers: {
        toggleFavorite,
        selectReciter,
        playSurah,
        addSurahToQueue,
        handlePlayAll,
        playTrackAtIndex,
        removeFromQueue
    }
};

player.setPlayerAppState(state);

function toggleFavorite(event, reciterId) {
    event.stopPropagation();
    if (state.favorites.includes(reciterId)) {
        state.favorites = state.favorites.filter(id => id !== reciterId);
    } else {
        state.favorites.push(reciterId);
    }
    storage.saveFavorites(state.favorites);
    ui.renderReciters(state.allReciters, state.favorites, state.eventHandlers);
}

function selectReciter(reciter) {
    ui.renderReciterDetails(reciter, state.allSurahs, state.eventHandlers);
}

function playSurah(track) {
    state.queue = [track];
    state.currentQueueIndex = 0;
    player.playFromQueue();
}

function addSurahToQueue(track) {
    player.addTrackToQueue(track, false);
}

function handlePlayAll(reciter, moshaf, replace) {
    player.handlePlayAll(reciter, moshaf, replace);
}

function playTrackAtIndex(index) {
    player.playTrackAtIndex(index);
}

function removeFromQueue(index) {
    player.removeFromQueue(index);
}

const loadReciters = async () => {
    state.currentFetchCtrl?.abort();
    state.currentFetchCtrl = new AbortController();
    const { signal } = state.currentFetchCtrl;

    showLoader(true);
    const lang = DOM.languageSelect.value || 'ar';
    const riwaya = DOM.riwayaSelect.value;
    const sura = DOM.surahSelect.value;
    let query = `reciters?language=${lang}${riwaya ? `&rewaya=${riwaya}` : ''}${sura ? `&sura=${sura}` : ''}`;
    
    try {
        const data = await api.fetchData(query, signal);
        if (signal.aborted) return;

        if (data && data.reciters) {
            state.allReciters = data.reciters;
            ui.renderReciters(state.allReciters, state.favorites, state.eventHandlers);
        }
    } catch (error) {
        if (!signal.aborted) {
            console.error("Failed to load reciters:", error);
            showToast('فشل تحميل قائمة القراء.', 'error');
        }
    } finally {
        if (!signal.aborted) {
            showLoader(false);
        }
    }
};

const loadInitialData = async () => {
    showLoader(true);
    const langCode = localStorage.getItem('quranLang') || 'ar';
    const initialCtrl = new AbortController();
    const { signal } = initialCtrl;

    try {
        const [languages, riwayat, suwar, recitersData] = await Promise.all([
            api.fetchData('languages', signal),
            api.fetchData(`riwayat?language=${langCode}`, signal),
            api.fetchData(`suwar?language=${langCode}`, signal),
            api.fetchData(`reciters?language=${langCode}`, signal)
        ]);

        if (signal.aborted) return;

        if (languages) ui.renderLanguages(languages, langCode);
        if (riwayat) ui.renderRiwayat(riwayat);
        if (suwar) state.allSurahs = ui.renderSurahs(suwar);
        if (recitersData && recitersData.reciters) {
            state.allReciters = recitersData.reciters;
            ui.renderReciters(state.allReciters, state.favorites, state.eventHandlers);
        }

    } catch (error) {
        console.error("Failed to load initial data:", error);
        showToast('فشل تحميل البيانات. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.', 'error');
    } finally {
        showLoader(false);
        restoreSessionState();
        setTimeout(player.applyDeepLink, 500);
    }
};

function restoreSessionState() {
    const savedState = storage.loadState();
    if(savedState) {
        state.queue = savedState.queue || [];
        state.currentQueueIndex = savedState.currentQueueIndex ?? -1;
        state.repeatMode = savedState.repeatMode || 'off';
        state.isShuffled = savedState.isShuffled || false;
        
        DOM.playbackSpeed.value = savedState.speed || 1;
        
        if (savedState.eq) {
            DOM.eqSliders.forEach((slider, index) => {
                const value = savedState.eq[index] || 0;
                slider.value = value;
                slider.dispatchEvent(new Event('input')); 
            });
        }
    }
    ui.renderQueue(state.queue, state.currentQueueIndex, state.eventHandlers);
}

function handleResponsiveLayout() {
    const queuePanel = document.getElementById('queue-panel');
    const desktopContainer = document.getElementById('desktop-queue-container');
    const playerContainer = document.getElementById('player-container').querySelector('.container');

    if (!queuePanel || !desktopContainer || !playerContainer) return;

    if (window.innerWidth > 1023) { 
        if (!desktopContainer.contains(queuePanel)) {
            desktopContainer.appendChild(queuePanel);
            queuePanel.className = 'bg-card rounded-xl shadow-lg p-3 h-[75vh] overflow-y-auto';
            DOM.playerContainer.classList.remove('queue-open');
        }
    } else {
        if (!playerContainer.contains(queuePanel)) {
            playerContainer.appendChild(queuePanel);
            queuePanel.className = 'flex-grow overflow-y-auto p-4 pt-0';
        }
    }
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                DOM.playPauseBtn.click();
                break;
            case 'ArrowRight':
                e.preventDefault();
                DOM.nextBtn.click();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                DOM.prevBtn.click();
                break;
        }
    });
}

function setupEventListeners() {
    DOM.languageSelect.addEventListener('change', () => {
        const selectedLang = DOM.languageSelect.value;
        setLanguage(selectedLang);
        DOM.riwayaSelect.value = '';
        DOM.surahSelect.value = '';
        loadInitialData();
    });
    DOM.riwayaSelect.addEventListener('change', loadReciters);
    DOM.surahSelect.addEventListener('change', loadReciters);
    DOM.searchReciterInput.addEventListener('input', debounce(() => {
        ui.renderReciters(state.allReciters, state.favorites, state.eventHandlers);
    }, 250));

    player.setupPlayerEventListeners();
    player.setupMediaSession();
    DOM.playPauseBtn.addEventListener('click', player.togglePlayPause);
    DOM.nextBtn.addEventListener('click', player.playNext);
    DOM.prevBtn.addEventListener('click', player.playPrev);
    DOM.progressBarContainer.addEventListener('click', player.seek);
    DOM.playbackSpeed.addEventListener('change', (e) => player.setPlaybackRate(parseFloat(e.target.value)));
    
    DOM.toggleQueueBtn.addEventListener('click', () => DOM.playerContainer.classList.toggle('queue-open'));
    DOM.queueHandle.addEventListener('click', () => DOM.playerContainer.classList.toggle('queue-open'));
    DOM.queueList.addEventListener('drop', () => {
        const currentTrack = state.queue[state.currentQueueIndex];
        const newOrder = [...DOM.queueList.querySelectorAll('.queue-item')].map(item => state.queue[item.dataset.index]);
        state.queue = newOrder;
        state.currentQueueIndex = state.queue.indexOf(currentTrack);
        ui.renderQueue(state.queue, state.currentQueueIndex, state.eventHandlers);
    });

    DOM.sleepTimerBtns.forEach(btn => btn.addEventListener('click', () => player.setSleepTimer(btn.dataset.time)));
    DOM.cancelSleepTimerBtn.addEventListener('click', player.cancelSleepTimer);
    
    DOM.eqToggleBtn.addEventListener('click', () => {
        DOM.eqPanel.classList.toggle('hidden');
    });
    player.setupEqEventListeners();

    setupTheme();
    setupDownloadAndCopy();
    setupKeyboardShortcuts();

    window.addEventListener('resize', debounce(handleResponsiveLayout, 200));

    window.addEventListener('beforeunload', () => {
        const eqSettings = Array.from(DOM.eqSliders).map(s => s.value);
        storage.saveState({
             queue: state.queue,
             currentQueueIndex: state.currentQueueIndex,
             repeatMode: state.repeatMode,
             isShuffled: state.isShuffled,
             speed: player.getCurrentRate(),
             currentTime: player.getCurrentTime(),
             eq: eqSettings
        });
    });
}

function setupTheme() {
    const applyTheme = () => {
        const theme = localStorage.getItem('color-theme');
        const themeTextKey = document.documentElement.classList.contains('dark') ? 'themeLight' : 'themeNight';

        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Translate theme text
        const themeToggleText = document.querySelector('#theme-text');
        if(themeToggleText) {
             const key = document.documentElement.classList.contains('dark') ? 'themeLight' : 'themeNight';
             themeToggleText.setAttribute('data-i18n-key', key);
             // We may need to call a translate function here if the language has already been set.
        }
    };

    DOM.themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('color-theme', theme);
        applyTheme();
        // Re-translate UI to update the theme button text
        setLanguage(localStorage.getItem('quranLang') || 'ar');
    });
    
    applyTheme();
}

function setupDownloadAndCopy() {
    DOM.copyLinkBtn.addEventListener('click', () => {
        const track = state.queue[state.currentQueueIndex];
        if (!track) return;
        
        const surahNumber = player.padSurahNumber(track.surah.id);
        const audioSrc = `${player.withSlash(track.moshaf.server)}${surahNumber}.mp3`;
        
        navigator.clipboard.writeText(audioSrc).then(() => showToast('تم نسخ الرابط'));
    });

    DOM.downloadBtn.addEventListener('click', () => {
        const track = state.queue[state.currentQueueIndex];
        if (!track) return;

        const surahNumber = player.padSurahNumber(track.surah.id);
        const audioSrc = `${player.withSlash(track.moshaf.server)}${surahNumber}.mp3`;

        const a = Object.assign(document.createElement('a'), { 
            href: audioSrc, 
            download: `${track.reciter.name} - ${track.surah.name}.mp3` 
        });
        document.body.appendChild(a);
        a.click();
        a.remove();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initI18n();
    state.favorites = storage.loadFavorites();
    setupEventListeners();
    loadInitialData();
    handleResponsiveLayout();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js') 
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}