/**
 * Focus Trap Utility
 * Traps keyboard focus inside a modal and restores it on close.
 */

export function trapFocus({ modal, onClose, restoreSelector }) {
    if (!modal) return null;

    const getFocusableElements = () => {
        const selector = [
            'button:not([disabled])',
            '[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');
        return Array.from(modal.querySelectorAll(selector)).filter(el => el.offsetParent !== null);
    };

    const previouslyFocused = restoreSelector
        ? document.querySelector(restoreSelector)
        : document.activeElement;

    const firstFocusable = () => getFocusableElements()[0];
    const lastFocusable = () => getFocusableElements()[getFocusableElements().length - 1];

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onClose?.();
            return;
        }

        if (event.key !== 'Tab') return;

        const focusable = getFocusableElements();
        if (!focusable.length) return;

        const first = firstFocusable();
        const last = lastFocusable();

        if (event.shiftKey) {
            if (document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    };

    const cleanup = () => {
        modal.removeEventListener('keydown', handleKeyDown);
        modal.removeEventListener('click', backdropHandler);

        if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
            previouslyFocused.focus();
        }
    };

    const backdropHandler = (event) => {
        if (event.target === modal) {
            onClose?.();
        }
    };

    modal.addEventListener('keydown', handleKeyDown);
    modal.addEventListener('click', backdropHandler);

    setTimeout(() => firstFocusable()?.focus(), 0);

    return cleanup;
}
