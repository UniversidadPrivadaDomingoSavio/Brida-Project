// archivo assets/js/main.js

// Importar Componentes Globales
import { initHeaderMenu } from './components/header-menu.js';
import { initFooter } from './components/footer.js';
import { initFooterMenu } from './components/footer-menu.js';
import { initSectionUI } from './components/section-ui.js';

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
    
    const pageId = document.body.id;

    switch (pageId) {
        case 'page-inicio': initInicio(); break;
        case 'page-quienes-somos': initQuienesSomos(); break;
        case 'page-servicios': initServicios(); break;
        case 'page-proyectos': initProyectos(); break; // 
        case 'page-servicio-detalle': initServicioDetalle(); break; // 
        case 'page-proyecto-detalle': initProyectoDetalle(); break; // 
        case 'page-contacto': initContacto(); break;
    }
});