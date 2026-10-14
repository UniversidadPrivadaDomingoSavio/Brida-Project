// ══════════════════════════════════════════════════════════════════
// COMPONENTE — HEADER + MENÚ MÓVIL (BRIDA S.R.L.)
// Archivo: assets/js/components/header-menu.js
// ══════════════════════════════════════════════════════════════════
// QUÉ HACE ESTE COMPONENTE:
//   1. FUENTE ÚNICA DEL MENÚ: el HTML del header (escritorio + móvil)
//      vive AQUÍ como plantilla. Editar este archivo actualiza las
//      7 páginas del sitio automáticamente.
//   2. RUTAS PORTABLES: la raíz del sitio se calcula desde la
//      ubicación de ESTE archivo (import.meta.url) → funciona igual
//      en dominio raíz, subcarpetas del proyecto (GitHub Pages) y
//      páginas internas (proyectos/, servicios/).
//   3. PÁGINA ACTIVA AUTOMÁTICA: compara la URL actual con los
//      enlaces del menú y marca is-active sin configuración manual
//      (servicios.html queda sin ítem activo por diseño: "Servicios"
//      es un disparador, no un enlace).
//   4. LÓGICA COMPLETA ABSORVIDA: scroll del header, menú móvil,
//      sublista desplegable, dimming del mega menú y sincronización
//      ARIA del disparador.
// USO: main.js llama a initHeaderMenu() (ver PASO 4).
// ══════════════════════════════════════════════════════════════════

/* ────────────────────────────────────────────────────────────────
   RAIZ DEL SITIO (cálculo portátil)
   QUÉ HACE: este archivo vive en assets/js/components/, por lo que
             subir 3 niveles desde su propia URL da la raíz del
             sitio. Todos los enlaces de la plantilla se construyen
             con ${RAIZ} → el menú funciona desde CUALQUIER página,
             incluso en subdirectorios y subcarpetas de hosting.
   ──────────────────────────────────────────────────────────────── */
const RAIZ = new URL('../../../', import.meta.url).href;

/* ────────────────────────────────────────────────────────────────
   PLANTILLA ÚNICA DEL MENÚ
   QUÉ ES:  el header completo (escritorio + menú móvil) como texto.
   REGLAS DE DISEÑO VIGENTES:
   - "Servicios" es un BOTÓN disparador (no navega); los únicos
     enlaces seleccionables son los servicios individuales.
   - Sin CTA "Ver todos los servicios" (eliminado por diseño).
   - El mega menú lleva id="mega-menu-servicios" (aria-controls).
   - Redes sociales del menú móvil con enlaces REALES.
   ──────────────────────────────────────────────────────────────── */
