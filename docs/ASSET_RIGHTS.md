# Assets — proveniência, distribuição e desempenho

## Estado de direitos

**Regularizado por declaração expressa do titular em 21/10/2026**, para os usos específicos do Terra Motion Skills: repositório público e Pages, mais conversão WebP do fundo preservando aparência. Ambos assets permanecem fora da MIT, sem licença geral de reutilização por terceiros. Titular informado: Joaquim Freitas; plataforma/origem declaradas: geração solicitada no ChatGPT / OpenAI. Evidência: [ASSET_PERMISSION_2026-10-21.md](ASSET_PERMISSION_2026-10-21.md).

Limitações: cadeia final do PNG transparente da logo/remoção de fundo, plano/conta e datas exatas não certificados; sem prova independente de exclusividade ou ausência de direitos de terceiros. Termos oficiais e histórico: [ASSET_PROVENANCE_REVIEW.md](ASSET_PROVENANCE_REVIEW.md). Não constituem bloqueio documental restante segundo o gate atual; permanecem limites expressos da declaração, sem garantia jurídica.

## Otimização sem mudança perceptível

Ensaio local por Canvas/Chromium, sem dependência nova:

| Arquivo               |     Bytes | Resultado                                                                            |
| --------------------- | --------: | ------------------------------------------------------------------------------------ |
| PNG original          | 2.038.789 | Preservado byte a byte nos fontes                                                    |
| PNG reencodado        | 2.480.430 | Pixels iguais, mas maior; descartado do app                                          |
| WebP qualidade máxima | 1.421.410 | VP8L lossless, ICCP; todos pixels RGBA decodificados iguais no Chromium; selecionado |
| WebP 0,95             |   139.326 | Com perdas, RMSE≈1,473; estudo somente, não integrado                                |
| JPEG0,95              |   256.490 | Com perdas, RMSE≈1,488; estudo somente, não integrado                                |
| Logo original         |    25.894 | Preservada, sem conversão                                                            |

Economia de 617.379 bytes/30,28% no material do build. A fonte PNG continua como recuperação; somente um WebP entra no artefato. Comparação exata de todos os pixels, dimensões e extensão do recurso integra o E2E nas duas bases. Isso comprova o decodificador testado, não certifica todos navegadores. Não introduzimos candidatos com perdas ou substituição da identidade aprovada. Evidências/candidatos não integram o artefato público.

## Carregamento, cache e responsividade

Vite referencia um único WebP com nome por hash no JS/CSS; as superfícies reutilizam a mesma URL, sem duplicação de textura por seção. As três rotas usam a mesma entrada; enquadramentos/máscaras CSS adaptam-se aos breakpoints aprovados. Logo permanece um PNG estável e proporcional. Não foram adicionados efeitos, preload, lazy loading ou versões de resolução diferentes. O material do hero continua no carregamento inicial; otimização reduz bytes sem prometer menor LCP em rede real.

O estudo de recursos registra primeira carga e reload do preview local. O HTTPS público v0.1 respondeu com Cache-Control:max-age=600 e ETag. Preview não simula CDN/cold network; arquivo com hash evita reutilização incorreta em novas versões, mas não autoriza presumir cache imutável em todos recursos. Logo de caminho estável pode exigir revalidação/cache expiry quando alterada futuramente. Não foi alterada nesta etapa.

Limitações: sem ensaio em rede móvel/hardware físico, Safari/Firefox ou medição de LCP/CWV em produção. Dados não são promessa de 60fps. Distribuição específica autorizada conforme o registro do titular; a otimização não cria autorização geral de reutilização.

## Conferência do arquivo fornecido

A logo atual fornecida coincide byte a byte com a base (SHA 5426d5e0…). O material da base tem SHA e261a305…/2.038.789 bytes; o arquivo atual05_background_login_aprovado.png tem SHA f452c81c…/1.728.410 bytes. São codificações PNG distintas de 1672 × 941, mas a comparação integral retornou pixels RGBA idênticos. Portanto a origem visual corresponde à referência; não afirmar que a base é cópia binária do arquivo atual. Original aprovado e arquivo externo não foram alterados. A comparação de pixels não comprova autoria/licença; as permissões específicas agora se baseiam na declaração expressa de 21/10/2026, com as limitações registradas.

Registrar evidência pública saneada (titular, termos e referência verificável da autorização). Não versionar contratos privados, credenciais ou dados pessoais desnecessários; documentos comprobatórios privados podem permanecer fora do repositório. O gate exige o registro revisável, mas não substitui conferência humana da autorização.
