# Scroll Progress — M08 / L2 local

Subpath: `@motion-skills-lab/motion-recipes/scroll-progress`. ScrollProgressProps e ScrollProgressSource exportados; ref nativa HTMLDivElement da barra. Sem CSS obrigatório ou paleta; superfície herda currentColor. Sem children, duration, replay, easing/spring, leitura, eixo/offsets genéricos, live region ou semântica progressbar. Barra aria-hidden, sem tabulação/pointer; navegação permanece no conteúdo.

## Fontes e fórmulas

- source omitido ou `{type:'document'}`: clamp(scrollTop/(scrollHeight-clientHeight)) do scrollingElement.
- `{type:'section',targetRef}`: clamp((viewportHeight-targetRect.top)/(viewportHeight+targetRect.height)); passagem da seção pela viewport, de topo na borda inferior até fim na superior. Seção curta/alta usa mesma fórmula. Custom root para seção fica fora deste recorte.
- `{type:'container',containerRef,contentRef}`: proporção do container vertical; contentRef identifica wrapper interno em fluxo normal e observa alterações de tamanho. Não é o denominador da fração.

Sem faixa rolável: valor0/barra inativa, sem fingir100% lido. Refs nulas, desconectadas/estrangeiras, altura/medidas inválidas: inativo, sem fallback implícito para window/NaN. Refs/nós substituídos devem ser apresentados em novo commit/rerender; mutação silenciosa ref.current fora de React não é reconexão contratual.

## Implementação escolhida e contentRef

O Motion14.3.0 instalado foi consultado em framer-motion/dist/es/render/dom/scroll/track.mjs: trackContentSize=false por default; habilitá-lo faz frame.read(checkScrollDimensions,true), leitura periódica por frame. Optou-se pela alternativa prevista no contrato: listener passivo do root correto, frame sob demanda e MotionValue com escrita direta de scaleX, sem React state por pixel ou interpolação.

ResizeObserver observa container e contentRef (dois alvos, um observer); documento observa html/body; seção acrescenta alvo. Mutação de fluxo/ordem, load em captura, fontes, resize/visualViewport, pageshow/hash/popstate invalidam medida. Não observar atributos de style evita loop com a própria escrita. Não há polling ocioso deliberado.

**Benefício testável de contentRef:** aumentar apenas o padding inferior do wrapper muda scrollHeight sem alterar tamanho do viewport nem childList/texto. ResizeObserver do wrapper invalida o cálculo sem novo scroll. Apenas observar a caixa fixa não oferece essa garantia. Custo: uma ref/wrapper em fluxo normal e mais um alvo de RO; não varrer cada descendente ou criar observer por item. O teste real desse caso e os metadados estão nas evidências do lote. Não são benchmark universal de CPU/FPS.

Sem RO, medidas iniciais e eventos disponíveis continuam funcionando; não há promessa de atualização imediata para mudanças silenciosas. Load/fontes e DOM em fluxo cobrem cenários documentados, não qualquer rearranjo por stylesheet externo. Sticky, transforms/posicionamento fora do modelo, conteúdo absoluto e virtualização não recebem suporte implícito.

## Acessibilidade, SSR e lifecycle

É posição, não leitura/tarefa. Sem anúncio por pixel, tabulação na barra ou captura da rolagem. O consumidor pode nomear/tornar focável a região rolável. Informação proporcional é direta mesmo em reduced motion; não há transição decorativa a desativar. Não alterar scrollRestoration ou executar scrollTo.

SSR/primeiro render iguais: barra inativa, texto do produto independente e legível. Após commit, medir posição atual/restaurada diretamente, sem animação0→posição. Source com novos objetos mas mesmos nós não perde valor. Troca de fonte/nó/unmount/StrictMode remove listeners/observers/subscrição e frame pendente; callbacks antigos não escrevem.

Exemplos independentes: [skill](../../skills/scroll-motion/SKILL.md). API real: [fonte](../../packages/motion-recipes/src/scroll-progress/ScrollProgress.tsx). Fórmulas/SSR/noJS/restore/resize/conteúdo dinâmico e ausência de RO são cenários de validação; veja [resultados e limitações](../VALIDATION.md). Linux e tecnologias assistivas não executadas permanecem pendentes. Nenhuma publicação npm/main autorizada por este lote.
