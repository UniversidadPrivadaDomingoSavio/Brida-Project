// ══════════════════════════════════════════════════════════════════
// CONTROLADOR — PÁGINA CONTACTO (BRIDA S.R.L.)
// Archivo: assets/js/pages/contacto.js
// ══════════════════════════════════════════════════════════════════
// QUÉ HACE ESTE ARCHIVO:
//   1. SELECTS DEPENDIENTES (catálogo de servicios A–F):
//      al elegir un Tipo de Servicio se llena el select de Servicio
//      Específico con las partidas reales de esa línea.
//   2. ENVÍO mailto FORMATEADO: intercepta el submit y construye un
//      enlace mailto con asunto y cuerpo legibles (Nombre, Empresa,
//      servicio seleccionado, mensaje) — el correo llega estructurado
//      en lugar de los campos codificados del envío nativo.
//      ⭐ LIMPIEZA POST-ENVÍO: como el mailto no recarga la página,
//      el formulario se resetea y el select dependiente se
//      resincroniza disparando un evento 'change' SINTÉTICO sobre
//      la categoría → reutiliza la MISMA lógica de llenado/limpieza
//      sin duplicar una línea.
//      🔄 MIGRACIÓN A FORMSPREE: al cambiar el action del form,
//      ELIMINAR initEnvioMailto() del orquestador y listo — el resto
//      del archivo no depende del método de envío.
//   3. COMPUERTAS DE CONTACTO (paneles verticales expandibles):
//      gestiona qué panel está expandido (.es-activa). Desktop:
//      mouseenter recorre + click en cerrado activa. Táctil: el tap
//      es la única vía. NUNCA navega al expandir — el CTA real es
//      el <a> interno del panel abierto.
// NOMBRES: sincronizados con contacto.html y contacto.css (prefijo
//      ctt-). main.js NO cambia (mismo export).
// ══════════════════════════════════════════════════════════════════


/* ================================================================
   1. SELECTS DEPENDIENTES (CATÁLOGO DE SERVICIOS)
   QUÉ HACE: #ctt-categoria (A–F) gobierna #ctt-servicio.
   · Sin categoría  → servicio deshabilitado + clase visual.
   · Con categoría  → servicio habilitado + opciones del catálogo.
   ⭐ El texto de cada opción usa el NOMBRE del servicio (no el
   value "A") — lo que ve el usuario en el select es lo mismo que
   llegará al correo.
   ================================================================ */
