"use strict";

// Funções compartilhadas pelo catálogo, montador e testes.
globalThis.LojaCore = {
  money: (value) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value / 100),
  normalize: (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase(),
  reconcile(raw, products) {
    const items = [];
    let changed = false;
    for (const item of Array.isArray(raw) ? raw.slice(0, 100) : []) {
      const product = products.find((entry) => entry.id === item?.id);
      // Aceita o formato anterior para preservar rascunhos, sem expor modelos na interface.
      const legacyOption = item?.option;
      if (
        !product ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99 ||
        (legacyOption !== undefined &&
          !["Modelo da foto", "Composição da foto"].includes(legacyOption))
      ) {
        changed = true;
        continue;
      }
      if (item.price !== product.price || legacyOption !== undefined) changed = true;
      const existing = items.find((entry) => entry.id === item.id);
      if (existing) {
        existing.quantity = Math.min(99, existing.quantity + item.quantity);
        changed = true;
      } else items.push({ id: product.id, quantity: item.quantity, price: product.price });
    }
    return { items, changed };
  },
  add(items, product, quantity = 1) {
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return false;
    const existing = items.find((item) => item.id === product.id);
    if ((existing?.quantity || 0) + quantity > 99) return false;
    if (existing) existing.quantity += quantity;
    else items.push({ id: product.id, quantity, price: product.price });
    return true;
  },
  total: (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  message(items, products, notes) {
    const { money, total } = globalThis.LojaCore;
    return [
      "Olá, IluminArte! Gostaria de consultar esta combinação:",
      "",
      ...items.map(
        (item) =>
          `${item.quantity} × ${products.find((product) => product.id === item.id).name}: ${money(item.price * item.quantity)}`,
      ),
      "",
      `Total estimado dos produtos: ${money(total(items))}`,
      "Personalização e frete: a consultar.",
      ...(notes.trim() ? [`Observações: ${notes.trim()}`] : []),
      "",
      "Podem confirmar disponibilidade, composição, personalização, orçamento e prazo? Esta seleção não é um pedido confirmado.",
    ].join("\n");
  },
};
