# Identidade do projeto e inventário técnico

## Identidade oficial

- Projeto: **Terra Motion Skills**.
- Repositório público: [joaquimftt-web/terra-motion-skills](https://github.com/joaquimftt-web/terra-motion-skills).
- Branch: `main`; versão inicial publicada: `v0.1.0`.
- Código original: MIT, **Copyright (c) 2026 Joaquim Freitas**.
- Git público: Joaquim Freitas, `319236695+joaquimftt-web@users.noreply.github.com`.

O nome anterior, Motion Skills Lab, foi substituído na apresentação atual. A alteração é nominal: sem novas funcionalidades, mudanças de contrato ou redesenho. Não representa afiliação com a Motion.

## Inventário anterior a qualquer renomeação técnica

| Identificador existente                                              | Uso                                          | Decisão nesta etapa |
| -------------------------------------------------------------------- | -------------------------------------------- | ------------------- |
| `motion-skills-lab-workspace`                                        | Nome privado da raiz                         | Preservar           |
| `@motion-skills-lab/showcase`                                        | App privado e filtros pnpm/preview           | Preservar           |
| `@motion-skills-lab/motion-recipes`                                  | Imports públicos e subpaths das receitas/CSS | Preservar           |
| `@motion-skills-lab/motion-tokens`                                   | Tokens e CSS consumidos pelas receitas/app   | Preservar           |
| `motion-foundations`                                                 | Nome e pasta da skill de fundamentos         | Preservar           |
| `microinteraction-design`                                            | Nome e pasta da skill de interações          | Preservar           |
| `ButtonFeedback`, `AccordionTransition`, `motionTokens`              | Exports e contratos implementados            | Preservar           |
| `packages/motion-recipes`, `packages/motion-tokens`, `apps/showcase` | Estrutura modular                            | Preservar           |
| `lab-shell` e demais classes, IDs/âncoras e subpaths CSS             | Estilos, navegação e seletores               | Preservar           |

O inventário foi feito antes das edições. Filtros pnpm, imports, manifests, workspace e lockfile continuam coerentes entre si; os nomes privados locais não são o nome público do repositório. Não houve publicação npm. Uma eventual migração de namespace exige decisão separada, sem ser necessária ao uso do repositório público atual.

## Referências históricas preservadas

Especificação e plano em `docs/superpowers/`, registros anteriores de validação, logs e capturas A1 mantêm o nome utilizado quando produzidos. Não foram reescritos para simular evidências com a marca nova. As capturas históricas dos READMEs estão identificadas; as verificações desta etapa ficam em [VALIDATION.md](VALIDATION.md).

Os caminhos dos documentos históricos permanecem para preservar links. O diretório local de preparação também pode manter o nome antigo, sem afetar a identidade do repositório público. O histórico privado original permanece separado e intacto. O histórico público começou com um commit raiz saneado e recebe commits normais posteriores; origin aponta para o repositório público e main acompanha origin/main. O showcase v0.1 está hospedado no [GitHub Pages](https://joaquimftt-web.github.io/terra-motion-skills/), pelo deploy de `baceffee`. Pacotes npm não foram publicados. Tag e Release v0.1.0 estão preservadas. Landing P1/P2/P3, laboratório Mineral Técnico e referências são uma evolução aceita localmente, ainda sem integração ou deploy; identidade visual não altera os contratos da biblioteca.
