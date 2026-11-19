// Gera public/.htaccess (Hostinger/Apache): HTTPS, 301 das URLs antigas, 404 e cache.
// Rodado automaticamente antes do build (npm run build).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { PACOTES, vencido, inicioDoRedirecionamento } from './validade.mjs';

const redir = JSON.parse(readFileSync('data/redirects.json', 'utf8')).paginas;
const imgs = JSON.parse(readFileSync('data/imagens-mapa-urls.json', 'utf8'));
const noindex = process.env.PUBLIC_NOINDEX === 'true';

const esc = (s) => s.replace(/[.+?()[\]{}|\\^$]/g, '\\$&');
const l = [];
l.push('# Gerado por scripts/gerar-htaccess.mjs. Não edite à mão: mude data/redirects.json.');
l.push('ErrorDocument 404 /404.html');
l.push('DirectoryIndex index.html');
l.push('Options -Indexes');
l.push('');
l.push('<IfModule mod_rewrite.c>');
l.push('RewriteEngine On');
if (!noindex) {
  l.push('# Força HTTPS e o endereço sem www');
  l.push('RewriteCond %{HTTPS} off [OR]');
  l.push('RewriteCond %{HTTP_HOST} ^www\\. [NC]');
  l.push('RewriteRule ^(.*)$ https://cassorova.com.br/$1 [L,R=301]');
  l.push('');
}
l.push('# Pacotes com data de fim (data/pacotes-validade.json): depois do último dia vão para /pacotes/ sozinhos.');
l.push('# Pacote já vencido no build: 301 definitivo. Ainda vigente: 302 que passa a valer à meia-noite (Brasília) seguinte ao fim.');
for (const p of PACOTES) {
  const de = p.path.replace(/^\/|\/$/g, '');
  if (vencido(p.path)) {
    l.push(`RewriteRule ^${esc(de)}/?$ /pacotes/ [R=301,L]`);
  } else {
    l.push(`RewriteCond %{TIME} >=${inicioDoRedirecionamento(p.fim)}`);
    l.push(`RewriteRule ^${esc(de)}/?$ /pacotes/ [R=302,L]`);
  }
}
l.push('');
l.push('# Páginas antigas');
for (const r of redir) {
  const de = r.de.replace(/^\/|\/$/g, '');
  l.push(`RewriteRule ^${esc(de)}/?$ ${r.para} [R=301,L]`);
}
l.push('');
l.push('# Imagens do WordPress (/wp-content/uploads/...) para /images/...');
const vistos = new Set();
for (const [de, para] of Object.entries(imgs)) {
  const m = de.match(/^https?:\/\/[^/]+(\/wp-content\/uploads\/.+)$/);
  if (!m) continue;
  const origem = m[1].slice(1);
  if (vistos.has(origem)) continue;
  vistos.add(origem);
  l.push(`RewriteRule ^${esc(origem)}$ ${para} [R=301,L]`);
}
l.push('</IfModule>');
l.push('');
l.push('<IfModule mod_expires.c>');
l.push('ExpiresActive On');
l.push('ExpiresByType image/jpeg "access plus 1 year"');
l.push('ExpiresByType image/png "access plus 1 year"');
l.push('ExpiresByType image/webp "access plus 1 year"');
l.push('ExpiresByType image/svg+xml "access plus 1 year"');
l.push('ExpiresByType video/mp4 "access plus 1 year"');
l.push('ExpiresByType text/css "access plus 1 month"');
l.push('ExpiresByType application/javascript "access plus 1 month"');
l.push('ExpiresByType text/html "access plus 0 seconds"');
l.push('</IfModule>');
l.push('');
l.push('<IfModule mod_deflate.c>');
l.push('AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml text/plain application/xml');
l.push('</IfModule>');
l.push('');
l.push('<IfModule mod_headers.c>');
l.push('Header set X-Content-Type-Options "nosniff"');
l.push('Header set Referrer-Policy "strict-origin-when-cross-origin"');
l.push('Header set X-Frame-Options "SAMEORIGIN"');
l.push('</IfModule>');

mkdirSync('public', { recursive: true });
writeFileSync('public/.htaccess', l.join('\n') + '\n');
console.log(`public/.htaccess gerado: ${PACOTES.length} pacotes com validade, ${redir.length} páginas e ${vistos.size} imagens redirecionadas.`);
