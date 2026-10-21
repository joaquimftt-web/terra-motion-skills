# Histórico — Landing Page2.0 / prévia V2

> Registro histórico preservado: tempos, estados e decisões abaixo pertencem à V2. O candidato atual é a experiência V4/P1/P2/P3 com laboratório Mineral Técnico aceita localmente; consulte docs/CLOSING_VALIDATION.md e docs/PUBLICATION_STATUS.md. Este registro não descreve o deploy público atual.

**Protótipo exploratório para revisão visual/comportamental. Não integrado, não publicado e não representa uma nova versão da biblioteca.** Base: main pública `baceffee40bfaf9ed1461af92964e2d2a840a4ce`. Branch isolada: `prototype/landing-2`. R1 permanece separada; R2–R5 não estão implementadas aqui.

## Executar

Com as ferramentas/dependências do workspace disponíveis, encerrar outro servidor na porta 4180 e executar na raiz:

```sh
pnpm prototype
```

Padrão local: http://127.0.0.1:4180/. Rotas: `/`, `/lab/`, `/referencias/`. O laboratório preserva App e suas funcionalidades; as demais páginas usam CSS e motion privados do protótipo.

Para inspecionar o build Pages:

```powershell
$env:SHOWCASE_BASE_PATH = '/terra-motion-skills/'
pnpm build
pnpm --filter @motion-skills-lab/showcase preview --port 4180
```

Abrir http://127.0.0.1:4180/terra-motion-skills/. Para voltar à base local, remover SHOWCASE_BASE_PATH do ambiente e reconstruir. Essa variável não é segredo.

## O que avaliar

- Abertura editorial: identificação → título → descrição e geometria original, em sequência breve.
- Composição em obsidiana, bronze, cobre, verde mineral e marfim, com o PNG original do símbolo Terra Commerce, sem edição do desenho.
- Narrativa: intenção → duas recipes reais → método → acesso ao laboratório.
- Cards com feedback de hover e demonstrações reais de Button Feedback e Accordion Transition.
- Laboratório completo no seu próprio endereço, com sidebar, controles, código, copy/replay e redução existentes.
- Referências: seis recursos originais e links de inspiração com proveniência.

Os motions novos são exclusivos da apresentação: intro parcial (opacity 0,92 → 1; texto 8/14 px, planos 22/30 px; 550 ms para texto e 850 ms para planos, defasagem 60 ms), entradas de grupos fora da viewport (16 px → zero, 480 ms, sem fade), replay privado contínuo e hover de cards (−4 px, 200 ms). Não são exports de recipes, não usam R1 e não implementam as APIs de R2/R3/R4/R5. Não há loop decorativo, scroll-jacking, Lenis, GSAP ou asset copiado.

HTML/CSS partem do estado visível. A intro só é preparada em montagem síncrona antes do load; inicialização realmente tardia fica estática. Redução/foco/ponteiro/suspensão encerram a apresentação. Navegação e CTAs não são alvos animados. A redução manual é estado em memória da página; a preferência do sistema prevalece em todas as páginas.

## Navegação estática e compatibilidade

Sem roteador novo: a navegação entre páginas recarrega o documento. O Vite gera também `lab/index.html` e `referencias/index.html`, com os mesmos caminhos absolutos de assets sob a base. Links diretos e refresh foram exercitados em servidor estático estrito, sem fallback de SPA. Os diretórios usam barra final.

Os seis `/reference/*`, LICENSE e THIRD_PARTY_NOTICES.md mantêm seus caminhos e conteúdo. Os links antigos na raiz `#visao-geral`, `#button-feedback`, `#accordion-transition`, `#fundamentos` e `#conteudo` encaminham a `/lab/` com o fragmento preservado, via location.replace; também se tratam mudanças de hash na raiz. `#biblioteca` pertence à landing.

## Validação e limites de integração

Para executar a suíte existente no novo endereço do laboratório:

```powershell
$env:PROTOTYPE_LAB = '1'
$env:SHOWCASE_BASE_PATH = '/terra-motion-skills/'
pnpm test:e2e
```

PROTOTYPE_LAB ajusta apenas o endereço de teste e sua assertion de pathname. Nenhuma assertion de comportamento, acessibilidade ou cobertura foi removida. O modo padrão dos testes continua o endereço original; portanto o protótipo exige o modo acima para testar o laboratório movido. Esse ajuste de roteiro precisa ser consolidado caso a nova navegação seja integrada.

O auditor público `check:showcase` e o workflow permanecem intactos e aceitam somente o artefato atual de uma página. Os dois novos HTMLs estão fora dessa lista: **esta branch não é candidata a push/deploy direto**. A integração futura precisa aprovar e testar uma nova lista explícita de arquivos/rotas, preservando os gates existentes.

Os resultados e evidências desta exploração estão fora do repositório, em `../terra-landing-v2-evidence/` (V2) e `../terra-landing-evidence/` (histórico V1). Nenhum teste visual equivale à aprovação do desenho pelo titular. Não há benchmark em hardware modesto nem validação de leitores de tela, Firefox/WebKit ou aparelhos físicos nesta prévia. O zoom nativo de 200% da V2 foi verificado separadamente em Chromium nas três páginas, com métricas e capturas no relatório V2.

## Integração proposta, somente após revisão

