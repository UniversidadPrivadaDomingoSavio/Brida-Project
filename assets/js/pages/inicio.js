// Archivo: assets/js/pages/inicio.js

/* ================================================================
    ORQUESTADOR DE LA PÁGINA INICIO
    ================================================================ */
export function initInicio() {
  initHeroSlider();
  initNosotrosInicio();
  initServiciosInicio();
  initValoresInicio();
  initProyectosInicio();
}

/* ===============================================
    1. SECCION HERO CARRUSEL
    =============================================== */
function initHeroSlider() {
  const container = document.getElementById("ini-hero");
  if (!container) return;

  const slides = container.querySelectorAll(".ini-hero__slide");
  const prevBtn = document.getElementById("ini-hero-prev");
  const nextBtn = document.getElementById("ini-hero-next");
  const dotsContainer = document.getElementById("ini-hero-dots");
  const progressBar = document.getElementById("ini-hero-progress");

  let currentSlide = 0;
  const slideInterval = 6000;
  let slideTimer;

  let touchStartX = 0;
  let touchEndX = 0;

  // Generar puntos de navegación
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("ini-hero__dot");
    if (index === 0) dot.classList.add("es-activo");
    dot.addEventListener("click", () => {
      goToSlide(index);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = container.querySelectorAll(".ini-hero__dot");

  function updateClasses() {
    slides.forEach((slide, index) => {
      slide.classList.remove("es-activo");
      dots[index].classList.remove("es-activo");
    });
    slides[currentSlide].classList.add("es-activo");
    dots[currentSlide].classList.add("es-activo");
    resetProgressBar();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateClasses();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateClasses();
  }

  function goToSlide(index) {
    currentSlide = index;
    updateClasses();
    resetTimer();
  }

  function startTimer() {
    slideTimer = setInterval(nextSlide, slideInterval);
  }
  function stopTimer() {
    clearInterval(slideTimer);
  }
  function resetTimer() {
    stopTimer();
    startTimer();
  }

  function resetProgressBar() {
    progressBar.classList.remove("es-animando");
    void progressBar.offsetWidth; // Fuerza reflow para reiniciar animación
    progressBar.classList.add("es-animando");
  }

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetTimer();
    });
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetTimer();
    });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
      resetTimer();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
      resetTimer();
    }
  }

  container.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );
  container.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true },
  );

  startTimer();
  resetProgressBar();
}

/* ================================================================
    2. SECCIÓN QUIENES SOMOS
    ================================================================ */
function initNosotrosInicio() {
  const section = document.getElementById("ini-nosotros");
  if (!section) return;

  // 1. Efecto Zoom en dispositivos táctiles (Scroll Hover)
  const isTouchDevice = window.matchMedia(
    "(hover: none) and (pointer: coarse)",
  ).matches;
  if (isTouchDevice) {
    const tarjetas = section.querySelectorAll(".ini-nosotros__tarjeta");
    const zoomObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("es-zoom-activo");
          } else {
            entry.target.classList.remove("es-zoom-activo");
          }
        });
      },
      { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0.1 },
    );

    tarjetas.forEach(function (card) {
      zoomObserver.observe(card);
    });
  }

  // 2. Acordeón "Leer más" en Móvil
  const leerMasBtn = document.getElementById("ini-nosotros-leer-mas");
  const detallesMovil = document.getElementById("ini-nosotros-detalles");

  if (leerMasBtn && detallesMovil) {
    leerMasBtn.addEventListener("click", function () {
      const estaExpandido = leerMasBtn.classList.contains("esta-expandido");
      if (estaExpandido) {
        detallesMovil.style.maxHeight = null;
        leerMasBtn.classList.remove("esta-expandido");
        leerMasBtn.innerHTML =
          'Leer más <i class="fa-solid fa-chevron-down"></i>';
      } else {
        detallesMovil.style.maxHeight = detallesMovil.scrollHeight + "px";
        leerMasBtn.classList.add("esta-expandido");
        leerMasBtn.innerHTML =
          'Leer menos <i class="fa-solid fa-chevron-up"></i>';
      }
    });
  }
}

/* ================================================================
    3. SECCIÓN SERVICIOS
    ================================================================ */
