"use strict";

// Preços fornecidos pela marca nos nomes das fotografias, em centavos.
// Não acrescentar opções de aroma/tamanho sem confirmação de disponibilidade.
globalThis.Iluminarte = {
  contact: { whatsapp: "", instagram: "", address: "", mapsEmbed: "", mapsRoute: "" },
  categories: { velas: "Velas", sabonetes: "Sabonetes", mdf: "MDF", kits: "Kits" },
  products: [
    {
      id: "vela-drink",
      name: "Vela aromática drink",
      category: "velas",
      price: 6000,
      description: "Uma vela para compor momentos e presentes especiais.",
      options: ["Modelo da foto"],
    },
    {
      id: "sabonete-rosas",
      name: "Sabonete de rosas",
      category: "sabonetes",
      price: 1000,
      description: "Delicadeza em forma de sabonete para presentear com carinho.",
      options: ["Modelo da foto"],
    },
    {
      id: "sabonete-melancia",
      name: "Sabonete massageador de melancia",
      category: "sabonetes",
      price: 1000,
      description: "Um toque de cor na sua combinação de presentes.",
      options: ["Modelo da foto"],
    },
    {
      id: "caixa-mdf",
      name: "Caixas MDF personalizadas",
      category: "mdf",
      price: 2500,
      description:
        "Uma caixa para dar forma à sua ideia. Descreva a personalização desejada nas observações; detalhes e eventuais acréscimos serão confirmados no orçamento.",
      options: ["Modelo da foto"],
      box: true,
    },
    {
      id: "adorno-nossa-senhora",
      name: "Adorno de porta Nossa Senhora",
      category: "mdf",
      price: 4000,
      description: "Um detalhe especial para acolher e decorar.",
      options: ["Modelo da foto"],
    },
    {
      id: "kit-lavabo",
      name: "Kit Lavabo",
      category: "kits",
      price: 6000,
      description:
        "A composição apresentada na fotografia, para um presente cheio de cuidado. Consulte os detalhes da composição com a loja.",
      options: ["Composição da foto"],
    },
  ],
};
