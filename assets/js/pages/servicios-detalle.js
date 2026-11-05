// ══════════════════════════════════════════════════════════════════
// CONTROLADOR — PÁGINAS DE SERVICIO (BRIDA S.R.L.)
// Archivo: assets/js/pages/servicios-detalle.js — v4.4
// ══════════════════════════════════════════════════════════════════
// MAPA DEL ARCHIVO (ordenado por secciones del HTML):
//
//   0. FÁBRICA DE ACORDEÓN MÓVIL — crearAcordeonMovil(config)
//      Mecanismo ÚNICO que gobierna BOTH acordeones del sitio
//      (cards del alcance + láminas de sub-servicios).
//
//   SECCIÓN 01 · ALCANCE DEL SERVICIO (Variante E · cards)
//     1.1 APARICIÓN DE ARTÍCULOS — intro + cards con scroll reveal.
//     1.2 EXPANSIÓN DE CARDS — config de la fábrica (0.).
//
//   SECCIÓN 02 · GALERÍA
//     2.1 CARRUSEL — 3/2/1 slides, sin lightbox, sin lupa.
//
//   SECCIÓN 03 · SUB-SERVICIOS
//     3.1 EXPANSIÓN DE LÁMINAS — config de la fábrica (0.).
//
//   TRANSVERSAL
//     4.1 FALLBACK DE FOTOS — marcador limpio si una imagen falla.
//
//   ORQUESTADOR
//     5.1 EXPORT initServicioDetalle (main.js NO cambia).
//
// ⭐ v4.4 CAMBIOS:
//   · DRY: se extrae crearAcordeonMovil(). initExpansionAlcanceCards()
//     e initExpansionFases() pasan a ser DOS llamadas de configuración
//     (antes ~180 líneas duplicadas → ahora ~100 + 2 configs).
//     El patrón acordeón vive en UN solo lugar: cambiarlo una vez
//     actualiza ambas secciones a la vez (cero desincronización).
//   · Galería: el índice se CLAMPA antes de pintar los puntos (evita
//     un frame sin punto activo al cruzar breakpoint con índice alto).
//   · Galería: pointerdown ignora botones no-primarios del ratón y se
//     añade pointerleave → el drag no queda "colgado" si el puntero
//     sale del viewport (arrastrando siempre se resetea).
//   · Galería: obtenerVisibles() usa matchMedia (coherencia con la
//     ley del archivo: el modo se consulta, no se lee innerWidth crudo
//     en listeners persistentes) + change listeners para respuesta
//     inmediata al cruzar breakpoint (el debounce de resize sigue
//     cubriendo el recálculo de paso intra-breakpoint).
//   · initFallbackFotos(): comentario simplificado — la banda visual
//     (.srv-marco--banda) YA cae bajo el selector .srv-marco img
//     porque el <figure> lleva ambas clases; no hace falta duplicarlo.
//   · Se mantiene: cero código muerto (sin initRailFijo), fallback
//     seguro sin JS (clases globales solo con JS vivo), rAF-throttle,
//     conmutación atómica, exclusividad estructural, reduced-motion
//     (el CSS anula transiciones → instantáneo pero funcional),
//     matchMedia con fallback addListener (Safari antiguo — ley).
// ══════════════════════════════════════════════════════════════════


/* ================================================================
   0. FÁBRICA DE ACORDEÓN MÓVIL — MECANISMO ÚNICO
   ================================================================
   QUÉ ES:
   · El patrón "comprimido en móvil + expansión al centrar en el
     viewport" del sitio, implementado UNA sola vez.
   · Lo consumen la Sección 01 (cards del alcance) y la Sección 03
     (láminas de sub-servicios) mediante configuración.

   CONFIG (objeto):
     · selectorItem   → query de cada lámina/card colapsable.
     · selectorExtra  → query del bloque interno que crece/colapsa.
     · claseGlobal    → clase que se pone en <html> para que el CSS
                        active el colapso SOLO si el JS está vivo
                        (fallback: sin JS, contenido visible).
     · flagInit       → clave de dataset en <body> para anti-doble-init.

   CÓMO FUNCIONA (garantías heredadas de la versión gemela):
     · rAF-throttle: máximo 1 cálculo por frame de pintado.
     · Conmutación ATÓMICA: se miden TODAS las posiciones antes de
       mutar clases; luego se comprime la saliente y expande la
       entrante en el mismo tick (sin estados intermedios).
     · EXCLUSIVIDAD ESTRUCTURAL: un solo ganador por geometría
       (centro más cercano) — nunca dos expandidas a la vez.
     · UMBRAL 0.6·viewport: fuera de la zona activa nada queda
       expandido (entrada/salida de sección naturales).
     · Fuera del breakpoint (≤767): no-op + limpieza total de estado
       (cero residuos de max-height/clases al rotar dispositivo).
     · matchMedia consultado en CADA evaluación + fallback addListener.
     · Altura real por scrollHeight (el contenido manda — sin números
       mágicos). Recalculo en resize, load y fonts.ready.
     · Reduced-motion: el CSS anula las transiciones → la expansión
       es instantánea pero FUNCIONAL (usabilidad no depende del
       movimiento).
   ================================================================ */
