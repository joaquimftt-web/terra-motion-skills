> Registro histórico de planejamento, saneado para apresentação pública. O estado implementado atual está no README e em docs/VALIDATION.md.

# Motion Skills Lab v0.1 — Especificação técnica

**Data:** 2026-10-19<br>
**Versão do produto:** v0.1.0<br>
**Nome:** Motion Skills Lab (provisório)<br>
**Status:** proposta para revisão; não autoriza implementação<br>
**Referência principal:** `requisitos aprovados para a v0.1`

## 1. Objetivo

Construir uma primeira vertical demonstrável de uma biblioteca modular para motion em interfaces React. A versão 0.1 deve provar que receitas reutilizáveis, tokens, instruções operacionais para agentes e uma vitrine navegável podem coexistir sem dependência do showcase, sem copiar materiais de terceiros e sem antecipar funcionalidades do roadmap.

O resultado deve ser adequado a um portfólio profissional por meio de arquitetura compreensível, comportamento acessível, testes pertinentes, documentação reproduzível e afirmações limitadas às evidências verificadas.

## 2. Restrições e escopo

### Incluído

- React, TypeScript em modo strict, Motion for React (`motion/react`) e Vite.
- pnpm workspaces leves, com dependências em direção a pacotes reutilizáveis; aplicações não são importadas por pacotes.
- Tokens compartilhados e receitas `button-feedback` e `accordion-transition` com demos reais.
- Skills operacionais `motion-foundations` e `microinteraction-design`.
- Showcase responsivo com navegação por receitas, replay quando o padrão tiver uma transição reproduzível e controles que alterem comportamento real.
- README PT-BR e inglês; documentação de arquitetura, contrato de motion, decisões, referências/licenças, contribuição, changelog e roadmap com estado honesto.
- Testes Vitest para módulos e componentes, e Playwright para fluxos essenciais de browser quando o ambiente permitir.
- Drawer somente se a implementação e a validação integral de modal, foco, Escape, fundo inativo, restauração de foco, teclado e movimento reduzido couberem sem comprometer as duas receitas principais.

### Fora do escopo

Backend, autenticação, banco de dados, Storybook obrigatório, filtros/pesquisa antes de serem úteis, pacote npm, registro de pacotes, CI, hospedagem, publicação, repositório GitHub público, licença definitiva, analytics e funcionalidades dos roadmaps v0.2+.

Não acessar, modificar ou importar arquivos, código, screenshots, dados ou componentes privados do projetos privados externos. O projeto privado externo pode servir apenas como referência comportamental dos tempos e padrões operacionais descritos na Guia Mestre. O nome do projeto permanece provisório.

## 3. Arquitetura

```text
motion-skills-lab/
├── apps/showcase/                 # Vite; catálogo e demonstrações
├── packages/motion-tokens/        # tokens tipados e custom properties compartilhadas
├── packages/motion-recipes/       # receitas React com exports explícitos
├── skills/
│   ├── motion-foundations/SKILL.md
│   └── microinteraction-design/SKILL.md
└── docs/                          # contratos, decisões, referências e guias
```

Criar somente diretórios com conteúdo pertencente à v0.1. `packages/motion-recipes` terá um ponto de entrada por receita (`button-feedback` e `accordion-transition`) e um export público explícito. O showcase importa as receitas pelo contrato público. Os pacotes não importam `apps/showcase`, seus estilos ou dados de demonstração. Nenhum barrel deve carregar receitas sem uso indiscriminadamente.

As receitas recebem conteúdo e propriedades reais do consumidor, não incluem identidade visual do showcase nem lógica de negócio, e declaram dependências React/Motion de modo explícito. O showcase não é requisito para consumir ou demonstrar as receitas: cada receita mantém implementação, estilos e documentação próximos ao módulo e pode ser importada por outro app React com as dependências declaradas.

