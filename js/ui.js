import { DOM, normalizeArabic, collator, showToast, makkiIcon, madaniIcon, playingIcon, formatTime } from './utils.js';

let virtualObserver;
const VIRTUAL_ITEM_HEIGHT = 48;
const VIRTUAL_OVERSCAN = 5;

export const showLoader = (show) => {
    DOM.loader.style.display = 'none';
    if (show) {
        DOM.recitersList.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-item';
            skeleton.innerHTML = `<div class="skeleton-text"></div>`;
            DOM.recitersList.appendChild(skeleton);
        }
    }
};

export const renderReciters = (reciters, favorites, eventHandlers) => {
    if (virtualObserver) virtualObserver.disconnect();
    DOM.recitersList.innerHTML = '';

    const searchTerm = normalizeArabic(DOM.searchReciterInput.value.trim());
    let filteredReciters = reciters.filter(reciter =>
        normalizeArabic(reciter.name).includes(searchTerm)
    );

    filteredReciters.sort((a, b) => {
        const aIsFav = favorites.includes(a.id);
        const bIsFav = favorites.includes(b.id);
        if (aIsFav && !bIsFav) return -1;
        if (!aIsFav && bIsFav) return 1;
        return collator.compare(a.name, b.name);
    });

    if (filteredReciters.length === 0) {
        DOM.recitersList.innerHTML = `<p class="text-center text-gray-500 p-4">لم يتم العثور على قراء.</p>`;
        return;
    }

    const scrollContainer = document.createElement('div');
    scrollContainer.style.height = `${filteredReciters.length * VIRTUAL_ITEM_HEIGHT}px`;
    scrollContainer.style.position = 'relative';
    DOM.recitersList.appendChild(scrollContainer);

    virtualObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const element = entry.target;
            if (entry.isIntersecting) {
                const index = parseInt(element.dataset.index, 10);
                const reciter = filteredReciters[index];
                renderSingleReciter(element, reciter, favorites.includes(reciter.id), eventHandlers);
                virtualObserver.unobserve(element);
            }
        });
    }, { root: DOM.recitersList, rootMargin: `${VIRTUAL_OVERSCAN * VIRTUAL_ITEM_HEIGHT}px` });

    for (let i = 0; i < filteredReciters.length; i++) {
        const placeholder = document.createElement('div');
        placeholder.className = 'virtual-placeholder';
        placeholder.style.position = 'absolute';
        placeholder.style.top = `${i * VIRTUAL_ITEM_HEIGHT}px`;
        placeholder.style.height = `${VIRTUAL_ITEM_HEIGHT}px`;
        placeholder.style.width = '100%';
        placeholder.dataset.index = i;
        scrollContainer.appendChild(placeholder);
        virtualObserver.observe(placeholder);
    }
};

function renderSingleReciter(element, reciter, isFav, eventHandlers) {
    element.className = 'flex items-center justify-between w-full text-right p-3 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200';
    element.innerHTML = `
        <span>${reciter.name}</span>
        <button aria-label="${isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}" class="favorite-star text-2xl text-gray-300 hover:text-amber-400 ${isFav ? 'favorited' : ''}">
            ${isFav ? '★' : '☆'}
        </button>
    `;
    element.querySelector('.favorite-star').onclick = (e) => eventHandlers.toggleFavorite(e, reciter.id);
    element.onclick = () => {
        eventHandlers.selectReciter(reciter);
    };
}

export const renderLanguages = (data, currentLang) => {
    if (!data || !data.language) return;
    DOM.languageSelect.innerHTML = '';
    data.language.forEach(lang => {
        const val = getLanguageCode(lang.surah) || 'ar';
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = lang.native;
        if (val === currentLang) opt.selected = true;
        DOM.languageSelect.appendChild(opt);
    });
};

const getLanguageCode = (url) => {
    try {
        return new URL(url).searchParams.get('language');
    } catch (e) {
        console.error("Could not parse URL for language code:", url, e);
        return 'ar';
    }
};

export const renderRiwayat = (data) => {
    if (!data || !data.riwayat) return;
    DOM.riwayaSelect.innerHTML = '<option value="">كل الروايات</option>';
    data.riwayat.forEach(riwaya => {
        const option = document.createElement('option');
        option.value = riwaya.id;
        option.textContent = riwaya.name;
        DOM.riwayaSelect.appendChild(option);
    });
};

