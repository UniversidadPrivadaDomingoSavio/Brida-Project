// ══════════════════════════════════════════════════════════════════
// CONTROLADOR — SECCIÓN PROYECTOS (BRIDA S.R.L.) — v2
// Archivo: assets/js/pages/proyectos.js
// ══════════════════════════════════════════════════════════════════
// ⭐ v2 CAMBIOS (aplicando la ley "fuente única de datos"):
//   · ELIMINADO el array inline projectsData (duplicaba
//     proyectos-data.js y contenía campos inventados — "client:
//     Privado" nunca constó en documento). Ahora se consume
//     proyectosBRIDA directamente (import).
//   · Mapeo a los campos oficiales: titulo/portada/servicio/
//     ubicacion/periodo/estado + enlace detalleUrl || servicioUrl.
//   · NUEVO: tarjetas de DOCUMENTACIÓN (proy-tarjeta--documento)
//     para obras del inventario oficial aún sin registro
//     fotográfico (portada: null): lenguaje blueprint + nota
//     "Referencias disponibles a solicitud" (misma voz del aviso
//     vacío). Sin capa de hover — info SIEMPRE visible.
//   · El resto (Módulos A y B, aviso vacío, paginación, bfcache)
//     NO cambia funcionalmente.
// ============================================================

import { proyectosBRIDA } from './proyectos-data.js';

/* ============================================================
   MÓDULO A — FLECHAS INDICADORAS EN EXTREMOS (móvil) — sin cambios
   ============================================================ */
function initFiltrosDeslizables() {
    const filtros = document.getElementById('proy-filtros');
    const zona    = document.getElementById('proy-filtros-zona');
    if (!filtros || !zona) return;

    const TOL = 4;
    const tieneDesborde = () => filtros.scrollWidth > filtros.clientWidth + TOL;

    const recalcularEstado = () => {
        if (!tieneDesborde()) {
            zona.classList.remove('tiene-deslizable', 'tiene-derecha', 'tiene-izquierda');
            return;
        }
        const maxScroll = filtros.scrollWidth - filtros.clientWidth;
        const alInicio  = filtros.scrollLeft <= TOL;
        const alFinal   = filtros.scrollLeft >= maxScroll - TOL;

        zona.classList.add('tiene-deslizable');
        zona.classList.toggle('tiene-derecha', alInicio);
        zona.classList.toggle('tiene-izquierda', alFinal);
    };

    filtros.addEventListener('scroll', () => {
        if (filtros._centrando) return;
        recalcularEstado();
    }, { passive: true });

    window.addEventListener('resize', recalcularEstado);

    window.addEventListener('load', recalcularEstado);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(recalcularEstado).catch(() => {});
    }
    setTimeout(recalcularEstado, 350);

    recalcularEstado();
}


/* ============================================================
   MÓDULO B — AUTO-CENTRADO DEL FILTRO ACTIVO (universal) — sin cambios
   ============================================================ */
function centrarFiltroActivo(filtros, chip) {
    if (filtros.scrollWidth <= filtros.clientWidth + 4) return;

    const rectFila = filtros.getBoundingClientRect();
    const rectChip = chip.getBoundingClientRect();

    const centroFila = rectFila.left + (rectFila.width / 2);
    const centroChip = rectChip.left + (rectChip.width / 2);
    const maxScroll  = filtros.scrollWidth - filtros.clientWidth;
    const objetivo   = Math.max(0, Math.min(maxScroll, filtros.scrollLeft + (centroChip - centroFila)));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        filtros.scrollLeft = objetivo;
        return;
    }

    const inicio    = filtros.scrollLeft;
    const distancia = objetivo - inicio;
    if (Math.abs(distancia) < 2) return;

    const duracion    = 450;
    const momentoCero = performance.now();

    if (filtros._animCentrado) cancelAnimationFrame(filtros._animCentrado);

    filtros._centrando = true;

    if (filtros._cederHandler) {
        filtros.removeEventListener('touchstart', filtros._cederHandler);
    }
    const cederAlUsuario = () => {
        if (filtros._animCentrado) {
            cancelAnimationFrame(filtros._animCentrado);
            filtros._animCentrado = null;
            filtros._centrando = false;
            filtros.dispatchEvent(new Event('scroll'));
        }
        filtros._cederHandler = null;
    };
    filtros._cederHandler = cederAlUsuario;
    filtros.addEventListener('touchstart', cederAlUsuario, { once: true, passive: true });

    const paso = (ahora) => {
        const t = Math.min((ahora - momentoCero) / duracion, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        filtros.scrollLeft = inicio + (distancia * ease);
        if (t < 1) {
            filtros._animCentrado = requestAnimationFrame(paso);
        } else {
            filtros._animCentrado = null;
            filtros._centrando = false;
            filtros.dispatchEvent(new Event('scroll'));
        }
    };
    filtros._animCentrado = requestAnimationFrame(paso);
}


/* ============================================================
   MÓDULO PRINCIPAL — REJILLA DINÁMICA DE PROYECTOS (⭐ v2)
   ============================================================ */

