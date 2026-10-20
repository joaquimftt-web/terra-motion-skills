# Roadmap

v0.1 entrega apenas Button Feedback, Accordion Transition, duas skills e vitrine. Drawer permanece adiado: depende de diálogo modal, contenção/restauração de foco, Escape, fundo inativo, mobile e reduced motion integralmente validados.

## Revisão independente da v0.1

- **A1:** refinamento de legibilidade implementado localmente; comparações e revalidação em [REFINEMENT_A1.md](REFINEMENT_A1.md).
- **A2 — backlog:** ampliar futuramente a verificação estática de fronteiras, considerando grafo/AST e consumo por tarball antes de distribuição pública de pacotes. Não implementado neste lote.
- **A3 — backlog:** avaliar mudança da preferência reduzida durante um timeout de replay já agendado no showcase. Não é defeito comprovado da receita; comportamento não alterado neste lote.
- **A4 — antes da publicação:** decidir nome/licença, revisar notices e obrigações de distribuição; rodada humana de legibilidade/foco/zoom e avaliar Firefox/WebKit, leitores de tela e dispositivos físicos, registrando indisponibilidades. O zoom Chromium foi validado no A1; não encerra as demais pendências. Publicação continua dependendo de autorização explícita do titular.

Fonte: [síntese pública da revisão independente](reviews/2026-10-19-independent-review-v0.1.md). Seus resultados são análise externa e não substituem as execuções locais registradas em VALIDATION.md.

## Possibilidades futuras

Futuras propostas, sem dependências ou estruturas nesta versão:

- Lenis + Motion opt-in: justificar scroll suave contra nativo, loop único, cleanup, preferência reduzida, scroll aninhado, iframes e Safari. Validar termos da versão e de qualquer template individualmente.
- GSAP/ScrollTrigger opt-in: justificar timeline/narrativa complexa contra CSS/Motion, ownership isolado e cleanup por instância, bundle/performance/mobile e licença oficial revisada.
- WebGL: somente diante de caso concreto, fallback estático e orçamento medido. Não é fundação desta biblioteca.
- Colaboração por PR, política de versão, licença e publicação após revisão/autorização do titular. Nenhuma dessas propostas é funcionalidade disponível.
