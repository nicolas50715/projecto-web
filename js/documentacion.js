// ============================================================
// DOCUMENTACIÓN - UNIDAD K9
// ============================================================


// ============================================================
// ELEMENTOS
// ============================================================

const home = document.querySelector(".docs-home");
const panel = document.querySelector(".docs-panel");

const cards = document.querySelectorAll(".docs-card");

const sidebarShowButtons = document.querySelectorAll(
  ".docs-sidebar button[data-show]"
);

const sidebarScrollButtons = document.querySelectorAll(
  ".docs-sidebar button[data-scroll]"
);

const closeBtn = document.querySelector(".docs-close");

const sections = document.querySelectorAll(".docs-section");

const content = document.querySelector(".docs-content");


// ============================================================
// ESTADO
// ============================================================

let currentDocument = null;
let isScrollingProgrammatically = false;
let scrollTimeout = null;


// ============================================================
// MOSTRAR DOCUMENTO
// ============================================================

function showDocument(id) {

  sections.forEach(section => {
    section.style.display = "none";
  });

  const activeSection = document.getElementById(id);

  if (!activeSection) {
    console.warn(`No existe el documento: ${id}`);
    return;
  }

  activeSection.style.display = "block";

  currentDocument = activeSection;


  // ----------------------------------------------------------
  // VOLVER ARRIBA
  // ----------------------------------------------------------

  if (content) {

    content.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  // ----------------------------------------------------------
  // ACTUALIZAR SIDEBAR
  // ----------------------------------------------------------

  updateSidebarForDocument(id);

}


// ============================================================
// ACTUALIZAR SIDEBAR SEGÚN DOCUMENTO
// ============================================================

function updateSidebarForDocument(id) {

  sidebarShowButtons.forEach(button => {
    button.classList.remove("active");
  });

  sidebarScrollButtons.forEach(button => {
    button.classList.remove("active");
  });


  // ----------------------------------------------------------
  // MANUAL
  // ----------------------------------------------------------

  if (id === "manual") {

    const firstSectionButton = document.querySelector(
      '.docs-sidebar button[data-scroll="introduccion"]'
    );

    if (firstSectionButton) {
      firstSectionButton.classList.add("active");
    }

    return;
  }


  // ----------------------------------------------------------
  // OTROS DOCUMENTOS
  // ----------------------------------------------------------

  const documentButton = document.querySelector(
    `.docs-sidebar button[data-show="${id}"]`
  );

  if (documentButton) {
    documentButton.classList.add("active");
  }

}


// ============================================================
// ABRIR PANEL DESDE LAS TARJETAS
// ============================================================

cards.forEach(card => {

  card.addEventListener("click", () => {

    const target = card.getAttribute("data-target");

    if (!target) {
      return;
    }


    // --------------------------------------------------------
    // OCULTAR HOME
    // --------------------------------------------------------

    home.style.display = "none";


    // --------------------------------------------------------
    // MOSTRAR PANEL
    // --------------------------------------------------------

    panel.style.display = "grid";


    // Esperamos un frame para que CSS pueda animar
    requestAnimationFrame(() => {

      panel.classList.add("active");

    });


    // --------------------------------------------------------
    // MOSTRAR DOCUMENTO
    // --------------------------------------------------------

    showDocument(target);

  });

});


// ============================================================
// NAVEGACIÓN INTERNA
// ============================================================

sidebarScrollButtons.forEach(button => {

  button.addEventListener("click", () => {

    const target = button.getAttribute("data-scroll");

    if (!target || !content) {
      return;
    }


    const element = document.getElementById(target);

    if (!element) {

      console.warn(
        `No existe ninguna sección con id="${target}"`
      );

      return;
    }


    // --------------------------------------------------------
    // ACTUALIZAR BOTONES
    // --------------------------------------------------------

    sidebarScrollButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    sidebarShowButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");


    // --------------------------------------------------------
    // SCROLL PRECISO DENTRO DEL CONTENEDOR
    // --------------------------------------------------------

    isScrollingProgrammatically = true;


    const contentRect = content.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();


    const scrollPosition =
      content.scrollTop +
      (elementRect.top - contentRect.top) -
      20;


    content.scrollTo({

      top: scrollPosition,

      behavior: "smooth"

    });


    // --------------------------------------------------------
    // PERMITIR NUEVAMENTE EL AUTO-ACTIVE
    // --------------------------------------------------------

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {

      isScrollingProgrammatically = false;

    }, 700);

  });

});


