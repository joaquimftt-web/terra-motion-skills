# Validação — estado atual e registros históricos

Fechamento da experiência integrada publicada: [CLOSING_VALIDATION.md](CLOSING_VALIDATION.md). Estado público confirmado: [PUBLICATION_STATUS.md](PUBLICATION_STATUS.md). O deploy v0.1 já ocorreu; abaixo estão registros históricos preservados, inclusive pendências anteriores ao primeiro deploy. Eles não representam a situação atual.

## Correção documental pré-merge da PR #1 — 22/10/2026

Revisão exclusivamente documental sobre o candidato original 38b6fbbb: oito recipes, três skills e 13 subpaths, separando branch pública, main e Pages. Históricos preservados; APIs, exemplos TSX, instruções operacionais, código, CSS, workflows, dependências, assets e licenças inalterados.

Executados localmente nesta etapa: formatação, lint, TypeScript, validação das três skills, fronteiras, consumidor independente com exemplos strict/SSR/hidratação e controle negativo; quatro exemplos TSX dos READMEs compilados em strict; 172/172 Vitest e 11/11 testes Node positivos/negativos do auditor. Builds das bases `/` e `/terra-motion-skills/`, gates de publicação e sete E2E direcionados por base passaram: navegação direta/refresh, referências reais, JS/CSS e avisos legais. Auditoria de links relativos e diff documental passou. Não foi reexecutada a bateria completa de 109 E2E por base ou 30 E2E independentes nesta correção editorial; esses resultados são da CI do SHA original abaixo. Não houve nova revisão visual, zoom ou certificação de acessibilidade nesta etapa.

Este checkpoint é local e não foi enviado à PR. Revalidação Ubuntu do novo commit depende de autorização de push e de um novo workflow_dispatch na branch, com deploy restrito à main e esperado skipped. Main/Pages e Release/tag histórica v0.1.0 permanecem inalterados.

## CI Ubuntu do candidato original da PR #1 — 22/10/2026

[Execução 39874614276](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39874614276), uma tentativa: branch integration/landing-v4-horizontal, SHA `38b6fbbb50a867c790c72a2c8ce90b9aba6a1118`. Ubuntu 24.04/Chromium headless: formatação, lint, tipos, builds, três skills, fronteiras/13 subpaths, consumidor independente/SSR/hidratação aprovados; controle negativo de mismatch tardio rejeitado corretamente. **172/172 Vitest em 20 arquivos, 11/11 testes Node do auditor, 30/30 E2E da fixture independente e 109/109 E2E por base**, incluindo axe nas suítes. Build/validação success; deploy skipped.

Artefato: 24 arquivos, 2.115.366 bytes descompactados, 13 referências e avisos legais. Auditoria e comparação byte a byte com o build local passaram. ZIP original SHA-256 `944d9907244d29e9a22eeeb2a134e2eeccdf71f20e1d7d7a11dee8bb80e55cdb`, igual ao digest GitHub. Logs e artefato originais preservados nas evidências entregues ao titular. O workflow bem-sucedido não reteve HTML/vídeos dos testes; não há nova evidência visual manual Linux ou zoom nativo Ubuntu. Outros browsers, leitores de tela/dispositivos físicos continuam pendentes.

A revisão documental posterior não herda automaticamente aprovação de CI para seu novo SHA. Main/Pages não receberam a PR, pacotes npm não publicados e Release/tag v0.1.0 inalteradas. Resultados Windows, limitações Linux e contagens nos registros históricos seguintes descrevem suas respectivas etapas e não contradizem esta execução posterior.

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

## L1 — Estados e seleção, validação local em 22/10/2026

Candidato isolado na branch `feat/states-selection-l1`, base `9a70fe5564fc66cd624861bb0e98337b9a8cb6d5`. Sem commit, integração, push, deploy, bump ou npm. Não confundir estas três adições com o site público ou com Scroll Reveal.

### Evidências atuais executadas

