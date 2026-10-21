# Hospedagem — GitHub Pages

## Estado público confirmado em 21/10/2026

Showcase v0.1 ativo em **https://joaquimftt-web.github.io/terra-motion-skills/**. Primeiro deploy:20/10/2026, commit `baceffee40bfaf9ed1461af92964e2d2a840a4ce`, [run 39469817919](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39469817919). Jobs de validação/build e deploy concluídos com sucesso. Conferência atual por API/HTTPS, sem disparar workflow. Pages usa GitHub Actions e HTTPS obrigatório.

**Público:** vitrine v0.1 com Button Feedback, Accordion Transition, referências e avisos. **Somente local:** landing V4/P1/P2/P3, laboratório Mineral Técnico e rota de referências da experiência integrada. Aceitação visual não significa publicação. Release/tag v0.1.0 preservada; sem pacotes npm.

## Build, rotas e recursos

Tokens → receitas → showcase via `pnpm build`. Artefato exclusivo: `apps/showcase/dist`. Base `/` ou `/terra-motion-skills/`. Build cria `index.html`, `lab/index.html` e `referencias/index.html` com a mesma entrada JS/CSS: acesso direto e refresh independem do fallback SPA/404 do Pages. Usar barras finais; âncoras antigas de recipes redirecionam para o laboratório. Sem backend ou catch-all para rotas arbitrárias.

Links usam `import.meta.env.BASE_URL`. Seis referências exportadas mantêm os fontes intactos; somente links Markdown relativos das cópias viram URLs para o SHA de origem. Em clone Git usa-se HEAD. Na cópia sem Git, `PROTOTYPE_SOURCE_REVISION` aponta para a base conhecida. **Não fixar esse override no workflow:** o build integrado deve usar seu novo SHA.

LICENSE, THIRD_PARTY_NOTICES.md, ASSET_NOTICES.md e aviso de identidade integram o artefato, sem fontes completos, evidências de auditoria, Git, caches ou node_modules. Auditor exige entradas, imagens idênticas aos fontes, allowlist, bases e avisos; rejeita symlinks/padrões de dados privados. Gate separado verifica registros de direitos, não constitui certificação jurídica.

## Validação local

Node 24.20.0/pnpm 11.24.0 fixados. Na raiz:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm validate:skills
pnpm check:boundaries
pnpm check:consumer
```

```powershell
# Somente na cópia sem .git; omitir em clone normal:
$env:PROTOTYPE_SOURCE_REVISION='baceffee40bfaf9ed1461af92964e2d2a840a4ce'
$env:SHOWCASE_BASE_PATH='/'
pnpm test:e2e
pnpm check:showcase
$env:SHOWCASE_BASE_PATH='/terra-motion-skills/'
pnpm test:e2e
pnpm check:showcase
pnpm check:publication
pnpm --filter @motion-skills-lab/showcase preview
```

Em Bash, aplicar a mesma variável ao comando. E2E reconstrói com a base selecionada. Recipes usam `/lab/` por padrão, sem exigir PROTOTYPE_LAB; landing/referências usam rotas explícitas. Chromium instalado e porta 4173 livre são necessários. Preview não é servidor de produção.

**Bloqueio esperado:** `check:publication` retorna código 2 enquanto os direitos públicos dos dois assets não estiverem confirmados. Não remover a barreira: registrar titular, termos e evidência legítima em ASSET_RIGHTS.json e atualizar avisos antes de publicar.

## Workflow candidato versus público

Workflow público concluído permanece intocado. No candidato mantêm-se Actions por SHA, versões Node/pnpm, lockfile congelado, jobs separados, concorrência pages sem cancelar execução ativa, timeouts20/10 min, permissões mínimas e checkout sem credenciais persistidas. Acrescentou-se gate dos assets antes do upload.

O último build é Pages; E2E e auditor validam esse diretório. Não há rebuild entre validação e upload. Deploy recebe o artefato daquele build, sem compilação. Push/dispatch em main pode publicar; dispatch em outra branch valida, sem deploy. **A barreira CI não impede um push de expor os fontes/assets no GitHub:** confirmar direitos antes de qualquer envio remoto.

A pipeline candidata não foi executada em Linux remoto nesta etapa. O run público anterior comprova somente a pipeline/v0.1 daquele SHA. Não são necessários PAT, segredo manual, npm publish ou serviço pago neste escopo. Titular deve reconferir Source e proteção de github-pages antes de futura integração.

## Integração e smoke futuro

Roteiro exato e condições: [CLOSING_INTEGRATION.md](CLOSING_INTEGRATION.md). Sem operação Git de escrita ou publicação neste fechamento.

Após autorização futura: acompanhar novo SHA nos jobs e deployment. No HTTPS real, verificar raiz/lab/referências por navegação direta/refresh/âncoras; seis referências sem fallback HTML; imagens/JS/CSS/três avisos; teclado/foco/disabled/painel inerte; duração/replay/reset/cópia; movimento reduzido inicial/ao vivo; quatro larguras e ausência de overflow. Teste local não substitui esse smoke futuro.

## Rollback

Build/gate falhou: sem upload/deploy, manter site conhecido. Deploy falhou: conferir deployment efetivo antes de presumir substituição. Regressão publicada: reverter commit de integração com **novo commit normal**, executar pipeline completa e repetir smoke. Sem reset/force push ou mover tags. Um revert integral ao código de `baceffee` restaura o workflow e o artefato anteriores, sem assets novos. Registrar SHAs/logs antes/depois.

Em incidente grave, o titular pode autorizar Settings → Pages → Unpublish site. Desativar workflow sozinho não remove conteúdo hospedado. Nenhuma dessas ações está autorizada agora.

## Cache e limites

HTTPS público atual retornou Cache-Control:max-age=600 e ETag; não é promessa para todos recursos/futuras versões. JS/CSS/material têm nomes com hash; logo em caminho estável pode permanecer em cache até expirar/revalidar. Preview local não reproduz CDN Pages. Pesos, otimização e direitos: [ASSET_RIGHTS.md](ASSET_RIGHTS.md). Sem garantia de 60fps ou validação em dispositivo físico, outro navegador ou leitor de tela.

## Fontes oficiais

- [Vite: base](https://vite.dev/guide/build.html#public-base-path).
- [Pages: workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
- [Limites Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
- [Despublicar](https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site).

## Gate e regularização dos assets

O candidato de regularização exige aviso separado regular e não vazio, originais e WebP com hashes registrados, derivação obrigatória, titular/termos e evidência regular não vazia sob docs, sem symlinks/junctions. Isso protege a integridade documental; não certifica legitimidade jurídica. Os registros agora contêm a declaração expressa do titular e permissões específicas. Validar check:publication antes de enviar fontes; a autorização operacional de integração/push/deploy continua separada. Consulte docs/ASSET_PROVENANCE_REVIEW.md.
