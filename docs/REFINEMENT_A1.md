> Edição pública saneada do registro A1. Identificadores privados foram retirados; imagens e resultados históricos foram preservados.

# Refinamento A1 — legibilidade da v0.1

## Decisão e escopo

A v0.1 foi aceita pelo titular como marco local. O [relatório independente](reviews/2026-10-19-independent-review-v0.1.md) foi confrontado com os arquivos da base `versão local aceita`; este lote atende somente A1. O relatório externo está representado por uma síntese editorial pública; o original integral permanece em arquivo privado. Não é certificação de acessibilidade nem reprodução externa da suíte.

Único arquivo de produção alterado: `apps/showcase/src/app/app.css`. Não há alteração de componentes React, hooks, APIs, estados, tempos/easing, receitas, tokens, skills, dependências, lockfile ou licença. Os quatro testes novos, registros e imagens complementam o lote. A2/A3 continuam no backlog; A4 continua pendente antes de publicação.

## Ajustes executados

- Código: 10 → **14 px** (`0.875rem`), entrelinha 1,6 e padding de 16–20 px. Limite vertical aumentado para 28 rem no desktop e 22 rem nas composições em coluna; scroll próprio e indentação preservados.
- Rótulos, metadados, badges, estados e rodapé: **12 px** (`0.75rem`). Navegação, controles, descrições e notas principais: **14 px**. Títulos e identidade mantidos.
- Copiar/replay: fonte de 14 px e altura mínima de **40 px**, **44 px até 760 px**. Botões podem ocupar linhas separadas, sem encurtar seus nomes.
- Barras e tags quebram linha; topbar cresce conforme o conteúdo. Resumo com um item por linha até 480 px. Sidebar pode ter scroll próprio em janelas baixas.
- Letter spacing reduzido nos rótulos antes excessivamente espaçados. As sobrescritas mobile deixam de reduzir textos para 7–10 px. Não houve fonte nova, syntax highlighting, nova receita ou funcionalidade.

## Comparações reais

Mesma versão de Chromium, locale pt-BR, escala 1, preferência sem redução, estado inicial com Accordion aberto. Antes capturado com CSS da base, código a 10 px; depois com CSS refinado, código a 14 px. Cada fase possui primeiro viewport, página completa e recorte do primeiro exemplo de código. Metadados registram hashes do build, dimensões, medidas e erros de runtime; não houve console.error/pageerror nas sessões de captura.

| Viewport    | Página antes                                     | Página depois                                   | Código antes                            | Código depois                          |
| ----------- | ------------------------------------------------ | ----------------------------------------------- | --------------------------------------- | -------------------------------------- |
| 1440 × 1000 | [PNG](evidence/a1/before/showcase-1440-full.png) | [PNG](evidence/a1/after/showcase-1440-full.png) | [PNG](evidence/a1/before/code-1440.png) | [PNG](evidence/a1/after/code-1440.png) |
| 1024 × 900  | [PNG](evidence/a1/before/showcase-1024-full.png) | [PNG](evidence/a1/after/showcase-1024-full.png) | [PNG](evidence/a1/before/code-1024.png) | [PNG](evidence/a1/after/code-1024.png) |
| 390 × 844   | [PNG](evidence/a1/before/showcase-390-full.png)  | [PNG](evidence/a1/after/showcase-390-full.png)  | [PNG](evidence/a1/before/code-390.png)  | [PNG](evidence/a1/after/code-390.png)  |
| 320 × 900   | [PNG](evidence/a1/before/showcase-320-full.png)  | [PNG](evidence/a1/after/showcase-320-full.png)  | [PNG](evidence/a1/before/code-320.png)  | [PNG](evidence/a1/after/code-320.png)  |

[Metadados antes](evidence/a1/before/capture.json) · [Metadados depois](evidence/a1/after/capture.json)