export const renderSurahs = (data) => {
    if (!data || !data.suwar) return [];
    DOM.surahSelect.innerHTML = '<option value="">كل السور</option>';
    data.suwar.forEach(surah => {
        const option = document.createElement('option');
        option.value = surah.id;
        option.textContent = `${surah.id}. ${surah.name}`;
        DOM.surahSelect.appendChild(option);
    });
    return data.suwar;
};

export const renderReciterDetails = (reciter, allSurahs, eventHandlers) => {
    if (DOM.detailsPlaceholder) DOM.detailsPlaceholder.style.display = 'none';
    DOM.reciterDetails.innerHTML = `
        <h3 class="text-2xl font-bold mb-4 text-primary">${reciter.name}</h3>
        <div class="space-y-4">
            ${reciter.moshaf.map((moshaf, index) => `
                <div class="bg-secondary p-3 rounded-lg">
                    <div class="flex flex-wrap gap-2 justify-between items-center mb-3">
                        <h4 class="font-semibold">${moshaf.name}</h4>
                        <div class="flex items-center gap-2">
                             <button aria-label="إضافة كل سور المصحف إلى قائمة التشغيل" data-moshaf-index-add="${index}" class="add-all-btn text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600">إضافة الكل</button>
                             <button aria-label="تشغيل كل سور المصحف" data-moshaf-index-play="${index}" class="play-all-btn text-xs bg-primary text-white px-3 py-1 rounded-full hover:bg-primary-hover">تشغيل الكل</button>
                        </div>
                    </div>
                     <div class="mb-3">
                         <input type="search" id="search-surah-input-${index}" placeholder="ابحث عن سورة..." class="bg-card border border-custom text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5">
                     </div>
                     <div class="text-xs text-gray-500 dark:text-gray-300 flex items-center gap-4 mb-3 px-1">
                        <span>مفتاح الرموز:</span>
                        <span class="flex items-center gap-1">🕋 سورة مكية</span>
                        <span class="flex items-center gap-1">🕌 سورة مدنية</span>
                     </div>
                    <div id="surah-list-${index}" class="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto p-1"></div>
                </div>
            `).join('')}
        </div>`;

    reciter.moshaf.forEach((moshaf, index) => {
        const surahListContainer = document.getElementById(`surah-list-${index}`);
        const availableIds = new Set(moshaf.surah_list.split(','));
        const surahsToRender = allSurahs.filter(s => s && availableIds.has(String(s.id)));

        surahsToRender.forEach(surah => {
            const surahItem = document.createElement('div');
            const icon = surah.makkia === 1 ? makkiIcon : madaniIcon;

            surahItem.id = `surah-item-${moshaf.id}-${surah.id}`;
            surahItem.className = `p-2 text-sm rounded-md transition-all duration-200 flex items-center justify-between gap-2 bg-card shadow-sm border border-custom`;

            surahItem.innerHTML = `
                <button aria-label="تشغيل سورة ${surah.name}" class="play-surah-btn flex-grow text-right flex items-center gap-2 overflow-hidden cursor-pointer">
                    ${icon}
                    <span class="truncate">${surah.name}</span>
                </button>
                <button aria-label="إضافة سورة ${surah.name} للقائمة" class="add-to-queue-btn p-1 rounded-full hover:bg-teal-100 dark:hover:bg-teal-900 cursor-pointer">
                    <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </button>
            `;

            surahItem.querySelector('.play-surah-btn').onclick = () => eventHandlers.playSurah({ reciter, moshaf, surah });
            surahItem.querySelector('.add-to-queue-btn').onclick = () => eventHandlers.addSurahToQueue({ reciter, moshaf, surah });
            surahListContainer.appendChild(surahItem);
        });
        
        DOM.reciterDetails.querySelector(`[data-moshaf-index-play="${index}"]`).onclick = () => eventHandlers.handlePlayAll(reciter, moshaf, true);
        DOM.reciterDetails.querySelector(`[data-moshaf-index-add="${index}"]`).onclick = () => eventHandlers.handlePlayAll(reciter, moshaf, false);
        DOM.reciterDetails.querySelector(`#search-surah-input-${index}`).addEventListener('input', (e) => {
            const searchTerm = normalizeArabic(e.target.value.trim().replace('سورة', '').trim());
            const items = surahListContainer.querySelectorAll('div');
            items.forEach(item => {
                const surahName = normalizeArabic(item.querySelector('span.truncate').textContent);
                item.style.display = surahName.includes(searchTerm) ? '' : 'none';
            });
        });
    });
    if (window.innerWidth < 1024) DOM.reciterDetails.scrollIntoView({ behavior: 'smooth' });
};

