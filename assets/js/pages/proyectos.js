// ══════════════════════════════════════════════════════════════════
// CONTROLADOR — SECCIÓN PROYECTOS (BRIDA S.R.L.)
// Archivo: assets/js/pages/proyectos.js
// ══════════════════════════════════════════════════════════════════
// QUÉ HACE ESTE ARCHIVO:
//   1. Renderiza dinámicamente la rejilla de proyectos (proy-rejilla)
//      con tarjeta-enlace, chip de estado y detalles oficiales.
//   2. Filtra por LÍNEA DE SERVICIO (los data-filter del HTML son
//      las mismas 6 líneas del catálogo de servicios).
//   3. Muestra un aviso profesional (proy-vacio) cuando un servicio
//      aún no tiene obras publicadas.
//   4. Móvil — FILTROS DESLIZABLES:
//      · Flechas indicadoras SOLO en los extremos de la fila
//        (inicio → flecha derecha; final → flecha izquierda) con
//        ciclo pulsante recurrente.
//      · Candado inicial: el HTML arranca con "tiene-deslizable
//        tiene-derecha" y este JS valida/corrige contra la realidad
//        (incluye re-evaluación en load y fonts.ready).
//      · Auto-centrado del filtro activo con candado _centrando:
//        durante la animación los indicadores quedan congelados y
//        se reevalúan una sola vez al terminar.
//   5. Protege todo contra el Back-Forward Cache (bfcache).
// NOTA: los nombres de clases/IDs coinciden con proyectos.css
//       (prefijo proy-). main.js NO cambia (mismos exports).
// ══════════════════════════════════════════════════════════════════


/* ============================================================
   MÓDULO A — FLECHAS INDICADORAS EN EXTREMOS (móvil)
   QUÉ HACE: gestiona TODO el estado de las flechas indicadoras:
             - Si la fila desborda → activa tiene-deslizable y,
               según la posición del scroll, enciende la flecha del
               extremo correspondiente:
               · Al INICIO (extremo izquierdo) → tiene-derecha.
               · Al FINAL  (extremo derecho)  → tiene-izquierda.
             - Si NO desborda (escritorio) → LIMPIA todas las
               clases del mecanismo (incluido el candado del HTML).
   CANDADO:  recalcularEstado() es la ÚNICA fuente de verdad de
             las clases de la zona. El listener de scroll ignora
             los eventos mientras _centrando = true (animación de
             centrado en curso) — el propio centrado reevalúa al
             terminar con un scroll sintético.
   RE-EVALUACIÓN DIFERIDA: window.load + document.fonts.ready
             corrigen los "estados fantasma" (fuentes que cambian
             el ancho de las píldoras, scroll restaurado por Live
             Server, rotaciones, etc.).
   EN DESKTOP: sin desborde → clases limpiadas → flechas nunca
             visibles (además el CSS base es display:none).
   ============================================================ */
function initFiltrosDeslizables() {
    const filtros = document.getElementById('proy-filtros');
    const zona    = document.getElementById('proy-filtros-zona');
    if (!filtros || !zona) return;

    /* Tolerancia en px para considerar "en el extremo" o "sin desborde" */
    const TOL = 4;

    /* ¿La fila desborda horizontalmente? */
    const tieneDesborde = () => filtros.scrollWidth > filtros.clientWidth + TOL;

    /* ÚNICA FUENTE DE VERDAD de las clases de la zona:
       valida desborde + posición y sincroniza las 3 clases.       */
    const recalcularEstado = () => {
        if (!tieneDesborde()) {
            /* Sin desborde → mecanismo apagado por completo
               (corrige el candado inicial del HTML en escritorio) */
            zona.classList.remove('tiene-deslizable', 'tiene-derecha', 'tiene-izquierda');
            return;
        }
        const maxScroll = filtros.scrollWidth - filtros.clientWidth;
        const alInicio  = filtros.scrollLeft <= TOL;
        const alFinal   = filtros.scrollLeft >= maxScroll - TOL;

        zona.classList.add('tiene-deslizable');
        /* Extremo izquierdo  → señal a la derecha (queda más por ver)
           Extremo derecho    → señal a la izquierda
           En el medio        → ninguna (el fade de bordes insinúa)  */
        zona.classList.toggle('tiene-derecha', alInicio);
        zona.classList.toggle('tiene-izquierda', alFinal);
    };

    /* CANDADO: los scrolls que la animación de centrado dispara
       NO reevalúan los indicadores (quedan congelados). El propio
       centrado dispara un scroll sintético al terminar.          */
    filtros.addEventListener('scroll', () => {
        if (filtros._centrando) return;
        recalcularEstado();
    }, { passive: true });

    /* Rotación / cambio de tamaño del viewport */
    window.addEventListener('resize', recalcularEstado);

    /* RE-EVALUACIÓN DIFERIDA — layout definitivo:
       - window.load: tras imágenes y recursos.
       - document.fonts.ready: las fuentes personalizadas (Space
         Grotesk) alteran el ancho real de las píldoras al aplicar.
       - Red de seguridad a 350ms por si algún recurso tarda.     */
    window.addEventListener('load', recalcularEstado);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(recalcularEstado).catch(() => {});
    }
    setTimeout(recalcularEstado, 350);

    /* PRIMERA EVALUACIÓN INMEDIATA:
       valida el candado inicial del HTML ("tiene-deslizable
       tiene-derecha") contra la realidad — si Live Server restauró
       un scrollLeft > 0, aquí se corrige desde el primer frame.  */
    recalcularEstado();
}