// ============================================================
// CAMBIO ENTRE DOCUMENTOS
// ============================================================

sidebarShowButtons.forEach(button => {

  button.addEventListener("click", () => {

    const target = button.getAttribute("data-show");

    if (!target) {
      return;
    }


    // --------------------------------------------------------
    // MOSTRAR DOCUMENTO
    // --------------------------------------------------------

    showDocument(target);


    // --------------------------------------------------------
    // SI ES MANUAL
    // --------------------------------------------------------

    if (target === "manual") {

      sidebarShowButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      sidebarScrollButtons.forEach(btn => {
        btn.classList.remove("active");
      });


      const firstButton = document.querySelector(
        '.docs-sidebar button[data-scroll="introduccion"]'
      );

      if (firstButton) {
        firstButton.classList.add("active");
      }

    }

  });

});


// ============================================================
// DETECTAR SECCIÓN VISIBLE
// ============================================================

function updateActiveSection() {

  if (!currentDocument || isScrollingProgrammatically) {
    return;
  }


  const manualSections =
    currentDocument.querySelectorAll(".manual-section");


  if (!manualSections.length) {
    return;
  }


  const contentRect = content.getBoundingClientRect();

  let closestSection = null;

  let closestDistance = Infinity;


  manualSections.forEach(section => {

    const rect = section.getBoundingClientRect();

    const distance =
      Math.abs(rect.top - contentRect.top - 80);


    // La sección ya pasó por la parte superior
    if (rect.top <= contentRect.top + 140) {

      if (distance < closestDistance) {

        closestDistance = distance;

        closestSection = section;

      }

    }

  });


  // Si ninguna sección llegó todavía arriba,
  // seleccionamos la primera
  if (!closestSection) {

    closestSection = manualSections[0];

  }


  if (!closestSection.id) {
    return;
  }


  // ----------------------------------------------------------
  // BUSCAR BOTÓN
  // ----------------------------------------------------------

  const activeButton = document.querySelector(
    `.docs-sidebar button[data-scroll="${closestSection.id}"]`
  );


  if (!activeButton) {
    return;
  }


  // ----------------------------------------------------------
  // ACTUALIZAR ACTIVE
  // ----------------------------------------------------------

  sidebarScrollButtons.forEach(button => {

    button.classList.remove("active");

  });


  sidebarShowButtons.forEach(button => {

    button.classList.remove("active");

  });


  activeButton.classList.add("active");

}


// ============================================================
// SCROLL DEL DOCUMENTO
// ============================================================

if (content) {

  content.addEventListener(
    "scroll",
    updateActiveSection,
    { passive: true }
  );

}


// ============================================================
// CERRAR PANEL
// ============================================================

if (closeBtn) {

  closeBtn.addEventListener("click", () => {


    // --------------------------------------------------------
    // DESACTIVAR ANIMACIÓN
    // --------------------------------------------------------

    panel.classList.remove("active");


    // --------------------------------------------------------
    // ESPERAR ANIMACIÓN
    // --------------------------------------------------------

    setTimeout(() => {

      panel.style.display = "none";

      home.style.display = "grid";

    }, 350);


    // --------------------------------------------------------
    // LIMPIAR ESTADO
    // --------------------------------------------------------

    sidebarShowButtons.forEach(button => {

      button.classList.remove("active");

    });


    sidebarScrollButtons.forEach(button => {

      button.classList.remove("active");

    });


    sections.forEach(section => {

      section.style.display = "none";

    });


    currentDocument = null;

  });

}
