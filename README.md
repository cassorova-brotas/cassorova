# Site Cassorova (Astro)

Site do Cassorova Resort e Ecoturismo, em Astro (HTML estático), publicado na Hostinger. Mantido pela Agência BWM. Quem for editar com o Claude: leia o `CLAUDE.md`.

## Rodar no computador
1. Instale o Node 20 ou mais novo.
2. `npm install`
3. `npm run dev` abre o site em http://localhost:4321
4. `npm run build` gera a pasta `dist`. `npm run verificar` confere links, imagens e SEO.

## Variáveis (arquivo `.env`, veja `.env.example`)
- `PUBLIC_GTM_ID`: contêiner do Google Tag Manager, GTM-N5M2VBV (o mesmo do site atual). Deixe vazio no endereço provisório, para os testes não entrarem no GA4 e no Google Ads. Preencha ao ir para o definitivo.
- `PUBLIC_NOINDEX`: `true` no endereço provisório (esconde do Google), `false` no definitivo.
- `PUBLIC_GA4_ID`, `PUBLIC_ADS_ID`, `PUBLIC_META_PIXEL_ID`: só se NÃO usar o GTM.

No GitHub, cadastre as mesmas variáveis em Settings > Secrets and variables > Actions > Variables.

## Publicar na Hostinger (uma vez)
1. No hPanel da Hostinger, crie uma conta FTP e anote servidor, usuário e senha.
2. No GitHub, em Settings > Secrets and variables > Actions, cadastre os Secrets `FTP_SERVER`, `FTP_USERNAME` e `FTP_PASSWORD`. Se a pasta do site não for `/public_html/`, cadastre a variável `FTP_PASTA`.
3. Cadastre as variáveis `PUBLIC_NOINDEX` (`true` enquanto estiver no endereço provisório) e `PUBLIC_GTM_ID` (vazia no provisório).
4. Cada envio na branch `main` monta e publica o site. Em Pull Request, o GitHub só confere.

## Colocar no ar no endereço definitivo
1. Teste tudo no endereço provisório (menu, reservas, botões, banner de cookies).
2. Mude `PUBLIC_NOINDEX` para `false` e publique de novo.
3. Aponte o DNS do domínio para a Hostinger. Mantenha os registros MX e os de e-mail como estão (e-mail fica em outro servidor).
4. Envie o sitemap em https://cassorova.com.br/sitemap-index.xml no Google Search Console.

## Pastas
- `src/fragments`: conteúdo de cada página (HTML).
- `src/data`: dados de SEO por página (`pages.ts`) e dados do site (`site.ts`).
- `src/components`: cabeçalho, rodapé, banner de cookies, rastreamento.
- `public`: imagens, artes de compartilhamento (`og`), ícones, `llms.txt`.
- `data/redirects.json`: redirecionamentos 301.
- `docs/RASTREAMENTO.md`: como configurar GA4, Google Ads e Meta Pixel no GTM.
