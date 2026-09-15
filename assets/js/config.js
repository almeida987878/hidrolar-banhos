/* Configurações gerais do site — edite aqui os dados de contato. */
const SITE_CONFIG = {
  whatsappNumber: "551141142212",
  whatsappDefaultMessage:
    "Olá! Vim pelo site da Hidrolar Banhos e gostaria de solicitar um orçamento.",
  instagramUrl:
    "https://www.instagram.com/hidrolarbanhos?stkn=MWV0eWVtMjJhMzZwNA==",
  address: {
    line1: "Avenida Salim Farah Maluf, 2000",
    line2: "São Paulo - SP"
  }
};

function buildWhatsAppLink(message) {
  const text = encodeURIComponent(message || SITE_CONFIG.whatsappDefaultMessage);
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${text}`;
}

function buildMapsLink(address) {
  const query = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
