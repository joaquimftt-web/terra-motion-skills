# Hospedagem do showcase — GitHub Pages

## Estado e limites

Suporte implementado e validado localmente; primeiro push do workflow e deploy real ainda dependem de autorização. URL planejada: https://joaquimftt-web.github.io/terra-motion-skills/. Não considerar essa URL ativa até o smoke público passar. A tag e a Release v0.1.0 permanecem intactas. Na conferência de 20/10/2026, Pages já constava configurado para GitHub Actions com HTTPS, sem execuções de workflow; essa configuração não foi alterada nesta implementação.

O repositório usa React, TypeScript strict, Motion, Vite e pnpm. Tokens compilam antes das receitas; o showcase consome os exports públicos. O comando raiz `pnpm build` respeita essa ordem. O artefato publicado é exclusivamente **apps/showcase/dist**, nunca a raiz do monorepo. Não há servidor, banco, domínio pago, nova dependência ou publicação npm.

## Bases e execução local

`SHOWCASE_BASE_PATH` aceita somente `/` (padrão) e `/terra-motion-skills/`. Vite e Playwright usam o mesmo valor; links do showcase usam `import.meta.env.BASE_URL`. A variável configura um caminho público de build, não um segredo. Sem a variável, `pnpm dev`, build e preview continuam na raiz.

