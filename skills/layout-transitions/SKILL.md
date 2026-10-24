---
name: layout-transitions
description: 'Use when reordering a controlled list without losing input state, replacing an initial skeleton with ready content, highlighting a real controlled value change, or expanding controlled cards in the same page flow in React.'
---

# Layout transitions

## Aplicação

1. Identifique a fonte de verdade no consumidor: ordem/ids, loading ou value. Escolha somente a recipe correspondente; a biblioteca não controla operações de negócio.
2. Para uma lista que muda de posição, use **M09 Layout Reflow** com ids estáveis e reflowKey alterado somente por intenção de reorganização. Confirme a ordem real do DOM e a mesma identidade dos inputs após o movimento.
3. Para a primeira disponibilidade de conteúdo, use **M10 Skeleton-to-Content**. Quando já houve conteúdo, reloading o conserva interativo e marca busy. Se o produto exigir ocultar dados anteriores, defina outra política explícita no produto; não retire foco por remount automático.
4. Para uma alteração verdadeira de dado, use **M11 Data Change Feedback**. Passe o valor exato, formate no consumidor e verifique que a apresentação nova chega antes do efeito decorativo.
5. Verifique os exports compilados e execute os cenários aplicáveis abaixo. Conclua somente quando os controles, o dado/DOM e o código demonstrado coincidirem.

## Parâmetros

| Recipe             | Fonte controlada    | Default visual  | Limite relevante                                  |
| ------------------ | ------------------- | --------------- | ------------------------------------------------- |
| LayoutReflow       | items e reflowKey   | duration 240 ms | ids strings únicos; ul/li; só posição             |
| SkeletonToContent  | loading             | duration 180 ms | duração só da borda decorativa; conteúdo imediato |
| DataChangeFeedback | value string/number | duration 220 ms | sem interpolação; Object.is identifica mudança    |

Todas aceitam reduceMotion e ref nativa; sistema reduzido prevalece, zero é imediato e durações negativas/não finitas são erro. Nenhum CSS externo é necessário. M10 aceita minBlockSize em px (number) ou unidade CSS conhecida (string); isso não elimina layout shift universal. M10 announcement é polite por padrão e off remove status/live; M11 announcement é off por padrão e polite usa somente o valor atual. Evite regiões de anúncio concorrentes.

Contratos completos: [L3_CONTRACTS.md](../../docs/L3_CONTRACTS.md). Para as regras particulares, consulte [M09](../../docs/recipes/layout-reflow.md), [M10](../../docs/recipes/skeleton-to-content.md) e [M11](../../docs/recipes/data-change-feedback.md).

## Exemplo

Exemplos completos, compilados em TypeScript strict contra dist e manifests públicos:

```tsx
import { useState } from 'react';
import { LayoutReflow } from '@motion-skills-lab/motion-recipes/layout-reflow';

export function OrderedNotes() {
  const [ids, setIds] = useState(['a', 'b', 'c']);
  const [intent, setIntent] = useState(0);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIds((v) => [...v].reverse());
          setIntent((v) => v + 1);
        }}
      >
        Reordenar
      </button>
      <LayoutReflow
        reflowKey={intent}
        aria-label="Notas"
        duration={240}
        items={ids.map((id) => ({
          id,
          content: (
            <label>
              Nota {id}
              <input defaultValue="" />
            </label>
          ),
        }))}
      />
    </>
  );
}
```

```tsx
import { useState } from 'react';
import { SkeletonToContent } from '@motion-skills-lab/motion-recipes/skeleton-to-content';

export function ContentAvailability() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setLoading((v) => !v)}>
        Alternar disponibilidade
      </button>
      <SkeletonToContent
        loading={loading}
        skeleton={<p>Preparando conteúdo…</p>}
        minBlockSize={120}
        duration={180}
      >
        <label>
          Nota real
          <input defaultValue="Preservada em recargas" />
        </label>
      </SkeletonToContent>
    </>
  );
}
```

```tsx
import { useState } from 'react';
import { DataChangeFeedback } from '@motion-skills-lab/motion-recipes/data-change-feedback';

export function ExactData() {
  const [value, setValue] = useState('R$ 1.234,56');
  return (
    <>
      <button
        type="button"
        onClick={() => setValue((v) => (v === 'R$ 1.234,56' ? 'R$ 9.876,54' : 'R$ 1.234,56'))}
      >
        Trocar dado de demonstração
      </button>
      <DataChangeFeedback value={value} duration={220} announcement="off" />
    </>
  );
}
```

## Restrições