Tokens expõem valores tipados e custom properties de timing/easing necessários às receitas existentes, sem tokens de marca. O contrato público de cada receita documenta gatilho, estados, props, defaults, transição, interrupção, reduced motion, dependências e limites. Valores de referência iniciais: botão 110–160 ms; accordion 160–220 ms. Durações são parâmetros de design, não promessa de performance medida.

## 4. Comportamento das receitas

### Button Feedback

Um botão semântico mantém o elemento e seu conteúdo sob controle do consumidor. Estados hover, foco visível e pressionado comunicam interação por cor/borda em transições curtas. O estado operacional não aplica escala por padrão. Mouse, teclado e touch não devem depender de hover para revelar informação ou habilitar ação. Estado desabilitado e eventual estado ocupado preservam semântica e não simulam sucesso de operação. A transição simples pode usar CSS nativo e tokens para evitar custo desnecessário; a stack Motion continua integrada à receita de conteúdo animado e ao showcase.

### Accordion Transition

Disclosure com botão nativo, `aria-expanded` e associação entre gatilho e painel; Enter/Espaço seguem comportamento nativo. Conteúdo real permanece no DOM de forma coerente com o estado e não é ocultado apenas visualmente enquanto continua acessível. A abertura e o fechamento aceitam mudanças rápidas de estado sem travar interação. Usar Motion (`motion/react`) para transição de altura/conteúdo; para movimento reduzido eliminar deslocamento/expansão animada ou usar alternativa discreta sem esconder conteúdo. O tempo padrão fica entre 160 e 220 ms.

### Drawer condicional

Não faz parte do critério mínimo. Só será implementado se o fluxo modal puder ser validado integralmente com semântica de diálogo, gerenciamento e contenção de foco, Escape, backdrop, bloqueio do conteúdo de fundo, restauração do foco, viewport estreito e reduced motion. Sem evidência suficiente, registrar a pendência e não criar recipe, skill ou pasta vazia.

## 5. Skills para agentes

Cada skill deve ter frontmatter YAML válido, `name` igual ao diretório e `description` que diga o que faz e quando deve ser usada. O corpo deve ser operacional para agentes, sem duplicar o código das receitas. Para cada skill publicada, documentar:

- critérios de aplicação e quando não aplicar;
- processo de decisão e parâmetros/defaults relevantes;
- exemplos úteis ligados à API real da v0.1;
- restrições de semântica, interação e branding;
- acessibilidade, movimento reduzido e teclado;
- validações e sinais de que a implementação precisa ser revista.

`motion-foundations` cobre intenção, gatilho, duração/easing, interrupção, tokens, desempenho e reduced motion. `microinteraction-design` cobre feedback em controles interativos e aponta para Button Feedback quando aplicável. Não criar `navigation-motion` nesta versão, salvo se o drawer for concluído e gerar conteúdo suficiente.

## 6. Showcase

A vitrine inicial apresenta o propósito, links navegáveis para as receitas entregues e demos funcionais. Cada demonstração informa nome, categoria/perfil, finalidade, comportamento, origem na skill/recipe, quando usar/evitar, dependências e observações de compatibilidade.

Replay reinicia uma transição quando isso fizer sentido; controles só existem se mudarem uma propriedade real. Cada recipe publicada na vitrine inclui snippet válido com imports e dependências e um botão funcional para copiá-lo, com o texto também selecionável e resultado de cópia anunciado. Um controle educacional de reduced motion pode tornar a demonstração mais conservadora e pode ser ativado pelo usuário, mas nunca pode reativar movimento que a preferência do sistema reduziu. Implementação e teste cobrem a preferência real do sistema.

Navegação funciona por teclado, possui foco visível, rótulos e landmarks semânticos. Layouts se adaptam a 1440, 1024, 390 e 320 px quando o browser permitir. Sem busca, filtros, botões demonstrativos ou estado simulado sem efeito real.

## 7. Acessibilidade, movimento e desempenho

