/**
 * Project Tabs Module
 * Handles project tab switching
 */

export function initProjectTabs() {
    const tabs = document.querySelectorAll('.proyecto-tab');
    const cards = document.querySelectorAll('.proyecto-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const proyecto = tab.dataset.proyecto;

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update cards
            cards.forEach(c => c.classList.remove('active'));
            const targetCard = document.getElementById(`proyecto-${proyecto}`);
            if (targetCard) {
                targetCard.classList.add('active');
            }
        });
    });
}
