# Contratos de motion — base v0.1 e candidato L1 local

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

## Presence Transition — L1 local, não publicado

Subpaths: `/presence-transition` e `/presence-transition.css`. `PresenceTransitionProps` estende `HTMLAttributes<HTMLDivElement>` exceto children/hidden/inert/aria-hidden, com `present: boolean`, `children: ReactNode`, `duration?: number` (180 ms), `reduceMotion?: boolean` (false), `returnFocusRef?: RefObject<HTMLElement | null>` e `onExitComplete?: () => void`. Ref: HTMLDivElement.

Inicial true é estático, false não produz DOM nem callback. Entrada de 6 px a zero com texto opaco; saída até −4 px/fade só após resolver foco e aplicar inert/aria-hidden. O consumidor fornece alvo externo visível, conectado, focável e não disabled/inert se puder fechar com foco interno. O componente verifica a transferência antes da saída. Alvo inválido/ausente: blur/remoção imediata sem fade; isso **não é restauração acessível satisfatória**. Foco externo não é roubado. Não é modal, não anima altura nem mantém fila de substituição.

Reverter antes da remoção mantém filhos; remoção real descarta estado. A execução anterior é cancelada em reversão/duração/redução/unmount. `onExitComplete` refere-se só à saída ainda válida, após DOM removido e ref nula, no máximo uma vez por saída. Não use callback como confirmação de negócio. Reduced motion inicial/conservador, duração zero e falha de animação encerram o visual imediatamente. SSR usa estado estático e a hidratação mantém os mesmos props/filhos. Transform/opacity do wrapper pertencem à recipe; estilos de layout são do consumidor. Duração deve ser finita e ≥0; inválida lança RangeError.

## Async State Feedback — L1 local, não publicado

Subpaths: `/async-state-feedback` e `/async-state-feedback.css`. `AsyncFeedbackState = 'idle' | 'pending' | 'success' | 'error' | 'cancelled'`; `AsyncFeedbackMessages = Readonly<Record<AsyncFeedbackState, string>>`. Props nativas de span exceto children/role/aria-live/aria-atomic/aria-busy/hidden/inert; obrigatórios `state`, `messages`; opcionais `announcement='polite'`, `duration=160` ms e `reduceMotion=false`. Ref: HTMLSpanElement.

Polite tem role=status, live=polite e atomic=true. Off omite os três, sem ocultar texto nem recriar nó. Uma live region ancestral não é neutralizada. Não aplica busy na região que precisa anunciar. Texto é imediato; só o marcador decorativo tem transição de opacidade. Cinco helpers vazios aria-hidden medem por pseudo conteúdo CSS e reservam a maior largura/altura disponível; sem CSS só a mensagem atual possui texto. Não há truncamento, altura fixa, requisição, Promise de negócio, timer, Presence ou Motion. Mensagens precisam ser cinco strings não vazias (TypeError); estado/política inválidos e duração inválida geram erro. Traduções/fontes podem alterar a reserva: testar no produto. Cancelamento e respostas vencidas são do consumidor.

## Navigation Indicator — L1 local, não publicado

Subpaths: `/navigation-indicator` e `/navigation-indicator.css`. `NavigationIndicatorItem` usa props nativas de anchor exceto id/href/children/role/aria-current/aria-selected/aria-controls/tabIndex/aria-disabled e define `id`, `href`, `label` strings. Props de nav exceto children/role/aria-label: `'aria-label': string`, `items: readonly NavigationIndicatorItem[]`, `value: string | null`, `currentType?: 'page' | 'location'` (page), `duration?: number` (180 ms), `reduceMotion?: boolean` (false). Ref: HTMLElement.

Native nav/ul/li/a; apenas o item selecionado recebe aria-current. Unknown/null mantém todos sem seleção. IDs vazios/duplicados, labels/hrefs vazios e nome ausente são inválidos. Não há tabs, filtros, router, foco composto ou interceptação do clique. Foco, seleção e navegação são independentes. Fonte da demo é hash/history; popstate/hashchange sincronizam back/forward/refresh. Replay manual avança um destino por ação, sem timer nem substituir a fonte de verdade.

Linha decorativa medida por retângulo do link relativo ao track: scroll desloca ambos, sem adicionar scrollLeft. Um ResizeObserver por instância observa track, viewport e links, nunca o marcador. Resize/font loading fazem remedição sem loop de leitura por frame; A→B→C cancela animação anterior e parte da geometria visual corrente. Sem observer, registro falho, geometria zero/incerta ou RTL: linha oculta e seleção estática por aria-current/borda/peso. SSR mantém links utilizáveis, linha oculta; hidratação não altera seleção. Cleanup remove observers, listeners, frames e controles. Motion é peer requerido.

## Consumo e estado local do L1

Os quatro exports anteriores permanecem e os seis novos elevam o total a dez, sem barrel raiz. Os três componentes são neutros e não importam o showcase. Motion é obrigatório para Accordion, Presence e Navigation; Button e Async podem ser importados sem Motion. CSS é explícito. Apenas L1 local nesta branch: não interpretar este documento como publicação, bump ou integração de Scroll Reveal. A Release v0.1.0 permanece inalterada.

## Regra permanente do laboratório — experimentação de duração

Toda demo de recipe com duração configurável em milissegundos deve expor controle conectado ao comportamento real. Não criar slider decorativo nem inferir API inexistente. Nesta worktree, as cinco demos usam slider de 0 a 800 ms, passo 10, valor numérico sempre visível, operação por teclado, default real e restauração desse default. A faixa é didática do laboratório; não é limite novo da API nem recomendação para usar 800 ms no produto.

| Demo                 | Default real | Configuração usada sem alterar o contrato                                                     |
| -------------------- | ------------ | --------------------------------------------------------------------------------------------- |
| Button Feedback      | 140 ms       | custom property pública `--msl-motion-duration-button-feedback`, encaminhada por style nativo |
| Accordion Transition | 180 ms       | prop duration                                                                                 |
| Presence Transition  | 180 ms       | prop duration                                                                                 |
| Async State Feedback | 160 ms       | prop duration, somente acabamento decorativo; texto/estado da operação são imediatos          |
| Navigation Indicator | 180 ms       | prop duration                                                                                 |

Código copiável acompanha duração selecionada e redução adicional. Movimento reduzido do sistema sempre vence: seleção continua visível para comparação, mas duração efetiva é zero e isso é informado ao lado do controle. Zero conclui o movimento imediatamente, sem esperar callback de uma animação vencida. Para CSS, alteração de duração segue o comportamento nativo de transição; para Motion, segue a interrupção/retargeting já contratados.

Os controles são exclusivamente do showcase. DurationControl reutiliza apresentação e comportamento em cinco demos, sem export para consumidores de recipes. Em Accordion, mudar/restaurar duração cancela replay ainda agendado, evitando abertura tardia do timer antigo; nova interação/replay continua disponível. Navigation mantém a identidade de items até os rótulos mudarem, preservando a medição durante foco, hash e duração.

Toda demo futura deve validar 0/default/valor alto, alterações rápidas/durante execução, teclado/foco, reduced motion, correspondência com código copiável, responsividade e ausência de overflow. Se uma futura recipe for realmente fixa e não oferecer prop nem custom property pública, documentar essa limitação e propor alternativa; não ampliar contrato silenciosamente.