function initSelectsDependientes() {
    /* Base de datos del catálogo (partidas reales por línea)       */
    const catalogoServicios = {
        A: [
            "Diseño e Ingeniería de Obras Civiles, Mecánicas y Eléctricas",
            "Estudios de Ingeniería, Diseño, Rediseño y Evaluación de Proyectos",
            "Consultoría, Asesoría Técnica e Inspección",
            "Avalúos y Peritajes de Proyectos",
            "Asesoramiento Técnico y Profesional Especializado"
        ],
        B: [
            "Construcción de Obras Civiles en General",
            "Caminos y Planchadas con Movimientos de Tierras",
            "Proyectos Arquitectónicos y Reparaciones",
            "Levantamiento Topográfico",
            "Obras Civiles Específicas (Losas, Canales, Cámaras, Fosas, Muros)"
        ],
        C: [
            "Proyectos Mecánicos, Galpones y Naves Industriales",
            "Estructuras Metálicas y Soldadura en General",
            "Inspección, Supervisión y Fiscalización de Soldadura",
            "Fabricación y Mantenimiento de Tanques de Hidrocarburos",
            "Fabricación y Montaje de Puente de Medición y Regulación de Gas",
            "Provisión y Mantenimiento de Puentes Grúas y Sistemas de Izaje",
            "Montaje de Estructuras (Parabólicas, Cubiertas, Escaleras, Casamatas)"
        ],
        D: [
            "Obras Eléctricas, Instrumentación y Automatización Industrial",
            "Proyectos Eléctricos (Industrial y Comercial)",
            "Trabajos de Baja, Media y Alta Tensión",
            "Supervisión de Instalaciones Eléctricas",
            "Mantenimiento Preventivo y Correctivo de Equipos Eléctricos",
            "Diseño y Construcción de Redes Eléctricas de Distribución",
            "Montaje Electromecánico de Subestaciones",
            "Automatización de Procesos (Electromecánicos, Hidráulicos, Sanitarios)"
        ],
        E: [
            "Mantenimiento y Tendido de Línea de Gas (Baja y Alta Presión)",
            "Instalación de Red Primaria, Secundaria y Acometidas de Gas",
            "Provisión, Tendido y Etiquetado de Fibra Óptica"
        ],
        F: [
            "Provisión de Personal Calificado, Técnico y Mano de Obra",
            "Importaciones y Representación de Maquinarias y Equipos",
            "Provisión y Calibración de Balanzas Electrónicas",
            "Imprenta, Gigantografía y Sublimación",
            "Tendido de Red contra Incendio",
            "Calibración de Balanzas Electrónicas"
        ]
    };

    const selectCategoria = document.getElementById('ctt-categoria');
    const selectServicio = document.getElementById('ctt-servicio');

    /* Si los selects no existen, no estamos en la página (salida
       segura — permite llamar a esta función sin guardias externas) */
    if (!selectCategoria || !selectServicio) return;

    selectCategoria.addEventListener('change', function () {
        const categoriaKey = this.value; /* A, B, C, D, E, F */

        /* Limpieza total del select dependiente                    */
        selectServicio.innerHTML = '';

        if (categoriaKey === '') {
            /* Sin categoría → deshabilitado con mensaje guía       */
            selectServicio.innerHTML = '<option value="">Primero seleccione un tipo</option>';
            selectServicio.disabled = true;
            selectServicio.classList.add('ctt-form__input--disabled');
        } else {
            /* Con categoría → habilitar y llenar dinámicamente     */
            selectServicio.disabled = false;
            selectServicio.classList.remove('ctt-form__input--disabled');

            /* Opción por defecto                                   */
            const opcionDefault = document.createElement('option');
            opcionDefault.value = '';
            opcionDefault.textContent = 'Seleccione el servicio específico...';
            selectServicio.appendChild(opcionDefault);

            const servicios = catalogoServicios[categoriaKey];
            servicios.forEach(function (servicio) {
                const opcion = document.createElement('option');
                opcion.value = servicio; /* el value ES el nombre legible */
                opcion.textContent = servicio;
                selectServicio.appendChild(opcion);
            });
        }
    });
}


/* ================================================================
   2. ENVÍO mailto FORMATEADO
   QUÉ HACE: intercepta el submit del formulario (#ctt-formulario),
   compone un asunto + cuerpo legibles y abre el cliente de correo
   del usuario con TODO el contenido estructurado.
   POR QUÉ: el envío nativo de un <form action="mailto:"> con
   enctype text/plain entrega los campos como cadena codificada
   ("Nombre=Juan&Pregunta=...") que muchos clientes muestran mal.
   Con el cuerpo construido a mano, el correo llega limpio y el
   equipo comercial puede responder sin descifrar nada.
   GARANTÍAS:
   · El navegador valida los required ANTES de disparar submit →
     al entrar al handler todos los campos son válidos.
   · encodeURIComponent en asunto y cuerpo (acentos/saltos seguros).
   · Si el usuario no tiene cliente de correo configurado, el
     comportamiento es el mismo que con el mailto nativo (no rompe).
   · Respeta el destino real: bridabolivia@gmail.com.
   ⭐ LIMPIEZA POST-ENVÍO: el mailto NO recarga la página → sin
   reset el formulario quedaría lleno de datos ya enviados (y el
   usuario podría reenviar por accidente o pensar que no salió).
   Se resetea el form y se resincroniza el select dependiente
   disparando un 'change' SINTÉTICO sobre la categoría → la MISMA
   lógica del módulo 1 se encarga de deshabilitar/limpiar el
   select de servicio (cero duplicación).
   ================================================================ */
