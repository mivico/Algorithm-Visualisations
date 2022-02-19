const menuOpen = document.querySelector(".menu");
const menuClose = document.querySelector(".close");
const overlay = document.querySelector(".overlay");

menuOpen.addEventListener("click", () => {
  overlay.classList.add("overlay--active");
});

menuClose.addEventListener("click", () => {
  overlay.classList.remove("overlay--active");
});

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}