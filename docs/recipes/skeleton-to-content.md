# Skeleton-to-Content — M10

`SkeletonToContent` troca o skeleton pelo conteúdo assim que `loading` se torna
`false`. O texto real nunca recebe fade, escala ou espera de duração. Uma borda
neutra independente pode indicar a disponibilidade por 180 ms.

```tsx
import { SkeletonToContent } from '@motion-skills-lab/motion-recipes/skeleton-to-content';

<SkeletonToContent
  loading={loading}
  skeleton={<div>Preparando detalhes…</div>}
  minBlockSize="12rem"
>
  <ProductDetails product={product} />
</SkeletonToContent>;
```

O consumidor controla a busca e fornece conteúdo adequado ao estado atual.
O subpath acima é o destino público da integração L3; o módulo não depende do
showcase, de assets, de CSS externo nem de Presence Transition.

## API

| Propriedade    | Padrão                   | Contrato                                                         |
| -------------- | ------------------------ | ---------------------------------------------------------------- |
| `loading`      | obrigatória              | Controla `aria-busy` e o skeleton inicial.                       |
| `skeleton`     | obrigatória              | ReactNode inicial dentro de `inert` e `aria-hidden`.             |
| `children`     | obrigatória              | Conteúdo real disponível no primeiro commit pronto.              |
| `duration`     | `180`                    | Milissegundos apenas da borda decorativa; zero é imediato.       |
| `reduceMotion` | `false`                  | Desativa a decoração; a preferência do sistema também prevalece. |
| `minBlockSize` | ausente                  | Número finito não negativo em px ou string CSS do consumidor.    |
| `announcement` | `'polite'`               | `'polite'` ou `'off'`.                                           |
| `loadingLabel` | `'Carregando conteúdo.'` | Texto de status durante carregamento/revalidação.                |
| `readyLabel`   | `'Conteúdo disponível.'` | Texto de status pronto.                                          |
| `ref`          | ausente                  | Ref da div nativa, incluindo cleanup de callback do React 19.    |

Aceita propriedades nativas da div, exceto `children`,
`dangerouslySetInnerHTML` e `aria-busy`. A recipe controla essas propriedades.
Propriedades, eventos, classe e estilos nativos pertencem à div com `aria-busy`.
`minBlockSize` explícito prevalece sobre `style.minBlockSize`. A div tem
`position: relative` por padrão para ancorar a borda; preserve um contexto de
posicionamento ao fornecer `style.position`.

`duration` inválida, infinita ou negativa lança `RangeError`. O mesmo vale para
valores numéricos inválidos de `minBlockSize`; strings CSS são responsabilidade
do consumidor. Reservar espaço conhecido reduz mudanças de geometria, sem
garantir ausência universal de layout shift.

## Conteúdo, foco e anúncios

Na primeira disponibilidade, o skeleton sai no mesmo commit e os controles reais
ficam utilizáveis. Depois disso, `loading=true` mantém os filhos reais montados,
legíveis e interativos: apenas atualiza `aria-busy` e o status. Não há overlay de
skeleton. O consumidor decide quando desabilitar ações durante a revalidação e
deve manter as identidades dos próprios filhos para preservar seu estado/foco.
Para reiniciar a experiência de skeleton inicial, remonte a instância com uma
nova `key`.

O status visualmente oculto é irmão da div busy, com `role="status"`,
`aria-live="polite"` e `aria-atomic="true"`. Alterar apenas a duração não modifica
seu texto. `announcement="off"` remove esse status e não cria role/live implícito;
use essa opção quando o consumidor já anuncia a atualização. Propriedades ARIA
explicitamente fornecidas pelo consumidor continuam sob sua responsabilidade.

## Movimento e fallback

A borda vazia usa Web Animations API, `pointer-events: none`, sem animar o texto.
Cada transição de carregando para pronto pode disparar a decoração. Mudanças de
`loading`, `duration`, reduced motion e desmontagem cancelam a animação anterior;
alterar apenas duração ou preferência não faz replay. Não há callbacks de término,
timers de negócio, requests ou dependência de Motion. Sem WAAPI, ou se sua
implementação lançar erro, a troca permanece estática e imediata.

SSR depende somente de `loading` inicial. O skeleton e o conteúdo inicial são
determinísticos na hidratação; a preferência do sistema é lida com o hook privado
compartilhado `useSystemReducedMotion`.

## Validação e limites

Testes unitários direcionados cobrem apresentação, semântica, revalidação e foco,
anúncios, validação de entradas, refs/StrictMode, SSR/hidratação e cancelamento da
decoração. jsdom não implementa renderização WAAPI nem navegação nativa de foco
em `inert`; a borda e o comportamento visual em browsers reais exigem os gates
de integração L3. A recipe não promete compatibilidade não testada nem
certificação de acessibilidade.