export const renderQueue = (queue, currentQueueIndex, eventHandlers) => {
    DOM.queueList.innerHTML = '';
    DOM.queuePlaceholder.style.display = queue.length === 0 ? 'block' : 'none';

    if (queue.length === 0) return;

    let draggedItem = null;

    queue.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = `queue-item flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50`;
        item.draggable = true;
        item.dataset.index = index;
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');

        const isPlaying = index === currentQueueIndex;
        if (isPlaying) {
            item.classList.add('queue-item-playing');
        }

        item.innerHTML = `
            <div class="flex items-center gap-2 overflow-hidden">
                <span class="drag-handle text-gray-400 cursor-grab flex-shrink-0">${isPlaying ? playingIcon : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`}</span>
                <div class="flex-grow overflow-hidden">
                    <p class="font-semibold truncate text-sm">${track.surah.name}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-300 truncate">${track.reciter.name}</p>
                </div>
            </div>
            <button aria-label="إزالة سورة ${track.surah.name} من القائمة" class="remove-from-queue-btn p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 flex-shrink-0">
                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        `;

        item.addEventListener('click', (e) => {
            if (!e.target.closest('.remove-from-queue-btn') && !e.target.closest('.drag-handle')) {
                eventHandlers.playTrackAtIndex(index);
            }
        });
        
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                eventHandlers.playTrackAtIndex(index);
            }
        });

        item.querySelector('.remove-from-queue-btn').addEventListener('click', () => eventHandlers.removeFromQueue(index));

        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            setTimeout(() => item.classList.add('dragging'), 0);
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            draggedItem = null;
        });
        item.addEventListener('dragover', e => {
            e.preventDefault();
            const target = e.target.closest('.queue-item');
            if (target && draggedItem && target !== draggedItem) {
                const rect = target.getBoundingClientRect();
                const offset = e.clientY - rect.top - rect.height / 2;
                DOM.queueList.insertBefore(draggedItem, offset < 0 ? target : target.nextSibling);
            }
        });

        DOM.queueList.appendChild(item);
    });
};

export const updatePlayerUI = (isPlaying, state) => {
    DOM.playPauseBtn.setAttribute('aria-label', isPlaying ? 'إيقاف' : 'تشغيل');
    DOM.playIcon.style.display = isPlaying ? 'none' : 'block';
    DOM.pauseIcon.style.display = isPlaying ? 'block' : 'none';

    const { currentQueueIndex, queue, repeatMode } = state;
    const canNavigate = queue.length > 1;
    DOM.nextBtn.disabled = !canNavigate && repeatMode !== 'all';
    DOM.prevBtn.disabled = !canNavigate;
    DOM.copyLinkBtn.disabled = queue.length === 0;
    DOM.downloadBtn.disabled = queue.length === 0;
};

export const updateProgress = (currentSound) => {
    if (!currentSound) return;
    const seek = currentSound.seek() || 0;
    const duration = currentSound.duration() || 0;
    
    const progressPercent = duration ? (seek / duration) * 100 : 0;
    DOM.progressBar.style.width = `${progressPercent}%`;
    DOM.currentTimeEl.textContent = formatTime(seek);
    if (!isNaN(duration)) DOM.totalDurationEl.textContent = formatTime(duration);
    DOM.progressBarContainer.setAttribute('aria-valuenow', String(progressPercent.toFixed(0)));
};


export const updateNowPlaying = (track) => {
    if (track) {
         DOM.nowPlaying.innerHTML = `
            <p class="font-bold text-primary truncate" title="${track.surah.name}">${track.surah.name}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 truncate" title="${track.reciter.name} - ${track.moshaf.name}">${track.reciter.name} - ${track.moshaf.name}</p>
        `;
        DOM.playerContainer.style.transform = 'translateY(0)';
    } else {
        DOM.nowPlaying.innerHTML = `
            <p class="font-bold text-primary truncate">لم يتم تحديد أي مقطع</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 truncate">-</p>
        `;
    }
}