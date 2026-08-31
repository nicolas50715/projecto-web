```javascript
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

  if (!id) {
    return;
  }


  // ----------------------------------------------------------
  // BUSCAR DOCUMENTO
  // ----------------------------------------------------------

  const activeSection = document.getElementById(id);

  if (!activeSection) {

    console.warn(
      `No existe ningún documento con id="${id}"`
    );

    return;

  }


  // ----------------------------------------------------------
  // OCULTAR TODOS LOS DOCUMENTOS
  // ----------------------------------------------------------

  sections.forEach(section => {

    section.style.display = "none";

  });


  // ----------------------------------------------------------
  // MOSTRAR DOCUMENTO SELECCIONADO
  // ----------------------------------------------------------

  activeSection.style.display = "block";

  currentDocument = activeSection;


  // ----------------------------------------------------------
  // MOSTRAR PANEL
  // ----------------------------------------------------------

  if (panel) {

    panel.style.display = "grid";

    requestAnimationFrame(() => {

      panel.classList.add("active");

    });

  }


  // ----------------------------------------------------------
  // OCULTAR HOME
  // ----------------------------------------------------------

  if (home) {

    home.style.display = "none";

  }


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
// ACTUALIZAR SIDEBAR
// ============================================================

function updateSidebarForDocument(id) {


  // ----------------------------------------------------------
  // LIMPIAR ACTIVE
  // ----------------------------------------------------------

  sidebarShowButtons.forEach(button => {

    button.classList.remove("active");

  });

  sidebarScrollButtons.forEach(button => {

    button.classList.remove("active");

  });


  // ----------------------------------------------------------
  // ACTIVAR DOCUMENTO PRINCIPAL
  // ----------------------------------------------------------

  const documentButton = document.querySelector(
    `.docs-sidebar button[data-show="${id}"]`
  );

  if (documentButton) {

    documentButton.classList.add("active");

  }


  // ----------------------------------------------------------
  // SI ES MANUAL
  // ----------------------------------------------------------

  if (id === "manual") {

    const firstSectionButton = document.querySelector(
      '.docs-sidebar button[data-scroll="introduccion"]'
    );

    if (firstSectionButton) {

      firstSectionButton.classList.add("active");

    }

  }


  // ----------------------------------------------------------
  // SI ES PROCEDIMIENTOS
  // ----------------------------------------------------------

  if (id === "procedimientos") {

    const firstProcedureButton = document.querySelector(
      '.docs-sidebar button[data-scroll="patrullaje"]'
    );

    if (firstProcedureButton) {

      firstProcedureButton.classList.add("active");

    }

  }


  isScrollingProgrammatically = false;

}


// ============================================================
// TARJETAS INICIALES
// ============================================================

cards.forEach(card => {

  card.addEventListener("click", () => {

    const target = card.dataset.target;

    if (!target) {

      console.warn("La tarjeta no tiene data-target.");

      return;

    }


    console.log(
      `Abriendo documento: ${target}`
    );


    showDocument(target);

  });

});


// ============================================================
// CAMBIO ENTRE DOCUMENTOS
// ============================================================

sidebarShowButtons.forEach(button => {

  button.addEventListener("click", () => {

    const target = button.dataset.show;

    if (!target) {

      console.warn("El botón no tiene data-show.");

      return;

    }


    // --------------------------------------------------------
    // CAMBIAR DOCUMENTO
    // --------------------------------------------------------

    showDocument(target);

  });

});


// ============================================================
// NAVEGACIÓN INTERNA
// ============================================================

sidebarScrollButtons.forEach(button => {

  button.addEventListener("click", () => {

    const target = button.dataset.scroll;

    if (!target || !content || !currentDocument) {

      return;

    }


    // --------------------------------------------------------
    // BUSCAR SECCIÓN DENTRO DEL DOCUMENTO ACTUAL
    // --------------------------------------------------------

    const element = currentDocument.querySelector(
      `#${target}`
    );


    if (!element) {

      console.warn(
        `No existe "${target}" dentro del documento "${currentDocument.id}".`
      );

      return;

    }


    // --------------------------------------------------------
    // ACTUALIZAR ACTIVE
    // --------------------------------------------------------

    sidebarScrollButtons.forEach(btn => {

      btn.classList.remove("active");

    });

    sidebarShowButtons.forEach(btn => {

      btn.classList.remove("active");

    });

    button.classList.add("active");


    // --------------------------------------------------------
    // SCROLL
    // --------------------------------------------------------

    isScrollingProgrammatically = true;


    const contentRect =
      content.getBoundingClientRect();

    const elementRect =
      element.getBoundingClientRect();


    const scrollPosition =
      content.scrollTop +
      (elementRect.top - contentRect.top) -
      20;


    content.scrollTo({

      top: scrollPosition,

      behavior: "smooth"

    });


    // --------------------------------------------------------
    // REACTIVAR AUTO-ACTIVE
    // --------------------------------------------------------

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {

      isScrollingProgrammatically = false;

    }, 700);

  });

});


// ============================================================
// DETECTAR SECCIÓN VISIBLE
// ============================================================

function updateActiveSection() {

  if (
    !currentDocument ||
    !content ||
    isScrollingProgrammatically
  ) {

    return;

  }


  // ----------------------------------------------------------
  // BUSCAR SECCIONES INTERNAS
  // ----------------------------------------------------------

  const internalSections =
    currentDocument.querySelectorAll(".manual-section");


  if (!internalSections.length) {

    return;

  }


  // ----------------------------------------------------------
  // CALCULAR SECCIÓN MÁS CERCANA
  // ----------------------------------------------------------

  const contentRect =
    content.getBoundingClientRect();

  let closestSection = null;

  let closestDistance = Infinity;


  internalSections.forEach(section => {

    const rect =
      section.getBoundingClientRect();


    const distance =
      Math.abs(
        rect.top -
        contentRect.top -
        80
      );


    if (
      rect.top <=
      contentRect.top + 140
    ) {

      if (
        distance <
        closestDistance
      ) {

        closestDistance =
          distance;

        closestSection =
          section;

      }

    }

  });


  // ----------------------------------------------------------
  // PRIMERA SECCIÓN
  // ----------------------------------------------------------

  if (!closestSection) {

    closestSection =
      internalSections[0];

  }


  if (!closestSection.id) {

    return;

  }


  // ----------------------------------------------------------
  // BUSCAR BOTÓN
  // ----------------------------------------------------------

  const activeButton =
    document.querySelector(
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
// SCROLL
// ============================================================

if (content) {

  content.addEventListener(
    "scroll",
    updateActiveSection,
    {
      passive: true
    }
  );

}


// ============================================================
// CERRAR DOCUMENTACIÓN
// ============================================================

if (closeBtn) {

  closeBtn.addEventListener("click", () => {


    // --------------------------------------------------------
    // CERRAR ANIMACIÓN
    // --------------------------------------------------------

    panel.classList.remove("active");


    // --------------------------------------------------------
    // VOLVER AL HOME
    // --------------------------------------------------------

    setTimeout(() => {

      panel.style.display = "none";

      home.style.display = "grid";

    }, 350);


    // --------------------------------------------------------
    // LIMPIAR
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

    isScrollingProgrammatically = false;

    clearTimeout(scrollTimeout);

  });

}
```