function crearAcordeonMovil(config) {
    const items = Array.from(document.querySelectorAll(config.selectorItem));
    if (items.length === 0) return; // salida segura (sección ausente)

    // La clase global SOLO se pone si hay ítems y el JS está vivo.
    // Sin esta clase, el CSS NO colapsa → fallback seguro sin JS.
    document.documentElement.classList.add(config.claseGlobal);

    // Anti-doble inicialización (por sección, vía flag propio).
    if (document.body.dataset[config.flagInit] === '1') return;
    document.body.dataset[config.flagInit] = '1';

    const mq = window.matchMedia('(max-width: 767px)');

    let expandidaActual = null;
    let ticking = false;

    function obtenerExtra(item) {
        return item ? item.querySelector(config.selectorExtra) : null;
    }

    function actualizarAltura(item) {
        if (!item) return;
        const extra = obtenerExtra(item);
        if (!extra) return;
        if (item.classList.contains('es-expandida')) {
            extra.style.maxHeight = extra.scrollHeight + 'px';
        }
    }

    function expandir(item) {
        const extra = obtenerExtra(item);
        if (!extra) return; // sin wrapper: modo inofensivo
        item.classList.add('es-expandida');
        extra.style.maxHeight = extra.scrollHeight + 'px';
        expandidaActual = item;
    }

    function comprimir(item) {
        if (!item) return;
        const extra = obtenerExtra(item);
        item.classList.remove('es-expandida');
        if (extra) extra.style.maxHeight = null; // vuelve al 0 del CSS
        if (expandidaActual === item) expandidaActual = null;
    }

    function comprimirTodas() {
        items.forEach(comprimir);
        expandidaActual = null;
    }

    /* SELECCIONADOR EXCLUSIVO (un ganador por geometría):
       mide todas las posiciones (pre-mutación), elige la más
       cercana al centro del viewport y conmuta atómicamente
       solo si cambió el ganador. */
    function seleccionar() {
        ticking = false;

        if (!mq.matches) return; // solo móvil — modo consultado cada vez

        const centroViewport = window.innerHeight / 2;
        const UMBRAL = window.innerHeight * 0.6;

        let mejor = null;
        let mejorDistancia = Infinity;

        items.forEach(function (it) {
            const r = it.getBoundingClientRect();
            const centro = r.top + r.height / 2;
            const d = Math.abs(centro - centroViewport);
            if (d < mejorDistancia) {
                mejorDistancia = d;
                mejor = it;
            }
        });

        if (!mejor || mejorDistancia > UMBRAL) {
            if (expandidaActual) comprimirTodas();
            return;
        }

        if (mejor === expandidaActual) {
            // Sigue ganadora: recalculamos altura (fuentes, iconos,
            // resize, orientación o carga diferida pueden variarla).
            actualizarAltura(mejor);
            return;
        }

        comprimir(expandidaActual); // cierra saliente
        expandir(mejor);            // abre entrante — mismo tick
    }

    function enScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(seleccionar);
    }

    window.addEventListener('scroll', enScroll, { passive: true });
    window.addEventListener('resize', enScroll, { passive: true });

    function reajustar() {
        actualizarAltura(expandidaActual);
    }

    if (document.readyState === 'complete') {
        reajustar();
    } else {
        window.addEventListener('load', reajustar, { once: true });
    }

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(reajustar);
    }

    function onChange(e) {
        if (!e.matches) comprimirTodas(); // salimos de móvil → estático
        else seleccionar();               // entramos a móvil → sincroniza
    }

    if (mq.addEventListener) {
        mq.addEventListener('change', onChange);
    } else {
        mq.addListener(onChange); // fallback Safari antiguo — ley
    }

    seleccionar(); // primera evaluación (layout inicial)
}


