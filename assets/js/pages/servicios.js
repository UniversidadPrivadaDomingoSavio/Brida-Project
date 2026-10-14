// ══════════════════════════════════════════════════════════════════
// CONTROLADOR — PÁGINA SERVICIOS (BRIDA S.R.L.)
// Archivo: assets/js/pages/servicios.js
// ══════════════════════════════════════════════════════════════════
// QUÉ HACE ESTE ARCHIVO:
//   A) TARJETAS .srv-tarjeta (motor original, intacto):
//      1. Cascada de entrada por sección (es-visible).
//      2. Táctil: iluminación por scroll (touch-activo, 20% central).
//      3. Escritorio: luz de ratón (--mouse-x/--mouse-y).
//   B) ÍNDICE DEL CATÁLOGO (srv-indice-*):
//      4. Flechas indicadoras SOLO en los extremos del carrusel
//         (inicio → derecha; final → izquierda) con ciclo pulsante
//         CSS, candado inicial del HTML validado y re-evaluación
//         diferida (load + fonts.ready + red de seguridad).
//      5. Auto-centrado del chip activo (rAF universal, Safari-safe,
//         candado _centrando que congela las flechas durante la
//         animación y las reevalúa una sola vez al terminar).
//      6. Navegación: chips → salto suave a la sección (offset de
//         header + barra sticky) + SCROLL-SPY: al hacer scroll, el
//         chip de la sección visible se activa y se auto-centra.
//         Silenciador anti-flicker durante los saltos por clic.
//   C) Protección Back-Forward Cache (bfcache).
// NOTA: nombres de clases/IDs sincronizados con servicios.html y
//       servicios.css (prefijo srv-). main.js NO cambia (mismo
//       export: initServicios).
// ══════════════════════════════════════════════════════════════════


/* ============================================================
   MÓDULO 1 — CASCADA DE ENTRADA (tarjetas .srv-tarjeta)
   QUÉ HACE: revela cada tarjeta con retardo escalonado cuando
             entra en viewport. El índice se calcula DENTRO de su
             propio grid (.srv-grid) para que la cascada reinicie
             en cada sección de la página.
   ============================================================ */
function animarCascadaTarjetas(tarjetas) {
    const observadorCascada = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const tarjeta = entry.target;

                /* Grid padre para la posición exacta en su sección */
                const gridPadre = tarjeta.closest('.srv-grid');
                if (!gridPadre) {
                    /* Defensivo: sin grid padre → visible sin cascada */
                    tarjeta.classList.add('es-visible');
                    observadorCascada.unobserve(tarjeta);
                    return;
                }
                const tarjetasEnGrid = Array.from(gridPadre.querySelectorAll('.srv-tarjeta'));
                const index = tarjetasEnGrid.indexOf(tarjeta);

                /* Retraso escalonado: 100ms, 180ms, 260ms...        */
                const delay = 100 + (index * 80);

                setTimeout(function () {
                    tarjeta.classList.add('es-visible');
                    tarjeta.style.transition = 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s ease';
                }, delay);

                observadorCascada.unobserve(tarjeta); /* Solo una vez */
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    tarjetas.forEach(tarjeta => observadorCascada.observe(tarjeta));
}


/* ============================================================
   MÓDULO 2 — ILUMINACIÓN TÁCTIL POR SCROLL (tarjetas)
   QUÉ HACE: en móviles/tablets añade touch-activo cuando la
             tarjeta cruza el 20% central de la pantalla (equivale
             táctil del hover, sin depender de puntero fino).
   ============================================================ */
function activarHoverTactil(tarjetas) {
    const observadorTactil = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('touch-activo');
            } else {
                entry.target.classList.remove('touch-activo');
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    tarjetas.forEach(tarjeta => observadorTactil.observe(tarjeta));
}


/* ============================================================
   MÓDULO 3 — LUZ DE RATÓN (tarjetas, solo escritorio)
   QUÉ HACE: alimenta --mouse-x/--mouse-y en PORCENTAJES con la
             posición del cursor; el ::after del CSS dibuja el
             gradiente radial que sigue al puntero.
   ============================================================ */
function activarEfectoLuz(tarjetas) {
    tarjetas.forEach(function (tarjeta) {
        tarjeta.addEventListener('mousemove', function (e) {
            const rect = tarjeta.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            tarjeta.style.setProperty('--mouse-x', x + '%');
            tarjeta.style.setProperty('--mouse-y', y + '%');
        });
    });
}


