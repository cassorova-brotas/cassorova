# Auditoria do site novo e plano do GTM (19/11/2026)

Base: site novo no ar em https://cassorova.com.br (conferido às 18h30), código do repositório e a auditoria do contêiner GTM-N5M2VBV de 19/11. O arquivo de exportação do contêiner antigo não estava mais disponível nesta sessão, então a parte do GTM usa a auditoria já feita. Uma revisão linha a linha do JSON fica para quando o arquivo for reenviado.

## 1. Urgente

1. **O site no ar não carrega o GTM.** A variável `PUBLIC_GTM_ID` está vazia na Hostinger. Hoje não há GA4, Google Ads, Meta nem conversões rodando. Cada dia assim perde dados e público de remarketing.
2. **Não ligue o contêiner antigo como está.** Ele tem 34 tags sem consentimento (Clarity e o Pixel do Parque disparam mesmo quando o visitante recusa), gatilhos com URLs do WordPress e eventos do site novo sem gatilho.
3. **Caminho recomendado:** (a) pausar já as tags do Clarity no contêiner antigo e exigir consentimento nos pixels da Meta; (b) preencher `PUBLIC_GTM_ID=GTM-N5M2VBV` na Hostinger e refazer a implantação; (c) em seguida, publicar o contêiner novo como uma nova versão do mesmo contêiner.
4. **Mantenha o mesmo ID (GTM-N5M2VBV).** O HBook e o Paytour provavelmente carregam esse ID para medir a compra. Se criarmos um contêiner com outro ID, a conversão de compra deixa de ser medida até o fornecedor trocar o código. O "refazer do zero" deve ser feito dentro do mesmo contêiner (importar com "Substituir" ou criar um espaço de trabalho novo e publicar).

## 2. Site novo: o que está certo

- Domínio abre com HTTPS; `www` e barra final redirecionam (301).
- Canonical, título, descrição (136 a 154 caracteres), um H1 por página e imagem de compartilhamento em todas as páginas auditadas.
- Dados estruturados (JSON-LD) em todas as páginas.
- `robots.txt` e `sitemap-index.xml` no ar; páginas 404 com `noindex`.
- Nenhuma página carrega script de terceiros (só Google Fonts). Isso ajuda a velocidade e a privacidade.
- Consent Mode v2 nasce negado e o banner libera por escolha; `csr_consent_update` é enviado.
- Os redirecionamentos antigos (`/ecoturismo/`, `/feriados/`, `/galeria/`, `/condicao-especial/`) funcionam.
- Pacotes com data de fim saem do ar sozinhos.

## 3. Site novo: ajustes

| Item | O que fazer | Situação |
|---|---|---|
| `/pacotes/day-use/` dava 404 (URL antiga que o GTM usava) | 301 para `/day-use/` | Feito (commit e9032ec) |
| `/favicon.ico` dava 404 | Arquivo na raiz | Feito |
| Outras URLs antigas do WordPress | Cruzar com o Search Console (páginas com cliques e impressões dos últimos 12 meses) e criar 301 | Pendente: preciso da lista |
| Sitemap inclui `/pacotes/consciencia-negra/` | Sai sozinho depois de 22/11 | Automático |
| Eventos do dataLayer com prefixos diferentes por página | Ver seção 5 | Decisão |
| Imagens sem texto alternativo (1 a 2 por página) | Conferir se são decorativas | Baixa prioridade |
| Fotos de baixa resolução e vídeo da home | Comprimir | Pendente (já conhecido) |
| Política de privacidade | Revisão jurídica | Pendente |
| Search Console | Verificar o domínio, enviar o sitemap, conferir cobertura em 48 h | Você |

## 4. GTM antigo: o que permanece, o que ajustar, o que sai

**Permanece (reaproveitar no novo)**
- GA4 `G-81T3FDT83W` e Google Ads `AW-11049940360` (conta 771-172-8329), com os rótulos de conversão existentes.
- Vinculador de conversões com os domínios `hbook.hsystem.com.br`, `cachoeiracassorova.com.br`, `cassorova.com.br` e `reservas.cassorova.com.br`.
- Tags de Compra do HBook e do Paytour (valor, id da transação, dados do usuário).
- Tags no acionador de inicialização para GA4, Ads e vinculador.
- Pixel `814372796152066` (Compra e Início de checkout nos sistemas de reserva).

**Ajustar**
- Consentimento em todas as tags: Meta exige `ad_storage`; Ads exige `ad_storage` e `ad_user_data`; GA4 exige `analytics_storage`.
- Gatilho "Page URL EcoParque" nunca dispara (condições com E). Trocar por caminho com RegEx `^/(day-use|ecoturismo)(/|$)`.
- Gatilho "Page URL Hotel" vai disparar no day use novo. Excluir `/day-use`.
- Pixel `814372796152066` sem PageView no site. Criar tag com PageView em todas as páginas e `Lead`/`Contact` nos cliques de WhatsApp (com `ad_storage`).
- Gatilho de WhatsApp (clique em wa.me): restringir a `wa.me/5514991068097`.
- Pixel do Parque `2364929483712116`: decidir se continua. Se sim, só com consentimento e só em `/day-use/`.

