// ══════════════════════════════════════════════════════════════════
// COMPONENTE — FOOTER GLOBAL (BRIDA S.R.L.)
// Archivo: assets/js/components/footer-menu.js
// ══════════════════════════════════════════════════════════════════
// QUÉ HACE ESTE ARCHIVO:
//   1. FUENTE ÚNICA DEL FOOTER: inyecta el markup en
//      <div id="footer-placeholder"></div> — se edita UNA vez y se
//      actualiza en todas las páginas (mismo patrón que header-menu).
//   2. RUTAS PORTABLES: detecta si la página vive en una subcarpeta
//      (/proyectos/ · /servicios/) y prefija las rutas relativas con
//      "../" — el MISMO template sirve en raíz y subpáginas.
//   3. AÑO DE COPYRIGHT DINÁMICO: new Date().getFullYear() — nunca
//      más actualizar el año a mano en cada archivo.
//   4. REVEALS DEL FOOTER: observa los .reveal-up que inyecta con
//      su PROPIO IntersectionObserver (autocontenido — no depende
//      del orden respecto a initFooter(), que observa el resto de
//      la página). FALLBACK: sin IO o reduced-motion → todo visible.
// CÓMO SE USA:
//   · main.js → importar { initFooterMenu } y llamarla DESPUÉS de
//     initFooter() (el observer global ya capturó los .reveal-up
//     existentes en el DOM; este componente observa solo los suyos
//     → cero duplicación de trabajo).
//   · Cada página reemplaza su <footer> completo por:
//       <div id="footer-placeholder"></div>
// ══════════════════════════════════════════════════════════════════


