import { DOM, showToast, padSurahNumber, withSlash, formatTime } from './utils.js';
import { updatePlayerUI, updateNowPlaying, renderQueue, updateProgress } from './ui.js';

// --- State --- (This will be managed in main.js but player functions will modify it)
let appState = {}; 

export const setPlayerAppState = (state) => {
    appState = state;
};

// --- Queue & Core Logic ---
export const addTrackToQueue = (track, playNow = false) => {
    const isDuplicate = appState.queue.some(item =>
        item.surah.id === track.surah.id &&
        item.reciter.id === track.reciter.id &&
        item.moshaf.id === track.moshaf.id
    );

    if (isDuplicate) {
        showToast("السورة موجودة بالفعل في قائمة التشغيل.", 'warning');
        return;
    }

    appState.queue.push(track);
    showToast("تمت إضافة السورة بنجاح.");

    if (playNow) {
        appState.currentQueueIndex = appState.queue.length - 1;
        playFromQueue();
    }
    renderQueue(appState.queue, appState.currentQueueIndex, appState.eventHandlers);
};

export const handlePlayAll = (reciter, moshaf, replaceQueue) => {
    if (replaceQueue) {
        appState.queue = [];
        appState.currentQueueIndex = -1;
    }
    const availableIds = new Set(moshaf.surah_list.split(','));
    const surahsToAdd = appState.allSurahs.filter(s => s && availableIds.has(String(s.id)));

    surahsToAdd.forEach(surah => appState.queue.push({ reciter, moshaf, surah }));

    if (replaceQueue && appState.queue.length > 0) {
        appState.currentQueueIndex = 0;
        playFromQueue();
    }
    renderQueue(appState.queue, appState.currentQueueIndex, appState.eventHandlers);
};

export const removeFromQueue = (index) => {
    const wasPlaying = index === appState.currentQueueIndex;
    appState.queue.splice(index, 1);
    
    if (wasPlaying) {
        if (appState.queue.length === 0) {
            DOM.audioPlayer.pause();
            DOM.audioPlayer.src = '';
            appState.currentQueueIndex = -1;
            updateNowPlaying(null);
        } else if (appState.currentQueueIndex >= appState.queue.length) {
            // If the last item was removed, play from the start
            appState.currentQueueIndex = 0;
            playFromQueue();
        } else {
            // If an item before the end was removed, the next item is now at the same index
            playFromQueue();
        }
    } else if (index < appState.currentQueueIndex) {
        appState.currentQueueIndex--;
    }
    renderQueue(appState.queue, appState.currentQueueIndex, appState.eventHandlers);
};

export const playTrackAtIndex = (index) => {
    appState.currentQueueIndex = index;
    playFromQueue();
};

export const playFromQueue = () => {
    if (appState.currentQueueIndex < 0 || appState.currentQueueIndex >= appState.queue.length) {
        updatePlayerUI(false, appState);
        return;
    }
    const track = appState.queue[appState.currentQueueIndex];
    const { moshaf, surah } = track;
    const surahNumber = padSurahNumber(surah.id);
    const audioSrc = `${withSlash(moshaf.server)}${surahNumber}.mp3`;

    DOM.audioPlayer.src = audioSrc;
    DOM.audioPlayer.play().catch(e => console.error("Playback failed:", e));

    updateNowPlaying(track);

    // Update playing class on surah items
    document.querySelectorAll('[id^=surah-item-]').forEach(btn => btn.classList.remove('playing'));
    const currentItem = document.getElementById(`surah-item-${moshaf.id}-${surah.id}`);
    if (currentItem) currentItem.classList.add('playing');
    
    renderQueue(appState.queue, appState.currentQueueIndex, appState.eventHandlers);
    updateShareURL();

    if ('mediaSession' in navigator) {
        updateMediaSession(track);
    }
};

const onTrackEnded = () => {
    if (appState.repeatMode === 'one') {
        DOM.audioPlayer.currentTime = 0;
        DOM.audioPlayer.play();
    } else if (appState.currentQueueIndex < appState.queue.length - 1) {
        playNext();
    } else if (appState.repeatMode === 'all') {
        appState.currentQueueIndex = 0;
        playFromQueue();
    } else {
        updatePlayerUI(false, appState);
    }
};

export const playNext = () => {
    if (appState.currentQueueIndex < appState.queue.length - 1) {
        appState.currentQueueIndex++;
        playFromQueue();
    } else if (appState.repeatMode === 'all' && appState.queue.length > 0) {
        appState.currentQueueIndex = 0;
        playFromQueue();
    }
};

export const playPrev = () => {
    if (appState.currentQueueIndex > 0) {
        appState.currentQueueIndex--;
        playFromQueue();
    }
};