**Sai**
- Todas as tags e gatilhos do Microsoft Clarity (decisão de 19/11).
- Gatilhos do plugin de WhatsApp do WordPress ("Click to Chat"), do Chatwoot, de `api.whatsapp.com`, do número do parque (14 99195-1122) e dos ids `enviar-reserva-whatsapp` e `hbook-reservar`. Nenhum existe no site novo.
- Qualquer script do Cod3rocket.

## 5. Eventos do site novo e como ligar no GTM

O site envia dois grupos de eventos ao dataLayer:

- **Globais (cabeçalho, menu, barra do celular, rodapé, flutuante):** `cnv_cta`, com `cnv_cta` (nome do botão), `cnv_posicao` e `link_url`.
- **Por página:** prefixo da página + sufixo. Prefixos: `chm_` home, `cbg_` bangalôs, `clz_` lazer, `cgs_` gastronomia, `cex_` experiências, `cdu_` day use, `cpk_` pacotes e `cnv_` (reservas, cachoeiras, pacotes sazonais). Sufixos: `_cta_click`, `_faq_abrir`, `_busca_hospedagem`, `_galeria_abrir`, `_carrossel_usar`; também `clz_mapa_grupo` e `cex_reserva_experiencia`.
- **Consentimento:** `csr_consent_update`.

**Plano no GTM (sem mexer no site)**
- Um gatilho de evento personalizado com RegEx `_cta_click$|^cnv_cta$` para todos os cliques, uma tag de evento GA4 `cta_click`, com parâmetros lidos da camada: nome do botão (`*_cta`), posição e `link_url`.
- Um gatilho `_faq_abrir$` para `faq_abrir`, e `_busca_hospedagem$|^cnv_busca$` para `busca_hospedagem`.
- Conversões principais no GA4: `cta_click` com botão `reservar-hospedagem`, `comprar-day-use` ou `whatsapp`; `busca_hospedagem`.
- Google Ads: conversões de clique de WhatsApp e de reservar/comprar, mais as de Compra nos motores de reserva.

**Opção melhor, com pequena mudança no site (recomendo, depois do GTM no ar):** padronizar os eventos para nomes únicos (`cta_click`, `faq_abrir`, `busca_hospedagem`) e mandar a página como parâmetro (`pagina`). Fica um gatilho só por evento e relatórios mais limpos no GA4. Posso fazer esse ajuste no código quando você quiser.

## 6. Plano do contêiner novo

Variáveis: ID GA4, ID Ads, ID Pixel, variáveis de camada de dados (`cnv_cta`, `cnv_posicao`, `link_url` e as por prefixo), página (`Page Path`).
Tags: configuração GA4 (inicialização); vinculador de conversões; Pixel da Meta base com PageView (`ad_storage`); Pixel `Lead`/`Contact` no WhatsApp; eventos GA4 do item 5; conversões do Ads (WhatsApp, reservar, comprar); Compra do HBook e do Paytour (reaproveitar as atuais); remarketing do hotel e do day use (com as exclusões do item 4).
Consentimento: visão geral ativada e cada tag com a exigência correta.
Pastas: Site, Reservas HBook, Paytour, Google Ads, Meta.

## 7. Checklist de lançamento do rastreamento

1. Pausar o Clarity e ajustar consentimento do Meta no contêiner antigo.
2. `PUBLIC_GTM_ID=GTM-N5M2VBV` na Hostinger e refazer a implantação.
3. Conferir no modo de visualização do GTM: tags disparando no site, nada disparando antes da escolha de cookies.
4. Publicar o contêiner novo (nova versão).
5. Conferir na Visão de depuração do GA4 e na Tag Assistant: `cta_click`, vinculador entre `cassorova.com.br` e `hbook.hsystem.com.br`.
6. Fazer uma compra de teste no HBook e no Paytour e conferir GA4, Ads e Meta.
7. Após 48 horas, conferir conversões no Google Ads e no Gerenciador de Eventos da Meta.

## 8. O que preciso de você

1. Exportar de novo o contêiner antigo (GTM > Admin > Exportar contêiner > versão mais recente publicada) e anexar o arquivo aqui.
2. Confirmar se o HBook e o Paytour carregam o GTM-N5M2VBV (campo de Tag Manager no painel de cada um) e se o Pixel do Parque continua.
3. Lista das páginas mais acessadas do site antigo (Search Console ou GA4, últimos 12 meses).
4. Se aceita padronizar os nomes dos eventos (seção 5).
