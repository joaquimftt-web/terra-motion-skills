---
name: motion-foundations
description: 'Use when choosing or reviewing timing, easing, interruption, reduced motion and lifecycle for React interfaces using Terra Motion Skills recipes.'
---

# Motion foundations

Transforme a intenção da interface em uma decisão de motion verificável. Use o estado real do React como fonte de verdade; a conclusão de uma animação não autoriza ações de negócio.

**Catálogo desta atualização L3:** 11 recipes, 4 skills operacionais e 16 subpaths explícitos de recipes/CSS. Para layout e estados dinâmicos, consulte [layout-transitions](../layout-transitions/SKILL.md). L1/L2 foram publicados pela PR #1 (merge 491a934, CI/deploy 39881855054); esse registro é histórico e não valida L3. A integração e publicação de L3 exigem seus próprios gates. Pacotes npm não publicados; Release/tag v0.1.0 histórica e inalterada.

## Aplicação

Aplique ao escolher movimento para feedback ou disclosure em React. A Release histórica v0.1.0 incluiu Button Feedback e Accordion Transition; as três adições L1 integradas na main pela PR #1 estão descritas ao final. Para feedback apenas de cor, prefira a receita CSS. Para altura de conteúdo controlado, use Accordion com Motion. Não aplique como instrução para scroll global, timelines, modal, WebGL ou animação decorativa contínua.

Antes de editar, leia o contrato público da receita: [Button](../../packages/motion-recipes/src/button-feedback/ButtonFeedback.tsx) ou [Accordion](../../packages/motion-recipes/src/accordion-transition/AccordionTransition.tsx). Importe por subpaths públicos; não importe a vitrine.

## Parâmetros

Registre uma ficha curta: intenção, perfil operacional, gatilho, alvo, estados, duração em ms, easing, interrupção, alternativa reduzida, toque e método de validação.

| Receita              | Default        | Gatilho                                | Alternativa reduzida    |
| -------------------- | -------------- | -------------------------------------- | ----------------------- |
| Button Feedback      | 140 ms, CSS    | hover em ponteiro preciso, foco, press | cores/estados imediatos |
| Accordion Transition | 180 ms, Motion | botão nativo ou estado controlado      | altura imediatas        |

Use inicialmente 110–160 ms para Button e 160–220 ms para Accordion. São faixas de design, não medições de performance. Accordion aceita `duration` finita e não negativa em milissegundos; o laboratório permite experimentar 0–800 ms, passo 10, com valor visível, inicialização e restauração do default real (Button 140; Accordion/Presence/Navigation 180; Async 160 ms). Button usa a custom property pública existente `--msl-motion-duration-button-feedback`, sem prop nova. A faixa experimental não altera as recomendações de design nem os limites públicos da recipe. Tokens tipados estão em `@motion-skills-lab/motion-tokens`; a curva padrão é `[0.2, 0, 0, 1]`.

## Exemplo

Exemplo de consumo, sem depender do showcase:

```tsx
import { useState } from 'react';
import { AccordionTransition } from '@motion-skills-lab/motion-recipes/accordion-transition';
import '@motion-skills-lab/motion-recipes/accordion-transition.css';

export function DeliveryDetails() {
  const [open, setOpen] = useState(false);
  return (
    <AccordionTransition open={open} onOpenChange={setOpen} trigger="Entrega" duration={180}>
      <p>O conteúdo vem do consumidor e permanece no DOM.</p>
    </AccordionTransition>
  );
}
```

Requer React/React DOM e Motion instalados pelo consumidor. O pacote de tokens é dependência das receitas. A folha de tokens é opcional: as receitas têm fallback para os defaults.

## Restrições

- Uma propriedade animada tem um proprietário: Motion controla a altura do painel; não adicione outra animação CSS nesses mesmos valores.
- Mudanças rápidas de `open` devem reverter a transição. Não bloqueie cliques até a animação terminar, nem crie timer para fingir sucesso.
- Não crie contexto, motor, pacote ou hook público sem uso concreto nesta versão. O conteúdo estático final deve continuar compreensível sem animação.
- Ao criar efeitos fora das receitas, limpe listeners, timers, frames e observers no unmount. Verifique remount em StrictMode.

## Acessibilidade

O sistema operacional sempre tem prioridade: `reduceMotion={false}` não reativa movimento diante de `prefers-reduced-motion: reduce`. `true` pede redução adicional. Não esconda informação útil por hover. Preserve botão nativo, foco visível e navegação por teclado; conteúdo fechado do Accordion fica `aria-hidden` e `inert`. Não coloque controles interativos dentro do conteúdo de `trigger`.

## Validação

Execute typecheck, build e testes da receita alterada; valide no browser abertura/fechamento, reversão rápida, Enter/Espaço, Tab/Shift+Tab, preferência do sistema mudando durante a sessão e viewport de 320 px. Teste unmount/remount e IDs únicos. Um resultado jsdom não comprova layout, toque ou preferência real do browser.

Para alegar performance, registre build, browser, viewport, preferência e cenário medido. Não converta tempo de duração em FPS nem resultado headless em garantia de dispositivo físico. Entregue: ficha de motion, mudança concreta, comandos/resultados e limites da evidência. Revise se houver foco perdido, conteúdo fechado alcançável, preferência ignorada ou estado visual divergente do React.

## L1 — Presence, Async e Navigation (main e Pages; npm não publicado)

