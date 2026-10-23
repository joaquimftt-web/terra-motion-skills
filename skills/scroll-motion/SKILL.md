---
name: scroll-motion
description: 'Use when implementing or reviewing scroll-triggered entrances, bounded group entrances or decorative scroll-position indicators with Terra Motion Skills in React, including focus, safe geometry, reduced motion and cleanup.'
---

# Scroll motion

Escolha pela função da interface. As três recipes deste guia estão no candidato público da **PR #1, branch integration/landing-v4-horizontal**, junto às cinco anteriores: oito recipes, três skills e 13 subpaths. Ainda não estão integradas à main nem publicadas no Pages/npm; a Release/tag v0.1.0 permanece histórica. Leia as APIs reais antes de editar: [ScrollReveal](../../packages/motion-recipes/src/scroll-reveal/ScrollReveal.tsx), [StaggeredEntrance](../../packages/motion-recipes/src/staggered-entrance/StaggeredEntrance.tsx), [ScrollProgress](../../packages/motion-recipes/src/scroll-progress/ScrollProgress.tsx). Não importe o showcase, helpers privados ou estilos V4.

## Aplicação

1. Identifique a intenção: apresentar um bloco, coordenar um grupo ou indicar posição real. Não confunda posição com leitura.
2. Escolha **M06 ScrollReveal** para bloco com entrada temporal; **M07 StaggeredEntrance** para lista inteira; **M08 ScrollProgress** para ligação direta à posição. Não resolver streaming/live edge, drag/reorder, tabs, overlays ou hero ornamental com estas APIs.
3. Declare scroll root, conteúdo focável e geometria. M06/M07 só observam viewport. M08 distingue documento, seção na viewport e container vertical com wrapper em fluxo normal.
4. Antes de aplicar entrada, verifique overflow/clipping, sombra, filtros, pseudoelementos, posicionamento e transforms. Conteúdo já visível ao montar/hidratar permanece estático, nunca é escondido ou deslocado para recuperar uma entrada perdida.
5. Em grupo de cards use **M07 sozinho**, com M06 em blocos irmãos. Não envolver o mesmo grupo em M06, montar M06 por item nem somar transforms no li privado. Não criar contextos/providers para resolver essa composição.
6. Importe por subpath; nenhum CSS próprio é obrigatório nestas três recipes. O consumidor define cores/superfícies. Preserve texto opaco, ordem DOM, estado dos filhos e navegação nativa.

## Parâmetros

| Recipe            | API e defaults                                                                         | Unidade/limite                                                |
| ----------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| ScrollReveal      | duration260, offset8, once=true, replayKey, reduceMotion=false; children/props/ref div | duration ms finito≥0; offset px0–24; key string/número finito |
| StaggeredEntrance | items readonly, getKey, renderItem, ref ul; mesmos defaults +stagger50                 | stagger ms0–200; key estável/string única/não vazia           |
| ScrollProgress    | source default document; ref div da barra                                              | sem duration/replay/fade/spring/eixo/offsets genéricos        |

**M07: delay(i)=min(i×stagger,200)ms.** Com20 itens e default:0/50/100/150/200/200…; a cauda começa junta, não espera950ms. Total≤duration+200ms, default460ms. Não alterar o teto para preservar uma sequência artificialmente lenta. Grupos longos continuam custosos O(n); preferir grupos curtos por contexto, sem inventar virtualização.

duration0 ou offset0 encerra entrada e atrasos imediatamente. Preferência reduzida do sistema OR reduceMotion vence os valores selecionados. Use o DurationControl da vitrine apenas na vitrine, nunca como dependência da recipe.

M08 source:

- `{type:'document'}`: scrollTop/(scrollHeight-clientHeight).
- `{type:'section',targetRef}`: passagem da seção na viewport, `(viewportHeight-top)/(viewportHeight+height)`, limitada0–1. Não é percentual de texto lido.
- `{type:'container',containerRef,contentRef}`: proporção do container; **contentRef é wrapper interno em fluxo normal**, observa crescimento para invalidar medida. Não trocar o denominador pela altura do wrapper nem passar nó externo/absoluto. Ref nula não significa window.

## Exemplo

Exemplos independentes de showcase, compilados contra os exports públicos locais. O consumidor fornece conteúdo/estilo, sem copiar identidade Terra Commerce.

```tsx
import { useState } from 'react';
import { ScrollReveal } from '@motion-skills-lab/motion-recipes/scroll-reveal';
import { StaggeredEntrance } from '@motion-skills-lab/motion-recipes/staggered-entrance';

const resources = [
  { id: 'delivery', title: 'Entrega' },
  { id: 'returns', title: 'Trocas' },
] as const;
export function Resources() {
  const [replay, setReplay] = useState(0);
  return (
    <section>
      <ScrollReveal>
        <h2>Informações úteis</h2>
      </ScrollReveal>
      <button type="button" onClick={() => setReplay((v) => v + 1)}>
        Repetir grupo
      </button>
      <StaggeredEntrance
        items={resources}
        getKey={(item) => item.id}
        duration={260}
        stagger={50}
        replayKey={replay}
        renderItem={(item) => (
          <article>
            <h3>{item.title}</h3>
            <input aria-label={'Nota ' + item.id} />
          </article>
        )}
      />
    </section>
  );
}
```

