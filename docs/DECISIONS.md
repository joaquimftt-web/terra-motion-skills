# Decisões técnicas — v0.1

Registro local da implementação. Nome oficial: Terra Motion Skills; identificador público previsto: terra-motion-skills. Código original sob MIT, Copyright (c) 2026 Joaquim Freitas. Cada dependência mantém sua própria licença. O nome anterior e os identificadores técnicos preservados estão documentados em [IDENTITY.md](IDENTITY.md).

## Ambiente e versões diretas

Verificado em 19/10/2026, Node v24.20.0 e pnpm v11.24.0. Foram consultados metadados de versão, engines, peers e licença diretamente no registro npm antes da instalação. As versões abaixo foram fixadas exatamente, sem `latest` nos manifests:

| Dependência                                         |                           Versão | Uso                                                | Licença declarada |
| --------------------------------------------------- | -------------------------------: | -------------------------------------------------- | ----------------- |
| React / React DOM                                   |                           19.3.1 | UI e renderização                                  | MIT               |
| Motion                                              |                           14.3.0 | transição de layout/altura do Accordion            | MIT               |
| Vite / plugin React                                 |                    8.3.4 / 6.1.2 | dev server e build da vitrine                      | MIT               |
| TypeScript                                          |                            5.9.3 | compilação strict compatível com typescript-eslint | Apache-2.0        |
| Vitest / jsdom                                      |                   5.0.5 / 30.1.3 | testes de unidade/componentes no DOM               | MIT               |
| Testing Library React / DOM / user-event / jest-dom | 16.3.3 / 10.4.2 / 14.6.8 / 7.0.1 | testes de interação acessíveis                     | MIT               |
| Playwright                                          |                           1.64.1 | E2E em browser                                     | Apache-2.0        |
| axe-core Playwright                                 |                           4.14.0 | auditoria automática focalizada                    | MPL-2.0           |
| ESLint / typescript-eslint                          |                 10.13.0 / 8.70.1 | lint JS/TS/React hooks                             | MIT               |
| react-hooks / globals                               |                  7.1.1 / 17.13.0 | regras estáticas de hooks e globals                | MIT               |
| Prettier                                            |                           3.9.10 | formatação consistente                             | MIT               |
| Tipos React / DOM / Node                            |         19.3.0 / 19.3.0 / 26.6.5 | contratos de tipos                                 | MIT               |

`@axe-core/playwright` é MPL-2.0, não MIT. TypeScript e Playwright são Apache-2.0. Esta tabela cobre metadados diretos consultados; o conjunto transitivo e avisos efetivamente instalados será revisado no lote final. Nenhum código do pacote colaborador ou de referências visuais foi integrado.

## Escolhas de fronteira

- pnpm workspaces agrupam apenas a vitrine e os dois pacotes reutilizáveis; receitas e tokens não importam código da vitrine.
- React/Motion são peers/runtime no pacote de receitas; CSS de feedback usa transição nativa, e Motion é reservado à transição de Accordion, conforme o custo justificado na especificação.
- React 19.3.1 e Motion 14.3.0 satisfazem peers React 18/19 de Motion; Vite 8.3.4 exige Node `^20.19 || >=22.12`, atendido pelo Node verificado. Vitest 5.0.5 aceita Vite 8 e Node 24; jsdom 30.1.3 aceita Node `^24.15`, atendido pelo ambiente. TypeScript 5.9.3 está no intervalo de typescript-eslint 8.70.1 (`>=4.8.4 <6.1`).
- ESLint 10 é mantido e aceito por typescript-eslint 8.70.1 e react-hooks 7.1.1. O atual eslint-plugin-jsx-a11y 6.10.2 declara peer até ESLint 9, então não é instalado; a acessibilidade será verificada por axe e testes reais de teclado/semântica.
- O pacote `@axe-core/playwright` será usado como auditoria auxiliar; seus resultados não são certificação de acessibilidade.
- Nome e licença do produto permanecem sem definição. `private: true` nos manifests evita publicação acidental por npm nesta fase.

## Decisões confirmadas na implementação

- Node declarado como `^22.22.2 || ^24.15.0 || >=26.0.0`, interseção dos engines das ferramentas instaladas. O ambiente executado foi Node 24.20.0; outras versões não constituem matriz testada.
- Motion 14.3.0 e typescript-eslint 8.70.1 foram escolhidos em vez de releases do mesmo dia. O lockfile foi reconstruído respeitando a política de idade do pnpm, sem exceções persistidas em pnpm-workspace.yaml.
- O E2E de mudança de preferência falhou com o hook useReducedMotion de Motion 14.3.0. A fonte instalada confirmou `useState(prefersReducedMotion.current)` sem assinatura de atualização. Um hook privado com useSyncExternalStore/matchMedia resolve a mudança em tempo real e tem teste de listener/cleanup. A aplicação possui sua própria assinatura para status/replay, preservando os quatro exports públicos e a independência do pacote.
- O fade inicial do Accordion gerou violações axe de contraste em frames intermediários. A receita mantém a transição de altura e texto com opacidade plena. A versão corrigida passou nas oito auditorias (quatro viewports, painel aberto e fechado), sem excluir regras.
- React/React DOM peers foram restringidos a 19, pois a semântica inert usa suporte do React 19. Somente 19.3.1 foi executado; não declarar compatibilidade testada com React 18. O peer Motion é opcional para Button-only e necessário para Accordion, explicitamente instalado pelo showcase.
- O clipboard nativo do Windows converte LF em CRLF. O teste de browser normaliza apenas essa representação de fim de linha; o teste de componente verifica que writeText recebe exatamente o snippet exibido.
- A falha agregada do teste de tokens vinha de executar leitura de arquivo em ambiente DOM. O teste foi marcado explicitamente para Node; componentes permanecem em jsdom. A raiz recompila os pacotes antes de testes/checagens que consomem dist.
- Os documentos de skills/fontes são exportados como assets estáticos para a vitrine, sem importar runtime de skills. As cópias geradas são ignoradas pelo Git; fontes editáveis permanecem no local original.
- Não houve código incorporado de referências externas ou do ZIP encerrado pelo usuário. O desenho visual, SVG, CSS, receitas e testes são próprios deste projeto.

## 21/10/2026 — fechamento local integrado

As decisões anteriores descrevem a base histórica v0.1. No candidato aprovado localmente, há imagem raster e logo separadas, não cobertas automaticamente pela MIT. Preservam-se bytes/identidade e contratos; direitos públicos pendentes bloqueiam fontes/deploy. Testes passam a abrir o laboratório sem variável particular; workflow candidato acrescenta somente gate pré-upload. Tema e coreografias aprovados não foram refeitos.

## 21/10/2026 — estado após publicação integrada

A preparação local e o bloqueio de direitos mencionados acima são históricos. Permissões específicas dos assets foram registradas sem estender MIT às imagens. A experiência integrada foi publicada em 49d7241, run 39654669658; detalhes em [PUBLICATION_STATUS.md](PUBLICATION_STATUS.md). Release v0.1.0 preservada, Scroll Reveal isolada e npm não publicado. Nenhum contrato ou identidade visual é alterado por este fechamento editorial.
