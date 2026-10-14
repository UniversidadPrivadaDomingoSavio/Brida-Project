// ══════════════════════════════════════════════════════════════════
// CONTROLADOR — PÁGINA QUIÉNES SOMOS (BRIDA S.R.L.)
// Archivo: assets/js/pages/quienes-somos.js
// ══════════════════════════════════════════════════════════════════
// QUÉ HACE ESTE ARCHIVO:
//   1. TIMELINE (qs-historia-*): línea tricolor que se llena con el
//      scroll, ítem enfocado/difuminado según cercanía al centro,
//      zoom táctil por sección visible y parallax de ratón.
//   2. PILARES (qs-principios-*): DOS MODOS según viewport:
//      · ESCRITORIO (>1024px): cascada de las 3 tarjetas con
//        limpieza de delays post-cascada.
//      · CARRUSEL INFINITO (≤1024px): loop REAL con clon de la 1ª
//        diapositiva — al llegar a la 3ª sigue girando a la
//        IZQUIERDA y encadena con la 1ª sin salto visible; la
//        diapositiva saliente se ALEJA (scale .92 · opacity .4) y
//        la entrante se EXPANDE desde atrás hacia el foco.
//        Indicadores sincronizados, swipe táctil y pausas.
//   3. ORGANIGRAMA (qs-org-*): nodos clicables → modal de detalle
//      con GUARDIA DE IMAGEN, gestión de FOCO (entra al botón
//      cerrar, vuelve al nodo origen) y PRENSIÓN TÁCTIL robusta
//      (.es-presionado — feedback garantizado en iOS).
//   4. PROTECCIÓN bfcache: modal se cierra; carrusel re-sincroniza
//      su posición.
// NOMBRES: sincronizados con quienes-somos.html y quienes-somos.css
//      (prefijo qs-). main.js NO cambia (mismo export).
// ══════════════════════════════════════════════════════════════════


/* ================================================================
   1. SECCIÓN TRAYECTORIA (Timeline) — SIN CAMBIOS funcionales.
   (Las imágenes ahora escalan con aspect-ratio en el CSS: este
   módulo no las mide, así que no requiere ajustes.)
   ================================================================ */