- Conteúdo e ação não dependem de animação para serem compreendidos.
- Respeitar `prefers-reduced-motion` em CSS e Motion; mudanças de preferência durante a sessão devem ser tratadas quando suportadas pelo hook usado.
- Preferir opacity/transform ou propriedades justificadas; evitar animação contínua decorativa, tremor, escalas operacionais e re-renderizações desnecessárias.
- Verificar tabulação, Shift+Tab, Enter, Espaço, foco visível, semântica/ARIA e interrupções rápidas.
- Os testes automatizados verificam estados e fluxos observáveis, mas não equivalem a certificação de acessibilidade nem a avaliação humana completa.
- Não alegar FPS, compatibilidade universal ou acessibilidade completa sem evidência correspondente.

## 8. Testes e validação

Vitest cobre tokens, contratos e estados dos componentes com testes DOM acessíveis; Playwright cobre navegação, interação real, teclado, emulação de reduced motion, replay e viewports essenciais. Utilizar verificações automatizadas de acessibilidade onde úteis, sem tratá-las como substituto da inspeção de foco e semântica.

Critérios mínimos de validação: `build`, TypeScript strict, `lint`, testes unitários/componentes e testes E2E direcionados passam; links e controles têm efeito; pacotes não importam código do showcase; duas receitas principais funcionam com reduced motion; responsividade não causa overflow impeditivo. Registrar comandos, resultados, limitações e evidências em documentação de fechamento. Drawer só passa se cumprir seus próprios critérios do §4.

## 9. Dependências e escolhas

Vite é a aplicação de demonstração. pnpm workspaces são mantidos enquanto a configuração continuar pequena e tornar a fronteira entre receitas e showcase verificável. Motion é dependência runtime justificada pela transição de accordion e pela stack pedida. CSS nativo cobre feedback de cor/borda quando mais simples. Vitest compartilha a configuração/ecossistema Vite; Playwright é reservado à validação de browser que testes DOM não comprovam.

Versões concretas serão escolhidas na implementação entre versões compatíveis disponíveis naquele momento e fixadas no lockfile; nenhuma dependência será registrada como `latest`. A licença do código e dos materiais do projeto não será escolhida nesta especificação. Antes de qualquer publicação/distribuição, confirmar autoria, proveniência, permissões, dependências e licença.

## 10. Critérios de aceite da v0.1

- [ ] Projeto local isolado e reproduzível com React, TypeScript strict, Motion e Vite.
- [ ] Duas receitas completas, documentadas, testadas e demonstradas; drawer não é requisito.
- [ ] Receitas importáveis por consumidores React sem importar ou executar o showcase.
- [ ] Fronteiras direcionais verificadas: showcase consome pacotes; pacotes não importam app.
- [ ] Duas skills válidas e operacionais conforme §5.
- [ ] Reduced motion, teclado, foco visível, responsividade e interrupções validados dentro do alcance dos testes.
- [ ] Showcase navegável com demos, replay/controles reais e links corretos para código/skills.
- [ ] README PT-BR e inglês, arquitetura, contrato, decisões e fontes/licenças refletem apenas conteúdo existente.
- [ ] Build, typecheck, lint e testes pertinentes registrados com resultados reais.
- [ ] Sem alterações no projeto privado externo, projeto privado externo ou repositórios preexistentes.
- [ ] Sem publicação, push, licença definitiva ou declaração de acessibilidade/performance além das evidências.

## 11. Referências

- Motion for React: https://motion.dev/docs/react
- Instalação Motion: https://motion.dev/docs/react-installation
- Acessibilidade e movimento reduzido: https://motion.dev/docs/react-accessibility
- Hook `useReducedMotion`: https://motion.dev/docs/react-use-reduced-motion
- Agent Skills Specification: https://agentskills.io/specification
- Vitest Guide: https://vitest.dev/guide/
- Playwright Assertions: https://playwright.dev/docs/test-assertions
- Guia Mestre Motion Skills Lab v1.0, fornecida pelo usuário (referência de escopo e princípios de motion operacional; nenhuma implementação ou ativo privado do projeto privado externo será consultado ou incorporado).

