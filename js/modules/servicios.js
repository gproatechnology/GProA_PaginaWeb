/**
 * Servicios Module
 * Handles expandable service cards
 */

export function initServicios() {
    const servicioCards = document.querySelectorAll('.servicio-card');
    
    servicioCards.forEach(card => {
        const header = card.querySelector('.servicio-header');
        const toggle = card.querySelector('.servicio-toggle');
        
        const toggleCard = () => {
            const isExpanded = card.classList.contains('expanded');
            
            // Close all other cards
            servicioCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                    const otherToggle = otherCard.querySelector('.servicio-toggle');
                    if (otherToggle) {
                        otherToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            // Toggle current card
            card.classList.toggle('expanded');
            
            // Update aria-expanded
            if (toggle) {
                toggle.setAttribute('aria-expanded', !isExpanded);
            }
            
            // Smooth scroll to card if expanding
            if (!isExpanded) {
                setTimeout(() => {
                    card.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 100);
            }
        };
        
        if (header) {
            header.addEventListener('click', toggleCard);
        }
        
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleCard();
            });
        }
        
        // Keyboard accessibility
        header?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCard();
            }
        });
    });
}
