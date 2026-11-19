import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// O endereço final do site. Mesmo no endereço provisório da Hostinger, o canonical e o sitemap
// apontam para cá (e o site provisório fica bloqueado para o Google, veja PUBLIC_NOINDEX no README).
export default defineConfig({
  site: 'https://cassorova.com.br',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: false,
  integrations: [sitemap({ filter: (url) => !url.includes('/404') })],
});