/* ================================================================
   SECCIÓN 01 · ALCANCE DEL SERVICIO — VARIANTE E · CARDS
   ================================================================ */


/* ----------------------------------------------------------------
   1.1 · APARICIÓN DE ARTÍCULOS / CARDS
   ----------------------------------------------------------------
   QUÉ HACE:
   · Busca contenedores [data-aparicion] (en la Variante E, el
     contenedor de la Sección 01 envuelve la intro + las 3 cards).
   · Activa el modo aparición con .aparicion-activa (sin JS los
     <article> NUNCA están ocultos).
   · Revela cada <article> con .esta-visible al entrar al viewport.
   · Umbral por breakpoint: 0.15 escritorio · 0.20 tablet/móvil.
   · unobserve tras revelar (cero trabajo repetido).
   · Reduced-motion: revelado inmediato (no depende del IO).
   · La cascada de entrada la dan los transition-delay del CSS.
   ---------------------------------------------------------------- */
function initAparicionArticulos() {
    const zonas = Array.from(document.querySelectorAll('[data-aparicion]'));
    if (zonas.length === 0) return;

    const reduceMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    zonas.forEach(function (zona) {
        if (zona.dataset.aparicionInit === '1') return;
        zona.dataset.aparicionInit = '1';

        const articulos = Array.from(zona.querySelectorAll(':scope > article'));
        if (articulos.length === 0) return;

        zona.classList.add('aparicion-activa');

        if (reduceMovimiento) {
            articulos.forEach(function (a) {
                a.classList.add('esta-visible');
            });
            return;
        }

        const mqTablet = window.matchMedia('(max-width: 1024px)');
        let observador = null;

        function crearObservador() {
            if (observador) observador.disconnect();

            observador = new IntersectionObserver(function (entradas) {
                entradas.forEach(function (entrada) {
                    if (!entrada.isIntersecting) return;
                    entrada.target.classList.add('esta-visible');
                    observador.unobserve(entrada.target);
                });
            }, {
                threshold: mqTablet.matches ? 0.20 : 0.15
            });

            articulos.forEach(function (a) {
                if (!a.classList.contains('esta-visible')) {
                    observador.observe(a);
                }
            });
        }

        crearObservador();

        function onChange() {
            crearObservador(); // re-observa solo los aún no revelados
        }

        if (mqTablet.addEventListener) {
            mqTablet.addEventListener('change', onChange);
        } else {
            mqTablet.addListener(onChange);
        }
    });
}


/* ----------------------------------------------------------------
   1.2 · EXPANSIÓN DE CARDS DEL ALCANCE — MÓVIL
   ----------------------------------------------------------------
   Config de la fábrica (0.). Colapsa .srv-alcance-card-extra en
   móvil ≤767; expande solo la card más cercana al centro.
   Clase global .js-alcance-expansion → el CSS sabe que el JS vive.
   ---------------------------------------------------------------- */
function initExpansionAlcanceCards() {
    crearAcordeonMovil({
        selectorItem:  '.srv-alcance-card',
        selectorExtra: '.srv-alcance-card-extra',
        claseGlobal:   'js-alcance-expansion',
        flagInit:      'expansionAlcanceInit'
    });
}


/* ================================================================
   SECCIÓN 02 · GALERÍA — CARRUSEL SIN VISOR AMPLIADO
   ================================================================ */


/* ----------------------------------------------------------------
   2.1 · CARRUSEL DE LA GALERÍA
   ----------------------------------------------------------------
   QUÉ HACE:
   · Controla .pro-det-galeria (soporta varias instancias en la
     misma página mediante scope por contenedor).
   · Escritorio: 3 slides visibles + flechas.
   · Tablet ≤1024: 2 slides visibles + puntos + swipe.
   · Móvil ≤767: 1 slide visible + puntos + swipe.
   · NO abre lightbox. NO tiene lupa. NO tiene zoom modal.
   · Genera puntos accesibles como <button> con aria-current.
   · Recalcula en resize (debounce), cruce de breakpoint (change),
     load y fonts.ready.
   ---------------------------------------------------------------- */
