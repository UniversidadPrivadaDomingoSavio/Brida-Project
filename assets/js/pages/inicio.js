// ══════════════════════════════════════════════════════════════════
// CONTROLADOR — PÁGINA INICIO (BRIDA S.R.L.)
// Archivo: assets/js/pages/inicio.js — v2.1
// ══════════════════════════════════════════════════════════════════
// MAPA DEL ARCHIVO:
//   0. IMPORTS — fuente única de datos (proyectos-data.js)
//   1. HERO CARRUSEL — autoplay con swipe; API { reiniciar } para
//      bfcache; autoplay OFF bajo prefers-reduced-motion
//   2. QUIÉNES SOMOS — acordeón "Leer más" móvil
//   3. SERVICIOS — expansión por scroll (exclusividad estructural)
//   4. FRASES Y VALORES — carrusel; API { reiniciar } para bfcache
//   5. ÚLTIMOS PROYECTOS — v2 consume proyectosBRIDA + ⭐ v2.1 FIX:
//      filtro por `servicio` (las data-filter del HTML son las 6
//      LÍNEAS — filtraba por `categoria` y la rejilla quedaba
//      VACÍA) + guard de portada (showcase solo con fotos).
//   6. ORQUESTADOR — inits + protección bfcache (pageshow)
//
// ⭐ v2.1 CAMBIOS (coherencia con proyectos-data.js v2 — 29 obras):
//   · FIX CRÍTICO DE FILTRO: los data-filter del index son las 6
//     LÍNEAS DE SERVICIO (idéntico al hub proyectos.html) → el
//     filtro compara contra `p.servicio`. La versión anterior
//     comparaba `p.categoria` (categorías técnicas como
//     "Estructuras Metálicas" que NUNCA igualan a "Mecánica &
//     Metalurgia") → cualquier filtro devolvía rejilla vacía.
//   · GUARD DE PORTADA: con el inventario v2, 16 obras aún no
//     tienen registro fotográfico (portada: null) → el showcase
//     visual de la home SOLO exhibe obras con foto; las de
//     documentación pendiente viven en el hub, donde tienen su
//     tarjeta blueprint (proyectos.js v2).
// ⭐ NOTA bfcache: los carruseles viven en setInterval; al restaurar
//   desde el Back-Forward Cache el navegador puede disparar el timer
//   acumulado (salto de slides en ráfaga). En pageshow con
//   e.persisted se REINICIAN los timers de ambos carruseles.
// ACCESIBILIDAD MODAL (patrón del modal de quienes-somos):
//   role="dialog" + aria-modal · foco al abrir (botón cerrar) ·
//   Tab atrapado dentro del modal · foco restaurado al cerrar.
// NOMBRES: sincronizados con inicio.css (prefijo ini-). main.js NO
//   cambia (mismo export initInicio).
// ══════════════════════════════════════════════════════════════════

/* ================================================================
   0. IMPORTS — FUENTE ÚNICA DE DATOS
   QUÉ ES: proyectosBRIDA es el inventario OFICIAL de proyectos
   (presentación de servicios de la empresa + artículo de revista).
   NUNCA se duplica ni se inventa información fuera de este módulo.
   ================================================================ */
