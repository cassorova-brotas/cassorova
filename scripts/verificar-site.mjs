// Confere o site gerado (pasta dist por padrão): links internos, âncoras, imagens, SEO básico.
// Uso: npm run build && npm run verificar     (ou: node scripts/verificar-site.mjs pasta)
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const raiz = resolve(process.argv[2] || 'dist');
const erros = [];
const avisos = [];

function paginas(dir, acc = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) paginas(p, acc);
    else if (n.endsWith('.html')) acc.push(p);
  }
  return acc;
}
const existe = (url) => {
  const p = url.split('#')[0].split('?')[0];
  if (!p) return true;
  const f = join(raiz, p);
  if (existsSync(f) && statSync(f).isFile()) return true;
  return existsSync(join(f, 'index.html'));
};

const arquivos = paginas(raiz);
for (const arq of arquivos) {
  const rel = arq.slice(raiz.length) || '/';
  const html = readFileSync(arq, 'utf8');
  const e = (m) => erros.push(`${rel}: ${m}`);
  const a = (m) => avisos.push(`${rel}: ${m}`);
  const titulo = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!titulo) e('sem <title>'); else if (titulo.length > 60) a(`título com ${titulo.length} caracteres`);
  if (!desc) e('sem meta description'); else if (desc.length > 160) a(`descrição com ${desc.length} caracteres`);
  if (!/<link rel="canonical"/.test(html)) e('sem canonical');
  if (!/property="og:image"/.test(html)) e('sem og:image');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) e(`${h1} títulos H1 (esperado 1)`);
  if (!/id="conteudo"/.test(html)) e('sem id="conteudo"');
  if (/wp-content/.test(html)) e('ainda cita wp-content');
  if (/ecoparque/i.test(html)) a('cita "ecoparque"');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) e(`ids repetidos: ${[...new Set(dup)].slice(0, 5).join(', ')}`);
  const idSet = new Set(ids);
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(u)) continue;
    if (u.startsWith('#')) { if (u.length > 1 && !idSet.has(u.slice(1))) e(`âncora ${u} não existe na página`); continue; }
    if (!u.startsWith('/')) continue;
    if (!existe(u)) e(`link ou arquivo não existe: ${u}`);
    else if (u.includes('#') && /^\/[^"]*\/#/.test(u)) {
      const destino = join(raiz, u.split('#')[0], 'index.html');
      if (existsSync(destino) && !readFileSync(destino, 'utf8').includes(`id="${u.split('#')[1]}"`)) e(`âncora ${u} não existe na página de destino`);
    }
  }
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const parte of m[1].split(',')) {
      const u = parte.trim().split(/\s+/)[0];
      if (u.startsWith('/') && !existe(u)) e(`imagem do srcset não existe: ${u}`);
    }
  }
  for (const m of html.matchAll(/url\((?:'|")?(\/[^)'"]+)/g)) {
    if (!existe(m[1])) e(`imagem de CSS não existe: ${m[1]}`);
  }
}
for (const f of ['404.html', 'robots.txt', 'llms.txt', '.htaccess']) if (!existsSync(join(raiz, f))) erros.push(`falta ${f}`);

console.log(`${arquivos.length} páginas verificadas em ${raiz}`);
avisos.forEach((x) => console.log('AVISO ', x));
erros.forEach((x) => console.log('ERRO  ', x));
console.log(erros.length ? `\n${erros.length} erro(s).` : '\nSem erros.');
process.exit(erros.length ? 1 : 0);
