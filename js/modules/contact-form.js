/**
 * Contact Form Module
 * Handles form submission and validation
 */

export function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Show success message
        showToast('Mensaje enviado correctamente. ¡Nos pondremos en contacto pronto!', 'success');

        // Reset form
        form.reset();

        // Log data (in production, send to server)
        console.log('Form submitted:', data);
    });
}

/**
 * Toast notification helper
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}
