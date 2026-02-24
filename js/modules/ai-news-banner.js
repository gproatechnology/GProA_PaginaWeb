/**
 * AI News Banner Module
 * Handles the news ticker animation
 */

export function initAINewsBanner() {
    const banner = document.getElementById('aiNewsBanner');
    
    if (!banner) return;

    // Add class to body for proper spacing
    document.body.classList.add('has-banner');

    // Pause animation on hover
    const track = document.getElementById('aiNewsTrack');
    if (track) {
        banner.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });

        banner.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    }
}