function initGaleriaServicio() {
    const galerias = Array.from(document.querySelectorAll('.pro-det-galeria'));
    if (galerias.length === 0) return;

    galerias.forEach(function (galeria) {
        if (galeria.dataset.galeriaInit === '1') return;
        galeria.dataset.galeriaInit = '1';

        const viewport = galeria.querySelector('.pro-det-galeria__viewport');
        const track = galeria.querySelector('.pro-det-galeria__track');
        const btnPrev = galeria.querySelector('.pro-det-galeria__btn--prev');
        const btnNext = galeria.querySelector('.pro-det-galeria__btn--next');
        const puntosContainer = galeria.querySelector('.pro-det-galeria__puntos');

        if (!viewport || !track) return;

        const slides = Array.from(track.querySelectorAll('.pro-det-galeria__slide'));
        if (slides.length === 0) return;

        // Modos consultados (ley del archivo: no leer innerWidth crudo
        // en rutas persistentes). Se consultan en cada actualización.
        const mqMovil = window.matchMedia('(max-width: 767px)');
        const mqTablet = window.matchMedia('(max-width: 1024px)');

        let indice = 0;
        let puntos = [];

        function obtenerGap() {
            const styles = window.getComputedStyle(track);
            const gap = parseFloat(styles.columnGap || styles.gap);
            return Number.isFinite(gap) ? gap : 24;
        }

        function obtenerVisibles() {
            if (mqMovil.matches) return 1;
            if (mqTablet.matches) return 2;
            return 3;
        }

        function obtenerMaxIndice() {
            return Math.max(0, slides.length - obtenerVisibles());
        }

        function crearPuntos() {
            if (!puntosContainer) return;

            puntosContainer.innerHTML = '';
            puntos = [];

            const total = obtenerMaxIndice() + 1;

            for (let i = 0; i < total; i++) {
                const punto = document.createElement('button');
                punto.type = 'button';
                punto.className = 'pro-det-galeria__punto';
                punto.setAttribute('aria-label', `Ir al grupo de imágenes ${i + 1}`);

                if (i === indice) {
                    punto.classList.add('es-activo');
                    punto.setAttribute('aria-current', 'true');
                }

                punto.addEventListener('click', function () {
                    indice = i;
                    actualizar();
                });

                puntosContainer.appendChild(punto);
                puntos.push(punto);
            }
        }

        function actualizar() {
            // Clamp ANTES de pintar puntos: evita un frame sin punto
            // activo al cruzar breakpoint con un índice ya fuera de rango.
            const limite = obtenerMaxIndice();
            if (indice > limite) indice = limite;
            if (indice < 0) indice = 0;

            const paso = slides[0].getBoundingClientRect().width + obtenerGap();
            track.style.transform = `translateX(-${indice * paso}px)`;

            puntos.forEach(function (punto, i) {
                const activo = i === indice;
                punto.classList.toggle('es-activo', activo);
                if (activo) punto.setAttribute('aria-current', 'true');
                else punto.removeAttribute('aria-current');
            });

            if (btnPrev) btnPrev.disabled = indice === 0;
            if (btnNext) btnNext.disabled = indice === limite;
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', function () {
                indice--;
                actualizar();
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', function () {
                indice++;
                actualizar();
            });
        }

        /* ── Swipe (pointer events) ──────────────────────────────
           · pointerdown ignora botones no-primarios del ratón.
           · pointerup decide por delta (>50px).
           · pointerleave / pointercancel resetean el arrastre para
             que no quede "colgado" si el puntero sale del viewport. */
        let inicioX = 0;
        let arrastrando = false;

        viewport.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            inicioX = e.clientX;
            arrastrando = true;
        });

        viewport.addEventListener('pointerup', function (e) {
            if (!arrastrando) return;
            arrastrando = false;
            const delta = e.clientX - inicioX;
            if (Math.abs(delta) > 50) {
                indice += delta < 0 ? 1 : -1;
                actualizar();
            }
        });

        viewport.addEventListener('pointerleave', function () {
            arrastrando = false;
        });

        viewport.addEventListener('pointercancel', function () {
            arrastrando = false;
        });

        /* ── Recálculo ─────────────────────────────────────────
           · resize (debounce): el PASO en px cambia con el ancho
             intra-breakpoint → hay que recalcular transform.
           · change de breakpoint: respuesta INMEDIATA al cruzar
             767/1024 (sin esperar los 150ms del debounce). */
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                crearPuntos();
                actualizar();
            }, 150);
        }, { passive: true });

        function onBreakpoint() {
            crearPuntos();
            actualizar();
        }

        [mqMovil, mqTablet].forEach(function (m) {
            if (m.addEventListener) m.addEventListener('change', onBreakpoint);
            else m.addListener(onBreakpoint); // fallback Safari antiguo
        });

        function reajustar() {
            crearPuntos();
            actualizar();
        }

        if (document.readyState === 'complete') {
            reajustar();
        } else {
            window.addEventListener('load', reajustar, { once: true });
        }

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () {
                actualizar();
            });
        }

        crearPuntos();
        actualizar();
    });
}


