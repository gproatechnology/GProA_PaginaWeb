/**
 * Noticias IA Carousel Module
 * Navegación estilo Windows Explorer con puntos
 */

export function initNoticiasIA() {
    const track = document.getElementById('noticiasTrack');
    const dots = document.querySelectorAll('.noticia-dot');
    const prevBtn = document.getElementById('noticiasPrev');
    const nextBtn = document.getElementById('noticiasNext');
    
    if (!track || !dots.length) return;

    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    const totalCards = track.children.length;
    const maxIndex = Math.max(0, totalCards - cardsPerView);

    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function updateCarousel() {
        const cardWidth = track.children[0].offsetWidth + 30; // width + gap
        const offset = currentIndex * cardWidth;
        track.style.transform = `translateX(-${offset}px)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

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

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
    }

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
                // Recalculate max index
                const newMaxIndex = Math.max(0, totalCards - cardsPerView);
                if (currentIndex > newMaxIndex) {
                    currentIndex = newMaxIndex;
                }
                updateCarousel();
            }
        }, 250);
    });

    // Auto-play (optional - disabled by default)
    // Uncomment to enable auto-play
    /*
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateCarousel();
        }, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    const carousel = document.querySelector('.noticias-carousel');
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    startAutoPlay();
    */

    // Initial update
    updateCarousel();
}