export const togglePlayPause = () => {
     if (DOM.audioPlayer.src) {
        if (DOM.audioPlayer.paused) DOM.audioPlayer.play();
        else DOM.audioPlayer.pause();
    } else if (appState.queue.length > 0) {
        appState.currentQueueIndex = 0;
        playFromQueue();
    }
}

export const seek = (e) => {
    const rect = DOM.progressBarContainer.getBoundingClientRect();
    // For RTL layout, clientX gives distance from left. We need distance from right.
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    // For RTL, a click on the far left should be the end of the song
    // and a click on the far right should be the beginning.
    // The progress bar fills from right to left in the UI, but time progresses from 0.
    // So (width - clickX) / width gives the correct progress percentage.
    DOM.audioPlayer.currentTime = ((width - clickX) / width) * DOM.audioPlayer.duration;
};

export const setupPlayerEventListeners = () => {
    DOM.audioPlayer.addEventListener('play', () => updatePlayerUI(true, appState));
    DOM.audioPlayer.addEventListener('pause', () => updatePlayerUI(false, appState));
    DOM.audioPlayer.addEventListener('ended', onTrackEnded);
    DOM.audioPlayer.addEventListener('timeupdate', updateProgress);
    DOM.audioPlayer.addEventListener('loadedmetadata', updateProgress);
    DOM.audioPlayer.addEventListener('error', (e) => {
        console.error("Audio playback error:", e);
        showToast('تعذر تشغيل المقطع. يتم الانتقال للتالي.', 'error');
        setTimeout(playNext, 1000);
    });
};

// --- Sleep Timer Logic ---
export const setSleepTimer = (minutes) => {
    clearTimeout(appState.sleepTimerId);
    clearInterval(appState.sleepIntervalId);

    const endTime = Date.now() + minutes * 60 * 1000;
    appState.sleepTimerId = setTimeout(() => {
        DOM.audioPlayer.pause();
        cancelSleepTimer();
    }, minutes * 60 * 1000);

    const updateTimerDisplay = () => {
        const remaining = Math.round((endTime - Date.now()) / 1000);
        if (remaining <= 0) {
            cancelSleepTimer();
        } else {
            DOM.sleepTimerDisplay.textContent = formatTime(remaining);
        }
    }
    updateTimerDisplay();
    appState.sleepIntervalId = setInterval(updateTimerDisplay, 1000);

    DOM.cancelSleepTimerBtn.classList.remove('hidden');
};

export const cancelSleepTimer = () => {
    clearTimeout(appState.sleepTimerId);
    clearInterval(appState.sleepIntervalId);
    appState.sleepTimerId = null;
    appState.sleepIntervalId = null;
    DOM.sleepTimerDisplay.textContent = '';
    DOM.cancelSleepTimerBtn.classList.add('hidden');
};


// --- Media Session API ---
const updateMediaSession = (track) => {
    if (!track) return;
    navigator.mediaSession.metadata = new MediaMetadata({
        title: track.surah.name,
        artist: track.reciter.name,
        album: track.moshaf.name,
    });
};

export const setupMediaSession = () => {
     if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => DOM.audioPlayer.play());
        navigator.mediaSession.setActionHandler('pause', () => DOM.audioPlayer.pause());
        navigator.mediaSession.setActionHandler('previoustrack', playPrev);
        navigator.mediaSession.setActionHandler('nexttrack', playNext);
     }
}

// --- Deep Linking ---
export const applyDeepLink = () => {
    const params = new URLSearchParams(location.search);
    const rid = params.get('reciter'), mid = params.get('moshaf'), sid = params.get('surah');
    if (!rid || !mid || !sid || !appState.allReciters.length || !appState.allSurahs.length) return;

    const reciter = appState.allReciters.find(r => String(r.id) === String(rid));
    if (!reciter) return;
    
    const moshaf = reciter.moshaf.find(m => String(m.id) === String(mid));
    if (!moshaf) return;

    const surah = appState.allSurahs.find(s => String(s.id) === String(sid));
    if (!surah) return;

    appState.queue = [{ reciter, moshaf, surah }];
    appState.currentQueueIndex = 0;
    playFromQueue();
};

const updateShareURL = () => {
    try {
        const track = appState.queue[appState.currentQueueIndex];
        if (!track) return;
        const params = new URLSearchParams({
            reciter: track.reciter.id,
            moshaf: track.moshaf.id,
            surah: track.surah.id
        });
        const path = location.pathname.includes('blob:') ? '' : location.pathname;
        history.replaceState(null, '', `${path}?${params.toString()}`);
    } catch (error) {
        console.warn('Failed to update share URL:', error);
    }
};