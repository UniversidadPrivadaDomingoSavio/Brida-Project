// ══════════════════════════════════════════════════════════════════
// COMPONENTE — NAVEGACIÓN CON LÍNEA DE CARGA (BRIDA S.R.L.)
// Archivo: assets/js/components/nav-carga.js
// ══════════════════════════════════════════════════════════════════
// QUÉ HACE:
//   Inyecta y gobierna la LÍNEA de todos los CTAs de navegación
//   (.js-carga) en los 3 viewports: reposo 30px bajo el texto;
//   desktop hover expande al ancho del texto; táctil tap expande
//   como CARGA (~450ms) y navega al terminar.
//
// ⭐ v6.3 POSICIONAMIENTO POR MEDICIÓN DEL TEXTO (definitivo):
//   La línea se posiciona midiendo el PRIMER TEXTO real del botón
//   (Range API — getBoundingClientRect del nodo de texto), NO por
//   padding ni supuestos de alineación:
//   · left  = texto.left − botón.left  → alineada al inicio del
//     texto (funciona con contenido centrado por flex — píldora —
//     o alineado a la izquierda — hero/enlaces).
//   · top   = texto.bottom − botón.top + 3px → el gap de 3px del
//     diseño original (réplica exacta de la geometría del ::after
//     histórico: padding 5px, línea 2px al borde).
//   · --nav-carga-end = texto.width → la animación/hover termina
//     EXACTAMENTE donde termina el texto (referencia visual: el
//     resaltado morado de las descripciones).
//   Cero CSS de posición → cero desfaces entre versiones. FIN del
//   bucle.
//
// ARQUITECTURA (una sola vía — sin rutas duales):
//   TODOS los .js-carga usan el span inyectado (incluido el hero,
//   que ya no usa ::after — ver inicio.css v6.3). Sin atributos
//   data-*, sin keyframes por página, sin reglas anti-doble.
//
// GARANTÍAS:
//   · Desktop: el clic es 100% nativo (hover de línea via CSS).
//   · Táctil: el modo se consulta en CADA clic (patrón del proyecto).
//   · Solo clic primario sin modificadores (nueva pestaña intacta).
//   · Nunca intercepta: externos, mailto, tel, target="_blank".
//   · Doble tap idempotente.
//   · Navegación por animationend + respaldo 750ms + anti-doble.
//   · REDUCED-MOTION: el efecto no se activa → navegación nativa.
//   · BFCACHE: pageshow limpia el estado (el posicionamiento no se
//     re-mide: es layout estático del botón).
//
// CÓMO SE USA:
//   · main.js → importar { initNavCarga }, llamarla junto a los
//     componentes globales.
//   · Cualquier CTA interno de navegación opta con "js-carga".
//   · Color de línea por botón: --nav-carga-line (default
//     currentColor — hereda el texto del botón).
// ══════════════════════════════════════════════════════════════════

export function initNavCarga() {
    const enlaces = document.querySelectorAll('a.js-carga[href]');
    if (enlaces.length === 0) return; // salida segura

    const mqTactil = window.matchMedia('(hover: none) and (pointer: coarse)');
    const reduceMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Gap texto→línea del diseño original (réplica exacta del
       ::after histórico: padding 5px, línea 2px al borde = 3px
       visuales entre el borde inferior del texto y el superior de
       la línea). Constante del sistema, no número mágico suelto. */
    const LINEA_GAP = 3;

    /* Inyección + posicionamiento por medición del TEXTO real.
       Contexto: corre en DOMContentLoaded (desde main.js) → el
       layout y las fuentes web pueden aún estar cargando; por eso
       la medición se REPITE en document.fonts.ready y window.load
       (mismo patrón de re-evaluación diferida de proyectos.js).   */
    function inyectar() {
        enlaces.forEach(function (link) {
            let linea = link.querySelector('.nav-carga__linea');
            if (!linea) {
                linea = document.createElement('span');
                linea.className = 'nav-carga__linea';
                linea.setAttribute('aria-hidden', 'true');
                link.appendChild(linea);
            }

            /* Medir el primer texto real del botón                  */
            const rectLink = link.getBoundingClientRect();
            const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
            let rectTexto = null;
            let nodo;
            while ((nodo = walker.nextNode())) {
                if (!nodo.textContent.trim()) continue;
                const r = document.createRange();
                r.selectNodeContents(nodo);
                const rr = r.getBoundingClientRect();
                if (rr.width > 0) { rectTexto = rr; break; }
            }
            if (!rectTexto) return; // sin texto medible (defensa)

            /* Posición EXACTA como inline styles                    */
            linea.style.left = (rectTexto.left - rectLink.left) + 'px';
            linea.style.top  = (rectTexto.bottom - rectLink.top + LINEA_GAP) + 'px';

            /* Fin de la animación/hover = fin del texto             */
            link.style.setProperty('--nav-carga-end', rectTexto.width + 'px');
        });
    }

    inyectar();
    window.addEventListener('load', inyectar);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(inyectar).catch(function () {});
    }

    /* ¿Es navegación interna interceptable?                        */
    function esNavegacionInterna(link) {
        const href = link.getAttribute('href');
        if (!href || link.target === '_blank') return false;
        if (/^(https?:|mailto:|tel:)/i.test(href)) return false;
        return true;
    }

    enlaces.forEach(function (link) {
        link.addEventListener('click', function (e) {
            /* Semánticas del navegador intactas                    */
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            /* Solo táctil — el modo se consulta en CADA clic       */
            if (!mqTactil.matches) return;

            /* REDUCED-MOTION: navegación nativa inmediata          */
            if (reduceMovimiento) return;

            if (!esNavegacionInterna(link)) return;

            /* Doble tap: ya está en curso → solo anular el default */
            if (link.classList.contains('esta-cargando')) {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            link.classList.add('esta-cargando');

            const destino = link.href;
            let navegado = false;
            const ir = function () {
                if (navegado) return;
                navegado = true;
                window.location.href = destino;
            };

            const linea = link.querySelector('.nav-carga__linea');
            if (linea) linea.addEventListener('animationend', ir, { once: true });
            setTimeout(ir, 750); /* respaldo                       */
        });
    });

    /* BFCACHE: limpiar el estado de carga al restaurar             */
    window.addEventListener('pageshow', function (e) {
        if (!e.persisted) return;
        document.querySelectorAll('.js-carga.esta-cargando').forEach(function (l) {
            l.classList.remove('esta-cargando');
        });
    });
}