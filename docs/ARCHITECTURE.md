# Arquitetura — v0.1

```text
showcase (Vite / React / TypeScript)
  ├─→ motion-recipes/button-feedback (+ CSS)
  ├─→ motion-recipes/accordion-transition (+ CSS / Motion peer)
  └─→ motion-tokens (+ CSS opcional)
motion-recipes ─→ motion-tokens
skills ─ instruções e exemplos; sem runtime importado pela aplicação
```

pnpm workspaces usa somente apps/* e packages/*. Os três workspaces têm conteúdo funcional. Não há router, estado global de biblioteca, contexto de tema, registry ou pacote de utilitários genéricos. A vitrine é uma página com âncoras e módulos por demonstração. Receitas usam estado do consumidor e estilos próprios, sem identidade visual da vitrine ou de projetos externos.

## Pacotes e consumo

TypeScript emite ESM/declarations com imports relativos `.js` resolvíveis pelo Node. O helper de build copia apenas CSS para dist. Tokens possuem export raiz e CSS; receitas possuem somente os quatro subpaths de componentes/CSS. Não há barrel raiz para carregar receitas sem uso. React/React DOM 19 são peers; Motion é opcional no manifesto para consumo exclusivo de Button, mas obrigatório para Accordion. O showcase declara Motion diretamente. Apenas React 19.3.1/Motion 14.3.0 foram executados.

`check:consumer` copia somente manifests/dist para um consumidor de teste e liga peers locais: valida ESM, SSR, resolução CSS e exemplos das skills em TypeScript strict. Não importa fontes nem a vitrine. Isso verifica consumo local compilado; não constitui teste de publicação npm ou matriz de versões. `check:boundaries` faz scan estático das fronteiras e verifica os exports esperados.

## Movimento e lifecycle

Button usa CSS para feedback de cor; o sistema acompanha mudanças de preferência via media query. Accordion usa Motion apenas na altura, com estado e conteúdo controlados. Um hook privado com useSyncExternalStore acompanha matchMedia e remove listeners ao desmontar; fallback sem API é conservador. O hook de Motion da versão instalada só captura o valor inicial, comprovado em fonte e teste de regressão. A vitrine tem sua própria assinatura para status/replay e não importa o hook privado do pacote.

Não há fade de conteúdo no Accordion: ele foi removido após o axe identificar perda de contraste em frames intermediários. Fechar aplica inert/aria-hidden imediatamente; foco interno retorna ao gatilho. Replay é um timer de demonstração com cancelamento em nova ação/remount/unmount, sem estado de negócio simulado.

## Documentos e tooling

Skills são Markdown operacional, sem assets runtime. Um script exporta cópias estáticas de documentos e fontes próprios para links na vitrine; essas cópias são geradas/ignoradas pelo Git. A aplicação não importa skills em seu código de execução. As fontes editáveis continuam únicas em skills/docs/packages.

Vitest usa DOM para componentes e ambiente Node explícito para o teste de tokens com filesystem. jsdom não implementa layout/scroll; o stub de scrollTo só cobre a API ausente, com layout/interação real tratados no Chromium. Playwright inicia preview de produção novo, retém trace em falha e executa axe/teclado/preferência/toque emulado. Scripts principais recompilam os pacotes quando precisam de exports dist, evitando testes da vitrine contra artefatos antigos.

Decisões e licenças: [DECISIONS.md](DECISIONS.md). Contratos públicos: [MOTION_CONTRACT.md](MOTION_CONTRACT.md). Evidências reais: [VALIDATION.md](VALIDATION.md).
