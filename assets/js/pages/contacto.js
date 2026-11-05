// ══════════════════════════════════════════════════════════════════
// CONTROLADOR — PÁGINA CONTACTO (BRIDA S.R.L.)
// Archivo: assets/js/pages/contacto.js — v2
// ══════════════════════════════════════════════════════════════════
// QUÉ HACE ESTE ARCHIVO:
//   1. SELECTS DEPENDIENTES (catálogo de servicios A–F):
//      al elegir un Tipo de Servicio se llena el select de Servicio
//      Específico con las partidas reales de esa línea.
//      ⭐ v2: catálogo alineado al TEXTO del PDF "Presentación de
//      Servicios" (pp. 5–7) — lo que elige el usuario es lo que
//      llega al correo. Duplicado de Balanzas eliminado (F tenía
//      "Provisión y Calibración…" + "Calibración…" repetidos).
//   2. ENVÍO mailto FORMATEADO: intercepta el submit y construye un
//      enlace mailto con asunto y cuerpo legibles.
//      ⭐ v2 VALIDACIÓN DEL SELECT DEPENDIENTE: un campo `disabled`
//      está EXCLUIDO de la validación nativa (constraint validation
//      lo salta) → sin esta red, el formulario se enviaba con el
//      Servicio Específico vacío cuando el usuario no lo eligió
//      (el required nativo solo actúa cuando el select está
//      habilitado). El JS verifica y devuelve el foco al campo.
//      ⭐ LIMPIEZA POST-ENVÍO: reset + resincronización con
//      'change' SINTÉTICO (reutiliza la lógica del módulo 1).
//      🔄 MIGRACIÓN A FORMSPREE: al cambiar el action del form,
//      ELIMINAR initEnvioMailto() del orquestador y listo.
//   3. COMPUERTAS DE CONTACTO: sin cambios funcionales.
// NOMBRES: sincronizados con contacto.html y contacto.css (prefijo
//      ctt-). main.js NO cambia (mismo export).
// ══════════════════════════════════════════════════════════════════


/* ================================================================
   1. SELECTS DEPENDIENTES (CATÁLOGO DE SERVICIOS) — ⭐ v2 alineado
   QUÉ HACE: #ctt-categoria (A–F) gobierna #ctt-servicio.
   · Sin categoría  → servicio deshabilitado + clase visual.
   · Con categoría  → servicio habilitado + opciones del catálogo.
   ⭐ v2 TRAZABILIDAD (PDF "Presentación de Servicios"):
   · A → pp. 5 y 7 (diseño/estudios/consultoría/avalúos/asesoramiento)
   · B → p. 5 (obras civiles, caminos, topografía, arquitectónicos)
   · C → p. 6 (mecánicos, tanques, puente de medición, puentes grúa)
   · D → pp. 6–7 (eléctricos, redes, subestaciones, automatización)
   · E → p. 6 (gas B/A presión, redes y acometidas, fibra óptica)
   · F → pp. 5–7 (personal, importaciones, balanzas, imprenta,
         red contra incendio)
   ⭐ El texto de cada opción usa el NOMBRE textual del servicio —
   lo que ve el usuario en el select es lo mismo que llegará al
   correo.
   ================================================================ */