/* ============================================================
   MÓDULO 4 — FLECHAS INDICADORAS EN EXTREMOS (índice, móvil)
   QUÉ HACE: gestiona TODO el estado de las flechas del índice:
             - Si el carrusel desborda → activa tiene-deslizable y,
               según la posición del scroll, enciende la flecha del
               extremo correspondiente:
               · Al INICIO → tiene-derecha (flecha derecha pulsa).
               · Al FINAL  → tiene-izquierda (flecha izquierda pulsa).
             - Si NO desborda (escritorio) → LIMPIA las 3 clases
               (corrige el candado inicial del HTML).
   CANDADO: los scrolls que genera el auto-centrado del chip activo
             NO reevalúan los indicadores (propiedad _centrando del
             elemento); el propio centrado dispara un scroll
             sintético al terminar para sincronizar una sola vez.
   RE-EVALUACIÓN DIFERIDA: window.load + document.fonts.ready +
             red de seguridad a 350ms — corrige estados fantasma
             (fuentes que cambian el ancho de los chips, scroll
             restaurado por Live Server, rotaciones, etc.).
   ============================================================ */
function initIndiceDeslizable(indice, zona) {
    if (!indice || !zona) return;

    /* Tolerancia en px para "extremo" o "sin desborde" */
    const TOL = 4;

    /* ¿El carrusel desborda horizontalmente? */
    const tieneDesborde = () => indice.scrollWidth > indice.clientWidth + TOL;

    /* ÚNICA FUENTE DE VERDAD de las clases de la zona */
    const recalcularEstado = () => {
        if (!tieneDesborde()) {
            /* Sin desborde → mecanismo apagado por completo       */
            zona.classList.remove('tiene-deslizable', 'tiene-derecha', 'tiene-izquierda');
            return;
        }
        const maxScroll = indice.scrollWidth - indice.clientWidth;
        const alInicio  = indice.scrollLeft <= TOL;
        const alFinal   = indice.scrollLeft >= maxScroll - TOL;

        zona.classList.add('tiene-deslizable');
        zona.classList.toggle('tiene-derecha', alInicio);
        zona.classList.toggle('tiene-izquierda', alFinal);
    };

    /* CANDADO: durante el centrado del chip activo, los scrolls
       disparados por la animación NO reevalúan indicadores      */
    indice.addEventListener('scroll', () => {
        if (indice._centrando) return;
        recalcularEstado();
    }, { passive: true });

    /* Rotación / cambio de tamaño del viewport                  */
    window.addEventListener('resize', recalcularEstado);

    /* RE-EVALUACIÓN DIFERIDA — layout definitivo                */
    window.addEventListener('load', recalcularEstado);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(recalcularEstado).catch(() => {});
    }
    setTimeout(recalcularEstado, 350);

    /* PRIMERA EVALUACIÓN: valida el candado inicial del HTML
       ("tiene-deslizable tiene-derecha") contra la realidad     */
    recalcularEstado();
}


/* ============================================================
   MÓDULO 5 — AUTO-CENTRADO DEL CHIP ACTIVO (índice, universal)
   QUÉ HACE: centra EXACTAMENTE el chip en el medio del carrusel
             con desplazamiento animado. Así el usuario ve su
             selección y, a ambos lados, que existen más categorías.
   POR QUÉ NO scrollTo(): Element.scrollTo({behavior:'smooth'})
             NO es soportado en Safari iOS < 15.4 (el objeto de
             opciones se ignora). Animación MANUAL con
             requestAnimationFrame: funciona en el 100% de
             navegadores.
   CANDADO _centrando:
   - true durante la animación → indicadores de flechas congelados.
   - Al terminar: candado liberado + scroll sintético que
     reevalúa los indicadores UNA sola vez con la posición final.
   - Si el usuario interrumpe con el dedo: candado liberado +
     sincronización inmediata (el gesto nativo continúa desde ahí).
   DETALLES: easeOutCubic · cancela animación previa (taps
   rápidos) · clamp manual a [0, máximo].
   EN DESKTOP: no hace nada (sin overflow). Respeta reduced-motion.
   ============================================================ */