As três APIs abaixo estão integradas na main e demonstradas no Pages, sem bump de versão ou publicação npm. Os contratos anteriores permanecem válidos. Consulte os [contratos completos](../../docs/MOTION_CONTRACT.md) antes de editar.

| Recipe               | Default                                        | Fonte de verdade           | Limite                                             |
| -------------------- | ---------------------------------------------- | -------------------------- | -------------------------------------------------- |
| Presence Transition  | 180 ms; entrada 6 px → 0, saída −4 px com fade | `present`                  | bloco único; sem modal, altura ou fila             |
| Async State Feedback | 160 ms; apenas marcador decorativo             | `state` + cinco `messages` | sem Promise, timers de sucesso ou operação interna |
| Navigation Indicator | 180 ms; linha decorativa                       | `value` + links `items`    | horizontal LTR; sem tabs, router ou scroll spy     |

### Procedimento operacional para o agente

1. Identifique se o conteúdo será removido, se um estado de operação será apresentado ou se uma navegação real terá indicação. Não use Presence para representar loading nem Async para executar a operação.
2. Leia os tipos por subpath público e importe o CSS correspondente. Motion é necessário para Presence/Navigation/Accordion; Button/Async funcionam sem Motion. Não importe o laboratório.
3. Presence: `present=true` inicial é estático; `false` não renderiza. Para fechamento com foco interno, forneça `returnFocusRef` externo, conectado, visível e focável. O foco sai antes de `inert`/`aria-hidden`. Alvo ausente, inválido ou desconectado causa blur/remoção imediata: é fallback de segurança, **não restauração acessível correta**. Corrija a integração do produto. `onExitComplete` só é válido depois da remoção/ref nula; reabertura, desmontagem e geração antiga cancelam o callback. Reverter antes da remoção conserva filhos; remover de fato perde seu estado. Não anime transform/opacity do wrapper externamente.
4. Async: forneça `idle`, `pending`, `success`, `error`, `cancelled` e mensagens não vazias. `announcement="off"` omite `role`, `aria-live` e `aria-atomic`; não use `role="status"` junto com off. Uma live region ancestral continua sob responsabilidade do produto. As cinco mensagens reservam a maior geometria via CSS; sem CSS, só o texto atual aparece. Teste fontes, traduções, quebra e 320 px/zoom nativo. Conteúdo muito longo pode aumentar a reserva; não fixe altura cortando texto.
5. Navigation: o produto controla `value`; links têm `id`, `href`, `label` e props nativas. Foco/hover não selecionam; clique navega de verdade. No laboratório, a fonte é URL/hash com `hashchange` e `popstate`, inclusive back/forward. Replay manual avança só um destino, sem sequência automática/timer. A medição usa link menos track, sem somar scrollLeft. Falta/falha de ResizeObserver, geometria zero/incerta ou RTL mantém indicação estática de `aria-current`; não esconda o link. A→B→C retargeta do estado visual corrente.
6. Em todos: duração finita, ≥0, em ms; zero é imediato. `reduceMotion=true` soma redução; false nunca supera o sistema. Alterar duração/redução ou desmontar deve encerrar recursos antigos. Não medir performance por duração de animação.

### Exemplo — bloco dispensável independente

```tsx
import { useRef, useState } from 'react';
import { PresenceTransition } from '@motion-skills-lab/motion-recipes/presence-transition';
import '@motion-skills-lab/motion-recipes/presence-transition.css';

export function RemovableNotice() {
  const [present, setPresent] = useState(true);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={trigger} type="button" onClick={() => setPresent((v) => !v)}>
        Alternar aviso
      </button>
      <PresenceTransition present={present} returnFocusRef={trigger} duration={180}>
        <p>Um contexto removível.</p>
        <button type="button" onClick={() => setPresent(false)}>
          Dispensar
        </button>
      </PresenceTransition>
    </>
  );
}
```

### Validação específica L1

Antes de entregar, teste SSR/hidratação real (não só string), StrictMode/unmount, duração zero/alterada, redução inicial/durante execução, foco interno com alvo válido e inválido, reversões, callback após DOM removido, textos longos/sem CSS, A→B→C e rail rolado/redimensionado. Compilar exemplos e passar axe não comprova anúncio em leitor de tela nem desempenho físico. Preserve logs de falhas e diferencie evidência atual de histórica.

### Precisões de consumo L1

Presence aceita `onExitComplete?: () => void`, sem argumentos: no máximo uma chamada por saída válida, depois da remoção efetiva e da ref pública HTMLDivElement ficar nula. Duração alterada pode reiniciar o percurso restante a partir do valor visual corrente; nunca transforma callback antigo em saída válida. A decisão visual da entrada/saída permanece sujeita à revisão humana.

Async não escolhe política de concorrência: no consumidor, atribua um identificador monotônico a cada operação; só aplique a resposta se o identificador ainda for o ativo e o consumidor estiver montado. Cancele quando possível e descarte resoluções vencidas mesmo que o cancelamento físico não seja possível. Não invente sucesso ou timers. A fixture do laboratório exercita cancelamento, retry, resposta imediata e resolução fora de ordem; isso é exemplo, não gerenciador público.

Navigation tem `currentType='page'` (opções page/location), `duration=180` ms, `reduceMotion=false`; `value=null` ou desconhecido não seleciona item. Nome acessível obrigatório; IDs/hrefs/labels não vazios e IDs únicos por instância. Ref pública HTMLElement. Na demo, hash desconhecido significa nenhuma seleção; próximo destino avança a partir do atual, iniciando no primeiro se não houver seleção. É regra da demo, não método público de replay.