/* ================================================================
   SECCIÓN 03 · SUB-SERVICIOS — LÁMINAS TÉCNICAS
   ================================================================ */


/* ----------------------------------------------------------------
   3.1 · EXPANSIÓN DE LÁMINAS — MÓVIL
   ----------------------------------------------------------------
   Config de la fábrica (0.). Colapsa .srv-fases__item-extra en
   móvil ≤767; expande solo la lámina más cercana al centro.
   Clase global .js-fases-expansion → el CSS sabe que el JS vive.
   (Gemela funcional de initServiciosInicio del index.)
   ---------------------------------------------------------------- */
function initExpansionFases() {
    crearAcordeonMovil({
        selectorItem:  '.srv-fases__item',
        selectorExtra: '.srv-fases__item-extra',
        claseGlobal:   'js-fases-expansion',
        flagInit:      'expansionFasesInit'
    });
}


/* ================================================================
   TRANSVERSAL
   ================================================================ */


/* ----------------------------------------------------------------
   4.1 · FALLBACK DE FOTOS
   ----------------------------------------------------------------
   QUÉ HACE:
   · Si una imagen falla, añade .srv-sin-foto al contenedor y
     oculta la imagen rota. El CSS pinta un placeholder limpio.
   · Cubre:
     - .srv-marco img              → marco clásico Y banda visual
       (la banda .srv-marco--banda lleva ALSO .srv-marco en el
       <figure>, cae bajo este mismo selector — no se duplica).
     - .pro-det-galeria__slide img → galería (Sección 02).
   · Detecta imágenes que ya fallaron antes de ejecutar el script
     (img.complete && naturalWidth === 0).
   ---------------------------------------------------------------- */
function initFallbackFotos() {
    const imagenes = document.querySelectorAll(
        '.srv-marco img, .pro-det-galeria__slide img'
    );

    imagenes.forEach(function (img) {
        const wrap = img.closest('.srv-marco, .pro-det-galeria__slide');
        if (!wrap) return;

        const marcar = function () {
            wrap.classList.add('srv-sin-foto');
            img.style.display = 'none';
        };

        if (img.complete && img.naturalWidth === 0) {
            marcar();
        }

        img.addEventListener('error', marcar, { once: true });
    });
}


/* ================================================================
   5. ORQUESTADOR DE LA PÁGINA DE SERVICIO
   ================================================================
   QUÉ HACE:
   · Inicializa todos los módulos en el orden de las secciones del
     HTML (01 Alcance → 02 Galería → 03 Sub-servicios → transversal).
   · Mantiene el export initServicioDetalle() para main.js.
   · No requiere bfcache: no usa setInterval ni timers globales
     (los únicos temporizadores son rAF — no acumulan — y un
     setTimeout de debounce en la galería, que no persiste estado
     problemático al restaurar).
   ================================================================ */
export function initServicioDetalle() {
    /* Sección 01 · Alcance (Variante E · cards) */
    initAparicionArticulos();
    initExpansionAlcanceCards();

    /* Sección 02 · Galería (carrusel) */
    initGaleriaServicio();

    /* Sección 03 · Sub-servicios (láminas) */
    initExpansionFases();

    /* Transversal */
    initFallbackFotos();
}