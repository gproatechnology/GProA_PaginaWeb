/**
 * Floating Symbols Module
 * Creates animated floating symbols in background
 */

export function initFloatingSymbols() {
    const container = document.getElementById('symbolsContainer');
    if (!container) return;

    const symbols = ['⚡', '💡', '🔧', '⚙️', '🤖', '📊', '💻', '🚀', '🎯', '💎'];

    for (let i = 0; i < 15; i++) {
        const symbol = document.createElement('div');
        symbol.className = 'floating-symbol';
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        symbol.style.left = `${Math.random() * 100}%`;
        symbol.style.animationDelay = `${Math.random() * 20}s`;
        symbol.style.animationDuration = `${15 + Math.random() * 15}s`;
        container.appendChild(symbol);
    }
}
