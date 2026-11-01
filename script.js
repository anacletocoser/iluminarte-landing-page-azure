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

// Cabeçalho móvel fixo durante a rolagem; o desktop mantém o comportamento original.
const siteHeader = document.querySelector(".site-header");
if (siteHeader) {
  const updateHeader = () => siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
  if ("ResizeObserver" in window) {
    new ResizeObserver(() =>
      document.documentElement.style.setProperty(
        "--mobile-header-height",
        siteHeader.offsetHeight + "px",
      ),
    ).observe(siteHeader);
  }
}

// Fotografias automáticas a cada 3 segundos, com pausa e navegação manual.
const photo = document.querySelector("#hero-photo");
if (photo && globalThis.Iluminarte) {
  const products = globalThis.Iluminarte.products;
  const carousel = document.querySelector(".carousel");
  const caption = document.querySelector("#photo-caption");
  const playback = document.querySelector("#carousel-playback");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0,
    timer = null,
    userPaused = false,
    hovered = false,
    focused = false,
    visible = true;
  const stop = () => {
    window.clearTimeout(timer);
    timer = null;
  };
  const sync = () => {
    stop();
    playback.hidden = reducedMotion.matches;
    playback.textContent = userPaused ? "Reproduzir carrossel" : "Pausar carrossel";
    const running =
      !userPaused && !hovered && !focused && visible && !document.hidden && !reducedMotion.matches;
    caption.setAttribute("aria-live", running ? "off" : "polite");
    if (running)
      timer = window.setTimeout(() => {
        show(1);
        sync();
      }, 3000);
  };
  let imageRequest = 0;
  let fade = null;
  const previousPhoto = photo.cloneNode();
  previousPhoto.removeAttribute("id");
  previousPhoto.removeAttribute("fetchpriority");
  previousPhoto.alt = "";
  previousPhoto.setAttribute("aria-hidden", "true");
  previousPhoto.className = "carousel-previous";
  previousPhoto.hidden = true;
  photo.before(previousPhoto);
  const show = async (delta) => {
    current = (current + delta + products.length) % products.length;
    const product = products[current];
    const request = ++imageRequest;
    const incoming = new Image();
    incoming.sizes = photo.sizes;
    incoming.srcset =
      "assets/produtos/" +
      product.id +
      "-480.jpg 480w, assets/produtos/" +
      product.id +
      "-960.jpg 960w";
    incoming.src = "assets/produtos/" + product.id + "-960.jpg";
    try {
      await incoming.decode();
    } catch {
      return;
    }
    if (request !== imageRequest) return;
    if (fade) {
      fade.cancel();
      fade = null;
    }
    previousPhoto.src = photo.src;
    previousPhoto.srcset = photo.srcset;
    previousPhoto.sizes = photo.sizes;
    previousPhoto.hidden = reducedMotion.matches;
    photo.src = "assets/produtos/" + product.id + "-960.jpg";
    photo.srcset =
      "assets/produtos/" +
      product.id +
      "-480.jpg 480w, assets/produtos/" +
      product.id +
      "-960.jpg 960w";
    photo.alt = product.name + " da IluminArte";
    caption.textContent =
      String(current + 1).padStart(2, "0") +
      " / " +
      String(products.length).padStart(2, "0") +
      " · " +
      product.name;
    if (!reducedMotion.matches) {
      fade = photo.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 550,
        easing: "ease-in-out",
      });
      fade.onfinish = () => {
        previousPhoto.hidden = true;
        fade = null;
      };
    } else {
      previousPhoto.hidden = true;
    }
  };
  for (const [id, delta] of [
    ["photo-prev", -1],
    ["photo-next", 1],
  ]) {
    const button = document.getElementById(id);
    button.hidden = false;
    button.addEventListener("click", () => {
      show(delta);
      sync();
    });
  }
  playback.addEventListener("click", () => {
    userPaused = !userPaused;
    if (!userPaused) {
      focused = false;
      hovered = false;
    }
    sync();
  });
  carousel.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      hovered = true;
      sync();
    }
  });
  carousel.addEventListener("pointerleave", () => {
    hovered = false;
    sync();
  });
  carousel.addEventListener("focusin", () => {
    focused = true;
    sync();
  });
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      focused = false;
      sync();
    }
  });
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(event.key === "ArrowLeft" ? -1 : 1);
      sync();
    }
  });
  let startX = null;
  carousel.addEventListener(
    "touchstart",
    (event) => {
      startX = event.touches[0].clientX;
      stop();
    },
    { passive: true },
  );
  carousel.addEventListener(
    "touchend",
    (event) => {
      const distance = event.changedTouches[0].clientX - startX;
      if (startX !== null && Math.abs(distance) > 50) show(distance < 0 ? 1 : -1);
      startX = null;
      sync();
    },
    { passive: true },
  );
  carousel.addEventListener(
    "touchcancel",
    () => {
      startX = null;
      sync();
    },
    { passive: true },
  );
  document.addEventListener("visibilitychange", sync);
  reducedMotion.addEventListener("change", sync);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    ).observe(carousel);
  }
  sync();
}
const feedbackVideo = document.querySelector("#feedback-video");
if (feedbackVideo) {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) feedbackVideo.pause();
  });
}

// Sugestões locais levam ao catálogo já filtrado; Enter pesquisa o texto digitado.
const homeSearch = document.querySelector("#home-search");
if (homeSearch && globalThis.Iluminarte) {
  const results = document.querySelector("#home-search-results");
  const status = document.querySelector("#home-search-status");
  homeSearch.addEventListener("keydown", (event) => {
    if (event.key === "Escape") results.hidden = true;
  });
  document.addEventListener("click", (event) => {
    if (!homeSearch.form.contains(event.target)) results.hidden = true;
  });
  homeSearch.addEventListener("focus", () => {
    results.hidden = !homeSearch.value.trim() || !results.children.length;
  });
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
      link.href = homeSearch.form.getAttribute("action") + "?q=" + encodeURIComponent(product.name);
      link.textContent = product.name + " · " + globalThis.LojaCore.money(product.price);
      li.append(link);
      results.append(li);
    });
  });
}

// Animações exclusivas da página inicial; conteúdo legível sem JavaScript.
if (
  document.body.classList.contains("home-page") &&
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(
      ".hero-copy, .hero-visual, .personalized-copy, .about-photo, .about-grid > div, .faq-grid > div, .contact-inner, .feedback-grid > div",
    )
    .forEach((element) => {
      element.classList.add("scroll-reveal");
      revealObserver.observe(element);
    });
  const letterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("letters-visible");
          letterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  document.querySelectorAll("main h1 em, main h2 em").forEach((element) => {
    const text = element.textContent;
    const accessible = document.createElement("span");
    accessible.className = "visually-hidden";
    accessible.textContent = text;
    const visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    let index = 0;
    text
      .split(/(\s+)/)
      .filter(Boolean)
      .forEach((word) => {
        if (/^\s+$/.test(word)) {
          visual.append(document.createTextNode(word));
          return;
        }
        const group = document.createElement("span");
        group.className = "animated-word";
        Array.from(word).forEach((letter) => {
          const span = document.createElement("span");
          span.className = "animated-letter";
          span.textContent = letter;
          span.style.setProperty("--letter-delay", Math.min(index * 60, 1600) + "ms");
          group.append(span);
          index++;
        });
        visual.append(group);
      });
    element.replaceChildren(accessible, visual);
    element.classList.add("letter-highlight");
    letterObserver.observe(element);
  });
}