function initTimeline() {
    const seccionHistoria = document.getElementById('qs-historia');
    if (!seccionHistoria) return; // Si no existe, salimos sin error

    const barraProgreso = document.getElementById('qs-historia-progreso');
    const contenedorTimeline = document.getElementById('qs-historia-contenedor');
    const itemsTimeline = document.querySelectorAll('.qs-historia-item');

    if (!contenedorTimeline || itemsTimeline.length === 0) return;

    const tieneObservador = 'IntersectionObserver' in window;
    const prefiereReducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!tieneObservador || prefiereReducirMovimiento) {
        itemsTimeline.forEach(function (item) {
            item.classList.add('es-visible', 'esta-enfocado', 'zoom-activo');
        });
        if (barraProgreso) barraProgreso.style.height = '100%';
        return;
    }

    let progresoActual = 0;
    let progresoObjetivo = 0;
    let idAnimacion = null;
    let indiceItemActual = -1;
    let esMovil = window.innerWidth <= 767; // 767 = breakpoint móvil del CSS

    function verificarMovil() { esMovil = window.innerWidth <= 767; }

    let tiempoEsperaResize = null;
    window.addEventListener('resize', function () {
        if (tiempoEsperaResize) clearTimeout(tiempoEsperaResize);
        tiempoEsperaResize = setTimeout(function () {
            verificarMovil();
            actualizarEfectoFoco();
            actualizarLineaProgreso();
        }, 150);
    });

    function actualizarEfectoFoco() {
        const alturaVentana = window.innerHeight;
        const puntoFocal = alturaVentana * (esMovil ? 0.40 : 0.45);
        let itemMasCercano = null;
        let distanciaMasCercana = Infinity;
        let indiceMasCercano = -1;

        itemsTimeline.forEach(function (item, index) {
            if (!item.classList.contains('es-visible')) return;
            const rect = item.getBoundingClientRect();
            const centroItem = rect.top + (rect.height / 2);
            const distancia = Math.abs(centroItem - puntoFocal);
            if (distancia < distanciaMasCercana) {
                distanciaMasCercana = distancia;
                itemMasCercano = item;
                indiceMasCercano = index;
            }
        });

        if (itemMasCercano && indiceMasCercano !== indiceItemActual) {
            indiceItemActual = indiceMasCercano;
            itemsTimeline.forEach(function (item, index) {
                item.classList.remove('esta-enfocado', 'esta-difuminado');
                if (!item.classList.contains('es-visible')) return;
                if (index === indiceItemActual) {
                    item.classList.add('esta-enfocado');
                } else {
                    item.classList.add('esta-difuminado');
                }
            });
        }
    }

    function animarProgreso() {
        const diferencia = progresoObjetivo - progresoActual;
        if (Math.abs(diferencia) > 0.1) {
            progresoActual += diferencia * 0.12;
            if (barraProgreso) barraProgreso.style.height = progresoActual + '%';
            idAnimacion = requestAnimationFrame(animarProgreso);
        } else {
            progresoActual = progresoObjetivo;
            if (barraProgreso) barraProgreso.style.height = progresoActual + '%';
            idAnimacion = null;
        }
    }

    function actualizarLineaProgreso() {
        if (!contenedorTimeline || !barraProgreso) return;
        const rectContenedor = contenedorTimeline.getBoundingClientRect();
        const alturaVentana = window.innerHeight;
        const alturaContenedor = contenedorTimeline.offsetHeight;
        const centroVentana = alturaVentana * 0.5;
        let progreso = 0;

        if (rectContenedor.top <= centroVentana && rectContenedor.bottom >= centroVentana) {
            const scrollRealizado = centroVentana - rectContenedor.top;
            progreso = Math.min(100, Math.max(0, (scrollRealizado / alturaContenedor) * 100));
        } else if (rectContenedor.top > centroVentana) {
            progreso = 0;
        } else if (rectContenedor.bottom < centroVentana) {
            progreso = 100;
        }

        progresoObjetivo = progreso;
        if (idAnimacion === null) idAnimacion = requestAnimationFrame(animarProgreso);
    }

    const opcionesObservador = { root: null, rootMargin: '-60px 0px -60px 0px', threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1] };
    const observadorItems = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
                entry.target.classList.add('es-visible');
            }
        });
        actualizarEfectoFoco();
    }, opcionesObservador);

    itemsTimeline.forEach(function (item) { observadorItems.observe(item); });

    const esTactil = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (esTactil) {
        const observadorZoom = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { entry.target.classList.add('zoom-activo'); }
                else { entry.target.classList.remove('zoom-activo'); }
            });
        }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
        itemsTimeline.forEach(function (item) { observadorZoom.observe(item); });
    }

    let tiempoEsperaScroll = null;
    let ultimoTiempoScroll = 0;
    const intervaloScroll = 16;

    function alHacerScroll() {
        const ahora = Date.now();
        if (ahora - ultimoTiempoScroll >= intervaloScroll) {
            ultimoTiempoScroll = ahora;
            actualizarLineaProgreso();
            actualizarEfectoFoco();
        } else {
            if (tiempoEsperaScroll) clearTimeout(tiempoEsperaScroll);
            tiempoEsperaScroll = setTimeout(function () {
                actualizarLineaProgreso();
                actualizarEfectoFoco();
            }, intervaloScroll);
        }
    }
    window.addEventListener('scroll', alHacerScroll, { passive: true });

    verificarMovil();
    if (barraProgreso) barraProgreso.style.height = '0%';
    setTimeout(function () { actualizarLineaProgreso(); actualizarEfectoFoco(); }, 100);

    if (!esTactil) {
        const contenedoresImagen = document.querySelectorAll('.qs-historia-imagen-contenedor');
        contenedoresImagen.forEach(function (contenedor) {
            const imagen = contenedor.querySelector('.qs-historia-imagen');
            if (!imagen) return;
            contenedor.addEventListener('mousemove', function (e) {
                const rect = contenedor.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                imagen.style.transform = 'scale(1.05) translate(' + (x * 12) + 'px, ' + (y * 12) + 'px)';
                imagen.style.filter = 'grayscale(0%) brightness(1)';
            });
            contenedor.addEventListener('mouseleave', function () {
                imagen.style.transform = 'scale(1)';
                imagen.style.filter = 'grayscale(30%) brightness(0.95)';
            });
        });
    }
}


