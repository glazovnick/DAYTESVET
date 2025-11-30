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
const mobileMenuSection = mobileMenuSectionTitle?.closest(
  ".mobile-menu__section"
);
const mobileMenuCategoryList = mobileMenuSection?.querySelector(
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

// Product Gallery Carousel
const productGalleryTrack = document.querySelector(
  ".product-detail__gallery-track"
);
const productGalleryPrev = document.querySelector(
  ".product-detail__gallery-arrow--prev"
);
const productGalleryNext = document.querySelector(
  ".product-detail__gallery-arrow--next"
);

if (productGalleryTrack && productGalleryPrev && productGalleryNext) {
  const galleryThumbs = productGalleryTrack.querySelectorAll(
    ".product-detail__gallery-thumb"
  );
  const totalImages = galleryThumbs.length;
  const visibleImages = 4;
  let currentIndex = 0;

  const updateCarousel = () => {
    if (totalImages <= visibleImages) {
      // Если изображений 4 или меньше, скрываем кнопки
      productGalleryPrev.style.display = "none";
      productGalleryNext.style.display = "none";
      return;
    }

    // Показываем кнопки если изображений больше 4
    productGalleryPrev.style.display = "flex";
    productGalleryNext.style.display = "flex";

    // Отключаем кнопки на границах
    productGalleryPrev.disabled = currentIndex === 0;
    productGalleryNext.disabled = currentIndex >= totalImages - visibleImages;

    if (productGalleryPrev.disabled) {
      productGalleryPrev.style.opacity = "0.3";
      productGalleryPrev.style.cursor = "not-allowed";
    } else {
      productGalleryPrev.style.opacity = "1";
      productGalleryPrev.style.cursor = "pointer";
    }

    if (productGalleryNext.disabled) {
      productGalleryNext.style.opacity = "0.3";
      productGalleryNext.style.cursor = "not-allowed";
    } else {
      productGalleryNext.style.opacity = "1";
      productGalleryNext.style.cursor = "pointer";
    }

    // Вычисляем смещение
    if (galleryThumbs.length > 0 && galleryThumbs[0].offsetWidth > 0) {
      const thumbWidth = galleryThumbs[0].offsetWidth;
      const gap =
        parseFloat(
          getComputedStyle(productGalleryTrack).gap.replace("px", "")
        ) || 8;
      const translateX = -(currentIndex * (thumbWidth + gap));
      productGalleryTrack.style.transform = `translateX(${translateX}px)`;
    }
  };

  productGalleryPrev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  productGalleryNext.addEventListener("click", () => {
    if (currentIndex < totalImages - visibleImages) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Обновляем при загрузке и изменении размера окна
  const initCarousel = () => {
    // Ждем загрузки изображений
    if (galleryThumbs.length > 0) {
      let loadedImages = 0;
      galleryThumbs.forEach((thumb) => {
        if (thumb.complete) {
          loadedImages++;
        } else {
          thumb.addEventListener("load", () => {
            loadedImages++;
            if (loadedImages === totalImages) {
              updateCarousel();
            }
          });
        }
      });
      if (loadedImages === totalImages) {
        updateCarousel();
      } else {
        // Если не все загружены, обновляем через небольшую задержку
        setTimeout(updateCarousel, 100);
      }
    }
  };

  // Инициализация при загрузке DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCarousel);
  } else {
    initCarousel();
  }

  window.addEventListener("resize", updateCarousel);

  // Клик по миниатюре для изменения основного изображения
  const mainImage = document.querySelector(".product-detail__main-img");
  if (mainImage) {
    galleryThumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        mainImage.src = thumb.src;
        mainImage.alt = thumb.alt;
      });
    });
  }
}

// Cart interactions
const cartList = document.querySelector(".cart-card .cart-list");

if (cartList) {
  const cartTotals = document.querySelectorAll("[data-cart-total]");
  const clearCartBtn = document.querySelector(".cart-toolbar__clear");

  const formatCurrency = (value) => `${value.toLocaleString("ru-RU")} ₽`;

  const getCartItems = () =>
    Array.from(cartList.querySelectorAll(".cart-item"));

  const updateItemTotal = (cartItem) => {
    const qtyInput = cartItem.querySelector(".cart-item__qty-input");
    const unitPrice = Number(cartItem.dataset.unitPrice) || 0;
    let qty = Number(qtyInput.value);

    if (!Number.isFinite(qty) || qty < 1) {
      qty = 1;
    }

    qtyInput.value = qty;

    const total = qty * unitPrice;
    const totalEl = cartItem.querySelector("[data-item-total]");
    if (totalEl) {
      totalEl.textContent = formatCurrency(total);
    }

    return total;
  };

  const updateCartSummary = () => {
    const items = getCartItems();
    const totalSum = items.reduce(
      (acc, cartItem) => acc + updateItemTotal(cartItem),
      0
    );

    cartTotals.forEach((el) => {
      el.textContent = formatCurrency(totalSum);
    });

    if (clearCartBtn) {
      clearCartBtn.disabled = items.length === 0;
    }
  };

  const changeQuantity = (button, direction) => {
    const cartItem = button.closest(".cart-item");
    if (!cartItem) return;
    const input = cartItem.querySelector(".cart-item__qty-input");
    if (!input) return;

    const step = direction === "increment" ? 1 : -1;
    const currentValue = Number(input.value) || 1;
    const nextValue = Math.max(1, currentValue + step);
    input.value = nextValue;
    updateCartSummary();
  };

  cartList.addEventListener("click", (event) => {
    const qtyBtn = event.target.closest(".cart-item__qty-btn");
    if (qtyBtn) {
      changeQuantity(qtyBtn, qtyBtn.dataset.action);
      return;
    }

    const removeBtn = event.target.closest(".cart-item__remove");
    if (removeBtn) {
      const cartItem = removeBtn.closest(".cart-item");
      cartItem?.remove();
      updateCartSummary();
    }
  });

  cartList.addEventListener("input", (event) => {
    if (event.target.matches(".cart-item__qty-input")) {
      updateCartSummary();
    }
  });

  clearCartBtn?.addEventListener("click", () => {
    getCartItems().forEach((item) => item.remove());
    updateCartSummary();
  });

  updateCartSummary();
}

// Payment method toggle for legal entity email field
const paymentRadios = document.querySelectorAll('input[name="payment"]');
const legalEmailField = document.getElementById("legalEmailField");
const legalEmailInput = legalEmailField?.querySelector(".checkout-input");

if (paymentRadios.length > 0 && legalEmailField) {
  const toggleLegalEmail = () => {
    const selectedPayment = document.querySelector(
      'input[name="payment"]:checked'
    );
    if (selectedPayment?.value === "legal") {
      legalEmailField.style.display = "block";
      if (legalEmailInput) {
        legalEmailInput.required = true;
      }
    } else {
      legalEmailField.style.display = "none";
      if (legalEmailInput) {
        legalEmailInput.required = false;
        legalEmailInput.value = "";
      }
    }
  };

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", toggleLegalEmail);
  });

  // Initialize on page load
  toggleLegalEmail();
}
