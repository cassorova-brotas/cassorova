import type { APIRoute } from 'astro';

// No endereço provisório (PUBLIC_NOINDEX=true) bloqueia tudo. No definitivo, libera e aponta o sitemap.
// Os robôs de IA ficam liberados de propósito (visibilidade em ChatGPT, Gemini, Perplexity, Claude).
export const GET: APIRoute = () => {
  const bloqueado = import.meta.env.PUBLIC_NOINDEX === 'true';
  const corpo = bloqueado
    ? 'User-agent: *\nDisallow: /\n'
    : [
        'User-agent: *',
        'Allow: /',
        '',
        'User-agent: GPTBot',
        'Allow: /',
        'User-agent: OAI-SearchBot',
        'Allow: /',
        'User-agent: ChatGPT-User',
        'Allow: /',
        'User-agent: ClaudeBot',
        'Allow: /',
        'User-agent: Claude-SearchBot',
        'Allow: /',
        'User-agent: PerplexityBot',
        'Allow: /',
        'User-agent: Google-Extended',
        'Allow: /',
        '',
        'Sitemap: https://cassorova.com.br/sitemap-index.xml',
        '',
      ].join('\n');
  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
