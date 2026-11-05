// assets/js/pages/proyectos-data.js — v2
// ============================================================
// DATOS OFICIALES DE PROYECTOS — BRIDA S.R.L.
// FUENTE ÚNICA DE VERDAD (ley del sitio): consumido por el index
// (inicio.js), el hub (proyectos.js) y disponible para fichas.
// ⭐ v2 COMPLETADO con el portafolio documentado:
//   · PDF "Presentación de Servicios" (pp. 14–118) — cada entrada
//     lleva su trazabilidad de página.
//   · Artículo "CONTACTO CONSTRUCCIÓN" (sept. 2026, pp. 68–69)
//     para las cúpulas/domos vidriados de Ventura Mall Sur.
//   · 16 obras NUEVAS documentadas. Las que aún NO tienen registro
//     fotográfico en el repositorio llevan `portada: null` → los
//     renders muestran la tarjeta de DOCUMENTACIÓN (proyectos.js)
//     o quedan fuera del showcase visual (index — ver parche v2).
//   · ELIMINADO el campo inventado "client" ("Privado" nunca
//     constó en documento — honestidad de datos).
// IMPORTANTE: la propiedad `servicio` debe coincidir con los
// data-filter de proyectos.html (las 6 líneas de servicio) para
// que el filtrado funcione. `categoria` es dato de respaldo
// (insignia del modal del index), NO criterio de filtro.
// ============================================================

