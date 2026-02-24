/**
 * Noticias IA Carousel Module
 * Navegación estilo Windows Explorer con puntos y filtros
 */

export function initNoticiasIA() {
    const track = document.getElementById('noticiasTrack');
    const dots = document.querySelectorAll('.noticia-dot');
    const prevBtn = document.getElementById('noticiasPrev');
    const nextBtn = document.getElementById('noticiasNext');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (!track) return;

    let currentIndex = 0;
    let currentFilter = 'todas';
    let cardsPerView = getCardsPerView();

    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getVisibleCards() {
        const allCards = Array.from(track.querySelectorAll('.noticia-card'));
        if (currentFilter === 'todas') {
            return allCards.filter(card => !card.classList.contains('hidden'));
        }
        return allCards.filter(card => card.dataset.category === currentFilter && !card.classList.contains('hidden'));
    }

    function updateDots() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, visibleCards.length - cardsPerView);
        
        // Update dots visibility
        dots.forEach((dot, index) => {
            dot.style.display = index < visibleCards.length ? 'block' : 'none';
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function updateCarousel() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, visibleCards.length - cardsPerView);
        
        // Ensure currentIndex is within bounds
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

        if (visibleCards.length > 0) {
            const cardWidth = visibleCards[0].offsetWidth + 30; // width + gap
            const offset = currentIndex * cardWidth;
            track.style.transform = `translateX(-${offset}px)`;
        }

        // Update dots
        updateDots();

        // Update button states
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
        
        const allCards = track.querySelectorAll('.noticia-card');
        
        allCards.forEach((card, index) => {
            if (category === 'todas' || card.dataset.category === category) {
                card.classList.remove('hidden');
                // Reset animation
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.05}s`;
            } else {
                card.classList.add('hidden');
            }
        });

        // Small delay to allow cards to be filtered before updating carousel
        setTimeout(updateCarousel, 50);
    }

    function goToSlide(index) {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, visibleCards.length - cardsPerView);
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
    }

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCards(btn.dataset.filter);
        });
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // Arrow navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }

    // Touch/Swipe support
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
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                goToSlide(currentIndex + 1);
            } else {
                // Swipe right - prev
                goToSlide(currentIndex - 1);
            }
        }
    }

    // Keyboard navigation
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

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                updateCarousel();
            }
        }, 250);
    });

    // Initial update
    updateCarousel();
}
