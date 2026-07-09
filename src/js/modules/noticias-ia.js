/**
 * Noticias IA Carousel Module
 * Renderizado dinámico desde datos y navegación por filtros y swipe.
 */

import { NOTICIAS } from '../../data/noticias.js';

export function initNoticiasIA() {
    const track = document.getElementById('noticiasTrack');
    const prevBtn = document.getElementById('noticiasPrev');
    const nextBtn = document.getElementById('noticiasNext');
    const filterBtns = document.querySelectorAll('#noticiasFilters .filter-btn');

    if (!track) return;

    let currentFilter = 'todas';
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let allCards = [];

    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getVisibleCards() {
        if (currentFilter === 'todas') {
            return allCards.filter(card => !card.classList.contains('hidden'));
        }
        return allCards.filter(card => card.dataset.category === currentFilter && !card.classList.contains('hidden'));
    }

    function renderCards() {
        track.innerHTML = '';
        allCards = NOTICIAS.map((noticia) => {
            const article = document.createElement('article');
            article.className = 'noticia-card';
            article.dataset.category = noticia.category;
            article.dataset.id = noticia.id;
            article.tabIndex = 0;
            article.setAttribute('role', 'button');
            article.setAttribute('aria-label', `Ver noticia: ${noticia.title}`);

            const linkHtml = noticia.url
                ? `<span class="noticia-link"><i class="fas fa-external-link-alt"></i> Ver más</span>`
                : '';

            article.innerHTML = `
                <div class="noticia-icon">
                    <i class="fas ${noticia.icon}"></i>
                </div>
                <div class="noticia-content">
                    <span class="noticia-category">${capitalize(noticia.category.replace('-', ' '))}</span>
                    <h3>${noticia.title}</h3>
                    <p>${noticia.summary}</p>
                    <span class="noticia-date"><i class="fas fa-calendar"></i> ${noticia.date}</span>
                    ${linkHtml}
                </div>
            `;

            if (noticia.url) {
                const url = noticia.url;
                article.addEventListener('click', () => {
                    if (url) window.open(url, '_blank');
                });
                article.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && url) window.open(url, '_blank');
                });
            }

            track.appendChild(article);
            return article;
        });
    }

    function capitalize(text) {
        return text
            .replace(/\b\w/g, (c) => c.toUpperCase())
            .replace('Ia', 'IA');
    }

    function updateCarousel() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, visibleCards.length - cardsPerView);
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

        if (visibleCards.length > 0) {
            const slideWidth = visibleCards[0].offsetWidth + 30;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }

        if (prevBtn) {
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        }
        if (nextBtn) {
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
            nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
        }
    }

    function filterCards(category) {
        currentFilter = category;
        currentIndex = 0;

        allCards.forEach((card) => {
            const match = category === 'todas' || card.dataset.category === category;
            card.classList.toggle('hidden', !match);
        });

        updateCarousel();
    }

    function goToSlide(index) {
        const visibleCards = getVisibleCards();
        if (!visibleCards.length) return;
        const maxIndex = Math.max(0, visibleCards.length - cardsPerView);
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCards(btn.dataset.filter);
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const visibleCards = getVisibleCards();
            const maxIndex = Math.max(0, visibleCards.length - cardsPerView);
            goToSlide(currentIndex + 1);
        });
    }

    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        const swipeThreshold = 50;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        }
    }

    document.addEventListener('keydown', (e) => {
        const section = document.getElementById('noticias');
        const rect = section?.getBoundingClientRect();

        if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft') {
                goToSlide(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                goToSlide(currentIndex + 1);
            }
        }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                goToSlide(currentIndex);
            }
        }, 250);
    });

    renderCards();
    updateCarousel();
}
