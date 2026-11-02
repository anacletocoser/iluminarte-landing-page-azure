"use strict";

(() => {
  const { products, categories, contact } = globalThis.Iluminarte;
  const { money, normalize, reconcile, total, message, add } = globalThis.LojaCore;
  const nested = location.pathname.includes("/catalogo/");
  const prefix = nested ? "../" : "";
  const key = "iluminarte-combinacao-v1";
  const picture = (product) =>
    `<img src="${prefix}assets/produtos/${product.id}-480.jpg" srcset="${prefix}assets/produtos/${product.id}-480.jpg 480w, ${prefix}assets/produtos/${product.id}-960.jpg 960w" sizes="(max-width: 640px) 90vw, 30vw" alt="${product.name}" width="720" height="960" loading="lazy" />`;
  const specs = (product) =>
    `<dl class="product-specs"><div><dt>Peso</dt><dd>${product.weight}</dd></div><div><dt>Tamanho</dt><dd>${product.dimensions}</dd></div></dl>`;
  let items = [];
  let draftNotes = "";
  let storageAvailable = true;
  let restoredMessage = "";
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    if (saved) {
      const restored = reconcile(saved.items, products);
      items = restored.items;
      draftNotes = typeof saved.notes === "string" ? saved.notes.slice(0, 1500) : "";
      restoredMessage = restored.changed
        ? "Rascunho revisado. Confira os produtos, as quantidades e os preços atuais."
        : "Seu rascunho foi recuperado.";
    }
  } catch {
    storageAvailable = false;
    restoredMessage =
      "Não foi possível recuperar o rascunho. Você pode montar e copiar sua combinação nesta visita.";
  }
  function saveDraft() {
    try {
      localStorage.setItem(key, JSON.stringify({ items, notes: draftNotes }));
      storageAvailable = true;
      return true;
    } catch {
      storageAvailable = false;
      return false;
    }
  }

  const grid = document.querySelector("#catalog-grid");
  if (grid) {
    // Confirmação temporária, sem bloquear a navegação ou deslocar o foco.
    const notice = document.createElement("div");
    notice.className = "cart-notice";
    notice.hidden = true;
    notice.innerHTML =
      '<p role="status" id="cart-notice-message"></p><a class="notice-link" href="catalogo/monte-seu-kit.html#resumo">Clique aqui para finalizar seu pedido →</a><button class="notice-close" type="button" aria-label="Fechar confirmação">×</button>';
    document.body.append(notice);
    let timer = null;
    let hovering = false;
    const hide = () => {
      notice.hidden = true;
      window.clearTimeout(timer);
    };
    const scheduleHide = () => {
      window.clearTimeout(timer);
      if (!hovering && !notice.contains(document.activeElement))
        timer = window.setTimeout(hide, 12000);
    };
    notice.addEventListener("pointerenter", () => {
      hovering = true;
      window.clearTimeout(timer);
    });
    notice.addEventListener("pointerleave", () => {
      hovering = false;
      scheduleHide();
    });
    notice.addEventListener("focusin", () => window.clearTimeout(timer));
    notice.addEventListener("focusout", scheduleHide);
    notice.querySelector("button").addEventListener("click", hide);
    notice.addEventListener("keydown", (event) => {
      if (event.key === "Escape") hide();
    });
    function showNotice(
      text,
      href = "catalogo/monte-seu-kit.html#resumo",
      linkText = "Clique aqui para finalizar seu pedido →",
    ) {
      notice.hidden = false;
      notice.querySelector("p").textContent = text;
      notice.querySelector("a").href = href;
      notice.querySelector("a").textContent = linkText;
      scheduleHide();
    }
    const search = document.querySelector("#product-search");
    const buttons = [...document.querySelectorAll("[data-category]")];
    const readCategory = () => new URL(location.href).searchParams.get("categoria") || "";
    let category = readCategory();
    search.value = (new URL(location.href).searchParams.get("q") || "").slice(0, 100);
    function render() {
      const valid = !category || Object.hasOwn(categories, category);
      const query = normalize(search.value.trim());
      const filtered = products.filter(
        (product) =>
          (!category || product.category === category) &&
          normalize(product.name + " " + categories[product.category]).includes(query),
      );
      buttons.forEach((button) =>
        button.setAttribute("aria-pressed", String(button.dataset.category === category)),
      );
      document.querySelector("#catalog-status").textContent = valid
        ? `${category ? categories[category] : "Todos os produtos"} · ${filtered.length} ${filtered.length === 1 ? "criação encontrada" : "criações encontradas"}`
        : "Categoria não encontrada. Selecione Todos os produtos para continuar.";
      grid.replaceChildren();
      for (const product of filtered) {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `<div class="product-photo">${picture(product)}<button class="add-to-cart" type="button" aria-label="Adicionar ${product.name} à combinação" aria-describedby="add-help-${product.id}"><span class="add-symbol" aria-hidden="true">+</span><span class="add-tooltip" role="tooltip" id="add-help-${product.id}">Adicionar à combinação.</span></button></div><div class="product-copy"><span class="category">${categories[product.category]}</span><h2>${product.name}</h2><p class="product-price">${money(product.price)}</p><details class="product-details"><summary>Detalhes da criação</summary><p>${product.description}</p>${specs(product)}<p>Disponibilidade e prazo a confirmar. Personalização e frete a consultar.</p></details></div>`;
        card.querySelector(".add-to-cart").addEventListener("click", () => {
          // Releia a seleção para incorporar alterações feitas em outra aba.
          try {
            const saved = JSON.parse(localStorage.getItem(key) || "null");
            items = saved ? reconcile(saved.items, products).items : [];
            draftNotes = typeof saved?.notes === "string" ? saved.notes.slice(0, 1500) : "";
          } catch {
            /* saveDraft informa quando não é possível transferir a seleção. */
          }
          const previous = items.map((item) => ({ ...item }));
          if (!add(items, product)) {
            showNotice(
              "O limite é de 99 unidades por produto. Revise sua combinação para continuar.",
            );
            return;
          }
          if (!saveDraft()) {
            items = previous;
            showNotice(
              "Não foi possível salvar neste navegador. Adicione o produto na página Compre aqui.",
              `catalogo/monte-seu-kit.html#escolher-${product.id}`,
              "Abrir Compre aqui →",
            );
            return;
          }
          showNotice(`${product.name} adicionado à combinação.`);
        });
        grid.append(card);
      }
      if (!filtered.length) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent =
          "Nenhum produto encontrado. Experimente outra busca ou selecione Todos os produtos.";
        grid.append(empty);
      }
    }
    buttons.forEach((button) =>
      button.addEventListener("click", () => {
        category = button.dataset.category;
        const url = new URL(location.href);
        if (category) url.searchParams.set("categoria", category);
        else url.searchParams.delete("categoria");
        history.pushState(null, "", url);
        render();
      }),
    );
    search.addEventListener("input", () => {
      const url = new URL(location.href);
      if (search.value.trim()) url.searchParams.set("q", search.value.trim());
      else url.searchParams.delete("q");
      history.replaceState(null, "", url);
      render();
    });
    window.addEventListener("popstate", () => {
      category = readCategory();
      search.value = (new URL(location.href).searchParams.get("q") || "").slice(0, 100);
      render();
    });
    render();
  }

  const builder = document.querySelector("#builder-products");
  if (!builder) return;
  const notes = document.querySelector("#order-notes");
  const draftStatus = document.querySelector("#draft-status");
  notes.value = draftNotes;
  draftStatus.textContent = restoredMessage;
  function save() {
    draftNotes = notes.value;
    draftStatus.textContent = saveDraft()
      ? "Rascunho salvo neste navegador."
      : "Armazenamento indisponível. Copie o resumo antes de sair.";
  }
  function renderSummary() {
    const target = document.querySelector("#selected-items");
    target.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent =
        "Sua combinação ainda está em branco. Adicione produtos no catálogo ou nesta página.";
      target.append(empty);
    }
    items.forEach((item, index) => {
      const product = products.find((entry) => entry.id === item.id);
      const row = document.createElement("div");
      row.className = "selected-row";
      row.innerHTML = `<div><strong>${product.name}</strong><span>${money(item.price)} cada</span></div><label>Quantidade de ${product.name}<input type="number" min="1" max="99" step="1" value="${item.quantity}" required /></label><div class="selected-bottom"><strong>${money(item.price * item.quantity)}</strong><button type="button" class="text-button" aria-label="Remover ${product.name}">Remover</button></div>`;
      const quantity = row.querySelector("input");
      quantity.addEventListener("change", () => {
        if (!quantity.checkValidity() || !Number.isInteger(Number(quantity.value))) {
          quantity.reportValidity();
          return;
        }
        item.quantity = Number(quantity.value);
        save();
        renderSummary();
      });
      row.querySelector("button").addEventListener("click", () => {
        items.splice(index, 1);
        save();
        renderSummary();
      });
      target.append(row);
    });
    document.querySelector("#order-total").textContent = money(total(items));
    document.querySelector("#message-preview").value = items.length
      ? message(items, products, notes.value)
      : "";
    const whatsappReady = /^\d{10,15}$/.test(contact.whatsapp);
    document.querySelector("#send-whatsapp").disabled = !items.length || !whatsappReady;
    document.querySelector("#whatsapp-status").textContent = whatsappReady
      ? "Você revisa e confirma o envio no WhatsApp."
      : "O canal oficial será disponibilizado após confirmação da loja. Enquanto isso, copie ou selecione o resumo abaixo.";
    document.querySelector("#copy-summary").disabled = !items.length;
    document.querySelector("#clear-selection").disabled = !items.length && !notes.value;
  }
  const selectedId = new URL(location.href).searchParams.get("produto");
  for (const product of [
    ...products.filter((entry) => !entry.box),
    ...products.filter((entry) => entry.box),
  ]) {
    const form = document.createElement("form");
    form.className = "builder-card";
    form.id = `escolher-${product.id}`;
    form.innerHTML = `${picture(product)}<div><span class="category">${product.box ? "Caixa opcional" : categories[product.category]}</span><h3>${product.name}</h3><p class="product-price">${money(product.price)}</p><details class="product-details"><summary>Detalhes da criação</summary><p>${product.description}</p>${specs(product)}<p>Disponibilidade e prazo a confirmar. Personalização e frete a consultar.</p></details><label for="quantidade-${product.id}">Quantidade</label><input id="quantidade-${product.id}" type="number" min="1" max="99" step="1" value="1" required /><button type="submit" class="button button-outline">Adicionar +</button><p class="inline-feedback" role="status"></p></div>`;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const quantity = Number(form.querySelector("input").value);
      if (!add(items, product, quantity)) {
        const feedback = form.querySelector(".inline-feedback");
        feedback.textContent = "O limite é de 99 unidades por produto.";
        feedback.classList.add("feedback-error");
        draftStatus.textContent = "Para quantidades maiores, consulte a loja.";
        return;
      }
      save();
      renderSummary();
      const feedback = form.querySelector(".inline-feedback");
      feedback.classList.remove("feedback-error");
      feedback.textContent = "Adicionado à combinação.";
      draftStatus.textContent = `${product.name} adicionado. ${storageAvailable ? "Rascunho salvo." : "Copie o resumo antes de sair."}`;
    });
    if (selectedId === product.id) form.classList.add("highlighted");
    builder.append(form);
  }
  notes.addEventListener("input", () => {
    save();
    renderSummary();
  });
  document.querySelector("#clear-selection").addEventListener("click", () => {
    items = [];
    notes.value = "";
    draftNotes = "";
    try {
      localStorage.removeItem(key);
    } catch {
      /* Também limpa a seleção em memória. */
    }
    renderSummary();
    draftStatus.textContent = "Combinação apagada.";
  });
  document.querySelector("#copy-summary").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(message(items, products, notes.value));
      draftStatus.textContent = "Resumo copiado!";
    } catch {
      const preview = document.querySelector("#message-preview");
      preview.closest("details").open = true;
      preview.focus();
      preview.select();
      draftStatus.textContent = "Selecione e copie o resumo exibido abaixo.";
    }
  });
  document.querySelector("#send-whatsapp").addEventListener("click", () => {
    if (!items.length || !/^\d{10,15}$/.test(contact.whatsapp)) return;
    const url = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message(items, products, notes.value))}`;
    if (url.length > 7000) {
      draftStatus.textContent =
        "Sua combinação é extensa. Copie o resumo e cole no atendimento para preservar todos os detalhes.";
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  });
  renderSummary();
  // O resumo é renderizado depois do HTML inicial; confirme a âncora após criá-lo.
  if (location.hash === "#resumo") {
    window.requestAnimationFrame(() =>
      document.querySelector("#resumo").scrollIntoView({ block: "start", behavior: "instant" }),
    );
  }
})();
