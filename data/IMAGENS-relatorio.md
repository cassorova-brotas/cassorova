# Imagens do site Cassorova: levantamento e importação (18/11/2026)

Resultado: 182 imagens únicas citadas nas 16 páginas, no cabeçalho e no rodapé. Todas responderam 200 e foram baixadas (158 arquivos distintos, 53,5 MB, sem duplicados). Mais as 15 artes de compartilhamento (1200x630) em public/og.

Estrutura: public/images/AAAA/MM/arquivo (mesma estrutura do WordPress, trocando /wp-content/uploads por /images). O arquivo data/imagens-mapa-urls.json liga cada URL antiga (530, incluindo as versões -768x512 etc.) ao arquivo novo.

Para cada imagem baixei a maior versão disponível (primeiro o -scaled, depois o original, depois a maior derivada). O Astro gera os tamanhos menores no build a partir desses arquivos.

## Atenção
1. Vídeos (3 mp4, na home e no day use): cassorova-resort-e-ecoturismo-brotas-1.mp4 (6,4 MB), cassorova-piscina-borda-infinita-computador.mp4 (2,3 MB) e cassorova-piscina-borda-infinita-celular.mp4. Foram baixados; vale comprimir o primeiro.
2. Logo do cabeçalho: PNG de 323x67 px. Fica macio em telas retina. Ideal: SVG ou PNG com pelo menos 700 px de largura.
3. Selo Tripadvisor: 200x262 px, usado em 10 páginas. Ok no tamanho pequeno em que aparece.
4. Fotos com menos de 1200 px de largura (limite do que existe no site): cassorova-cassorovinha-64 (720x480, Cassorovinha), imagens .webp do day use (versões 640 e 1080), os bangalôs Aconchego e Romance (1080 px), Cassorova-239/270/30/48 (1080x720). Servem para cards, mas não para fotos de topo em tela cheia. Se houver originais maiores, subir no lugar.
5. mapa_site-2-scaled.png pesa 1,7 MB: converter para WebP.
6. O arquivo Ecoparque-Cassorova-64.jpg foi renomeado para cassorova-cassorovinha-64.jpg e o mapa foi atualizado.
7. Todos os caminhos de upload passam a apontar para /images. As páginas ainda citam https://cassorova.com.br/wp-content/uploads/...: a troca será feita no build das páginas em Astro.
