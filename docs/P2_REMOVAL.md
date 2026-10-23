# Remoção do movimento P2 — Mineral Fold

## Decisão de 23/10/2026

A passagem decorativa da dobra mineral foi removida. A identidade mineral V4, o fundo arquitetônico, a logo, a paleta, o espaçamento e o conteúdo permanecem. Nenhum efeito substituto foi introduzido. P1, a narrativa P3, o widget, a galeria horizontal, as recipes e suas APIs não fazem parte desta alteração.

## Causa e escopo

Na base `cb6cec362b963625dd0e20da1d7886402fc94bf1`, `createMineralFold` animava uma cópia recortada do fundo entre “Clareza, em cada interação” e “Ideias que você pode experimentar”. O plano absoluto atravessava a largura da página usando transform e opacidade, gerando a faixa observada. A comparação real com `?p21=off` eliminou essa passagem nas quatro larguras.

Foram removidos o plano e seu wrapper no DOM, a ligação React, o controlador, os estilos exclusivos e seus nove testes unitários de ciclo de vida. Como o wrapper era absoluto, não se adicionou um espaçador ou mudança de layout para compensá-lo. A query histórica `p21=off` deixa de ter comportamento específico; a navegação continua funcionando com ou sem ela.

## Regressão

O teste novo de ausência da faixa foi executado contra a versão anterior e falhou pela presença dos dois elementos decorativos. A correção acrescenta oito cenários E2E: quatro larguras, com e sem reduced motion. Eles verificam ausência do plano, continuidade geométrica entre as seções, ida e volta do scroll, alternância de reduced motion, âncora direta, preservação dos cards e ausência de overflow. Os cenários existentes da galeria preservam suas interações e passam a exigir ausência do plano, em vez de apenas opacidade zero no encerramento.

Os nove testes do controlador excluído não representam cobertura mantida: foram aposentados junto com a funcionalidade removida. Não se alteraram testes das recipes, contratos ou skills para acomodar a correção. Resultados efetivamente executados são registrados em [VALIDATION.md](VALIDATION.md) e no relatório de entrega, distinguindo validação local, CI da main e smoke HTTPS.

## Histórico

Relatórios anteriores que descrevem a dobra P2 em execução continuam como evidência dos respectivos SHAs e etapas. Eles não descrevem o comportamento após esta remoção. Preservar a identidade mineral não implica preservar essa animação decorativa.
