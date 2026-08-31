// ============================================================
// DOCUMENTACIÓN - UNIDAD K9
// ============================================================


// ============================================================
// INICIALIZACIÓN
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================================
  // ELEMENTOS
  // ==========================================================

  const home = document.querySelector(".docs-home");
  const panel = document.querySelector(".docs-panel");
  const content = document.querySelector(".docs-content");

  const cards = document.querySelectorAll(".docs-card");

  const sections = document.querySelectorAll(".docs-section");

  const sidebarShowButtons = document.querySelectorAll(
    ".docs-sidebar button[data-show]"
  );

  const sidebarScrollButtons = document.querySelectorAll(
    ".docs-sidebar button[data-scroll]"
  );

  const closeBtn = document.querySelector(".docs-close");


  // ==========================================================
  // ESTADO
  // ==========================================================

  let currentDocument = null;
  let isScrollingProgrammatically = false;
  let scrollTimeout = null;


  // ==========================================================
  // MOSTRAR DOCUMENTO
  // ==========================================================

  function showDocument(id) {

    if (!id) {
      return;
    }


    // --------------------------------------------------------
    // BUSCAR DOCUMENTO
    // --------------------------------------------------------

    const targetDocument = document.getElementById(id);

    if (!targetDocument) {

      console.warn(
        `No existe ningún documento con id="${id}".`
      );

      return;

    }


    // --------------------------------------------------------
    // OCULTAR TODOS LOS DOCUMENTOS
    // --------------------------------------------------------

    sections.forEach(section => {

      section.style.display = "none";
      section.classList.remove("active");

    });


    // --------------------------------------------------------
    // MOSTRAR DOCUMENTO
    // --------------------------------------------------------

    targetDocument.style.display = "block";
    targetDocument.classList.add("active");

    currentDocument = targetDocument;


    // --------------------------------------------------------
    // OCULTAR HOME
    // --------------------------------------------------------

    if (home) {

      home.style.display = "none";

    }


    // --------------------------------------------------------
    // MOSTRAR PANEL
    // --------------------------------------------------------

    if (panel) {

      panel.style.display = "grid";

      requestAnimationFrame(() => {

        panel.classList.add("active");

      });

    }


    // --------------------------------------------------------
    // VOLVER ARRIBA
    // --------------------------------------------------------

    if (content) {

      content.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }


    // --------------------------------------------------------
    // ACTUALIZAR SIDEBAR
    // --------------------------------------------------------

    updateSidebar(id);

  }


  // ==========================================================
  // ACTUALIZAR SIDEBAR
  // ==========================================================

  function updateSidebar(documentId) {

    // --------------------------------------------------------
    // LIMPIAR TODOS LOS ACTIVE
    // --------------------------------------------------------

    sidebarShowButtons.forEach(button => {

      button.classList.remove("active");

    });

    sidebarScrollButtons.forEach(button => {

      button.classList.remove("active");

    });


    // --------------------------------------------------------
    // ACTIVAR BOTÓN DEL DOCUMENTO
    // --------------------------------------------------------

    const documentButton = document.querySelector(
      `.docs-sidebar button[data-show="${documentId}"]`
    );

    if (documentButton) {

      documentButton.classList.add("active");

    }


    // --------------------------------------------------------
    // DOCUMENTOS CON NAVEGACIÓN INTERNA
    // --------------------------------------------------------

    if (documentId === "manual") {

      const firstManualButton = document.querySelector(
        '.docs-sidebar button[data-scroll="introduccion"]'
      );

      if (firstManualButton) {

        firstManualButton.classList.add("active");

      }

    }


    isScrollingProgrammatically = false;

  }


  // ==========================================================
  // TARJETAS INICIALES
  // ==========================================================

  cards.forEach(card => {

    card.addEventListener("click", () => {

      const target = card.dataset.target;

      console.log(
        "Tarjeta seleccionada:",
        target
      );

      if (!target) {

        console.warn(
          "Esta tarjeta no posee data-target."
        );

        return;

      }

      showDocument(target);

    });

  });


  // ==========================================================
  // CAMBIO ENTRE DOCUMENTOS
  // ==========================================================

  sidebarShowButtons.forEach(button => {

    button.addEventListener("click", () => {

      const target = button.dataset.show;

      console.log(
        "Cambio de documento:",
        target
      );

      if (!target) {
        return;
      }

      showDocument(target);

    });

  });


  // ==========================================================
  // NAVEGACIÓN INTERNA
  // ==========================================================

  sidebarScrollButtons.forEach(button => {

    button.addEventListener("click", () => {

      const target = button.dataset.scroll;

      if (
        !target ||
        !content ||
        !currentDocument
      ) {

        return;

      }


      // ------------------------------------------------------
      // BUSCAR SOLO DENTRO DEL DOCUMENTO ACTUAL
      // ------------------------------------------------------

      const element = currentDocument.querySelector(
        `#${target}`
      );


      if (!element) {

        console.warn(
          `No existe "${target}" dentro de "${currentDocument.id}".`
        );

        return;

      }


      // ------------------------------------------------------
      // ACTUALIZAR ACTIVE
      // ------------------------------------------------------

      sidebarScrollButtons.forEach(btn => {

        btn.classList.remove("active");

      });

      sidebarShowButtons.forEach(btn => {

        btn.classList.remove("active");

      });

      button.classList.add("active");


      // ------------------------------------------------------
      // SCROLL
      // ------------------------------------------------------

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


      // ------------------------------------------------------
      // REACTIVAR DETECCIÓN
      // ------------------------------------------------------

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {

        isScrollingProgrammatically = false;

      }, 700);

    });

  });


  // ==========================================================
  // DETECTAR SECCIÓN VISIBLE
  // ==========================================================

  function updateActiveSection() {

    if (
      !currentDocument ||
      !content ||
      isScrollingProgrammatically
    ) {

      return;

    }


    // --------------------------------------------------------
    // BUSCAR SECCIONES INTERNAS
    // --------------------------------------------------------

    const internalSections =
      currentDocument.querySelectorAll(
        ".manual-section"
      );


    // Si este documento no tiene navegación interna,
    // no hacemos absolutamente nada.

    if (!internalSections.length) {

      return;

    }


    // --------------------------------------------------------
    // POSICIÓN DEL CONTENEDOR
    // --------------------------------------------------------

    const contentRect =
      content.getBoundingClientRect();


    let closestSection = null;
    let closestDistance = Infinity;


    // --------------------------------------------------------
    // BUSCAR SECCIÓN MÁS CERCANA
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // PRIMERA SECCIÓN
    // --------------------------------------------------------

    if (!closestSection) {

      closestSection =
        internalSections[0];

    }


    if (!closestSection.id) {
      return;
    }


    // --------------------------------------------------------
    // BUSCAR BOTÓN
    // --------------------------------------------------------

    const activeButton =
      document.querySelector(
        `.docs-sidebar button[data-scroll="${closestSection.id}"]`
      );


    if (!activeButton) {
      return;
    }


    // --------------------------------------------------------
    // ACTUALIZAR ACTIVE
    // --------------------------------------------------------

    sidebarScrollButtons.forEach(button => {

      button.classList.remove("active");

    });

    sidebarShowButtons.forEach(button => {

      button.classList.remove("active");

    });

    activeButton.classList.add("active");

  }


  // ==========================================================
  // EVENTO SCROLL
  // ==========================================================

  if (content) {

    content.addEventListener(
      "scroll",
      updateActiveSection,
      {
        passive: true
      }
    );

  }


  // ==========================================================
  // CERRAR PANEL
  // ==========================================================

  if (closeBtn) {

    closeBtn.addEventListener("click", () => {

      // ------------------------------------------------------
      // CERRAR ANIMACIÓN
      // ------------------------------------------------------

      panel.classList.remove("active");


      // ------------------------------------------------------
      // VOLVER AL HOME
      // ------------------------------------------------------

      setTimeout(() => {

        panel.style.display = "none";

        home.style.display = "grid";

      }, 350);


      // ------------------------------------------------------
      // OCULTAR DOCUMENTOS
      // ------------------------------------------------------

      sections.forEach(section => {

        section.style.display = "none";
        section.classList.remove("active");

      });


      // ------------------------------------------------------
      // LIMPIAR ACTIVE
      // ------------------------------------------------------

      sidebarShowButtons.forEach(button => {

        button.classList.remove("active");

      });

      sidebarScrollButtons.forEach(button => {

        button.classList.remove("active");

      });


      // ------------------------------------------------------
      // REINICIAR ESTADO
      // ------------------------------------------------------

      currentDocument = null;

      isScrollingProgrammatically = false;

      clearTimeout(scrollTimeout);

    });

  }

});
