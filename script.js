const burgerMenuBtn = document.getElementById("burgerMenuBtn");
const mobileSidebar = document.getElementById("mobileSidebar");
const mobileSidebarOverlay = document.getElementById("mobileSidebarOverlay");

const toggleMobileMenu = () => {
  const isOpen = mobileSidebar.classList.toggle("mobile-menu--open");
  mobileSidebarOverlay.classList.toggle(
    "mobile-menu__overlay--visible",
    isOpen
  );
  burgerMenuBtn.classList.toggle("site-header__burger--active", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
};

burgerMenuBtn.addEventListener("click", toggleMobileMenu);

const mobileCloseBtn = document.getElementById("mobileCloseBtn");

const closeMobileMenu = () => {
  mobileSidebar.classList.remove("mobile-menu--open");
  mobileSidebarOverlay.classList.remove("mobile-menu__overlay--visible");
  burgerMenuBtn.classList.remove("site-header__burger--active");
  document.body.style.overflow = "";
};

mobileSidebarOverlay.addEventListener("click", closeMobileMenu);

if (mobileCloseBtn) {
  mobileCloseBtn.addEventListener("click", closeMobileMenu);
}
