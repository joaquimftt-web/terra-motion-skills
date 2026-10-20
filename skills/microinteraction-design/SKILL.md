---
name: microinteraction-design
description: 'Use when designing or reviewing Button Feedback and Accordion Transition states, semantic interaction, keyboard feedback and accessibility in Terra Motion Skills.'
---

# Microinteraction design

Faça o controle comunicar seu estado real. Escolha somente os estados que a operação possui e mantenha o consumidor responsável pelos dados e ações.

## Aplicação

Use para feedback de controles e disclosure de conteúdo em React. Escolha [Button Feedback](../../packages/motion-recipes/src/button-feedback/ButtonFeedback.tsx) para botão semântico com feedback de cor; escolha [Accordion Transition](../../packages/motion-recipes/src/accordion-transition/AccordionTransition.tsx) para conteúdo aberto/fechado controlado. Estas receitas não resolvem links, dialogs, menus com teclado composto nem uma operação assíncrona completa.

Comece identificando: ação real, rótulo acessível, estados aplicáveis, estado controlado pelo consumidor e forma de cancelar ou reverter a interação. Preserve o contrato existente antes de alterar uma receita.

## Parâmetros

| Estado                | Button Feedback                    | Accordion Transition                        |
| --------------------- | ---------------------------------- | ------------------------------------------- |
| hover                 | cor, somente em ponteiro com hover | dispensável                                 |
| foco visível          | outline nativo estilizado          | outline no gatilho                          |
| press                 | cor, sem scale                     | clique/Enter/Espaço pede inversão de `open` |
| disabled              | prop nativa, ação bloqueada        | não existe prop disabled nesta API          |
| aberto/fechado        | não aplicável                      | consumidor controla `open` e `onOpenChange` |
| loading/success/error | não são gerenciados pela receita   | não aplicáveis                              |

`ButtonFeedback` encaminha props nativas, `className`, conteúdo e ref; `reduceMotion` é `false` por padrão. Preserve o comportamento nativo de `type`: use explicitamente `type="button"` para ações que não submetem formulários. Duração CSS default 140 ms, via `--msl-motion-duration-button-feedback`; raio via `--msl-button-feedback-radius`.

`AccordionTransition` recebe `open`, `onOpenChange`, `trigger` e `children`; opcionais: `duration=180` ms (finita, não negativa), `reduceMotion=false`, `id` base e `className` no wrapper. Não invente props nem troque esse contrato por dados do showcase. IDs gerados são únicos; IDs explícitos precisam ser únicos no documento.

## Exemplo

```tsx
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';
import '@motion-skills-lab/motion-recipes/button-feedback.css';

export function ConfirmButton({
  onConfirm,
  disabled = false,
}: {
  onConfirm: () => void;
  disabled?: boolean;
}) {
  return (
    <ButtonFeedback type="button" disabled={disabled} onClick={onConfirm}>
      Confirmar seleção
    </ButtonFeedback>
  );
}
```

Esse exemplo encaminha uma ação real; não anuncia sucesso. Button requer React/React DOM. Accordion requer também Motion. Importe CSS por subpath explícito; não dependa da aparência ou do runtime da vitrine. Para um exemplo completo do Accordion, consulte [motion-foundations](../motion-foundations/SKILL.md).

## Restrições

- Não use timers para simular sucesso, salvação, pagamento ou carregamento. Estados assíncronos pertencem à operação real do consumidor, com erro e cancelamento coerentes.
- Não aplique scale, deslocamento ou informação disponível apenas em hover ao botão operacional.
- Não coloque um botão/link dentro de `trigger`, que já está dentro de botão nativo. Conteúdo do painel pode incluir ações normais.
- Não bloqueie interação durante uma transição. `onOpenChange` solicita uma mudança; o componente só abre quando `open` muda.
- Se desmontar uma demo ou iniciar replay, cancele trabalhos pendentes antes de remover o componente. Não adicione um motor ou receita fora da v0.1.

## Acessibilidade

Valide nome acessível, foco visível, Enter/Espaço, Tab/Shift+Tab e toque sem hover. `disabled` nativo bloqueia ação; `aria-disabled` isolado não bloqueia eventos. O Accordion associa gatilho/painel por ARIA e mantém o painel fechado inerte e oculto da árvore acessível. Se o consumidor fechar um painel com foco interno, o foco retorna ao gatilho.

O sistema operacional sempre vence: a prop `reduceMotion` só acrescenta redução. A lógica e o texto precisam permanecer imediatos, sem aguardar callbacks de animação. Mudanças de preferência durante a sessão devem ser verificadas em browser.

## Validação

Execute os testes da receita alterada e um consumo pelos exports públicos. No browser, confirme foco/press, disabled, toque, abertura/fechamento/reversões, conteúdo oculto fora da tabulação, IDs únicos e preferência reduzida real. Em StrictMode, monte/desmonte e repita. Teste conteúdo longo e viewport de 320 px.

Apresente a matriz de estados aplicáveis, props usadas, comandos/resultados e pendências. Revise a solução se ela anunciar sucesso sem operação concluída, tornar conteúdo fechado navegável, perder foco ou reativar movimento contra a preferência do sistema. Auditoria axe complementa esses cenários; não os substitui.
