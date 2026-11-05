/* assets/js/pages/proyectos-detalle.js — v3.1 (TARJETA IMPERIO + LÁMINA)

   ⭐ CHANGELOG v3.1:
   · initLuzRaton RETIRADO: el alcance ya no usa .pro-det-bloque
     (ahora es una Lámina de Plano estática con reveal) → el
     efecto luz-de-ratón queda sin objetivo en esta ficha.
     Cero código muerto (ley del sitio).
   · El resto de módulos sin cambios (v3.0/v2.3):
     animaciones, compartir, galería y lightbox.                      */

/* ===============================================
   ANIMACIONES DE ENTRADA (observer de .reveal-up)
   QUÉ HACE: añade .is-active a los .reveal-up al entrar al
   viewport (umbrales del patrón del sitio: 0.15 escritorio ·
   0.20 tablet/móvil). Cubre: hero expediente, escena de la
   tarjeta, LÁMINA de alcance, galería, navegación y CTA.
   REDUCED-MOTION: activación inmediata de todo.
   =============================================== */
function initAnimacionesEntrada() {
    const revelados = document.querySelectorAll('.reveal-up');
    if (revelados.length === 0) return; /* salida segura */

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revelados.forEach(function (el) { el.classList.add('is-active'); });
        return;
    }

    const mqTablet = window.matchMedia('(max-width: 1024px)');
    let observador = null;

    function crearObservador() {
        if (observador) observador.disconnect();

        observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;
                entrada.target.classList.add('is-active');
                observador.unobserve(entrada.target); /* cero trabajo repetido */
            });
        }, {
            threshold: mqTablet.matches ? 0.20 : 0.15
        });

        revelados.forEach(function (el) {
            if (!el.classList.contains('is-active')) {
                observador.observe(el);
            }
        });
    }

    crearObservador();

    function onChange() { crearObservador(); } /* re-observa los aún ocultos */
    if (mqTablet.addEventListener) mqTablet.addEventListener('change', onChange);
    else mqTablet.addListener(onChange); /* fallback Safari antiguo */
}


/* ===============================================
   COMPARTIR PROYECTO (Tarjeta Imperio)
   QUÉ HACE: navigator.share nativo (móvil); en escritorio sin
   Web Share API copia la URL al portapapeles y da feedback
   "Enlace copiado" durante 2s (botón deshabilitado mientras).
   Cancelaciones del usuario: silenciosas (catch).
   =============================================== */
function initCompartir() {
    const btn = document.getElementById('pro-det-compartir');
    if (!btn) return;
    const etiqueta = btn.querySelector('span');

    btn.addEventListener('click', async function () {
        const data = { title: document.title, url: window.location.href };
        try {
            if (navigator.share) { await navigator.share(data); return; }
            await navigator.clipboard.writeText(window.location.href);
            const original = etiqueta.textContent;
            etiqueta.textContent = 'Enlace copiado';
            btn.disabled = true;
            setTimeout(function () { etiqueta.textContent = original; btn.disabled = false; }, 2000);
        } catch (e) { /* cancelado por el usuario — sin acción */ }
    });
}


/* ===============================================
   GALERÍA CARRUSEL (pro-det) — v2.3
   · Guards: viewport/track pueden faltar → salida segura.
   · matchMedia coherentes con el CSS v3.1 (móvil ≤767 ·
     tablet 768–1024 · escritorio >1024).
   · Cambio de breakpoint: respuesta INMEDIATA (change listeners)
     + recálculo de paso intra-breakpoint (debounce de resize).
   =============================================== */
function initGaleria() {
    const carrusel = document.querySelector('.pro-det-galeria__carrusel');
    if (!carrusel) return;

    const viewport = carrusel.querySelector('.pro-det-galeria__viewport');
    const track = document.getElementById('galeria-track');
    if (!viewport || !track) return;

    const slides = Array.from(track.children);
    const btnPrev = document.getElementById('galeria-prev');
    const btnNext = document.getElementById('galeria-next');
    const puntosContainer = document.getElementById('galeria-puntos');

    let indice = 0;
    let puntos = [];

    const GAP = () => parseFloat(getComputedStyle(track).gap) || 20;

    const mqMovil = window.matchMedia('(max-width: 767px)');
    const mqTablet = window.matchMedia('(max-width: 1024px)');

    const visibles = () => {
        if (mqMovil.matches) return 1;
        if (mqTablet.matches) return 2;
        return 3;
    };

    const maxIndice = () => Math.max(0, slides.length - visibles());

    const crearPuntos = () => {
        if (!puntosContainer) return;
        puntosContainer.innerHTML = '';
        puntos = [];
        for (let i = 0; i <= maxIndice(); i++) {
            const punto = document.createElement('button');
            punto.type = 'button';
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

    /* Swipe táctil — guard de botón + reset de arrastre            */
    let inicioX = 0;
    viewport.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        inicioX = e.clientX;
    });
    viewport.addEventListener('pointerup', (e) => {
        const delta = e.clientX - inicioX;
        if (Math.abs(delta) > 50) {
            indice += delta < 0 ? 1 : -1;
            actualizar();
        }
    });
    viewport.addEventListener('pointerleave', () => { inicioX = 0; });
    viewport.addEventListener('pointercancel', () => { inicioX = 0; });

    /* Resize (debounce) + respuesta inmediata al cruzar breakpoint */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { crearPuntos(); actualizar(); }, 150);
    }, { passive: true });

    [mqMovil, mqTablet].forEach((m) => {
        if (m.addEventListener) m.addEventListener('change', () => { crearPuntos(); actualizar(); });
        else m.addListener(() => { crearPuntos(); actualizar(); });
    });

    crearPuntos();
    actualizar();
}


