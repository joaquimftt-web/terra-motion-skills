# Landing V4 — composição horizontal publicada

## Estado publicado — 22/10/2026

**Publicado na main e no GitHub Pages:** 8 recipes, 3 skills operacionais e 13 subpaths explícitos de recipes/CSS. A [PR #1](https://github.com/joaquimftt-web/terra-motion-skills/pull/1) foi integrada por merge commit `491a934169966de481710a63fa7b4a2bb19fdc3e`, incluindo L1/L2 e a composição horizontal da Landing V4. [CI/build e deploy aprovados](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39881855054). Pacotes npm não publicados; Release/tag v0.1.0 histórica e inalterada.

No merge publicado `491a934169966de481710a63fa7b4a2bb19fdc3e`, a [execução Ubuntu 39881855054](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39881855054) passou em 172 Vitest, 11 testes Node do auditor, 30 E2E independentes e 109 E2E por base; build e deploy success. O smoke HTTPS pós-deploy passou em 42 testes automatizados Chromium/Windows; 24 recursos públicos conferiram com o artefato. P2 retornou limpa nas quatro larguras e P3 concluiu em desktop/mobile. São evidências desse SHA publicado, sem estender a aprovação a alterações posteriores. Sem nova validação manual de zoom, Firefox/WebKit, leitores de tela ou dispositivos físicos; axe não certifica acessibilidade.

Hero/P1, narrativa P2/P3 e retorno limpo da dobra mineral foram preservados. Widget após o hero; galeria de quatro painéis com A guiada em desktop elegível e B nativa como fallback/mobile. Detalhes técnicos abaixo continuam válidos; menções a isolamento ou publicação pendente são relatos históricos identificados por etapa. E1 não modifica essa composição.

## Histórico — revisão documental do candidato em 22/10/2026

**Candidato da [PR #1](https://github.com/joaquimftt-web/terra-motion-skills/pull/1):** 8 recipes, 3 skills operacionais e 13 subpaths explícitos de recipes/CSS. L1/L2 e a composição horizontal estão disponíveis na branch `integration/landing-v4-horizontal`; ainda não integrados à main nem publicados no Pages. Pacotes npm não publicados. A Release/tag v0.1.0 é histórica e permanece inalterada.

[CI Ubuntu 39874614276](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39874614276) aprovada no SHA original `38b6fbbb50a867c790c72a2c8ce90b9aba6a1118`: 172 Vitest, 11 auditor, 30 E2E independentes e 109 E2E por base; deploy skipped. A correção documental posterior ainda requer revalidação Ubuntu. Main/Pages permanecem na base anterior. Os resultados locais e pendências relatados abaixo são históricos daquela etapa, incluindo a ausência de push e Linux naquele momento. Não são o estado remoto atual.

## Histórico — estado e isolamento da integração local

Composição aprovada pelo titular em 22/10/2026 e consolidada somente na branch `integration/landing-v4-horizontal`. Não integrada à main nem publicada. O site público e suas duas recipes disponíveis não mudam por este lote; os pacotes não estão publicados no npm.

Base L2: `800cf687ad02e4479db43860a7f9ea7d41feeaf6`. Recuperação do protótipo r2: branch `prototype/landing-horizontal`, checkpoint local `e27f56b863aa87e9d5ea0e2d736a7a3ee50e860a`, contendo os sete arquivos aprovados. Main, checkpoints L1/L2, branch R1 e Release/tag histórica permanecem separados. Não reintegrar R1 original sobre a implementação L2.

## Composição escolhida

- Hero V4/P1 preservado. Nenhuma animação introdutória nova.
- Widget funcional imediatamente após o hero: Button Feedback e Presence Transition. Entrada/saída, foco e redução seguem os contratos públicos existentes. Sem autoplay adicional, sem Shared Element ou nova API.
- P2/P3 preservados, incluindo a saída limpa da dobra mineral.
- Galeria perto do encerramento, antes do bloco final: quatro painéis de Button Feedback, Accordion Transition, Presence Transition e Scroll Progress. Heading e princípios consomem Scroll Reveal e Staggered Entrance em blocos irmãos, fora do trilho transformado.
- Controles, links ao Laboratório e documentos/skills reais permanecem disponíveis. O indicador de progresso representa posição, não leitura.
- Uma animação dominante por seção. Microfeedback depende da ação; nenhum efeito futuro foi incorporado por analogia à pesquisa.

## Escolha automática e operação

Não são necessários query parameters. `variant`, `first=hero` e `first=after` não selecionam composições. A navegação de comparação foi removida, assim como a composição interna do hero e seus estilos exclusivos. Esses experimentos continuam recuperáveis no checkpoint r2 e nas evidências anteriores.

A seção usa rolagem vertical guiada se todas as condições forem satisfeitas:

- Largura útil >= 1000 px e altura útil >= 720 px.
- Painel/controles cabem na altura útil com margem total de 48 px.
- Existe deslocamento horizontal real maior que 1 px.
- Movimento não está reduzido e o usuário não prefere rolagem nativa.
- ResizeObserver e suporte CSS a `position: sticky` estão disponíveis.
- Ativar o modo guiado não retira de um descendente focado o contexto já acessível em modo nativo.

Nos demais casos, mantém-se o container horizontal nativo, sem transform do trilho. Mobile, zoom ou mudanças ao vivo de redução/altura/conteúdo podem selecionar esse fallback. A decisão usa medidas atuais, não uma contagem fictícia de painéis.

A preferência **Preferir rolagem nativa** continua sendo um controle funcional de acessibilidade, não um seletor comparativo. **Permitir exploração guiada** libera a preferência, mas não força sticky se os requisitos continuarem ausentes. Conteúdo focado pode manter o nativo até uma nova avaliação segura de geometria.

Não há interceptação de wheel ou touch. Setas/Home/End são tratados somente quando a própria região está focada; controles internos continuam recebendo suas teclas. O foco em um descendente fora da área visível revela seu painel. Em modo guiado, um scroll horizontal disparado pelo foco do Chromium é reconciliado com o scroll do documento para não somar dois deslocamentos.

A troca de modo preserva os componentes filhos, estados e painel de leitura. Em redimensionamentos sem troca de modo, a composição também preserva a posição proporcional de leitura ou o painel focado. No nativo, se o reflow vertical deslocar o controle focado, ele é revelado apenas enquanto a seção ainda intercepta a viewport. O modo nativo pode realinhar ao painel atual quando a geometria muda; não se promete equivalência pixel a pixel entre dois layouts. Não há reposicionamento do documento para uma seção fora da tela. Retorno ao início, painel anterior/próximo e pular sequência continuam disponíveis; a página segue até o rodapé. Regiões internas de notas mantêm sua rolagem nativa própria.

## Arquitetura, direitos e recuperação

Composição privada em `apps/showcase/src/prototype/landing-motion/`; classes CSS `hx-*` preservadas para evitar reconstrução. Exports públicos de recipes consumidos por subpath; nenhum import privado do Laboratório, dependência nova ou mudança em packages/skills/contratos.

O helper de geometria e seu teste foram apenas movidos. Os testes de interação foram migrados de inputs comparativos para condições reais de operação, preservando assertions de comportamento. Novos casos cobrem padrão sem parâmetros, ausência de CSS sticky, estado dos quatro painéis e histórico nativo.

Logo e material arquitetônico não foram modificados. Código original MIT; permissões e restrições separadas dos assets permanecem em [ASSET_RIGHTS.md](ASSET_RIGHTS.md) e [avisos](../ASSET_NOTICES.md). Footer Reveal, Hover Image Preview, Text/Line Mask Reveal e Shared Element continuam em pesquisa futura, sem novas recipes.

Para recuperar a referência r2, abrir um checkout separado do checkpoint citado ou consultar o pacote de evidências anterior. Não descartar a árvore atual nem usar reset/clean sobre trabalho em andamento. A integração futura requer revisão específica da cadeia de checkpoints L1/L2 e deste lote; esta branch não é autorização de merge/deploy.

## Reproduzir a validação

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm validate:skills
pnpm check:boundaries
pnpm check:consumer
pnpm build
pnpm exec playwright test --workers=2
pnpm check:publication
```

Repetir build/E2E com `SHOWCASE_BASE_PATH=/` e `/terra-motion-skills/`, sem reutilizar um build da outra base. O auditor deve receber a mesma base do build. Preview do showcase usa as rotas `/`, `/lab/` e `/referencias/` sob a base escolhida.

Zoom nativo 200%, capturas, vídeos originais e checagens visuais são evidências externas ao código, entregues em Arquivos-GPT. Resultados efetivamente executados constam no fechamento abaixo e em [VALIDATION.md](VALIDATION.md). A lista de comandos, isoladamente, não substitui as evidências.

## Histórico — limitações e autorização futura da etapa local

Linux, outros navegadores, leitores de tela e dispositivos físicos só podem ser declarados validados após execução específica. Touch/wheel emulados e axe não equivalem a essas verificações. Amostras curtas de performance não certificam FPS ou energia. Links Markdown exportados para commits locais passam a ter destino remoto somente após eventual push/rebuild autorizado; os recursos locais e links do Laboratório devem funcionar já neste candidato.

Próxima decisão humana: revisão do resultado integrado localmente. Publicação, integração na main, npm, tags e Release permanecem fora desta autorização.

## Histórico — fechamento da integração local em 22/10/2026

Validações executadas nesta integração, sem somar os resultados históricos do r2:

- Formatação, ESLint, TypeScript, tipos dos testes E2E, builds local/Pages, skills, fronteiras e consumidor independente aprovados.
- **172/172 Vitest em 20 arquivos e 11/11 testes Node do auditor**, positivos e negativos.
- **109/109 Playwright em cada base**, `/` e `/terra-motion-skills/`, incluindo axe, teclado, foco, touch emulado, reduced motion inicial/ao vivo, largura 320/390/1024/1440, notas/progresso real, estados dos painéis e regressões do Laboratório L1/L2.
- Zoom nativo 200% por aba Chromium: fator 2 confirmado, janela externa 1440×1000, área útil 1424→712 e DPR1→2; CSS zoom=1 e visualViewport.scale=1. Widget, galeria/fallback, foco e axe exercitados.
- Oito combinações de estado do widget (aberto/fechado × repouso/hover/foco/pressão): contraste mínimo 7,76:1. Nenhum estilo interno de recipe foi alterado.
- P2 exercitada em 1440 e390: uma execução e estado final opacity0/transform none. As três capturas de hero 1440/1024/320 são byte a byte idênticas à referência r2; em390, a diferença fica em uma linha raster de borda com o fundo do novo bloco seguinte. Imagens originais não foram cortadas ou editadas.
- Cleanup validado em12 alternâncias: uma inscrição ResizeObserver e dois listeners escopados na viewport, estáveis. Amostra curta de ida/volta em A/B a1440×900 sem long tasks no intervalo observado; não constitui benchmark universal de FPS/energia/hardware.
- Artefato Pages:24 arquivos,13 referências, avisos legais idênticos, sem arquivos proibidos ou matches nos filtros de credenciais; gate ready=true, sem autorizar publicação.

A revisão técnica independente foi estática. Identificou perda de visibilidade do foco em resize desktop sem mudança de modo, herdada do protótipo. O cenário foi reproduzido RED e corrigido no showcase: preservação do painel/fração e revelação do foco no reflow nativo apenas enquanto a seção está em tela. O teste1440→1024→390→320→1440 e as regressões passaram. Não foram enfraquecidos contratos ou testes públicos.

Os testes comparativos r2 foram adaptados para condições reais (preferência nativa e geometria) ou para invariância de URLs legadas. A primeira tentativa de uma nova assertion esperava13 notas; o controle existente alterna5→8, portanto a expectativa foi corrigida para8 sem mudar o componente. Logs de falhas e tentativas permanecem nas evidências externas. A primeira coleta de hero parou ao detectar a borda de um pixel citada acima; a comparação posterior confirmou a área registrada preservada e manteve as capturas originais.

Relatório, inventários, capturas, quatro vídeos WebM sem edição e manifesto são entregues em Arquivos-GPT. Linux, outros navegadores, leitores de tela e dispositivos físicos não foram validados neste lote. Nenhum teste histórico foi apresentado como execução nova. Nenhum push, merge na main, deploy, npm, tag ou Release foi realizado.
