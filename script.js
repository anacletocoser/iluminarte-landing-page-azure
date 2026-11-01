"use strict";

// A navegação já funciona sem JavaScript. Em telas pequenas, adicionamos o menu.
const menuButton = document.querySelector(".menu-toggle");
const headerInner = document.querySelector(".header-inner");
const siteNavigation = document.querySelector("#menu-principal");
const mobileScreen = window.matchMedia("(max-width: 900px)");

if (menuButton && headerInner && siteNavigation) {
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

  siteNavigation.addEventListener("click", (event) => {
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
    if (mobileScreen.matches && siteNavigation.contains(focusedElement)) {
      menuButton.focus();
    } else if (!mobileScreen.matches && focusedElement === menuButton) {
      siteNavigation.querySelector("a")?.focus();
    }
  });
}

// Carrossel manual: nunca reproduzir vídeo automaticamente.
const photo = document.querySelector("#hero-photo");
const video = document.querySelector("#hero-video");
if (photo && video && globalThis.Iluminarte) {
  const products = globalThis.Iluminarte.products;
  const count = products.length + 1;
  let current = 0;
  const show = (delta) => {
    video.pause();
    current = (current + delta + count) % count;
    const isVideo = current === products.length;
    photo.hidden = isVideo;
    video.hidden = !isVideo;
    document.querySelector("#video-description").hidden = !isVideo;
    document.querySelector(".photo-tag").hidden = isVideo;
    let title = "Vídeo da IluminArte · toque em reproduzir";
    if (!isVideo) {
      const product = products[current];
      photo.src = "assets/produtos/" + product.id + "-960.jpg";
      photo.srcset =
        "assets/produtos/" +
        product.id +
        "-480.jpg 480w, assets/produtos/" +
        product.id +
        "-960.jpg 960w";
      photo.alt = product.name + " da IluminArte";
      title = product.name;
    }
    document.querySelector("#photo-caption").textContent =
      String(current + 1).padStart(2, "0") + " / " + String(count).padStart(2, "0") + " · " + title;
  };
  for (const [id, delta] of [
    ["photo-prev", -1],
    ["photo-next", 1],
  ]) {
    const button = document.getElementById(id);
    button.hidden = false;
    button.addEventListener("click", () => show(delta));
  }
  const carousel = document.querySelector(".carousel");
  carousel.addEventListener("keydown", (event) => {
    if (event.target.closest("video")) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  let startX = null;
  carousel.addEventListener(
    "touchstart",
    (event) => {
      startX = event.target.closest("video") ? null : event.touches[0].clientX;
    },
    { passive: true },
  );
  carousel.addEventListener(
    "touchend",
    (event) => {
      const distance = event.changedTouches[0].clientX - startX;
      if (startX !== null && Math.abs(distance) > 50) show(distance < 0 ? 1 : -1);
      startX = null;
    },
    { passive: true },
  );
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
  });
}

// Sugestões locais levam ao catálogo já filtrado; Enter pesquisa o texto digitado.
const homeSearch = document.querySelector("#home-search");
if (homeSearch && globalThis.Iluminarte) {
  const results = document.querySelector("#home-search-results");
  const status = document.querySelector("#home-search-status");
  homeSearch.addEventListener("input", () => {
    const query = globalThis.LojaCore.normalize(homeSearch.value.trim());
    results.replaceChildren();
    results.hidden = !query;
    if (!query) {
      status.textContent = "";
      return;
    }
    const matches = globalThis.Iluminarte.products.filter((product) =>
      globalThis.LojaCore.normalize(
        product.name + " " + globalThis.Iluminarte.categories[product.category],
      ).includes(query),
    );
    status.textContent = matches.length
      ? matches.length +
        (matches.length === 1
          ? " criação encontrada. Selecione para ver no catálogo."
          : " criações encontradas. Selecione para ver no catálogo.")
      : "Nenhuma criação encontrada. Tente outro nome ou consulte o catálogo.";
    matches.forEach((product) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = "catalogo.html?q=" + encodeURIComponent(product.name);
      link.textContent = product.name + " · " + globalThis.LojaCore.money(product.price);
      li.append(link);
      results.append(li);
    });
  });
}

// Conteúdo sempre visível; a animação é apenas um acabamento visual.
if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("arrived");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  document
    .querySelectorAll(".personalized-copy, .about-grid")
    .forEach((element) => observer.observe(element));
}
