/**
 * GProA Technology - Landing Page v3
 * Main JavaScript Entry Point
 */

// Import modules
import { initNavigation } from './modules/navigation.js';
import { initHeroCanvas } from './modules/hero-canvas.js';
import { initFloatingSymbols } from './modules/floating-symbols.js';
import { initServicios } from './modules/servicios.js';
import { initProjectTabs } from './modules/project-tabs.js';
import { initContactForm } from './modules/contact-form.js';
import { initScrollEffects } from './modules/scroll-effects.js';
import { initNoticiasIA } from './modules/noticias-ia.js';
import './modules/gartner-charts.js';
import './modules/org-modal.js';

// Video fallback: show canvas only if video fails
function initVideoFallback() {
    const video = document.querySelector('.hero-video');
    const canvas = document.getElementById('heroCanvas');
    
    if (!video || !canvas) return;
    
    // Initially hide canvas, show video
    canvas.style.display = 'none';
    
    // When video can play, hide canvas
    video.addEventListener('canplay', () => {
        canvas.style.display = 'none';
    });
    
    // When video loads successfully, ensure canvas stays hidden
    video.addEventListener('loadeddata', () => {
        canvas.style.display = 'none';
    });
    
    // If video fails, show canvas as fallback
    video.addEventListener('error', () => {
        canvas.style.display = 'block';
    });
    
    // Also handle case where video source fails to load
    video.addEventListener('stalled', () => {
        // Give it a moment, if still stalled show canvas
        setTimeout(() => {
            if (video.readyState < 3) {
                canvas.style.display = 'block';
            }
        }, 3000);
    });
}

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroCanvas();
    initFloatingSymbols();
    initServicios();
    initProjectTabs();
    initContactForm();
    initScrollEffects();
    initNoticiasIA();
    initVideoFallback();
});