import { proyectosBRIDA } from './proyectos-data.js';


    /* ================================================================
    1. HERO CARRUSEL (v6 — auditoría aplicada)
    QUÉ HACE: rota los slides cada 6s, permite flechas, puntos y
    swipe táctil, con barra de progreso sincronizada al intervalo.
    DEVUELVE: { reiniciar } — el orquestador lo usa en pageshow.
    REDUCED-MOTION: si el usuario lo pide, el autoplay NO arranca
    (el cambio de slide es movimiento perceptible); la navegación
    manual (flechas/puntos/swipe) sigue disponible y los slides
    conmutan instantáneamente (el CSS anula las transiciones).
    ⭐ v6 H1 ACCESIBILIDAD: los puntos de navegación ahora son
    <button> con aria-label y aria-current (antes <div> ciego a
    teclado — eran la ÚNICA vía de navegación en tablet/móvil, donde
    las flechas están display:none). Mismo criterio aplicado al
    carrusel de Valores. El foco visible lo da el reset global.
    ⭐ v6 H1b: aria-current se sincroniza en cada cambio (atributo,
    no clase — consumible por lectores de pantalla).
    ================================================================ */
    function initHeroSlider() {
        const container = document.getElementById('ini-hero');
        const dotsContainer = document.getElementById('ini-hero-dots');
        const progressBar = document.getElementById('ini-hero-progress');
        if (!container || !dotsContainer || !progressBar) return null; // salida segura

        const slides = container.querySelectorAll('.ini-hero__slide');
        const prevBtn = document.getElementById('ini-hero-prev');
        const nextBtn = document.getElementById('ini-hero-next');

        const reduceMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const autoplayActivo = !reduceMovimiento;

        let currentSlide = 0;
        const slideInterval = 6000;
        let slideTimer;

        let touchStartX = 0;
        let touchEndX = 0;

        // Generar puntos de navegación
        // ⭐ v6: <button> accesible (aria-label + aria-current).
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.classList.add('ini-hero__dot');
            dot.setAttribute('aria-label', 'Slide ' + (index + 1) + ' de ' + slides.length);
            if (index === 0) {
                dot.classList.add('es-activo');
                dot.setAttribute('aria-current', 'true');
            }
            dot.addEventListener('click', () => { goToSlide(index); });
            dotsContainer.appendChild(dot);
        });

        const dots = container.querySelectorAll('.ini-hero__dot');

        // ⭐ v6: sincroniza clases + aria-current del punto activo.
        function updateClasses() {
            slides.forEach((slide, index) => {
                slide.classList.remove('es-activo');
                dots[index].classList.remove('es-activo');
                dots[index].removeAttribute('aria-current');
            });
            slides[currentSlide].classList.add('es-activo');
            dots[currentSlide].classList.add('es-activo');
            dots[currentSlide].setAttribute('aria-current', 'true');
            resetProgressBar();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateClasses();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateClasses();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateClasses();
            resetTimer();
        }

        function startTimer() {
            if (!autoplayActivo) return; /* reduced-motion: sin autoplay */
            slideTimer = setInterval(nextSlide, slideInterval);
        }
        function stopTimer() { clearInterval(slideTimer); }
        function resetTimer() { stopTimer(); startTimer(); }

        function resetProgressBar() {
            if (!autoplayActivo) return; /* barra quieta sin autoplay     */
            progressBar.classList.remove('es-animando');
            void progressBar.offsetWidth; // Fuerza reflow para reiniciar animación
            progressBar.classList.add('es-animando');
        }

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) { nextSlide(); resetTimer(); }
            if (touchEndX > touchStartX + swipeThreshold) { prevSlide(); resetTimer(); }
        }

        container.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        container.addEventListener('touchend', (e) => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); }, { passive: true });

        startTimer();
        resetProgressBar();

        /* API para bfcache: re-sincroniza timer + barra al restaurar */
        return { reiniciar: () => { resetTimer(); resetProgressBar(); } };
    }


