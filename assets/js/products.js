/* Catálogo de produtos — adicione novos modelos aqui, como novos itens do array. */
const PRODUCTS = [
  {
    slug: "sauna-vapor-dupla-monaco",
    name: "Sauna a Vapor Dupla Mônaco",
    tagline: "Conforto, tecnologia e acabamento sofisticado para até duas pessoas.",
    shortDescription:
      "Sauna a vapor em vidro temperado com banco em madeira nobre, painel digital e gerador de alta potência.",
    images: [
      { src: "assets/img/product/monaco-01", alt: "Sauna a Vapor Dupla Mônaco vista frontal, estrutura em vidro temperado e banco em madeira" },
      { src: "assets/img/product/monaco-02", alt: "Sauna a Vapor Dupla Mônaco vista lateral com banco interno para duas pessoas" },
      { src: "assets/img/product/monaco-03", alt: "Detalhe do acabamento e ferragens da Sauna a Vapor Dupla Mônaco" },
      { src: "assets/img/product/monaco-04", alt: "Sauna a Vapor Dupla Mônaco em funcionamento, vapor sobre o vidro temperado" },
      { src: "assets/img/product/monaco-05", alt: "Sauna a Vapor Dupla Mônaco instalada em área de lazer externa" }
    ],
    dimensions: { length: "1,30 m", width: "1,00 m", height: "2,00 m" },
    capacity: "Até 2 pessoas",
    structure: [
      "Banco de chão em madeira",
      "Banco interno para 02 pessoas",
      "Vidro temperado de 8 mm",
      "Painel digital"
    ],
    generator: { power: "9000W", brand: "Impercap" },
    glass: "Temperado 8 mm",
    panel: "Painel digital",
    warranty: "1 ano de garantia",
    electrical: {
      wiring: "10 mm",
      breaker: "DR63"
    },
    differentials: [
      "Projeto personalizado",
      "Vidro temperado de 8 mm",
      "Banco interno em madeira",
      "Painel digital",
      "Gerador de vapor de alta potência",
      "Instalação preparada para segurança elétrica",
      "Acabamento premium",
      "1 ano de garantia"
    ],
    pricing: {
      cash: 14000,
      installmentTotal: 16000,
      installments: 10
    }
  }
];
