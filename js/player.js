import { DOM, showToast, padSurahNumber, withSlash, formatTime } from './utils.js';
import { updatePlayerUI, updateNowPlaying, renderQueue, updateProgress } from './ui.js';

let appState = {};
let currentSound = null;
let animationFrameId = null;

// Visualizer state
const visualizerCanvas = DOM.visualizerCanvas;
const visualizerCtx = visualizerCanvas.getContext('2d');
let analyser;
let bufferLength;
let dataArray;

// EQ state
let eqBands = [];
let isEqSetup = false;


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
            if (currentSound) currentSound.stop();
            currentSound = null;
            appState.currentQueueIndex = -1;
            updateNowPlaying(null);
        } else if (appState.currentQueueIndex >= appState.queue.length) {
            appState.currentQueueIndex = 0;
            playFromQueue();
        } else {
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
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    const track = appState.queue[appState.currentQueueIndex];

    const createAndPlayNewSound = () => {
        if (!track) {
            updatePlayerUI(false, appState);
            return;
        }
        const { moshaf, surah } = track;
        const surahNumber = padSurahNumber(surah.id);
        const audioSrc = `${withSlash(moshaf.server)}${surahNumber}.mp3`;

        currentSound = new Howl({
            src: [audioSrc],
            html5: true, // <-- تم إعادة هذا السطر لحل مشكلة الذاكرة
            volume: 0,
            onplay: () => {
                currentSound.fade(0, 1, 800);

                if (!isEqSetup) {
                    if (Howler.ctx && Howler.ctx.state === 'suspended') {
                        Howler.ctx.resume();
                    }
                    setupEqualizer();
                }
                
                updatePlayerUI(true, appState);
                requestAnimationFrame(step);
            },
            onpause: () => {
                updatePlayerUI(false, appState);
                cancelAnimationFrame(animationFrameId);
            },
            onend: () => {
                onTrackEnded();
                cancelAnimationFrame(animationFrameId);
            },
            onloaderror: (id, err) => {
                console.error("Howler load error:", err);
                showToast('تعذر تحميل المقطع. يتم الانتقال للتالي.', 'error');
                setTimeout(playNext, 1000);
            }
        });

        currentSound.rate(parseFloat(DOM.playbackSpeed.value) || 1);
        currentSound.play();
        
        updateNowPlaying(track);
        renderQueue(appState.queue, appState.currentQueueIndex, appState.eventHandlers);
        updateShareURL();
        if ('mediaSession' in navigator) {
            updateMediaSession(track);
        }
    };
    
    const oldSound = currentSound;
    if (oldSound) {
        oldSound.fade(oldSound.volume(), 0, 700);
        oldSound.once('fade', () => {
            oldSound.unload();
            createAndPlayNewSound();
        });
    } else {
        createAndPlayNewSound();
    }
};

// === تم تعديل هذه الدالة ===
function step() {
    if (!currentSound) return;

    // تم حذف شرط playing() من هنا لضمان استمرار التحديث
    updateProgress(currentSound);
    if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        drawVisualizer();
    }
    animationFrameId = requestAnimationFrame(step);
}

function drawVisualizer() {
    if (!visualizerCanvas) return;
    visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    const barWidth = (visualizerCanvas.width / bufferLength) * 1.5;
    let barHeight;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2.5;
        const isDark = document.documentElement.classList.contains('dark');
        visualizerCtx.fillStyle = isDark ? '#2dd4bf' : '#0d9488';
        visualizerCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
    }
}

const onTrackEnded = () => {
    if (appState.repeatMode === 'one') {
        currentSound.seek(0);
        currentSound.play();
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
    if (!currentSound) {
        if (appState.queue.length > 0) {
            if(appState.currentQueueIndex === -1) appState.currentQueueIndex = 0;
            playFromQueue();
        }
        return;
    }

    if (currentSound.playing()) {
        currentSound.fade(currentSound.volume(), 0, 500);
        currentSound.once('fade', () => {
            currentSound.pause();
        });
    } else {
        currentSound.volume(0);
        currentSound.play();
        currentSound.fade(0, 1, 500);
    }
}

export const seek = (e) => {
    if (!currentSound || !currentSound.duration()) return;
    const rect = DOM.progressBarContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (width - clickX) / width;
    currentSound.seek(currentSound.duration() * percentage);
};

export const setupPlayerEventListeners = () => {
    // Logic is now handled by Howl events
};

export const setSleepTimer = (minutes) => {
    clearTimeout(appState.sleepTimerId);
    clearInterval(appState.sleepIntervalId);

    const fadeOutDuration = 10000;
    const totalDurationMs = minutes * 60 * 1000;

    if (totalDurationMs <= fadeOutDuration) {
        appState.sleepTimerId = setTimeout(() => {
            if (currentSound && currentSound.playing()) {
                currentSound.pause();
            }
            cancelSleepTimer();
        }, totalDurationMs);
    } else {
        const fadeStartTime = totalDurationMs - fadeOutDuration;
        appState.sleepTimerId = setTimeout(() => {
            if (currentSound && currentSound.playing()) {
                currentSound.fade(currentSound.volume(), 0, fadeOutDuration);
                currentSound.once('fade', () => {
                    currentSound.pause();
                    cancelSleepTimer();
                });
            } else {
                cancelSleepTimer();
            }
        }, fadeStartTime);
    }

    const endTime = Date.now() + totalDurationMs;
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

export const setPlaybackRate = (rate) => {
    if (currentSound) {
        currentSound.rate(rate);
    }
};

export const getCurrentTime = () => {
    if (currentSound) {
        return currentSound.seek() || 0;
    }
    return 0;
};

export const getCurrentRate = () => {
    if (currentSound) {
        return currentSound.rate();
    }
    return 1;
};

function setupEqualizer() {
    const audioCtx = Howler.ctx;
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const frequencies = [320, 1000, 3200];
    
    eqBands = frequencies.map((freq, i) => {
        const filter = audioCtx.createBiquadFilter();
        if (i === 0) filter.type = 'lowshelf';
        else if (i === 2) filter.type = 'highshelf';
        else filter.type = 'peaking';
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
    });

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    Howler.masterGain.disconnect();
    
    let currentNode = Howler.masterGain;
    eqBands.forEach(filter => {
        currentNode.connect(filter);
        currentNode = filter;
    });

    currentNode.connect(analyser);
    analyser.connect(audioCtx.destination);
    
    isEqSetup = true;
}


export function setupEqEventListeners() {
    DOM.eqSliders.forEach((slider, index) => {
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (eqBands[index]) {
                eqBands[index].gain.value = value;
            }
            DOM.eqValSpans[index].textContent = `${value} dB`;
        });
    });
}

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
        navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
        navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
        navigator.mediaSession.setActionHandler('previoustrack', playPrev);
        navigator.mediaSession.setActionHandler('nexttrack', playNext);
     }
}

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