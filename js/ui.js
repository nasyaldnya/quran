// ============================================================
// ui.js — All DOM rendering. Reads state, writes DOM. No logic.
// ============================================================

import { state } from './state.js';
import { t, getLang } from './i18n.js';
import { Icons, formatTime, normalizeArabic, $ } from './utils.js';

// ── Toast Notifications ─────────────────────────────────────

const toastContainer = () => $('toast-container');

export function showToast(message, type = 'success') {
  const container = toastContainer();
  if (!container) return;

  const colors = {
    success: 'bg-teal-600',
    warning: 'bg-amber-500',
    error:   'bg-red-500',
  };

  const toast = document.createElement('div');
  toast.className = `flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm shadow-xl
    backdrop-blur-sm animate-slide-up ${colors[type] || colors.success}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  const icon = type === 'success' ? Icons.check : type === 'error' ? Icons.close : '⚠';
  toast.innerHTML = `<span class="w-4 h-4 flex-shrink-0">${icon}</span><span>${message}</span>`;

  container.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Skeleton Loaders ────────────────────────────────────────

function skeletonCard() {
  return `<div class="skeleton-card animate-pulse rounded-2xl bg-surface-2 p-4 flex items-center gap-3">
    <div class="w-12 h-12 rounded-full bg-skeleton flex-shrink-0"></div>
    <div class="flex-1 space-y-2">
      <div class="h-3 bg-skeleton rounded w-3/4"></div>
      <div class="h-2 bg-skeleton rounded w-1/2"></div>
    </div>
  </div>`;
}

export function showSkeletons(count = 8) {
  const list = $('reciters-list');
  if (!list) return;
  list.innerHTML = Array(count).fill(skeletonCard()).join('');
}

// ── Reciters List ────────────────────────────────────────────

/**
 * Render the reciters grid.
 * Filters by searchQuery from state.
 */
export function renderReciters(reciters, onSelect, onFavorite) {
  const list = $('reciters-list');
  if (!list) return;

  const query = normalizeArabic(state.searchQuery);

  const filtered = query
    ? reciters.filter((r) => normalizeArabic(r.name).includes(query))
    : reciters;

  if (!filtered.length) {
    list.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-16 text-muted gap-3">
        <svg class="w-16 h-16 opacity-30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <p class="text-sm font-medium" data-i18n="noReciters">${t('noReciters')}</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map((r) => reciterCard(r, onFavorite)).join('');

  // Attach click handlers
  list.querySelectorAll('.reciter-card').forEach((card) => {
    const id = parseInt(card.dataset.id, 10);
    const reciter = filtered.find((r) => r.id === id);
    if (!reciter) return;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn')) return;
      onSelect(reciter);
      highlightReciter(id);
    });

    card.querySelector('.fav-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      onFavorite(id);
    });
  });
}

function reciterCard(reciter, _onFavorite) {
  const isFav = state.favorites.includes(reciter.id);
  const initial = reciter.name.charAt(0);
  const moshafCount = reciter.moshaf?.length ?? 0;
  const isActive = state.queue[state.currentIndex]?.reciter?.id === reciter.id;

  return `
    <div class="reciter-card group relative cursor-pointer rounded-2xl bg-surface-2 hover:bg-surface-3
      border border-border hover:border-primary/30 transition-all duration-200 p-4
      flex items-center gap-3 ${isActive ? 'ring-2 ring-primary' : ''}"
      data-id="${reciter.id}"
      role="button"
      tabindex="0"
      aria-label="${reciter.name}">

      <!-- Avatar -->
      <div class="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center
        text-lg font-bold text-white bg-gradient-to-br from-teal-500 to-teal-700
        select-none shadow-sm">
        ${initial}
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-text truncate text-sm leading-tight">${reciter.name}</p>
        <p class="text-xs text-muted mt-0.5">
          ${moshafCount} ${getLang() === 'ar' ? 'رواية' : moshafCount === 1 ? 'riwaya' : 'riwayat'}
        </p>
      </div>

      <!-- Playing indicator -->
      ${isActive ? `<span class="text-primary w-4 h-4 flex-shrink-0">${Icons.playing}</span>` : ''}

      <!-- Favorite button -->
      <button class="fav-btn flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        transition-colors duration-150
        ${isFav ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'text-muted hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10'}"
        aria-label="${isFav ? t('removeFavorite') : t('addFavorite')}"
        title="${isFav ? t('removeFavorite') : t('addFavorite')}">
        <span class="w-4 h-4">${isFav ? Icons.heart : Icons.heartOutline}</span>
      </button>
    </div>`;
}

function highlightReciter(id) {
  document.querySelectorAll('.reciter-card').forEach((c) => {
    c.classList.toggle('ring-2', parseInt(c.dataset.id, 10) === id);
    c.classList.toggle('ring-primary', parseInt(c.dataset.id, 10) === id);
  });
}

// ── Reciter Details Panel ────────────────────────────────────

export function renderReciterDetails(reciter, handlers) {
  const panel = $('reciter-details');
  if (!panel) return;

  $('details-placeholder')?.classList.add('hidden');
  panel.classList.remove('hidden');

  panel.innerHTML = `
    <!-- Header -->
    <div class="flex items-start gap-4 mb-6">
      <div class="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center
        text-2xl font-bold text-white bg-gradient-to-br from-teal-500 to-teal-700 shadow-md">
        ${reciter.name.charAt(0)}
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-xl font-bold text-text leading-tight">${reciter.name}</h2>
        <p class="text-sm text-muted mt-1">
          ${reciter.moshaf?.length ?? 0} ${getLang() === 'ar' ? 'رواية متاحة' : 'riwayat available'}
        </p>
      </div>
    </div>

    <!-- Moshaf Tabs -->
    <div id="moshaf-tabs" class="flex flex-wrap gap-2 mb-4">
      ${(reciter.moshaf || []).map((m, i) => `
        <button class="moshaf-tab px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
          ${i === 0 ? 'bg-primary text-white border-primary' : 'bg-transparent text-muted border-border hover:border-primary hover:text-primary'}"
          data-moshaf-index="${i}">
          ${m.name}
        </button>
      `).join('')}
    </div>

    <!-- Surah List -->
    <div id="surah-list-container"></div>
  `;

  // Render first moshaf by default
  if (reciter.moshaf?.length) {
    renderSurahList(reciter, reciter.moshaf[0], handlers);
  }

  // Tab switching
  panel.querySelectorAll('.moshaf-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      panel.querySelectorAll('.moshaf-tab').forEach((t) => {
        t.classList.remove('bg-primary', 'text-white', 'border-primary');
        t.classList.add('bg-transparent', 'text-muted', 'border-border');
      });
      tab.classList.add('bg-primary', 'text-white', 'border-primary');
      tab.classList.remove('bg-transparent', 'text-muted', 'border-border');
      const idx = parseInt(tab.dataset.moshafIndex, 10);
      renderSurahList(reciter, reciter.moshaf[idx], handlers);
    });
  });
}

function renderSurahList(reciter, moshaf, handlers) {
  const container = $('surah-list-container');
  if (!container) return;

  const availableIds = new Set(moshaf.surah_list.split(',').map(Number));
  const availableSurahs = state.allSurahs.filter((s) => s && availableIds.has(s.id));

  container.innerHTML = `
    <!-- Play All / Add All -->
    <div class="flex gap-2 mb-4">
      <button id="play-all-btn"
        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
          bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
        <span class="w-4 h-4">${Icons.play}</span>
        <span data-i18n="playAll">${t('playAll')}</span>
      </button>
      <button id="add-all-btn"
        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
          bg-surface-3 text-text text-sm font-medium border border-border hover:border-primary/50 transition-colors">
        <span class="w-4 h-4">${Icons.queue}</span>
        <span data-i18n="addAll">${t('addAll')}</span>
      </button>
    </div>

    <!-- Surah Grid -->
    <div class="grid grid-cols-1 gap-1.5 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
      ${availableSurahs.map((surah) => surahRow(reciter, moshaf, surah)).join('')}
    </div>
  `;

  // Play All
  container.querySelector('#play-all-btn')?.addEventListener('click', () => {
    handlers.handlePlayAll(reciter, moshaf, true);
  });

  // Add All
  container.querySelector('#add-all-btn')?.addEventListener('click', () => {
    handlers.handlePlayAll(reciter, moshaf, false);
  });

  // Individual surah buttons
  container.querySelectorAll('.surah-row').forEach((row) => {
    const surahId = parseInt(row.dataset.surahId, 10);
    const surah   = availableSurahs.find((s) => s.id === surahId);
    if (!surah) return;

    row.querySelector('.play-btn')?.addEventListener('click', () => {
      handlers.playSurah({ reciter, moshaf, surah });
    });
    row.querySelector('.queue-btn')?.addEventListener('click', () => {
      handlers.addToQueue({ reciter, moshaf, surah });
    });
  });
}

function surahRow(reciter, moshaf, surah) {
  const isPlaying =
    state.queue[state.currentIndex]?.surah?.id === surah.id &&
    state.queue[state.currentIndex]?.reciter?.id === reciter.id;

  const typeIcon = surah.type === 'مكية' || surah.type === 'Meccan'
    ? Icons.makkah : Icons.madinah;

  return `
    <div class="surah-row group flex items-center gap-3 px-3 py-2.5 rounded-xl
      hover:bg-surface-3 transition-colors cursor-default" data-surah-id="${surah.id}">

      <!-- Number -->
      <span class="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg
        bg-surface-3 text-xs font-bold text-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        ${surah.id}
      </span>

      <!-- Name + type -->
      <div class="flex-1 min-w-0">
        <span class="text-sm font-medium text-text">${surah.name}</span>
        <span class="text-xs text-muted mx-1.5">${typeIcon}</span>
      </div>

      <!-- Playing indicator -->
      ${isPlaying ? `<span class="text-primary w-4 h-4">${Icons.playing}</span>` : ''}

      <!-- Actions -->
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button class="play-btn w-7 h-7 rounded-lg flex items-center justify-center
          bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
          aria-label="${t('playNow')} ${surah.name}">
          <span class="w-3.5 h-3.5">${Icons.play}</span>
        </button>
        <button class="queue-btn w-7 h-7 rounded-lg flex items-center justify-center
          bg-surface-3 text-muted hover:bg-primary/10 hover:text-primary transition-colors"
          aria-label="${t('addToQueue')} ${surah.name}">
          <span class="w-3.5 h-3.5">${Icons.queue}</span>
        </button>
      </div>
    </div>`;
}

// ── Filter Dropdowns ─────────────────────────────────────────

export function renderLanguages(languages, currentLang) {
  const sel = $('language-select');
  if (!sel) return;
  sel.innerHTML = languages.map((l) =>
    `<option value="${l.language_code}" ${l.language_code === currentLang ? 'selected' : ''}>
      ${l.native_name || l.language_name}
    </option>`
  ).join('');
}

export function renderRiwayat(riwayat) {
  const sel = $('riwaya-select');
  if (!sel) return;
  sel.innerHTML = `<option value="" data-i18n="allRiwayat">${t('allRiwayat')}</option>` +
    riwayat.map((r) => `<option value="${r.rewaya_id}">${r.name}</option>`).join('');
}

export function renderSurahFilter(surahs) {
  const sel = $('surah-select');
  if (!sel) return;
  sel.innerHTML = `<option value="" data-i18n="allSurahs">${t('allSurahs')}</option>` +
    surahs.map((s) => `<option value="${s.id}">${s.id}. ${s.name}</option>`).join('');
}

// ── Queue Panel ──────────────────────────────────────────────

export function renderQueue(handlers) {
  const list        = $('queue-list');
  const placeholder = $('queue-placeholder');
  const badge       = $('queue-badge');

  if (!list) return;

  if (badge) badge.textContent = state.queue.length || '';

  if (!state.queue.length) {
    list.innerHTML = '';
    placeholder?.classList.remove('hidden');
    return;
  }

  placeholder?.classList.add('hidden');

  list.innerHTML = state.queue.map((track, i) => {
    const isCurrent = i === state.currentIndex;
    return `
      <div class="queue-item group flex items-center gap-3 px-3 py-2.5 rounded-xl
        transition-colors cursor-pointer
        ${isCurrent ? 'bg-primary/10 text-primary' : 'hover:bg-surface-3 text-text'}"
        data-index="${i}" role="listitem">

        <!-- Index / playing icon -->
        <span class="w-5 h-5 flex-shrink-0 flex items-center justify-center text-xs font-bold">
          ${isCurrent ? `<span class="w-4 h-4">${Icons.playing}</span>` : i + 1}
        </span>

        <!-- Track info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">${track.surah?.name ?? ''}</p>
          <p class="text-xs text-muted truncate">${track.reciter?.name ?? ''}</p>
        </div>

        <!-- Remove button -->
        <button class="remove-btn w-6 h-6 rounded-md flex items-center justify-center
          opacity-0 group-hover:opacity-100 text-muted hover:text-red-500 transition-all"
          aria-label="${t('removeFromQueue')}">
          <span class="w-3.5 h-3.5">${Icons.close}</span>
        </button>
      </div>`;
  }).join('');

  list.querySelectorAll('.queue-item').forEach((item) => {
    const idx = parseInt(item.dataset.index, 10);
    item.addEventListener('click', (e) => {
      if (e.target.closest('.remove-btn')) return;
      handlers.playTrackAtIndex(idx);
    });
    item.querySelector('.remove-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handlers.removeFromQueue(idx);
    });
  });
}

// ── Now Playing Bar ──────────────────────────────────────────

export function updateNowPlaying(track) {
  const titleEl    = $('now-playing-title');
  const reciterEl  = $('now-playing-reciter');
  const surahNumEl = $('now-playing-surah-num');

  if (!track) {
    if (titleEl)    titleEl.textContent   = t('nowPlaying');
    if (reciterEl)  reciterEl.textContent = '';
    if (surahNumEl) surahNumEl.textContent = '';
    return;
  }

  if (titleEl)    titleEl.textContent   = track.surah?.name ?? '';
  if (reciterEl)  reciterEl.textContent = track.reciter?.name ?? '';
  if (surahNumEl) surahNumEl.textContent = track.surah?.id ?? '';
}

export function updateProgress(currentTime, duration) {
  const bar      = $('progress-bar');
  const current  = $('current-time');
  const total    = $('total-duration');

  const pct = duration ? (currentTime / duration) * 100 : 0;

  if (bar)     bar.style.width = `${pct}%`;
  if (current) current.textContent = formatTime(currentTime);
  if (total)   total.textContent   = formatTime(duration);
}

export function updatePlayerControls(isPlaying) {
  const playIcon  = $('play-icon');
  const pauseIcon = $('pause-icon');

  if (playIcon)  playIcon.classList.toggle('hidden', isPlaying);
  if (pauseIcon) pauseIcon.classList.toggle('hidden', !isPlaying);
}

export function updateRepeatBtn() {
  const btn = $('repeat-btn');
  if (!btn) return;

  const modes = {
    off: { icon: Icons.repeat,    cls: 'text-muted',   title: t('repeat') },
    one: { icon: Icons.repeatOne, cls: 'text-primary', title: t('repeatOne') },
    all: { icon: Icons.repeat,    cls: 'text-primary', title: t('repeatAll') },
  };

  const m = modes[state.repeatMode] || modes.off;
  btn.innerHTML = `<span class="w-5 h-5">${m.icon}</span>`;
  btn.className = btn.className.replace(/text-\w+/g, '') + ` ${m.cls}`;
  btn.title = m.title;
}

export function updateShuffleBtn() {
  const btn = $('shuffle-btn');
  if (!btn) return;
  btn.classList.toggle('text-primary', state.isShuffled);
  btn.classList.toggle('text-muted', !state.isShuffled);
}

// ── Sleep Timer Display ──────────────────────────────────────

export function updateSleepTimerDisplay(secondsRemaining) {
  const display = $('sleep-timer-display');
  const cancel  = $('cancel-sleep-btn');

  if (!display) return;

  if (secondsRemaining <= 0) {
    display.textContent = '';
    cancel?.classList.add('hidden');
    return;
  }

  display.textContent = formatTime(secondsRemaining);
  cancel?.classList.remove('hidden');
}

// ── Recently Played ──────────────────────────────────────────

export function renderRecentlyPlayed(handlers) {
  const container = $('recently-played');
  if (!container) return;

  if (!state.recentlyPlayed.length) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  const list = container.querySelector('.recent-list');
  if (!list) return;

  list.innerHTML = state.recentlyPlayed.map((track) => `
    <div class="recent-track flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-3
      cursor-pointer transition-colors" data-key="${track.reciter?.id}-${track.moshaf?.id}-${track.surah?.id}">
      <div class="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center
        text-sm font-bold text-white bg-gradient-to-br from-teal-500 to-teal-700">
        ${track.reciter?.name?.charAt(0) ?? '?'}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-text truncate">${track.surah?.name ?? ''}</p>
        <p class="text-xs text-muted truncate">${track.reciter?.name ?? ''}</p>
      </div>
      <span class="w-4 h-4 text-primary flex-shrink-0">${Icons.history}</span>
    </div>
  `).join('');

  list.querySelectorAll('.recent-track').forEach((item) => {
    item.addEventListener('click', () => {
      const [rid, mid, sid] = item.dataset.key.split('-');
      const track = state.recentlyPlayed.find(
        (t) => String(t.reciter?.id) === rid &&
               String(t.moshaf?.id) === mid &&
               String(t.surah?.id) === sid
      );
      if (track) handlers.playSurah(track);
    });
  });
}

// ── Home Placeholder (shown when no reciter selected) ────────

export function showDetailsPlaceholder() {
  $('reciter-details')?.classList.add('hidden');
  $('details-placeholder')?.classList.remove('hidden');
}

// ── Speed display ────────────────────────────────────────────

export function updateSpeedDisplay(rate) {
  const el = $('speed-display');
  if (el) el.textContent = `${rate}×`;
}