function plantillaHeader() {
    return `
    <!-- ========== HEADER (inyectado por header-menu.js) ========== -->
    <header id="main-header" class="header-modulo-principal">
        <a href="${RAIZ}index.html" class="header-logo-caja">
            <img src="${RAIZ}assets/img/icons/logo-brida.png" alt="BRIDA Logo" class="header-logo-imagen">
        </a>
        <nav class="menu-escritorio-contenedor" aria-label="Navegación principal">
            <ul class="menu-escritorio-lista">
                <li class="menu-escritorio-item"><a href="${RAIZ}index.html" class="menu-escritorio-enlace">Inicio</a></li>
                <li class="menu-escritorio-item"><a href="${RAIZ}quienes-somos.html" class="menu-escritorio-enlace">Quiénes Somos</a></li>

                <!-- SERVICIOS = disparador del mega menú (no es enlace) -->
                <li class="menu-escritorio-item tiene-submenu">
                    <button type="button"
                            class="menu-escritorio-enlace menu-escritorio-disparador"
                            aria-haspopup="true"
                            aria-expanded="false"
                            aria-controls="mega-menu-servicios">
                        Servicios <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
                    </button>

                    <!-- ============================================================
                         MEGA MENÚ: 6 tarjetas horizontales (grid 2×3)
                         Cada tarjeta tiene 2 columnas internas:
                         · Columna 1: icono de la categoría.
                         · Columna 2: nombre + descripción breve.
                         Toda la tarjeta es clicable. El dimming (header.js)
                         sigue funcionando (.submenu-columna).
                         ============================================================ -->
                    <ul class="submenu-desplegable-caja" id="mega-menu-servicios">

                        <li class="submenu-columna">
                            <a href="${RAIZ}servicios/ingenieria-consultoria.html" class="mega-tarjeta">
                                <span class="mega-tarjeta-icono"><i class="fa-solid fa-drafting-compass" aria-hidden="true"></i></span>
                                <span class="mega-tarjeta-contenido">
                                    <span class="mega-tarjeta-nombre">Ingeniería &amp; Consultoría</span>
                                    <span class="mega-tarjeta-descripcion">Diseño, estudios, avalúos y asesoría técnica especializada.</span>
                                </span>
                            </a>
                        </li>

                        <li class="submenu-columna">
                            <a href="${RAIZ}servicios/obras-civiles.html" class="mega-tarjeta">
                                <span class="mega-tarjeta-icono"><i class="fa-solid fa-helmet-safety" aria-hidden="true"></i></span>
                                <span class="mega-tarjeta-contenido">
                                    <span class="mega-tarjeta-nombre">Obras Civiles &amp; Construcción</span>
                                    <span class="mega-tarjeta-descripcion">Construcción, refacciones y puesta en marcha de instalaciones.</span>
                                </span>
                            </a>
                        </li>

                        <li class="submenu-columna">
                            <a href="${RAIZ}servicios/mecanica-metalurgia.html" class="mega-tarjeta">
                                <span class="mega-tarjeta-icono"><i class="fa-solid fa-cogs" aria-hidden="true"></i></span>
                                <span class="mega-tarjeta-contenido">
                                    <span class="mega-tarjeta-nombre">Mecánica &amp; Metalurgia</span>
                                    <span class="mega-tarjeta-descripcion">Estructuras metálicas, galpones, tanques y soldadura calificada.</span>
                                </span>
                            </a>
                        </li>

                        <li class="submenu-columna">
                            <a href="${RAIZ}servicios/electricidad-automatizacion.html" class="mega-tarjeta">
                                <span class="mega-tarjeta-icono"><i class="fa-solid fa-bolt" aria-hidden="true"></i></span>
                                <span class="mega-tarjeta-contenido">
                                    <span class="mega-tarjeta-nombre">Electricidad &amp; Automatización</span>
                                    <span class="mega-tarjeta-descripcion">Obras eléctricas, subestaciones y automatización industrial.</span>
                                </span>
                            </a>
                        </li>

                        <li class="submenu-columna">
                            <a href="${RAIZ}servicios/infraestructura-gas.html" class="mega-tarjeta">
                                <span class="mega-tarjeta-icono"><i class="fa-solid fa-fire-flame-simple" aria-hidden="true"></i></span>
                                <span class="mega-tarjeta-contenido">
                                    <span class="mega-tarjeta-nombre">Infraestructura Gas &amp; Datos</span>
                                    <span class="mega-tarjeta-descripcion">Líneas de gas, redes domiciliarias y fibra óptica.</span>
                                </span>
                            </a>
                        </li>

                        <li class="submenu-columna">
                            <a href="${RAIZ}servicios/seguridad-servicios.html" class="mega-tarjeta">
                                <span class="mega-tarjeta-icono"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></span>
                                <span class="mega-tarjeta-contenido">
                                    <span class="mega-tarjeta-nombre">Seguridad &amp; Servicios</span>
                                    <span class="mega-tarjeta-descripcion">Protección contra incendios y servicios complementarios.</span>
                                </span>
                            </a>
                        </li>

                    </ul>
                </li>

                <li class="menu-escritorio-item"><a href="${RAIZ}proyectos.html" class="menu-escritorio-enlace">Proyectos</a></li>
                <li class="menu-escritorio-item"><a href="${RAIZ}contacto.html" class="menu-escritorio-enlace">Contacto</a></li>
            </ul>
        </nav>
        <button class="boton-toggle-movil" id="menu-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-nav">
            <i class="fa-solid fa-bars icono-hamburguesa"></i>
        </button>
    </header>

    <!-- ========== MENÚ MÓVIL (inyectado por header-menu.js) ========== -->
    <div class="menu-movil-overlay" id="mobile-nav" role="dialog" aria-modal="true" aria-label="Menú de navegación">
        <button class="boton-cerrar-movil" id="close-btn" aria-label="Cerrar menú"><i class="fa-solid fa-times"></i></button>
        <ul class="menu-movil-lista">
            <li class="menu-movil-item"><a href="${RAIZ}index.html" class="menu-movil-enlace">Inicio</a></li>
            <li class="menu-movil-item"><a href="${RAIZ}quienes-somos.html" class="menu-movil-enlace">Quiénes Somos</a></li>
            <li class="menu-movil-item">
                <a href="${RAIZ}servicios.html" class="menu-movil-enlace dropdown-trigger">
                    Servicios <i class="fa-solid fa-chevron-down icono-flecha-dropdown-movil"></i>
                </a>
                <ul class="menu-movil-sublista">
                    <li class="menu-movil-subitem"><a href="${RAIZ}servicios/ingenieria-consultoria.html" class="menu-movil-subenlace">Ingeniería & Consultoría</a></li>
                    <li class="menu-movil-subitem"><a href="${RAIZ}servicios/obras-civiles.html" class="menu-movil-subenlace">Obras Civiles & Construcción</a></li>
                    <li class="menu-movil-subitem"><a href="${RAIZ}servicios/mecanica-metalurgia.html" class="menu-movil-subenlace">Mecánica & Metalurgia</a></li>
                    <li class="menu-movil-subitem"><a href="${RAIZ}servicios/electricidad-automatizacion.html" class="menu-movil-subenlace">Electricidad & Automatización</a></li>
                    <li class="menu-movil-subitem"><a href="${RAIZ}servicios/infraestructura-gas.html" class="menu-movil-subenlace">Infraestructura de Gas y Datos</a></li>
                    <li class="menu-movil-subitem"><a href="${RAIZ}servicios/seguridad-servicios.html" class="menu-movil-subenlace">Seguridad & Servicios Varios</a></li>
                </ul>
            </li>
            <li class="menu-movil-item"><a href="${RAIZ}proyectos.html" class="menu-movil-enlace">Proyectos</a></li>
            <li class="menu-movil-item"><a href="${RAIZ}contacto.html" class="menu-movil-enlace">Contacto</a></li>
        </ul>

        <!-- ============================================================
             REDES SOCIALES (5 canales + correo)
             - Fila de iconos: WhatsApp, Facebook, Instagram,
               LinkedIn y TikTok.
             - Fila inferior: correo como enlace dedicado con texto
               (el email es largo; como texto no satura la fila de
               iconos y es más fácil de tocar).
             ============================================================ -->
        <div class="menu-movil-sociales">
            <div class="menu-movil-sociales-iconos">
                <a href="https://wa.me/59176644531" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                <a href="https://www.facebook.com/brida.bolivia" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/brida.bolivia" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://www.linkedin.com/company/brida-bolivia" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="https://www.tiktok.com/@brida.bolivia" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
            </div>
            <a href="mailto:bridabolivia@gmail.com" class="menu-movil-correo">
                <i class="fa-solid fa-envelope" aria-hidden="true"></i> bridabolivia@gmail.com
            </a>
        </div>
    </div>`;
}