export const proyectosBRIDA = [

  // ==================== ESTRUCTURAS METÁLICAS ====================
  {
    id: 'galpon-remax',
    titulo: 'Galpón Metálico Remax',
    categoria: 'Estructuras Metálicas',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Santa Cruz de la Sierra, Bolivia',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Proyecto integral de galpón metálico que comprendió la fabricación de estructuras metálicas, armado de moldes, armado y desarrollo en obra, con montaje completo a cargo de nuestro equipo técnico.',
    portada: 'assets/img/proyectos/01-galpones-industriales/galpon-metalico-remax/Proyecto Galpón Metálico Remax_1.jpg',
    galeria: [
      'assets/img/proyectos/01-galpones-industriales/galpon-metalico-remax/Proyecto Galpón Metálico Remax_1.jpg',
      'assets/img/proyectos/01-galpones-industriales/galpon-metalico-remax/Proyecto Galpón Metálico Remax_2.jpg',
      'assets/img/proyectos/01-galpones-industriales/galpon-metalico-remax/Proyecto Galpón Metálico Remax_3.jpg',
      'assets/img/proyectos/01-galpones-industriales/galpon-metalico-remax/Proyecto Galpón Metálico Remax_4.jpg',
      'assets/img/proyectos/01-galpones-industriales/galpon-metalico-remax/Proyecto Galpón Metálico Remax_5.jpg',
      'assets/img/proyectos/01-galpones-industriales/galpon-metalico-remax/Proyecto Galpón Metálico Remax_6.jpg',
      'assets/img/proyectos/01-galpones-industriales/galpon-metalico-remax/Proyecto Galpón Metálico Remax_7.jpg'
    ],
    detalleUrl: 'proyectos/galpon-remax.html'
  },
  {
    id: 'galpon-sifon-santa-cruz',
    titulo: 'Galpón Sifón Santa Cruz',
    categoria: 'Estructuras Metálicas',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Santa Cruz de la Sierra, Bolivia',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Montaje de estructura metálica e izaje de perfiles en obra para galpón industrial, con desarrollo completo del proyecto desde el armado hasta la entrega.',
    portada: 'assets/img/proyectos/01-galpones-industriales/galpon-sifon-santa-cruz/Proyecto Galpón Sifón Santa Cruz_1.jpg',
    galeria: [
      'assets/img/proyectos/01-galpones-industriales/galpon-sifon-santa-cruz/Proyecto Galpón Sifón Santa Cruz_1.jpg',
      'assets/img/proyectos/01-galpones-industriales/galpon-sifon-santa-cruz/Proyecto Galpón Sifón Santa Cruz_2.jpg',
      'assets/img/proyectos/01-galpones-industriales/galpon-sifon-santa-cruz/Proyecto Galpón Sifón Santa Cruz_3.jpg',
      'assets/img/proyectos/01-galpones-industriales/galpon-sifon-santa-cruz/Proyecto Galpón Sifón Santa Cruz_4.jpg',
      'assets/img/proyectos/01-galpones-industriales/galpon-sifon-santa-cruz/Proyecto Galpón Sifón Santa Cruz_5.jpg',
      'assets/img/proyectos/01-galpones-industriales/galpon-sifon-santa-cruz/Proyecto Galpón Sifón Santa Cruz_6.jpg',
      'assets/img/proyectos/01-galpones-industriales/galpon-sifon-santa-cruz/Proyecto Galpón Sifón Santa Cruz_7.jpg'
    ],
    detalleUrl: 'proyectos/galpon-sifon-santa-cruz.html'
  },
  {
    id: 'termoplast',
    titulo: 'Termoplast',
    categoria: 'Estructuras Metálicas',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Santa Cruz de la Sierra, Bolivia',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Diseño del proyecto en diferentes puntos de vista, montaje de estructura metálica y desarrollo de la obra, integrando diseño, fabricación y montaje bajo un mismo estándar de calidad.',
    portada: 'assets/img/proyectos/01-galpones-industriales/termoplast/Proyecto Termoplast_1.jpg',
    galeria: [
      'assets/img/proyectos/01-galpones-industriales/termoplast/Proyecto Termoplast_1.jpg',
      'assets/img/proyectos/01-galpones-industriales/termoplast/Proyecto Termoplast_2.jpg',
      'assets/img/proyectos/01-galpones-industriales/termoplast/Proyecto Termoplast_3.jpg',
      'assets/img/proyectos/01-galpones-industriales/termoplast/Proyecto Termoplast_4.jpg',
      'assets/img/proyectos/01-galpones-industriales/termoplast/Proyecto Termoplast_5.jpg',
      'assets/img/proyectos/01-galpones-industriales/termoplast/Proyecto Termoplast_6.jpg',
      'assets/img/proyectos/01-galpones-industriales/termoplast/Proyecto Termoplast_7.jpg',
      'assets/img/proyectos/01-galpones-industriales/termoplast/Proyecto Termoplast_8.jpg'
    ],
    detalleUrl: 'proyectos/proyecto-termoplast.html'
  },
  // ⭐ v2 — PDF pp. 14–15: "Montaje de Estructura para Letreros
  //    Hotel Radisson Urubo" (TRABAJOS METALMECANICOS).
  {
    id: 'hotel-radisson-urubo',
    titulo: 'Hotel Radisson Urubo',
    categoria: 'Estructuras Metálicas',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: '',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Montaje de estructura metálica para letreros del Hotel Radisson Urubo, ejecutado por nuestro equipo técnico en obra.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },
  // ⭐ v2 — PDF pp. 50–52: "Proyecto Pérgola Barrio Urbarí" —
  //    diseño de pérgola para garage. Ubicación y fechas del PDF.
  {
    id: 'pergola-urbari',
    titulo: 'Pérgola para Garage — Barrio Urbarí',
    categoria: 'Estructuras Metálicas',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Barrio Urbarí — Santa Cruz de la Sierra, Bolivia',
    periodo: '01/09/2024 – 15/09/2024',
    estado: 'Finalizado',
    descripcion: 'Diseño y fabricación de pérgola metálica para garage: diseño 3D, planos técnicos y ejecución dentro del plazo comprometido.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },
  // ⭐ v2 — PDF pp. 62–64: "Proyecto Salón de Belleza Hisami" —
  //    pérgola con vidrio solar para el área de lavado.
  {
    id: 'salon-hisami',
    titulo: 'Salón de Belleza Hisami',
    categoria: 'Estructuras Metálicas',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: '2do Anillo, Barrio Urbarí — Santa Cruz de la Sierra, Bolivia',
    periodo: '01/11/2024 – 10/11/2024',
    estado: 'Finalizado',
    descripcion: 'Pérgola con vidrio solar para el área de lavado de cabello del Salón de Belleza Hisami, con diseño, ejecución y entrega dentro del plazo establecido.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },
  // ⭐ v2 — PDF pp. 92–102: "Diseño y Fabricación de Pérgolas para
  //    Áreas Sociales — Condominio Santa Cruz de la Colina del
  //    Urubo". Inicio 01/09/2024 — PROYECTO EN EJECUCIÓN.
  {
    id: 'pergolas-condominio-urubo',
    titulo: 'Pérgolas — Condominio Santa Cruz de la Colina del Urubo',
    categoria: 'Estructuras Metálicas',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Condominio Santa Cruz de la Colina del Urubo — Santa Cruz de la Sierra, Bolivia',
    periodo: '01/09/2024 – En ejecución',
    estado: 'En desarrollo',
    descripcion: 'Diseño y fabricación de pérgolas para áreas sociales: planos técnicos, diseños 3D para garaje (pérgola flotante con parantes al medio), estructuras ancladas a columnas, cubierta metálica con PVC color madera e instalación de vidrios y barandas en fachada.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },

  // ==================== OBRAS CIVILES ====================
  {
    id: 'casa-porongo-las-maras',
    titulo: 'Casa de Campo Industrial — Las Maras',
    categoria: 'Obras Civiles',
    servicio: 'Obras Civiles & Construcción',
    servicioUrl: 'servicios/obras-civiles.html',
    ubicacion: 'Municipio de Porongo, Santa Cruz de la Sierra',
    periodo: '01/09/2023 – 31/01/2024',
    estado: 'Finalizado',
    descripcion: 'Proyecto de casa de campo industrial en el Municipio de Porongo: construcción, armado de estructura y techado, con entrega dentro del plazo comprometido.',
    portada: 'assets/img/proyectos/Proyecto Casa de Campo Porongo/Proyecto Casa de Campo Porongo_1.jpg',
    galeria: [
      'assets/img/proyectos/Proyecto Casa de Campo Porongo/Proyecto Casa de Campo Porongo_1.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Porongo/Proyecto Casa de Campo Porongo_2.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Porongo/Proyecto Casa de Campo Porongo_3.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Porongo/Proyecto Casa de Campo Porongo_4.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Porongo/Proyecto Casa de Campo Porongo_5.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Porongo/Proyecto Casa de Campo Porongo_6.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Porongo/Proyecto Casa de Campo Porongo_7.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Porongo/Proyecto Casa de Campo Porongo_8.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Porongo/Proyecto Casa de Campo Porongo_9.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Porongo/Proyecto Casa de Campo Porongo_10.jpg'
    ],
    detalleUrl: null
  },
  {
    id: 'casa-porongo-industrial',
    titulo: 'Casa de Campo Industrial — Porongo',
    categoria: 'Obras Civiles',
    servicio: 'Obras Civiles & Construcción',
    servicioUrl: 'servicios/obras-civiles.html',
    ubicacion: 'Municipio de Porongo, Santa Cruz de la Sierra',
    periodo: '01/02/2024 – 01/06/2024',
    estado: 'Finalizado',
    descripcion: 'Casa de campo estilo industrial: diseño con área social, estructura metálica, PVC color madera, vidrios y barandas en fachada. Obra finalizada dentro del plazo establecido.',
    portada: 'assets/img/proyectos/Proyecto Casa de Campo Industrial Porongo/Proyecto Casa de Campo Industrial Porongo_1.jpg',
    galeria: [
      'assets/img/proyectos/Proyecto Casa de Campo Industrial Porongo/Proyecto Casa de Campo Industrial Porongo_1.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Industrial Porongo/Proyecto Casa de Campo Industrial Porongo_2.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Industrial Porongo/Proyecto Casa de Campo Industrial Porongo_3.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Industrial Porongo/Proyecto Casa de Campo Industrial Porongo_4.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Industrial Porongo/Proyecto Casa de Campo Industrial Porongo_5.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Industrial Porongo/Proyecto Casa de Campo Industrial Porongo_6.jpg',
      'assets/img/proyectos/Proyecto Casa de Campo Industrial Porongo/Proyecto Casa de Campo Industrial Porongo_7.jpg'
    ],
    detalleUrl: 'proyectos/casa-porongo.html'
  },
  {
    id: 'balneario-campo-belo',
    titulo: 'Balneario Campo Belo',
    categoria: 'Obras Civiles',
    servicio: 'Obras Civiles & Construcción',
    servicioUrl: 'servicios/obras-civiles.html',
    ubicacion: '8vo Anillo, Virgen de Cotoca — Santa Cruz de la Sierra',
    periodo: '01/02/2024 – 01/10/2024',
    estado: 'Finalizado',
    descripcion: 'Ejecución integral del balneario: piscina, parque acuático y toboganes, pérgola para churrasquera, elaboración de banquetas, montaje de estructura principal y cubierta, instalación de canaleta y PVC para techo, armado del portón, construcción de la fachada de la entrada principal con diseños artísticos y torniquetes de cuerpo completo de alta seguridad.',
    portada: 'assets/img/proyectos/Proyecto Balneario Campo Belo/Proyecto Balneario Campo Belo_1.jpg',
    galeria: [
      'assets/img/proyectos/Proyecto Balneario Campo Belo/Proyecto Balneario Campo Belo_1.jpg',
      'assets/img/proyectos/Proyecto Balneario Campo Belo/Proyecto Balneario Campo Belo_2.jpg',
      'assets/img/proyectos/Proyecto Balneario Campo Belo/Proyecto Balneario Campo Belo_3.jpg',
      'assets/img/proyectos/Proyecto Balneario Campo Belo/Proyecto Balneario Campo Belo_4.jpg',
      'assets/img/proyectos/Proyecto Balneario Campo Belo/Proyecto Balneario Campo Belo_5.jpg',
      'assets/img/proyectos/Proyecto Balneario Campo Belo/Proyecto Balneario Campo Belo_6.jpg',
      'assets/img/proyectos/Proyecto Balneario Campo Belo/Proyecto Balneario Campo Belo_7.jpg',
      'assets/img/proyectos/Proyecto Balneario Campo Belo/Proyecto Balneario Campo Belo_8.jpg',
      'assets/img/proyectos/Proyecto Balneario Campo Belo/Proyecto Balneario Campo Belo_9.jpg',
      'assets/img/proyectos/Proyecto Balneario Campo Belo/Proyecto Balneario Campo Belo_10.jpg'
    ],
    detalleUrl: 'proyectos/balneario-campo-belo.html'
  },
  {
    id: 'circuito-husqvarna',
    titulo: 'Centro de Entrenamiento Husqvarna',
    categoria: 'Obras Civiles',
    servicio: 'Obras Civiles & Construcción',
    servicioUrl: 'servicios/obras-civiles.html',
    ubicacion: 'Santa Cruz de la Sierra, Bolivia',
    periodo: '',
    estado: 'Finalizado',
    descripcion: 'Construcción del circuito de moto y centro de entrenamiento Husqvarna: infraestructura con contenedores adaptados, pérgolas y mobiliario de obra. Proyecto finalizado.',
    portada: 'assets/img/proyectos/Proyecto Circuito de Moto Husqvarna/Proyecto Circuito de Moto Husqvarna_1.jpg',
    galeria: [
      'assets/img/proyectos/Proyecto Circuito de Moto Husqvarna/Proyecto Circuito de Moto Husqvarna_1.jpg',
      'assets/img/proyectos/Proyecto Circuito de Moto Husqvarna/Proyecto Circuito de Moto Husqvarna_2.jpg',
      'assets/img/proyectos/Proyecto Circuito de Moto Husqvarna/Proyecto Circuito de Moto Husqvarna_3.jpg',
      'assets/img/proyectos/Proyecto Circuito de Moto Husqvarna/Proyecto Circuito de Moto Husqvarna_4.jpg'
    ],
    detalleUrl: null
  },

  // ==================== INDUSTRIAL & COMERCIAL ====================
  // ⭐ v2 descripción enriquecida: PDF pp. 110–111 documentan la
  //    estructura para alucobon Y la galería del supermercado.
  {
    id: 'alucobon-tia',
    titulo: 'Supermercado TIA — Estructura y Galería',
    categoria: 'Industrial & Comercial',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Santa Cruz de la Sierra, Bolivia',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Diseño y montaje de estructura para revestimiento de alucobon y galería del Supermercado TIA, Santa Cruz de la Sierra.',
    portada: 'assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260824-WA0105.jpeg',
    galeria: [
      'assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260824-WA0105.jpeg',
      'assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260824-WA0107.jpeg',
      'assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260824-WA0263.jpeg',
      'assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260824-WA0269.jpeg',
      'assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260824-WA0271.jpeg',
      'assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260824-WA0273.jpeg',
      'assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260824-WA0275.jpeg',
      'assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260825-WA0008.jpeg',
      'assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260825-WA0010.jpeg',
      'assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260825-WA0012.jpeg',
      'assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260825-WA0059.jpg',
      'assets/img/proyectos/Proyecto Instalacion de Alucobon en Supermercado Tia/IMG-20260825-WA0060.jpg'
    ],
    detalleUrl: null
  },
  // ⭐ v2 — PDF pp. 108–109 "Montaje — Proyecto Cúpulas
  //    Lucernarios — Ventura Mall Sur" + artículo CONTACTO
  //    CONSTRUCCIÓN (p. 69): domos vidriados, primeros y únicos
  //    en Bolivia, concluidos con éxito. OBRA EMBLEMA.
  {
    id: 'cupulas-ventura-mall-sur',
    titulo: 'Cúpulas Lucernarias — Ventura Mall Sur',
    categoria: 'Industrial & Comercial',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Ventura Mall Sur — Santa Cruz de la Sierra, Bolivia',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Montaje de cúpulas lucernarias — domos vidriados y fachadas — para el centro comercial Ventura Mall Sur, concluidas con éxito. Presentadas por la empresa como las primeras y únicas en Bolivia.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },
  // ⭐ v2 — PDF pp. 106–107: "Diseño, Fabricación y Montaje de
  //    Estructura Metálica para Cubierta de Chillers".
  {
    id: 'cubierta-chillers',
    titulo: 'Cubierta de Chillers',
    categoria: 'Industrial & Comercial',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: '',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Diseño, fabricación y montaje de estructura metálica para cubierta de chillers.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },
  // ⭐ v2 — PDF pp. 112–113: "Instalación de Tapas Perimetrales
  //    para Patio de Comidas — Ventura Mall Sur".
  {
    id: 'tapas-perimetrales-ventura-mall',
    titulo: 'Tapas Perimetrales — Patio de Comidas Ventura Mall Sur',
    categoria: 'Industrial & Comercial',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Ventura Mall Sur — Santa Cruz de la Sierra, Bolivia',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Instalación de tapas perimetrales para el patio de comidas del centro comercial Ventura Mall Sur.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },
  // ⭐ v2 — PDF pp. 114–115: "Instalación y Montaje de Plataforma
  //    Metálica en Patio de Comidas — Ventura Mall Sur" (incluye
  //    armado de estructura de videowall).
  {
    id: 'plataforma-videowall-ventura-mall',
    titulo: 'Plataforma Metálica y Videowall — Ventura Mall Sur',
    categoria: 'Industrial & Comercial',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Ventura Mall Sur — Santa Cruz de la Sierra, Bolivia',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Instalación y montaje de plataforma metálica en el patio de comidas de Ventura Mall Sur, incluyendo el armado de la estructura de videowall.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },
  // ⭐ v2 — PDF p. 116: "Proyecto Ventura Mall Sur — Cubierta
  //    Industrial Sellado Anfiteatro".
  {
    id: 'cubierta-anfiteatro-ventura-mall',
    titulo: 'Cubierta Industrial — Anfiteatro Ventura Mall Sur',
    categoria: 'Industrial & Comercial',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Ventura Mall Sur — Santa Cruz de la Sierra, Bolivia',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Cubierta industrial con sellado para el anfiteatro del centro comercial Ventura Mall Sur.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },
  // ⭐ v2 — PDF p. 117: "Armado de Estructura y Colocado de Placa
  //    Cementicia en Fachada MC-18, MC-02 y MC-06" (Ventura Mall).
  {
    id: 'fachadas-cementicias-ventura-mall',
    titulo: 'Fachadas con Placa Cementicia — Ventura Mall Sur',
    categoria: 'Industrial & Comercial',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Ventura Mall Sur — Santa Cruz de la Sierra, Bolivia',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Armado de estructura y colocado de placa cementicia en fachadas MC-18, MC-02 y MC-06 del centro comercial Ventura Mall Sur.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },
  // ⭐ v2 — PDF p. 118: "Proyecto Ventura Mall Sur — Plataforma
  //    Cinnabon y Ateneo".
  {
    id: 'plataformas-cinnabon-ateneo',
    titulo: 'Plataformas Cinnabon y Ateneo — Ventura Mall Sur',
    categoria: 'Industrial & Comercial',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Ventura Mall Sur — Santa Cruz de la Sierra, Bolivia',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Fabricación e instalación de plataformas metálicas para locales del centro comercial Ventura Mall Sur (Cinnabon y Ateneo).',
    portada: null,
    galeria: [],
    detalleUrl: null
  },
  // ⭐ v2 — PDF p. 105: "Diseño y Fabricación Mezzanine Industrial
  //    — Proyecto Remodelación y Ampliación Kajras Los Negros"
  //    (restaurante Los Negros Kjaras).
  {
    id: 'mezzanine-kajras-los-negros',
    titulo: 'Mezzanine Industrial — Los Negros Kjaras',
    categoria: 'Industrial & Comercial',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: '',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Diseño y fabricación de mezzanine industrial para la remodelación y ampliación del restaurante Los Negros Kjaras: más espacio para la comodidad de los clientes, con un diseño moderno.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },
  // ⭐ v2 — PDF pp. 71–73: "Proyecto Ferretería Galarza" —
  //    diseño de la ferretería y cerramiento perimetral metálico.
  {
    id: 'ferreteria-galarza',
    titulo: 'Cerramiento Metálico — Ferretería Galarza',
    categoria: 'Industrial & Comercial',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Municipio de Porongo — Santa Cruz de la Sierra, Bolivia',
    periodo: '01/09/2024 – 30/09/2024',
    estado: 'Finalizado',
    descripcion: 'Diseño de la ferretería y cerramiento perimetral metálico en el Municipio de Porongo, con entrega dentro del plazo establecido.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },

  // ==================== REMODELACIÓN & DISEÑO ====================
  {
    id: 'ag-logistics',
    titulo: 'Ampliación de Oficinas — AG Logistics',
    categoria: 'Remodelación & Diseño',
    servicio: 'Ingeniería & Consultoría',
    servicioUrl: 'servicios/ingenieria-consultoria.html',
    ubicacion: '4to Anillo, Av. Beni — Santa Cruz de la Sierra',
    periodo: '01/10/2024 – 20/10/2024',
    estado: 'Finalizado',
    descripcion: 'Ampliación de oficinas corporativas: diseño de la ampliación, proceso de montaje de estructura y terminación de pérgola, entregado dentro del plazo comprometido.',
    portada: 'assets/img/proyectos/Proyecto AG Logistics/Proyecto AG Logistics_1.jpg',
    galeria: [
      'assets/img/proyectos/Proyecto AG Logistics/Proyecto AG Logistics_1.jpg',
      'assets/img/proyectos/Proyecto AG Logistics/Proyecto AG Logistics_2.jpg',
      'assets/img/proyectos/Proyecto AG Logistics/Proyecto AG Logistics_3.jpg',
      'assets/img/proyectos/Proyecto AG Logistics/Proyecto AG Logistics_4.jpg',
      'assets/img/proyectos/Proyecto AG Logistics/Proyecto AG Logistics_5.jpg',
      'assets/img/proyectos/Proyecto AG Logistics/Proyecto AG Logistics_6.jpg',
      'assets/img/proyectos/Proyecto AG Logistics/Proyecto AG Logistics_7.jpg'
    ],
    detalleUrl: null
  },
  {
    id: 'moscow-house',
    titulo: 'Moscow House',
    categoria: 'Remodelación & Diseño',
    servicio: 'Ingeniería & Consultoría',
    servicioUrl: 'servicios/ingenieria-consultoria.html',
    ubicacion: 'Santa Cruz de la Sierra, Bolivia',
    periodo: '',
    estado: 'Proyecto ejecutado',
    descripcion: 'Casa de campo estilo industrial: diseño, armado de estructura y ejecución de obra con criterios contemporáneos de diseño industrial.',
    portada: 'assets/img/proyectos/Proyecto Moscow House/Proyecto Moscow House_1.jpg',
    galeria: [
      'assets/img/proyectos/Proyecto Moscow House/Proyecto Moscow House_1.jpg',
      'assets/img/proyectos/Proyecto Moscow House/Proyecto Moscow House_2.jpg',
      'assets/img/proyectos/Proyecto Moscow House/Proyecto Moscow House_3.jpg',
      'assets/img/proyectos/Proyecto Moscow House/Proyecto Moscow House_4.jpg'
    ],
    detalleUrl: null
  },
  {
    id: 'remodelacion-vivienda',
    titulo: 'Remodelación de Vivienda y Áreas Sociales',
    categoria: 'Remodelación & Diseño',
    servicio: 'Electricidad & Automatización',
    servicioUrl: 'servicios/electricidad-automatizacion.html',
    ubicacion: 'Frente al Estadio Departamental Tahuichi Aguilera — Santa Cruz de la Sierra',
    periodo: '01/09/2024 – 20/09/2024',
    estado: 'Finalizado',
    descripcion: 'Remodelación de vivienda y ampliación de áreas sociales: casa inteligente y automatizada, con diseño, desarrollo de obra y finalización dentro del plazo establecido.',
    portada: 'assets/img/proyectos/Proyecto Remodelacion de Vivienda/Proyecto Remodelacion de Vivienda_1.jpg',
    galeria: [
      'assets/img/proyectos/Proyecto Remodelacion de Vivienda/Proyecto Remodelacion de Vivienda_1.jpg',
      'assets/img/proyectos/Proyecto Remodelacion de Vivienda/Proyecto Remodelacion de Vivienda_2.jpg',
      'assets/img/proyectos/Proyecto Remodelacion de Vivienda/Proyecto Remodelacion de Vivienda_3.jpg',
      'assets/img/proyectos/Proyecto Remodelacion de Vivienda/Proyecto Remodelacion de Vivienda_4.jpg',
      'assets/img/proyectos/Proyecto Remodelacion de Vivienda/Proyecto Remodelacion de Vivienda_5.jpg',
      'assets/img/proyectos/Proyecto Remodelacion de Vivienda/Proyecto Remodelacion de Vivienda_6.jpg',
      'assets/img/proyectos/Proyecto Remodelacion de Vivienda/Proyecto Remodelacion de Vivienda_7.jpg'
    ],
    detalleUrl: null
  },
  {
    id: 'salon-guadalupe-alpire',
    titulo: 'Salón de Belleza Guadalupe Alpire',
    categoria: 'Remodelación & Diseño',
    servicio: 'Obras Civiles & Construcción',
    servicioUrl: 'servicios/obras-civiles.html',
    ubicacion: '3er Anillo, Av. Roca y Coronado — Santa Cruz de la Sierra',
    periodo: '20/08/2024 – 30/09/2024',
    estado: 'Finalizado',
    descripcion: 'Construcción y refacción de gradas y barandas para salón de belleza, con diseño de salón y ejecución dentro del plazo comprometido.',
    portada: 'assets/img/proyectos/Proyecto Salon de Belleza Guadalupe Alpire/Proyecto Salon de Belleza Guadalupe Alpire_1.jpg',
    galeria: [
      'assets/img/proyectos/Proyecto Salon de Belleza Guadalupe Alpire/Proyecto Salon de Belleza Guadalupe Alpire_1.jpg',
      'assets/img/proyectos/Proyecto Salon de Belleza Guadalupe Alpire/Proyecto Salon de Belleza Guadalupe Alpire_2.jpg',
      'assets/img/proyectos/Proyecto Salon de Belleza Guadalupe Alpire/Proyecto Salon de Belleza Guadalupe Alpire_3.jpg',
      'assets/img/proyectos/Proyecto Salon de Belleza Guadalupe Alpire/Proyecto Salon de Belleza Guadalupe Alpire_4.jpg',
      'assets/img/proyectos/Proyecto Salon de Belleza Guadalupe Alpire/Proyecto Salon de Belleza Guadalupe Alpire_5.jpg',
      'assets/img/proyectos/Proyecto Salon de Belleza Guadalupe Alpire/Proyecto Salon de Belleza Guadalupe Alpire_6.jpg',
      'assets/img/proyectos/Proyecto Salon de Belleza Guadalupe Alpire/Proyecto Salon de Belleza Guadalupe Alpire_7.jpg'
    ],
    detalleUrl: null
  },
  {
    id: 'vaca-morena',
    titulo: 'Vaca Morena',
    categoria: 'Remodelación & Diseño',
    servicio: 'Ingeniería & Consultoría',
    servicioUrl: 'servicios/ingenieria-consultoria.html',
    ubicacion: 'Santa Cruz de la Sierra, Bolivia',
    periodo: '',
    estado: 'En desarrollo',
    descripcion: 'Diseño gráfico de la fachada del restaurante Vaca Morena y obra en desarrollo, con estructura metálica y acabados de alta presencia visual.',
    portada: 'assets/img/proyectos/Proyecto Vaca Morena/Proyecto Vaca Morena_1.jpg',
    galeria: [
      'assets/img/proyectos/Proyecto Vaca Morena/Proyecto Vaca Morena_1.jpg',
      'assets/img/proyectos/Proyecto Vaca Morena/Proyecto Vaca Morena_2.jpg',
      'assets/img/proyectos/Proyecto Vaca Morena/Proyecto Vaca Morena_3.jpg',
      'assets/img/proyectos/Proyecto Vaca Morena/Proyecto Vaca Morena_4.jpg'
    ],
    detalleUrl: null
  },
  // ⭐ v2 — PDF pp. 87–88: "Proyecto Diseño y Fabricación de
  //    Galería — Avenida Achumani, LA PAZ". ⭐ PRIMERA OBRA DE
  //    LA PAZ EN EL PORTAFOLIO (sustenta la cobertura nacional).
  {
    id: 'galeria-achumani',
    titulo: 'Galería Industrial — Achumani, La Paz',
    categoria: 'Remodelación & Diseño',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Avenida Achumani — La Paz, Bolivia',
    periodo: '15/11/2024 – 30/11/2024',
    estado: 'Finalizado',
    descripcion: 'Diseño y fabricación de galería industrial en la Avenida Achumani, La Paz: estructura metálica ejecutada y entregada en noviembre de 2024.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },
  // ⭐ v2 — PDF pp. 90–91: "Diseño y Remodelación de Área Social
  //    en Terraza — Zona de la Terminal, LA PAZ".
  {
    id: 'terraza-terminal-la-paz',
    titulo: 'Área Social en Terraza — Terminal, La Paz',
    categoria: 'Remodelación & Diseño',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Zona de la Terminal — La Paz, Bolivia',
    periodo: '01/11/2024 – 01/12/2024',
    estado: 'Finalizado',
    descripcion: 'Diseño y remodelación de área social en terraza en la zona de la Terminal, La Paz: estructura metálica con PVC y vidrios.',
    portada: null,
    galeria: [],
    detalleUrl: null
  },
  // ⭐ v2 — PDF pp. 103–104: "Diseño y Fabricación de Galería
  //    Industrial en Terraza — Edificio Ortiz Solano, TARIJA"
  //    (estructura metálica con revestimiento símil madera;
  //    registro del PDF marca el proyecto EN DESARROLLO).
  //    ⭐ PRIMERA OBRA DE TARIJA EN EL PORTAFOLIO.
  {
    id: 'galeria-ortiz-solano',
    titulo: 'Galería Industrial — Edificio Ortiz Solano, Tarija',
    categoria: 'Remodelación & Diseño',
    servicio: 'Mecánica & Metalurgia',
    servicioUrl: 'servicios/mecanica-metalurgia.html',
    ubicacion: 'Edificio Ortiz Solano — Tarija, Bolivia',
    periodo: '',
    estado: 'En desarrollo',
    descripcion: 'Diseño y fabricación de galería industrial en terraza para el Edificio Ortiz Solano, Tarija: estructura metálica con revestimiento símil madera.',
    portada: null,
    galeria: [],
    detalleUrl: null
  }
];

// Categorías técnicas oficiales (dato de respaldo — la insignia del
// modal del index). ⚠️ NO son criterio de filtro: el filtrado del
// hub usa `servicio` (las 6 líneas) contra los data-filter del HTML.
export const categoriasProyecto = [
  'Estructuras Metálicas',
  'Obras Civiles',
  'Remodelación & Diseño',
  'Industrial & Comercial'
];