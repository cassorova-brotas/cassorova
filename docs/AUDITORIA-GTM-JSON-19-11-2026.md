# Auditoria do JSON do GTM-N5M2VBV (workspace 67, exportado em 19/11/2026 21h39 UTC)

Contêiner "cassorova.com.br": 34 tags, 25 acionadores, 9 variáveis, 3 pastas (Reservas Resort - HBook, Google Ads, PayTour), 2 modelos (Meta Pixel e Clarity). Esta leitura cobre o arquivo inteiro, não só o início.

## 1. O que descobri que muda o plano

1. **Este contêiner roda em três lugares: no site, no HBook (hbook.hsystem.com.br) e no Paytour (reservas.cassorova.com.br).** Os acionadores "Acionador HSystem Formulário" (carregamento de qualquer página do HBook) e os eventos `purchase`, `begin_checkout`, `add_to_cart`, `view_item_list` e `purchase_paytour` vêm dos motores de reserva. Por isso o ID GTM-N5M2VBV não pode mudar: refaça o conteúdo dentro deste mesmo contêiner.
2. **Consequência:** toda tag que é só do site (PageView do Pixel, remarketing, cliques de WhatsApp) precisa de condição `Page Hostname = cassorova.com.br`. Hoje a "Tag do GA4", a "Tag do Google AW" e o Clarity disparam em qualquer domínio, porque estão em inicialização/All Pages.
3. **Zero tags têm consentimento configurado (34 de 34 "Não definido").** Os dois modelos (Meta Pixel e Clarity) não verificam consentimento no código. Ou seja, o Pixel e o Clarity disparam mesmo que o visitante recuse.

## 2. Problemas encontrados (do mais grave ao menos)

| # | Problema | Onde | Efeito | Correção |
|---|---|---|---|---|
| 1 | Os eventos do Paytour para o GA4 usam nomes fora do padrão: `purchase_paytour`, `addToCart`, `viewCart`, `checkout_paytour`. `form_start` e `form_submit` são nomes reservados do GA4. | Tags 66, 68, 70, 72, 74, 76 | O GA4 não reconhece a compra do Paytour como `purchase` (sem receita nos relatórios de e-commerce) nem o carrinho e o checkout como funil | Usar `purchase`, `add_to_cart`, `view_cart`, `begin_checkout`. Separar a origem por um parâmetro `origem=paytour`. Trocar os dois nomes reservados por `paytour_form_start` e `paytour_form_submit` |
| 2 | A tag "PayTour - Compra GA4" tem 3 linhas de parâmetros com o mesmo nome (`user_data`) apontando para valor, id da transação e moeda | Tag 66 | Os três valores se sobrescrevem e a compra vai sem `value`, `transaction_id` e `currency` corretos. Como a tag também envia o e-commerce da camada de dados, parte pode estar certa, mas a configuração está errada | Apagar a tabela e confiar no e-commerce da camada de dados; se faltar campo, mapear `value`, `transaction_id`, `currency` |
| 3 | Dois acionadores iguais para `purchase` e sem filtro de domínio ("HBook - Purchase" e "Comprar-Hotel") | 36 e 56 | Risco de contar a compra duas vezes se outro sistema enviar `purchase` | Um acionador só, com `Page Hostname = hbook.hsystem.com.br` |
| 4 | "Acesso HBook" (GA4 e Ads) dispara em cada página carregada no HBook | Acionador 51, tags 52 e 53 | O Google Ads conta uma "conversão" por tela do motor de reserva e distorce o custo por conversão | Disparar uma vez por sessão, ou deixar como conversão secundária (sem otimizar lance) |
| 5 | "Acesso Plug-in HSystem" dispara em clique com id `hbook-reservar` | Acionador 46, tags 26 e 45 | O id não existe no site novo; nunca vai disparar | Remover |
| 6 | Acionador 15 "Page URL EcoParque" exige ao mesmo tempo três URLs (e uma repetida) | Tags 16 e 33 | O remarketing e o Pixel do Parque nunca disparam | Trocar por `Page Path` com RegEx `^/(day-use|ecoturismo)(/|$)` |
| 7 | Acionador 17 "Page URL Hotel" não exclui `/day-use` | Tag 18 | O público de remarketing do hotel passa a incluir quem viu o day use | Acrescentar exclusão `/day-use` |
| 8 | Eventos de WhatsApp: cliques em qualquer `wa.me` (acionador 86), no plugin "Click to Chat" (21), em `api.whatsapp.com` (64, 49) e em um id (87) | Tags 22 e 60 | Contam o WhatsApp do canionismo e de outros números; metade dos acionadores não existe no site novo | Um único acionador: clique em link que contém `wa.me/5514991068097`, ou o evento `cnv_cta` com `cnv_cta=whatsapp*` |
| 9 | Duas tags do Google em inicialização (GA4 e Ads) mais o vinculador, e as conversões também ligam o vinculador | Tags 13, 40, 59 e todas as `awct` | Redundância, sem erro | Manter as três tags de inicialização; desligar o vinculador interno das conversões |
| 10 | Variável "Fluxo Google Analytics" com o ID `UA-344444881-6` | Variável 7 | Universal Analytics foi desativado | Apagar |
| 11 | Quatro variáveis lendo o mesmo campo `ecommerce.value` (Valor, hbook_valor, paytour_valor_compra, paytour_GA4_valor) | Variáveis 55, 90, 92, 94 | Confusão, sem erro | Manter só `ecommerce.value`, `ecommerce.transaction_id`, `ecommerce.currency` |
| 12 | A moeda do Paytour usa `ecommerce.currencyCode`; o padrão do GA4 é `ecommerce.currency` | Variável 95 | Possível moeda vazia | Conferir no modo de visualização do Paytour |
| 13 | Eventos do HBook no GA4 sem e-commerce (`add_to_cart`, `begin_checkout`) | Tags 41 e 42 | Eventos sem itens/valor | Ligar "enviar dados de e-commerce" como nas demais |
| 14 | Acionadores sem uso | 25 (Form Hsystem), 29 (Hotel, `/hotel-boutique/`), 49 (WhatsApp Api) | Sujeira | Apagar |
| 15 | Clarity em todas as páginas | Tag 89 | Decisão de 19/11: sai | Apagar tag e o modelo |
| 16 | Chatbot (Chatwoot) | Tags 62 e 63, acionador 61 | Não existe mais | Apagar |
| 17 | Tags de WhatsApp do parque (número 14 99195-1122) | Tag 23, acionador 24 | Número descontinuado | Apagar |
| 18 | Enhanced conversions (modo automático) só na compra do HBook | Tag 37, variável 44 | O Paytour não envia dados do cliente | Considerar ligar também na compra do Paytour (exige campos na página de confirmação) |

