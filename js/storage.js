// --- Favorites Logic ---
export const loadFavorites = () => {
    return JSON.parse(localStorage.getItem('quranPlayerFavorites')) || [];
};

export const saveFavorites = (favorites) => {
    localStorage.setItem('quranPlayerFavorites', JSON.stringify(favorites));
};

// --- State Persistence ---
export const saveState = (state) => {
    if (!state.queue || !state.queue.length) {
        localStorage.removeItem('quranPlayerState');
        return;
    }
    localStorage.setItem('quranPlayerState', JSON.stringify(state));
};

export const loadState = () => {
    try {
        const savedState = JSON.parse(localStorage.getItem('quranPlayerState'));
        if (savedState && savedState.queue?.length > 0) {
            return savedState;
        }
        return null;
    } catch (e) {
        console.error("Failed to load saved state:", e);
        localStorage.removeItem('quranPlayerState');
        return null;
    }
};