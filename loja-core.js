"use strict";

// Funções puras compartilhadas entre a interface e os testes de cálculo/rascunho.
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
      if (
        !product ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99 ||
        !product.options.includes(item.option) ||
        items.some((entry) => entry.id === item.id && entry.option === item.option)
      ) {
        changed = true;
        continue;
      }
      if (item.price !== product.price) changed = true;
      items.push({
        id: product.id,
        option: item.option,
        quantity: item.quantity,
        price: product.price,
      });
    }
    return { items, changed };
  },
  total: (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  message(items, products, notes) {
    const { money, total } = globalThis.LojaCore;
    return [
      "Olá, IluminArte! Gostaria de consultar esta combinação:",
      "",
      ...items.map(
        (item) =>
          `${item.quantity} × ${products.find((product) => product.id === item.id).name} — ${item.option}: ${money(item.price * item.quantity)}`,
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
