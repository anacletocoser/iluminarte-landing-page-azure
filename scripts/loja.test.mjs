import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
const context = vm.createContext({ Intl });
vm.runInContext(await readFile(new URL("../produtos.js", import.meta.url), "utf8"), context);
vm.runInContext(await readFile(new URL("../loja-core.js", import.meta.url), "utf8"), context);
const { products } = context.Iluminarte;
const core = context.LojaCore;
const item = (id, quantity = 1) => {
  const p = products.find((p) => p.id === id);
  return { id, quantity, price: p.price, option: p.options[0] };
};
test("soma preços em centavos e formata reais", () => {
  const items = [item("vela-drink", 2), item("sabonete-rosas", 3), item("caixa-mdf")];
  assert.equal(core.total(items), 17500);
  assert.match(core.money(17500), /175,00/);
  assert.equal(core.normalize("Sabonete aromático"), "sabonete aromatico");
});
test("recupera rascunhos usando preços atuais e rejeita itens inválidos", () => {
  const result = core.reconcile(
    [
      { ...item("vela-drink"), price: 1 },
      item("kit-lavabo", 0),
      item("caixa-mdf", 100),
      { ...item("sabonete-rosas"), option: "inexistente" },
      { id: "removido" },
      item("vela-drink"),
    ],
    products,
  );
  assert.equal(result.changed, true);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].price, 6000);
  assert.equal(core.reconcile(null, products).items.length, 0);
  assert.equal(core.reconcile([item("sabonete-rosas", 1.5)], products).items.length, 0);
});
test("mensagem preserva acentos, observações, valores e limites de confirmação", () => {
  const text = core.message(
    [item("vela-drink", 2), item("caixa-mdf")],
    products,
    "Aniversário da vovó\nGravar: carinho & luz",
  );
  assert.match(text, /145,00/);
  assert.match(text, /Personalização e frete: a consultar/);
  assert.match(text, /não é um pedido confirmado/);
  assert.equal(decodeURIComponent(encodeURIComponent(text)), text);
  assert.match(text, /carinho & luz/);
});
test("ids únicos, preços válidos e arquivos reais para todos os produtos", async () => {
  assert.equal(new Set(products.map((p) => p.id)).size, products.length);
  for (const product of products) {
    assert.ok(Number.isInteger(product.price) && product.price > 0);
    for (const size of [480, 960])
      assert.ok(
        (await readFile(new URL(`../assets/produtos/${product.id}-${size}.jpg`, import.meta.url)))
          .length > 0,
      );
  }
});
