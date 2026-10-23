# Terra Motion Skills

[English](README.en.md) · **v0.1.0 — marco histórico; experiência publicada** · Repositório público no GitHub

Receitas de motion para React e skills operacionais para agentes de IA. Onze receitas reutilizáveis na main, tokens neutros e um showcase com demonstrações reais, sem dependência da vitrine para consumir as receitas. Projeto independente, sem afiliação com a Motion. O nome do projeto e identificador do repositório são Terra Motion Skills e terra-motion-skills.

![Showcase Terra Motion Skills](docs/evidence/publication/terra-showcase-v4-1440.png)

**Showcase público:** [landing](https://joaquimftt-web.github.io/terra-motion-skills/), [laboratório Mineral Técnico](https://joaquimftt-web.github.io/terra-motion-skills/lab/) e [referências](https://joaquimftt-web.github.io/terra-motion-skills/referencias/). Historicamente, a primeira experiência integrada V4/P1/P2/P3 foi publicada a partir de `49d724183732bc8a82e8ed6889e9ecbd3338d527`; [deploy bem-sucedido](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39654669658). A Release/tag histórica v0.1.0 permanece intacta; esta publicação visual não altera a versão da biblioteca. As capturas A1 abaixo são históricas.

**Catálogo do código:** 11 recipes, 4 skills operacionais e 16 subpaths explícitos de recipes/CSS. L3 acrescenta Layout Reflow, Skeleton-to-Content e Data Change Feedback; consulte os [contratos](docs/L3_CONTRACTS.md). Pacotes npm não publicados; Release/tag v0.1.0 histórica e inalterada.

## Instalação e execução

Ambientes verificados: Windows e runner Ubuntu 24.04 com Chromium, Node **24.20.0** e pnpm **11.24.0**. Faixa aceita pelas ferramentas: Node `^22.22.2 || ^24.15.0 || >=26.0.0`; os demais ambientes não compõem uma matriz testada. React/React DOM 19.3.1 e Motion 14.3.0 estão fixados no lockfile. Se pnpm não estiver disponível, consulte a [instalação oficial](https://pnpm.io/installation) e use a versão fixada.

Repositório público: [joaquimftt-web/terra-motion-skills](https://github.com/joaquimftt-web/terra-motion-skills), branch `main`. Clone o projeto e entre na raiz que contém pnpm-workspace.yaml. Não há credenciais ou .env necessários.

```sh
git clone https://github.com/joaquimftt-web/terra-motion-skills.git
cd terra-motion-skills
pnpm install --frozen-lockfile
pnpm dev
```

Abra o endereço mostrado pelo Vite, normalmente http://127.0.0.1:5173. O comando compila os pacotes antes de iniciar a vitrine. Após editar receitas/tokens, rode `pnpm build:packages` para atualizar exports compilados. Para inspecionar um build local:

```sh
pnpm build
pnpm --filter @motion-skills-lab/showcase preview
```

Preview é ferramenta local, não servidor de produção. O showcase v0.1 está hospedado no GitHub Pages; os pacotes npm não estão publicados.

Consulte [HOSTING.md](docs/HOSTING.md) para operação do Pages, teste da base `/terra-motion-skills/` e rollback. A experiência publicada tem três rotas: `/`, `/lab/` e `/referencias/` (com o prefixo Pages no build correspondente). [Estado público e local](docs/PUBLICATION_STATUS.md) · [Fechamento técnico](docs/CLOSING_VALIDATION.md).

## Identidade e compatibilidade

Nome oficial: **Terra Motion Skills**; repositório público: [joaquimftt-web/terra-motion-skills](https://github.com/joaquimftt-web/terra-motion-skills). O escopo local `@motion-skills-lab/*`, o nome do workspace e os nomes das skills permanecem por compatibilidade. Os exemplos abaixo usam os identificadores reais; não há pacotes publicados no registry. O nome anterior aparece em registros históricos e capturas A1 preservadas. [Inventário e decisão](docs/IDENTITY.md).

## Receitas reais

- **Button Feedback:** botão nativo, props/ref do consumidor, cor/borda em hover/press, foco visível e disabled; sem scale, 140 ms.
- **Accordion Transition:** disclosure controlado, IDs/ARIA, painel fechado inert e aria-hidden, altura reversível com Motion; 180 ms por padrão.
- **Presence Transition:** presença controlada e foco antes da saída, 180 ms.
- **Async State Feedback:** cinco estados controlados; efeito decorativo de 160 ms, sem controlar a operação.
- **Navigation Indicator:** links nativos horizontais LTR e indicador, 180 ms.
- **Scroll Reveal:** entrada segura de bloco, sem fade, 260 ms / 8 px.
- **Staggered Entrance:** entrada de grupo semântico com atraso limitado, 260 ms / 8 px / stagger de 50 ms.
- **Scroll Progress:** posição real de scroll, sem duração artificial ou promessa de leitura.
- **Layout Reflow:** lista controlada com posição e identidade estável, 240 ms.
- **Skeleton-to-Content:** conteúdo imediato e revalidação que preserva foco, efeito decorativo de 180 ms.
- **Data Change Feedback:** valor exato controlado e feedback secundário, 220 ms.
- **Showcase:** duração ajustável, replay/reinício, contador de ativações, disabled e cópia com sucesso/fallback reais.

A preferência reduzida do sistema tem prioridade e atualiza durante a sessão. Accordion reduz conservadoramente quando matchMedia não está disponível. Conteúdo e lógica de negócio pertencem ao consumidor.

### Button Feedback

Os pacotes são locais e privados, sem publicação em registry. Use os exports compilados em outro workspace local, com React/React DOM 19 e Motion para Accordion. Não é um comando de instalação npm. `check:consumer` valida manifests/dist e peers sem fontes ou vitrine.

```tsx
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import '@motion-skills-lab/motion-recipes/button-feedback.css';

export function ConfirmButton({ onConfirm }: { onConfirm: () => void }) {
  return (
    <ButtonFeedback type="button" onClick={onConfirm}>
      Confirmar
    </ButtonFeedback>
  );
}
```

### Accordion Transition

```tsx
import { useState } from 'react';
import { AccordionTransition } from '@motion-skills-lab/motion-recipes/accordion-transition';
import '@motion-skills-lab/motion-recipes/accordion-transition.css';

export function Details() {
  const [open, setOpen] = useState(false);
  return (
    <AccordionTransition open={open} onOpenChange={setOpen} trigger="Detalhes">
      <p>Conteúdo controlado pela sua aplicação.</p>
    </AccordionTransition>
  );
}
```

A main possui 16 subpaths explícitos: onze componentes e cinco CSS, sem barrel raiz. As onze recipes têm demonstrações no Pages. Tokens CSS são opcionais pelos fallbacks; APIs e limites estão no [contrato](docs/MOTION_CONTRACT.md).

## Skills e arquitetura

Leia [motion-foundations](skills/motion-foundations/SKILL.md), [microinteraction-design](skills/microinteraction-design/SKILL.md) e [scroll-motion](skills/scroll-motion/SKILL.md) e [layout-transitions](skills/layout-transitions/SKILL.md) a partir deste clone. São instruções operacionais com parâmetros, exemplos, restrições, acessibilidade e validação. Não são runtime nem se instalam automaticamente no agente; preservar os diretórios mantém os links relativos válidos. A validação estrutural não certifica eficácia de agentes.

- `apps/showcase` consome exports públicos dos pacotes.
- `packages/motion-tokens` define timing/easing neutros.
- `packages/motion-recipes` contém onze recipes independentes integradas na main.
- `skills` contém instruções; `docs` registra decisões, contratos, fontes e evidências.

[Arquitetura](docs/ARCHITECTURE.md) · [Decisões](docs/DECISIONS.md) · [Roadmap](docs/ROADMAP.md)

## Validação e limites

```sh
pnpm typecheck
pnpm build
pnpm lint
pnpm format:check
pnpm test
pnpm validate:skills
pnpm check:boundaries
pnpm check:consumer
pnpm exec playwright install chromium
pnpm test:e2e
pnpm test:e2e:recipes
```

Histórico da base refinada v0.1, sem representar a contagem da publicação atual: passou em **22 testes Vitest, 17 Playwright e oito auditorias axe** nas quatro larguras. Há evidência histórica adicional de zoom nativo de 200% em Chromium com uma auditoria axe sem violações retornadas. A revalidação específica desta cópia está em [VALIDATION.md](docs/VALIDATION.md). E2E precisa da porta 4173 livre e de Chromium instalado.

A experiência integrada foi validada em Windows/Chromium e no Chromium do runner Ubuntu 24.04: não há alegação de compatibilidade validada com outros navegadores, leitores de tela, dispositivos físicos ou certificação de acessibilidade. Sem medições de FPS/hardware. A2 (fronteiras) e A3 (preferência durante replay agendado) permanecem no backlog. GSAP, Lenis, WebGL, Drawer e novas receitas não integram a v0.1.

Histórico (não corresponde à contagem atual): no merge publicado `491a934169966de481710a63fa7b4a2bb19fdc3e`, a [execução Ubuntu 39881855054](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39881855054) passou em 172 Vitest, 11 testes Node do auditor, 30 E2E independentes e 109 E2E por base; build e deploy success. O smoke HTTPS pós-deploy passou em 42 testes automatizados Chromium/Windows; 24 recursos públicos conferiram com o artefato. P2 retornou limpa nas quatro larguras e P3 concluiu em desktop/mobile. São evidências desse SHA publicado, sem estender a aprovação a alterações posteriores. Sem nova validação manual de zoom, Firefox/WebKit, leitores de tela ou dispositivos físicos; axe não certifica acessibilidade.

**Histórico pré-merge:** os resultados originais de 38b6fbbb estão na [CI 39874614276](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39874614276), e a correção documental 28b3cb8 passou na [CI 39880582782](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39880582782), ambas com deploy skipped. As contagens 43 Vitest / 11 auditor / 30 E2E por base e o smoke em [CLOSING_VALIDATION.md](docs/CLOSING_VALIDATION.md) são da publicação anterior.

## Capturas e demonstração

[Desktop completo](docs/evidence/a1/after/showcase-1440-full.png) · [1024 px](docs/evidence/a1/after/showcase-1024-full.png) · [390 px](docs/evidence/a1/after/showcase-390-full.png) · [320 px](docs/evidence/a1/after/showcase-320-full.png) · [Antes/depois A1](docs/REFINEMENT_A1.md)

![Código legível em viewport de 390 px](docs/evidence/a1/after/code-390.png)

O link público acima apresenta a experiência integrada. Capturas A1 são registros históricos da base refinada, não capturas da landing atual. Os usos específicos dos assets foram autorizados pelo titular em 21/10/2026, fora da MIT e sem licença geral de reutilização. [Inventário e condições](docs/ASSET_RIGHTS.md).

## Licenciamento e colaboração

**Código original sob a licença [MIT](LICENSE).** Copyright (c) 2026 Joaquim Freitas. Os manifests permanecem privados para evitar publicação acidental de pacotes. Dependências mantêm seus próprios termos: [notices](THIRD_PARTY_NOTICES.md), [fontes/licenças](docs/REFERENCES_AND_LICENSES.md) e [inventário](docs/DEPENDENCY_LICENSES.json).

[Contribuições](docs/CONTRIBUTING.md) · [Changelog](docs/CHANGELOG.md) · [Estado da publicação](docs/PUBLICATION_STATUS.md)

Logo e fundo arquitetônico têm permissões específicas separadas da MIT: [declaração do titular](docs/ASSET_PERMISSION_2026-10-21.md) e [condições](ASSET_NOTICES.md). Não são recursos abertos para reutilização irrestrita.

## L1/L2 e composição publicada da landing

Presence Transition (180 ms), Async State Feedback (160 ms) e Navigation Indicator (180 ms) compõem L1. Scroll Reveal, Staggered Entrance e Scroll Progress compõem L2. L3 acrescenta Layout Reflow, Skeleton-to-Content e Data Change Feedback: são onze recipes; consulte os [contratos](docs/MOTION_CONTRACT.md) e as quatro skills. A demo Async identifica sua simulação com promessas controladas pelo usuário; Navigation usa links/hash/history reais. Demos temporais permitem 0–800 ms; progresso de posição não recebe duração artificial.

- [Scroll Reveal](docs/recipes/scroll-reveal.md): entrada curta, sem fade, preparação segura abaixo da viewport.
- [Staggered Entrance](docs/recipes/staggered-entrance.md): lista ul/li, atraso min(i×stagger,200) ms e cancelamento do grupo.
- [Scroll Progress](docs/recipes/scroll-progress.md): posição vertical real, sem percentual de leitura.

A [Landing V4 publicada](docs/LANDING_MOTION_INTEGRATION.md) mantém hero/P1/P2/P3, acrescenta widget após o hero e galeria horizontal A guiada no desktop elegível, com B nativa como fallback/mobile. Consome recipes por subpath, sem atrelar a biblioteca à identidade V4. Este conteúdo está integrado na main e publicado no Pages pela PR #1. O experimento R1 original permanece separado da recipe Scroll Reveal L2 publicada. Nenhum bump ou nova release foi criado; pacotes npm continuam não publicados.