/* ================================================================
2. SECCIÓN QUIÉNES SOMOS (v3 — blueprint técnico)
⭐ Solo queda el acordeón "Leer más" (IDs intactos). El efecto
zoom-táctil por IntersectionObserver se RETIRÓ: observaba las
tarjetas de imágenes del diseño anterior (.ini-nosotros__tarjeta)
que ya no existen en la lámina blueprint — código muerto.
================================================================ */
function initNosotrosInicio() {
    const section = document.getElementById('ini-nosotros');
    if (!section) return;

    // Acordeón "Leer más" en Móvil (mecánica max-height del sitio)
    const leerMasBtn = document.getElementById('ini-nosotros-leer-mas');
    const detallesMovil = document.getElementById('ini-nosotros-detalles');

    if (leerMasBtn && detallesMovil) {
        leerMasBtn.addEventListener('click', function() {
            const estaExpandido = leerMasBtn.classList.contains('esta-expandido');
            if (estaExpandido) {
                detallesMovil.style.maxHeight = null;
                leerMasBtn.classList.remove('esta-expandido');
                leerMasBtn.innerHTML = 'Leer más <i class="fa-solid fa-chevron-down"></i>';
            } else {
                detallesMovil.style.maxHeight = detallesMovil.scrollHeight + 'px';
                leerMasBtn.classList.add('esta-expandido');
                leerMasBtn.innerHTML = 'Leer menos <i class="fa-solid fa-chevron-up"></i>';
            }
        });
    }
}


    /* ================================================================
    3. SECCIÓN SERVICIOS — LÁMINAS TÉCNICAS (v3)
    QUÉ HACE: en MÓVIL (≤767px), gestiona la expansión por scroll de
    las láminas: la más cercana al CENTRO del viewport se expande
    (.es-expandida + max-height por scrollHeight — patrón del
    acordeón "Leer más"); las demás permanecen comprimidas.
    ⭐ EXCLUSIVIDAD ESTRUCTURAL: un solo cálculo por frame elige a
    UNA ganadora por geometría (centro más cercano) — nunca dos
    expandidas a la vez, sin carreras de eventos.
    GARANTÍAS:
    · rAF-throttle: el cálculo corre máximo 1 vez por frame.
    · Conmutación ATÓMICA: se miden todas las posiciones antes de
      mutar clases; luego se comprime la saliente y expande la
      entrante en el mismo tick (sin estados intermedios).
    · UMBRAL de actividad (0.6·viewport): fuera de la sección nada
      queda expandido (entrada/salida de sección naturales).
    · Desktop/tablet: el matchMedia se consulta en CADA evaluación —
      fuera de móvil la función es un no-op (patrón del proyecto:
      listeners que consultan el modo vigente, cero acumulación en
      rotación de dispositivo).
    · matchMedia con fallback addListener (Safari antiguo — ley).
    · Al salir del breakpoint móvil: limpieza total del estado
      (cero residuos de max-height/clases).
    · Reduced-motion: el CSS anula las transiciones → la expansión
      es instantánea pero FUNCIONAL (usabilidad no depende del
      movimiento).
    ================================================================ */
    function initServiciosInicio() {
        const section = document.getElementById('ini-servicios');
        if (!section) return; // salida segura (página sin la sección)

        const laminas = Array.from(section.querySelectorAll('.ini-servicios__lamina'));
        if (laminas.length === 0) return;

        const mq = window.matchMedia('(max-width: 767px)');

        /* Estado: la lámina expandida actual (UNA sola o null)      */
        let expandidaActual = null;
        let ticking = false;

        function expandir(lamina) {
            const extra = lamina.querySelector('.ini-servicios__lamina-extra');
            lamina.classList.add('es-expandida');
            /* Altura real del contenido (patrón del acordeón del
               sitio — sin números mágicos: el contenido manda)     */
            if (extra) extra.style.maxHeight = extra.scrollHeight + 'px';
        }

        function comprimir(lamina) {
            if (!lamina) return;
            const extra = lamina.querySelector('.ini-servicios__lamina-extra');
            lamina.classList.remove('es-expandida');
            if (extra) extra.style.maxHeight = null; /* vuelve al 0 del CSS */
        }

        function comprimirTodas() {
            laminas.forEach(comprimir);
            expandidaActual = null;
        }

        /* SELECCIONADOR EXCLUSIVO (un ganador por geometría):
           mide todas las láminas (pre-mutación), elige la más
           cercana al centro del viewport y conmuta atómicamente
           solo si cambió el ganador.                              */
        function seleccionar() {
            ticking = false;

            /* Solo móvil — el modo se consulta en cada evaluación  */
            if (!mq.matches) return;

            const centroViewport = window.innerHeight / 2;
            const UMBRAL = window.innerHeight * 0.6;

            /* 1) Medir TODAS las posiciones ANTES de mutar clases  */
            let mejor = null;
            let mejorDistancia = Infinity;
            laminas.forEach(function (l) {
                const r = l.getBoundingClientRect();
                const centroLamina = r.top + r.height / 2;
                const d = Math.abs(centroLamina - centroViewport);
                if (d < mejorDistancia) { mejorDistancia = d; mejor = l; }
            });

            /* 2) Decidir UN solo ganador                           */
            if (!mejor || mejorDistancia > UMBRAL) {
                if (expandidaActual) comprimirTodas();
                return;
            }
            if (mejor === expandidaActual) return; /* ya es ganadora  */

            /* 3) Conmutación atómica: cierra saliente, abre nueva  */
            comprimir(expandidaActual);
            expandir(mejor);
            expandidaActual = mejor;
        }

        /* rAF-throttle: máximo un cálculo por frame de pintado     */
        function enScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(seleccionar);
        }

        window.addEventListener('scroll', enScroll, { passive: true });
        window.addEventListener('resize', enScroll, { passive: true });

        /* Cambio de breakpoint: limpiar o sincronizar de inmediato */
        function onChange(e) {
            if (!e.matches) {
                comprimirTodas(); /* Salimos de móvil → estado estático */
            } else {
                seleccionar(); /* Entramos a móvil → sincroniza al centro */
            }
        }
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else mq.addListener(onChange); /* fallback Safari antiguo */

        /* Primera evaluación (layout inicial)                      */
        seleccionar();
    }


    /* ================================================================
    4. SECCIÓN FRASES Y VALORES (v3 — auditoría aplicada)
    DEVUELVE: { reiniciar } — para bfcache (patrón del hero).
    REDUCED-MOTION: autoplay OFF (mismo criterio del hero) — las
    frases conmutan instantáneas; flechas/swipe/puntos siguen
    operando (la usabilidad no depende del movimiento).
    ⭐ v3 H1 ACCESIBILIDAD: los puntos de navegación ahora son
    <button> con aria-label y aria-current (antes <div> ciego a
    teclado — eran la ÚNICA vía de navegación en tablet/móvil, donde
    las flechas están display:none). El orden de tabulación sigue el
    orden de las frases; el foco visible lo da el reset global.
    ⭐ v3 H1b: aria-current se sincroniza en cada cambio (atributo,
    no clase → consumible por lectores de pantalla).
    ⭐ v2 (index.html v7): la 4ª diapositiva (Domos Vidriados) se
    registra automáticamente — los puntos se generan con
    slides.forEach, sin cambios en este módulo.
    ================================================================ */
    function initValoresInicio() {
        const section = document.getElementById('ini-valores');
        if (!section) return;

        // Lógica del Carrusel
        const slides = section.querySelectorAll('.ini-valores__diapositiva');
        const dotsContainer = document.getElementById('ini-valores-puntos');
        const prevBtn = document.getElementById('ini-valores-btn-prev');
        const nextBtn = document.getElementById('ini-valores-btn-next');
        const sliderContainer = document.getElementById('ini-valores-carrusel');
        if (!dotsContainer || slides.length === 0) return null; // salida segura

        const reduceMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const autoplayActivo = !reduceMovimiento;

        let currentQuote = 0;
        const quoteInterval = 6000;
        let quoteTimer;

        let touchStartX = 0;
        let touchEndX = 0;

        // Generar puntos de navegación
        // ⭐ v3: <button> accesible (aria-label + aria-current).
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.classList.add('ini-valores__punto');
            dot.setAttribute('aria-label', 'Frase ' + (index + 1) + ' de ' + slides.length);
            if (index === 0) {
                dot.classList.add('es-activo');
                dot.setAttribute('aria-current', 'true');
            }
            dot.addEventListener('click', () => { goToQuote(index); });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.ini-valores__punto');

        // ⭐ v3: sincroniza clases + aria-current del punto activo.
        function updateQuoteClasses() {
            slides.forEach((slide, index) => {
                slide.classList.remove('es-activo');
                dots[index].classList.remove('es-activo');
                dots[index].removeAttribute('aria-current');
            });
            slides[currentQuote].classList.add('es-activo');
            dots[currentQuote].classList.add('es-activo');
            dots[currentQuote].setAttribute('aria-current', 'true');
        }

        function nextQuote() { currentQuote = (currentQuote + 1) % slides.length; updateQuoteClasses(); }
        function prevQuote() { currentQuote = (currentQuote - 1 + slides.length) % slides.length; updateQuoteClasses(); }
        function goToQuote(index) { currentQuote = index; updateQuoteClasses(); resetQuoteTimer(); }
        function startQuoteTimer() { if (!autoplayActivo) return; quoteTimer = setInterval(nextQuote, quoteInterval); }
        function resetQuoteTimer() { clearInterval(quoteTimer); startQuoteTimer(); }

        if (nextBtn) nextBtn.addEventListener('click', () => { nextQuote(); resetQuoteTimer(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevQuote(); resetQuoteTimer(); });

        // Lógica de Swipe para Móvil
        // touch-action: pan-y (CSS) ya delega el scroll vertical al
        // navegador — el swipe horizontal queda para este carrusel.
        function handleQuoteSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) { nextQuote(); resetQuoteTimer(); }
            if (touchEndX > touchStartX + swipeThreshold) { prevQuote(); resetQuoteTimer(); }
        }

        if (sliderContainer) {
            sliderContainer.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
            sliderContainer.addEventListener('touchend', (e) => { touchEndX = e.changedTouches[0].screenX; handleQuoteSwipe(); }, { passive: true });
        }

        startQuoteTimer();

        /* API para bfcache (consumida por el orquestador en pageshow) */
        return { reiniciar: resetQuoteTimer };
    }