function initEnvioMailto() {
    const formulario = document.getElementById('ctt-formulario');
    if (!formulario) return;

    /* Texto legible de la opción seleccionada de un select         */
    function textoSeleccionado(select) {
        if (!select || select.selectedIndex < 0) return '';
        return select.options[select.selectedIndex].text;
    }

    formulario.addEventListener('submit', function (e) {
        e.preventDefault(); /* Reemplaza el mailto nativo crudo      */

        const datos = new FormData(formulario);

        const nombre    = (datos.get('Nombre') || '').toString().trim();
        const empresa   = (datos.get('Empresa') || '').toString().trim();
        const email     = (datos.get('Email') || '').toString().trim();
        const telefono  = (datos.get('Telefono') || '').toString().trim();
        const mensaje   = (datos.get('Mensaje') || '').toString().trim();

        /* Textos de los selects (no sus values: "A" no dice nada
           en un correo) — el value de #ctt-servicio ya es el nombre */
        const categoria = textoSeleccionado(document.getElementById('ctt-categoria'));
        const servicio  = textoSeleccionado(document.getElementById('ctt-servicio'));

        /* ASUNTO: identificable en la bandeja del equipo comercial */
        const asunto = 'Solicitud de Cotización — ' + (nombre || 'Sitio Web BRIDA');

        /* CUERPO: ficha estructurada lista para responder         */
        const cuerpo = [
            'NUEVA SOLICITUD DESDE LA WEB — BRIDA S.R.L.',
            '──────────────────────────────────────────',
            'Nombre: ' + nombre,
            'Empresa: ' + (empresa || '—'),
            'Correo: ' + email,
            'Teléfono: ' + telefono,
            'Tipo de servicio: ' + (categoria || '—'),
            'Servicio específico: ' + (servicio || '—'),
            '',
            'Mensaje:',
            mensaje
        ].join('\n');

        /* Disparo del cliente de correo                           */
        window.location.href =
            'mailto:bridabolivia@gmail.com' +
            '?subject=' + encodeURIComponent(asunto) +
            '&body=' + encodeURIComponent(cuerpo);

        /* ⭐ LIMPIEZA POST-ENVÍO (ver documentación de cabecera)   */
        formulario.reset();
        const selectCategoria = document.getElementById('ctt-categoria');
        if (selectCategoria) selectCategoria.dispatchEvent(new Event('change'));
    });
}


/* ================================================================
   3. COMPUERTAS DE CONTACTO (paneles verticales expandibles)
   QUÉ HACE: gestiona qué panel está expandido (.es-activa) en la
   escena #ctt-compuertas (ver CSS sección 01 y markup del HTML).
   · ESCRITORIO: mouseenter cambia la compuerta abierta (efecto
     continuo — la escena siempre tiene exactamente una abierta);
     click en un panel cerrado también la activa.
   · TÁCTIL: el tap es la única vía de expansión (no hay hover).
   · ⭐ NUNCA NAVEGA AL EXPANDIR: el handler ignora taps en el
     panel ACTIVO → su click atraviesa al CTA (<a> interno). Un
     tap en un panel CERRADO solo activa la clase (sin navegación).
   · WhatsApp abre activa por defecto (canal de conversión
     principal — lo marca el .es-activa del markup).
   ACCESIBILIDAD: el contenido de los paneles cerrados vive con
   visibility:hidden (CSS) → sus <a> internos no son tabbeables
   hasta que el panel se abre — el orden de foco es correcto por
   diseño, sin gestión extra.
   ================================================================ */
function initCompuertas() {
    const escena = document.getElementById('ctt-compuertas');
    if (!escena) return; // Sin escena → no estamos en la página (salida segura)

    const paneles = Array.from(escena.querySelectorAll('.ctt-compuerta'));
    if (paneles.length === 0) return;

    const esTactil = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    /* Activación exclusiva: cierra todas, abre la objetivo         */
    function activar(panelObjetivo) {
        paneles.forEach(function (p) { p.classList.remove('es-activa'); });
        panelObjetivo.classList.add('es-activa');
    }

    paneles.forEach(function (panel) {
        /* Escritorio: el hover recorre las compuertas (efecto
           continuo — la escena siempre tiene una abierta)          */
        if (!esTactil) {
            panel.addEventListener('mouseenter', function () { activar(panel); });
        }

        /* Todos: tap/click en un panel CERRADO lo expande.
           Si ya está activo, el click atraviesa (al CTA <a>).      */
        panel.addEventListener('click', function () {
            if (!panel.classList.contains('es-activa')) activar(panel);
        });
    });
}


/* ================================================================
   ORQUESTADOR DE LA PÁGINA CONTACTO
   Cada módulo es independiente y con salida segura (early return)
   si su sección no existe.
   NOTA bfcache: los selects dependientes y las compuertas se
   restauran con el DOM al volver con atrás/adelante (estado en
   clases/atributos, no en variables JS) → no requiere protección
   pageshow a diferencia del modal o del carrusel de otras páginas.
   ================================================================ */
export function initContacto() {
    const seccion = document.getElementById('ctt-contacto') || document.getElementById('ctt-form');
    if (!seccion) return;

    initSelectsDependientes();
    initEnvioMailto();
    initCompuertas(); /* ⭐ Compuertas de contacto (paneles expandibles) */
}