1. **Revisão visual:** composição, linguagem, marca tipográfica provisória, hierarquia móvel e intensidade/duração dos motions. Ajustar apenas o que a revisão identificar.
2. **Navegação e compatibilidade:** consolidar as três páginas, metadados por rota e os redirecionamentos de âncoras; validar bases local/Pages e URLs diretas. Manter biblioteca e skills intactas.
3. **Apresentação:** transportar somente os elementos aprovados de CSS/SVG/motion privados, revisar fallback tardio/JS e limites de performance. Não integrar R1/R2 implicitamente.
4. **Qualidade e hospedagem:** consolidar testes das três páginas, checklist de teclado/contraste/200% real, inventário/licenças do artefato, auditor estático e workflow. Medir custo com CPU limitada e dispositivos reais quando disponíveis.
5. **Publicação separada:** revisão final e autorização explícita antes de merge/push/deploy. Não modificar v0.1.0 nem antecipar evolução das recipes.

MIT e Copyright (c) 2026 Joaquim Freitas permanecem intactos. Referências de terceiros não são redistribuídas nem incorporadas à licença do código original.

## Refinamento V2 — identidade e composição

A V1 foi preservada com seus arquivos alterados e build em ../terra-landing-v1-preserved/. A V2 mantém a mesma branch isolada, sem commits novos. A referência Fuel foi reconferida em navegador real: hero de grande área, mudança de superfícies e quadros sobrepostos. Os tempos e comportamentos da prévia são próprios; código e assets do Fuel não foram copiados.

O fundo agora é arquitetônico e atravessa as seções. Os cards passaram a superfícies amplas em cobre/mineral. O laboratório mantém sua aparência funcional anterior. A logo original mede 256 × 256 px e é exibida em 44/52 px CSS, sem crop, filtro ou alteração de cores/forma. SHA-256 do PNG: 5426D5E05C1AB9949425431D44683650DABF5088AF088B88C383D57226B72D9F. O arquivo original e a cópia são idênticos. A autorização é para esta prévia, sem presumir licença MIT da marca; condições de publicação do asset precisam ser confirmadas antes da integração.

Evidências V2 e resultados atualizados: ../terra-landing-v2-evidence/. O relatório V1 permanece histórico, sem ser sobrescrito. As verificações concluídas de zoom nativo estão registradas separadamente no relatório V2; não são simulação de viewport.

### Fechamento de acessibilidade V2

O zoom nativo foi confirmado por chrome.tabs.setZoom/getZoom = 2, reaplicado após cada navegação: janela 1440 px, viewport CSS 1424 → 712, DPR 1 → 2, scale 1 e CSS zoom 1. Landing, laboratório e referências sem overflow/texto escapando; axe sem violações retornadas nas três rotas. A barra de navegação da prévia passou a ser renderizada dentro de App, após seu skip link, para preservar a prioridade desse link; nenhuma recipe ou controle foi alterado. A preferência manual também remove o scroll suave de âncoras.

O recorte dos cards V2 usa overflow: clip: evita criar uma área rolável interna que o foco nativo poderia deslocar após replay e navegação entre demonstrações. A sequência foi reproduzida e revalidada com geometria DOM e captura reais.

## Exploração V3 — local, ainda não aprovada visualmente

V2 preservada em ../terra-landing-v2-preserved/ com fontes alterados, build e manifesto. V3 substitui a composição arquitetônica por faixas metálicas originais, geometria mobile própria e superfícies editoriais contínuas. A imagem 05_background_login_aprovado.png é somente referência e não foi incorporada como asset. Logo binária original preservada. Nenhuma integração com R1/R2 ou alteração funcional do laboratório. Motions de apresentação privados: texto 14/28 px, planos 30–64 px, opacity 0,82 → 1, duração 720/1050 ms, sequência limitada a 420 ms; entradas de scroll 24 px/600 ms. Texto e ações continuam disponíveis; redução/foco/interação limpam a apresentação. Evidências e limites atuais em ../terra-landing-v3-evidence/RELATORIO.md; seções anteriores deste documento descrevem a evolução histórica V1/V2.

## V4 — direção material prioritária

Apoio raster original autorizado exclusivamente para a nova prévia local: src/prototype/assets/terra-material-reference.png, com proveniência no README da pasta. A imagem participa do hero e de superfícies recortadas por CSS em conceito, demonstrações, método e encerramento. Não é reconstrução procedural ou geometria 3D independente. V3 preservada em ../terra-landing-v3-preserved/. Evidências atuais em ../terra-landing-v4-evidence/. A V4 mantém as rotas, os contratos, o laboratório e a logo. Hero privado com opacity 0,48 → 1 em texto e 0,82 → 1 em material/luz, durações 900/1150 ms, defasagens até480 ms; CTAs estáveis. Uso, otimização e eventual substituição do PNG precisam de revisão antes de integração pública; esta entrega não autoriza deploy.

## P1 — coreografia do hero, sem redesign

V4 preservada em ../terra-landing-v4-preserved/ (fontes alterados, build e manifesto). O estado final e os enquadramentos da V4 permanecem. O controlador privado heroPresentation.ts apresenta material e duas linhas editoriais com score desktop/mobile distinto; não é recipe nem export público. Máscara só no material decorativo; CTA/nav estáveis e utilizáveis. Replay captura o estado corrente e substitui a execução anterior. Foco/redução/falha/cleanup deixam o estado final estático. A regra existente de cancelamento das entradas abaixo do hero foi preservada. Evidências e especificação de tempos em ../terra-landing-p1-evidence/RELATORIO.md. P2-P3-NARRATIVA.md é apenas proposta; nenhum motion desses lotes foi implementado. Sem commit, integração ou publicação.
