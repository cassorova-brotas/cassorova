// Validade dos pacotes (data/pacotes-validade.json). Usado pelo build (páginas, menu, sitemap e .htaccess).
// Depois do último dia (fuso de Brasília) o pacote deixa de existir: a página não é gerada e o endereço vai para /pacotes/.
import { readFileSync } from 'node:fs';

export const PACOTES = JSON.parse(readFileSync(new URL('../data/pacotes-validade.json', import.meta.url), 'utf8')).pacotes;
export const FIM = Object.fromEntries(PACOTES.map((p) => [p.path, p.fim]));

// Data de hoje em Brasília (AAAA-MM-DD). A variável HOJE permite simular uma data em testes.
export function hoje() {
  if (process.env.HOJE) return process.env.HOJE;
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
}
export const vencido = (path, data = hoje()) => Boolean(FIM[path]) && data > FIM[path];
export const vigente = (path, data = hoje()) => !vencido(path, data);

// Tira do HTML os cartões e itens de lista que levam a pacotes vencidos (home, pacotes, rodapé).
export function removerVencidos(html, data = hoje()) {
  let h = html;
  for (const p of PACOTES) {
    if (!vencido(p.path, data)) continue;
    const href = `href="${p.path}"`;
    for (const [abre, fecha] of [['<li class="chm-oferta">', '</li>'], ['<article class="cpk-pacote', '</article>']]) {
      let i = 0;
      while ((i = h.indexOf(abre, i)) !== -1) {
        const f = h.indexOf(fecha, i);
        if (f === -1) break;
        const fim = f + fecha.length;
        if (h.slice(i, fim).includes(href)) h = h.slice(0, i) + h.slice(fim);
        else i = fim;
      }
    }
  }
  return h;
}

// Dia seguinte a "fim", 03:00 (horário do servidor): 03:00 UTC é meia-noite em Brasília.
export function inicioDoRedirecionamento(fim) {
  const d = new Date(`${fim}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, '') + '030000';
}
