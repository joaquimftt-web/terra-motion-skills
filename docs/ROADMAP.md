# Roadmap

A Release histórica v0.1.0 entregou Button Feedback, Accordion Transition, duas skills e vitrine. A main atual reúne oito recipes, três skills e 13 subpaths desde a PR #1; [estado publicado](PUBLICATION_STATUS.md). Não há nova versão ou release implícita. Drawer permanece adiado: depende de diálogo modal, contenção/restauração de foco, Escape, fundo inativo, mobile e reduced motion integralmente validados.

## Revisão independente da v0.1

- **A1 — concluído:** refinamento de legibilidade implementado e preservado como base histórica; comparações e revalidação em [REFINEMENT_A1.md](REFINEMENT_A1.md). A experiência integrada posterior está publicada no Pages.
- **A2 — backlog:** ampliar futuramente a verificação estática de fronteiras, considerando grafo/AST e consumo por tarball antes de distribuição pública de pacotes. Não implementado neste lote.
- **A3 — backlog:** avaliar mudança da preferência reduzida durante um timeout de replay já agendado no showcase. Não é defeito comprovado da receita; comportamento não alterado neste lote.
- **A4 — publicação realizada:** nome Terra Motion Skills, código MIT, notices e permissões específicas dos assets registrados. Experiência integrada publicada após autorização do titular; [estado oficial](PUBLICATION_STATUS.md). Firefox/WebKit, leitores de tela e dispositivos físicos continuam limitações de validação, sem alegação de cobertura. Novas publicações exigem autorização de escopo própria.

Fonte: [síntese pública da revisão independente](reviews/2026-10-19-independent-review-v0.1.md). Seus resultados são análise externa e não substituem as execuções locais registradas em VALIDATION.md.

## Possibilidades futuras

Futuras propostas, sem dependências ou estruturas nesta versão:

- Lenis + Motion opt-in: justificar scroll suave contra nativo, loop único, cleanup, preferência reduzida, scroll aninhado, iframes e Safari. Validar termos da versão e de qualquer template individualmente.
- GSAP/ScrollTrigger opt-in: justificar timeline/narrativa complexa contra CSS/Motion, ownership isolado e cleanup por instância, bundle/performance/mobile e licença oficial revisada.
- WebGL: somente diante de caso concreto, fallback estático e orçamento medido. Não é fundação desta biblioteca.
- Colaboração por PR, política de versão, licença e publicação após revisão/autorização do titular. Nenhuma dessas propostas é funcionalidade disponível.
