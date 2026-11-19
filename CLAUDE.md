# Site do Cassorova Resort e Ecoturismo (Brotas-SP)

Instruções para o Claude (ou qualquer pessoa) que for atualizar este site. Responda e escreva sempre em português do Brasil.

## Como o site é montado
- Astro, site estático. Cada página é um arquivo HTML pronto em `src/fragments/<chave>.html`. O título, a descrição (SEO), a URL e a imagem de compartilhamento ficam em `src/data/pages.ts`.
- Cabeçalho, rodapé e banner de cookies: `src/components/Header.astro`, `Footer.astro` e `CookieBanner.astro`. O layout comum (meta tags, rastreamento) é `src/layouts/Base.astro`.
- Imagens em `public/images/AAAA/MM/arquivo`. Nas páginas, use sempre o caminho `/images/...` (nunca `wp-content`).
- Redirecionamentos 301 das URLs antigas: `data/redirects.json`. O `.htaccess` é gerado sozinho no build.
- Publicação: o repositório é cassorova-brotas/cassorova no GitHub. A Hostinger monta o site sozinha (npm run build, saída dist) a cada envio na branch `main`. Variáveis de ambiente ficam no painel da Hostinger (hoje só PUBLIC_NOINDEX=true). Provisório: complete-pink-panther-70.hostingersite.com.

## Como fazer as tarefas mais comuns
- Mudar um texto, preço ou data: edite o `src/fragments/<chave>.html`. Mantenha os atributos `data-cnv-*` e `data-chm-*`/`data-cbg-*`, que alimentam o rastreamento.
- Mudar título ou descrição do Google: edite `src/data/pages.ts`. Título até 60 caracteres, descrição até 160. Não coloque o mês no título nem na descrição.
- Trocar uma foto: coloque o arquivo em `public/images/AAAA/MM/` (nome em minúsculas, sem acento, com palavras separadas por hífen, descrevendo a foto) e troque o caminho na página. Prefira JPG de até 2000 px de largura.
- Criar página nova: crie `src/fragments/<chave>.html`, inclua a página em `src/data/pages.ts` (com `og`), crie a arte 1200x630 em `public/og/` e coloque o link no menu (`Header.astro`) se for o caso.
- Tirar uma página do ar (ex.: pacote de feriado que acabou): remova de `pages.ts` e do menu, apague o fragmento e acrescente o 301 em `data/redirects.json` (para `/pacotes/`).
- Antes de enviar, rode `npm run build` e `npm run verificar`. O verificador precisa terminar com "Sem erros".

## Regras do projeto
- Menu: Resort (Bangalôs, Lazer, Cachoeiras, Gastronomia, Experiências e Pacotes por ordem de data), Day use, Como chegar, Contato. Dois negócios: resort (hospedagem, cor terracota) e day use (cor oliva).
- Não criar barra fixa no rodapé dentro das páginas: o cabeçalho e a barra do celular (Hospedagem, Day use, WhatsApp) já cumprem esse papel.
- Todo link e botão importante tem `data-cnv-cta` e `data-cnv-pos`. Eles disparam o evento `cnv_cta` no `dataLayer`. Mantenha ao criar botões novos.
- Textos: simples e diretos, sem travessão como pontuação, sem exageros de marketing. Preços e regras só com confirmação do Cassorova.
- Cookies e privacidade: nunca carregue GA4, Google Ads ou Meta Pixel fora do `Tracking.astro`/GTM, para respeitar o consentimento do visitante.
- Telefone/WhatsApp único do site: (14) 99106-8097 (5514991068097), inclusive nos botões do canionismo. Não use nenhum outro número. Só existem duas mensagens de WhatsApp (resort e day use, escolhida pelo caminho da página), e ficam em `src/data/site.ts`. Elas valem para TODOS os botões: cabeçalho, barra do celular, rodapé, flutuante e os botões dentro das páginas. No build, qualquer link `wa.me/5514991068097?text=...` de um fragmento é trocado pela mensagem oficial (`src/pages/[...slug].astro` e `404.astro`), então nos fragmentos escreva só `https://wa.me/5514991068097?text=x`. Os formulários de busca (home, bangalôs, lazer, pacotes, gastronomia, experiências) preenchem a mesma mensagem com datas e pessoas usando o marcador `__WA_MSG_RESORT__`. Para mudar o texto, edite só o `site.ts`.
- Rastreamento: depois que o site entrar no ar, o contêiner GTM será refeito do zero, só com o site novo e os motores de reserva (docs/RASTREAMENTO.md).
- Endereço provisório: com `PUBLIC_NOINDEX=true` o site se esconde do Google. No endereço definitivo, mude a variável para `false`.

## Pendências conhecidas
- Consciência Negra (19 a 22/11/2026): despublicar depois do feriado (ver acima).
- Retirar a palavra "ecoparque" das páginas e do dado estruturado (schema) quando o Cassorova aprovar.
- Texto da Cassorovinha: aguarda descrição do lugar.
- Logo com 323 px de largura: trocar por SVG ou PNG maior.
- Fotos de baixa resolução e vídeo da home para comprimir (o do day use já foi reduzido de 6,4 MB para 0,6 MB).
