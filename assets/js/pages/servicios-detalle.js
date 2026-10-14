// ══════════════════════════════════════════════════════════════════
// CONTROLADOR — SERVICIO DETALLE (BRIDA S.R.L.)
// Archivo: assets/js/pages/servicios-detalle.js
// ══════════════════════════════════════════════════════════════════
// QUÉ HACE ESTE ARCHIVO:
//   1. GALERÍA DEL SERVICIO: las flechas (desktop) desplazan el
//      carrusel un ITEM completo con scroll suave. Táctil usa el
//      gesto nativo (las flechas ni existen ahí — CSS las oculta).
//      · MEDICIÓN: el paso se calcula del primer item real (ancho
//        + gap del CSS) → no hay números mágicos; si el flex-basis
//        responsive cambia, el paso se recalcula solo.
//      · REFLOW: en resize (debounce) la posición se re-aplica sin
//        animación para no quedar a medio item.
// NOMBRES: sincronizados con servicios-detalle.css (prefijo srv-).
//      main.js NO cambia (mismo export). Salida segura si la
//      galería no existe.
// ══════════════════════════════════════════════════════════════════

export function initServicioDetalle() {
    initGaleriaServicio();
}


/* ================================================================
   1. GALERÍA DEL SERVICIO (flechas desktop)
   QUÉ HACE: prev/next desplazan el carrusel un item (scrollBy
   suave). Los botones solo existen en desktop táctil de ratón
   (los crea el CSS en ≥1025px + hover:hover); en táctil/móvil
   el scroll nativo con snap es la interacción — este módulo no
   interfiere.
   ================================================================ */
function initGaleriaServicio() {
    const galeria = document.getElementById('srv-galeria');
    const btnPrev = document.querySelector('[data-galeria-prev]');
    const btnNext = document.querySelector('[data-galeria-next]');

    // Sin galería o sin flechas → no estamos en la página (salida segura)
    if (!galeria || !btnPrev || !btnNext) return;

    /* Paso = ancho del primer item + gap (leído del CSS — sin
       números mágicos; se recalcula en cada uso por si el
       viewport cambió)                                           */
    function paso() {
        const item = galeria.querySelector('.srv-galeria__item');
        if (!item) return galeria.clientWidth;
        const gap = parseFloat(getComputedStyle(galeria).columnGap) || 0;
        return item.getBoundingClientRect().width + gap;
    }

    btnPrev.addEventListener('click', function () {
        galeria.scrollBy({ left: -paso(), behavior: 'smooth' });
    });
    btnNext.addEventListener('click', function () {
        galeria.scrollBy({ left: paso(), behavior: 'smooth' });
    });

    /* Resize con debounce: re-aplicar la posición sin animación
       (los flex-basis responsive cambian el paso; quedarse a
       medio item se ve roto)                                    */
    let respaldo = null;
    window.addEventListener('resize', function () {
        clearTimeout(respaldo);
        respaldo = setTimeout(function () {
            galeria.scrollTo({
                left: Math.round(galeria.scrollLeft / paso()) * paso(),
                behavior: 'auto'
            });
        }, 150);
    });
}