- Baseline antes das alterações: 43 Vitest + 11 testes Node do auditor, instalação offline com lock congelado.
- Implementação: suites Presence/Async/Navigation, tokens e exports. Antes das últimas ampliações: 83 Vitest + 11 Node; Presence foi ampliada para 17 casos e um teste de pré-requisito de CI foi acrescentado. Resultado consolidado final é registrado no relatório de entrega, após nova execução completa.
- Playwright completo: 42 casos aprovados por base `/` e `/terra-motion-skills/`, incluindo regressões existentes, axe, teclado, foco, replay, cópia, hashes e integridade das referências. Três casos adicionais de observer ausente/falho e recuperação de geometria passaram na suite direcionada Pages (15 casos L1).
- Consumidor independente: somente manifests/dist copiados para pasta temporária do sistema, sem fontes/showcase; Button e Async importados sem Motion resolvível. Após adicionar o peer Motion, SSR com renderToString, leitura sem JavaScript e hydrateRoot real sem erro recuperável; StrictMode, reversão, estado dos filhos, foco, live reduced motion, callback após remoção/ref nula, reserva dos cinco textos a 320 px, fonte alternativa, announcement off, CSS bloqueado e axe passaram. Todos os blocos TSX das duas skills compilaram com declarações públicas strict.
- Capturas reais do laboratório inteiro e das três demos em 1440, 1024, 390 e 320 px; nenhum overflow de documento e axe sem violações. Capturas estáticas usam redução para estabilidade; gravações Chromium originais documentam execução normal, controles, interrupção e redução.
- Zoom **nativo** via chrome.tabs.setZoom/getZoom(2), janela física mantida em 1440 × 1000, innerWidth 1424 → 712, DPR 1 → 2, CSS zoom=1 e visualViewport.scale=1. As três páginas passaram sem overflow/axe; no laboratório foram exercitados controles antigos e novos, foco, Space/Enter, replay e clipboard. Capturas individuais L1 em zoom constam do pacote externo.
- Artefato Pages: 20 arquivos, nove referências, avisos legais idênticos e zero correspondências nos filtros de arquivos/credenciais. Gate de direitos ready=true; não é certificação jurídica. Hashes e assets originais não foram alterados.

### Correções e diagnósticos preservados

Overflow de 457 px em mobile foi corrigido na coluna grid da demo, usando minmax(0,1fr), sem ocultar overflow nem relaxar asserções. Falha de registro de ResizeObserver foi reproduzida por teste: seleção posterior não pode reativar medição insegura. Reversão E2E passou a disparar as duas intenções no navegador e provar DOM ainda retido, evitando que a espera de actionability dos cliques ultrapassasse a saída. A fixture SSR recebeu charset UTF-8 após um erro real de hidratação por codificação; nenhuma recipe foi alterada para esconder esse diagnóstico. Uma captura de vídeo selecionou o link de fonte em vez do último link da navegação; o script de coleta foi corrigido, a aplicação permaneceu intacta e a gravação foi repetida. Houve uma execução direcionada com base de preview incorreta, interrompida e repetida com a base Pages correta; não consta como aprovação.

O workflow recebeu apenas a movimentação do passo existente de instalação do Chromium para antes de check:consumer, agora dependente de browser para hidratação. Ordem verificada por teste RED→GREEN; workflow **não executado remotamente**.

### Limites e reprodução

Windows/Chromium headless e toque emulado executados. Ubuntu WSL local existe, mas não possui Node Linux; pnpm encontrado aponta para instalação Windows. Validação Linux desta mudança não executada; resultados históricos Ubuntu da base não cobrem L1. Outros browsers, leitores de tela, dispositivo físico, anúncios audíveis reais e métricas FPS/hardware permanecem pendentes. Axe e testes de atributos não comprovam anúncio em tecnologia assistiva.

Reproduzir: instalar o lock congelado, instalar Chromium do Playwright quando necessário, `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm validate:skills`, `pnpm check:boundaries`, `pnpm check:consumer`, `pnpm test:e2e`. Repetir o E2E com SHOWCASE_BASE_PATH=/terra-motion-skills/ e executar `pnpm check:publication` sobre esse mesmo build. Há necessidade de portas livres 4173 e browser local; a fixture independente usa porta efêmera loopback. Não exige servidor externo ou segredo.