function centrarChipActivo(indice, chip) {
    if (indice.scrollWidth <= indice.clientWidth + 4) return; /* sin overflow */

    const rectFila = indice.getBoundingClientRect();
    const rectChip = chip.getBoundingClientRect();

    /* Delta exacto entre el centro del carrusel y el centro del chip */
    const centroFila = rectFila.left + (rectFila.width / 2);
    const centroChip = rectChip.left + (rectChip.width / 2);
    const maxScroll  = indice.scrollWidth - indice.clientWidth;
    const objetivo   = Math.max(0, Math.min(maxScroll, indice.scrollLeft + (centroChip - centroFila)));

    /* Movimiento reducido: salto directo. El scroll nativo
       disparará la reevaluación de indicadores.                  */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        indice.scrollLeft = objetivo;
        return;
    }

    const inicio    = indice.scrollLeft;
    const distancia = objetivo - inicio;
    if (Math.abs(distancia) < 2) return; /* Ya está centrado */

    const duracion    = 450;
    const momentoCero = performance.now();

    /* Cancelar animación de centrado previa (cambios de sección
       rápidos durante el scroll de página o taps rápidos)        */
    if (indice._animCentrado) cancelAnimationFrame(indice._animCentrado);

    /* ACTIVAR CANDADO: flechas congeladas hasta terminar          */
    indice._centrando = true;

    /* El usuario interrumpe deslizando a mano → la animación cede
       (handler reemplazado para no acumular listeners)           */
    if (indice._cederHandler) {
        indice.removeEventListener('touchstart', indice._cederHandler);
    }
    const cederAlUsuario = () => {
        if (indice._animCentrado) {
            cancelAnimationFrame(indice._animCentrado);
            indice._animCentrado = null;
            /* Liberar candado + sincronizar indicadores con la
               posición a mitad de animación                       */
            indice._centrando = false;
            indice.dispatchEvent(new Event('scroll'));
        }
        indice._cederHandler = null;
    };
    indice._cederHandler = cederAlUsuario;
    indice.addEventListener('touchstart', cederAlUsuario, { once: true, passive: true });

    const paso = (ahora) => {
        const t = Math.min((ahora - momentoCero) / duracion, 1);
        const ease = 1 - Math.pow(1 - t, 3); /* easeOutCubic */
        indice.scrollLeft = inicio + (distancia * ease);
        if (t < 1) {
            indice._animCentrado = requestAnimationFrame(paso);
        } else {
            /* FIN DEL CENTRADO: liberar candado + scroll sintético
               → los indicadores se sincronizan con la posición
               final exacta (una sola vez)                         */
            indice._animCentrado = null;
            indice._centrando = false;
            indice.dispatchEvent(new Event('scroll'));
        }
    };
    indice._animCentrado = requestAnimationFrame(paso);
}


/* ============================================================
   MÓDULO 6 — NAVEGACIÓN DEL ÍNDICE + SCROLL-SPY
   QUÉ HACE:
   A) SALTO POR CHIP: al tocar un chip, silencia el spy (1.1s,
      evita el parpadeo de chips mientras la página atraviesa
      secciones intermedias), activa el chip tocado, lo centra y
      desplaza la PÁGINA hasta su sección con offset exacto
      (header fijo + barra sticky del índice en escritorio).
   B) SCROLL-SPY: al hacer scroll de página, detecta qué sección
      cruza la línea de detección (38% del viewport) y activa su
      chip (es-activo + aria-current) centrándolo SOLO CUANDO
      CAMBIA (patrón de pestañas de YouTube). Fallback: al llegar
      al final de la página, activa el último chip.
   THROTTLING: el listener de scroll se procesa máximo una vez por
      frame (requestAnimationFrame) para rendimiento óptimo.
   ============================================================ */
function initIndiceNavegacion(indice, zona) {
    if (!indice || !zona) return;

    const chips     = Array.from(indice.querySelectorAll('.srv-indice-boton'));
    if (chips.length === 0) return;

    /* Secciones objetivo (en el mismo orden que los chips)        */
    const secciones = chips
        .map(chip => document.getElementById(chip.dataset.objetivo))
        .filter(Boolean);
    if (secciones.length === 0) return;

    /* Chip activo actual (para centrar SOLO cuando cambia)        */
    let chipActivoId = null;

    /* SILenciador del spy: true durante los saltos por clic       */
    let spySilenciado = false;
    let spySilencioTimer = null;
    const silenciarSpy = () => {
        spySilenciado = true;
        clearTimeout(spySilencioTimer);
        spySilencioTimer = setTimeout(() => { spySilenciado = false; }, 1100);
    };

    /* Activa un chip por el ID de su sección y lo centra si cambió */
    const activarChipPorSeccion = (idSeccion) => {
        if (chipActivoId === idSeccion) return; /* sin cambios */
        chipActivoId = idSeccion;
        chips.forEach(chip => {
            const esEste = chip.dataset.objetivo === idSeccion;
            chip.classList.toggle('es-activo', esEste);
            if (esEste) {
                chip.setAttribute('aria-current', 'true');
                centrarChipActivo(indice, chip);
            } else {
                chip.removeAttribute('aria-current');
            }
        });
    };

    /* SCROLL-SPY: la sección activa es la última cuyo borde
       superior quedó por encima de la línea de detección
       (38% del alto del viewport). Fallback: final de página.    */
    const evaluarSeccionActiva = () => {
        if (spySilenciado) return;
        const linea = window.innerHeight * 0.38;

        let seccionActiva = secciones[0];
        for (const seccion of secciones) {
            if (seccion.getBoundingClientRect().top <= linea) {
                seccionActiva = seccion;
            }
        }
        /* Fallback: cerca del final de la página → último chip    */
        const alFinal = (window.innerHeight + window.pageYOffset) >=
                        (document.documentElement.scrollHeight - 40);
        if (alFinal) seccionActiva = secciones[secciones.length - 1];

        activarChipPorSeccion(seccionActiva.id);
    };

    /* Throttle con rAF: máximo una evaluación por frame           */
    let spyPendiente = false;
    window.addEventListener('scroll', () => {
        if (spyPendiente) return;
        spyPendiente = true;
        requestAnimationFrame(() => {
            evaluarSeccionActiva();
            spyPendiente = false;
        });
    }, { passive: true });

    /* A) SALTO POR CHIP                                           */
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const seccion = document.getElementById(chip.dataset.objetivo);
            if (!seccion) return;

            /* Silenciar el spy: el chip clicado manda durante el
               salto (las secciones intermedias no lo roban)       */
            silenciarSpy();

            /* Activar + centrar de inmediato (feedback instantáneo) */
            chips.forEach(c => {
                c.classList.remove('es-activo');
                c.removeAttribute('aria-current');
            });
            chip.classList.add('es-activo');
            chip.setAttribute('aria-current', 'true');
            chipActivoId = chip.dataset.objetivo;
            centrarChipActivo(indice, chip);

            /* Salto de PÁGINA con offset exacto:
               header fijo + barra sticky del índice (solo ≥768px,
               donde es flotante) + aire de 15px                   */
            const alturaHeader = document.querySelector('#main-header')?.offsetHeight || 80;
            const esEscritorio = window.matchMedia('(min-width: 768px)').matches;
            const alturaSticky = esEscritorio ? zona.offsetHeight : 0;
            const posicionSeccion = seccion.getBoundingClientRect().top + window.pageYOffset;
            const posicionDestino = posicionSeccion - alturaHeader - alturaSticky - 15;
            window.scrollTo({ top: Math.max(0, posicionDestino), behavior: 'smooth' });
        });
    });

    /* Evaluación inicial: si la página carga a mitad de scroll
       (Live Server restaura posición), el chip correcto aparece
       activo desde el primer frame                               */
    evaluarSeccionActiva();
}


