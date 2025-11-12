const burgerMenuBtn = document.getElementById("burgerMenuBtn");
const mobileSidebar = document.getElementById("mobileSidebar");
const mobileSidebarOverlay = document.getElementById("mobileSidebarOverlay");

burgerMenuBtn.addEventListener("click", () => {
  mobileSidebar.classList.toggle("active");
  mobileSidebarOverlay.classList.toggle("active");
  burgerMenuBtn.classList.toggle("active");
  document.body.style.overflow = mobileSidebar.classList.contains("active")
    ? "hidden"
    : "";
});

const mobileCloseBtn = document.getElementById("mobileCloseBtn");

const closeMobileMenu = () => {
  mobileSidebar.classList.remove("active");
  mobileSidebarOverlay.classList.remove("active");
  burgerMenuBtn.classList.remove("active");
  document.body.style.overflow = "";
};

mobileSidebarOverlay.addEventListener("click", closeMobileMenu);
mobileCloseBtn.addEventListener("click", closeMobileMenu);
