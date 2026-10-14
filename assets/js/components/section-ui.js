/* ================================================================
   COMPONENTES GLOBALES DE UI (Interfaz de Usuario)
   Lógica reutilizable en múltiples páginas (Ej: Hero Interno)
   ================================================================ */

export function initSectionUI() {
    initHeroInterno();
    // Aquí podremos añadir más inicializadores globales en el futuro
}

/* --- LÓGICA HERO INTERNO --- */
function initHeroInterno() {
    const heroContenido = document.querySelector('.hero-interno__contenido');
    if (!heroContenido) return; // Si no existe en la página, no hace nada

    // Observador específico para la animación de entrada y la línea del Hero Interno
    const observadorHero = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('esta-activo'); // Dispara la animación CSS
                observadorHero.unobserve(entry.target); // Se ejecuta solo una vez
            }
        });
    }, { threshold: 0.2 }); // Se activa cuando el 20% es visible

    observadorHero.observe(heroContenido);
}