/**
 * Contact Form Module
 * Handles form validation and submission via Formspree
 */

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdklrzab';

/**
 * Validation rules for form fields
 */
const validationRules = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/,
        messages: {
            required: 'El nombre es requerido',
            minLength: 'El nombre debe tener al menos 2 caracteres',
            maxLength: 'El nombre no puede exceder 100 caracteres',
            pattern: 'El nombre contiene caracteres inválidos'
        }
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        messages: {
            required: 'El email es requerido',
            pattern: 'Por favor ingresa un email válido'
        }
    },
    subject: {
        required: true,
        minLength: 5,
        maxLength: 200,
        messages: {
            required: 'El asunto es requerido',
            minLength: 'El asunto debe tener al menos 5 caracteres',
            maxLength: 'El asunto no puede exceder 200 caracteres'
        }
    },
    message: {
        required: true,
        minLength: 10,
        maxLength: 2000,
        messages: {
            required: 'El mensaje es requerido',
            minLength: 'El mensaje debe tener al menos 10 caracteres',
            maxLength: 'El mensaje no puede exceder 2000 caracteres'
        }
    }
};

/**
 * Validate a single field
 * @param {string} fieldName - Name of the field to validate
 * @param {string} value - Value of the field
 * @returns {object} - { isValid: boolean, error: string|null }
 */
function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    if (!rules) return { isValid: true, error: null };

    const trimmedValue = value.trim();

    // Required check
    if (rules.required && !trimmedValue) {
        return { isValid: false, error: rules.messages.required };
    }

    // MinLength check
    if (rules.minLength && trimmedValue.length < rules.minLength) {
        return { isValid: false, error: rules.messages.minLength };
    }

    // MaxLength check
    if (rules.maxLength && trimmedValue.length > rules.maxLength) {
        return { isValid: false, error: rules.messages.maxLength };
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.test(trimmedValue)) {
        return { isValid: false, error: rules.messages.pattern };
    }

    return { isValid: true, error: null };
}

/**
 * Show error message for a field
 * @param {string} fieldName - Name of the field
 * @param {string} message - Error message to display
 */
function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputElement = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
    
    if (inputElement) {
        inputElement.classList.add('invalid');
        inputElement.setAttribute('aria-invalid', 'true');
    }
}

/**
 * Clear error message for a field
 * @param {string} fieldName - Name of the field
 */
function clearFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputElement = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }
    
    if (inputElement) {
        inputElement.classList.remove('invalid');
        inputElement.setAttribute('aria-invalid', 'false');
    }
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - Form element
 * @returns {boolean} - Whether form is valid
 */
function validateForm(form) {
    let isValid = true;
    const fields = ['name', 'email', 'subject', 'message'];

    fields.forEach(fieldName => {
        const input = form.querySelector(`[name="${fieldName}"]`);
        if (input) {
            const validation = validateField(fieldName, input.value);
            if (!validation.isValid) {
                showFieldError(fieldName, validation.error);
                isValid = false;
            } else {
                clearFieldError(fieldName);
            }
        }
    });

    return isValid;
}

/**
 * Set form loading state
 * @param {boolean} isLoading - Loading state
 */
function setLoadingState(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');

    if (submitBtn) {
        submitBtn.disabled = isLoading;
    }

    if (btnText && btnLoading) {
        btnText.style.display = isLoading ? 'none' : 'inline';
        btnLoading.style.display = isLoading ? 'inline' : 'none';
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

/**
 * Submit form to Formspree
 * @param {HTMLFormElement} form - Form element
 * @param {FormData} formData - Form data
 */
async function submitToFormspree(form, formData) {
    try {
        setLoadingState(true);

        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            showToast('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', 'success');
            form.reset();
            
            // Clear any remaining error states
            ['name', 'email', 'subject', 'message'].forEach(clearFieldError);
        } else {
            const data = await response.json();
            throw new Error(data.error || 'Error al enviar el mensaje');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showToast('Error al enviar el mensaje. Por favor intenta de nuevo.', 'error');
    } finally {
        setLoadingState(false);
    }
}

/**
 * Initialize contact form
 */
export function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Real-time validation on blur
    const fields = ['name', 'email', 'subject', 'message'];
    fields.forEach(fieldName => {
        const input = form.querySelector(`[name="${fieldName}"]`);
        if (input) {
            input.addEventListener('blur', () => {
                const validation = validateField(fieldName, input.value);
                if (!validation.isValid) {
                    showFieldError(fieldName, validation.error);
                } else {
                    clearFieldError(fieldName);
                }
            });

            // Clear error on input
            input.addEventListener('input', () => {
                clearFieldError(fieldName);
            });
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        if (!validateForm(form)) {
            showToast('Por favor corrige los errores en el formulario.', 'error');
            return;
        }

        // Get form data
        const formData = new FormData(form);

        // Submit to Formspree
        await submitToFormspree(form, formData);
    });
}