export function initFooterMenu() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return; // Salida segura si la página no lo incluye

    /* ── RUTAS PORTABLES ─────────────────────────────────────────
       En subpáginas (/proyectos/, /servicios/) todas las rutas
       relativas al sitio necesitan el prefijo ../ — con esto el
       mismo template funciona en raíz y subcarpetas.             */
    const esSubpagina = window.location.pathname.includes('/proyectos/')
                     || window.location.pathname.includes('/servicios/');
    const base = esSubpagina ? '../' : '';

    /* Año de copyright siempre vigente                            */
    const anio = new Date().getFullYear();

    /* ── INYECCIÓN DEL MARKUP (fuente única del footer) ────────── */
    placeholder.innerHTML = `
    <footer class="footer-brida" id="main-footer">
        <div class="footer-brida__container">
            <div class="footer-brida__grid">
                <!-- COLUMNA 1: MARCA -->
                <div class="footer-brida__col footer-brida__col--brand reveal-up">
                    <div class="footer-brida__logo-box">
                        <img src="${base}assets/img/icons/logo-brida.png" alt="BRIDA Logo" class="footer-brida__logo-img">
                    </div>
                    <p class="footer-brida__desc">Ingeniería de Proyectos • Oil &amp; Gas Energía • Construcciones Metálicas. Empresa boliviana con proyectos ejecutados a nivel nacional en obra civil, metalmecánica, obras eléctricas y automatización industrial.</p>
                    <p class="footer-brida__desc footer-brida__desc--fiscal">NIT: 38878023 · Registro de Comercio: 00425954</p>
                    <div class="footer-brida__socials">
                        <a href="https://wa.me/59176644531" target="_blank" rel="noopener noreferrer" class="footer-brida__social-link" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                        <a href="https://www.instagram.com/brida.bolivia" target="_blank" rel="noopener noreferrer" class="footer-brida__social-link" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                        <a href="mailto:bridabolivia@gmail.com" class="footer-brida__social-link" aria-label="Correo Electrónico"><i class="fa-solid fa-envelope"></i></a>
                    </div>
                </div>
                <!-- COLUMNA 2: INFORMACIÓN -->
                <div class="footer-brida__col reveal-up">
                    <h3 class="footer-brida__title">Información</h3>
                    <ul class="footer-brida__list">
                        <li class="footer-brida__item"><a href="${base}quienes-somos.html" class="footer-brida__link">Empresa</a></li>
                        <li class="footer-brida__item"><a href="${base}servicios.html" class="footer-brida__link">Servicios</a></li>
                        <li class="footer-brida__item"><a href="${base}proyectos.html" class="footer-brida__link">Proyectos</a></li>
                        <li class="footer-brida__item"><a href="${base}contacto.html" class="footer-brida__link">Contacto</a></li>
                    </ul>
                </div>
                <!-- COLUMNA 3: DIRECCIÓN -->
                <div class="footer-brida__col reveal-up">
                    <h3 class="footer-brida__title">Dirección</h3>
                    <ul class="footer-brida__list footer-brida__list--contact">
                        <li class="footer-brida__contact-item">
                            <i class="fa-solid fa-location-dot footer-brida__icon"></i>
                            <div class="footer-brida__text"><strong>Oficina Principal</strong>Calle Galaxia #499<br>Barrio Urbarí, 3er Anillo<br>Santa Cruz de la Sierra, Bolivia</div>
                        </li>
                        <li class="footer-brida__contact-item">
                            <i class="fa-solid fa-phone footer-brida__icon"></i>
                            <div class="footer-brida__text">
                                <a href="tel:+59176644531" class="footer-brida__text-link">+591 76644531</a>
                            </div>
                        </li>
                        <li class="footer-brida__contact-item">
                            <i class="fa-solid fa-envelope footer-brida__icon"></i>
                            <div class="footer-brida__text"><a href="mailto:bridabolivia@gmail.com" class="footer-brida__text-link">bridabolivia@gmail.com</a></div>
                        </li>
                    </ul>
                </div>
                <!-- COLUMNA 4: COBERTURA -->
                <div class="footer-brida__col reveal-up">
                    <h3 class="footer-brida__title">Cobertura Nacional</h3>
                    <ul class="footer-brida__list footer-brida__list--contact">
                        <li class="footer-brida__contact-item">
                            <i class="fa-solid fa-map-marker-alt footer-brida__icon"></i>
                            <div class="footer-brida__text"><strong>Santa Cruz de la Sierra</strong>Sede Principal</div>
                        </li>
                        <li class="footer-brida__contact-item">
                            <i class="fa-solid fa-map-marker-alt footer-brida__icon"></i>
                            <div class="footer-brida__text">La Paz</div>
                        </li>
                        <li class="footer-brida__contact-item">
                            <i class="fa-solid fa-map-marker-alt footer-brida__icon"></i>
                            <div class="footer-brida__text">Cochabamba</div>
                        </li>
                        <li class="footer-brida__contact-item">
                            <i class="fa-solid fa-map-marker-alt footer-brida__icon"></i>
                            <div class="footer-brida__text">Tarija</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="footer-brida__bottom reveal-up">
                <p class="footer-brida__copy">&copy; ${anio} <a href="${base}index.html">BRIDA S.R.L.</a> Todos los derechos reservados.</p>
                <div class="footer-brida__legal">
                </div>
            </div>
        </div>
    </footer>`;

    /* ── REVEALS PROPIOS DEL FOOTER (autocontenido) ──────────────
       Observer dedicado SOLO a los .reveal-up que este componente
       inyectó — no depende del orden respecto a initFooter().
       FALLBACK: sin IntersectionObserver o con reduced-motion →
       todo visible de inmediato (patrón del sitio).               */
    const elementos = placeholder.querySelectorAll('.reveal-up');
    const prefiereReducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!('IntersectionObserver' in window) || prefiereReducirMovimiento) {
        elementos.forEach(function (el) { el.classList.add('is-active'); });
        return;
    }

    const observadorFooter = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active');
                observadorFooter.unobserve(entry.target); /* Solo una vez */
            }
        });
    }, { threshold: 0.1 }); /* mismo umbral que el observer global */

    elementos.forEach(function (el) { observadorFooter.observe(el); });
}