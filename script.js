// MENÚ HAMBURGUESA
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '70px';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.flexDirection = 'column';
        navMenu.style.backgroundColor = '#FFFFFF';
        navMenu.style.padding = '20px';
        navMenu.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        navMenu.style.zIndex = '999';
        navMenu.style.gap = '1rem';
    });
    
    // Cerrar menú al hacer clic en un link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.style.display = 'none';
        });
    });
}

// SCROLL SUAVE
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ANIMAR NÚMEROS
function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');
    const speed = 30;
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = target / speed;
        
        const updateCount = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                setTimeout(updateCount, 50);
            } else {
                stat.textContent = target;
            }
        };
        
        updateCount();
    });
}

// Activar animación cuando se ve la sección hero
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('hero')) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const heroSection = document.querySelector('.hero');
if (heroSection) {
    observer.observe(heroSection);
}

// FORMULARIO DE CITA
const citaForm = document.getElementById('citaForm');
const successMessage = document.getElementById('successMessage');

if (citaForm) {
    citaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Recopilar datos
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const servicio = document.getElementById('servicio').value;
        const horario = document.getElementById('horario').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Validar teléfono
        if (!/^\d{9}$/.test(telefono)) {
            alert('Por favor, introduce un teléfono válido (9 dígitos)');
            return;
        }
        
        // Aquí iría la lógica de envío del formulario
        // Por ahora, mostrar mensaje de éxito
        console.log('Datos del formulario:', {
            nombre,
            telefono,
            email,
            servicio,
            horario,
            mensaje
        });
        
        // Mostrar mensaje de éxito
        citaForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Resetear formulario después de 3 segundos
        setTimeout(() => {
            citaForm.reset();
            citaForm.style.display = 'block';
            successMessage.style.display = 'none';
        }, 3000);
        
        // Aquí puedes integrar con un servicio de envío de emails
        // Ejemplo con Formspree:
        // fetch('https://formspree.io/f/tu_id_formspree', {
        //     method: 'POST',
        //     body: new FormData(this),
        //     headers: {
        //         'Accept': 'application/json'
        //     }
        // })
    });
}

// ANIMACIÓN AL SCROLL
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.servicio-card, .opinion-card, .valor, .razon').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    animationObserver.observe(el);
});

// CERRAR MENÚ AL HACER SCROLL
window.addEventListener('scroll', () => {
    if (navMenu && navMenu.style.display === 'flex') {
        const heroBottom = document.querySelector('.hero').offsetTop + document.querySelector('.hero').offsetHeight;
        if (window.scrollY > heroBottom) {
            navMenu.style.display = 'none';
        }
    }
});

// FUNCIONALIDAD RESPONSIVE
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        navMenu.style.display = 'flex';
        navMenu.style.position = 'relative';
        navMenu.style.top = 'auto';
        navMenu.style.left = 'auto';
        navMenu.style.right = 'auto';
        navMenu.style.flexDirection = 'row';
        navMenu.style.backgroundColor = 'transparent';
        navMenu.style.padding = '0';
        navMenu.style.boxShadow = 'none';
    } else {
        navMenu.style.display = 'none';
    }
});

// SCROLL HACIA ARRIBA SUAVE PARA BOTONES
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// INICIALIZAR
console.log('✅ Fontanería Terrón - Web cargada correctamente');