/* ────────────────────────────────────────────────────────────────
   DETECCIÓN AUTOMÁTICA DE LA PÁGINA ACTIVA
   QUÉ HACE: normaliza la ruta actual y la de cada enlace del menú
             (quitando index.html y barras finales) y marca is-active
             SOLO en el enlace que coincide.
   CASOS CUBIERTOS:
   - index.html y la raíz "/" se consideran lo mismo.
   - Páginas en subdirectorios (proyectos/galpon-remax.html).
   - servicios.html → NINGÚN ítem activo (el disparador no es enlace).
   - El botón disparador se excluye por no tener href.
   ──────────────────────────────────────────────────────────────── */
function marcarPaginaActiva() {
    const normalizar = (ruta) => ruta.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    const rutaActual = normalizar(location.pathname);

    document.querySelectorAll(
        '#main-header .menu-escritorio-enlace[href], #mobile-nav .menu-movil-enlace[href]'
    ).forEach((enlace) => {
        const rutaEnlace = normalizar(new URL(enlace.getAttribute('href'), location.href).pathname);
        enlace.classList.toggle('is-active', rutaEnlace === rutaActual);
    });
}


/* ────────────────────────────────────────────────────────────────
   LÓGICA COMPLETA DEL HEADER (absorbe header.js + parche ARIA)
   QUÉ HACE:
   1. SCROLL: fondo blanco + franja tricolor al pasar 50px (rAF).
   2. MENÚ MÓVIL: abrir/cerrar con bloqueo de scroll, foco gestionado
      y reset de sublistas al cerrar.
   3. SUBLISTA "SERVICIOS" (móvil): acordeón exclusivo (una abierta).
   4. CIERRE AUXILIARES: enlaces simples, clic en el fondo, Escape.
   5. DIMMING del mega menú (escritorio): atenúa columnas no enfocadas.
   6. ARIA del disparador "Servicios": aria-expanded sincronizada
      en hover Y teclado (focusin/focusout con guardia de relatedTarget).
   ──────────────────────────────────────────────────────────────── */
