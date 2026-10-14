// Archivo: assets/js/components/footer.js

export function initFooter() {
    // Observador global para animaciones de revelado (Funciona con Hero, Secciones y Footer)
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) { 
                entry.target.classList.add('is-active'); 
                revealObserver.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 });

    // Seleccionar TODOS los reveal-up de la página
    document.querySelectorAll('.reveal-up').forEach(function(el) { 
        revealObserver.observe(el); 
    });
}