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

// Fotografias reais; avanço manual, sem reprodução automática.
const photo = document.querySelector("#hero-photo");
if (photo && globalThis.Iluminarte) {
  const products = globalThis.Iluminarte.products;
  let current = 0;
  const show = (delta) => {
    current = (current + delta + products.length) % products.length;
    const product = products[current];
    photo.src = `assets/produtos/${product.id}-960.jpg`;
    photo.srcset = `assets/produtos/${product.id}-480.jpg 480w, assets/produtos/${product.id}-960.jpg 960w`;
    photo.alt = product.name + " da IluminArte";
    document.querySelector("#photo-caption").textContent =
      `${String(current + 1).padStart(2, "0")} / 06 · ${product.name}`;
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
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  let startX = null;
  carousel.addEventListener(
    "touchstart",
    (event) => {
      startX = event.touches[0].clientX;
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
    .querySelectorAll(".collection-card, .personalized-copy, .about-grid")
    .forEach((element) => observer.observe(element));
}

const locationPanel = document.querySelector("#location");
if (locationPanel && globalThis.Iluminarte) {
  const contact = globalThis.Iluminarte.contact;
  if (contact.address) {
    locationPanel.querySelector("p").textContent = contact.address;
    // Ativar somente com endereço público e URLs exatos confirmados pela marca.
    if (contact.mapsEmbed.startsWith("https://www.google.com/maps/embed?")) {
      const frame = document.createElement("iframe");
      frame.src = contact.mapsEmbed;
      frame.title = "Localização da IluminArte no Google Maps";
      frame.loading = "lazy";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      locationPanel.append(frame);
      const privacy = document.createElement("p");
      privacy.className = "small-note";
      privacy.textContent =
        "Este mapa carrega conteúdo do Google, sujeito à política de privacidade desse serviço.";
      locationPanel.append(privacy);
    }
    if (contact.mapsRoute.startsWith("https://www.google.com/maps/")) {
      const route = document.createElement("a");
      route.href = contact.mapsRoute;
      route.textContent = "Abrir rotas no Google Maps ↗";
      route.target = "_blank";
      route.rel = "noopener noreferrer";
      route.className = "text-link";
      locationPanel.append(route);
    }
  }
  const official = document.querySelector("#official-contacts");
  if (/^\d{10,15}$/.test(contact.whatsapp)) {
    const link = document.createElement("a");
    link.href = `https://wa.me/${contact.whatsapp}`;
    link.textContent = "Converse pelo WhatsApp ↗";
    link.className = "text-link";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    official.append(link);
  }
  if (/^https:\/\/www\.instagram\.com\/[a-zA-Z0-9_.]+\/?$/.test(contact.instagram)) {
    const link = document.createElement("a");
    link.href = contact.instagram;
    link.textContent = "Instagram ↗";
    link.className = "text-link";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    official.append(link);
  }
}