Logs, scripts de coleta, vídeos originais, manifesto e capturas ficam na área técnica/evidências e no pacote final entregue ao titular. Não entram no artefato público. Markdown exportado ainda usa o SHA HEAD da base para links GitHub: fontes novas só existirão nesse destino após futuro commit/push autorizado e rebuild; cópias locais `/reference/*.tsx` já são válidas. Não inventar SHA para tornar links remotos aparentes.

### Revisão final do L1

Revisão estática independente encontrou um Important: callback refs React 19 com cleanup precisavam ser compostas corretamente em Presence/Navigation. Três testes falharam antes e passaram após preservar o cleanup do consumidor, limpar a ref interna e suportar troca de ref/StrictMode/unmount. Nenhum contrato foi ampliado. Observação minor registrada naquela revisão: faltava checar onRecoverableError após as interações. Resolvida na continuação de 22/10 descrita abaixo, com controle negativo de erro real tardio e positivo saudável; a descrição anterior não representa o auditor atual.

Algumas capturas elementares muito altas no Chromium incluem o skip-link fora da viewport durante a captura, apesar de activeElement=body e top=-100 px confirmados. Os originais são preservados, identificados como limitação de captura; screenshots da viewport real complementam a evidência sem ocultar elementos ou mudar CSS. Não foi identificada reprodução do overlay na viewport normal.

## Ajustes locais de UX do laboratório — 22/10/2026

Lote posterior ao pacote L1 inicial, ainda sem commit ou publicação. #fundamentos recebeu padding de 24 px no desktop e 16 px até 600 px, em regra scoped ao laboratório. Tipografia, textos, cores, bordas e recipes preservados. Antes/depois medidos e capturados em 1440,1024,390,320 px, sem overflow.

As cinco demos agora expõem 0–800 ms/passo10, defaults de tokens, valor visível, reset e código correspondente. Button usa custom property pública existente; Async só altera marcador, mantendo resultado imediato. Testes RED específicos cobriram ausência/faixa dos controles e padding zero; GREEN após implementação. Teste físico do indicador a800ms revelou items recriados na demo, reiniciando observação e fazendo snap: estabilização com useMemo no showcase passou a preservar o percurso e o retiming, sem modificar a recipe. Mudança/restauração de duração cancela timer pendente de replay do Accordion.

Durante a implementação, falha de parse de template do Button foi corrigida; em seguida, o nome acessível do reset deixou de repetir o label do slider para evitar ambiguidade real em getByLabel. Os testes antigos continuam, com seletor de output agora scoped ao Accordion e ordem de Tab ampliada para incluir os novos controles; asserções não foram removidas. A bateria final e a prova nativa200% deste lote constam do relatório/evidências entregues; não reaproveitar números históricos do L1 como resultado desta revisão.

Resultado final deste ajuste de UX: **94/94 testes Vitest em 14 arquivos**, 11/11 testes Node do auditor e **61/61 testes Playwright em cada uma das duas bases** (`/` e `/terra-motion-skills/`). Tipos, builds, lint, formatação, skills, fronteiras, consumidor e check:publication passaram. Os novos testes exercitam 0/default/800 ms, reset, teclado, cópia, alterações rápidas/durante execução, redução inicial/durante execução e padding/axe nas quatro larguras. A prova nativa de 200% passou nas três rotas, incluindo sliders, restauração de defaults e padding. A gravação original contínua mostra cinco comparações de 800 ms versus 0 ms e um segmento reduzido. Foram comparados 13 arquivos deste ajuste ao snapshot local anterior; pacotes, assets e contratos TypeScript não foram alterados. Linux L1, leitores de tela e dispositivos físicos permanecem não executados. Trabalho local, sem commit/push/merge/deploy.

## Continuação e fechamento técnico L1 — 22/10/2026

Gate visual aprovado expressamente pelo titular em 22/10. Contratos r2, cinco controles de duração e duas skills locais preservados. Branch feat/states-selection-l1; HEAD/base 9a70fe5564fc66cd624861bb0e98337b9a8cb6d5; sem commit, integração ou operação remota. A abertura do L2 é somente documental, fora desta worktree.