/* ================================================================
   2. SECCIÓN PRINCIPIOS (VMO) — DOS MODOS SEGÚN VIEWPORT
   ────────────────────────────────────────────────────────────────
   a) ESCRITORIO (>1024px): cascada con IntersectionObserver y
      limpieza de delays post-cascada. HOVER: solo crecimiento
      (la línea animada fue retirada por decisión de diseño).
   b) CARRUSEL INFINITO (≤1024px) — TÉCNICA DEL CLON, v2:
      ⭐ FIX 1 — SALTO INVISIBLE (adéu flash de "carga"):
      el clon es un ESPEJO ADITIVO del estado de foco: durante la
      vuelta 3→1, la tarjeta real destino (la 1ª) conserva su foco
      pleno Y el clon lo replica → el salto sin transición es
      idéntico al píxel y NO produce el encogido/oscurecido que se
      percibía como "pausa de carga".
      ⭐ FIX 2 — CANDADO SUAVE CON ENCOLADO (nadie se queda sin
      respuesta): los gestos (swipe/puntos/flechas) que llegan
      DURANTE una vuelta ya no se descartan: se ENCOLAN (el último
      manda) y se ejecutan automáticamente al liberarse el candado
      → deslizar del 3 (en vuelta) responde en cuanto el loop
      termina; nunca más "no pasa nada".
      · Loop sin costura: [1][2][3][clon-1] → anima a la izquierda
        hasta el clon → salto invisible a la 1ª real.
      · Vuelta inversa (1→3): salto silencioso al clon → anima a
        la derecha hasta la 3ª real.
      · Profundidad de foco: la saliente se aleja (scale .92 ·
        opacity .4) y la entrante se expande desde atrás.
      · Pausas inteligentes, swipe táctil, reduced-motion,
        bfcache y montaje/desmontaje limpio al cruzar 1024px.
   ================================================================ */
