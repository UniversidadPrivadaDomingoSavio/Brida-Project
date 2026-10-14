/* assets/js/pages/proyectos-detalle.js */

/* ===============================================
   EFECTO LUZ RATÓN (Heredado del patrón srv-detalle)
   =============================================== */
function initLuzRaton() {
    const bloques = document.querySelectorAll('.pro-det-bloque');
    bloques.forEach((bloque) => {
        bloque.addEventListener('mousemove', (e) => {
            const rect = bloque.getBoundingClientRect();
            bloque.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            bloque.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });
}

/* ===============================================
   ORDEN RESPONSIVE (Título → Imagen → Información)
   En tablet/móvil mueve .pro-det-visual dentro de la
   Ficha Técnica, justo después de la cabecera.
   =============================================== */
function initOrdenResponsive() {
    const visual = document.querySelector('.pro-det-resumen .pro-det-visual');
    const ficha = document.querySelector('.pro-det-ficha');
    const cabecera = ficha?.querySelector('.pro-det-bloque__cabecera');
    if (!visual || !ficha || !cabecera) return;

    const mq = window.matchMedia('(max-width: 1024px)');
    let placeholder = null;

    const aplicar = (esReducido) => {
        if (esReducido && !placeholder) {
            /* Guardamos la posición original y movemos la imagen dentro de la ficha */
            placeholder = document.createComment('pro-det-visual-placeholder');
            visual.after(placeholder);
            cabecera.insertAdjacentElement('afterend', visual);
            ficha.classList.add('esta-reordenado');
        } else if (!esReducido && placeholder) {
            /* Restauramos la posición original para escritorio */
            placeholder.after(visual);
            placeholder.remove();
            placeholder = null;
            ficha.classList.remove('esta-reordenado');
        }
    };

    const onChange = (e) => aplicar(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange); /* Fallback navegadores antiguos */

    aplicar(mq.matches);
}

/* ===============================================
   GALERÍA CARRUSEL (pro-det)
   =============================================== */
function initGaleria() {
    const carrusel = document.querySelector('.pro-det-galeria__carrusel');
    if (!carrusel) return;

    const viewport = carrusel.querySelector('.pro-det-galeria__viewport');
    const track = document.getElementById('galeria-track');
    const slides = Array.from(track.children);
    const btnPrev = document.getElementById('galeria-prev');
    const btnNext = document.getElementById('galeria-next');
    const puntosContainer = document.getElementById('galeria-puntos');

    let indice = 0;
    let puntos = [];

    const GAP = () => parseFloat(getComputedStyle(track).gap) || 20;

    const visibles = () => {
        const w = window.innerWidth;
        if (w <= 768) return 1;
        if (w <= 1024) return 2;
        return 3;
    };

    const maxIndice = () => Math.max(0, slides.length - visibles());

    const crearPuntos = () => {
        if (!puntosContainer) return;
        puntosContainer.innerHTML = '';
        puntos = [];
        for (let i = 0; i <= maxIndice(); i++) {
            const punto = document.createElement('button');
            punto.className = 'pro-det-galeria__punto';
            punto.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
            punto.addEventListener('click', () => { indice = i; actualizar(); });
            puntosContainer.appendChild(punto);
            puntos.push(punto);
        }
    };

    const actualizar = () => {
        const limite = maxIndice();
        if (indice > limite) indice = limite;
        if (indice < 0) indice = 0;

        const paso = slides[0].offsetWidth + GAP();
        track.style.transform = `translateX(-${indice * paso}px)`;

        puntos.forEach((p, i) => p.classList.toggle('es-activo', i === indice));
        if (btnPrev) btnPrev.disabled = indice === 0;
        if (btnNext) btnNext.disabled = indice === limite;
    };

    if (btnPrev) btnPrev.addEventListener('click', () => { indice--; actualizar(); });
    if (btnNext) btnNext.addEventListener('click', () => { indice++; actualizar(); });

    /* Swipe táctil */
    let inicioX = 0;
    viewport.addEventListener('pointerdown', (e) => { inicioX = e.clientX; });
    viewport.addEventListener('pointerup', (e) => {
        const delta = e.clientX - inicioX;
        if (Math.abs(delta) > 50) {
            indice += delta < 0 ? 1 : -1;
            actualizar();
        }
    });

    /* Recalcular en resize (debounce) */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { crearPuntos(); actualizar(); }, 150);
    });

    crearPuntos();
    actualizar();
}

