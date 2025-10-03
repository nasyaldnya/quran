import { DOM, normalizeArabic, collator, showToast, makkiIcon, madaniIcon, playingIcon, formatTime } from './utils.js';

// --- (All other functions like renderReciters, renderQueue, etc. remain the same) ---
// ...

// ---  New Function at the end of the file  ---
export const updateLoopUI = (state) => {
    const { isLoopActive, loopStartTime, loopEndTime } = state;

    DOM.loopStartTimeDisplay.textContent = loopStartTime !== null ? formatTime(loopStartTime) : '00:00';
    DOM.loopEndTimeDisplay.textContent = loopEndTime !== null ? formatTime(loopEndTime) : '00:00';

    DOM.loopSetEndBtn.disabled = loopStartTime === null;
    
    if(isLoopActive) {
        DOM.loopSetStartBtn.classList.add('bg-primary', 'text-white');
    } else {
        DOM.loopSetStartBtn.classList.remove('bg-primary', 'text-white');
    }
};

// Make sure to add the original unchanged functions of ui.js here if you are replacing the file completely.
// renderReciters, renderLanguages, renderRiwayat, renderSurahs, renderReciterDetails
// renderQueue, updatePlayerUI, updateProgress, updateNowPlaying