function initPrincipios() {
    const tarjetas = Array.from(document.querySelectorAll('.qs-principios-tarjeta'));
    if (tarjetas.length === 0) return;

    const seccion   = document.getElementById('qs-principios');
    const ventana   = document.querySelector('.qs-principios-contenedor'); /* VENTANA */
    const pista     = document.querySelector('.qs-principios-grid');       /* PISTA   */
    const controles = document.getElementById('qs-principios-controles');
    const puntos    = controles ? Array.from(controles.querySelectorAll('.qs-principios-punto')) : [];

    const mqCarrusel = window.matchMedia('(max-width: 1024px)');

    /* reduced-motion → el CSS apila las tarjetas en columna: nada
       que animar ni montar.                                       */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* ----------------------- ESTADO ----------------------------- */
    let modoCarrusel = false;
    let yaReveladas = false;
    let indiceLogico = 0;          /* diapositiva lógica activa 0..N-1 */
    let enVuelta = false;          /* candado del loop infinito        */
    let intencionPendiente = null; /* ⭐ FIX 2: gesto encolado durante la vuelta */
    let timerAuto = null;
    let seccionVisible = false;
    let observadorCascada = null;
    let observadorSeccion = null;
    let clonPrimera = null;        /* copia de la 1ª diapositiva (loop) */
    let nodoXSwipe = 0;
    let nodoYSwipe = 0;

    const total = tarjetas.length;

    const INTERVALO_AUTO = 5000;        /* 5s por diapositiva         */
    const UMBRAL_SWIPE = 50;            /* px mínimos del gesto       */
    const LIMPIEZA_DELAY = 1200;        /* cascada + transición + margen */
    const RESPALDO_TRANSICION = 900;    /* > 0.8s (curva CSS)         */

    /* ============================================================
       PISTA INFINITA — MONTAJE/DESMONTAJE DEL CLON
       ============================================================ */
    function montarPistaInfinita() {
        if (clonPrimera || total < 2 || !pista) return;
        clonPrimera = tarjetas[0].cloneNode(true);
        clonPrimera.classList.add('es-clon');
        clonPrimera.classList.remove('es-activa');
        clonPrimera.style.transitionDelay = '';
        clonPrimera.setAttribute('aria-hidden', 'true'); /* decorativa */
        clonPrimera.classList.add('es-visible');
        pista.appendChild(clonPrimera);
    }

    function desmontarPistaInfinita() {
        if (!clonPrimera) return;
        clonPrimera.remove();
        clonPrimera = null;
    }

    /* ============================================================
       UTILIDADES DE MOVIMIENTO
       ============================================================ */

    /* Fin de transición ROBUSTO: transitionend + respaldo por
       tiempo (por si el navegador lo pierde en segundo plano).    */
    function alTerminarTransicion(callback) {
        let hecho = false;
        const terminar = function () {
            if (hecho) return;
            hecho = true;
            pista.removeEventListener('transitionend', fin);
            clearTimeout(respaldor);
            callback();
        };
        const fin = function (e) {
            if (e.target !== pista || e.propertyName !== 'transform') return;
            terminar();
        };
        const respaldor = setTimeout(terminar, RESPALDO_TRANSICION);
        pista.addEventListener('transitionend', fin);
    }

    /* Salto instantáneo del track (sin animación) + reflow para
       fijar el estado antes de re-habilitar la transición CSS     */
    function saltarSinTransicion(posicionFisica) {
        pista.style.transition = 'none';
        pista.style.transform = 'translateX(-' + (posicionFisica * 100) + '%)';
        void pista.offsetWidth; /* fuerza el reflow                    */
        pista.style.transition = '';
    }

    /* Sincroniza indicadores (puntos) y profundidad de foco.
       ⭐ FIX 1 (espejo aditivo): `conClon` NO retira el foco de la
       tarjeta real destino — solo lo AÑADE al clon. Así, durante
       la vuelta, la real destino está a foco pleno detrás del
       clon (idénticos) y el salto final es imperceptible.         */
    function sincronizarUI(indiceVisible, conClon) {
        puntos.forEach(function (punto, index) {
            punto.classList.toggle('es-activo', index === indiceVisible);
        });
        tarjetas.forEach(function (tarjeta, index) {
            tarjeta.classList.toggle('es-activa', index === indiceVisible);
        });
        if (clonPrimera) clonPrimera.classList.toggle('es-activa', !!conClon);
    }

    /* ============================================================
       CANDADO SUAVE — ENCOLADO DE GESTOS (⭐ FIX 2)
       Un gesto que llega durante la vuelta NO se descarta: se
       encola (el último manda) y se ejecuta al liberar el candado,
       un frame después del salto (para que ya esté pintado).
       ============================================================ */
    function encolar(fn) {
        intencionPendiente = fn;
    }

    function liberarVuelta() {
        enVuelta = false;
        if (intencionPendiente) {
            const fn = intencionPendiente;
            intencionPendiente = null;
            requestAnimationFrame(fn);
        }
    }

    /* ============================================================
       NAVEGACIÓN DEL CARRUSEL INFINITO
       ============================================================ */

    /* Paso normal (sin cruzar el borde): animación directa        */
    function pasoSimple(destino) {
        indiceLogico = destino;
        pista.style.transform = 'translateX(-' + (destino * 100) + '%)';
        sincronizarUI(destino, false);
    }

    /* ⭐ VUELTA ADELANTE (3 → 1) siguiendo a la IZQUIERDA:
       1) Anima hasta el CLON de la 1ª (posición física = total).
          FIX 1: la real 1ª y el clon quedan AMBOS con foco pleno
          → cuando el track salte a la real, no habrá encogido.
       2) Al terminar: salto SIN transición a la 1ª real → loop
          imperceptible → liberar candado (con gesto encolado).    */
    function vueltaAdelante() {
        enVuelta = true;
        pista.style.transform = 'translateX(-' + (total * 100) + '%)';
        sincronizarUI(0, true); /* real 1 + clon en foco (espejo)     */
        alTerminarTransicion(function () {
            saltarSinTransicion(0);
            indiceLogico = 0;
            sincronizarUI(0, false); /* el clon pierde foco (fuera de cuadro) */
            liberarVuelta();
        });
    }

    /* ⭐ VUELTA ATRÁS (1 → 3 con gesto a la derecha):
       1) Salto SIN transición AL clon (foco espejo: real 1 + clon
          idénticos → salto invisible).
       2) Doble rAF → anima a la derecha hasta la 3ª real.
       ⭐ FIX RAÍZ DEL BUG "3→3": sincronizar indiceLogico con la
       diapositiva REAL de destino (total − 1). Sin esta línea, al
       terminar la vuelta quedabas VIENDO la 3 con el estado interno
       en 0 → el siguiente retroceso re-evaluaba "estoy en la 1" y
       re-ejecutaba el loop (3→3) en vez de ir a la 2.             */
    function vueltaAtras() {
        enVuelta = true;
        saltarSinTransicion(total);
        sincronizarUI(0, true);
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                pista.style.transform = 'translateX(-' + ((total - 1) * 100) + '%)';
                indiceLogico = total - 1; /* ⭐ LA LÍNEA QUE FALTABA */
                sincronizarUI(total - 1, false);
                alTerminarTransicion(function () {
                    liberarVuelta();
                });
            });
        });
    }

    /* Entradas de navegación: si hay vuelta en curso, el gesto se
       ENCOLA (respuesta garantizada al liberar) — nunca ignorado  */
    function avanzar() {
        if (enVuelta) { encolar(avanzar); return; }
        if (indiceLogico === total - 1) { vueltaAdelante(); }
        else { pasoSimple(indiceLogico + 1); }
    }

    function retroceder() {
        if (enVuelta) { encolar(retroceder); return; }
        if (indiceLogico === 0) { vueltaAtras(); }
        else { pasoSimple(indiceLogico - 1); }
    }

    /* Salto directo por indicadores                               */
    function irA(destino) {
        if (enVuelta) { encolar(function () { irA(destino); }); return; }
        if (destino !== indiceLogico) pasoSimple(destino);
    }

    /* ============================================================
       AUTO-AVANCE Y PAUSAS INTELIGENTES
       ============================================================ */
    function detenerAuto() {
        if (timerAuto) { clearInterval(timerAuto); timerAuto = null; }
    }

    function iniciarAuto() {
        detenerAuto();
        if (!seccionVisible || document.hidden) return;
        timerAuto = setInterval(avanzar, INTERVALO_AUTO);
    }

    function reiniciarAuto() { iniciarAuto(); }

    /* PÍLDORA CRÍTICA: revela TODAS las diapositivas en cascada
       cuando la sección entra en viewport (los slides 2/3 viven
       fuera de la ventana y el IO por tarjeta no los vería).      */
    function revelarTarjetas() {
        yaReveladas = true;
        tarjetas.forEach(function (tarjeta, index) {
            if (!tarjeta.classList.contains('es-visible')) {
                tarjeta.style.transitionDelay = (index * 100) + 'ms';
                tarjeta.classList.add('es-visible');
            }
            setTimeout(function () { tarjeta.style.transitionDelay = ''; }, LIMPIEZA_DELAY);
        });
    }

    function montarObservadorSeccion() {
        if (!seccion) {
            revelarTarjetas();
            seccionVisible = true;
            iniciarAuto();
            return;
        }
        observadorSeccion = new IntersectionObserver(function (entries) {
            seccionVisible = entries[0].isIntersecting;
            if (seccionVisible) {
                if (!yaReveladas) revelarTarjetas();
                iniciarAuto();
            } else {
                detenerAuto();
            }
        }, { threshold: 0.15 });
        observadorSeccion.observe(seccion);
    }

    /* ============================================================
       MONTAJE / DESMONTAJE DEL MODO (idempotentes)
       ============================================================ */
    function activarCarrusel() {
        modoCarrusel = true;
        enVuelta = false;
        intencionPendiente = null;
        indiceLogico = 0;
        if (observadorCascada) { observadorCascada.disconnect(); observadorCascada = null; }
        montarPistaInfinita();
        saltarSinTransicion(0);
        sincronizarUI(0, false);
        montarObservadorSeccion();
    }

    function desactivarCarrusel() {
        modoCarrusel = false;
        enVuelta = false;
        intencionPendiente = null;
        detenerAuto();
        if (observadorSeccion) { observadorSeccion.disconnect(); observadorSeccion = null; }
        seccionVisible = false;
        desmontarPistaInfinita();
        if (pista) { pista.style.transform = ''; pista.style.transition = ''; }
        tarjetas.forEach(function (tarjeta) { tarjeta.classList.remove('es-activa'); });
    }

    function montarModo() {
        if (mqCarrusel.matches) {
            if (!modoCarrusel) activarCarrusel();
        } else {
            if (modoCarrusel) desactivarCarrusel();
            montarCascada();
        }
    }

    /* ============================================================
       MODO ESCRITORIO — CASCADA (idempotente + limpieza de delays)
       ============================================================ */
    function montarCascada() {
        const pendientes = tarjetas.filter(function (t) {
            return !t.classList.contains('es-visible');
        });
        if (pendientes.length === 0) return;

        if (!observadorCascada) {
            observadorCascada = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('es-visible');
                    observer.unobserve(entry.target);
                    /* Limpieza post-cascada: sin ella el delay
                       inline retrasaba el hover 100–200ms        */
                    setTimeout(function () {
                        entry.target.style.transitionDelay = '';
                    }, LIMPIEZA_DELAY);
                });
            }, { threshold: 0.15 });
        }

        pendientes.forEach(function (tarjeta) {
            const index = tarjetas.indexOf(tarjeta);
            tarjeta.style.transitionDelay = (index * 100) + 'ms';
            observadorCascada.observe(tarjeta);
        });
    }

    /* ============================================================
       LISTENERS GLOBALES — conectados UNA sola vez; cada handler
       consulta el modo vigente y las entradas de navegación
       gestionan el candado suave (encolado) por sí mismas.
       ============================================================ */

    /* Indicadores: salto directo + reinicio del ciclo             */
    puntos.forEach(function (punto, index) {
        punto.addEventListener('click', function () {
            if (!modoCarrusel) return;
            irA(index);
            reiniciarAuto();
        });
    });

    /* SWIPE táctil: un paso por gesto, horizontal dominante.
       Izquierda → avanzar · derecha → retroceder (ambos con loop
       infinito). Si hay vuelta en curso, el gesto se encola y se
       ejecuta al liberarse — sin "muertes" de gesto.              */
    if (ventana) {
        ventana.addEventListener('touchstart', function (e) {
            if (!modoCarrusel) return;
            nodoXSwipe = e.touches[0].clientX;
            nodoYSwipe = e.touches[0].clientY;
            detenerAuto();
        }, { passive: true });

        ventana.addEventListener('touchend', function (e) {
            if (!modoCarrusel) return;
            const dx = e.changedTouches[0].clientX - nodoXSwipe;
            const dy = e.changedTouches[0].clientY - nodoYSwipe;
            if (Math.abs(dx) > UMBRAL_SWIPE && Math.abs(dx) > Math.abs(dy)) {
                if (dx < 0) { avanzar(); } else { retroceder(); }
            }
            reiniciarAuto();
        }, { passive: true });
    }

    /* Pestaña oculta → pausa; visible → reanuda                   */
    document.addEventListener('visibilitychange', function () {
        if (!modoCarrusel) return;
        if (document.hidden) { detenerAuto(); } else { iniciarAuto(); }
    });

    /* bfcache: al restaurar, re-sincronizar posición y estado
       (cancela cualquier vuelta a medio camino y gesto encolado)  */
    window.addEventListener('pageshow', function (event) {
        if (event.persisted && modoCarrusel) {
            enVuelta = false;
            intencionPendiente = null;
            saltarSinTransicion(indiceLogico);
            sincronizarUI(indiceLogico, false);
        }
    });

    /* Cambio dinámico de breakpoint (rotación / resize)           */
    function alCambiarMediaQuery() { montarModo(); }
    if (mqCarrusel.addEventListener) {
        mqCarrusel.addEventListener('change', alCambiarMediaQuery);
    } else if (mqCarrusel.addListener) {
        mqCarrusel.addListener(alCambiarMediaQuery);
    }

    /* Decisión inicial según el viewport actual                   */
    montarModo();
}