### Mudança efetiva desta continuação

Somente auditor/fixtures de consumidor e este registro: check-consumer.mjs passa a executar check-l1-hydration-audit.mjs; check-l1-consumer.mjs verifica erros recuperáveis em checkpoints de commit e depois das interações; client.mjs usa uma boundary SSR controlada pela fixture hydration-probe.mjs. Nenhuma recipe, skill, dependência, controle ou asset alterado neste fechamento.

**RED real:** após commit da aplicação e interações, liberação de uma boundary SSR pendente produz mismatch React e dispara onRecoverableError; o auditor anterior ainda retornava0. Log hydration-red3.log preservado. Duas tentativas anteriores revelaram um landmark ausente na fixture e resolução incorreta da URL com query; foram corrigidas na fixture/servidor de testes, sem suprimir axe ou mudar produto.

**GREEN:** cenário saudável retorna0, seis checkpoints sem erro incluindo boundary tardia e modo sem CSS. Cenário negativo retorna1 especificamente por RECOVERABLE_HYDRATION_ERROR, com um erro real React observado após interações. A leitura não depende apenas de hydrationStarted nem de aguardar um tempo curto sem erros. Cobertura limitada aos commits e cenários exercitados; não prova ausência de qualquer erro assíncrono futuro. O negativo esperado não é regressão do produto: o gate exige sua rejeição.

### Execuções novas deste fechamento

| Comando                                                | Resultado em Windows/Chromium                                                                   |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| pnpm format:check                                      | PASS                                                                                            |
| pnpm lint                                              | PASS                                                                                            |
| pnpm typecheck                                         | PASS, incluindo builds dos pacotes                                                              |
| pnpm test                                              | 94/94 Vitest em14arquivos e11/11 testes Node do auditor                                         |
| pnpm validate:skills                                   | PASS, duas skills locais                                                                        |
| pnpm check:boundaries                                  | PASS, dez subpaths explícitos, sem R1                                                           |
| pnpm check:consumer                                    | PASS, dist/manifests externos, exemplos strict, SSR/noJS/hidratação e positivo/negativo tardios |
| SHOWCASE_BASE_PATH=/ pnpm test:e2e                     | 61/61, build completo e preview novo                                                            |
| SHOWCASE_BASE_PATH=/terra-motion-skills/ pnpm test:e2e | 61/61, build Pages completo e preview novo                                                      |
| pnpm check:publication                                 | PASS,20arquivos estáticos/9referências/notices idênticos/zero matches nos filtros; ready=true   |

Os E2E preservam axe, teclado/foco, cópia/replay, interrupções, redução inicial/ao vivo, navegação/hash, durações0/default/800 e responsividade320/390/1024/1440. Sem violações axe nos cenários executados; não equivale a certificação universal de acessibilidade. Gate de direitos verifica declarações/bytes atuais, não exclusividade jurídica. Logs por comando, JSONs do consumidor e observação negativa originais preservados em .superpowers/sdd/l1-fechamento-l2-20261022/logs e .validation; cópia no pacote externo.

### Evidências históricas reutilizadas e pendências

Capturas, vídeo de duração e zoom nativo200% do lote UX anterior permanecem evidências históricas válidas da UI inalterada. Não foram produzidas novas capturas ou repetido zoom nesta continuação de harness/documentação. Hashes comparados ao inventário anterior confirmam preservação de fontes visuais/recipes/skills/assets; ver manifesto da entrega.

Ubuntu WSL2 está acessível mas sem Node/nodejs Linux; npm/pnpm encontrados em /mnt/c/DevTools/Node não constituem runtime Linux. Validação Linux L1 permanece PENDENTE; não houve instalação, uso de CI remoto ou simulação de teste Linux com Node Windows. Firefox/WebKit, leitores de tela, dispositivos físicos e métricas de hardware também permanecem pendentes.

Parecer: fechamento técnico local validado no ambiente disponível; pronto para decisão sobre futuro commit local, condicionado às limitações registradas. Não declarar integração/publicação multiplataforma concluída. M06/R1 permanece isolada; M07/M08 e scroll-motion somente especificados fora desta worktree.