/* ================================================================
   ORQUESTADOR DE LA PÁGINA SERVICIOS
   ORDEN DE INICIALIZACIÓN (crítico para cero errores):
   1. Tarjetas: cascada + comportamiento según dispositivo
      (táctil por scroll / luz de ratón) — motor original.
   2. Índice: flechas en extremos (valida candado del HTML) +
      navegación con scroll-spy (activa y centra chips).
   3. bfcache: al volver con atrás/adelante → tarjetas visibles,
      indicadores del índice sincronizados y spy reevaluado.
   ================================================================ */
export function initServicios() {
    const tarjetas = document.querySelectorAll('.srv-tarjeta');
    if (tarjetas.length === 0) return; // Si no estamos en la página, no hacer nada

    /* ── 1. TARJETAS (motor original) ─────────────────────────── */

    // 1a. Animación de entrada (Cascada)
    animarCascadaTarjetas(tarjetas);

    // 1b. Comportamiento según dispositivo
    const esTactil = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (esTactil) {
        activarHoverTactil(tarjetas);
    } else {
        activarEfectoLuz(tarjetas);
    }

    /* ── 2. ÍNDICE DEL CATÁLOGO ───────────────────────────────── */

    const indice = document.getElementById('srv-indice');
    const zona   = document.getElementById('srv-indice-zona');
    if (indice && zona) {
        // 2a. Flechas indicadoras en extremos (solo móvil con desborde;
        //     en escritorio LIMPIA el candado inicial del HTML)
        initIndiceDeslizable(indice, zona);

        // 2b. Navegación por chips + scroll-spy con auto-centrado
        initIndiceNavegacion(indice, zona);
    }

    /* ── 3. PROTECCIÓN BACK-FORWARD CACHE (bfcache) ───────────── */
    /* Al volver con atrás/adelante:
       - Los setTimeout de la cascada no re-ejecutan → forzar
         es-visible en todas las tarjetas.
       - El bfcache restaura el scroll del carrusel → un scroll
         SINTÉTICO reevalúa las flechas con esa posición.
       - El spy se reevalúa para activar el chip correcto.        */
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            tarjetas.forEach(function (tarjeta) {
                tarjeta.classList.add('es-visible');
            });
            if (indice) {
                indice.dispatchEvent(new Event('scroll'));
            }
            /* Reevaluar el spy: la posición restaurada determina
               el chip activo (los handlers de scroll no se
               disparan solos tras la restauración del bfcache)    */
            if (indice && zona) {
                const chipActivo = indice.querySelector('.srv-indice-boton.es-activo');
                if (chipActivo) {
                    const seccion = document.getElementById(chipActivo.dataset.objetivo);
                    /* Solo reevaluar si ya hay un chip activo:
                       el spy continuará en el próximo scroll     */
                    if (seccion) return;
                }
            }
        }
    });
}