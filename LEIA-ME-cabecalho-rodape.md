# Cabeçalho e rodapé do Cassorova (Astro), versão 3

Arquivos: src/components/Header.astro e src/components/Footer.astro (HTML, CSS e JS puros).
Uso no layout: Header no topo, main com id="conteudo", Footer no fim. Imagens do menu em public/images/menu/.

## Dois negócios, duas ações
- Resort (hospedagem): botão terracota "Reservar hospedagem" (/reservas/).
- Day use: botão oliva "Comprar day use" (reservas.cassorova.com.br/passeio/day-use).
- Os dois ficam sempre à vista: no cabeçalho (desktop), na barra fixa de baixo (celular) e nos dois cartões acima do rodapé.

## Desktop (a partir de 1100 px)
Menu grande com dois grupos. Resort: Bangalôs, Lazer, Gastronomia, Experiências e Cachoeiras, mais os Pacotes em ordem de data (Ofertas do mês, Consciência Negra, Réveillon, Férias de janeiro, Carnaval, Todos os pacotes). Day use: Day use, Cachoeiras, Aventura no cânion e Como chegar. Cada painel tem foto com chamada. Abre por passar o mouse, clicar ou teclado. A barra some ao rolar para baixo e volta ao rolar para cima.

## Celular e tablet
Menu em tela cheia com dois grupos (Resort, com Pacotes dentro, e Day use), itens de 52 px de altura, foco preso dentro do menu, Esc fecha, resto da página inerte. Barra fixa de baixo com Hospedagem, Day use e WhatsApp (respeita a área segura do iPhone).

## Acessibilidade
Link "Pular para o conteúdo", aria-expanded, aria-current, foco visível, alvos de 44 px ou mais, respeita prefers-reduced-motion.

## Rastreamento
Todo link tem data-cnv-cta e data-cnv-pos (cabecalho, menu, menu-mobile, barra-mobile, rodape, flutuante). O script do Footer envia o evento cnv_cta ao dataLayer.

## Pendências
- Logo ainda carregada do WordPress (323 px). Trocar por SVG ou PNG maior, local.
- Página /politica-de-privacidade/ e botão "Preferências de cookies" (atributo data-csr-cookies): entram com o banner de consentimento. O banner deve ficar acima da barra do celular (z-index maior que 1001).
- Telefone (14) 99106-8097: confirmar se é o oficial.
- Menu de Pacotes: remover "Consciência Negra" depois de 22/11 e manter a ordem por data conforme os pacotes mudarem.
- As fotos do menu são miniaturas de 640 px geradas a partir das originais. No build final, usar o componente de imagem do Astro.


## Versão 4 (18/11/2026): menu simplificado

Menu principal: Resort (painel com Hospedagem e Pacotes), Day use (link direto para /day-use/), Como chegar (/reservas/#cnv-como-chegar) e Contato (/reservas/#cnv-contato).
Resort, ordem: Bangalôs, Lazer, Cachoeiras, Gastronomia, Experiências. Pacotes por ordem de data.
Removidos: painel e foto do Day use (public/images/menu/menu-ecoturismo.jpg). O botão "Comprar day use" continua no topo.
Rodapé: coluna "Visite" com Day use, Como chegar e Contato e reservas.
Rastreamento: menu-day-use, menu-como-chegar e menu-contato (posição cabecalho ou menu-mobile) e rodape-*.

## Revisão de 18/11/2026 (noite)

- Logo agora local (/images/2025/03/cassorova-resort-ecoturismo.png), antes apontava para o WordPress e quebraria após a migração.
- Verde do WhatsApp escurecido (#0f8a38) para o ícone branco ter contraste suficiente.
- Adicionado scroll-padding-top para links com âncora não ficarem escondidos sob o cabeçalho fixo.
- Pendências: o layout precisa ter <main id="conteudo"> (alvo do "Pular para o conteúdo"); logo tem só 323 px; confirmar o telefone; criar /politica-de-privacidade/ e o banner de cookies; remover Consciência Negra do menu após 22/11.
