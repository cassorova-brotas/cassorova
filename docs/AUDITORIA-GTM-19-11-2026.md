# Auditoria do contêiner GTM-N5M2VBV (exportação de 19/11/2026)

Contêiner "cassorova.com.br": 34 tags, 25 acionadores, 9 variáveis, 3 pastas (Reservas Resort - HBook, Google Ads, PayTour).

## IDs encontrados
- GA4: G-81T3FDT83W (tag de configuração e 20 tags de evento).
- Google Ads: conversão AW-11049940360 (a conta 771-172-8329 é o número do cliente). Há 11 tags de conversão e 2 de remarketing, cada uma com rótulo próprio.
- Meta Pixel: 814372796152066 (Cassorova Ads), usado só nas tags de Compra e Checkout do HSystem. Existe também o 2364929483712116 ("Pixel Facebook Parque"), em HTML personalizado, que só envia PageView.
- Microsoft Clarity: projeto xpflv6cfvs.

## O que precisa ser corrigido antes de trocar o site

1. **Nenhuma tag tem consentimento configurado.** As 34 estão com "Consentimento não definido". As do Google (GA4, Ads, vinculador) se adaptam ao Consent Mode sozinhas, mas o Pixel em HTML personalizado e o Clarity disparam mesmo quando o visitante recusa. Ajuste: em cada tag, "Configurações avançadas > Configurações de consentimento > Exigir consentimento adicional". Meta (os dois pixels, 3 tags) exige `ad_storage`. Clarity exige `analytics_storage`. Se quiser o modo estrito para o Google também, exija `analytics_storage` nas tags do GA4 e `ad_storage` nas de Ads.
2. **Gatilho 15 "Page URL EcoParque" nunca dispara.** Ele usa três condições com E: a URL precisa conter ao mesmo tempo cassorova.com.br/ecoturismo e cassorova.com.br/pacotes/day-use/ (esta duas vezes). Por isso a tag de remarketing do EcoParque e o Pixel do Parque não disparam hoje. Troque por Page Path corresponde a RegEx `^/(day-use|ecoturismo)(/|$)`.
3. **Gatilho 17 "Page URL Hotel" vai disparar no day use novo.** Ele exclui /ecoturismo, /passeio/day-use, /pacotes/day-use e /reservas, mas o day use do site novo é /day-use/. Acrescente a exclusão de `/day-use`, senão a página de day use entra no público de remarketing do hotel.
4. **Pixel 814372796152066 sem PageView.** No contêiner ele só envia Purchase e InitiateCheckout, nos sistemas de reserva. Na home do site atual não achei o código do Pixel. Crie uma tag de Pixel com PageView (e Lead/Contact nos cliques de WhatsApp) em todas as páginas do site, exigindo `ad_storage`.
5. **WhatsApp:** o gatilho 86 (qualquer clique em wa.me) alimenta "GA4 WhatsApp Hotel" e "Google Ads WhatsApp Hotel". Ele conta também os cliques do canionismo (99108-2601) e qualquer outro wa.me. Restrinja para `wa.me/5514991068097`. O gatilho 21 ("Click to Chat") vem do plugin do WordPress e deixa de existir no site novo. O 64 e o 49 usam o endereço api.whatsapp.com, que o site novo não usa (usa wa.me).
6. **Gatilhos de WhatsApp do parque, chatbot e formulário.** 24 (wa.me/5514991951122), 61 (Chatwoot), 87 (id enviar-reserva-whatsapp) e 46 (id hbook-reservar) apontam para itens que não existem no site novo. O Chatwoot já está comentado no site atual. Pode manter, mas eles não vão disparar.
7. **Eventos do site novo sem gatilho.** O site envia `cnv_cta` (cabeçalho, menu, rodapé), `cnv_cta_click`, `cnv_faq_abrir`, `cnv_busca`, `cbg_*`, `chm_*` etc., e o GTM não escuta nenhum. Falta criar o gatilho e a tag de evento do GA4 (ver RASTREAMENTO.md).
8. **Clarity duplicado hoje.** O site atual tem o Clarity no código do tema e também na tag do GTM (mesmo projeto). No site novo ele só entra pelo GTM, o que é o certo.
9. **Script de terceiro no site atual.** O tema carrega analytics.cod3rocket.com (website-id fbe3d758-2ba2-4c88-b8f0-4bc61f9abb2f), comentado como "Eduardo Teles". O site novo não carrega. Se ainda for usado, me diga e eu incluo atrás do consentimento.

## O que já está certo
- Vinculador de conversões com os domínios hbook.hsystem.com.br, cachoeiracassorova.com.br, cassorova.com.br e reservas.cassorova.com.br (mede a jornada entre o site e as reservas).
- Tags do GA4, do Ads e vinculador no acionador de inicialização, o melhor lugar para o Consent Mode.
- Compra do HBook e do PayTour com valor, id da transação e dados do usuário (conversões otimizadas).

## Durante os testes
O "Tag do GA4" dispara em qualquer domínio. No endereço provisório deixe `PUBLIC_GTM_ID` vazio, ou os testes entram no GA4 e no Ads.

## Decisão de 19/11/2026
Depois que o site for ao ar, o contêiner será refeito do zero, com base só no site novo e nos motores de reserva (HBook, PayTour/day use). Os ajustes acima servem de lista do que NÃO repetir. O WhatsApp único do site é (14) 99106-8097 (5514991068097), inclusive no canionismo. O gatilho de WhatsApp do novo contêiner deve usar só wa.me/5514991068097.

## Confirmações de 19/11/2026
- Cod3rocket (analytics.cod3rocket.com) e Chatwoot ficam de fora do site novo. Nenhum dos dois está no código.
- Redirecionamento 301 de /galeria/ para /lazer/ confirmado (já está em data/redirects.json).
- Repositório: o Cassorova providenciará uma conta no GitHub.
