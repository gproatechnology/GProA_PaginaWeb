/**
 * Scroll Effects Module
 * Handles scroll-based animations and reveal effects
 */

export function initScrollEffects() {
    // Reveal elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.servicio-card, .tech-card, .proyecto-card').forEach(el => {
        observer.observe(el);
    });
}