function initServiciosInicio() {
  const section = document.getElementById("ini-servicios");
  if (!section) return;

  const tarjetas = section.querySelectorAll(".ini-servicios__tarjeta");

  // Animación escalonada al hacer scroll
  const observadorTarjetas = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const tarjeta = entry.target;
          const indice = Array.prototype.indexOf.call(tarjetas, tarjeta);
          const retraso = 100 + indice * 80; // Efecto cascada
          setTimeout(function () {
            tarjeta.classList.add("es-visible");
            tarjeta.style.transition =
              "opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s ease";
          }, retraso);
          observadorTarjetas.unobserve(tarjeta);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
  );

  tarjetas.forEach(function (tarjeta) {
    observadorTarjetas.observe(tarjeta);
  });

  // Comportamiento en dispositivos táctiles
  const esDispositivoTactil = window.matchMedia(
    "(hover: none) and (pointer: coarse)",
  ).matches;

  if (esDispositivoTactil) {
    const observadorScrollHover = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("es-tactil-activo");
          } else {
            entry.target.classList.remove("es-tactil-activo");
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    tarjetas.forEach(function (tarjeta) {
      observadorScrollHover.observe(tarjeta);
    });
  }

  // Efecto de luz que sigue al ratón (Solo Escritorio)
  if (!esDispositivoTactil) {
    tarjetas.forEach(function (tarjeta) {
      tarjeta.addEventListener("mousemove", function (e) {
        const rect = tarjeta.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        tarjeta.style.setProperty("--mouse-x", x + "%");
        tarjeta.style.setProperty("--mouse-y", y + "%");
      });
    });
  }
}

/* ================================================================
    4. SECCIÓN FRASES Y VALORES
    ================================================================ */
function initValoresInicio() {
  const section = document.getElementById("ini-valores");
  if (!section) return;

  // Lógica del Carrusel
  const slides = section.querySelectorAll(".ini-valores__diapositiva");
  const dotsContainer = document.getElementById("ini-valores-puntos");
  const prevBtn = document.getElementById("ini-valores-btn-prev");
  const nextBtn = document.getElementById("ini-valores-btn-next");
  const sliderContainer = document.getElementById("ini-valores-carrusel");

  let currentQuote = 0;
  const quoteInterval = 6000;
  let quoteTimer;

  let touchStartX = 0;
  let touchEndX = 0;

  // Generar puntos de navegación
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("ini-valores__punto");
    if (index === 0) dot.classList.add("es-activo");
    dot.addEventListener("click", () => {
      goToQuote(index);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".ini-valores__punto");

  function updateQuoteClasses() {
    slides.forEach((slide, index) => {
      slide.classList.remove("es-activo");
      dots[index].classList.remove("es-activo");
    });
    slides[currentQuote].classList.add("es-activo");
    dots[currentQuote].classList.add("es-activo");
  }

  function nextQuote() {
    currentQuote = (currentQuote + 1) % slides.length;
    updateQuoteClasses();
  }
  function prevQuote() {
    currentQuote = (currentQuote - 1 + slides.length) % slides.length;
    updateQuoteClasses();
  }
  function goToQuote(index) {
    currentQuote = index;
    updateQuoteClasses();
    resetQuoteTimer();
  }
  function startQuoteTimer() {
    quoteTimer = setInterval(nextQuote, quoteInterval);
  }
  function resetQuoteTimer() {
    clearInterval(quoteTimer);
    startQuoteTimer();
  }

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      nextQuote();
      resetQuoteTimer();
    });
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      prevQuote();
      resetQuoteTimer();
    });

  // Lógica de Swipe para Móvil
  function handleQuoteSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextQuote();
      resetQuoteTimer();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevQuote();
      resetQuoteTimer();
    }
  }

  if (sliderContainer) {
    sliderContainer.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );
    sliderContainer.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleQuoteSwipe();
      },
      { passive: true },
    );
  }

  startQuoteTimer();
}

/* ================================================================
    5. SECCIÓN PROYECTOS
    ================================================================ */
