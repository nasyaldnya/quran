:root {
    --bg-color: #f3f4f6;
    --text-color: #1f2937;
    --card-bg: #ffffff;
    --primary-color: #0d9488;
    --primary-color-hover: #0f766e;
    --secondary-bg: #f9fafb;
    --border-color: #e5e7eb;
    --player-bg: rgba(249, 250, 251, 0.95);
    --icon-color: #4b5563;
}

html.dark {
    --bg-color: #000000;
    --text-color: #d1d5db;
    --card-bg: #111827;
    --primary-color: #2dd4bf;
    --primary-color-hover: #5eead4;
    --secondary-bg: #1f2937;
    --border-color: #374151;
    --player-bg: rgba(17, 24, 39, 0.95);
    --icon-color: #9ca3af;
}

body {
    font-family: 'Cairo', sans-serif;
    scroll-behavior: smooth;
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, color 0.3s ease;
}

.bg-card { background-color: var(--card-bg); }
.bg-secondary { background-color: var(--secondary-bg); }
.border-custom { border-color: var(--border-color); }
.text-primary { color: var(--primary-color); }
.bg-primary { background-color: var(--primary-color); }
.hover\:bg-primary-hover:hover { background-color: var(--primary-color-hover); }
.text-icon { color: var(--icon-color); }

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--secondary-bg); border-radius: 10px; }
::-webkit-scrollbar-thumb { background: #a0aec0; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #718096; }

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: var(--primary-color);
    animation: spin 1s ease infinite;
}

.playing { background-color: var(--primary-color) !important; color: white !important; font-weight: 700; }
.queue-item-playing { background-color: rgba(13, 148, 136, 0.1); border-right: 4px solid var(--primary-color); }

.favorite-star.favorited { color: #f59e0b; }
.dragging { opacity: 0.5; background: #e0f2fe; }

#player-container {
    transition: max-height 0.5s ease-in-out, transform 0.3s ease-in-out;
    max-height: 180px; 
    background-color: var(--player-bg);
}
#player-container.queue-open { max-height: 85vh; }

@keyframes fade-in-out {
    0% { opacity: 0; transform: translateX(100%); }
    10%, 90% { opacity: 1; transform: translateX(0); }
    100% { opacity: 0; transform: translateX(100%); }
}
.animate-toast { animation: fade-in-out 3s ease-in-out forwards; }

/* Ripple Effect */
.ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.7);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
}
@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
