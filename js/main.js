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
import './modules/gartner-charts.js';
import './modules/org-modal.js';

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroCanvas();
    initFloatingSymbols();
    initServicios();
    initProjectTabs();
    initContactForm();
    initScrollEffects();
});