Na raiz do clone, com Node **24.20.0** e pnpm **11.24.0**:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm validate:skills
pnpm check:boundaries
pnpm check:consumer
```

Validar a raiz e depois Pages; cada `test:e2e` reconstrói o projeto. A variável precisa permanecer aplicada durante essa reconstrução e o preview.

```sh
# Bash
SHOWCASE_BASE_PATH=/ pnpm test:e2e
SHOWCASE_BASE_PATH=/ pnpm check:showcase
SHOWCASE_BASE_PATH=/terra-motion-skills/ pnpm test:e2e
SHOWCASE_BASE_PATH=/terra-motion-skills/ pnpm check:showcase
SHOWCASE_BASE_PATH=/terra-motion-skills/ pnpm --filter @motion-skills-lab/showcase preview
```

```powershell
$env:SHOWCASE_BASE_PATH = '/'
pnpm test:e2e
pnpm check:showcase
$env:SHOWCASE_BASE_PATH = '/terra-motion-skills/'
pnpm test:e2e
pnpm check:showcase
pnpm --filter @motion-skills-lab/showcase preview
# Após encerrar o preview, restaurar o padrão local:
Remove-Item Env:SHOWCASE_BASE_PATH
```

Abrir http://127.0.0.1:4173/terra-motion-skills/ para Pages. A porta 4173 precisa estar livre. Vite preview é uma ferramenta local, não o servidor de produção. Para reconstruir sem E2E, usar `pnpm build` com a base desejada.

## Recursos, documentação e licenças

O exportador mantém seis referências estáticas: duas skills, dois fontes TSX, contrato e fontes/licenças. Os arquivos originais permanecem intactos; somente URLs relativas das cópias Markdown são convertidas em links HTTPS para o commit de origem no GitHub. Markdown/TSX são arquivos de texto, podendo ser exibidos ou baixados conforme o navegador; não há renderizador Markdown ou execução das skills no browser.

LICENSE e THIRD_PARTY_NOTICES.md são copiados integralmente para a raiz do artefato. Seus termos não são alterados. Os arquivos gerados em `apps/showcase/public` são ignorados pelo Git. O artefato não inclui a árvore documental inteira, imagens de auditoria, node_modules, caches, credenciais ou histórico Git.

`pnpm check:showcase` confere base de JS/CSS, arquivos esperados, avisos idênticos, links Markdown exportados, tamanho, ausência de symlinks e arquivos fora da lista permitida, além de padrões conhecidos de credenciais e caminhos pessoais. Essa triagem não é garantia exaustiva de segurança.

## Workflow e permissões

`.github/workflows/pages.yml` tem jobs separados de build/validação e deploy. Usa ubuntu-24.04, Node/pnpm exatos, instalação congelada e cache do store por lockfile. Actions foram verificadas e fixadas por SHA; suas versões estão nos comentários do workflow.

O job de build tem somente contents:read; executa todas as validações e E2E/axe para as duas bases. O último build é Pages e somente ele é enviado como artefato. O job de deploy depende do build, só executa em main e usa pages:write e id-token:write no ambiente github-pages. Checkout não persiste credenciais. Não há PAT, segredo manual ou autoativação do Pages.

Gatilhos: push em main e workflow_dispatch. Dispatch em outra branch pode validar, mas não publicar. Grupo de concorrência pages, sem cancelar execução em andamento: nenhum deploy simultâneo; o GitHub pode substituir execuções ainda pendentes. Falhas bloqueiam publicação; relatórios de browser são retidos por três dias e o artefato Pages por um dia. Timeouts: build 20 minutos, deploy 10 minutos.

## Primeira publicação — passos no GitHub

1. Autorizar separadamente o primeiro push das alterações de hospedagem. O workflow ainda não foi enviado nesta etapa.
2. Em Settings → Pages → Build and deployment, confirmar **GitHub Actions** como Source (já observado na conferência final). A action configure-pages está com enablement:false e não ativa o serviço automaticamente.
3. Conferir Settings → Environments → github-pages, restringindo deploy a main; pode haver aprovação manual se configurada pelo titular.
4. Após o push autorizado em main, acompanhar os dois jobs em Actions. Se o push ocorrer antes de ativar Pages, o build pode passar e o deploy falhar; configurar Source e reexecutar o workflow, sem relaxar permissões.
5. Confirmar URL e commit no ambiente github-pages e executar o smoke HTTPS descrito abaixo.
6. Só após o smoke passar, atualizar About → Website e os READMEs PT/EN com a URL real. Registrar o resultado em PUBLICATION_STATUS.md e VALIDATION.md com commit normal. Não alterar a Release v0.1.0.

## Aceite e smoke público

- HTML, JS e CSS corretos no subdiretório, sem erros de console/rede; refresh e âncoras preservam o prefixo.
- Seis referências retornam o conteúdo esperado, sem aceitar fallback HTML; links das cópias apontam a arquivos existentes no GitHub. LICENSE e notices acessíveis.
- Teclado, foco, disabled, conteúdo fechado inert/aria-hidden, interrupções, duração, replay, reset, cópia real e fallback de clipboard.
- Preferência reduzida inicial e alterações durante a sessão; responsividade em 1440, 1024, 390 e 320 px; nenhum overflow; axe sem violações retornadas nos cenários existentes.
- No HTTPS público, repetir navegação, referências, teclado, replay, cópia com permissão real do navegador e movimento reduzido. Automação local não equivale ao teste do serviço Pages.

Validações locais em Windows/Chromium não comprovam execução do runner Linux ou disponibilidade do serviço remoto. Outros navegadores, leitores de tela, aparelhos físicos e novo zoom nativo de 200% permanecem limitações. A2/A3 continuam no backlog.

## Rollback

Se validação/build falhar, não há deploy novo; manter a última versão funcional e corrigir o erro. Se o deploy falhar, conferir o ambiente antes de assumir que o site mudou. Em regressão publicada, reverter as alterações responsáveis com commit normal em main e repetir o pipeline completo sobre uma versão de hospedagem conhecida e funcional. Não usar reset/force push nem mover tags.

Na primeira publicação, ainda sem versão hospedada anterior funcional, interromper novos deploys e usar Settings → Pages → Unpublish site para retirar o site; apenas desativar o workflow não remove o site já publicado. O código-fonte e a Release continuam disponíveis. Relançar somente após correção e validação.

## Fontes oficiais

- [Vite: base pública](https://vite.dev/guide/build.html#public-base-path).
- [GitHub Pages: workflow personalizado](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
- [Limites do Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits): site até 1 GB, banda com limite flexível de 100 GB/mês, timeout de deploy de 10 minutos.
- [Actions e custos](https://docs.github.com/en/actions/concepts/billing-and-usage): runners padrão em repositório público não exigem serviço pago neste escopo; evitar runners pagos e retenção desnecessária.
- [Despublicar o site](https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site).
