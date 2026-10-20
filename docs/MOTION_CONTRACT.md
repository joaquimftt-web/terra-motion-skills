# Contratos de motion — v0.1

## Button Feedback

Import: `@motion-skills-lab/motion-recipes/button-feedback`, mais `/button-feedback.css`.
`ButtonFeedbackProps` estende props nativas de botão e acrescenta `reduceMotion?: boolean` (default false). Encaminha ref, conteúdo, eventos e className. O consumidor fornece a ação e `type`; a receita preserva o default nativo de formulário. Não gerencia loading/success/error.

CSS scoped: `.msl-button-feedback`. Feedback por cor/borda em hover de ponteiro preciso e press; outline em focus-visible. Sem transform/scale. Disabled nativo não recebe feedback ativo. Alvo mínimo 44 px com fonte padrão. Timing default 140 ms e easing cubic-bezier(0.2, 0, 0, 1); customizável com `--msl-motion-duration-button-feedback`, `--msl-motion-easing-standard` e `--msl-button-feedback-radius`. Aparência do showcase não é dependência.

CSS reage a `prefers-reduced-motion` durante a sessão; a prop true zera adicionalmente a duração. False não remove a preferência do sistema. Toque não depende de hover. O consumidor mantém a responsabilidade por contraste de cores personalizadas e por bloquear eventos caso escolha apenas `aria-disabled` em vez de `disabled`.

## Accordion Transition

Import: `@motion-skills-lab/motion-recipes/accordion-transition`, mais `/accordion-transition.css`.

| Prop                          | Contrato                                                            |
| ----------------------------- | ------------------------------------------------------------------- |
| `open: boolean`               | fonte de verdade controlada pelo consumidor                         |
| `onOpenChange(next: boolean)` | solicita mudança; não altera estado internamente                    |
| `trigger: ReactNode`          | rótulo/conteúdo não interativo do botão nativo                      |
| `children: ReactNode`         | conteúdo real, mantido no DOM                                       |
| `duration?: number`           | default 180 ms; finita e >= 0, inválida lança RangeError            |
| `reduceMotion?: boolean`      | default false; redução adicional ao sistema                         |
| `id?: string`                 | base para sufixos `-trigger`/`-panel`; consumidor garante unicidade |
| `className?: string`          | classe adicional no wrapper                                         |

Gatilho nativo com `type=button`, aria-expanded/controls. Painel com role region e aria-labelledby; fechado recebe aria-hidden e inert imediatamente, inclusive durante o fechamento visual. Enter/Espaço são nativos; não implementa setas, grupo de exclusividade ou foco composto. `useId` gera associações únicas quando id não é fornecido. No fechamento controlado com foco interno, devolve foco ao gatilho.

Motion é o proprietário único da altura; `initial=false` evita animação de entrada inesperada. Mudança de open interrompe/reverte sem bloquear cliques. O modo reduzido usa duração zero. Tokens tipados fornecem duração/easing; as receitas não importam skills/showcase. Não há timer de negócio. Não anime outra vez altura do painel em CSS do consumidor.

Faixas de design iniciais: Button 110–160 ms, Accordion 160–220 ms. Durações não comprovam FPS. Layout/altura tem custo de layout aceito para este disclosure pequeno; conteúdo extenso deve ser medido no contexto consumidor.

## Dependências e limites

React/React DOM são peers; Motion é peer opcional para consumo exclusivo de Button e obrigatório para Accordion. O showcase declara Motion diretamente. Os testes executados e limitações finais serão registrados em VALIDATION.md. Não há suporte certificado a leitores de tela, dispositivo físico ou browsers não executados. O consumidor deve validar hierarquia de headings, contraste e conteúdo dinâmico no próprio produto.