```tsx
import { useRef } from 'react';
import { ScrollProgress } from '@motion-skills-lab/motion-recipes/scroll-progress';

export function ContainerPosition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <section>
      <h2>Posição na rolagem</h2>
      <ScrollProgress source={{ type: 'container', containerRef, contentRef }} />
      <div
        ref={containerRef}
        role="region"
        aria-label="Conteúdo rolável"
        tabIndex={0}
        style={{ maxHeight: 240, overflowY: 'auto' }}
      >
        <div ref={contentRef}>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i}>Linha estável {i + 1}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Restrições

- Preparação M06/M07 somente quando todo conteúdo estiver comprovadamente abaixo da viewport, margem24px. Geometria incerta, sombra no alvo, clipping, inicialização tardia, ausência de IO/matchMedia ou falha de animação → **fallback estático**. Não relaxar o verificador para tornar a demo mais expressiva. Não prometer funcionamento animado em qualquer card CSS.
- Replay é mudança de replayKey, não remontagem de filhos. Valor inicial não dispara replay. Trajetória visível contínua posição atual→offset→0; cancelar geração anterior. Foco/gesto interno bloqueia; nunca disputar a posição do controle usado.
- M07 insere ul/li reais. renderItem devolve conteúdo do li, não outro li. Chaves alteradas/inserção/remoção/reordenação encerram grupo, sem animação de layout. Mesmas chaves/ordem com novas referências não reiniciam. Keys+replay no mesmo render respeitam foco, redução e gesto ainda ativo.
- Mudança de duração/offset/stagger/once encerra execução corrente; novo valor vale para intenção elegível posterior. Alterar redução ao vivo conclui; desativá-la não retoma fila antiga.
- M08 suporta fluxo normal. Sem faixa rolável mantém valor0/barra inativa, não100% lido. Sem ResizeObserver recalcula em eventos disponíveis, sem promessa de atualização imediata de mutação silenciosa. Refs desconectadas/estrangeiras e geometria inválida não viram window ou NaN.
- Não adicionar polling por frame, observador por item, smooth-scroll global ou CSS experimental obrigatório. Motion14.3 useScroll não detecta todo crescimento por padrão; trackContentSize pode fazer polling. Não assumir assinatura reduced-motion dinâmica apenas pelo hook sem teste na versão instalada.

## Acessibilidade

- Conteúdo M06/M07 sempre no DOM, opaco e interativo. Sem inert/aria-hidden/focus trap para coreografia. Foco/pointerdown encerra antes do handler do consumidor, em todo o grupo inclusive itens atrasados. Nenhum item retoma depois.
- Ordem DOM acompanha leitura; não usar CSS order para inverter sequência. Não alterar refs nativas ou descartar cleanup React19.
- Reduced motion inicial e ao vivo elimina entrada/espera. Desconhecimento de preferência mantém estado seguro. M08 continua informativo direto, sem suavização ornamental.
- Barra M08 é decorativa/aria-hidden, sem tabulação, live region, role=status/progressbar ou promessa de leitura. Container rolável pode ser region nomeada e focável pelo consumidor; a barra não captura teclado/toque.
- SSR e primeiro cliente iguais: texto final legível e barra inicialmente inativa. Sem JS, navegação e conteúdo continuam úteis. Imports SSR-safe não bastam para afirmar hidratação validada.

## Validação

Antes de declarar a integração pronta, execute e registre:

1. Tipos/exports, consumidor externo só dist/manifests, casos TS negativos e exemplos desta skill.
2. SSR real/noJS e hydrateRoot: positivo saudável e mismatch real tardio rejeitado após interações.
3. Entradas automáticas preparadas, inicialmente visíveis e fallbacks de sombra/clipping/falha. Medir trajetórias e gravar motion real; screenshot isolado não valida entrada.
4. M07 grupos1/6/20, atraso real pela WAAPI, cauda simultânea200ms,0/default/800ms, foco no último, chaves alteradas e replay rápido/gesto concorrente.
5. M08 documento/seção/container, resize, conteúdo assíncrono, refs válidas/nulas, ausência de faixa/observer, scroll reverso/restaurado/BFCache, custo de contentRef sem polling ocioso.
6. StrictMode, cancelamento de callbacks/listeners/frames/observers após troca/unmount; redução durante espera e execução; teclado/foco/axe/toque.
7. Bases local/Pages,320/390/1024/1440, zoom nativo200%, overflow e regressões M01–M05/duas skills anteriores.

Diferencie resultados Windows por etapa, CI Ubuntu do SHA original 38b6fbbb aprovada na [execução 39874614276](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39874614276) com deploy skipped, alterações posteriores ainda não revalidadas no Ubuntu, demos apenas lidas e dispositivos/browsers/AT não disponíveis. Axe não certifica anúncios de leitor de tela. Não usar “compatível” ou “publicado” por existir exemplo local.
