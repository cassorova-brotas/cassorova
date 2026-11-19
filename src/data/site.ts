export const SITE = 'https://cassorova.com.br';
export const NOME = 'Cassorova Resort e Ecoturismo';
export const TELEFONE = '(14) 99106-8097';
export const WHATSAPP = '5514991068097';
export const EMAIL = 'resort@cassorova.com.br';
export const CNPJ = '02.216.704/0001-21';
export const OG_PADRAO = '/og/cassorova-og-home.jpg';
// Mude a data quando alterar o texto da política de privacidade.
export const POLITICA_ATUALIZADA = '18 de novembro de 2026';

// Mensagens do botão de WhatsApp: cada uma com seu objetivo.
export const MSG_WHATSAPP_RESORT =
  'Olá! Vi o site do Cassorova Resort e quero reservar uma hospedagem.\nDatas de entrada e saída:\nQuantidade de pessoas:\nPode me informar disponibilidade e valores?';
export const MSG_WHATSAPP_DAYUSE =
  'Olá! Vi o site do Cassorova e quero fazer o day use.\nData da visita:\nQuantidade de adultos e de crianças:\nPode me ajudar com ingressos e horários?';
export function linkWhatsapp(caminho: string): string {
  const dayUse = caminho.startsWith('/day-use');
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(dayUse ? MSG_WHATSAPP_DAYUSE : MSG_WHATSAPP_RESORT)}`;
}