Reconferência final: um processo novo sem SHOWCASE_BASE_PATH rejeitou corretamente os assets Pages como base incompatível. O comando foi repetido com SHOWCASE_BASE_PATH=/terra-motion-skills/ e passou (publication-pages-final.log). Erro operacional documentado, sem alteração do auditor ou produto. Reproduzir o gate na mesma base do build.

## L2 — Scroll funcional, fechamento local em22/10/2026

Base pública9a70fe5; checkpoint local L1a6a1292b8784fce8f4ab1c2a49dd3113c627ae54; implementação L2 em1de180217f9d3e9c68ea61c801be3af1387df183. Branch feat/scroll-functional-l2; R1 original3b1a494 preservada. Sem integração main, push, deploy, npm, bump ou mudança de Release/tag. Ajuste final de painéis/registros recebe commit local normal posterior, sem reescrever marcos.

M06 preserva API260ms/8px/once/replayKey/reduceMotion/ref e SSR. M07 genérica ul/li usa duration260ms,offset8px,stagger50ms e atraso min(i×stagger,200)ms: em20itens,16últimos iniciam juntos no teto. M08 decorativa mede documento/seção/container+contentRef, sem duração/spring/leitura. Helper privado compartilhado de entrada evita duplicar observers por item; três demos usam estilos scoped e preservam cinco anteriores/padding/contratos. Skill scroll-motion produzida após funcionamento e validação; duas anteriores preservadas byte a byte.

### Resultados efetivamente executados

- Formatação, lint, TypeScript strict, builds dos pacotes/showcase, três skills, fronteiras e consumidor independente passaram.
- **169/169 Vitest em19arquivos +11/11 testes Node** do auditor. Inclui SSR Node, exports e regressões M01–M05.
- **30/30 Playwright na fixture neutra**, incluindo15casos R1 anteriores,1/6/20itens, timings WAAPI, foco, toque emulado real, redução, fallbacks, conteúdo CSS-only e restauração SSR.
- **72/72 Playwright em cada base**, raiz/Pages, após ajuste scoped dos painéis. Incluem axe sem violações nos cenários, teclado/foco, replay/cópia,0/default/800ms, quatro larguras, conteúdo/resize/zero-range e restauração do showcase.
- Consumidor só manifests/dist, sem showcase/fontes/aliases; tipos positivos/negativos e exemplos das três skills compilados. SSR real/noJS/CSS ausente e hydrateRoot positivo/negativo tardio passaram. Negativo gera erro React real após interações e deve retornar1 especificamente por hidratação; o gate retorna0 quando o rejeita corretamente.
- Restauração nativa repetida3vezes em fixture SSR e3no showcase compilado, sem alterar scrollRestoration/forçar reposição pela recipe.
- Artefato Pages auditado: **24arquivos/13referências**, notices idênticos,0arquivos proibidos e0matches nos filtros de credenciais; ready=true para evidências de direitos/bytes. Não é autorização de publicação ou certificação jurídica.
- Capturas reais1440/1024/390/320, seções e viewport; dois WebM originais sem edição de laboratório/entradas/fallbacks. Sem overflow de documento nos casos executados.
- Zoom **nativo por aba200%**, chrome.tabs.setZoom/getZoom2: janela externa1440×1000 preservada, innerWidth1424→712 e DPR1→2, CSSzoom1 e visualViewport.scale1. Durações/reset/replay/foco e teclado/redução em progresso foram exercitados; axe nas duas demos temporais sem violações. Não é simples redução de viewport nem overrideDPR.

### Regressões reproduzidas e correções

