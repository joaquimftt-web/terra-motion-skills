# Arquitetura — base v0.1 e L1/L2 publicados

## M13 — Expandable Cards

Esta revisão acrescenta Expandable Cards: **12 recipes, 4 skills operacionais, 17 subpaths explícitos**. [Contrato M13](recipes/expandable-cards.md). Base publicada anterior: 8b5454e (M01–M11). Integração, CI Ubuntu e deploy Pages são rastreados separadamente na PR correspondente. Sem publicação npm ou alteração da Release/tag histórica v0.1.0. Registros datados abaixo são históricos.

## L3 — histórico da base publicada 8b5454e

A base L3 reuniu 11 recipes, 4 skills operacionais e 16 subpaths explícitos (11 componentes e os cinco CSS existentes). Novas APIs: LayoutReflow, SkeletonToContent e DataChangeFeedback, com a skill layout-transitions. [Contratos e decisões](L3_CONTRACTS.md). Sem dependências novas, bump, npm ou alteração da Release/tag histórica. Landing preservada, com P2 removido; atualização nela restrita a contagens e referências. As seções seguintes preservam os estados históricos das etapas indicadas.

**Registro histórico da publicação L1/L2:** 8 recipes, 3 skills operacionais e 13 subpaths explícitos de recipes/CSS. A [PR #1](https://github.com/joaquimftt-web/terra-motion-skills/pull/1) foi integrada por merge commit `491a934169966de481710a63fa7b4a2bb19fdc3e`, incluindo L1/L2 e a composição horizontal da Landing V4. [CI/build e deploy aprovados](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39881855054). Pacotes npm não publicados; Release/tag v0.1.0 histórica e inalterada.

```text
showcase (Vite / React / TypeScript)
  ├─→ motion-recipes/button-feedback (+ CSS)
  ├─→ motion-recipes/accordion-transition (+ CSS / Motion peer)
  ├─→ motion-recipes/presence-transition, async-state-feedback, navigation-indicator (+ CSS)
  ├─→ motion-recipes/scroll-reveal, staggered-entrance, scroll-progress
  ├─→ motion-recipes/layout-reflow, skeleton-to-content, data-change-feedback
  ├─→ motion-recipes/expandable-cards
  └─→ motion-tokens (+ CSS opcional)
motion-recipes ─→ motion-tokens
skills ─ instruções e exemplos; sem runtime importado pela aplicação
```

pnpm workspaces usa somente apps/* e packages/*. Os três workspaces têm conteúdo funcional. Não há router, estado global de biblioteca, contexto de tema, registry ou pacote de utilitários genéricos. A vitrine tem três rotas estáticas: landing /, laboratório /lab/ e referências /referencias/, com âncoras no laboratório. Receitas usam estado do consumidor e estilos próprios, sem identidade visual da vitrine ou de projetos externos.

## Pacotes e consumo

TypeScript emite ESM/declarations com imports relativos `.js` resolvíveis pelo Node. O helper de build copia apenas CSS para dist. Tokens possuem export raiz e CSS; receitas possuem 17 subpaths explícitos: doze componentes e cinco CSS (quatro exports na base histórica de duas recipes). Não há barrel raiz para carregar receitas sem uso. React/React DOM 19 são peers; Motion é opcional no manifesto para consumo de Button/Async/Skeleton, mas obrigatório para Accordion/Presence/Navigation, as três recipes L2, Layout Reflow e Data Change Feedback. O showcase declara Motion diretamente. Apenas React 19.3.1/Motion 14.3.0 foram executados.

`check:consumer` copia somente manifests/dist para um consumidor de teste e liga peers locais: valida ESM, SSR, resolução CSS e exemplos das skills em TypeScript strict. Não importa fontes nem a vitrine. Isso verifica consumo local compilado; não constitui teste de publicação npm ou matriz de versões. `check:boundaries` faz scan estático das fronteiras e verifica os exports esperados.

## Movimento e lifecycle

Button usa CSS para feedback de cor; o sistema acompanha mudanças de preferência via media query. Accordion usa Motion apenas na altura, com estado e conteúdo controlados. Um hook privado com useSyncExternalStore acompanha matchMedia e remove listeners ao desmontar; fallback sem API é conservador. O hook de Motion da versão instalada só captura o valor inicial, comprovado em fonte e teste de regressão. A vitrine tem sua própria assinatura para status/replay e não importa o hook privado do pacote.

Não há fade de conteúdo no Accordion: ele foi removido após o axe identificar perda de contraste em frames intermediários. Fechar aplica inert/aria-hidden imediatamente; foco interno retorna ao gatilho. Replay é um timer de demonstração com cancelamento em nova ação/remount/unmount, sem estado de negócio simulado.

## Documentos e tooling

Skills são Markdown operacional, sem assets runtime. Um script exporta cópias estáticas de documentos e fontes próprios para links na vitrine; essas cópias são geradas/ignoradas pelo Git. A aplicação não importa skills em seu código de execução. As fontes editáveis continuam únicas em skills/docs/packages.

Vitest usa DOM para componentes e ambiente Node explícito para o teste de tokens com filesystem. jsdom não implementa layout/scroll; o stub de scrollTo só cobre a API ausente, com layout/interação real tratados no Chromium. Playwright inicia preview de produção novo, retém trace em falha e executa axe/teclado/preferência/toque emulado. Scripts principais recompilam os pacotes quando precisam de exports dist, evitando testes da vitrine contra artefatos antigos.

Decisões e licenças: [DECISIONS.md](DECISIONS.md). Contratos públicos: [MOTION_CONTRACT.md](MOTION_CONTRACT.md). Evidências reais: [VALIDATION.md](VALIDATION.md).

## L1 — estados e seleção na main

Presence usa retenção de um bloco controlado, foco antes da saída inerte e gerações de animação para impedir callbacks vencidos. Async é React/CSS, sem dependência de Motion ou Presence; a lógica de operação pertence ao consumidor. Navigation separa links/seleção/foco, mede o track com um ResizeObserver por instância e mantém fallback estático quando a medição não é segura. O hook privado de redução das novas recipes não substitui o hook existente do Accordion.

As três demos L1 reusam a superfície Mineral Técnico. A composição posterior da landing consome recipes públicas sem alterar seus contratos ou os assets. O consumidor L1 fica no diretório temporário do sistema, copia apenas manifests/dist e prova primeiro Button/Async sem Motion resolvível; depois adiciona Motion, gera SSR e hidrata em Chromium. A fixture é de validação, não novo workspace ou API pública. Exportadores/auditores desta atualização exigem 17 referências e 17 subpaths, preservando listas explícitas. A galeria guiada/fallback pertence exclusivamente ao showcase; detalhes em [LANDING_MOTION_INTEGRATION.md](LANDING_MOTION_INTEGRATION.md).