/* ================================================================
   3a. PRENSIÓN TÁCTIL ROBUSTA (soporte del organigrama táctil)
   QUÉ HACE: agrega/quita .es-presionado con touchstart/touchend.
   POR QUÉ: iOS Safari NO garantiza el estado :active en divs con
   role="button" → el CSS replica el efecto de presión con esta
   clase y el feedback táctil queda garantizado al 100% en
   cualquier dispositivo (el :active nativo sigue como respaldo
   en Android/desktop táctil). touchcancel cubre el gesto
   interrumpido (llamada entrante, gesture del sistema).
   ================================================================ */
function conectarPresion(el) {
    el.addEventListener('touchstart', function () {
        el.classList.add('es-presionado');
    }, { passive: true });
    var soltar = function () { el.classList.remove('es-presionado'); };
    el.addEventListener('touchend', soltar, { passive: true });
    el.addEventListener('touchcancel', soltar, { passive: true });
}


/* ================================================================
   3. SECCIÓN ORGANIGRAMA (Modal de Equipo)
   QUÉ HACE: cada nodo del árbol es clicable (mouse, touch Y
   teclado) y abre el modal con sus datos (data-name, data-role,
   data-img, data-desc del HTML).
   ⭐ GUARDIA DE IMAGEN: sin foto se REMUEVE el atributo src por
   completo → el CSS ([src=""], :not([src])) oculta la imagen y
   muestra la silueta de respaldo (nunca una imagen rota).
   ACCESIBILIDAD: cada nodo recibe role="button" + tabindex="0" y
   responde a Enter/Espacio además del clic.
   ⭐ PRENSIÓN TÁCTIL: cada nodo conecta conectarPresion → el
   feedback de presión (.es-presionado del CSS táctil) funciona
   garantizado en iOS, donde :active no es fiable en divs.
   ⭐ GESTIÓN DE FOCO (patrón WAI-ARIA): al abrir, el foco pasa al
   botón cerrar (preventScroll: es fixed en móvil); al cerrar,
   vuelve al nodo origen — el teclado nunca queda huérfano.
   bfcache: si la página se restaura con el modal abierto, se
   cierra automáticamente para liberar el scroll del fondo.
   ================================================================ */