export function initProyectos() {
    const section = document.getElementById('proy-seccion');
    if (!section) return;

    /* ============================================================
       ⭐ v2 FUENTE ÚNICA DE DATOS
       proyectosBRIDA (proyectos-data.js) es el inventario OFICIAL:
       29 obras trazadas al PDF de servicios y al artículo de
       revista. NINGÚN dato se duplica ni se inventa aquí.
       · `servicio`  → criterio de filtro (data-filter del HTML).
       · `portada`   → null en obras aún sin fotos → tarjeta de
                       DOCUMENTACIÓN (ver renderRejilla).
       · enlace      → ficha real (detalleUrl) o línea de servicio
                       (servicioUrl).
       ============================================================ */
    const projectsData = proyectosBRIDA;

    let currentPage = 1;
    const itemsPerPage = 6;
    let currentFilter = 'all';
    let filteredData = [...projectsData];

    const rejilla       = document.getElementById('proy-rejilla');
    const numeros       = document.getElementById('proy-paginacion-numeros');
    const botonAnterior = document.getElementById('proy-paginacion-anterior');
    const botonSiguiente = document.getElementById('proy-paginacion-siguiente');
    const filtros       = document.getElementById('proy-filtros');
    const paginacion    = document.getElementById('proy-paginacion');

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
       AVISO DE SERVICIO SIN OBRAS — sin cambios
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
       RENDER DE LA REJILLA — ⭐ v2 con TARJETA DE DOCUMENTACIÓN
       QUÉ HACE: limpia la rejilla, filtra por línea de servicio y
                 pinta las tarjetas de la página actual en cascada.
       DOS VARIANTES DE TARJETA:
       · CON portada  → tarjeta fotográfica clásica (capa de info).
       · SIN portada  → proy-tarjeta--documento: lenguaje blueprint
         (rejilla 32px + sello de archivo) con la información
         SIEMPRE visible (regla de táctil) y nota honesta — nunca
         una imagen rota ni un repetido genérico.
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

        paginacion.style.display = totalPaginas > 1 ? 'flex' : 'none';

        const inicio = (currentPage - 1) * itemsPerPage;
        const itemsPagina = filteredData.slice(inicio, inicio + itemsPerPage);

        itemsPagina.forEach((proy, index) => {
            /* <a> directo → ficha real o línea de servicio */
            const tarjeta = document.createElement('a');
            tarjeta.className = 'proy-tarjeta' + (proy.portada ? '' : ' proy-tarjeta--documento');
            tarjeta.href = proy.detalleUrl || proy.servicioUrl;
            tarjeta.setAttribute('aria-label', `Ver proyecto: ${proy.titulo}`);
            tarjeta.style.transitionDelay = (index * 80) + 'ms';

            /* Detalles solo si constan en el documento oficial */
            const detallesHTML = (proy.ubicacion || proy.periodo)
                ? `
                <div class="proy-tarjeta-detalles">
                    ${proy.ubicacion ? `<span><i class="fa-solid fa-location-dot"></i> ${proy.ubicacion}</span>` : ''}
                    ${proy.periodo ? `<span><i class="fa-solid fa-calendar-days"></i> ${proy.periodo}</span>` : ''}
                </div>`
                : '';

            /* ⭐ v2: dos render según disponibilidad de portada    */
            if (proy.portada) {
                tarjeta.innerHTML = `
                    <img src="${proy.portada}" alt="${proy.titulo}" loading="lazy"
                         onerror="this.onerror=null; this.src='assets/img/proyectos/Inicio/Proyecto_Portada.jpeg';">
                    <span class="proy-tarjeta-estado ${estadoClase(proy.estado)}">
                        <i class="fa-solid fa-circle"></i>${proy.estado}
                    </span>
                    <div class="proy-tarjeta-capa">
                        <span class="proy-tarjeta-servicio">${proy.servicio}</span>
                        <h3 class="proy-tarjeta-titulo">${proy.titulo}</h3>
                        ${detallesHTML}
                    </div>
                `;
            } else {
                tarjeta.innerHTML = `
                    <div class="proy-tarjeta-documento">
                        <span class="proy-tarjeta-documento-icono">
                            <i class="fa-solid fa-folder-open" aria-hidden="true"></i>
                        </span>
                        <span class="proy-tarjeta-servicio">${proy.servicio}</span>
                        <h3 class="proy-tarjeta-titulo">${proy.titulo}</h3>
                        ${detallesHTML}
                        <span class="proy-tarjeta-documento-nota">
                            <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
                            Referencias disponibles a solicitud
                        </span>
                    </div>
                    <span class="proy-tarjeta-estado ${estadoClase(proy.estado)}">
                        <i class="fa-solid fa-circle"></i>${proy.estado}
                    </span>
                `;
            }
            rejilla.appendChild(tarjeta);
            setTimeout(() => tarjeta.classList.add('es-visible'), 50);
        });
        renderPaginacion(totalPaginas);
    }

    /* ============================================================
       RENDER DE LA PAGINACIÓN — sin cambios
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
       CAMBIO DE PÁGINA — sin cambios
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
       LISTENER DE FILTROS — sin cambios
       ============================================================ */
    filtros.querySelectorAll('.proy-filtros-boton').forEach(btn => {
        btn.addEventListener('click', (e) => {
            filtros.querySelectorAll('.proy-filtros-boton').forEach(b => b.classList.remove('es-activo'));
            e.currentTarget.classList.add('es-activo');
            currentFilter = e.currentTarget.getAttribute('data-filter');
            currentPage = 1;
            centrarFiltroActivo(filtros, btn);
            renderRejilla();
        });
    });

    botonAnterior.addEventListener('click', () => { if (currentPage > 1) irAPagina(currentPage - 1); });
    botonSiguiente.addEventListener('click', () => {
        const total = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < total) irAPagina(currentPage + 1);
    });

    /* ============================================================
       PROTECCIÓN BACK-FORWARD CACHE (bfcache) — sin cambios
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
       ORDEN DE INICIALIZACIÓN — sin cambios
       ============================================================ */
    renderRejilla();
    initFiltrosDeslizables();
}