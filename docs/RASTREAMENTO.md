# Rastreamento: GTM, GA4, Google Ads e Meta Pixel

## IDs da Cassorova
- GA4 (ID de métricas): G-81T3FDT83W
- Google Ads: conta 771-172-8329
- Meta Pixel "Cassorova Ads": 814372796152066
- Conversão do Google Ads: AW-11049940360. Pixel do Parque: 2364929483712116. Clarity: xpflv6cfvs.
- Os três já estão configurados dentro do contêiner GTM-N5M2VBV. O site só carrega o GTM, então não repita esses IDs no código (contaria em dobro).
- Antes de publicar, confira no GTM se as tags do GA4, do Ads e do Pixel exigem consentimento (passo 1 a 6 abaixo). Sem isso, elas disparam mesmo quando o visitante recusa os cookies.

## Conferência do contêiner
Veja `AUDITORIA-GTM-19-11-2026.md`: o que corrigir no GTM antes de trocar o site (consentimento, acionadores com URLs antigas, Pixel sem PageView).

## Plano
O contêiner será refeito depois da entrada no ar, só com o site novo e os motores de reserva. WhatsApp único: (14) 99106-8097.

## Como funciona
- O site carrega só o Google Tag Manager (GTM-N5M2VBV). GA4, Google Ads e Meta Pixel são configurados dentro do GTM.
- O Consent Mode v2 nasce com tudo negado e o banner de cookies atualiza a permissão. Estatística libera `analytics_storage`. Marketing libera `ad_storage`, `ad_user_data` e `ad_personalization`.
- Quando o visitante escolhe, o site envia o evento `csr_consent_update` (com `csr_estatistica` e `csr_marketing` = sim ou nao) ao `dataLayer`.

## Eventos que o site já envia ao dataLayer
- `cnv_cta`: clique em botão ou link do cabeçalho, do menu, da barra do celular e do rodapé. Campos: `cnv_cta` (nome do botão), `cnv_posicao` (cabecalho, menu, menu-mobile, barra-mobile, rodape, flutuante) e `link_url`.
- Cada página também envia eventos próprios, com prefixo da página: `cnv_cta_click`, `cnv_faq_abrir`, `cnv_busca`, `cnv_carrossel_usar` (pacotes, day use, cachoeiras, reservas), `cbg_*` (bangalôs), `chm_*` (home), `cdu_*` (day use), `cex_*` (experiências), `cgs_*` (gastronomia), `clz_*` (lazer) e `cpk_*` (pacotes). Terminações em comum: `_cta_click` (clique), `_faq_abrir` (pergunta aberta), `_busca_hospedagem` (busca de datas), `_galeria_abrir`.
- `csr_consent_update`: o visitante escolheu nos cookies.
- Dica: no GTM, crie um gatilho de evento personalizado com regex `_cta_click$` para pegar todos os cliques das páginas de uma vez, e use as variáveis de camada de dados para o nome do botão (os campos mudam de prefixo: `cbg_cta`, `chm_cta`, `cdu_cta` etc.).

## O que configurar no GTM
1. **Configurações do contêiner:** ative "Habilitar visão geral do consentimento".
2. **Tag de configuração do Google (GA4):** ID de medição G-… (vem do GA4 da Cassorova). Gatilho: All Pages. Consentimento: exige `analytics_storage`.
3. **Tags de evento GA4:** uma para `cnv_cta` (parâmetros cnv_cta, cnv_posicao, link_url) e outra para `cnv_faq_abrir`. Gatilho: evento personalizado com o mesmo nome. Crie as variáveis de camada de dados `cnv_cta`, `cnv_posicao` e `link_url`.
4. **Conversões (marque como evento principal no GA4):** `cnv_cta` com `cnv_cta` = `reservar-hospedagem`, `comprar-day-use` ou `whatsapp` (cliques de intenção). A compra de verdade acontece nos sistemas de reserva (HBook e reservas.cassorova.com.br), em outro endereço: configure a medição entre domínios do GA4 e peça ao fornecedor o evento de compra.
5. **Google Ads:** tag "Vinculador de conversões" em All Pages, mais uma tag "Conversão do Google Ads" por ação (ID e rótulo vêm do Google Ads). Consentimento: exige `ad_storage` e `ad_user_data`.
6. **Meta Pixel:** tag HTML personalizada (código base do Pixel) em All Pages, com consentimento exigindo `ad_storage`. Eventos: `Lead` ou `Contact` nos cliques de WhatsApp, `InitiateCheckout` nos de reservar ou comprar.
7. **Teste:** use o modo de visualização do GTM e a Visão de depuração do GA4 antes de publicar o contêiner.

## O que falta
- Conferir no GTM o consentimento de cada tag e os gatilhos dos eventos acima.
- Acesso de edição ao contêiner GTM-N5M2VBV (ou eu entrego o passo a passo para quem tem).

## Botões que vão direto ao HBook
O botão "Reservar hospedagem" do cabeçalho (computador) e o "Hospedagem" da barra do celular abrem direto o HBook (hbook.hsystem.com.br), na mesma aba. Os dois disparam `cnv_cta` com `cnv_cta=reservar-hospedagem`, `cnv_posicao=cabecalho` ou `barra-mobile` e `link_url` do HBook. A atribuição passa pelo vinculador de domínios do GTM (hbook.hsystem.com.br precisa estar na lista de domínios do vinculador). Não colocar UTM nesses links: ele reiniciaria a origem da sessão no HBook.
