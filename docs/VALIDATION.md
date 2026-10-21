# Validação — estado atual e registros históricos

Fechamento atual do candidato integrado: [CLOSING_VALIDATION.md](CLOSING_VALIDATION.md). Estado público confirmado: [PUBLICATION_STATUS.md](PUBLICATION_STATUS.md). O deploy v0.1 já ocorreu; abaixo estão registros históricos preservados, inclusive pendências anteriores ao primeiro deploy. Eles não representam a situação atual.

## Suporte ao GitHub Pages — 20/10/2026

Implementação local, sem push do workflow, alteração remota de configuração ou deploy do Pages. Bases verificadas: `/` e `/terra-motion-skills/`. Recipes, skills, contrato, estilos e licença preservados. A tag e a Release v0.1.0 existentes não foram alteradas. Na conferência final, Pages já constava configurado para GitHub Actions com HTTPS, mas sem execuções de workflow; essa configuração não foi realizada nesta etapa.

Passaram: instalação offline com lockfile congelado, formatação, lint, TypeScript, Vitest (**22 testes em cinco arquivos**), duas skills, fronteiras e consumidor independente. Build de produção e **18 Playwright em cada base**, incluindo **oito auditorias axe por variante**, passaram. Os 17 cenários anteriores foram preservados e reforçados; foi acrescentado um teste de JS/CSS/avisos legais. Navegação, refresh, seis referências com conteúdo conferido (sem aceitar fallback HTML), teclado, foco, replay/reset/interrupção, clipboard real/fallback, redução inicial/dinâmica, touch emulado e quatro larguras estão cobertos.

O artefato Pages tem **11 arquivos**, seis referências e LICENSE/THIRD_PARTY_NOTICES.md integrais; somente o conteúdo de `apps/showcase/dist` será publicado. O verificador de artefato passou para as duas bases. Cinco sondagens negativas rejeitaram arquivo .env, licença alterada, Markdown com link relativo não resolvido, padrão sintético de credencial e base divergente; o build ignorado pelo Git foi restaurado e reconferido. A primeira execução do novo verificador, antes da implementação, detectou LICENSE ausente no build anterior.

Workflow analisado estaticamente: YAML, sete Actions fixadas por SHA e seus inputs oficiais, permissões, ambiente, dependência entre jobs, gatilhos e concorrência conferidos. Isso não equivale a execução no runner Linux ou no serviço Pages. Os logs saneados e resultados estão em [evidence/pages/checks.json](evidence/pages/checks.json), [auditoria do workflow](evidence/pages/workflow-check.json) e [sondagens negativas](evidence/pages/negative-probes.json).

Capturas reais com prefixo Pages em [1440](evidence/pages/pages-1440.png), [1024](evidence/pages/pages-1024.png), [390](evidence/pages/pages-390.png) e [320 px](evidence/pages/pages-320.png): sem overflow, oito links de referência com prefixo correto; [metadados](evidence/pages/capture.json). Usado movimento reduzido somente para estabilidade das capturas; E2E cobre comportamento normal e reduzido separadamente.

Ambiente: Windows, Node 24.20.0, pnpm 11.24.0 e Chromium já disponível. Cache/store local usado na instalação; não foi simulado runner novo ou execução Linux. Smoke HTTPS, permissão de clipboard no site público e disponibilidade real aguardam o primeiro deploy autorizado. Outros navegadores, leitores de tela, aparelhos físicos e novo zoom nativo continuam pendentes; A2/A3 permanecem no backlog. Triagem de padrões de credenciais não é garantia exaustiva de segurança. Operação e rollback: [HOSTING.md](HOSTING.md).

