/**
 * GProA Technology - Landing Page v3
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroCanvas();
    initFloatingSymbols();
    initServicios();
    initProjectTabs();
    initContactForm();
    initScrollEffects();
});

/* ============================================
   Navigation
   ============================================ */
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ============================================
   Servicios Expandibles
   ============================================ */
function initServicios() {
    const servicioCards = document.querySelectorAll('.servicio-card');
    
    servicioCards.forEach(card => {
        const header = card.querySelector('.servicio-header');
        const toggle = card.querySelector('.servicio-toggle');
        
        // Función para alternar el estado expandido
        const toggleCard = () => {
            const isExpanded = card.classList.contains('expanded');
            
            // Cerrar todas las demás tarjetas
            servicioCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                    const otherToggle = otherCard.querySelector('.servicio-toggle');
                    if (otherToggle) {
                        otherToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            // Alternar la tarjeta actual
            card.classList.toggle('expanded');
            
            // Actualizar aria-expanded
            if (toggle) {
                toggle.setAttribute('aria-expanded', !isExpanded);
            }
            
            // Scroll suave hacia la tarjeta si se está expandiendo
            if (!isExpanded) {
                setTimeout(() => {
                    card.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 100);
            }
        };
        
        // Event listeners
        if (header) {
            header.addEventListener('click', toggleCard);
        }
        
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleCard();
            });
        }
        
        // Accesibilidad: Enter y Space
        header?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCard();
            }
        });
    });
}