## 3. O que permanece

- **Tag do GA4** `G-81T3FDT83W`, **Tag do Google** `AW-11049940360` e **Vinculador** com os domínios `hbook.hsystem.com.br, cachoeiracassorova.com.br, cassorova.com.br, reservas.cassorova.com.br`, em inicialização.
- **Compra do HBook:** GA4 `purchase` (com e-commerce e dados do usuário), Google Ads (rótulo `btLuCPrsj8QZEIjrgpUp`, valor, id da transação, conversão otimizada) e Meta `Purchase` (Pixel 814372796152066).
- **Compra do Paytour:** Google Ads (rótulo `i2zcCKTzpdgbEIjrgpUp`, valor, id da transação) e GA4 (com os ajustes dos itens 1 e 2).
- **Funil HBook:** `view_item_list`, `add_to_cart` (Ads rótulo `lKBQCIv0lsQZEIjrgpUp`) e `begin_checkout` (Ads rótulo `_QLyCPfsj8QZEIjrgpUp`; Meta `InitiateCheckout`).
- **Funil Paytour:** `viewCart`, `addToCart`, `checkout`, `form_start`, `form_submit`, com os nomes corrigidos.
- **Conversões do Ads que continuam:** WhatsApp Hotel (`Zcg_CPfVhMwaEIjrgpUp`), Acesso HBook (`oVwxCLbVp-oZEIjrgpUp`, com o ajuste do item 4), Acesso Paytour (`ww-uCK-plc4aEIjrgpUp`).
- **Remarketing:** Hotel e Day use (com os ajustes dos itens 6 e 7).
- **Pixel 814372796152066:** Compra e Checkout (mais PageView, que falta).

## 4. O que sai

Clarity (tag 89 e modelo); Chatbot (62, 63, acionador 61); WhatsApp do Parque (23, 24); Plug-in HSystem (26, 45, acionador 46); acionadores 21, 25, 29, 49, 64 e 87; variável UA (7); variáveis duplicadas (90, 92, 94 e `Valor`).

## 5. O que entra (site novo)

- `cta_click` e variantes: o site envia `cnv_cta` e eventos por página (`chm_cta_click`, `cbg_cta_click` etc.). Acionador com RegEx `^cnv_cta$|_cta_click$`.
- `faq_abrir`, `busca_hospedagem`, `galeria_abrir`, `carrossel_usar`, `csr_consent_update`.
- WhatsApp: `cnv_cta` com valor que começa com `whatsapp`, mais o clique em `wa.me/5514991068097`.
- Meta Pixel: PageView em todas as páginas do site; `Lead` nos cliques de WhatsApp; `InitiateCheckout` nos de reservar/comprar.
- Consentimento: ativar a visão geral e exigir em cada tag (Meta: `ad_storage`; Ads: `ad_storage` e `ad_user_data`; GA4: `analytics_storage`).

## 6. Decisões que preciso de você

1. **Nomes dos eventos do Paytour:** trocar para os padrões do GA4 (recomendado). O histórico de `purchase_paytour` no GA4 fica separado do novo; marcar o novo `purchase` como evento principal.
2. **Pixel do Parque (2364929483712116):** continua? Se sim, só em `/day-use/` e com consentimento.
3. **Padronizar os nomes dos eventos do site** (`cta_click`, `faq_abrir`, `busca_hospedagem`) no código, para simplificar os acionadores.
4. **Acesso HBook como conversão do Ads:** deixar como secundária (recomendado) ou manter como está.

Com as quatro respostas, preparo o JSON do contêiner novo para importação (modo "Mesclar", em um espaço de trabalho novo, para você revisar antes de publicar).