Inspeção visual: hierarquia e cores preservadas; código e notas maiores; cabeçalhos e controles acomodados em linhas nos 320 px; nenhuma perda horizontal da página. O documento ficou mais alto, conforme esperado. Linhas longas de código continuam em scroll interno, verificado por foco/ArrowRight, sem quebra artificial da indentação. Recortes de código mostram a posição inicial do scroll, não o desaparecimento das partes à direita.

## Zoom nativo de 200%

Executado em Chromium com janela visível de 1440 × 1000, por `chrome.tabs.setZoom(tabId, 2)` em extensão de teste local temporária, fora do projeto; retorno de `chrome.tabs.getZoom` confirmou 2. O zoom foi restaurado para 100% e a janela/perfil temporário encerrados ao terminar.

| Medida                                   | Antes       | A 200%      |
| ---------------------------------------- | ----------- | ----------- |
| Janela externa                           | 1440 × 1000 | 1440 × 1000 |
| Viewport CSS                             | 1424 × 905  | 712 × 452   |
| DPR observado                            | 1           | 2           |
| Escala de pinch (`visualViewport.scale`) | 1           | 1           |
| Largura do documento                     | 1409        | 704         |

Isso é zoom do navegador, sem CSS zoom, alteração manual de viewport, override de DPR ou `Emulation.setPageScaleFactor`. Verificados botão por Enter/Espaço, tabulação que exclui conteúdo inerte, replay, cópia exata e movimento reduzido ao vivo. Uma auditoria axe adicional, Accordion aberto e movimento reduzido ativo, retornou zero violações.

[Primeiro viewport](evidence/a1/zoom/native-200-top.png) · [Código e cópia](evidence/a1/zoom/native-200-code.png) · [Accordion](evidence/a1/zoom/native-200-accordion.png) · [Registro técnico](evidence/a1/zoom/verification.json)

Limitação da ferramenta identificada e resolvida na captura: a API padrão de screenshots do Playwright recortava a área errada com zoom nativo. As imagens finais foram capturadas por CDP `Page.captureScreenshot`, sem clip e sem mudar a aplicação. Não há captura completa da página em zoom; há três viewports reais em posições relevantes.

## Validações reexecutadas

| Comando/verificação                      | Resultado                                           |
| ---------------------------------------- | --------------------------------------------------- |
| `pnpm format:check`                      | passou; nova conferência após concluir documentação |
| `pnpm lint`                              | passou                                              |
| `pnpm typecheck`                         | passou, raiz e workspaces                           |
| `pnpm build`                             | passou, pacotes e showcase                          |
| `pnpm test`                              | **22 passaram**, cinco arquivos                     |
| `pnpm validate:skills`                   | duas skills passaram                                |
| `pnpm check:boundaries`                  | passou                                              |
| `pnpm check:consumer`                    | passou, consumidor independente e exemplos strict   |
| `pnpm test:e2e`                          | **17 passaram**, incluindo quatro regressões A1     |
| axe nas quatro larguras, aberto/fechado  | **oito auditorias, zero violações retornadas**      |
| axe em zoom nativo 200%, aberto/reduzido | **uma auditoria, zero violações retornadas**        |

[Comandos, horários e códigos de saída](evidence/a1/checks.json). Logs completos relativos ao registro estão em `evidence/a1/checks/`. O teste novo foi observado falhando nas quatro larguras antes do CSS, recebendo 10 px em vez dos 14 px esperados, e depois passou. Os testes existentes não foram relaxados ou removidos.

Os nove retornos sem violações axe não são certificação. Permanecem sem nova execução em Firefox/WebKit/Safari, leitores de tela ou dispositivos físicos. O zoom cobre uma janela Chromium; não é matriz completa. A3 não foi investigado nem corrigido. Os testes integrais já existentes continuam responsáveis pelas regressões de motions e contratos, que não foram alterados.

## Encerramento local

O lote A1 está implementado e validado localmente, disponível para revisão visual do titular. Não houve push, deploy, publicação, repositório remoto ou mudança de licença. As capturas históricas foram preservadas; pacotes e histórico Git privados não integram esta edição. A decisão de publicação continua separada deste refinamento.