1. Gesto ativo era perdido ao reconstruir grupo por keys+replay. RED real, transferência interna dos pointerIDs e GREEN; nenhum prop adicional.
2. Troca de fonte M08 não zerada para nova fonte em0 deixava pintura antiga porque MotionValue0.set0 não notifica. RED scaleX(.5)≠0; nova inscrição inicia fill0/inativo até medida; teste unitário e Chromium passaram.
3. Lista vazia once=false ainda instalava IO. RED e guard antes de observar; vazio não cria alvo de IO em ambos modos.
4. Coletor de timing lia antes do commit React. Foi corrigida a sincronização do teste, mantendo exigência de animações reais e delays exatos.
5. Teste de reload numa fixture HTML vazia dependia do browser restaurar antes de React criar altura e oscilou. Criada fixture SSR de geometria estável, mantida asserção>500px de restauração real e acrescentado caso no showcase compilado. Sem scrollTo corretivo/scrollRestoration na recipe.
6. Inspeção visual revelou grade herdada que comprimira conteúdo das demos L2. Teste geométrico RED; display:block scoped apenas a .scroll-demo .demo-panel e quatro larguras GREEN. Capturas anteriores preservadas como diagnóstico; cinco demos existentes e identidade não alteradas.

Inventário esperado de referências evoluiu9→13 mantendo os nove arquivos anteriores, adicionando os quatro nomes/conteúdos e reforçando comparação exata. Tipos negativos foram posicionados no diagnóstico correto após formatação; não removidos. Logs RED, tentativas e resultados finais estão no pacote externo, com índices/hashes; não classificar tentativas falhas como aprovadas.

### Limitações e revisão

Windows/Chromium executados; Ubuntu WSL2 continua sem Node Linux e wrappers npm/pnpm são Windows. Linux, Firefox/WebKit, leitores de tela/anúncios audíveis, dispositivos físicos e métricas universais de FPS/CPU/energia permanecem pendentes. Touch é emulado. Axe e leituras de agentes não substituem AT/dispositivo real.

Geometria é intencionalmente conservadora: texto/cards/input simples funcionaram, sombra no conteúdo/clip/transform ancestral/inicialmente visível produziram estático. Nenhuma regra relaxada para fazer a animação aparecer. contentRef demonstrou benefício em crescimento apenas por CSS que não redimensiona a caixa fixa; custo estrutural1RO/2alvos e wrapper/ref, sem polling ocioso deliberado. Fontes Motion14.3 instaladas foram comparadas: trackContentSize=true faz leitura por frame; mecanismo selecionado usa rAF sob demanda+MotionValue/listeners/RO.

Minor de documentação registrado na revisão: links internos de Markdown exportado usam GitHub/blob do HEAD local, ainda não enviado. Os arquivos locais/reference abrem; links remotos novos só ficam válidos após futura autorização/push/rebuild. Skills relativas no clone local funcionam. Algumas capturas elementares altas do Chromium podem incluir skip-link fora da viewport; originais preservados e capturas de viewport complementam sem alterar CSS para esconder artefatos de captura.

Revisão independente apontou a troca de fonte (corrigida), vazio/once=false (corrigido) e links remotos locais (limitação registrada). Um cenário de agente com a skill explicitou teto/semântica/fallbacks que não se deduziam só das assinaturas; não foi inventada falha do baseline prudente nem alegada eficácia ampla de agentes. Parecer: APTO para revisão humana local, não autorização de publicação/multiplataforma.

## Landing V4 — integração horizontal local (22/10/2026)

Composição aprovada consolidada em branch local, após checkpoint r2. **172 Vitest +11 Node e109 Playwright em cada uma das duas bases** passaram, assim como formato, lint, tipos, builds, três skills, fronteiras, consumidor independente e auditor do artefato. Inclui casos novos de landing padrão sem query, CSS sticky indisponível, preservação dos quatro estados, histórico nativo e foco em resize com/sem troca de modo.

Capturas quatro larguras, quatro vídeos originais, contraste7,76:1 mínimo, P2 limpa, zoom nativo200% e amostra local sem long tasks foram produzidos nesta execução. Resultados, falhas intermediárias, correções, comparação com r2 e limites estão em [LANDING_MOTION_INTEGRATION.md](LANDING_MOTION_INTEGRATION.md). Não estender esses resultados a Linux, outros navegadores, leitores de tela ou dispositivos físicos. Publicação continua pendente de autorização; contratos, packages, skills e assets não mudaram.