function initProyectosInicio() {
  const section = document.getElementById("ini-proy");
  if (!section) return;

  // Datos de Proyectos (Mantenidos intactos)
  const projectsData = [
    {
      id: 1,
      title: "Planta de Procesamiento Gasífero",
      cat: "Oil & Gas",
      img: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      desc: "Construcción y montaje de planta de procesamiento de gas, incluyendo sistemas de instrumentación y automatización industrial.",
      client: "YPFB",
      place: "Santa Cruz",
      year: "2023",
      status: "Fase de Operación",
    },
    {
      id: 2,
      title: "Tanques de Almacenamiento HP",
      cat: "Oil & Gas",
      img: "https://picsum.photos/seed/tanques/800/600",
      desc: "Fabricación e instalación de tanques de hidrocarburos de alta presión con normas API.",
      client: "Petrobras",
      place: "Cochabamba",
      year: "2024",
      status: "Fase de Ejecución",
    },
    {
      id: 3,
      title: "Edificio Corporativo Tower",
      cat: "Construcción",
      img: "https://picsum.photos/seed/tower/800/600",
      desc: "Proyecto arquitectónico de 15 pisos con sistemas constructivos modernos y certificación verde.",
      client: "Grupo Empresarial",
      place: "La Paz",
      year: "2022",
      status: "Fase de Operación",
    },
    {
      id: 4,
      title: "Consultoría Estructural Sismorresistente",
      cat: "Ingeniería",
      img: "https://picsum.photos/seed/estructural/800/600",
      desc: "Auditoría y diseño estructural para complejo habitacional en zona sísmica.",
      client: "Gobierno Municipal",
      place: "Sucre",
      year: "2025",
      status: "Fase de Preinversión",
    },
    {
      id: 5,
      title: "Red Primaria de Gas Natural",
      cat: "Infraestructura",
      img: "https://picsum.photos/seed/gas/800/600",
      desc: "Tendido de 45km de líneas de gas de alta presión, incluyendo estaciones de regulación.",
      client: "ETN",
      place: "Tarija",
      year: "2024",
      status: "Fase de Ejecución",
    },
    {
      id: 6,
      title: "Nave Industrial Metalúrgica",
      cat: "Construcción",
      img: "https://picsum.photos/seed/nave/800/600",
      desc: "Diseño y montaje de galpón tipo parabólico de 5,000 m2 para fundición.",
      client: "MetalCR",
      place: "Oruro",
      year: "2023",
      status: "Fase de Operación",
    },
    {
      id: 7,
      title: "Subestación Eléctrica 115kV",
      cat: "Infraestructura",
      img: "https://picsum.photos/seed/electrica/800/600",
      desc: "Montaje electromecánico y puesta en marcha de subestación de alta tensión.",
      client: "ENDE",
      place: "Cochabamba",
      year: "2022",
      status: "Fase de Operación",
    },
    {
      id: 8,
      title: "Automatización Línea de Envasado",
      cat: "Ingeniería",
      img: "https://picsum.photos/seed/automat/800/600",
      desc: "Implementación de sistema SCADA y PLC para línea de producción automatizada.",
      client: "Industria Alimenticia",
      place: "Santa Cruz",
      year: "2024",
      status: "Fase de Ejecución",
    },
    {
      id: 9,
      title: "Ampliación Refinería Palmasola",
      cat: "Oil & Gas",
      img: "https://picsum.photos/seed/refineria/800/600",
      desc: "Ingeniería de detalle y construcción de la planta de fraccionamiento LPG.",
      client: "Refinería Palmasola",
      place: "Santa Cruz",
      year: "2025",
      status: "Fase de Preinversión",
    },
    {
      id: 10,
      title: "Centro Logístico de Alta Celosía",
      cat: "Construcción",
      img: "https://picsum.photos/seed/celosia/800/600",
      desc: "Diseño y montaje de estructura metálica para centro de distribución de 8,000m2.",
      client: "Logistik S.A.",
      place: "La Paz",
      year: "2024",
      status: "Fase de Ejecución",
    },
    {
      id: 11,
      title: "Diseño Estructural Hospital de Niños",
      cat: "Ingeniería",
      img: "https://picsum.photos/seed/hospital/800/600",
      desc: "Proyecto estructural antisísmico para torre hospitalaria de 12 pisos.",
      client: "Caja Nacional de Salud",
      place: "Cochabamba",
      year: "2026",
      status: "Fase de Preinversión",
    },
    {
      id: 12,
      title: "Tendido Red Fibra Óptica BOL-001",
      cat: "Infraestructura",
      img: "https://picsum.photos/seed/fibra/800/600",
      desc: "Despliegue de 120km de fibra óptica subterránea y aérea para telecomunicaciones.",
      client: "Entel",
      place: "Oruro",
      year: "2023",
      status: "Fase de Operación",
    },
    {
      id: 13,
      title: "Plataforma Marítima Costa Afuera",
      cat: "Oil & Gas",
      img: "https://picsum.photos/seed/plataforma/800/600",
      desc: "Construcción y montaje de módulos habitacionales y de proceso en alta mar.",
      client: "YPFB Andina",
      place: "Santa Cruz",
      year: "2024",
      status: "Fase de Ejecución",
    },
    {
      id: 14,
      title: "Remodelación Complejo Industrial Zofra",
      cat: "Construcción",
      img: "https://picsum.photos/seed/zofra/800/600",
      desc: "Reacondicionamiento integral de naves industriales y oficinas corporativas.",
      client: "ZOFRA Santa Cruz",
      place: "Santa Cruz",
      year: "2023",
      status: "Fase de Operación",
    },
    {
      id: 15,
      title: "Auditoría Eléctrica Planta Térmica",
      cat: "Ingeniería",
      img: "https://picsum.photos/seed/termica/800/600",
      desc: "Evaluación y certificación de sistemas eléctricos y de protecciones en planta termoeléctrica.",
      client: "ENDE Corani",
      place: "Cochabamba",
      year: "2022",
      status: "Fase de Operación",
    },
    {
      id: 16,
      title: "Acueducto Regional Valle Alto",
      cat: "Infraestructura",
      img: "https://picsum.photos/seed/acueducto/800/600",
      desc: "Construcción de estaciones de bombeo y línea de conducción de agua potable.",
      client: "SEMAPA",
      place: "Cochabamba",
      year: "2025",
      status: "Fase de Preinversión",
    },
    {
      id: 17,
      title: "Ductos de Transporte Crudo Pesado",
      cat: "Oil & Gas",
      img: "https://picsum.photos/seed/ductos/800/600",
      desc: "Soldadura y tendido de tuberías de acero al carbono para transporte de crudo.",
      client: "Transredes",
      place: "Tarija",
      year: "2024",
      status: "Fase de Ejecución",
    },
    {
      id: 18,
      title: "Construcción Villa Deportiva",
      cat: "Construcción",
      img: "https://picsum.photos/seed/villa/800/600",
      desc: "Obra civil y arquitectónica para complejo deportivo multidisciplinario.",
      client: "Gobierno Autónomo",
      place: "Sucre",
      year: "2026",
      status: "Fase de Preinversión",
    },
  ];

  const statusConfig = {
    "Fase de Preinversión": {
      color: "var(--stripe-yellow)",
      icon: "fa-solid fa-compass-drafting",
    },
    "Fase de Ejecución": {
      color: "var(--primary)",
      icon: "fa-solid fa-helmet-safety",
    },
    "Fase de Operación": {
      color: "var(--stripe-green)",
      icon: "fa-solid fa-check-circle",
    },
  };

  let currentPage = 1;
  const itemsPerPage = 6;
  let currentFilter = "all";
  let filteredData = [...projectsData];

  const grid = document.getElementById("ini-proy-grid");
  const pageNumbers = document.getElementById("ini-proy-numeros");
  const prevBtn = document.getElementById("ini-proy-prev-btn");
  const nextBtn = document.getElementById("ini-proy-next-btn");
  const filtersNav = document.getElementById("ini-proy-filtros");
  const modal = document.getElementById("ini-proy-modal");

  function renderGrid() {
    grid.innerHTML = "";
    filteredData =
      currentFilter === "all"
        ? projectsData
        : projectsData.filter((p) => p.cat === currentFilter);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = 1;

    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = filteredData.slice(start, start + itemsPerPage);

    pageItems.forEach((proj, index) => {
      const card = document.createElement("div");
      card.className = "ini-proy__tarjeta";
      card.style.transitionDelay = index * 80 + "ms";
      card.innerHTML = `
                    <img src="${proj.img}" alt="${proj.title}" loading="lazy">
                    <div class="ini-proy__tarjeta-superposicion">
                        <span class="ini-proy__tarjeta-cat">${proj.cat}</span>
                        <h3 class="ini-proy__tarjeta-titulo">${proj.title}</h3>
                    </div>
                `;
      card.onclick = () => openModal(proj);
      grid.appendChild(card);
      setTimeout(() => card.classList.add("es-visible"), 50);
    });
    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    let html = "";
    for (let i = 1; i <= totalPages; i++)
      html += `<button class="ini-proy__pagina-btn ${i === currentPage ? "es-activo" : ""}">${i}</button>`;
    pageNumbers.innerHTML = html;
    Array.from(pageNumbers.children).forEach(
      (btn) => (btn.onclick = () => goToPage(parseInt(btn.innerText))),
    );
  }

  function goToPage(page) {
    currentPage = page;
    const headerHeight =
      document.querySelector("#main-header")?.offsetHeight || 80;
    const elementPosition =
      section.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight - 10;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    renderGrid();
  }

  let previousFocus = null;
  let previousOverflow = "";

  const modalCard = modal.querySelector(".ini-proy-modal__tarjeta");
  const closeButton = document.getElementById("ini-proy-modal-cerrar");

  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "ini-proy-modal-titulo");
  modal.setAttribute("aria-hidden", "true");

  modalCard.tabIndex = -1;
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Cerrar proyecto");

  function openModal(data) {
    const img = document.getElementById("ini-proy-modal-img");

    // Registrar el evento antes de asignar la imagen.
    img.onload = () => img.classList.add("esta-cargada");
    img.onerror = () => {
      img.classList.remove("esta-cargada");
      img.alt = `Imagen no disponible: ${data.title}`;
    };

    img.classList.remove("esta-cargada");
    img.alt = data.title;
    img.src = data.img;

    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("esta-cargada");
    }

    document.getElementById("ini-proy-modal-titulo").textContent = data.title;

    document.getElementById("ini-proy-modal-insignia").textContent = data.cat;

    document.querySelector("#ini-proy-modal-cliente span").textContent =
      data.client || "—";

    document.querySelector("#ini-proy-modal-ubicacion span").textContent =
      data.place || "—";

    document.querySelector("#ini-proy-modal-anio span").textContent =
      data.year || "—";

    const statusEl = document.getElementById("ini-proy-modal-estado");
    const currentStatus = statusConfig[data.status] || {
      color: "var(--text-muted, #666)",
      icon: "fa-solid fa-question-circle",
    };

    statusEl.querySelector("i").className = currentStatus.icon;
    statusEl.querySelector("span").textContent = data.status || "—";
    statusEl.style.color = currentStatus.color;

    document.getElementById("ini-proy-modal-desc").textContent =
      data.desc || "";

    if (!modal.classList.contains("esta-abierto")) {
      previousFocus = document.activeElement;
      previousOverflow = document.body.style.overflow;
    }

    modal.classList.add("esta-abierto");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalCard.scrollTop = 0;
    closeButton.focus();
  }

  function closeModal() {
    if (!modal.classList.contains("esta-abierto")) return;

    modal.classList.remove("esta-abierto");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousOverflow;

    if (previousFocus?.isConnected) {
      previousFocus.focus({ preventScroll: true });
    }
  }

  // Mantener la navegación con Tab dentro del modal.
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;

    const elements = Array.from(
      modal.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]'),
    ).filter((element) => element.getClientRects().length > 0);

    const first = elements[0];
    const last = elements[elements.length - 1];

    if (!first) {
      event.preventDefault();
      modalCard.focus();
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  });
  nextBtn.addEventListener("click", () => {
    const t = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < t) goToPage(currentPage + 1);
  });

  document
    .getElementById("ini-proy-modal-cerrar")
    .addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("esta-abierto"))
      closeModal();
  });

  renderGrid();
}