Fontes externas serão registradas também em `docs/REFERENCES_AND_LICENSES.md` durante a implementação, incluindo o princípio aproveitado, originalidade da implementação e licença aplicável quando houver conteúdo derivado.

## 12. Integração documental do adendo de referências e contribuição

Esta seção incorpora o adendo de 19/10/2026 à especificação-base. Ela não amplia a stack nem autoriza implementação/publicação. O contrato da v0.1 continua sendo duas receitas completas (Button Feedback e Accordion Transition), as duas skills previstas e um showcase funcional; o drawer permanece condicional.

### Papéis das fontes e limites de uso

| Fonte | Uso no projeto | Licença/proveniência |
|---|---|---|
| Motion.dev | API React, intenção, estados, acessibilidade e integração técnica | Dependência obrigatória `motion`; validar licença/versionamento no pacote instalado. |
| Details.so Inspo | Estudar acabamento, hierarquia, interação e narrativa | Referência visual; não copiar código, imagens, marcas ou layout distintivo. |
| shadcn/ui | Estudar composição, semântica, foco, teclado e acessibilidade | Não instalar Tailwind/shadcn na v0.1. A licença de repositório MIT não libera automaticamente outros conteúdos/serviços; qualquer código reutilizado exigiria aviso de copyright e proveniência próprios. |
| Unlumen UI | Observar comportamentos como referência | Não redistribuir componentes ou versões modificadas em biblioteca/registry; não incluir componentes Pro sem direito correspondente. |
| Lenis Templates | Estudar ritmo e sensação de scroll | Templates de terceiros são referências individuais; licença de Lenis não licencia templates, imagens nem código de cada site. Sem dependência na v0.1. |
| GSAP Showcase | Estudar coreografia e narrativas de scroll | Showcase não concede direito de copiar sites/assets/código. GSAP não é tratado como MIT; consultar licença oficial antes de qualquer integração futura. Sem dependência na v0.1. |
| `material externo de referência não incorporado` | Aprendizado seletivo sobre intenção, estados, lifecycle, QA e padrões de teste | ZIP declara MIT para material original e declara licenças próprias para dependências. Não reutilizar código diretamente na v0.1; implementar Button/Accordion de forma própria usando os comportamentos e critérios como referência. Se contribuição direta surgir depois, registrar arquivo, autor, licença e aviso de copyright correspondentes. |

Cada referência efetivamente usada em decisão de implementação deve ter em `docs/REFERENCES_AND_LICENSES.md`: URL/arquivo, comportamento observado, papel UX, gatilho/estados, adaptação a mobile e movimento reduzido, princípio adotado, implementação original resultante e licença/restrições. Consultar novamente as licenças vigentes antes de distribuição. Não assumir que a licença de uma biblioteca abrange seus templates ou dependências.

### Registro estático do pacote colaborador

O arquivo `material externo de referência não incorporado` foi localizado em Downloads e inspecionado sem extração ou execução. Tem 97 entradas; os 96 hashes SHA-256 listados em `MANIFEST.sha256` conferem. O pacote declara seis skills e 14 exemplos, e inclui um laboratório React/Vite/TypeScript. `LICENSE` declara MIT para material original do pacote; `THIRD_PARTY.md` lista licenças de dependências separadamente, incluindo GSAP sob licença própria. Isso registra o conteúdo do pacote, não comprova autoria individual, segurança, correção ou licença de cada ativo externo.

O relatório `validation/REPORT.md` e `tests-production.json` afirmam 19 testes Chromium aprovados, junto de outras medições. Esses resultados foram fornecidos pelo autor e não foram executados ou reproduzidos neste projeto; não contam como testes nem evidências de aceite do Motion Skills Lab. O pacote contém uma demonstração de Accordion com conteúdo local estático e um botão assíncrono com timer ilustrativo: não mover dados fictícios ou simulação de sucesso para a API reutilizável. Para a arquitetura deste projeto, skills são instruções e recipes em `packages/motion-recipes` são o runtime; showcase importa pelos exports públicos, nunca por `import.meta.glob` em `skills/**/assets`.

