---
name: microinteraction-design
description: 'Use when designing or reviewing control feedback, disclosure, removable presence, async status or native link selection in Terra Motion Skills.'
---

# Microinteraction design

Faça o controle comunicar seu estado real. Escolha somente os estados que a operação possui e mantenha o consumidor responsável pelos dados e ações.

**Publicado na main e no GitHub Pages:** 8 recipes, 3 skills operacionais e 13 subpaths explícitos de recipes/CSS. A [PR #1](https://github.com/joaquimftt-web/terra-motion-skills/pull/1) foi integrada por merge commit `491a934169966de481710a63fa7b4a2bb19fdc3e`, incluindo L1/L2 e a composição horizontal da Landing V4. [CI/build e deploy aprovados](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39881855054). Pacotes npm não publicados; Release/tag v0.1.0 histórica e inalterada.

## Aplicação

Use para feedback de controles e disclosure de conteúdo em React. Escolha [Button Feedback](../../packages/motion-recipes/src/button-feedback/ButtonFeedback.tsx) para botão semântico com feedback de cor; escolha [Accordion Transition](../../packages/motion-recipes/src/accordion-transition/AccordionTransition.tsx) para conteúdo aberto/fechado controlado. Essas duas receitas originais não resolvem links, dialogs, menus com teclado composto nem uma operação assíncrona completa. As três adições L1 integradas na main pela PR #1 estão detalhadas ao final, incluindo navegação nativa e apresentação de estados.

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
- Se desmontar uma demo ou iniciar replay, cancele trabalhos pendentes antes de remover o componente. Não adicione motor ou recipe além do escopo autorizado. Os contratos adicionais locais L1 estão ao final.

## Acessibilidade

Valide nome acessível, foco visível, Enter/Espaço, Tab/Shift+Tab e toque sem hover. `disabled` nativo bloqueia ação; `aria-disabled` isolado não bloqueia eventos. O Accordion associa gatilho/painel por ARIA e mantém o painel fechado inerte e oculto da árvore acessível. Se o consumidor fechar um painel com foco interno, o foco retorna ao gatilho.

O sistema operacional sempre vence: a prop `reduceMotion` só acrescenta redução. A lógica e o texto precisam permanecer imediatos, sem aguardar callbacks de animação. Mudanças de preferência durante a sessão devem ser verificadas em browser.

## Validação

Execute os testes da receita alterada e um consumo pelos exports públicos. No browser, confirme foco/press, disabled, toque, abertura/fechamento/reversões, conteúdo oculto fora da tabulação, IDs únicos e preferência reduzida real. Em StrictMode, monte/desmonte e repita. Teste conteúdo longo e viewport de 320 px.

Apresente a matriz de estados aplicáveis, props usadas, comandos/resultados e pendências. Revise a solução se ela anunciar sucesso sem operação concluída, tornar conteúdo fechado navegável, perder foco ou reativar movimento contra a preferência do sistema. Auditoria axe complementa esses cenários; não os substitui.

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

### Exemplo — feedback controlado e links reais (L1)

```tsx
import {
  AsyncStateFeedback,
  type AsyncFeedbackState,
} from '@motion-skills-lab/motion-recipes/async-state-feedback';
import '@motion-skills-lab/motion-recipes/async-state-feedback.css';
import { NavigationIndicator } from '@motion-skills-lab/motion-recipes/navigation-indicator';
import '@motion-skills-lab/motion-recipes/navigation-indicator.css';

const messages = {
  idle: 'Pronto',
  pending: 'Processando',
  success: 'Concluído',
  error: 'Falhou',
  cancelled: 'Cancelado',
};
export function ProductFeedback({ state }: { state: AsyncFeedbackState }) {
  // O produto já possui a única live region da operação.
  return (
    <>
      <AsyncStateFeedback state={state} messages={messages} announcement="off" />
      <p role="status">{messages[state]}</p>
    </>
  );
}
export function DocumentNavigation({ section }: { section: string | null }) {
  return (
    <NavigationIndicator
      aria-label="Neste documento"
      currentType="location"
      value={section}
      items={[
        { id: 'overview', href: '#overview', label: 'Visão geral' },
        { id: 'details', href: '#details', label: 'Detalhes' },
      ]}
    />
  );
}
```

No produto, conecte `section` à URL/hash e mantenha destinos reais com IDs `overview` e `details`. Assine `hashchange` e `popstate`, leia o estado inicial e remova listeners no unmount; o indicador não é roteador. Nunca marque sucesso apenas porque o marcador terminou sua transição. A demonstração do laboratório identifica explicitamente sua simulação controlada.

### Precisões de consumo L1

`onExitComplete?: () => void` não recebe argumentos; chama no máximo uma vez por saída válida, após remover o DOM e limpar a ref pública HTMLDivElement. Não sinaliza remoção de uma execução cancelada. Async deixa a concorrência para o produto: identifique a operação ativa e descarte resultados com ID antigo ou após desmontagem, mesmo quando não houver cancelamento físico. No laboratório, a fixture mostra esse descarte sem timer de sucesso.

Navigation: default `currentType='page'` (page/location), `duration=180` ms, `reduceMotion=false`, ref HTMLElement. `value=null` ou não encontrado mantém todos sem seleção; nome acessível, IDs/hrefs/labels não vazios e IDs únicos são exigidos. Hash desconhecido e algoritmo de próximo destino são regras da demo, não da API; na demo, desconhecido não seleciona e o avanço começa no primeiro item.