/* ===============================================
   LIGHTBOX (Visor ampliado + Zoom/Pan)
   Doble click o doble tap: zoom en el punto tocado.
   Doble click/tap de nuevo: salir del zoom.
   Con zoom activo: arrastrar para desplazarse.
   =============================================== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const img = document.getElementById('lightbox-img');
    const contador = document.getElementById('lightbox-contador');
    const slides = Array.from(document.querySelectorAll('.pro-det-galeria__slide img'));
    let actual = 0;

    /* --- Estado Zoom / Pan --- */
    const ESCALA_ZOOM = 2.4;
    let zoomActivo = false;
    let escala = 1, tx = 0, ty = 0;

    const aplicarTransform = () => {
        img.style.transform = `translate(${tx}px, ${ty}px) scale(${escala})`;
    };

    const activarZoom = (x, y) => {
        const rect = img.getBoundingClientRect();
        /* transform-origin en el punto exacto del doble tap/click */
        const ox = ((x - rect.left) / rect.width) * 100;
        const oy = ((y - rect.top) / rect.height) * 100;
        img.style.transformOrigin = `${ox}% ${oy}%`;
        escala = ESCALA_ZOOM; tx = 0; ty = 0;
        zoomActivo = true;
        lightbox.classList.add('esta-zoom');
        aplicarTransform();
    };

    const desactivarZoom = () => {
        zoomActivo = false; escala = 1; tx = 0; ty = 0;
        lightbox.classList.remove('esta-zoom');
        img.style.transform = '';
        img.style.transformOrigin = '';
        img.style.transition = '';
    };

    /* --- Doble tap / doble click unificado (pointer events) --- */
    const UMBRAL_DOBLE_TAP = 320; /* ms */
    let ultimoTap = 0;
    let arrastreOcurrido = false;

    /* --- Pan (arrastre) con zoom activo --- */
    let arrastrando = false;
    let puntoInicio = { x: 0, y: 0 };
    let offsetInicio = { x: 0, y: 0 };

    img.addEventListener('pointerdown', (e) => {
        if (!zoomActivo) return;
        arrastrando = true;
        puntoInicio = { x: e.clientX, y: e.clientY };
        offsetInicio = { x: tx, y: ty };
        img.style.transition = 'none'; /* Pan sin retardo */
        img.setPointerCapture?.(e.pointerId);
    });

    img.addEventListener('pointermove', (e) => {
        if (!arrastrando) return;
        const dx = e.clientX - puntoInicio.x;
        const dy = e.clientY - puntoInicio.y;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) arrastreOcurrido = true;
        tx = offsetInicio.x + dx;
        ty = offsetInicio.y + dy;
        aplicarTransform();
    });

    img.addEventListener('pointerup', (e) => {
        if (arrastrando) {
            arrastrando = false;
            img.style.transition = ''; /* Restaurar transición suave */
        }

        /* Si hubo arrastre, no cuenta como tap */
        if (arrastreOcurrido) {
            arrastreOcurrido = false;
            ultimoTap = 0;
            return;
        }

        /* Detección de doble tap / doble click */
        const ahora = Date.now();
        const esDoble = (ahora - ultimoTap) < UMBRAL_DOBLE_TAP;
        ultimoTap = ahora;

        if (esDoble) {
            ultimoTap = 0;
            if (zoomActivo) desactivarZoom();
            else activarZoom(e.clientX, e.clientY);
        }
    });

    img.addEventListener('pointercancel', () => {
        arrastrando = false;
        img.style.transition = '';
    });

    /* --- Navegación de imágenes --- */
    const mostrar = (i) => {
        desactivarZoom(); /* Cada imagen nueva entra sin zoom */
        actual = (i + slides.length) % slides.length;
        img.src = slides[actual].src;
        img.alt = slides[actual].alt;
        if (contador) contador.textContent = `${actual + 1} / ${slides.length}`;
    };

    const cerrar = () => {
        desactivarZoom();
        lightbox.classList.remove('esta-abierto');
        document.body.style.overflow = '';
    };

    slides.forEach((slideImg, i) => {
        slideImg.closest('.pro-det-galeria__slide').addEventListener('click', () => {
            mostrar(i);
            lightbox.classList.add('esta-abierto');
            document.body.style.overflow = 'hidden';
        });
    });

    document.getElementById('lightbox-cerrar').addEventListener('click', cerrar);

    /* Click en el fondo: si hay zoom, primero sale del zoom (UX amable) */
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            if (zoomActivo) desactivarZoom();
            else cerrar();
        }
    });

    document.getElementById('lightbox-prev').addEventListener('click', () => mostrar(actual - 1));
    document.getElementById('lightbox-next').addEventListener('click', () => mostrar(actual + 1));

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('esta-abierto')) return;
        if (e.key === 'Escape') { zoomActivo ? desactivarZoom() : cerrar(); }
        if (e.key === 'ArrowLeft') mostrar(actual - 1);
        if (e.key === 'ArrowRight') mostrar(actual + 1);
    });
}

/* ===============================================
   EXPORT ÚNICO (lo consume main.js)
   =============================================== */
export function initProyectoDetalle() {
    initLuzRaton();
    initOrdenResponsive();
    initGaleria();
    initLightbox();
}