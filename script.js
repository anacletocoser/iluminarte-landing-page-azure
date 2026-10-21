"use strict";

// A navegação já funciona sem JavaScript. Em telas pequenas, adicionamos o menu.
const menuButton = document.querySelector(".menu-toggle");
const headerInner = document.querySelector(".header-inner");
const navigation = document.querySelector("#menu-principal");
const mobileScreen = window.matchMedia("(max-width: 900px)");

if (menuButton && headerInner && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    headerInner.classList.remove("menu-open");
  };

  menuButton.hidden = false;
  headerInner.classList.add("menu-ready");

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    headerInner.classList.toggle("menu-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });

  mobileScreen.addEventListener("change", () => {
    const focusedElement = document.activeElement;
    closeMenu();

    // Evita manter o foco em um elemento que acabou de ficar invisível.
    if (mobileScreen.matches && navigation.contains(focusedElement)) {
      menuButton.focus();
    } else if (!mobileScreen.matches && focusedElement === menuButton) {
      navigation.querySelector("a")?.focus();
    }
  });
}