### Contratos de motion, ciclo de vida e medição

As skills e recipes devem aplicar somente os estados pertinentes ao controle. Para Button Feedback, cobrir hover, focus-visible, press e disabled quando existirem; não impor scale operacional nem inventar loading/success para botão sem operação assíncrona. Para Accordion, documentar estado aberto/fechado, gatilho, conteúdo, semântica, interrupção e reduced motion. Conteúdo e resultado vêm sempre do estado/ação real.

Para cada sequência, identificar intenção, perfil operacional/expressivo, gatilho, alvo, duração/easing, relação com conteúdo, alternativa estática/reduzida e comportamento em mobile. Manter estados finais compreensíveis mesmo que a transição seja interrompida; preservar leitura e ação em qualquer ponto. Uma propriedade animada deve ter um proprietário de lifecycle; montar/unmount/StrictMode, atualização de preferências e repetição não podem deixar loops, listeners ou estado visual órfãos. Não adicionar Lenis, GSAP, Three.js, React Router, WebGL ou smooth scroll global à v0.1 por causa de exemplos disponíveis.

Registros de performance especificam build/rota, ação, viewport, browser, preferência de movimento e ambiente medido. Separar observação, hipótese, medição e limite. rAF não equivale a tempo de GPU; headless não equivale a dispositivo físico; orçamento é meta, não resultado. Testes E2E do pacote colaborador servem para sugerir cenários, mas precisam ser reescritos/adaptados e executados sobre este projeto.

### Contribuição e roadmap

`CONTRIBUTING.md` descreve contribuição futura por proposta/PR, revisão antes de integrar, testes e documentação, declaração de autoria/origem, créditos e preservação de notices quando código sob MIT for incorporado. Não presumir que o colaborador já é coautor do novo repositório; atribuir somente contribuição efetivamente integrada. A licença do projeto continua pendente e será escolhida antes de publicação ou distribuição open source.

Roadmap posterior pode avaliar, sempre como integração opt-in e em módulo próprio: Lenis com Motion (um único frame loop, `autoRaf: false`, execução antes da leitura de scroll do Motion e cleanup de frame/instância; versão 1.3.26+ declara respeitar e acompanhar `prefers-reduced-motion`; fallback nativo, scroll aninhado, iframes, Safari, scroll snap e long tasks no main thread devem ser avaliados); GSAP/ScrollTrigger para timelines e narrativas complexas, com contexto/cleanup por instância e termos oficiais revisados (o Standard “No Charge” não é MIT e exclui ferramentas de animação visual que concorram com o Webflow); WebGL apenas com fallback estático e orçamento de custo. Cada inclusão exigirá caso de uso concreto, comparação contra CSS/Motion, ciclo de vida isolado, testes de mobile/reduced motion, impacto de bundle e verificação de licenças. Nenhum desses motores ou módulos faz parte da v0.1.

## 13. Referências adicionais registradas

- Lenis Templates: https://lenis.dev/templates
- Motion + Lenis, integração, reduced motion e limitações: https://motion.dev/docs/lenis
- Lenis e licença MIT do código da biblioteca: https://github.com/darkroomengineering/lenis/blob/main/LICENSE
- GSAP Showcase: https://gsap.com/showcase/
- GSAP React: https://gsap.com/resources/React/
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Termos oficiais GSAP: https://gsap.com/community/standard-license/
- shadcn/ui LICENSE do repositório: https://github.com/shadcn-ui/ui/blob/main/LICENSE.md
- Unlumen UI e condições declaradas: https://unlumen-ui-docs.vercel.app/docs/license
- Details.so Inspo: https://www.details.so/inspo
- Pacote estático recebido: `material externo de referência não incorporado` — README, LICENSE, THIRD_PARTY.md, seis skills, laboratório e relatórios internos.
