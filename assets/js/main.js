// ══════════════════════════════════════════════════════════════════
// ORQUESTADOR GLOBAL — BRIDA S.R.L.
// Archivo: assets/js/main.js
// ══════════════════════════════════════════════════════════════════
// Enrutamiento por body id. Los inits de página tienen salida segura
// (early return si su sección no existe) — son tolerantes a páginas
// sin su markup completo.
// ⭐ v4: la sección de proyectos del INDEX es el bloque proy-*
// REUTILIZADO de proyectos.html (misma rejilla, filtros, paginación
// y controlador). Por eso page-inicio también invoca initProyectos().
// ⭐ v6: initNavCarga — navegación con efecto de carga en táctil
// (opt-in con clase .js-carga; ver components/nav-carga.js).
// ============================================================

// Importar Componentes Globales
import { initHeaderMenu } from './components/header-menu.js';
import { initFooter } from './components/footer.js';
import { initFooterMenu } from './components/footer-menu.js';
import { initSectionUI } from './components/section-ui.js';
import { initNavCarga } from './components/nav-carga.js';

// Importar Páginas Principales
import { initInicio } from './pages/inicio.js';
import { initQuienesSomos } from './pages/quienes-somos.js';
import { initServicios } from './pages/servicios.js';
import { initProyectos } from './pages/proyectos.js';
import { initContacto } from './pages/contacto.js';

// Importar Plantillas de Sub-páginas
import { initServicioDetalle } from './pages/servicios-detalle.js';
import { initProyectoDetalle } from './pages/proyectos-detalle.js';

document.addEventListener('DOMContentLoaded', () => {
    initHeaderMenu();
    initFooter();
    initFooterMenu();
    initSectionUI();
    initNavCarga(); /* ⭐ v6: efecto de carga en CTAs táctiles (.js-carga) */

    const pageId = document.body.id;

    switch (pageId) {
        case 'page-inicio':
            /* ⭐ v4 CONSOLIDACIÓN: el index reutiliza el bloque proy-*
               de proyectos.html → el MISMO controlador lo inicializa.
               Ganancia: una sola fuente de datos/lógica (proyectos.js)
               — lo que se agregue ahí aparece en ambos sitios.
               initProyectos() tiene early return si #proy-seccion no
               existe (robusto si algún día el index la retira).     */
            initInicio();
            initProyectos();
            break;
        case 'page-quienes-somos': initQuienesSomos(); break;
        case 'page-servicios': initServicios(); break;
        case 'page-proyectos': initProyectos(); break;
        case 'page-servicio-detalle': initServicioDetalle(); break;
        case 'page-proyecto-detalle': initProyectoDetalle(); break;
        case 'page-contacto': initContacto(); break;
    }
});