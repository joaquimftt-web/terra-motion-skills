# L3 — contratos M09–M11

Status: contrato de implementação local, decisões técnicas autorizadas pelo escopo L3. Base c50e4febd400cb2a0e740caf34400427a9f74680. Sem alteração de M01–M08, dependências, assets, identidade ou versão. Motion 14.3.0 / React 19.3.1 instalados são a fonte de compatibilidade. Unidade de duração: milissegundos. Duração inválida/negativa não é aceita (RangeError); zero conclui imediatamente. A preferência do sistema ou reduceMotion=true prevalece.

## M09 — Layout Reflow

```ts
import type { HTMLAttributes, ReactNode, Ref } from 'react';
export type LayoutReflowItem = { id: string; content: ReactNode };
export type LayoutReflowProps = Omit<
  HTMLAttributes<HTMLUListElement>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  items: readonly LayoutReflowItem[];
  reflowKey: string | number;
  duration?: number; // 240 ms
  reduceMotion?: boolean; // false
  ref?: Ref<HTMLUListElement>;
};
```

Lista ul nativa, cada item é li com id/key estável. O consumidor controla items, ordem e reflowKey (intenção de animar). Native props e ref pertencem ao ul; nenhum wrapper do consumidor tem seu transform tomado. Apenas os li internos fazem layout="position"; sem scale do texto, drag ou shared layout. ReflowKey inalterado não autoriza nova animação por resize/render incidental. Usar agrupamento Motion apenas se a medição exigir, sem layoutId global.

Ids vazios/duplicados são erros TypeError, não chaves por índice silenciosas. Novos itens entram já legíveis e itens removidos saem imediatamente, sem exit/retenção; o consumidor deve transferir foco antes de remover o item focado. Reordenação preserva nós, input e foco. Foco/interação e reduced motion devem interromper deslocamento em curso, não disparar replay oculto. Duração/props/reflowKey sucessivos substituem a intenção anterior e respeitam o estado atual. Sem geometria/API de browser, SSR ou JS: lista estática ordenada e legível. Sem animação inicial de entrada. Motion 14.3.0 não expõe stop público da projeção de layout; o contrato de interrupção é visual: transformTemplate/estado estático neutralizam o transform, preservando DOM/foco. O scheduler interno pode concluir seu ciclo e o cleanup da projeção pertence ao Motion, sem acessar APIs privadas. Não há API de replay: mudar ordem e reflowKey é a interação real.

## M10 — Skeleton-to-Content

```ts
export type SkeletonToContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML' | 'aria-busy'
> & {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  duration?: number; // 180 ms, só efeito decorativo
  reduceMotion?: boolean;
  minBlockSize?: number | string;
  announcement?: 'polite' | 'off'; // polite
  loadingLabel?: string; // Carregando conteúdo.
  readyLabel?: string; // Conteúdo disponível.
  ref?: Ref<HTMLDivElement>;
};
```

Div nativa com aria-busy. Skeleton inicial é aria-hidden/inert: pode ser visto, mas não contém controles operáveis. Não há requests ou timers de negócio. Na primeira disponibilidade, conteúdo substitui skeleton no mesmo commit, opacidade plena e controles imediatos. Não se retém skeleton em saída; o efeito é uma borda/indicador decorativo neutro, sem bloquear conteúdo. Sem CSS externo obrigatório: geometria/decoração mínima inline.

Após a primeira disponibilidade, reloading conserva conteúdo real montado, legível e interativo com aria-busy=true: não há overlay skeleton sobre controles nem perda de foco. O consumidor decide se ações devem ser desabilitadas durante revalidação. Remontar uma instância é a opção explícita para novo skeleton inicial. minBlockSize reserva espaço conhecido, não impede layout shift universal; valida números finitos não negativos. announcement=off remove role/status/live para evitar duplicação; status de anúncio fica fora da região busy. SSR usa apenas loading inicial e conteúdo inicial determinístico. Mudanças rápidas/reduced motion/duração/desmontagem cancelam animação decorativa anterior sem callbacks obsoletos ou atraso de conteúdo. Sem presença dependente de M03.

## M11 — Data Change Feedback

```ts
export type DataChangeFeedbackProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'dangerouslySetInnerHTML' | 'role' | 'aria-live'
> & {
  value: string | number;
  formatValue?: (value: string | number) => string;
  duration?: number; // 220 ms, só efeito decorativo
  reduceMotion?: boolean;
  changeLabel?: string; // Valor atualizado
  announcement?: 'off' | 'polite'; // off
  ref?: Ref<HTMLSpanElement>;
};
```

Span com valor formatado imediatamente no render. Object.is diferencia atualização real de simples render; mudança de formatter altera texto mas não conta como mudança de value. Sem tween/rounding/parsing/requisição/streaming. A primeira renderização é estática. Só uma borda/indicador decorativo anima; texto do valor nunca some ou espera. Após alteração, o rótulo textual changeLabel permanece como informação estática inclusive com reduced motion. announcement=off sem role/live implícito; polite anuncia somente o valor atual, sem cópias concorrentes. Não anunciar repetidamente em rerenders ou mudanças de duração. Mudanças sucessivas cancelam e substituem decoração; alteração de duração ou reduced motion durante execução encerra/reconfigura sem mudar o valor e sem inventar novas alterações. SSR/hidratação inicialmente idênticos. Nenhuma lógica financeira.

## Gates e consumo

Subpaths novos: layout-reflow, skeleton-to-content, data-change-feedback; nenhum CSS público novo sem necessidade. Total previsto: 16 subpaths, 11 recipes, 4 skills. Quarta skill: layout-transitions. Independência de showcase/assets obrigatória. Exemplos compilados contra dist/manifests, SSR real e hidratação com controle negativo de mismatch, fixture independente, Vitest, Playwright local/Pages, axe, foco/teclado, reduced motion ao vivo, 320/390/1024/1440. Não apresentar plano como resultado executado.

## Riscos e limites

Motion layout depende de geometria real e pode reagir a remoção/resize; os testes devem demonstrar que o contrato é atendido na versão fixada, com fallback estático se não houver suporte. Não prometer preservar foco após o consumidor excluir o próprio nó focado. Skeleton em revalidação mostra o último conteúdo por decisão explícita para preservar foco. Nenhuma recipe promete ausência universal de layout shift, certificação de acessibilidade ou compatibilidade não testada.