/* ================================================================
   5. SECCIÓN PROYECTOS — ⭐ REESCRITO v2 + FIX v2.1
   QUÉ CAMBIÓ Y POR QUÉ:
   · DATOS: import de proyectosBRIDA (fuente única oficial).
     ⚠️ La versión anterior exhibía 18 proyectos INVENTADOS
     (YPFB/Petrobras/ENDE con imágenes de picsum) — atribución
     falsa de obras. Eliminado de raíz.
   · ⭐ v2.1 FIX CRÍTICO DE FILTRO: los data-filter del index son
     las 6 LÍNEAS DE SERVICIO (idéntico al hub proyectos.html) →
     el filtro compara contra `p.servicio`. La versión v2 comparaba
     `p.categoria` (categorías técnicas — "Estructuras Metálicas",
     "Obras Civiles"…) que NUNCA igualan a las líneas ("Mecánica &
     Metalurgia", "Obras Civiles & Construcción"…) → cualquier
     filtro devolvía REJILLA VACÍA. Documentado aquí para que el
     error no regrese: `categoria` es dato de respaldo de la
     insignia del modal, NUNCA criterio de filtro.
   · ⭐ v2.1 GUARD DE PORTADA: con el inventario v2 (29 obras), 16
     aún no tienen registro fotográfico (portada: null) → el
     showcase visual de la home SOLO exhibe obras con foto. Las de
     documentación pendiente viven en el hub (proyectos.js v2)
     donde tienen su tarjeta blueprint honesta. El guard también
     protege openModal: solo recibirá proyectos con portada →
     `img.src = data.portada` nunca recibe null.
   · TARJETAS ACCESIBLES: role="button" + tabindex + Enter/Espacio
     (antes: div ciego al teclado).
   · MODAL WAI-ARIA: role/aria-modal, foco al abrir, Tab atrapado,
     foco restaurado al cerrar (deuda ejecutada).
   · CTA DEL MODAL: apunta a la FICHA REAL (detalleUrl) cuando
     existe; si no, al hub proyectos.html.
   · ETIQUETA DE TARJETA: la LÍNEA DE SERVICIO (consistencia con
     la etiqueta amarilla de proyectos.html).
   ================================================================ */
