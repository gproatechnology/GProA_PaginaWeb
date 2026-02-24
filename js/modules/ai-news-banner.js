/**
 * AI News Banner Module
 * Handles the news ticker and banner visibility
 */

export function initAINewsBanner() {
    const banner = document.getElementById('aiNewsBanner');
    const closeBtn = document.getElementById('aiNewsClose');
    
    if (!banner) return;

    // Add class to body for proper spacing
    document.body.classList.add('has-banner');

    // Close button functionality
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            banner.classList.add('hidden');
            document.body.classList.remove('has-banner');
            
            // Store preference in localStorage
            localStorage.setItem('aiNewsBannerHidden', 'true');
        });
    }

    // Check if user previously closed the banner
    if (localStorage.getItem('aiNewsBannerHidden') === 'true') {
        banner.classList.add('hidden');
        document.body.classList.remove('has-banner');
    }

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