- M09 não é drag-and-drop, shared element ou router. O consumidor transfere foco antes de excluir o próprio item focado; reordenação preserva nós, remoção não promete restauração de foco.
- ReflowKey estável não solicita nova animação. Geometria sem suporte e contexto de SSR usam lista estática. Conteúdo interno pode ter seu próprio transform; o li de posição pertence à recipe.
- M10 não espera animação para liberar conteúdo e não executa requests, timeout de sucesso ou presença de M03. Skeleton é decorativo, sem controle falso operável. Uma nova instância pode iniciar outro carregamento; preserve o estado da instância enquanto precisar conservar foco.
- M11 não faz parsing financeiro, polling, arredondamento automático ou cópia de valor anterior. Mudança de formatador altera a apresentação; não representa um novo value. Uma região polite pode anunciar esse novo texto formatado; escolha off quando o produto já anuncia o dado.
- Estas recipes são neutras e não importam showcase ou assets Terra Commerce. Nenhuma aplica identidade visual da landing.

## Acessibilidade

Use nomes acessíveis e ordem de leitura real. Verifique foco visível, Tab e Shift+Tab antes/depois de reordenar; não mova um input focado para outro nó por key de índice. Conteúdo real deve ser legível sem JS ou com falha de animação. Reduced motion inicial ou ao vivo encerra a decoração sem ocultar informação. O indicador textual de M11 continua disponível; nunca dependa somente da cor. No reloading de M10, o produto decide se operações precisam ser desabilitadas, pois o conteúdo permanece disponível.

## Validação

1. Build/exports e exemplos: pnpm check:consumer e pnpm validate:skills. Confirmar erros de tipos para ids numéricos, loading não booleano e formatadores que retornam elementos.
2. Em 320/390/1024/1440 px: trocar ordem repetidamente, incluir/remover item, alterar duração 0/default/800, mudar viewport sem mudar reflowKey e preservar input/foco.
3. Em M10: primeira carga, ready imediato, reloading com foco, mensagens longas, reserva conhecida/sem reserva, announcement off e reduced motion ao vivo.
4. Em M11: valor igual em rerender, valor novo, update rápido, novo formatador, duração durante efeito, unmount e marcador estático com reduced motion.
5. Executar SSR/hidratação saudável e o controle negativo que injeta mismatch real, fixture independente, axe, StrictMode e cleanup. Separar verificações executadas de limitações de navegador, leitor de tela, dispositivo e zoom nativo.

Diagnóstico: se M09 parece estático, confira reflowKey, foco/reduced motion e geometria antes de aumentar duração. Se M10 mantém conteúdo em loading, isso é revalidação deliberada, não atraso do skeleton. Se M11 parece alterar dado, compare value/formatValue do consumidor; a recipe não interpola valores.

## M13 — Expandable Cards

Use para expandir um card no próprio fluxo mantendo preview, formulário, ordem DOM e seleção controlada. Para apenas reordenar use LayoutReflow; para disclosure vertical simples use AccordionTransition. Não use como modal/drawer, Shared Element entre páginas ou roteador.

Parâmetros: items com id/title strings, media opcional e preview/details ReactNode; selectedId string|null e onSelectedIdChange obrigatórios; duration280ms e reduceMotion=false; ref HTMLUListElement. Zero imediato, sistema prevalece. Não existe CSS obrigatório. [Contrato e atributos públicos](../../docs/recipes/expandable-cards.md).

Procedimento para agentes: valide ids/seleção/duração; use dados imutáveis e keys estáveis nos slots; dê nome ao ul e contexto h2 para os títulos h3; escreva CSS do consumidor por data-expanded/data-peer/data-lone; não anime transform/opacidade em concorrência. Em SSR, mesmos dados/seleção e identifierPrefix exclusivo por root. Não copie identidade mineral para biblioteca.

```tsx
import { useState } from 'react';
import { ExpandableCards } from '@motion-skills-lab/motion-recipes/expandable-cards';
export function ProjectCards() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <section>
      <h2>Projetos</h2>
      <ExpandableCards
        aria-label="Projetos"
        items={[
          {
            id: 'a',
            title: 'Projeto A',
            preview: <input aria-label="Nota A" defaultValue="" />,
            details: <p>Detalhes A</p>,
          },
          {
            id: 'b',
            title: 'Projeto B',
            preview: <p>Resumo B</p>,
            details: <a href="#next">Continuar</a>,
          },
        ]}
        selectedId={selectedId}
        onSelectedIdChange={setSelectedId}
        duration={280}
      />
    </section>
  );
}
```

Validação obrigatória: foco externo antes de hidden/removal, falha de focus conserva DOM acessível; A→B→C/Escape/Tab/ShiftTab; input persiste enquanto item existe; empty fallback nomeado; duração0/default/800 e mudança ao vivo; reduced motion inicial/ao vivo; 320/390/1024/1440 sem overflow; imagem tardia; projeção intermediária real; SSR/hidratação e negativo; duas instâncias/roots; StrictMode/cleanup e consumidor só dist. Nenhum teste planejado deve ser declarado executado. Conteúdo longo, imagens/traduções e zoom exigem validação real do produto.
