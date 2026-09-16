/* Dados da apresentação — Sauna a Vapor Dupla Mônaco.
   Sem preços: o objetivo é gerar percepção de valor e levar
   o visitante ao atendimento comercial. */
const PRODUCT = {
  slug: "sauna-vapor-dupla-monaco",
  name: "Sauna a Vapor Dupla Mônaco",
  tagline:
    "Design, conforto e tecnologia reunidos em um projeto desenvolvido para proporcionar uma experiência completa de relaxamento e bem-estar.",
  images: [
    { src: "assets/img/product/monaco-01", alt: "Sauna a Vapor Dupla Mônaco, vista frontal em vidro temperado e banco em madeira" },
    { src: "assets/img/product/monaco-02", alt: "Sauna a Vapor Dupla Mônaco, vista lateral com banco interno para duas pessoas" },
    { src: "assets/img/product/monaco-03", alt: "Detalhe do acabamento e das ferragens da Sauna a Vapor Dupla Mônaco" },
    { src: "assets/img/product/monaco-04", alt: "Sauna a Vapor Dupla Mônaco em funcionamento, vapor sobre o vidro temperado" },
    { src: "assets/img/product/monaco-05", alt: "Sauna a Vapor Dupla Mônaco instalada em área de lazer externa" }
  ],
  dimensions: { length: "1,30 m", width: "1,00 m", height: "2,00 m" },
  capacity: "02 pessoas",
  generator: { power: "9000W", brand: "Impercap" },
  glass: "Vidro temperado de 8 mm",
  panel: "Painel digital",
  warranty: "1 ano de garantia",
  electrical: { wiring: "10 mm", breaker: "DR63" }
};

/* Seção 03 — Pensada em cada detalhe */
const FEATURES = [
  {
    number: "01",
    title: "Banco interno em madeira",
    text: "O conforto e a estética natural da madeira integrados ao ambiente da sauna.",
    image: { src: "assets/img/product/monaco-02", alt: "Banco interno em madeira da Sauna Mônaco" }
  },
  {
    number: "02",
    title: "Vidro temperado de 8 mm",
    text: "Maior segurança, resistência e acabamento sofisticado.",
    image: { src: "assets/img/product/monaco-01", alt: "Estrutura em vidro temperado de 8 mm da Sauna Mônaco" }
  },
  {
    number: "03",
    title: "Painel digital",
    text: "Controle simples e moderno para proporcionar mais praticidade durante a experiência.",
    image: { src: "assets/img/product/monaco-03", alt: "Painel digital e acabamento da Sauna Mônaco" }
  },
  {
    number: "04",
    title: "Gerador de vapor 9000W",
    text: "Sistema desenvolvido para proporcionar geração eficiente de vapor. Equipamento Impercap.",
    image: { src: "assets/img/product/monaco-04", alt: "Vapor gerado pela Sauna Mônaco em funcionamento" }
  },
  {
    number: "05",
    title: "Capacidade para duas pessoas",
    text: "Um ambiente confortável desenvolvido para proporcionar momentos de relaxamento a dois.",
    image: { src: "assets/img/product/monaco-05", alt: "Sauna Mônaco instalada, com espaço para duas pessoas" }
  }
];

/* Seção 07 — Ciência, calor & bem-estar */
const WELLBEING_TOPICS = [
  { icon: "flame", label: "Saúde cardiovascular" },
  { icon: "bolt", label: "Artérias saudáveis" },
  { icon: "sliders", label: "Recuperação muscular" },
  { icon: "sparkle", label: "Relaxamento" },
  { icon: "shield", label: "Qualidade do sono" },
  { icon: "wood", label: "Bem-estar" }
];

/* Seção 09 — Do projeto à sua casa */
const TIMELINE = [
  { number: "01", title: "Entendimento do espaço", text: "Avaliação do ambiente e das possibilidades do seu projeto." },
  { number: "02", title: "Definição do projeto", text: "Alinhamento de medidas, acabamento e especificações técnicas." },
  { number: "03", title: "Preparação", text: "Organização da estrutura, elétrica e materiais para a instalação." },
  { number: "04", title: "Instalação", text: "Montagem e instalação com acompanhamento técnico especializado." },
  { number: "05", title: "Entrega", text: "Seu novo ambiente de bem-estar pronto para uso." }
];

/* Seção 10 — Galeria */
const GALLERY = [
  { src: "assets/img/gallery/ambiente-03-cedro", alt: "Detalhe da madeira de cedro em projeto Hidrolar Banhos", label: "Madeira" },
  { src: "assets/img/product/monaco-01", alt: "Estrutura em vidro temperado da Sauna Mônaco", label: "Vidro" },
  { src: "assets/img/product/monaco-03", alt: "Painel digital e acabamento da Sauna Mônaco", label: "Painel digital" },
  { src: "assets/img/experience/experience-sauna-vapor", alt: "Vapor em ambiente de sauna Hidrolar", label: "Vapor" },
  { src: "assets/img/product/monaco-02", alt: "Bancos internos da Sauna Mônaco", label: "Bancos" },
  { src: "assets/img/product/monaco-04", alt: "Acabamento da Sauna Mônaco em funcionamento", label: "Acabamento" },
  { src: "assets/img/experience/hero-sauna-noturna", alt: "Iluminação indireta de projeto Hidrolar ao entardecer", label: "Iluminação" },
  { src: "assets/img/experience/architecture-sauna-rooftop", alt: "Ambiente completo de projeto Hidrolar em rooftop", label: "Ambiente completo" },
  { src: "assets/img/experience/lifestyle-spa-lounge", alt: "Ambiente de relaxamento Hidrolar ao entardecer", label: "Ambiente" },
  {
    type: "video",
    src: "assets/video/tour-instalacao.mp4",
    poster: "assets/img/experience/tour-poster",
    alt: "Tour em vídeo de um projeto Hidrolar instalado",
    label: "Vídeo do projeto"
  }
];
