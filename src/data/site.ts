export const SITE = 'https://cassorova.com.br';
export const NOME = 'Cassorova Resort e Ecoturismo';
export const TELEFONE = '(14) 99106-8097';
export const WHATSAPP = '5514991068097';
export const EMAIL = 'resort@cassorova.com.br';
export const CNPJ = '02.216.704/0001-21';
export const OG_PADRAO = '/og/cassorova-og-home.jpg';
// Mude a data quando alterar o texto da política de privacidade.
export const POLITICA_ATUALIZADA = '18 de novembro de 2026';

// Mensagens de WhatsApp: duas, cada uma com seu objetivo. Fonte única para todos os botões do site.
// Páginas em /day-use usam a de day use; todas as outras usam a do resort.
export function mensagemResort(datas = '', pessoas = ''): string {
  return `Olá! Vi o site do Cassorova Resort e quero reservar uma hospedagem.\nDatas de entrada e saída:${datas ? ' ' + datas : ''}\nQuantidade de pessoas:${pessoas ? ' ' + pessoas : ''}\nPode me informar disponibilidade e valores?`;
}
export function mensagemDayUse(data = '', pessoas = ''): string {
  return `Olá! Vi o site do Cassorova e quero fazer o day use.\nData da visita:${data ? ' ' + data : ''}\nQuantidade de adultos e de crianças:${pessoas ? ' ' + pessoas : ''}\nPode me ajudar com ingressos e horários?`;
}
export const MSG_WHATSAPP_RESORT = mensagemResort();
export const MSG_WHATSAPP_DAYUSE = mensagemDayUse();
export function linkWhatsapp(caminho: string): string {
  const dayUse = caminho.startsWith('/day-use');
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(dayUse ? MSG_WHATSAPP_DAYUSE : MSG_WHATSAPP_RESORT)}`;
}
// Para os formulários das páginas: devolve o código JS de uma função que monta a mesma mensagem com os dados preenchidos.
export const JS_MSG_RESORT =
  "(function(d,p){return 'Olá! Vi o site do Cassorova Resort e quero reservar uma hospedagem.\\nDatas de entrada e saída:'+(d?' '+d:'')+'\\nQuantidade de pessoas:'+(p?' '+p:'')+'\\nPode me informar disponibilidade e valores?';})";
