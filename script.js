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

// Функция для закрытия всех разделов меню
const closeAllMenuSections = (exceptElement = null) => {
  // Закрываем основной раздел "Внутреннее освещение"
  const mainSectionTitle = document.querySelector(
    ".mobile-menu__section-title--toggle"
  );
  const mainCategoryList = document.querySelector(
    ".mobile-menu__category-list"
  );

  if (
    mainSectionTitle &&
    mainCategoryList &&
    mainSectionTitle !== exceptElement
  ) {
    mainSectionTitle.setAttribute("aria-expanded", "false");
    mainCategoryList.classList.add("mobile-menu__category-list--collapsed");
    mainCategoryList.classList.remove("mobile-menu__category-list--expanded");
  }

  // Закрываем все остальные разделы
  const allMainLinks = document.querySelectorAll(
    ".mobile-menu__main-link--toggle"
  );

  allMainLinks.forEach((link) => {
    if (link !== exceptElement) {
      link.setAttribute("aria-expanded", "false");
      const listItem = link.closest(".mobile-menu__main-item");
      const categoryList = listItem.querySelector(
        ".mobile-menu__category-list"
      );

      if (categoryList) {
        categoryList.classList.add("mobile-menu__category-list--collapsed");
        categoryList.classList.remove("mobile-menu__category-list--expanded");
      }
    }
  });
};

// Mobile menu accordion functionality
const mobileMenuSectionTitle = document.querySelector(
  ".mobile-menu__section-title--toggle"
);
const mobileMenuCategoryList = document.querySelector(
  ".mobile-menu__category-list"
);

if (mobileMenuSectionTitle && mobileMenuCategoryList) {
  mobileMenuSectionTitle.addEventListener("click", () => {
    const isExpanded =
      mobileMenuSectionTitle.getAttribute("aria-expanded") === "true";

    // Закрываем все остальные разделы перед открытием/закрытием текущего
    if (!isExpanded) {
      closeAllMenuSections(mobileMenuSectionTitle);
    }

    mobileMenuSectionTitle.setAttribute("aria-expanded", !isExpanded);
    mobileMenuCategoryList.classList.toggle(
      "mobile-menu__category-list--collapsed"
    );
    mobileMenuCategoryList.classList.toggle(
      "mobile-menu__category-list--expanded"
    );
  });
}

// Mobile menu main links accordion functionality
const mobileMenuMainLinks = document.querySelectorAll(
  ".mobile-menu__main-link--toggle"
);

mobileMenuMainLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const isExpanded = link.getAttribute("aria-expanded") === "true";

    // Закрываем все остальные разделы перед открытием/закрытием текущего
    if (!isExpanded) {
      closeAllMenuSections(link);
    }

    link.setAttribute("aria-expanded", !isExpanded);

    // Находим список категорий внутри того же элемента списка
    const listItem = link.closest(".mobile-menu__main-item");
    const categoryList = listItem.querySelector(".mobile-menu__category-list");

    if (categoryList) {
      categoryList.classList.toggle("mobile-menu__category-list--collapsed");
      categoryList.classList.toggle("mobile-menu__category-list--expanded");
    }
  });
});