/* ===============================================
   LIGHTBOX (Visor ampliado + Zoom/Pan) — v2 (WAI-ARIA)
   Doble click/tap: zoom en el punto tocado · de nuevo: salir.
   Con zoom activo: arrastrar para desplazarse.
   FOCO: entra al botón cerrar · Tab atrapado · devolución al
   slide origen · bfcache cierra el visor restaurado.
   =============================================== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const img = document.getElementById('lightbox-img');
    const contador = document.getElementById('lightbox-contador');
    const slides = Array.from(document.querySelectorAll('.pro-det-galeria__slide img'));
    const btnCerrar = document.getElementById('lightbox-cerrar');
    let actual = 0;

    /* ── Gestión de foco (patrón del sitio) ────────────────────── */
    let elementoFocoPrevio = null;
    const focusablesLightbox = () =>
        Array.from(lightbox.querySelectorAll('button:not([disabled])'));

    /* --- Estado Zoom / Pan --- */
    const ESCALA_ZOOM = 2.4;
    let zoomActivo = false;
    let escala = 1, tx = 0, ty = 0;

    const aplicarTransform = () => {
        img.style.transform = `translate(${tx}px, ${ty}px) scale(${escala})`;
    };

    const activarZoom = (x, y) => {
        const rect = img.getBoundingClientRect();
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
        img.style.transition = 'none';
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
            img.style.transition = '';
        }

        if (arrastreOcurrido) {
            arrastreOcurrido = false;
            ultimoTap = 0;
            return;
        }

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
        if (elementoFocoPrevio && typeof elementoFocoPrevio.focus === 'function') {
            elementoFocoPrevio.focus();
        }
        elementoFocoPrevio = null;
    };

    slides.forEach((slideImg, i) => {
        slideImg.closest('.pro-det-galeria__slide').addEventListener('click', () => {
            mostrar(i);
            lightbox.classList.add('esta-abierto');
            document.body.style.overflow = 'hidden';
            elementoFocoPrevio = document.activeElement;
            if (btnCerrar) btnCerrar.focus();
        });
    });

    if (btnCerrar) btnCerrar.addEventListener('click', cerrar);

    /* Click en el fondo: si hay zoom, primero sale del zoom (UX)  */
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
        if (e.key === 'Escape') { zoomActivo ? desactivarZoom() : cerrar(); return; }
        if (e.key === 'ArrowLeft') { mostrar(actual - 1); return; }
        if (e.key === 'ArrowRight') { mostrar(actual + 1); return; }
        if (e.key === 'Tab') {
            const focusables = focusablesLightbox();
            if (focusables.length === 0) return;
            const primero = focusables[0];
            const ultimo = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === primero) {
                e.preventDefault(); ultimo.focus();
            } else if (!e.shiftKey && document.activeElement === ultimo) {
                e.preventDefault(); primero.focus();
            } else if (!lightbox.contains(document.activeElement)) {
                e.preventDefault(); primero.focus();
            }
        }
    });

    /* bfcache: visor abierto restaurado → cerrar                   */
    window.addEventListener('pageshow', (event) => {
        if (event.persisted && lightbox.classList.contains('esta-abierto')) {
            cerrar();
        }
    });
}


/* ===============================================
   EXPORT ÚNICO (lo consume main.js — body id page-proyecto-detalle)
   Orden: animaciones primero (el contenido debe poder aparecer
   aunque un módulo posterior falle).
   ⭐ v3.1: sin initLuzRaton (la lámina no lo consume).
   =============================================== */
export function initProyectoDetalle() {
    initAnimacionesEntrada();
    initCompartir();
    initGaleria();
    initLightbox();
}