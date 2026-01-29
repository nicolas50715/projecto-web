// ===============================
// SCROLL REVEAL ACADEMIA
// ===============================

const revealElements = document.querySelectorAll(
  ".academy-block, .academy-requirements, .academy-cta"
);

const revealOnScroll = () => {
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if(rect.top < windowHeight - 120){
      el.classList.add("visible");
    }
  });
};

// Ejecutar al cargar
revealOnScroll();

// Ejecutar al hacer scroll
window.addEventListener("scroll", revealOnScroll);