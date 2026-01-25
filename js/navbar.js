const navbar = document.querySelector(".navbar");
const letters = document.querySelectorAll(".brand-text span");
const words = document.querySelectorAll(".word");
const navCenter = document.querySelector(".nav-center");

let wordTimers = [];

/* TITULO */
function animateTitle(){
 letters.forEach((l,i)=>{
    l.style.animation = "none";
    l.offsetHeight;
    l.style.animation = "letter .4s forwards";
    l.style.animationDelay = `${i * 0.08}s`;
  });
}

/* LIMPIA TIMEOUTS */
function clearWordTimers(){
  wordTimers.forEach(t => clearTimeout(t));
  wordTimers = [];
}

/* MENU */
function showMenuWords(){
  clearWordTimers();
  words.forEach(w => w.classList.remove("show"));

  words.forEach((w,i)=>{
    const timer = setTimeout(()=>{
      w.classList.add("show");
    }, i * 120);
    wordTimers.push(timer);
  });
}

function hideMenuWords(){
  clearWordTimers();
  words.forEach(w => w.classList.remove("show"));
}

/* EVENTS */
navCenter.addEventListener("mouseenter", showMenuWords);

navCenter.addEventListener("mouseleave", ()=>{
  hideMenuWords();
  animateTitle();
});

/* INIT */
animateTitle();