function initSelectsDependientes() {
    /* Base de datos del catálogo (partidas textuales del PDF)      */
    const catalogoServicios = {
        A: [
            "Diseño e Ingeniería de Obras Civiles, Mecánicas y Eléctricas",
            "Estudios de Ingeniería, Diseño, Rediseño y Evaluación de Proyectos",
            "Consultoría, Acompañamiento y Asesoría Técnica e Inspección",
            "Avalúos y Peritajes de Proyectos",
            "Asesoramiento Técnico y Profesional Especializado"
        ],
        B: [
            "Construcción de Obras Civiles en General",
            "Caminos y Planchadas con Movimientos de Tierras",
            "Construcción y/o Ejecución de Proyectos Arquitectónicos",
            "Reparación, Refacciones y Puesta en Marcha",
            "Levantamiento Topográfico para la Industria",
            "Obras Civiles Específicas (Losas, Canales, Cámaras, Fosas)"
        ],
        C: [
            "Proyectos Mecánicos, Galpones y Naves Industriales",
            "Estructuras Metálicas y Trabajos de Soldadura en General",
            "Inspección, Supervisión y Fiscalización de Soldadura",
            "Fabricación y Mantenimiento de Tanques de Hidrocarburos",
            "Fabricación y Montaje de Puente de Medición y Regulación de Gas",
            "Provisión y Mantenimiento de Puentes Grúas y Sistemas de Izaje",
            "Montajes Especiales (Cubiertas, Escaleras, Puertas, Mezzanines)"
        ],
        D: [
            "Trabajos Eléctricos de Baja, Media y Alta Tensión",
            "Proyectos Eléctricos para el Rubro Industrial y Comercial",
            "Provisión y Montaje Electromecánico de Subestaciones",
            "Automatización de Procesos Industriales y Electromecánicos",
            "Diseño y Construcción de Redes Eléctricas de Distribución",
            "Mantenimiento Preventivo y Correctivo de Equipos Eléctricos",
            "Supervisión en todo tipo de Instalaciones Eléctricas"
        ],
        E: [
            "Mantenimiento y Tendido de Líneas de Gas (Baja y Alta Presión)",
            "Fabricación y Montaje de Puentes de Medición y Regulación de Gas",
            "Instalación de Red Primaria, Secundaria y Acometidas Domiciliarias",
            "Provisión, Tendido y Etiquetado de Fibra Óptica"
        ],
        F: [
            "Tendido de Red contra Incendio para Edificios y Plantas",
            "Provisión de Personal Calificado, Técnico y Mano de Obra",
            "Importación y Representación de Maquinarias y Equipos",
            "Provisión y Calibración de todo tipo de Balanzas Electrónicas",
            "Imprenta, Gigantografía y Sublimación"
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
   2. ENVÍO mailto FORMATEADO — ⭐ v2 con validación del dependiente
   QUÉ HACE: intercepta el submit del formulario (#ctt-formulario),
   compone un asunto + cuerpo legibles y abre el cliente de correo
   del usuario con TODO el contenido estructurado.
   POR QUÉ: el envío nativo de un <form action="mailto:"> con
   enctype text/plain entrega los campos como cadena codificada
   que muchos clientes muestran mal. Con el cuerpo construido a
   mano, el correo llega limpio al equipo comercial.
   GARANTÍAS:
   · El navegador valida los required ANTES de disparar submit →
     al entrar al handler los campos habilitados son válidos.
   · ⭐ v2 VALIDACIÓN DEL SELECT DEPENDIENTE: un campo `disabled`
     está excluido de la validación nativa (constraint validation
     lo salta) → el required del #ctt-servicio NO actúa mientras
     esté deshabilitado y el form pasaba sin servicio. Esta red
     verifica: si el select está HABILITADO y vacío → foco al
     campo y envío cancelado (con el required nativo cubriendo el
     caso habilitado y esta guardia cubriendo el caso disabled,
     el envío sin servicio queda imposible por las dos vías).
   · encodeURIComponent en asunto y cuerpo (acentos/saltos seguros).
   · Si el usuario no tiene cliente de correo configurado, el
     comportamiento es el mismo que con el mailto nativo (no rompe).
   · Respeta el destino real: bridabolivia@gmail.com.
   ⭐ LIMPIEZA POST-ENVÍO: el mailto NO recarga la página → se
   resetea el form y se resincroniza el select dependiente
   disparando un 'change' SINTÉTICO sobre la categoría → la MISMA
   lógica del módulo 1 deshabilita/limpia (cero duplicación).
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

        const selectCategoria = document.getElementById('ctt-categoria');
        const selectServicio = document.getElementById('ctt-servicio');

        /* ⭐ v2 RED DE SEGURIDAD: el select dependiente deshabilitado
           se salta la validación nativa → si quedó sin elegir (o sin
           habilitar), se cancela el envío y el foco regresa al
           campo. Mensaje honesto: el equipo necesita saber QUÉ
           servicio cotizar.                                        */
        if (!selectServicio.disabled && selectServicio.value === '') {
            selectServicio.focus();
            return;
        }

        const datos = new FormData(formulario);

        const nombre    = (datos.get('Nombre') || '').toString().trim();
        const empresa   = (datos.get('Empresa') || '').toString().trim();
        const email     = (datos.get('Email') || '').toString().trim();
        const telefono  = (datos.get('Telefono') || '').toString().trim();
        const mensaje   = (datos.get('Mensaje') || '').toString().trim();

        /* Textos de los selects (no sus values: "A" no dice nada
           en un correo) — el value de #ctt-servicio ya es el nombre */
        const categoria = textoSeleccionado(selectCategoria);
        const servicio  = textoSeleccionado(selectServicio);

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
        if (selectCategoria) selectCategoria.dispatchEvent(new Event('change'));
    });
}


/* ================================================================
   3. COMPUERTAS DE CONTACTO (paneles verticales expandibles) — sin cambios
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