/* ============================================================
   MÓDULO B — AUTO-CENTRADO DEL FILTRO ACTIVO (universal)
   QUÉ HACE: al tocar un filtro, lo centra EXACTAMENTE en el
             medio de la fila con desplazamiento animado. Así el
             usuario ve su selección y, a ambos lados, que existen
             más filtros por explorar.
   POR QUÉ NO scrollTo(): Element.scrollTo({behavior:'smooth'})
             NO es soportado en Safari iOS < 15.4 (el objeto de
             opciones se ignora y no ocurre nada). La animación es
             MANUAL con requestAnimationFrame: funciona en el 100%
             de los navegadores.
   CANDADO _centrando:
   - true durante la animación → los indicadores de flechas
     quedan congelados (no parpadean a mitad de vuelo).
   - Al terminar: candado liberado + scroll sintético que
     reevalúa los indicadores UNA sola vez con la posición final.
   - Si el usuario interrumpe con el dedo: candado liberado +
     sincronización inmediata (el gesto nativo sigue desde ahí).
   DETALLES: easeOutCubic · cancela animación previa (taps
   rápidos) · clamp manual a [0, máximo].
   EN DESKTOP: no hace nada (sin overflow). Respeta reduced-motion.
   ============================================================ */
function centrarFiltroActivo(filtros, chip) {
    if (filtros.scrollWidth <= filtros.clientWidth + 4) return; /* sin overflow */

    const rectFila = filtros.getBoundingClientRect();
    const rectChip = chip.getBoundingClientRect();

    /* Delta exacto entre el centro de la fila y el centro del chip */
    const centroFila = rectFila.left + (rectFila.width / 2);
    const centroChip = rectChip.left + (rectChip.width / 2);
    const maxScroll  = filtros.scrollWidth - filtros.clientWidth;
    const objetivo   = Math.max(0, Math.min(maxScroll, filtros.scrollLeft + (centroChip - centroFila)));

    /* Movimiento reducido: salto directo sin animación.
       El scroll nativo disparará la reevaluación de indicadores. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        filtros.scrollLeft = objetivo;
        return;
    }

    const inicio    = filtros.scrollLeft;
    const distancia = objetivo - inicio;
    if (Math.abs(distancia) < 2) return; /* Ya está centrado */

    const duracion    = 450;
    const momentoCero = performance.now();

    /* Cancelar animación de centrado previa (taps rápidos) */
    if (filtros._animCentrado) cancelAnimationFrame(filtros._animCentrado);

    /* ACTIVAR CANDADO: los indicadores de flechas se congelan
       hasta que la animación termine o sea interrumpida         */
    filtros._centrando = true;

    /* El usuario interrumpe deslizando a mano → la animación cede
       (con limpieza del handler previo para no acumular listeners) */
    if (filtros._cederHandler) {
        filtros.removeEventListener('touchstart', filtros._cederHandler);
    }
    const cederAlUsuario = () => {
        if (filtros._animCentrado) {
            cancelAnimationFrame(filtros._animCentrado);
            filtros._animCentrado = null;
            /* Liberar candado + sincronizar indicadores con la
               posición a mitad de animación: el gesto nativo del
               usuario continuará reevaluando con cada scroll.    */
            filtros._centrando = false;
            filtros.dispatchEvent(new Event('scroll'));
        }
        filtros._cederHandler = null;
    };
    filtros._cederHandler = cederAlUsuario;
    filtros.addEventListener('touchstart', cederAlUsuario, { once: true, passive: true });

    const paso = (ahora) => {
        const t = Math.min((ahora - momentoCero) / duracion, 1);
        const ease = 1 - Math.pow(1 - t, 3); /* easeOutCubic */
        filtros.scrollLeft = inicio + (distancia * ease);
        if (t < 1) {
            filtros._animCentrado = requestAnimationFrame(paso);
        } else {
            /* FIN DEL CENTRADO: liberar candado y reevaluar los
               indicadores UNA sola vez (el scroll sintético activa
               el listener de initFiltrosDeslizables, ya sin
               candado) → las flechas se sincronizan con la
               posición final exacta.                            */
            filtros._animCentrado = null;
            filtros._centrando = false;
            filtros.dispatchEvent(new Event('scroll'));
        }
    };
    filtros._animCentrado = requestAnimationFrame(paso);
}