function inicializarLogicaHeader() {
    const header = document.getElementById('main-header');
    const menuToggle = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('close-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const allMobileItems = document.querySelectorAll('.menu-movil-item');

    if (!header || !menuToggle || !mobileNav) return;

    /* 1. SCROLL DEL HEADER */
    let ticking = false;
    function updateHeaderScroll() {
        header.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { window.requestAnimationFrame(updateHeaderScroll); ticking = true; }
    });
    updateHeaderScroll();

    /* 2. MENÚ MÓVIL */
    function toggleMenu() {
        const isClosing = mobileNav.classList.contains('is-active');
        mobileNav.classList.toggle('is-active');
        const isOpen = mobileNav.classList.contains('is-active');
        menuToggle.setAttribute('aria-expanded', isOpen);

        header.classList.toggle('menu-open', isOpen);

        if (isOpen) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            setTimeout(() => closeBtn.focus(), 100);
        } else {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            if (isClosing) {
                allMobileItems.forEach(item => {
                    item.classList.remove('is-active');
                    const submenu = item.querySelector('.menu-movil-sublista');
                    if (submenu) submenu.style.maxHeight = null;
                });
            }
            menuToggle.focus();
        }
    }

    menuToggle.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);

    /* 3. SUBLISTA DESPLEGABLE (móvil) — acordeón exclusivo */
    const dropdownItems = Array.from(allMobileItems).filter(item => item.querySelector('.menu-movil-sublista'));
    dropdownItems.forEach(item => {
        const link = item.querySelector('.dropdown-trigger');
        const submenu = item.querySelector('.menu-movil-sublista');

        link.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            if (item.classList.contains('is-active')) {
                item.classList.remove('is-active');
                submenu.style.maxHeight = null;
            } else {
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('is-active')) {
                        otherItem.classList.remove('is-active');
                        otherItem.querySelector('.menu-movil-sublista').style.maxHeight = null;
                    }
                });
                item.classList.add('is-active');
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
            }
        });
    });

    /* 4. CIERRES AUXILIARES */
    document.querySelectorAll('.menu-movil-enlace').forEach(link => {
        const parent = link.parentElement;
        if (!parent.querySelector('.menu-movil-sublista')) {
            link.addEventListener('click', () => { if (mobileNav.classList.contains('is-active')) toggleMenu(); });
        }
    });

    mobileNav.addEventListener('click', (e) => { if (e.target === mobileNav) toggleMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mobileNav.classList.contains('is-active')) toggleMenu(); });

    /* 5. DIMMING DEL MEGA MENÚ (escritorio) */
    const megaMenu = document.querySelector('.submenu-desplegable-caja');
    const columns = document.querySelectorAll('.submenu-columna');

    if (megaMenu && columns.length > 0) {
        columns.forEach(col => {
            col.addEventListener('mouseenter', () => {
                megaMenu.classList.add('has-dimming');
                col.classList.add('is-focused');
            });
            col.addEventListener('mouseleave', () => {
                megaMenu.classList.remove('has-dimming');
                col.classList.remove('is-focused');
            });
        });
    }

    /* 6. SINCRONIZACIÓN ARIA DEL DISPARADOR "SERVICIOS"
       QUÉ HACE: mantiene aria-expanded correcta para lectores de
       pantalla mientras el mega menú se abre por hover o teclado. */
    const disparadorServicios = document.querySelector('.menu-escritorio-disparador');
    const itemServicios = disparadorServicios?.closest('.menu-escritorio-item');

    if (disparadorServicios && itemServicios) {
        const setExpanded = (valor) => disparadorServicios.setAttribute('aria-expanded', valor);

        itemServicios.addEventListener('mouseenter', () => setExpanded('true'));
        itemServicios.addEventListener('mouseleave', () => setExpanded('false'));

        /* Teclado: focusin abre; focusout cierra SOLO si el foco
           salió por completo del ítem (menú + submenú)             */
        itemServicios.addEventListener('focusin', () => setExpanded('true'));
        itemServicios.addEventListener('focusout', (e) => {
            if (!itemServicios.contains(e.relatedTarget)) setExpanded('false');
        });
    }
}


/* ────────────────────────────────────────────────────────────────
   PUNTO DE ENTRADA DEL COMPONENTE
   QUÉ HACE: inyecta la plantilla en el placeholder de la página,
             marca la página activa y arranca toda la lógica.
   ORDEN: main.js debe llamarla (ver PASO 4). Es segura: si la
   página no tiene placeholder, no hace nada.
   ──────────────────────────────────────────────────────────────── */
export function initHeaderMenu() {
    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return; /* Página sin componente → no hacer nada */

    placeholder.outerHTML = plantillaHeader();
    marcarPaginaActiva();
    inicializarLogicaHeader();
}