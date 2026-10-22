# Staggered Entrance — M07 / L2 local

Subpath: `@motion-skills-lab/motion-recipes/staggered-entrance`. Sem CSS obrigatório, showcase, provider ou dependência nova. Contrato genérico StaggeredEntranceProps<T> com items readonly, getKey(item):string e renderItem(item,index):ReactNode; ref nativa HTMLUListElement. Props HTML nativas na ul, exceto children/dangerouslySetInnerHTML. renderItem retorna conteúdo de li, não outra li.

## Parâmetros e tempos

duration260ms≥0 finito; offset8px entre0–24; stagger50ms entre0–200. once=true, replayKey opcional string/número finito, reduceMotion=false OR sistema. Numéricos inválidos geram RangeError; chaves vazias/duplicadas geram Error antes de iniciar efeito, sem índice/aleatório como fallback.

delay(i)=min(i×stagger,200)ms. Índices0–5 com default:0/50/100/150/200/200. Em20itens, os16últimos começam com200ms. Total máximo duration+200, default460ms. duration0 ou offset0 conclui todos e ignora atrasos; stagger0 simultâneo. Grupos extensos continuam custosos O(n), não são virtualização nem reordenação.

## Preparação e fallback

HTML inicial/SSR completo, opaco, interativo. Uma inscrição de viewport na ul estável; transforms apenas nos li privados. Preparar todos somente com geometria comprovadamente abaixo da viewport/margem24px. Inicialmente visível, ausência de observer/media, sombra/filtro/pseudo no conteúdo, clipping/transform ancestral ou geometria incerta: grupo estático. Não enfraquecer esse envelope para obter entrada.

Entrada vai do offset preparado a0, sem reaplicar deslocamento quando chega o atraso de cada item. ReplayKey alterado cancela geração e usa posição corrente→offset→0,25%+75% de duration, com atrasos limitados. Não remonta filhos ou cria espera por setTimeout. Valor inicial da key não é replay. Foco/pointerdown conclui grupo inteiro antes do handler consumidor. Redução ao vivo, aba oculta, erro e unmount cancelam; nenhum item aguardando retoma.

Mesmas keys/ordem e novas referências não reiniciam. Mudança de conteúdo durante preparação revalida/cancela; execução não anima layout. Inserção/remoção/reordenação cancela e fixa repouso. Keys+replay simultâneos reconciliam primeiro e continuam respeitando gesto/foco/redução. A duração alterada encerra execução; valores novos valem para próxima intenção elegível. once=false rearma só após saída completa e nova preparação segura; entrada pelo topo pode ficar estática.

## Consumo e composição

Use M07 sozinho no grupo; M06 em bloco irmão. Nunca M06 por item ou sobre toda a mesma lista. Não escrever transform no li privado; feedback de card pode ocorrer em filho separado, desde que não invalide a preparação geométrica. Consumer mantém ordem DOM, identidade e semântica; sem API de grid/tabela/asChild/drag.

Exemplos reais compiláveis e decisões de aplicação: [scroll-motion](../../skills/scroll-motion/SKILL.md). Fontes: [componente](../../packages/motion-recipes/src/staggered-entrance/StaggeredEntrance.tsx), [lifecycle privado compartilhado](../../packages/motion-recipes/src/internal/createEntranceLifecycle.ts). Helper foi extraído após comprovar duplicação entre bloco e grupo; não cria engine genérica ou pacote.

## Validação e limites

Unitários incluem1/6/20, delays exatos, ref/semântica,0ms, chaves, replay, foco, redução e gesto ativo durante troca. Chromium mede timings WAAPI reais e entradas/fallbacks; consumidor externo exerce SSR/hidratação. Resultados finais e limites em [VALIDATION](../VALIDATION.md). Linux/AT/dispositivos extras não se tornam aprovados por esses testes. Esta implementação permanece local; não é disponibilidade na main/npm.