function initOrganigrama() {
    const nodosOrganigrama = document.querySelectorAll('.qs-org-nodo');
    const modalEquipo = document.getElementById('qs-modal-equipo');

    // Sin nodos o sin modal → no estamos en la página (salida segura)
    if (nodosOrganigrama.length === 0 || !modalEquipo) return;

    const modalImg = document.getElementById('qs-modal-img');
    const modalNombre = document.getElementById('qs-modal-nombre');
    const modalRol = document.getElementById('qs-modal-rol');
    const modalDesc = document.getElementById('qs-modal-desc');
    const btnCerrar = document.getElementById('qs-modal-cerrar-btn');

    let nodoFocalizado = null; /* nodo que abrió el modal (devolución de foco) */

    /* Apertura del modal a partir de los data-* de un nodo         */
    function abrirModalDeNodo(nodo) {
        const nombre = nodo.getAttribute('data-name');
        const rol = nodo.getAttribute('data-role');
        const img = nodo.getAttribute('data-img');
        const desc = nodo.getAttribute('data-desc');

        if (!nombre) return; // Sin datos → no abrir

        if (modalNombre) modalNombre.innerText = nombre;
        if (modalRol) modalRol.innerText = rol;
        if (modalDesc) modalDesc.innerText = desc;

        /* GUARDIA DE IMAGEN:
           - CON foto → asignar src y alt descriptivo.
           - SIN foto → remover el src (nunca asignar ""): el CSS
             oculta la imagen y muestra la silueta de respaldo.    */
        if (modalImg) {
            if (img) {
                modalImg.src = img;
                modalImg.alt = 'Foto de ' + nombre;
            } else {
                modalImg.removeAttribute('src');
                modalImg.removeAttribute('alt');
            }
        }

        modalEquipo.classList.add('esta-abierto');
        document.body.style.overflow = 'hidden'; // Bloquea scroll del fondo

        /* FOCO → botón cerrar (el siguiente Tab ya no escapa al body).
           preventScroll: el botón es fixed en móvil; sin la opción el
           foco podría arrastrar un salto de scroll del fondo.       */
        if (btnCerrar) {
            nodoFocalizado = nodo;
            btnCerrar.focus({ preventScroll: true });
        }
    }

    /* Cierre del modal + restauración del scroll + devolución
       de foco al nodo origen (teclado nunca queda huérfano)       */
    function cerrarModalEquipo() {
        modalEquipo.classList.remove('esta-abierto');
        document.body.style.overflow = '';
        if (nodoFocalizado) {
            nodoFocalizado.focus({ preventScroll: true });
            nodoFocalizado = null;
        }
    }

    /* Conectar cada nodo: clic + teclado (Enter/Espacio)
       + PRENSIÓN TÁCTIL robusta (.es-presionado)                  */
    nodosOrganigrama.forEach(function (nodo) {
        /* Accesibilidad: el nodo es un div clicable → rol de botón
           y foco por Tab para usuarios de teclado                  */
        nodo.setAttribute('role', 'button');
        nodo.setAttribute('tabindex', '0');

        conectarPresion(nodo); /* ⭐ feedback garantizado en iOS */

        nodo.addEventListener('click', function () { abrirModalDeNodo(nodo); });

        nodo.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); /* Evitar scroll con Espacio */
                abrirModalDeNodo(nodo);
            }
        });
    });

    /* Cierres auxiliares: botón ×, clic en el fondo, Escape        */
    if (btnCerrar) btnCerrar.addEventListener('click', cerrarModalEquipo);
    modalEquipo.addEventListener('click', function (e) {
        if (e.target === modalEquipo) cerrarModalEquipo();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalEquipo.classList.contains('esta-abierto')) cerrarModalEquipo();
    });

    /* PROTECCIÓN bfcache: al volver con atrás/adelante, el navegador
       restaura el DOM tal como estaba — si el modal quedó abierto,
       se cierra para no dejar el scroll del fondo bloqueado.      */
    window.addEventListener('pageshow', function (event) {
        if (event.persisted && modalEquipo.classList.contains('esta-abierto')) {
            cerrarModalEquipo();
        }
    });
}


/* ================================================================
   ORQUESTADOR DE LA PÁGINA QUIENES SOMOS
   ================================================================ */
export function initQuienesSomos() {
    initTimeline();
    initPrincipios();
    initOrganigrama();
}