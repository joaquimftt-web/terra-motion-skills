# Estado da publicação

## L3 — catálogo de layout e estados dinâmicos

O código reúne 11 recipes, 4 skills operacionais e 16 subpaths explícitos (11 componentes e os cinco CSS existentes). Novas APIs: LayoutReflow, SkeletonToContent e DataChangeFeedback, com a skill layout-transitions. [Contratos e decisões](L3_CONTRACTS.md). Sem dependências novas, bump, npm ou alteração da Release/tag histórica. Landing preservada, com P2 removido; atualização nela restrita a contagens e referências. As seções seguintes preservam os estados históricos das etapas indicadas.

## Correção da dobra mineral — 23/10/2026

A passagem animada Mineral Fold foi removida por decisão visual. A identidade estática V4, P1, P3, widget, galeria horizontal, oito recipes e três skills são preservados. Sem efeito substituto ou alteração de assets/APIs. Escopo e cobertura em [P2_REMOVAL.md](P2_REMOVAL.md). Os relatos de P2 abaixo são evidências históricas dos respectivos SHAs.

## Estado publicado — 22/10/2026

**Publicado na main e no GitHub Pages:** 8 recipes, 3 skills operacionais e 13 subpaths explícitos de recipes/CSS. A [PR #1](https://github.com/joaquimftt-web/terra-motion-skills/pull/1) foi integrada por merge commit `491a934169966de481710a63fa7b4a2bb19fdc3e`, incluindo L1/L2 e a composição horizontal da Landing V4. [CI/build e deploy aprovados](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39881855054). Pacotes npm não publicados; Release/tag v0.1.0 histórica e inalterada.

No merge publicado `491a934169966de481710a63fa7b4a2bb19fdc3e`, a [execução Ubuntu 39881855054](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39881855054) passou em 172 Vitest, 11 testes Node do auditor, 30 E2E independentes e 109 E2E por base; build e deploy success. O smoke HTTPS pós-deploy passou em 42 testes automatizados Chromium/Windows; 24 recursos públicos conferiram com o artefato. P2 retornou limpa nas quatro larguras e P3 concluiu em desktop/mobile. São evidências desse SHA publicado, sem estender a aprovação a alterações posteriores. Sem nova validação manual de zoom, Firefox/WebKit, leitores de tela ou dispositivos físicos; axe não certifica acessibilidade.

Main e Pages contêm as duas receitas originais e as seis L1/L2; a branch integration/landing-v4-horizontal foi preservada após o merge, assim como o experimento R1 original. Não confundir publicação dos fontes na main, disponibilização do showcase no Pages e eventual publicação npm. Este registro de publicação não autoriza novas integrações ou deploys.

Os registros abaixo preservam estados e autorizações anteriores por data/etapa; não representam bloqueios atuais nem indisponibilidade de L1/L2.

## Histórico — revisão documental do candidato da PR #1 em 22/10/2026

**Candidato da [PR #1](https://github.com/joaquimftt-web/terra-motion-skills/pull/1):** 8 recipes, 3 skills operacionais e 13 subpaths explícitos de recipes/CSS. L1/L2 e a composição horizontal estão disponíveis na branch `integration/landing-v4-horizontal`; ainda não integrados à main nem publicados no Pages. Pacotes npm não publicados. A Release/tag v0.1.0 é histórica e permanece inalterada.

A main de referência e o Pages permanecem na base pública anterior; main: `9a70fe5564fc66cd624861bb0e98337b9a8cb6d5`. Na branch candidata há Presence Transition, Async State Feedback, Navigation Indicator, Scroll Reveal, Staggered Entrance e Scroll Progress, além de Button Feedback e Accordion Transition. Skills: motion-foundations, microinteraction-design e scroll-motion. Landing candidata: V4/P1/P2/P3 preservados, widget após o hero e galeria horizontal guiada A com fallback nativo B.

[CI Ubuntu 39874614276](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39874614276) aprovada no SHA original `38b6fbbb50a867c790c72a2c8ce90b9aba6a1118`; deploy **skipped**. Esta revisão documental posterior exige novo push e dispatch autorizados antes de afirmar CI Ubuntu do novo commit. O código original da PR já está disponível na branch GitHub; não está integrado à main ou servido pelo Pages. Publicação npm é uma operação separada, não realizada.

Os registros abaixo são fatos históricos por etapa. Menções a pendências, ausência de autorização e contagens antigas descrevem aquele momento; não substituem este estado do candidato. A branch R1 original feat/scroll-reveal permanece separada, sem merge: o Scroll Reveal atual pertence ao L2. R2–R9 da pesquisa anterior não são IDs dos lotes L1/L2 atuais; propostas não implementadas continuam no backlog. Avisos e permissões dos assets não foram alterados.

## Histórico — experiência pública em 21/10/2026

[Landing](https://joaquimftt-web.github.io/terra-motion-skills/), [laboratório Mineral Técnico](https://joaquimftt-web.github.io/terra-motion-skills/lab/) e [Referências](https://joaquimftt-web.github.io/terra-motion-skills/referencias/) estão públicos. A landing inclui identidade V4, coreografia P1, narrativa P2 e acabamento P3. Button Feedback e Accordion Transition continuam sendo as duas recipes públicas, com as skills motion-foundations e microinteraction-design.

Publicação integrada confirmada no commit `49d724183732bc8a82e8ed6889e9ecbd3338d527`, [Actions 39654669658](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39654669658), com jobs de validação/build e deploy bem-sucedidos. Commits editoriais posteriores não representam nova versão da biblioteca; o SHA servido de cada atualização deve ser conferido no Actions de main.

## Histórico — versão, isolamento e direitos em 21/10/2026

- Release/tag histórica v0.1.0 preservada em `63ea755982c9bc31da9dd21b0c8206b20b07049a`. A publicação visual não cria uma release nova.
- Scroll Reveal R1 permanece local na branch isolada feat/scroll-reveal, sem integração pública. R2 e demais propostas continuam no planejamento/backlog.
- Pacotes npm não publicados; consumo dos exports compilados ocorre por workspace/clone local.
- Histórico público saneado separado do histórico privado.
- Código original MIT. Logo e fundo têm autorização específica para este repositório e Pages, incluindo WebP do fundo; não possuem licença geral de reutilização por terceiros. [Declaração](ASSET_PERMISSION_2026-10-21.md), [limitações](ASSET_PROVENANCE_REVIEW.md) e [avisos](../ASSET_NOTICES.md) preservados.

## Histórico e operação

Primeiro deploy: 20/10/2026, baceffee, run 39469817919. Integração inicial: 7ea60ea; recuperação de overflow mobile Linux: 2df1626, f0cd8e2 e 49d7241. O run inicial 39651224455 falhou antes do deploy; o run 39654669658 publicou a recuperação validada. Não confundir o relato histórico de bloqueio de direitos com o estado regularizado atual.

[Operação e rollback](HOSTING.md) · [Integração concluída](CLOSING_INTEGRATION.md) · [Validação](CLOSING_VALIDATION.md).

## Histórico — candidato L1 local em 22/10/2026

A worktree feat/states-selection-l1 adiciona Presence Transition, Async State Feedback e Navigation Indicator apenas localmente. Nenhuma integração, commit, push, deploy ou alteração da Release v0.1.0 foi autorizada neste lote. O site público continua com as duas recipes da base; Scroll Reveal permanece isolado.

## Histórico — integração horizontal local em 22/10/2026

A branch `integration/landing-v4-horizontal` consolida o widget após o hero e a galeria de quatro painéis como padrão local. A rolagem guiada usa fallback nativo por geometria, foco, preferência e capacidade do navegador. Os seletores comparativos foram removidos; o protótipo r2 está preservado no checkpoint local `e27f56b863aa87e9d5ea0e2d736a7a3ee50e860a`.

Este candidato inclui as recipes locais L1/L2 herdadas do checkpoint L2; não representa sua disponibilidade na main, npm ou site público. O registro L1 anterior descreve a autorização daquele momento; neste lote foram autorizados checkpoints e commits exclusivamente locais nas branches de trabalho. A main e a Release/tag histórica não foram alteradas. [Composição, operação e limitações](LANDING_MOTION_INTEGRATION.md).