> **Registro histórico após o primeiro push — 20/10/2026:** o código-fonte ficou público no [GitHub](https://github.com/joaquimftt-web/terra-motion-skills). Naquele momento, showcase, tag, Release e pacotes npm ainda não estavam publicados; posteriormente a tag e a Release v0.1.0 foram publicadas. Os registros abaixo descrevem etapas históricas anteriores ao primeiro push, inclusive menções a candidato, ausência de remoto e autorização pendente. Seus resultados e limitações foram preservados.

## Identidade Terra Motion Skills — 19/10/2026

Atualização nominal autorizada: nome, apresentação, título HTML, nome acessível, rodapé, READMEs e descrições das skills. Os identificadores técnicos foram inventariados antes das edições e preservados; veja [IDENTITY.md](IDENTITY.md). Especificação, plano, registros e capturas anteriores mantêm o nome histórico. A licença MIT e o copyright de Joaquim Freitas permanecem iguais.

Reexecutados: instalação offline com lockfile congelado, formatação, lint, TypeScript, build, **22 Vitest em cinco arquivos**, validação das duas skills, fronteiras, consumidor independente, quatro exemplos TSX dos READMEs em strict e **17 Playwright com oito auditorias axe sem violações retornadas**. As verificações existentes receberam asserções para a nova marca acessível e o título HTML. A primeira formatação apontou o trecho novo de `legibility.spec.ts`; após formatação, a conferência passou. Não foram removidos ou relaxados testes.

Capturas reais do preview de produção: [1440](evidence/identity/terra-1440.png), [1024](evidence/identity/terra-1024.png), [390](evidence/identity/terra-390.png) e [320 px](evidence/identity/terra-320.png). Título e marca foram conferidos; sem overflow da página ou do bloco da marca nas quatro larguras. CSS e lógica funcional preservados. [Metadados](evidence/identity/capture.json), [comandos](evidence/identity/checks.json) e [auditoria](evidence/identity/snapshot-checks.json).

As capturas usaram movimento reduzido para estabilidade; a suíte testou separadamente comportamento normal e reduzido. Não foi repetido zoom nativo, nem validação com outros navegadores, leitores de tela ou dispositivos físicos. Ambiente Windows com pnpm store e Chromium disponíveis. A2/A3 continuam no backlog. Sem remoto, push, deploy ou mudança de licença; o histórico privado original permanece separado.

## Finalização da MIT — 19/10/2026

Licença MIT aprovada para o código original, Copyright (c) 2026 Joaquim Freitas. O texto integral está em [LICENSE](../LICENSE); os quatro manifests declaram MIT e permanecem privados. Os textos de licenças de terceiros foram conferidos e preservados. Somente o texto editorial de licença do App foi atualizado, sem alterar aparência, comportamento, contratos ou dependências.

Reexecutados após a atualização: instalação offline com lockfile congelado, formatação, lint, TypeScript, build, **22 Vitest em cinco arquivos**, validação das duas skills, fronteiras, consumidor independente e **17 Playwright com oito auditorias axe sem violações retornadas**. Os quatro exemplos TSX dos READMEs compilaram em strict. Comandos e logs saneados estão em [evidence/licensing/checks.json](evidence/licensing/checks.json); [auditoria do snapshot](evidence/licensing/snapshot-checks.json) registra as conferências de privacidade e preservação.

Foram preservados 36 arquivos protegidos de código/skills/testes/lockfile e 32 PNGs existentes, além dos arquivos e referências Git do original privado. A captura A1 permanece histórica; não houve nova captura nem novo teste de zoom nativo. Validação em Windows com store pnpm e Chromium disponíveis, sem simular uma máquina nova sem cache. Outros navegadores, leitores de tela e dispositivos físicos continuam como limitações. Triagem de credenciais por padrões não é garantia exaustiva de segurança. A2/A3 permanecem no backlog.

O snapshot público mantém um único commit raiz local com a identidade pública autorizada. Nenhum remoto, push, deploy ou distribuição de pacotes foi realizado. A publicação aguarda autorização final.

## Cópia pública candidata — revalidação de preparação

Esta edição é um snapshot independente, sem importar o histórico Git privado. O código funcional das receitas/tokens, as skills, os testes e o CSS A1 foram preservados. No App, somente as mensagens editoriais de nome/licença foram atualizadas. READMEs e documentação foram preparados para revisão pública; MIT aprovada para o código original, Copyright (c) 2026 Joaquim Freitas, com LICENSE integral na raiz.

Reexecutados nesta cópia: instalação com lockfile congelado e store offline disponível, formatação, lint, TypeScript, build, Vitest (**22 testes**), validação das duas skills, fronteiras, consumidor independente e Playwright (**17 testes**, incluindo **oito auditorias axe sem violações retornadas**). Os quatro exemplos TSX dos READMEs também foram compilados em strict contra os outputs públicos copiados. Os registros da preparação anterior (antes da aprovação MIT) ficam em `evidence/publication/`. Uma primeira conferência de formatação encontrou sete tsconfigs reserializados pela exportação; os arquivos originais foram restaurados, sem mudar testes ou parâmetros de compilação.

Não foi repetido zoom nativo de 200% nesta preparação; a evidência A1 abaixo é histórica. A instalação utilizou o store pnpm e o Chromium previamente disponíveis na máquina Windows, sem copiar node_modules da base. Não é uma máquina nova sem cache ou matriz de sistemas/navegadores. Leitores de tela e aparelhos físicos continuam sem nova execução. Dados pessoais foram retirados dos logs apresentados, preservando os resultados.

A identidade pública Git foi confirmada pelo titular e configurada apenas nesta cópia para um primeiro commit raiz; `docs/PUBLICATION_STATUS.md` registra as pendências. Licença MIT aprovada pelo titular; nenhum remoto, push ou deploy foi realizado.

## Registros históricos da v0.1 e do A1

> **Atualização A1:** refinamento de legibilidade concluído e validado em 19/10/2026. Resultado atual: **22 Vitest, 17 Playwright e nove auditorias axe sem violações retornadas**, incluindo uma no zoom nativo de 200%. Veja [REFINEMENT_A1.md](REFINEMENT_A1.md), com comparações, comandos e limites. O registro da entrega inicial abaixo permanece como histórico, com os 13 testes Playwright daquela etapa.

Executada em 19/10/2026 no Windows, Node **24.20.0**, pnpm **11.24.0**, React/React DOM **19.3.1**, Motion **14.3.0**, TypeScript **5.9.3**, Vitest **5.0.5**, Playwright **1.64.1**. Browser executado: **Chromium 156.0.8078.4 headless**. Os resultados abaixo pertencem ao Motion Skills Lab, sem reaproveitar relatórios do colaborador.

## Resultados executados

O smoke de `pnpm dev` também passou: pré-build dos pacotes, Vite em 5173, renderização React e ativação real em Chromium. O servidor de desenvolvimento foi encerrado após o teste; o preview local de revisão usa a porta 4174.

| Comando                          | Resultado                                                                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile` | passou, lockfile preservado; sem novos pacotes necessários                                                                  |
| `pnpm typecheck`                 | passou: ferramentas/E2E e três workspaces, TypeScript strict                                                                |
| `pnpm build`                     | passou: tokens, receitas com declarations/CSS e showcase de produção                                                        |
| `pnpm lint`                      | passou, sem erros                                                                                                           |
| `pnpm format:check`              | passou após formatar também o metadado das capturas                                                                         |
| `pnpm test`                      | **22 testes passaram em 5 arquivos**, zero falhas                                                                           |
| `pnpm validate:skills`           | duas skills passaram no esquema YAML mínimo, seções operacionais e links locais                                             |
| `pnpm check:boundaries`          | passou: dependências direcionais e quatro subpaths explícitos de receitas                                                   |
| `pnpm check:consumer`            | passou: consumidor contendo apenas manifests/dist, peers locais, ESM/SSR/CSS; exemplos das duas skills compilados em strict |
| `pnpm test:e2e`                  | **13 testes passaram**, zero falhas, em preview de produção novo na porta 4173                                              |

O Vitest cobre tokens, props/ref do botão, Enter/Espaço, disabled, controle de estado, IDs, inert/ARIA, reversões/StrictMode/unmount, assinatura de preferência e cleanup, duração inválida, navegação/controles e clipboard (sucesso/falha). O ambiente DOM não comprova layout; somente o teste de tokens usa ambiente Node para ler a folha CSS.

O Playwright cobre navegação e seis referências locais com HTTP 200; foco, Tab/Shift+Tab, Enter/Espaço, press e disabled; painel fechado fora da tabulação; restauração de foco em fechamento controlado; duração e snippet; reversão/replay/remount com cancelamento; preferência inicial e mudança de OS em tempo real; precedência da redução adicional; clipboard nativo e rejeição simulada; toque emulado. Cada teste verifica ausência de console.error e pageerror.

## Acessibilidade e responsividade

Quatro larguras executadas: **1440, 1024, 390 e 320 px**, altura 900 px. Sem overflow horizontal da página. Blocos de código têm scroll próprio.

O axe 4.14 executou a página inteira com tags WCAG 2 A/AA, 2.1 AA e 2.2 AA, em cada largura, nos estados aberto e fechado: **oito auditorias, zero violações retornadas**, sem exclusões de regras. O teclado e o foco foram verificados separadamente por interação automatizada no browser. O sistema reduzido zera a duração e não pode ser negado pelo controle da demo.

## Evidências visuais e de execução

- [Desktop completo](evidence/showcase-desktop.png) e [primeiro viewport](evidence/showcase-desktop-top.png), 1440 × 1000.
- [Mobile completo](evidence/showcase-mobile.png) e [primeiro viewport](evidence/showcase-mobile-top.png), 390 × 844.
- [Accordion e controles](evidence/accordion-desktop.png), captura real do preview.
- [Metadados das capturas e hashes do build](evidence/capture.json).
- [Status bruto da última execução Playwright](evidence/playwright-last-run.json).

As capturas foram inspecionadas visualmente: hierarquia, espaçamento, fonte de sistema, código selecionável, controles e empilhamento mobile. São capturas do build funcional, sem mockup gerado. O relatório HTML detalhado é gerado em playwright-report/; para abrir localmente: `pnpm exec playwright show-report`. Traces de falhas são mantidos em test-results/ durante uma execução com falhas, sem serem tratados como resultados atuais após a correção.

## Falhas encontradas e corrigidas

1. Suíte agregada de tokens em DOM: corrigida pela atribuição explícita de ambiente Node, sem remover as verificações.
2. Metadados Node e formatação: faixa alinhada aos engines e arquivos normalizados.
3. Preferência de OS desatualizada no hook instalado de Motion: reproduzida em Chromium e teste de componente; corrigida com assinatura privada e cleanup.
4. Contraste durante fade de conteúdo: corrigido removendo o fade e mantendo altura animada; auditorias retornaram zero violações.
5. Área do switch coberta pela decoração: input recebeu área de clique correspondente ao controle visível; o teste usa o input real, sem force.
6. Diferença LF/CRLF na leitura do clipboard Windows: comparação normaliza apenas fins de linha; conteúdo e chamada writeText continuam exatos.

## Bundle e limites de performance

Build Vite executado: HTML **0,67 kB / 0,42 kB gzip**, CSS **15,17 kB / 4,08 kB gzip**, JavaScript **369,75 kB / 117,73 kB gzip** (valores reportados pelo Vite, arredondados). Inclui React e Motion. Não foram medidos FPS, tempo de GPU, Lighthouse, long tasks, CLS em dispositivo físico ou desempenho de produção remota. Altura tem custo de layout; não há loop contínuo decorativo. Orçamentos futuros exigem cenário/dispositivo concretos.

## Estado por lote e pendências reais

| Lote                  | Estado e evidência                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------- |
| 0 — fundação          | workspace, versão/lockfile, Node e tooling estabilizados                                 |
| 1 — tokens/fronteiras | testes, builds independentes e consumidor de outputs passaram                            |
| 2 — Button            | props/ref, teclado, disabled, CSS e toque emulado passaram                               |
| 3 — Accordion         | contrato controlado, acessibilidade, reversões, preferência e lifecycle passaram         |
| 4 — skills/fontes     | duas skills operacionais, exemplos compilados, proveniência e inventário registrados     |
| 5 — showcase          | navegação, demos e controles reais, assets de referência locais e capturas inspecionadas |
| 6 — fechamento        | validações acima executadas; versão local pronta para revisão do usuário                 |

Pendências antes de publicação: **revisão final do usuário**, decisão de nome/licença pelo titular, revisão das obrigações de distribuição/notices e autorização explícita para destino público. Não há remoto, push, hospedagem ou distribuição de pacote nesta entrega. Branch e worktree locais são preservados para revisão.

Não executados: Firefox/WebKit/Safari, dispositivos físicos, leitor de tela e revisão humana completa de acessibilidade. Outras versões de React/Motion/Node não constituem uma matriz validada. As skills tiveram validação estrutural, links e exemplos strict, sem avaliação independente de eficácia de agentes. A revisão técnica desta entrega foi realizada inline; revisão independente permanece recomendada antes de publicação. Nenhuma dessas limitações é apresentada como teste aprovado.

Drawer, GSAP, Lenis e WebGL permanecem fora da v0.1, sem módulos vazios. projetos privados externos e arquivos originais do colaborador não foram modificados.

## Revalidação após refinamento A1 — 19/10/2026

Somente o CSS do showcase mudou no código de produção. Receitas, tokens, hooks, componentes React, skills, manifests e lockfile permanecem iguais à base `versão local aceita`. Foram adicionados quatro testes Playwright de regressão tipográfica, evidências novas, a síntese pública do relatório externo e registros de validação. Nenhum push, deploy, publicação ou escolha de licença foi realizado.

Todos os comandos seguintes foram reexecutados com saída zero: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test` (**22/22**), `pnpm validate:skills`, `pnpm check:boundaries`, `pnpm check:consumer`, `pnpm test:e2e` (**17/17**). [Registro de execução](evidence/a1/checks.json) e logs individuais estão em `evidence/a1/checks/`. A formatação foi conferida novamente após finalizar a documentação. Os avisos NO_COLOR/FORCE_COLOR emitidos pelas ferramentas não são erros da aplicação.

Os quatro testes novos falharam antes da alteração pelo resultado esperado (código com 10 px, em vez de 14 px) e passaram após o CSS novo. Verificam fonte do código, espaço em branco/indentação, foco e scroll horizontal por teclado quando necessário, piso de 12 px nos seletores informativos auditados, tamanho dos botões e ausência de overflow horizontal da página/barras em 1440, 1024, 390 e 320 px. Não são um teste universal de toda possível quebra ou clipping; capturas também foram inspecionadas visualmente.

As oito auditorias axe anteriores foram reexecutadas nas quatro larguras, Accordion aberto/fechado, sem exclusões de regras e com zero violações retornadas. Os testes existentes passaram para teclado/foco, cópia exata/fallback, replay/reinício/reversões e movimento reduzido inicial e ao vivo. O A3 não foi alterado e o caso específico de mudança durante o timeout do replay não passa a ser alegado como validado por esses testes.

Zoom **nativo por aba de 200%** foi executado em Chromium em janela visível via `chrome.tabs.setZoom`, confirmado por `chrome.tabs.getZoom = 2`: a janela permaneceu 1440 × 1000, o viewport passou de 1424 × 905 para 712 × 452 CSS px, o DPR de 1 para 2 e `visualViewport.scale` permaneceu 1. Não foi usado CSS zoom, override de deviceScaleFactor, redução manual de viewport ou pinch via Emulation. Sem overflow horizontal. Foram revalidados Enter/Espaço, tabulação do painel fechado, cópia exata, replay e preferência reduzida ao vivo, além de uma auditoria axe no estado aberto/reduzido com zero violações. [Metadados](evidence/a1/zoom/verification.json) e [captura de código a 200%](evidence/a1/zoom/native-200-code.png). Capturas finais usam CDP sem clip, pois a captura padrão do Playwright recortava incorretamente a imagem no zoom nativo; não houve alteração da aplicação para contornar isso.

Build atual: HTML 0,67 kB / 0,42 kB gzip; CSS **15,85 kB / 4,12 kB gzip**; JavaScript 369,75 kB / 117,73 kB gzip (Vite, arredondado). Os hashes dos assets usados nas capturas estão em `evidence/a1/after/capture.json`. Não são medidas de FPS ou hardware real.

Limites: Chromium 156.0.8078.4 somente; zoom nativo em uma janela desktop, não em toda matriz de larguras ou navegadores. Sem novos testes em leitor de tela ou dispositivos físicos. A2 e A3 permanecem no backlog; A4 (nome, licença/notices e validações complementares antes de publicação) permanece pendente. O pacote privado de revisão não integra esta edição.
