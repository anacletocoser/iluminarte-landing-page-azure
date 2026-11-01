"use strict";

(() => {
  const { products, categories, contact } = globalThis.Iluminarte;
  const { money, normalize, reconcile, total, message } = globalThis.LojaCore;
  const nested = location.pathname.includes("/catalogo/");
  const prefix = nested ? "../" : "";
  const picture = (product) =>
    `<img src="${prefix}assets/produtos/${product.id}-480.jpg" srcset="${prefix}assets/produtos/${product.id}-480.jpg 480w, ${prefix}assets/produtos/${product.id}-960.jpg 960w" sizes="(max-width: 640px) 90vw, 30vw" alt="${product.name}" width="720" height="960" loading="lazy" />`;
  const grid = document.querySelector("#catalog-grid");
  if (grid) {
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
        card.innerHTML = `<a class="product-photo" href="catalogo/monte-seu-kit.html?produto=${product.id}" aria-label="Montar combinação com ${product.name}">${picture(product)}<span class="photo-link" aria-hidden="true">↗</span></a><div class="product-copy"><span class="category">${categories[product.category]}</span><h2>${product.name}</h2><p class="product-price">${money(product.price)}</p><details><summary>Detalhes da criação</summary><p>${product.description}</p><p>Modelo: ${product.options.join(", ")}. Disponibilidade e prazo a confirmar. Personalização e frete a consultar.</p></details><a class="text-link" href="catalogo/monte-seu-kit.html?produto=${product.id}">Adicionar à combinação →</a></div>`;
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
  const key = "iluminarte-combinacao-v1";
  const notes = document.querySelector("#order-notes");
  const draftStatus = document.querySelector("#draft-status");
  let items = [];
  let storageAvailable = true;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    if (saved) {
      const restored = reconcile(saved.items, products);
      items = restored.items;
      notes.value = typeof saved.notes === "string" ? saved.notes.slice(0, 1500) : "";
      draftStatus.textContent = restored.changed
        ? "Rascunho revisado: itens indisponíveis foram removidos e preços atualizados. Confira a combinação."
        : "Seu rascunho foi recuperado.";
    }
  } catch {
    storageAvailable = false;
    draftStatus.textContent =
      "Não foi possível recuperar o rascunho. Você pode montar e copiar sua combinação nesta visita.";
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify({ items, notes: notes.value }));
      if (storageAvailable) draftStatus.textContent = "Rascunho salvo neste navegador.";
    } catch {
      storageAvailable = false;
      draftStatus.textContent = "Armazenamento indisponível. Copie o resumo antes de sair.";
    }
  }
  function renderSummary() {
    const target = document.querySelector("#selected-items");
    target.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "Sua combinação ainda está em branco. Escolha uma criação ao lado.";
      target.append(empty);
    }
    items.forEach((item, index) => {
      const product = products.find((entry) => entry.id === item.id);
      const row = document.createElement("div");
      row.className = "selected-row";
      row.innerHTML = `<div><strong>${product.name}</strong><span>${item.option} · ${money(item.price)} cada</span></div><label>Quantidade de ${product.name}<input type="number" min="1" max="99" step="1" value="${item.quantity}" required /></label><div class="selected-bottom"><strong>${money(item.price * item.quantity)}</strong><button type="button" class="text-button" aria-label="Remover ${product.name}">Remover</button></div>`;
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
    form.innerHTML = `${picture(product)}<div><span class="category">${product.box ? "Caixa opcional" : categories[product.category]}</span><h3>${product.name}</h3><p class="product-price">${money(product.price)}</p><label for="opcao-${product.id}">Modelo</label><select id="opcao-${product.id}">${product.options.map((option) => `<option>${option}</option>`).join("")}</select><label for="quantidade-${product.id}">Quantidade</label><input id="quantidade-${product.id}" type="number" min="1" max="99" step="1" value="1" required /><button type="submit" class="button button-outline">Adicionar +</button><p class="inline-feedback" role="status"></p></div>`;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const quantity = Number(form.querySelector("input").value);
      const option = form.querySelector("select").value;
      const existing = items.find((item) => item.id === product.id && item.option === option);
      if ((existing?.quantity || 0) + quantity > 99) {
        draftStatus.textContent =
          "O limite é de 99 unidades por produto. Para quantidades maiores, consulte a loja.";
        return;
      }
      if (existing) existing.quantity += quantity;
      else items.push({ id: product.id, option, quantity, price: product.price });
      save();
      renderSummary();
      form.querySelector(".inline-feedback").textContent = "Adicionado à combinação.";
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
    try {
      localStorage.removeItem(key);
    } catch {
      /* A seleção em memória também é apagada. */
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
})();
