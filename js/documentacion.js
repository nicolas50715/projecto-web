// ELEMENTOS
const home = document.querySelector(".docs-home");
const panel = document.querySelector(".docs-panel");

const cards = document.querySelectorAll(".docs-card");
const sidebarButtons = document.querySelectorAll(".docs-sidebar button[data-show]");
const closeBtn = document.querySelector(".docs-close");

const sections = document.querySelectorAll(".docs-section");


// MOSTRAR SECCION
function showSection(id){
  sections.forEach(sec => {
    sec.style.display = "none";
  });

  const active = document.getElementById(id);
  if(active){
    active.style.display = "block";
  }
}


// ABRIR DESDE TARJETAS
cards.forEach(card => {
  card.addEventListener("click", () => {
    const target = card.getAttribute("data-target");

    home.style.display = "none";
    panel.style.display = "grid";
    panel.classList.add("active");

    // marcar activo en sidebar
    sidebarButtons.forEach(b => b.classList.remove("active"));
    const activeBtn = document.querySelector(`[data-show="${target}"]`);
    if(activeBtn){
      activeBtn.classList.add("active");
    }

    showSection(target);
  });
});


// CAMBIO DESDE SIDEBAR
sidebarButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    sidebarButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.getAttribute("data-show");
    showSection(target);
  });
});


// CERRAR PANEL
closeBtn.addEventListener("click", () => {
  panel.classList.remove("active");

  setTimeout(() => {
    panel.style.display = "none";
    home.style.display = "grid";
  }, 300);

  sidebarButtons.forEach(b => b.classList.remove("active"));
  sections.forEach(sec => sec.style.display = "none");
});


panel.classList.add("active");

panel.classList.remove("active");
