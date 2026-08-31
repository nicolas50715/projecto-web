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

  // ----------------------------------------------------------
  // OCULTAR TODOS LOS DOCUMENTOS
  // ----------------------------------------------------------

  sections.forEach(section => {
    section.style.display = "none";
  });


  // ----------------------------------------------------------
  // BUSCAR DOCUMENTO
  // ----------------------------------------------------------

  const activeSection = document.getElementById(id);

  if (!activeSection) {

    console.warn(`No existe el documento: ${id}`);

    return;

  }


  // ----------------------------------------------------------
  // MOSTRAR DOCUMENTO
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // LIMPIAR TODOS LOS ACTIVE
  // ----------------------------------------------------------

  sidebarShowButtons.forEach(button => {
    button.classList.remove("active");
  });

  sidebarScrollButtons.forEach(button => {
    button.classList.remove("active");
  });


  // ----------------------------------------------------------
  // BOTÓN PRINCIPAL DEL DOCUMENTO
  // ----------------------------------------------------------

  const documentButton = document.querySelector(
    `.docs-sidebar button[data-show="${id}"]`
  );

  if (documentButton) {
    documentButton.classList.add("active");
  }


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

  }


  // ----------------------------------------------------------
  // REINICIAR SCROLL PROGRAMÁTICO
  // ----------------------------------------------------------

  isScrollingProgrammatically = false;

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


    // --------------------------------------------------------
    // ACTIVAR ANIMACIÓN
    // --------------------------------------------------------

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

    if (!target || !content || !currentDocument) {
      return;
    }


    // --------------------------------------------------------
    // BUSCAR ELEMENTO DENTRO DEL DOCUMENTO ACTUAL
    // --------------------------------------------------------

    const element = currentDocument.querySelector(
      `#${target}`
    );


    if (!element) {

      console.warn(
        `No existe ninguna sección con id="${target}" dentro de "${currentDocument.id}"`
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
    // SCROLL PROGRAMÁTICO
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
    // PERMITIR AUTO-ACTIVE NUEVAMENTE
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
    // CAMBIAR DOCUMENTO
    // --------------------------------------------------------

    showDocument(target);

  });

});


// ============================================================
// DETECTAR SECCIÓN VISIBLE
// ============================================================

function updateActiveSection() {

  // ----------------------------------------------------------
  // SOLO SE EJECUTA SI HAY DOCUMENTO
  // ----------------------------------------------------------

  if (!currentDocument || !content || isScrollingProgrammatically) {
    return;
  }


  // ----------------------------------------------------------
  // BUSCAR SUBSECCIONES DEL DOCUMENTO ACTUAL
  // ----------------------------------------------------------

  const documentSections =
    currentDocument.querySelectorAll(".manual-section");


  // Si el documento no tiene navegación interna,
  // no hacemos nada.
  if (!documentSections.length) {
    return;
  }


  // ----------------------------------------------------------
  // POSICIONES
  // ----------------------------------------------------------

  const contentRect = content.getBoundingClientRect();

  let closestSection = null;
  let closestDistance = Infinity;


  documentSections.forEach(section => {

    const rect = section.getBoundingClientRect();

    const distance =
      Math.abs(rect.top - contentRect.top - 80);


    // --------------------------------------------------------
    // LA SECCIÓN YA PASÓ POR LA PARTE SUPERIOR
    // --------------------------------------------------------

    if (rect.top <= contentRect.top + 140) {

      if (distance < closestDistance) {

        closestDistance = distance;

        closestSection = section;

      }

    }

  });


  // ----------------------------------------------------------
  // SI NINGUNA LLEGÓ ARRIBA
  // ----------------------------------------------------------

  if (!closestSection) {

    closestSection = documentSections[0];

  }


  if (!closestSection.id) {
    return;
  }


  // ----------------------------------------------------------
  // BUSCAR BOTÓN CORRESPONDIENTE
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


    // --------------------------------------------------------
    // REINICIAR ESTADO
    // --------------------------------------------------------

    currentDocument = null;

    isScrollingProgrammatically = false;

    clearTimeout(scrollTimeout);

  });

}
```
