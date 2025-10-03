import { DOM, debounce, showToast, showLoader, withSlash } from './utils.js';
import * as api from './api.js';
import * as ui from './ui.js';
import * as player from './player.js';
import * as storage from './storage.js';

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
    
    const data = await api.fetchData(query, signal);
    if (signal.aborted) return;

    if (data && data.reciters) {
        state.allReciters = data.reciters;
        ui.renderReciters(state.allReciters, state.favorites, state.eventHandlers);
    }
    showLoader(false);
};

const loadInitialData = async () => {
    showLoader(true);
    const langCode = localStorage.getItem('quranLang') || 'ar';
    
    const initialCtrl = new AbortController();
    const { signal } = initialCtrl;

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

    showLoader(false);
    
    restoreSessionState();
    setTimeout(player.applyDeepLink, 500); 
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
        localStorage.setItem('quranLang', DOM.languageSelect.value);
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
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            DOM.themeText.textContent = 'الوضع الليلي';
        } else {
            document.documentElement.classList.remove('dark');
            DOM.themeText.textContent = 'الوضع الفاتح';
        }
    };
    DOM.themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
        applyTheme();
    });
    applyTheme();
}

function setupDownloadAndCopy() {
    DOM.copyLinkBtn.addEventListener('click', () => {
        if (!currentSound) return;
        const src = currentSound._src;
        navigator.clipboard.writeText(src).then(() => showToast('تم نسخ الرابط'));
    });
    DOM.downloadBtn.addEventListener('click', () => {
        const t = state.queue[state.currentQueueIndex];
        if (!t || !currentSound) return;
        const a = Object.assign(document.createElement('a'), { 
            href: currentSound._src, 
            download: `${t.reciter.name} - ${t.surah.name}.mp3` 
        });
        document.body.appendChild(a);
        a.click();
        a.remove();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    state.favorites = storage.loadFavorites();
    setupEventListeners();
    loadInitialData();
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