# Histórico de validação técnica anterior e regularização atual

## Atualização documental — 21/10/2026

As permissões específicas dos assets foram recebidas após o fechamento abaixo: [registro do titular](ASSET_PERMISSION_2026-10-21.md). O bloqueio por ausência de autorização descrito no relato anterior é **histórico**, não o estado documental atual. O novo gate e os testes deste lote constam do relatório de autorização; não tratar execuções antigas como novas. Nenhum arquivo de runtime, movimento ou contrato foi alterado para regularizar direitos. Correção textual de proveniência na página Referências registrada separadamente.

## Relato histórico preservado — antes da confirmação de origem e dos quatro pontos

# Regularização final — validação consolidada

21/10/2026. Candidato independente baseado em terra-experience-closing. Experiência V4/P1/P2/P3, laboratório Mineral Técnico, contratos e skills preservados. Sem commit, merge, push, deploy, nova recipe, dependência, versão ou alteração de Release/tag.

## Parecer

**BLOQUEADO PARA PUBLICAÇÃO por direitos não confirmados dos dois assets.** O usuário esclareceu o histórico de estudos e uso, expressamente sem conceder autorização pública. O gate real continua retornando 2. Não confundir resultado técnico aprovado, caso positivo sintético de teste e autorização real. Ver [proveniência](ASSET_PROVENANCE_REVIEW.md), [registro](ASSET_RIGHTS.json), [estado público](PUBLICATION_STATUS.md) e [integração](CLOSING_INTEGRATION.md).

## Testes novos deste macrolote

Windows, Node 24.20.0, pnpm 11.24.0, Chromium. Instalação nova offline congelada por store existente, sem simular download limpo, hardware móvel ou runner Linux. Logs datados do novo pacote de regularização, não logs antigos renomeados.

| Verificação                                  | Resultado observado                                                                                                                      |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Formatação, ESLint, TypeScript               | Passaram                                                                                                                                 |
| Vitest                                       | 43/43, 8 arquivos                                                                                                                        |
| Node: gate de publicação                     | 11/11, nenhum skip                                                                                                                       |
| Playwright base local                        | 29/29                                                                                                                                    |
| Playwright base Pages                        | 29/29                                                                                                                                    |
| Builds e auditores                           | Ambas bases; mesmo fluxo test:e2e do workflow                                                                                            |
| Skills, fronteiras e consumidor independente | Passaram; APIs/subpaths existentes preservados                                                                                           |
| Axe e responsividade                         | 12 casos, três páginas × 1440/1024/390/320 px; sem violações, overflow ou erros detectados                                               |
| Dobra mineral                                | 13 casos: ida/volta, foco, scroll rápido, resize, âncoras, fallbacks e redução ao vivo                                                   |
| Narrativa e laboratório                      | 5 percursos gravados; teclado, foco, cópia real, replay rápido, interrupções, reset e redução; 47 ocorrências de links internos HTTP 200 |
| Interrupções dos acentos                     | 3 casos adicionais, sem animações residuais                                                                                              |
| Zoom nativo 200%                             | 3 páginas, API chrome.tabs.setZoom, janela 1440 × 1000 mantida; CSS 1424 × 905 → 712 × 452, DPR 1 → 2; axe e interações do lab           |
| Host estático sem fallback SPA               | Três entradas físicas, navegação direta e refresh 200                                                                                    |
| Artefato                                     | 17 arquivos permitidos; legais separados, três rotas e recursos válidos; pesos/hashes no pacote                                          |
| Negativos do auditor                         | 10/10 rejeitados; fingerprint restaurado                                                                                                 |
| Gate real                                    | Bloqueado, exit 2, por direitos/evidências de logo e material                                                                            |
| Preservação visual                           | 12 páginas completas com todos pixels RGBA iguais ao fechamento anterior, em estado reduzido/estático                                    |
| Vídeos                                       | 9 WebM reais, sem edição; reprodução, seek, quadros e igualdade de hashes com gravações brutas conferidos                                |

O teste de pixels também compara PNG e WebP lossless nas duas bases. Logo e PNG aprovado mantêm bytes. WebP 1.421.410 bytes, economia de 30,28%; um único material compartilhado no build. Não representa benchmark de rede móvel, LCP ou garantia de 60 fps.

## Correções deste macrolote

Reprodução RED de três falhas: aviso separado vazio/diretório aceito; ausência simultânea de WebP/registro passava; diretório no lugar de imagem lançava EISDIR. A causa era uso de existsSync e exigência condicional do próprio derivado. O gate passou a exigir arquivo regular não vazio, caminhos sem symlinks/junctions, aviso com conteúdo, derivação obrigatória com hash e registro coerente. O teste de evidência por junction fora de docs confirma proteção existente. Os sete casos anteriores foram preservados; a fixture positiva agora inclui o WebP obrigatório do build real. Não houve bypass ou licença criada para produzir verde.

O relato de proveniência foi regularizado sem afirmar titularidade do usuário. Documentação diferencia estudos confirmados de origem final desconhecida e termos oficiais condicionais. Investigação não preenche o campo de comprovação de permissão.

## Preservação e estado remoto

Snapshots novos com hashes/refs/status conferem fechamento anterior, base aprovada, P2.1, checkouts público/protótipo/Scroll Reveal e dois ZIPs anteriores. Candidato novo sem .git. Branch pública local limpa, main e origin/main iguais à main remota baceffee40bfaf9ed1461af92964e2d2a840a4ce, verificada por API somente leitura; Pages atual HTTPS 200. Tag v0.1.0 em 63ea755982c9bc31da9dd21b0c8206b20b07049a. Nenhuma operação Git de escrita ou publicação foi executada. Reconfirmar a base após autorização futura.

## Limitações e próxima decisão

Chromium/Windows, mobile emulado, zoom nativo por API em janela headless; sem ensaio manual do menu, Safari/Firefox, leitores de tela ou dispositivos físicos. Axe não certifica acessibilidade completa. Triagem de padrões não garante ausência absoluta de segredos. Workflow candidato não executado remotamente; smoke HTTPS do novo conjunto depende da publicação futura.

A2/A3 permanecem backlog. Rótulos locais continuam verdadeiros para a prévia: sua apresentação pública exige somente atualização operacional autorizada junto à integração, com conferência dirigida de títulos/header em 320 px, sem redesign. A origem final, direitos e autorizações dos dois assets continuam pendentes. Não repetir a solicitação sobre estudos e percurso de uso já esclarecidos.

O novo manifesto substitui o de 60 arquivos e deve ser regenerado após qualquer modificação. O roteiro cobre reconferência, branch limpa, aplicação por hashes, diff, testes, commit autorizado, rebuild com o novo SHA, fast-forward, push, Actions, smoke e rollback por revert normal. Nenhuma dessas operações futuras foi executada.
