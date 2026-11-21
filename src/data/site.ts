export const SITE = 'https://cassorova.com.br';
export const NOME = 'Cassorova Resort e Ecoturismo';
export const TELEFONE = '(14) 99106-8097';
export const WHATSAPP = '5514991068097';
export const EMAIL = 'resort@cassorova.com.br';
export const CNPJ = '02.216.704/0001-21';
export const OG_PADRAO = '/og/cassorova-og-home.jpg';
// Mude a data quando alterar o texto da política de privacidade.
export const POLITICA_ATUALIZADA = '18 de novembro de 2026';

// Nome da página que aparece na mensagem de WhatsApp (a equipe vê de onde o lead veio).
const NOME_PAGINA: Record<string, string> = {
  '/': 'Início',
  '/bangalos/': 'Bangalôs',
  '/lazer/': 'Lazer',
  '/cachoeiras/': 'Cachoeiras',
  '/gastronomia/': 'Gastronomia',
  '/experiencias/': 'Experiências',
  '/pacotes/': 'Pacotes',
  '/ofertas-hospedagem-brotas/': 'Ofertas de Hospedagem',
  '/pacotes/ferias-janeiro/': 'Férias de Janeiro',
  '/pacotes/consciencia-negra/': 'Consciência Negra',
  '/reveillon/': 'Réveillon',
  '/carnaval/': 'Carnaval',
  '/day-use/': 'Day Use',
  '/reservas/': 'Reservas e Contato',
  '/termos-e-condicoes/': 'Termos e Condições',
};
export function nomePagina(caminho: string): string {
  const c = caminho.endsWith('/') ? caminho : caminho + '/';
  return NOME_PAGINA[c] || '';
}
function origem(caminho: string, marca: string): string {
  const n = nomePagina(caminho);
  return `Vim pelo site do ${marca}${n ? ', na página ' + n + ',' : ''}`;
}

// Mensagens de WhatsApp: duas, cada uma com seu objetivo. Fonte única para todos os botões do site.
// Páginas em /day-use usam a de day use; todas as outras usam a do resort.
// Os botões enviam uma mensagem simples, sem campos para preencher. Só os formulários de busca (com datas e pessoas) levam esses dados.
export function mensagemResort(caminho = '/', datas = '', pessoas = ''): string {
  const o = origem(caminho, 'Cassorova Resort');
  if (!datas && !pessoas) return `Olá! ${o} e gostaria de mais informações sobre a hospedagem.`;
  return `Olá! ${o} e quero reservar uma hospedagem.${datas ? '\nDatas: ' + datas : ''}${pessoas ? '\nPessoas: ' + pessoas : ''}\nPode me informar disponibilidade e valores?`;
}
export function mensagemDayUse(caminho = '/day-use/', data = '', pessoas = ''): string {
  const o = origem(caminho, 'Cassorova');
  if (!data && !pessoas) return `Olá! ${o} e gostaria de mais informações sobre o day use.`;
  return `Olá! ${o} e quero fazer o day use.${data ? '\nData da visita: ' + data : ''}${pessoas ? '\nAdultos e crianças: ' + pessoas : ''}\nPode me ajudar com ingressos e horários?`;
}
export function linkWhatsapp(caminho: string): string {
  const dayUse = caminho.startsWith('/day-use');
  const msg = dayUse ? mensagemDayUse(caminho) : mensagemResort(caminho);
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}
// Para os formulários das páginas: devolve o código JS de uma função que monta a mensagem com os dados preenchidos e o nome da página.
export function jsMsgResort(caminho: string): string {
  const o = origem(caminho, 'Cassorova Resort');
  const base = JSON.stringify(`Olá! ${o} e quero reservar uma hospedagem.`);
  const simples = JSON.stringify(`Olá! ${o} e gostaria de mais informações sobre a hospedagem.`);
  return `(function(d,p){if(!d&&!p){return ${simples};}return ${base}+(d?'\\nDatas: '+d:'')+(p?'\\nPessoas: '+p:'')+'\\nPode me informar disponibilidade e valores?';})`;
}
