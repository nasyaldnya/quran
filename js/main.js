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
    // New state for advanced loop
    isLoopActive: false,
    loopStartTime: null,
    loopEndTime: null,
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
        
        // Restore EQ settings
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
        // ... (keyboard shortcut logic remains the same)
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
        // ... (drop logic remains the same)
    });

    DOM.sleepTimerBtns.forEach(btn => btn.addEventListener('click', () => player.setSleepTimer(btn.dataset.time)));
    DOM.cancelSleepTimerBtn.addEventListener('click', player.cancelSleepTimer);
    
    // --- New Event Listeners ---
    DOM.eqToggleBtn.addEventListener('click', () => {
        DOM.eqPanel.classList.toggle('hidden');
    });
    player.setupEqEventListeners();

    DOM.loopSetStartBtn.addEventListener('click', () => {
        const currentTime = player.getCurrentTime();
        if (currentTime === null) return;

        state.loopStartTime = currentTime;
        state.loopEndTime = null;
        state.isLoopActive = false;
        ui.updateLoopUI(state);
        showToast('تم تحديد نقطة البداية');
    });

    DOM.loopSetEndBtn.addEventListener('click', () => {
        const currentTime = player.getCurrentTime();
        if (currentTime === null || state.loopStartTime === null || currentTime <= state.loopStartTime) {
            showToast('يجب أن تكون نقطة النهاية بعد نقطة البداية', 'error');
            return;
        }

        state.loopEndTime = currentTime;
        state.isLoopActive = true;
        ui.updateLoopUI(state);

        showToast('تم تفعيل التكرار المحدد', 'success');
    });

    DOM.loopClearBtn.addEventListener('click', () => {
        state.isLoopActive = false;
        state.loopStartTime = null;
        state.loopEndTime = null;
        ui.updateLoopUI(state);
        showToast('تم إلغاء التكرار المحدد', 'warning');
    });


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
    // ... (theme logic remains the same)
}

function setupDownloadAndCopy() {
    // ... (download/copy logic remains the same)
}

document.addEventListener('DOMContentLoaded', () => {
    state.favorites = storage.loadFavorites();
    setupEventListeners();
    loadInitialData();
});

if ('serviceWorker' in navigator) {
    // ... (service worker logic remains the same)
}