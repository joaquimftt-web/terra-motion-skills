# M13 — Expandable Cards

## Contrato público

`@motion-skills-lab/motion-recipes/expandable-cards`. Sem CSS obrigatório. Requer React19 e Motion14.3.0. Código MIT; não inclui assets ou identidade da Terra Commerce.

```ts
import type { HTMLAttributes, ReactNode, Ref } from 'react';
export type ExpandableCardItem = {
  id: string;
  title: string;
  media?: ReactNode;
  preview: ReactNode;
  details: ReactNode;
};
export type ExpandableCardsProps = Omit<
  HTMLAttributes<HTMLUListElement>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  items: readonly ExpandableCardItem[];
  selectedId: string | null;
  onSelectedIdChange: (id: string | null) => void;
  duration?: number;
  reduceMotion?: boolean;
  ref?: Ref<HTMLUListElement>;
};
```

Default: duration280ms, easing[0.2,0,0,1], reduceMotion=false. Duração finita >=0, zero imediato; sistema reduzido prevalece. IDs únicos/não vazios e títulos strings não vazias. Seleção desconhecida ou duração inválida lança RangeError; identidade inválida/callback ausente lança TypeError. IDs não são interpretados como seletores CSS. Use dados imutáveis e IDs persistentes; modificar um ID representa remoção e nova montagem.

## Composição e estado

Markup ul/li/article/h3/button. Títulos são texto para impedir botões/links aninhados. Slots media/preview/details aceitam ReactNode; consumidor fornece imagens proporcionais e evita IDs HTML globais repetidos. Ref nativa do ul. O consumidor deve colocar a coleção sob um h2, mantendo a hierarquia dos h3.

Seleção é controlada; click/Escape pedem alteração sem modificar props. Detalhes continuam montados com hidden, preservando inputs entre seleções. Remover item/unmount encerra sua identidade. Sem modal, portal, focus trap, backdrop, scroll lock ou altura de Accordion.

Superfície CSS pública: li[data-card-id], data-expanded="true|false", data-peer="true|false", data-lone="true|false"; wrappers data-card-media, data-card-content, data-card-preview, data-card-details; botão data-card-trigger. ul data-selected-id e data-update-blocked informam snapshot aplicado/suspensão. Não estilize transforms internos. Grade, gaps, fontes, imagem, cores e breakpoint são do consumidor. Para a composição aprovada: grid12tracks; li6; expandido8; peer4; lone12; no mobile todos1. Sem dense/order.

## Foco em duas fases

Props são intenção; snapshot anterior é preservado até foco seguro. Foco em preview visível permanece. Antes de ocultar detalhes ativos, focus preventScroll no próprio gatilho conectado e verificação activeElement. Remoção usa sucessor sobrevivente na ordem anterior, depois predecessor; coleção vazia usa ul nomeado/tabIndex=-1. Sem sobrevivente mas novos IDs, o container é fallback previsível. Não é restauração ao card eliminado.

Se focus falhar ou lançar, o DOM antigo permanece acessível e data-update-blocked=true. Sem retry automático: consumidor deve corrigir o alvo e enviar nova intenção/array imutável. Escape só dentro do card selecionado, respeita preventDefault do handler nativo. Tab/Shift+Tab nativos. Slots substituídos pelo consumidor devem manter keys e nós interativos estáveis: a recipe não pode preservar um nó que o próprio consumidor substitui dentro de um slot.

## Movimento e interrupção

Layout medido em nós estáveis, sem layoutId global, sem fade ou entrada inicial. Texto opaco e wrapper de correção position nos conteúdos/mídias. Nova seleção substitui anterior; duração, foco, interação e reduced motion neutralizam a projeção atual. Voltar da redução não repete intenção antiga. Motion pode concluir frames internos; não há acesso a scheduler/projection privados. Resize e imagens devem ser testados no consumidor; reservar espaço para mídia. Não há compensação automática de scroll.

## SSR, fallback e limites

Markup inicial estático, mesmos dados/seleção no renderToString e hydrateRoot. identifierPrefix exclusivo por root, idêntico servidor/cliente; useId e LayoutGroup inherit=false isolam a instância. Sem JS o SSR preserva seleção inicial legível, sem prometer interação sem hidratação. Ausência de RAF, geometria ou matchMedia utilizável mantém seleção/disclosure estáticos.

Suporte inicial: fluxo normal no scroll do documento. Portais, virtualização, sticky/fixed e ancestrais transformados não são certificados. Conteúdo arbitrário e traduções precisam de avaliação do consumidor. Axe não substitui leitor de tela nem teste físico. Recursos globais Motion/React não são listeners locais vazados.

## Validação

Testes do módulo cobrem semântica, callback/ref, identidade, foco, erros e SSR. Fixture independente cobre projeção intermediária real, abertura/troca/fechamento, quatro larguras, redução ao vivo, duração0/800, foco impedido/remoção/vazio, SSR tardio/negativo, múltiplas instâncias/roots, StrictMode e fallback. Testes e resultados efetivamente executados serão registrados em VALIDATION, sem transformar este contrato em certificação universal.

### CSS mínimo do consumidor

```css
.cards {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
  padding: 0;
  list-style: none;
}
.cards > li {
  grid-column: span 6;
  min-width: 0;
}
.cards > [data-expanded='true'] {
  grid-column: span 8;
}
.cards > [data-peer='true'] {
  grid-column: span 4;
}
.cards > [data-lone='true'] {
  grid-column: span 12;
}
@media (max-width: 640px) {
  .cards {
    grid-template-columns: minmax(0, 1fr);
  }
  .cards > li {
    grid-column: 1;
  }
}
```

O exemplo TSX da skill compila contra o pacote dist. Adicione className="cards" à coleção para aplicar esta geometria; personalize os estilos nativos, dimensões/reserva da mídia e foco visível no produto. O limiar640px é um exemplo do consumidor, não API da recipe.

Limitação conhecida de diagnóstico: após falha de transferência, cancelar a intenção retornando ao snapshot anterior com o mesmo array pode deixar data-update-blocked=true. DOM e foco permanecem seguros; uma nova intenção/array permite atualizar o marcador. Não usar esse atributo como fonte de seleção ou regra para ocultar conteúdo.

### M13 — identidade de slots na hidratação

Uma verificação adicional com slots que chamam useId detectou avisos reais de hidratação após a integração inicial. O workflow da primeira main foi cancelado antes do deploy, mantendo o Pages anterior; não houve rollback. A fixture passou a usar componentes de slots com useId e reproduziu a falha em Chromium real.

Correção interna: mesma árvore de wrappers Motion em SSR, hidratação e fallback. MotionConfig isStatic (API pública14.3.0) é fixado por instância conforme suporte inicial; modo estático não aciona as APIs ausentes/hostis. Nenhuma API, layout final, CSS, dependência, versão ou recipe anterior foi alterada. Os gates completos e resultados remotos da correção são rastreados em sua PR e na entrega consolidada; os gates iniciais não comprovavam este cenário adicional.