/* ============================================================
   MÓDULO PRINCIPAL — REJILLA DINÁMICA DE PROYECTOS
   ============================================================ */

export function initProyectos() {
    const section = document.getElementById('proy-seccion');
    if (!section) return;

    /* ============================================================
       DATOS OFICIALES DE PROYECTOS — BRIDA S.R.L.
       - servicio: LÍNEA DE SERVICIO → criterio de filtrado; debe
         coincidir con los data-filter de proyectos.html. También
         es lo que se muestra en la tarjeta (etiqueta amarilla).
       - cat: categoría técnica de la obra (dato de respaldo).
       - place/periodo: SOLO si constan en el documento oficial
         de la empresa — nunca se inventa información.
       ============================================================ */
    const projectsData = [
        // ==================== MECÁNICA & METALURGIA ====================
        {
            id: 1,
            title: "Galpón Metálico Remax",
            servicio: "Mecánica & Metalurgia",
            cat: "Estructuras Metálicas",
            img: "assets/img/proyectos/01-galpones-industriales/galpon-metalico-remax/Proyecto Galpón Metálico Remax_1.jpg",
            url: "proyectos/galpon-remax.html",
            client: "RE/MAX",
            place: "",
            periodo: "",
            status: "Proyecto Concluido"
        },
        {
            id: 2,
            title: "Galpón Sifón Santa Cruz",
            servicio: "Mecánica & Metalurgia",
            cat: "Estructuras Metálicas",
            img: "assets/img/proyectos/01-galpones-industriales/galpon-sifon-santa-cruz/Proyecto Galpón Sifón Santa Cruz_1.jpg",
            url: "servicios/mecanica-metalurgia.html",
            client: "Privado",
            place: "Santa Cruz de la Sierra",
            periodo: "",
            status: "Proyecto Ejecutado"
        },
        {
            id: 3,
            title: "Proyecto Termoplast",
            servicio: "Mecánica & Metalurgia",
            cat: "Estructuras Metálicas",
            img: "assets/img/proyectos/01-galpones-industriales/termoplast/Proyecto Termoplast_1.jpg",
            url: "proyectos/proyecto-termoplast.html",
            client: "Termoplast",
            place: "",
            periodo: "",
            status: "Proyecto Ejecutado"
        },
        {
            id: 8,
            title: "Estructura para Alucobon — Supermercado TIA",
            servicio: "Mecánica & Metalurgia",
            cat: "Estructura para Revestimiento",
            img: "assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260824-WA0105.jpeg",
            url: "servicios/mecanica-metalurgia.html",
            client: "Supermercado TIA",
            place: "",
            periodo: "",
            status: "Proyecto Ejecutado"
        },

        // ==================== OBRAS CIVILES & CONSTRUCCIÓN ====================
        {
            id: 4,
            title: "Casa de Campo Industrial — Las Maras",
            servicio: "Obras Civiles & Construcción",
            cat: "Obra Civil Residencial",
            img: "assets/img/proyectos/Proyecto Casa de Campo Porongo/Proyecto Casa de Campo Porongo_1.jpg",
            url: "servicios/obras-civiles.html",
            client: "Privado",
            place: "Municipio de Porongo — Santa Cruz de la Sierra",
            periodo: "2023 – 2024",
            status: "Finalizado"
        },
        {
            id: 5,
            title: "Casa de Campo Industrial — Porongo",
            servicio: "Obras Civiles & Construcción",
            cat: "Obra Civil Residencial",
            img: "assets/img/proyectos/Proyecto Casa de Campo Industrial Porongo/Proyecto Casa de Campo Industrial Porongo_1.jpg",
            url: "proyectos/casa-porongo.html",
            client: "Privado",
            place: "Municipio de Porongo — Santa Cruz de la Sierra",
            periodo: "2024",
            status: "Finalizado"
        },
        {
            id: 6,
            title: "Balneario Campo Belo",
            servicio: "Obras Civiles & Construcción",
            cat: "Obra Civil Recreativa",
            img: "assets/img/proyectos/Proyecto Balneario Campo Belo/Proyecto Balneario Campo Belo_1.jpg",
            url: "proyectos/balneario-campo-belo.html",
            client: "Campo Belo",
            place: "8vo Anillo, Virgen de Cotoca — Santa Cruz de la Sierra",
            periodo: "2024",
            status: "Finalizado"
        },
        {
            id: 7,
            title: "Centro de Entrenamiento Husqvarna",
            servicio: "Obras Civiles & Construcción",
            cat: "Obra Civil Deportiva",
            img: "assets/img/proyectos/Proyecto Circuito de Moto Husqvarna/Proyecto Circuito de Moto Husqvarna_1.jpg",
            url: "servicios/obras-civiles.html",
            client: "Husqvarna",
            place: "",
            periodo: "",
            status: "Finalizado"
        },
        {
            id: 12,
            title: "Salón de Belleza Guadalupe Alpire",
            servicio: "Obras Civiles & Construcción",
            cat: "Refacción y Remodelación",
            img: "assets/img/proyectos/Proyecto Salon de Belleza Guadalupe Alpire/Proyecto Salon de Belleza Guadalupe Alpire_1.jpg",
            url: "servicios/obras-civiles.html",
            client: "Privado",
            place: "3er Anillo, Av. Roca y Coronado — Santa Cruz de la Sierra",
            periodo: "2024",
            status: "Finalizado"
        },

        // ==================== INGENIERÍA & CONSULTORÍA ====================
        {
            id: 9,
            title: "Ampliación de Oficinas — AG Logistics",
            servicio: "Ingeniería & Consultoría",
            cat: "Diseño y Ejecución",
            img: "assets/img/proyectos/Proyecto AG Logistics/Proyecto AG Logistics_1.jpg",
            url: "servicios/ingenieria-consultoria.html",
            client: "AG Logistics",
            place: "4to Anillo, Av. Beni — Santa Cruz de la Sierra",
            periodo: "2024",
            status: "Finalizado"
        },
        {
            id: 10,
            title: "Moscow House",
            servicio: "Ingeniería & Consultoría",
            cat: "Diseño Industrial",
            img: "assets/img/proyectos/Proyecto Moscow House/Proyecto Moscow House_1.jpg",
            url: "servicios/ingenieria-consultoria.html",
            client: "Privado",
            place: "",
            periodo: "",
            status: "Proyecto Ejecutado"
        },
        {
            id: 13,
            title: "Vaca Morena",
            servicio: "Ingeniería & Consultoría",
            cat: "Diseño de Fachada",
            img: "assets/img/proyectos/Proyecto Vaca Morena/Proyecto Vaca Morena_1.jpg",
            url: "servicios/ingenieria-consultoria.html",
            client: "Vaca Morena",
            place: "",
            periodo: "",
            status: "En Desarrollo"
        },

        // ==================== ELECTRICIDAD & AUTOMATIZACIÓN ====================
        {
            id: 11,
            title: "Remodelación de Vivienda y Áreas Sociales",
            servicio: "Electricidad & Automatización",
            cat: "Casa Inteligente",
            img: "assets/img/proyectos/Proyecto Remodelacion de Vivienda/Proyecto Remodelacion de Vivienda_1.jpg",
            url: "servicios/electricidad-automatizacion.html",
            client: "Privado",
            place: "Estadio Tahuichi Aguilera — Santa Cruz de la Sierra",
            periodo: "2024",
            status: "Finalizado"
        }
    ];

    let currentPage = 1;
    const itemsPerPage = 6;
    let currentFilter = 'all';
    let filteredData = [...projectsData];

    /* Referencias al DOM (IDs sincronizados con proyectos.html) */
    const rejilla       = document.getElementById('proy-rejilla');
    const numeros       = document.getElementById('proy-paginacion-numeros');
    const botonAnterior = document.getElementById('proy-paginacion-anterior');
    const botonSiguiente = document.getElementById('proy-paginacion-siguiente');
    const filtros       = document.getElementById('proy-filtros');
    const paginacion    = document.getElementById('proy-paginacion');

    /* Imagen de respaldo local (coherente con la identidad BRIDA) */
    const IMG_RESPALDO = 'assets/img/proyectos/Inicio/Proyecto_Portada.jpeg';

    /* ============================================================
       CHIP DE ESTADO — Mapeo semántico (colores en proyectos.css):
       - Finalizado / Concluido / Ejecutado → es-concluido (verde)
       - En Desarrollo                      → es-desarrollo (ámbar)
       - Fase de Operación                  → es-operacion (azul)
       ============================================================ */
    const estadoClase = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('desarrollo')) return 'es-desarrollo';
        if (s.includes('operacion') || s.includes('operación')) return 'es-operacion';
        return 'es-concluido';
    };

    /* ============================================================
       AVISO DE SERVICIO SIN OBRAS
       QUÉ HACE: cuando el filtro de servicio no tiene proyectos,
                 muestra un mensaje profesional con CTA a contacto
                 en lugar de una rejilla vacía.
       ============================================================ */
    function renderAvisoVacio(nombreServicio) {
        const aviso = document.createElement('div');
        aviso.className = 'proy-vacio';
        aviso.setAttribute('role', 'status');
        aviso.innerHTML = `
            <i class="fa-solid fa-folder-open" aria-hidden="true"></i>
            <h3 class="proy-vacio-titulo">${nombreServicio}</h3>
            <p class="proy-vacio-texto">
                Estamos documentando las obras de esta línea. Contáctenos y con gusto le compartiremos referencias directas de proyectos ejecutados.
            </p>
            <a href="contacto.html" class="proy-vacio-boton">
                Solicitar referencias <i class="fa-solid fa-arrow-right"></i>
            </a>
        `;
        rejilla.appendChild(aviso);
        setTimeout(() => aviso.classList.add('es-visible'), 50);
    }

    /* ============================================================
       RENDER DE LA REJILLA
       QUÉ HACE: limpia la rejilla, filtra por línea de servicio y
                 pinta las tarjetas de la página actual en cascada.
       ============================================================ */
    function renderRejilla() {
        rejilla.innerHTML = '';
        filteredData = currentFilter === 'all'
            ? projectsData
            : projectsData.filter(p => p.servicio === currentFilter);

        /* Servicio sin obras publicadas → aviso, sin paginación */
        if (filteredData.length === 0) {
            paginacion.style.display = 'none';
            renderAvisoVacio(currentFilter);
            return;
        }

        const totalPaginas = Math.ceil(filteredData.length / itemsPerPage) || 1;
        if (currentPage > totalPaginas) currentPage = 1;

        /* Paginación oculta si todo cabe en una página */
        paginacion.style.display = totalPaginas > 1 ? 'flex' : 'none';

        const inicio = (currentPage - 1) * itemsPerPage;
        const itemsPagina = filteredData.slice(inicio, inicio + itemsPerPage);

        itemsPagina.forEach((proy, index) => {
            /* <a> directo → navegación sin modal */
            const tarjeta = document.createElement('a');
            tarjeta.className = 'proy-tarjeta';
            tarjeta.href = proy.url;
            tarjeta.setAttribute('aria-label', `Ver proyecto: ${proy.title}`);
            tarjeta.style.transitionDelay = (index * 80) + 'ms';

            /* Detalles solo si constan en el documento oficial */
            const detallesHTML = (proy.place || proy.periodo)
                ? `
                <div class="proy-tarjeta-detalles">
                    ${proy.place ? `<span><i class="fa-solid fa-location-dot"></i> ${proy.place}</span>` : ''}
                    ${proy.periodo ? `<span><i class="fa-solid fa-calendar-days"></i> ${proy.periodo}</span>` : ''}
                </div>`
                : '';

            /* La etiqueta muestra la LÍNEA DE SERVICIO: en táctil la
               lectura es servicio → título → ubicación, sin hover */
            tarjeta.innerHTML = `
                <img src="${proy.img}" alt="${proy.title}" loading="lazy"
                     onerror="this.onerror=null; this.src='${IMG_RESPALDO}';">
                <span class="proy-tarjeta-estado ${estadoClase(proy.status)}">
                    <i class="fa-solid fa-circle"></i>${proy.status}
                </span>
                <div class="proy-tarjeta-capa">
                    <span class="proy-tarjeta-servicio">${proy.servicio}</span>
                    <h3 class="proy-tarjeta-titulo">${proy.title}</h3>
                    ${detallesHTML}
                </div>
            `;
            rejilla.appendChild(tarjeta);
            setTimeout(() => tarjeta.classList.add('es-visible'), 50);
        });
        renderPaginacion(totalPaginas);
    }

    /* ============================================================
       RENDER DE LA PAGINACIÓN
       QUÉ HACE: pinta los números de página y conecta los botones.
                 dataset.page es más robusto que leer innerText.
       ============================================================ */
    function renderPaginacion(totalPaginas) {
        botonAnterior.disabled = currentPage === 1;
        botonSiguiente.disabled = currentPage === totalPaginas;
        let html = '';
        for (let i = 1; i <= totalPaginas; i++) {
            html += `<button class="proy-paginacion-boton ${i === currentPage ? 'es-activo' : ''}" data-page="${i}">${i}</button>`;
        }
        numeros.innerHTML = html;
        Array.from(numeros.children).forEach(btn =>
            btn.onclick = () => irAPagina(parseInt(btn.dataset.page, 10))
        );
    }

    /* ============================================================
       CAMBIO DE PÁGINA
       QUÉ HACE: actualiza la página y desplaza el scroll hasta los
                 FILTROS (no al título) con aire de 15px para no
                 chocar con el menú fijo.
       ============================================================ */
    function irAPagina(pagina) {
        currentPage = pagina;
        const alturaHeader = document.querySelector('#main-header')?.offsetHeight || 80;
        const posicionFiltros = filtros.getBoundingClientRect().top + window.pageYOffset;
        const posicionDestino = posicionFiltros - alturaHeader - 15;
        window.scrollTo({ top: posicionDestino, behavior: "smooth" });
        renderRejilla();
    }

    /* ============================================================
       LISTENER DE FILTROS
       QUÉ HACE: cambia el filtro activo, reinicia la paginación,
                 AUTO-CENTRA el chip tocado (primero, para que el
                 gesto se perciba al instante; el candado _centrando
                 protege los indicadores durante la animación) y
                 re-renderiza la rejilla.
       ============================================================ */
    filtros.querySelectorAll('.proy-filtros-boton').forEach(btn => {
        btn.addEventListener('click', (e) => {
            filtros.querySelectorAll('.proy-filtros-boton').forEach(b => b.classList.remove('es-activo'));
            e.currentTarget.classList.add('es-activo');
            currentFilter = e.currentTarget.getAttribute('data-filter');
            currentPage = 1;
            /* Centrado PRIMERO → luego render (el candado cubre
               toda la animación aunque el render ocurra en medio) */
            centrarFiltroActivo(filtros, btn);
            renderRejilla();
        });
    });

    /* Flechas anterior / siguiente de la paginación */
    botonAnterior.addEventListener('click', () => { if (currentPage > 1) irAPagina(currentPage - 1); });
    botonSiguiente.addEventListener('click', () => {
        const total = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < total) irAPagina(currentPage + 1);
    });

    /* ============================================================
       PROTECCIÓN BACK-FORWARD CACHE (bfcache)
       QUÉ HACE:
       1. Al volver con atrás/adelante, los setTimeout de la cascada
          no re-ejecutan y las tarjetas quedarían con opacity 0 →
          se fuerzan a es-visible.
       2. El bfcache restaura la fila de filtros con su scroll de
          salida → un scroll SINTÉTICO reevalúa los indicadores de
          flechas con esa posición exacta.
       ============================================================ */
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            rejilla.querySelectorAll('.proy-tarjeta, .proy-vacio').forEach(el => {
                el.classList.add('es-visible');
            });
            filtros.dispatchEvent(new Event('scroll'));
        }
    });

    /* ============================================================
       ORDEN DE INICIALIZACIÓN (crítico para cero errores):
       1. renderRejilla()        → contenido y layout base listos.
       2. initFiltrosDeslizables() → evalúa el candado inicial del
          HTML contra el layout REAL y activa su re-evaluación
          diferida (load + fonts.ready + red de seguridad).
       ============================================================ */
    renderRejilla();
    initFiltrosDeslizables();
}