function initProyectosInicio() {
    const section = document.getElementById('ini-proy');
    const grid = document.getElementById('ini-proy-grid');
    const modal = document.getElementById('ini-proy-modal');
    const pageNumbers = document.getElementById('ini-proy-numeros');
    const prevBtn = document.getElementById('ini-proy-prev-btn');
    const nextBtn = document.getElementById('ini-proy-next-btn');
    const filtersNav = document.getElementById('ini-proy-filtros');
    if (!section || !grid || !modal || !pageNumbers || !prevBtn || !nextBtn || !filtersNav) return;

    /* Estados OFICIALES de proyectos-data.js (capitalización exacta).
       Colores con tokens del sistema (franja/primary — jamás colores
       fuera del sistema).                                              */
    const statusConfig = {
        'Proyecto ejecutado': { color: 'var(--stripe-green)',  icon: 'fa-solid fa-circle-check' },
        'Finalizado':         { color: 'var(--stripe-green)',  icon: 'fa-solid fa-circle-check' },
        'En desarrollo':      { color: 'var(--stripe-yellow)', icon: 'fa-solid fa-hourglass-half' }
    };

    let currentPage = 1;
    const itemsPerPage = 6;
    let currentFilter = 'all';
    let filteredData = [];

    /* ── Gestión de foco del modal (WAI-ARIA) ────────────────────── */
    let elementoFocoPrevio = null;

    const focusablesModal = () =>
        Array.from(modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));

    /* ── Render de la rejilla — ⭐ v2.1 FIX ──────────────────────── */
    function renderGrid() {
        grid.innerHTML = '';
        /* ⭐ v2.1:
           · Filtro por `servicio` (las data-filter del HTML son las
             6 LÍNEAS — `categoria` era un mismatch que vaciaba la
             rejilla en cada filtro).
           · Guard de portada: el showcase visual de la home solo
             exhibe obras CON foto (las de documentación pendiente
             viven en el hub, con su tarjeta blueprint).           */
        filteredData = currentFilter === 'all'
            ? proyectosBRIDA.filter(p => p.portada)
            : proyectosBRIDA.filter(p => p.servicio === currentFilter && p.portada);
        const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = 1;

        const start = (currentPage - 1) * itemsPerPage;
        const pageItems = filteredData.slice(start, start + itemsPerPage);

        pageItems.forEach((proj, index) => {
            const card = document.createElement('div');
            card.className = 'ini-proy__tarjeta';
            card.style.transitionDelay = (index * 80) + 'ms';
            /* Accesibilidad: la tarjeta es un botón real para teclado */
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', 'Ver detalles de ' + proj.titulo);
            card.innerHTML = `
                <img src="${proj.portada}" alt="${proj.titulo}" loading="lazy">
                <div class="ini-proy__tarjeta-superposicion">
                    <span class="ini-proy__tarjeta-cat">${proj.servicio}</span>
                    <h3 class="ini-proy__tarjeta-titulo">${proj.titulo}</h3>
                </div>
            `;
            const abrir = () => openModal(proj);
            card.onclick = abrir;
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); }
            });
            grid.appendChild(card);
            setTimeout(() => card.classList.add('es-visible'), 50);
        });
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="ini-proy__pagina-btn ${i === currentPage ? 'es-activo' : ''}" ${i === currentPage ? 'aria-current="page"' : ''}>${i}</button>`;
        }
        pageNumbers.innerHTML = html;
        Array.from(pageNumbers.children).forEach(btn => btn.onclick = () => goToPage(parseInt(btn.innerText)));
    }

    function goToPage(page) {
        currentPage = page;
        const headerHeight = document.querySelector('#main-header')?.offsetHeight || 80;
        const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 10;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        renderGrid();
    }

    function openModal(data) {
        const img = document.getElementById('ini-proy-modal-img');
        /* Guard v2.1: renderGrid solo exhibe proyectos con portada →
           data.portada nunca es null aquí. Defensa extra por si el
           flujo cambia a futuro (misma filosofía de la guardia de
           imagen del organigrama de quienes-somos).                 */
        if (data.portada) {
            img.src = data.portada;
        } else {
            img.removeAttribute('src');
        }
        img.classList.remove('esta-cargada');
        document.getElementById('ini-proy-modal-titulo').innerText = data.titulo;
        document.getElementById('ini-proy-modal-insignia').innerText = data.categoria;

        /* ⭐ Honestidad de datos: la fuente oficial no registra clientes
           → los slots muestran datos que SÍ existen:
           "Cliente" → Línea de Servicio · "Año" → Periodo oficial    */
        document.getElementById('ini-proy-modal-cliente').querySelector('span').innerText = data.servicio || '-';
        document.getElementById('ini-proy-modal-ubicacion').querySelector('span').innerText = data.ubicacion || '-';
        document.getElementById('ini-proy-modal-anio').querySelector('span').innerText = data.periodo || '-';

        const statusEl = document.getElementById('ini-proy-modal-estado');
        const currentStatus = statusConfig[data.estado] || { color: 'var(--text-muted)', icon: 'fa-solid fa-question-circle' };
        statusEl.querySelector('i').className = currentStatus.icon;
        statusEl.querySelector('span').innerText = data.estado;
        statusEl.style.color = currentStatus.color;

        document.getElementById('ini-proy-modal-desc').innerText = data.descripcion || 'Proyecto ejecutado por BRIDA S.R.L.';

        /* CTA a la FICHA REAL cuando existe                       */
        const ctaFicha = document.getElementById('ini-proy-modal-cta');
        if (ctaFicha) ctaFicha.href = data.detalleUrl || 'proyectos.html';

        /* ── Accesibilidad: foco al abrir ────────────────────────── */
        elementoFocoPrevio = document.activeElement;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Detalles del proyecto: ' + data.titulo);

        modal.classList.add('esta-abierto');
        document.body.style.overflow = 'hidden';
        if (img.complete) img.classList.add('esta-cargada');
        else img.onload = () => img.classList.add('esta-cargada');

        /* Mover el foco al botón cerrar (primer control del modal)  */
        const cerrarBtn = document.getElementById('ini-proy-modal-cerrar');
        if (cerrarBtn) cerrarBtn.focus();
    }

    function closeModal() {
        modal.classList.remove('esta-abierto');
        document.body.style.overflow = '';
        /* Restaurar el foco al elemento que abrió el modal          */
        if (elementoFocoPrevio && typeof elementoFocoPrevio.focus === 'function') {
            elementoFocoPrevio.focus();
        }
        elementoFocoPrevio = null;
    }

    filtersNav.querySelectorAll('.ini-proy__filtro-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            filtersNav.querySelectorAll('.ini-proy__filtro-btn').forEach(b => b.classList.remove('es-activo'));
            e.currentTarget.classList.add('es-activo'); /* ⭐ currentTarget: robusto aunque el clic caiga en un hijo */
            currentFilter = e.currentTarget.getAttribute('data-filter');
            currentPage = 1; renderGrid();
        });
    });

    prevBtn.addEventListener('click', () => { if (currentPage > 1) goToPage(currentPage - 1); });
    nextBtn.addEventListener('click', () => { const t = Math.ceil(filteredData.length / itemsPerPage); if (currentPage < t) goToPage(currentPage + 1); });
    
    document.getElementById('ini-proy-modal-cerrar').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    /* Teclado del modal: Escape cierra · Tab queda atrapado dentro
       (cicla entre los controles focusables del modal)             */
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('esta-abierto')) return;
        if (e.key === 'Escape') { closeModal(); return; }
        if (e.key === 'Tab') {
            const focusables = focusablesModal();
            if (focusables.length === 0) return;
            const primero = focusables[0];
            const ultimo = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === primero) {
                e.preventDefault(); ultimo.focus();
            } else if (!e.shiftKey && document.activeElement === ultimo) {
                e.preventDefault(); primero.focus();
            } else if (!modal.contains(document.activeElement)) {
                e.preventDefault(); primero.focus();
            }
        }
    });

    renderGrid();
}


/* ================================================================
   6. ORQUESTADOR DE LA PÁGINA INICIO
   ⭐ bfcache: en pageshow con e.persisted (restauración desde el
   Back-Forward Cache) se reinician los timers de ambos carruseles
   (APIs { reiniciar } que devuelve cada init). Sin esto, al volver
   con atrás/adelante el intervalo acumulado dispara un salto de
   slides en ráfaga.
   ================================================================ */
export function initInicio() {
    const apiHero = initHeroSlider();
    initNosotrosInicio();
    initServiciosInicio();
    const apiValores = initValoresInicio();
    initProyectosInicio();

    window.addEventListener('pageshow', function (e) {
        if (!e.persisted) return;
        apiHero?.reiniciar?.();
        apiValores?.reiniciar?.();
    });
}