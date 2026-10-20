---
name: motion-foundations
description: 'Use when choosing or reviewing timing, easing, interruption, reduced motion and lifecycle for React interfaces using Terra Motion Skills recipes.'
---

# Motion foundations

Transforme a intenção da interface em uma decisão de motion verificável. Use o estado real do React como fonte de verdade; a conclusão de uma animação não autoriza ações de negócio.

## Aplicação

Aplique ao escolher movimento para feedback ou disclosure em React. Nesta v0.1, existem Button Feedback e Accordion Transition. Para feedback apenas de cor, prefira a receita CSS. Para altura de conteúdo controlado, use Accordion com Motion. Não aplique como instrução para scroll global, timelines, modal, WebGL ou animação decorativa contínua.

Antes de editar, leia o contrato público da receita: [Button](../../packages/motion-recipes/src/button-feedback/ButtonFeedback.tsx) ou [Accordion](../../packages/motion-recipes/src/accordion-transition/AccordionTransition.tsx). Importe por subpaths públicos; não importe a vitrine.

## Parâmetros

Registre uma ficha curta: intenção, perfil operacional, gatilho, alvo, estados, duração em ms, easing, interrupção, alternativa reduzida, toque e método de validação.

| Receita              | Default        | Gatilho                                | Alternativa reduzida    |
| -------------------- | -------------- | -------------------------------------- | ----------------------- |
| Button Feedback      | 140 ms, CSS    | hover em ponteiro preciso, foco, press | cores/estados imediatos |
| Accordion Transition | 180 ms, Motion | botão nativo ou estado controlado      | altura imediatas        |

Use inicialmente 110–160 ms para Button e 160–220 ms para Accordion. São faixas de design, não medições de performance. Accordion aceita `duration` finita e não negativa em milissegundos; a vitrine restringe o controle à faixa 160–220. Tokens tipados estão em `@motion-skills-lab/motion-tokens`; a curva padrão é `[0.2, 0, 0, 1]`.

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