/* ============================================
   Hero Canvas Animation
   ============================================ */
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 0.5,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(10, 15, 28, 1)');
        gradient.addColorStop(0.5, 'rgba(0, 40, 80, 0.3)');
        gradient.addColorStop(1, 'rgba(10, 15, 28, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 224, 255, ${p.alpha})`;
            ctx.fill();

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
        });

        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 224, 255, ${0.15 * (1 - distance / 150)})`;
                    ctx.stroke();
                }
            });
        });

        animationId = requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
}

/* ============================================
   Floating Symbols
   ============================================ */
function initFloatingSymbols() {
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

/* ============================================
   Project Tabs
   ============================================ */
function initProjectTabs() {
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

/* ============================================
   Contact Form
   ============================================ */
function initContactForm() {
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

/* ============================================
   Toast Notification
   ============================================ */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/* ============================================
   Scroll Effects
   ============================================ */
function initScrollEffects() {
    // Reveal elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.servicio-card, .tech-card, .proyecto-card').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   Gartner Charts
   ============================================ */
function showGartnerView(type) {
    const initialView = document.getElementById('gartnerInitialView');
    const detailedView = document.getElementById('gartnerDetailedView');
    const title = document.getElementById('gartnerTitle');

    // Hide all views
    document.querySelectorAll('.gartner-view').forEach(v => v.style.display = 'none');

    // Show detailed view
    initialView.style.display = 'none';
    detailedView.style.display = 'block';

    // Set title
    const titles = {
        'quadrant': 'Cuadrante Mágico',
        'evolution': 'Evolución de Capacidades',
        'solutions': 'Comparativa de Soluciones',
        'market': 'Proyección de Mercado'
    };
    title.textContent = titles[type] || 'Métricas';

    // Show selected view
    const view = document.getElementById(`${type}View`);
    if (view) {
        view.style.display = 'block';
    }

    // Initialize chart
    setTimeout(() => initGartnerChart(type), 100);
}

function showGartnerInitial() {
    const initialView = document.getElementById('gartnerInitialView');
    const detailedView = document.getElementById('gartnerDetailedView');

    initialView.style.display = 'block';
    detailedView.style.display = 'none';
}

function initGartnerChart(type) {
    const chartConfig = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#e0f2fe' }
            }
        },
        scales: {
            x: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(148, 163, 184, 0.1)' }
            },
            y: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(148, 163, 184, 0.1)' }
            }
        }
    };

    if (type === 'quadrant') {
        const ctx = document.getElementById('quadrantChart');
        if (!ctx || ctx.chart) return;

        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'GProA Technology',
                    data: [{ x: 0.85, y: 0.75 }],
                    backgroundColor: '#00e0ff',
                    borderColor: '#00e0ff',
                    borderWidth: 3,
                    pointRadius: 10,
                    pointHoverRadius: 14
                }, {
                    label: 'Competidores',
                    data: [
                        { x: 0.6, y: 0.8 }, { x: 0.7, y: 0.6 }, { x: 0.5, y: 0.7 },
                        { x: 0.8, y: 0.5 }, { x: 0.4, y: 0.6 }, { x: 0.65, y: 0.55 }
                    ],
                    backgroundColor: 'rgba(156, 163, 175, 0.6)',
                    pointRadius: 6
                }]
            },
            options: {
                ...chartConfig,
                scales: {
                    ...chartConfig.scales,
                    x: {
                        ...chartConfig.scales.x,
                        title: { display: true, text: 'Capacidad de Ejecución', color: '#93c5fd' },
                        min: 0, max: 1
                    },
                    y: {
                        ...chartConfig.scales.y,
                        title: { display: true, text: 'Completitud de Visión', color: '#93c5fd' },
                        min: 0, max: 1
                    }
                }
            }
        });
    }
    else if (type === 'evolution') {
        const ctx = document.getElementById('evolutionChart');
        if (!ctx || ctx.chart) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2021', '2022', '2023', '2024', '2025'],
                datasets: [{
                    label: 'Crecimiento IA',
                    data: [20, 45, 75, 120, 160],
                    borderColor: '#00e0ff',
                    backgroundColor: 'rgba(0, 224, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Automatización',
                    data: [15, 35, 65, 95, 125],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: chartConfig
        });
    }
    else if (type === 'solutions') {
        const ctx = document.getElementById('solutionsChart');
        if (!ctx || ctx.chart) return;

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Innovación', 'Especialización', 'Escalabilidad', 'Integración', 'Soporte'],
                datasets: [{
                    label: 'GProA Technology',
                    data: [92, 88, 85, 90, 87],
                    borderColor: '#00e0ff',
                    backgroundColor: 'rgba(0, 224, 255, 0.2)',
                    pointBackgroundColor: '#00e0ff'
                }, {
                    label: 'Promedio Competidores',
                    data: [75, 70, 78, 72, 80],
                    borderColor: 'rgba(156, 163, 175, 0.8)',
                    backgroundColor: 'rgba(156, 163, 175, 0.1)',
                    pointBackgroundColor: 'rgba(156, 163, 175, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#e0f2fe' } }
                },
                scales: {
                    r: {
                        ticks: { color: '#94a3b8', backdropColor: 'transparent' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' },
                        angleLines: { color: 'rgba(148, 163, 184, 0.1)' },
                        pointLabels: { color: '#93c5fd' }
                    }
                }
            }
        });
    }
    else if (type === 'market') {
        const ctx = document.getElementById('marketChart');
        if (!ctx || ctx.chart) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['2025', '2026', '2027', '2028', '2029'],
                datasets: [{
                    label: 'Mercado IA Industrial (Miles de millones USD)',
                    data: [47.2, 58.5, 72.1, 89.2, 110.3],
                    backgroundColor: 'rgba(0, 224, 255, 0.6)',
                    borderColor: '#00e0ff',
                    borderWidth: 2
                }]
            },
            options: chartConfig
        });
    }
}

/* ============================================
   Org Chart Modal
   ============================================ */
function showOrgModal(type) {
    const modal = document.getElementById('orgModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    const data = {
        'CEO': {
            title: 'Chief Executive Officer',
            content: `
                <p><strong>Juan Abdel Lugo Trejo</strong> es el fundador y CEO de GProA Technology. Líder visionario con amplia experiencia en desarrollo de software y automatización industrial.</p>
                
                <h3>Responsabilidades</h3>
                <ul>
                    <li>Definir la visión estratégica de la empresa</li>
                    <li>Liderar el desarrollo de productos tecnológicos</li>
                    <li>Dirigir la dirección técnica y desarrollo</li>
                    <li>Gestionar relaciones con clientes estratégicos</li>
                </ul>
                
                <h3>Contacto</h3>
                <p>📧 trejulu@gproatechnology.com</p>
                <p>📞 +52 1 468 120 8570</p>
            `
        },
        'COO': {
            title: 'Chief Operating Officer',
            content: `
                <p><strong>Israel Aldair Reséndiz Gálvez</strong> es el COO de GProA Technology. Responsable de la operación diaria y la estructura administrativa de la empresa.</p>
                
                <h3>Responsabilidades</h3>
                <ul>
                    <li>Supervisar las operaciones diarias</li>
                    <li>Gestionar la administración general</li>
                    <li>Coordinar asuntos legales y cumplimiento normativo</li>
                    <li>Administrar finanzas y contabilidad</li>
                </ul>
                
                <h3>Contacto</h3>
                <p>📧 admin@gproatechnology.com</p>
                <p>📞 +52 1 419 129 6200</p>
            `
        }
    };

    const info = data[type];
    if (info) {
        title.textContent = info.title;
        body.innerHTML = info.content;
    }

    modal.classList.add('show');

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeOrgModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeOrgModal();
        }
    });
}

function closeOrgModal() {
    const modal = document.getElementById('orgModal');
    modal.classList.remove('show');
}
