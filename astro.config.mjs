import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { PACOTES, vencido } from './scripts/validade.mjs';

// O endereço final do site. Mesmo no endereço provisório da Hostinger, o canonical e o sitemap
// apontam para cá (e o site provisório fica bloqueado para o Google, veja PUBLIC_NOINDEX no README).
export default defineConfig({
  site: 'https://cassorova.com.br',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: false,
  integrations: [sitemap({ filter: (url) => !url.includes('/404') && !PACOTES.some((p) => vencido(p.path) && url.endsWith(p.path)) })],
});
