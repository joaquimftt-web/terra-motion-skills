# Changelog

## 23/10/2026 — L3, sem bump de versão

Layout Reflow, Skeleton-to-Content e Data Change Feedback, skill operacional layout-transitions e três demos reais no laboratório. Catálogo com 11 recipes/quatro skills, 16 subpaths e 17 referências. Controles de duração, fallback conservador, SSR/hidratação e consumidor independente documentados e testados. Identidade V4, P1/P3, galeria, assets e contratos anteriores preservados; P2 permanece removido. Pacotes npm não publicados; Release/tag v0.1.0 histórica e inalterada. [Contratos](L3_CONTRACTS.md) e [gates locais](VALIDATION.md). Integração/deploy exigem os gates próprios deste lote, registrados na entrega.

## 23/10/2026 — remoção da passagem decorativa P2, sem nova versão

Removidos plano raster transitório, controlador, hook e CSS exclusivos do Mineral Fold. Preservados fundo/identidade V4, P1/P3, espaçamento, galeria, recipes, APIs e assets. Nove testes unitários do recurso excluído foram aposentados; oito cenários E2E de ausência da faixa e continuidade da transição foram acrescentados. Detalhes: [P2_REMOVAL.md](P2_REMOVAL.md).

## 21/10/2026 — experiência integrada publicada, sem nova versão de biblioteca

Landing V4/P1/P2/P3, laboratório Mineral Técnico e referências publicados no Pages em `49d724183732bc8a82e8ed6889e9ecbd3338d527`; [run bem-sucedido](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39654669658). Overflow de 320 px no runner Linux reproduzido e corrigido antes do deploy final. Direitos específicos dos assets regularizados e avisos separados preservados. Fechamento editorial atualiza estado público, operação e contribuição sem alterar runtime, recipes, skills, identidade visual ou dependências. Release/tag histórica v0.1.0 preservada; R1 isolada e npm não publicado.

## Histórico de preparação (estados da época)

## 21/10/2026 — candidato local de fechamento, sem bump/commit/publicação

Experiência V4/P1/P2/P3 e laboratório Mineral Técnico aceitos localmente. Correções de proveniência raster, READMEs/estado Pages, configuração autossuficiente de testes, verificação de rotas/avisos e gate de direitos antes do upload. Fontes públicos e Release v0.1.0 permanecem intactos. Assets originais preservados; distribuição pública ainda bloqueada. Resultados: CLOSING_VALIDATION.md.

## Histórico anterior

As entradas seguintes registram o estado da etapa em que foram produzidas, incluindo ausência de hospedagem/tag antes das publicações posteriores.

## 20/10/2026 — suporte local ao GitHub Pages

Base local e Pages, links do showcase, exportação de referências com URLs de origem e avisos legais integrais, verificador do artefato e workflow com build/validação separados do deploy. Playwright preservado e ampliado para as duas bases. Operação e rollback em [HOSTING.md](HOSTING.md); resultados em [VALIDATION.md](VALIDATION.md). Sem nova funcionalidade, redesign, alteração de recipe/skill/contrato ou dependências. Workflow ainda sem push; nenhuma configuração remota ou deploy realizado nesta etapa. Tag e Release v0.1.0 preservadas.

## 20/10/2026 — documentação após o primeiro push

Código-fonte público em [joaquimftt-web/terra-motion-skills](https://github.com/joaquimftt-web/terra-motion-skills), branch main. READMEs, identidade e estado de publicação atualizados, sem alterações funcionais. Showcase ainda sem hospedagem; tag, Release v0.1.0 e pacotes npm não publicados. Os registros abaixo descrevem etapas históricas anteriores ao primeiro push e mantêm o estado daquela época.

## 0.1.0 — identidade Terra Motion Skills

Nome oficial e apresentação atualizados para Terra Motion Skills; destino previsto joaquimftt-web/terra-motion-skills. Título HTML, marca visível, nome acessível e rodapé do showcase atualizados sem mudar CSS, funcionalidades ou motions. Identificadores técnicos e histórico privado preservados; [inventário](IDENTITY.md). MIT e copyright de 2026 Joaquim Freitas mantidos. Registros e capturas anteriores conservam o nome usado à época. Sem remoto, push ou deploy.

## 0.1.0 — cópia pública candidata

Snapshot independente sem histórico privado. READMEs PT/EN atualizados, exemplos compilados, caminhos pessoais e identificadores privados removidos da edição documental, imagens A1 preservadas e resumo editorial da revisão externa. Ignore reforçado e avisos de runtime preservados em THIRD_PARTY_NOTICES.md. MIT aprovada para o código original, Copyright (c) 2026 Joaquim Freitas, com texto integral em LICENSE. Manifests atualizados para MIT e avisos de terceiros preservados. APIs, motions, skills e dependências funcionais permanecem iguais. Nenhum remoto ou publicação autorizado. Ver [estado de preparação](PUBLICATION_STATUS.md).

## 0.1.0 — refinamento local A1

Após aceite da v0.1 como marco local, refinada a legibilidade do showcase: código de 10 para 14 px, metadados informativos de 7–10 para 12 px, controles de 14 px com altura mínima de 40/44 px, quebras responsivas e espaços ajustados. Implementação de produção restrita a `apps/showcase/src/app/app.css`; arquitetura, receitas, componentes React, skills e motions preservados. Adicionados quatro testes de regressão, comparações reais em quatro larguras e zoom nativo de 200%. Revalidação: 22 Vitest, 17 Playwright e nove auditorias axe sem violações retornadas. [Evidências e limites](REFINEMENT_A1.md).

Relatório independente representado por resumo público em [docs/reviews](reviews/2026-10-19-independent-review-v0.1.md). A2/A3 em backlog e A4 pendente antes da publicação. Sem nova versão de pacote, push ou publicação.

## 0.1.0 — revisão local

Entregue localmente para revisão do usuário: Button Feedback e Accordion Transition independentes, tokens neutros, duas skills operacionais e showcase responsivo com controles reais. Suíte final: 22 testes Vitest, 13 testes Playwright e oito auditorias axe sem violações retornadas. Preferência do sistema acompanhada durante a sessão e conteúdo do Accordion sem fade para preservar contraste. Evidências e limites estão em [VALIDATION.md](VALIDATION.md). Nome provisório, licença pendente. Sem distribuição, push ou publicação. Drawer e motores futuros permanecem adiados.

## M13 — lote de integração, sem bump de versão

Expandable Cards controlado no fluxo, demo e extensão de layout-transitions. 12 recipes, 4 skills e 17 subpaths. Publicação depende dos gates e merge deste lote.
