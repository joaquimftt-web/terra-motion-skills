# Integração futura — roteiro exato e condições de parada

## Estado e autorização

Candidato de fechamento local, sem commit/merge/push/deploy. Base pública conhecida: `baceffee40bfaf9ed1461af92964e2d2a840a4ce`. Experiência visual aceita: V4/P1/P2/P3 e laboratório A. Sem Scroll Reveal, R2, bump, tag ou alteração da Release v0.1.0. Snapshot aprovado anterior e checkouts preservados por hashes/refs/status.

**NÃO INTEGRAR/PUBLICAR AGORA:** permissões específicas de logo/material registradas por declaração do titular em 21/10/2026; operações Git e deploy ainda exigem autorização. O gate CI não protege os assets contra exposição pelo próprio Git: não enviar uma branch contendo-os antes de resolver direitos e obter autorização final. O código MIT e o deploy v0.1 existente não concedem essa permissão.

## Antes de autorizar

- Confirmar titularidade/termos públicos da logo e da imagem, incluindo derivação WebP, fontes públicos e CDN/Pages; registrar evidência real e avisos.
- Atualizar ASSET_RIGHTS.json legitimamente e executar `pnpm check:publication` com resultado pronto; não desabilitar o gate.
- Rever o manifesto final, verificar hashes e garantir que só este candidato será transportado, sem histórico privado/branch Scroll Reveal.
- Reexecutar validação se declarações/avisos/arquivos mudarem. Não tratar os resultados atuais como prova de um futuro SHA diferente.
- Obter autorização explícita para operações Git, integração e push. Um push em main pode disparar deploy automaticamente.

## Operações futuras, somente após autorização

Na cópia pública Git original, limpa, com origin exatamente `https://github.com/joaquimftt-web/terra-motion-skills.git`:

```powershell
git status --porcelain
git remote get-url origin
git fetch origin
git rev-parse main origin/main
```

Se main/origin/main divergirem do SHA conhecido acima, **parar**, atualizar a análise do diff e validar nova base; sem resolver automaticamente. Confirmar branch/tag/HEAD de Scroll Reveal e Release antes/depois.

```powershell
git switch -c integration/experience-closing origin/main
# Defina $closingPackage como o diretório do pacote extraído.
node "$closingPackage/tools/apply-integration.mjs" --inspect "$PWD"
# Depois de direitos resolvidos, manifesto regenerado e aplicação autorizada:
node "$closingPackage/tools/apply-integration.mjs" --apply "$PWD"
git diff --check
git diff --stat
git status --short
pnpm install --frozen-lockfile
```

O pacote fornece manifesto de arquivos adicionados/alterados e hashes. A inspeção do helper é somente leitura. A aplicação exige branch integration/, base/árvore/origin corretos, hashes válidos, gate aprovado e manifesto com publicação liberada; a prontidão documental não autoriza a aplicação; somente uma autorização operacional futura permite usar --apply. O helper nunca cria commit, branch, merge ou push. O diretório fontes contém somente os fontes planejados. Transportar arquivos por manifesto, não usar merge da branch do protótipo nem importar histórico de V4/P1. Não usar cherry-pick de commits privados ou de feat/scroll-reveal.

Remover qualquer override local PROTOTYPE_SOURCE_REVISION num clone Git; o exportador precisa usar o novo SHA. Antes do primeiro commit, revisar que exportações geradas/dist não estão no índice. Executar comandos completos de HOSTING.md nas duas bases e gate público. Em seguida, após aprovação do diff exato:

```powershell
git add --pathspec-from-file="$closingPackage/INTEGRATION_PATHS.txt"
git diff --cached --check
git diff --cached --stat
git commit -m "feat: integrate approved showcase experience and closing checks"
```

Identidade somente na cópia pública: Joaquim Freitas /319236695+joaquimftt-web@users.noreply.github.com. Confirmar autor/committer. Depois do commit, reconstruir/validar com o novo HEAD para que referências exportadas usem esse SHA (o commit só será acessível no GitHub depois do push). Reconfirmar origem, árvore limpa e base remota; qualquer drift exige nova revisão.

```powershell
git switch main
git merge --ff-only integration/experience-closing
git push origin main
```

Esses comandos **não foram executados** e exigem autorização futura. Não usar force, push --tags ou mover Release. Se main não permitir fast-forward, parar. O candidato pode ser entregue via PR se o titular escolher esse fluxo; não criar PR/remoto automaticamente.

## Publicação e aceite HTTPS

Acompanhar Actions do **novo SHA**, jobs build/deploy e ambiente github-pages. Validar que upload usa o diretório Pages testado, sem rebuild posterior e sem assets extras. O job de deploy consome esse artefato. No HTTPS:

1. Raiz/lab/referências por navegação, link direto e refresh com barras finais; âncoras antigas redirecionam corretamente.
2. JS/CSS/WebP/logo sem404, seis documentos retornam texto real, LICENSE/notices/ASSET_NOTICES acessíveis; sem erro de console/rede.
3. Teclado, foco, disabled, abertura/inércia do Accordion, duração, replay rápido, reset, cópia real e fallback.
4. Redução de movimento inicial/ao vivo, quatro larguras, zoom nativo e ausência de overflow; não confundir cache antigo com build novo.
5. Conferir SHA publicado, árvore Git, Release/tag intactas e nenhuma inclusão de Scroll Reveal.

Somente após o smoke do novo deploy atualizar estado de PUBLICATION_STATUS/READMEs para dizer que a experiência integrada também está pública, em commit normal autorizado. About/Website já pode apontar ao endereço existente; nenhuma alteração remota de metadados foi feita aqui.

## Rollback

Registrar o commit de integração I e a base baceffee. Se CI/gate falhar, não houve deploy novo; preservar site atual e apresentar logs antes de mudar/reexecutar. Se o site novo regredir, mediante autorização executar `git revert I` em main limpa e push normal; rodar pipeline completa/restaurada e smoke sobre o SHA de reversão. A reversão integral restaura código/workflow anteriores, sem criar tag ou reescrever histórico. Se houver commits posteriores, analisar a reversão em vez de aplicar cegamente.

O rollback também é operação externa sujeita a autorização. Para incidente sem recuperação, titular pode autorizar despublicação via Pages; desabilitar workflow não remove site já entregue. Nunca apagar histórico privado, resetar main à força ou alterar v0.1.0.

## Condições para autorização final

- [x] Declaração do titular e permissões específicas de ambos assets registradas, com limitações transparentes.
- [ ] Gate check:publication pronto, sem bypass.
- [ ] Base remota/SHA e manifesto final revisados; sem drift.
- [ ] Resultados atuais aceitos com limitações de navegador/hardware registradas.
- [ ] Diff final, identidade Git, avisos e arquivos aprovados.
- [ ] Autorização explícita de commit/integração/push e acompanhamento de deploy.
- [ ] Plano de rollback aceito e SHA público conhecido preservado.

## Manifesto da regularização final

Usar exclusivamente INTEGRATION_FILES.json e INTEGRATION_PATHS.txt do novo pacote de regularização, não o manifesto anterior de 60 arquivos. Ele registra o SHA remoto efetivamente conferido, hashes da base e do candidato, arquivos novos/modificados e nenhuma exclusão. A base deve ser reconferida após autorização, antes de aplicar. A inspeção do helper é somente leitura; --apply continua proibido neste macrolote e condicionado ao gate e à autorização operacional futura. Não transportar evidências de auditoria, histórico Git, dist, caches ou dependências instaladas.

## Atualização da regularização

Registro de permissão: ASSET_PERMISSION_2026-10-21.md. A base de aceitação é a declaração expressa, sem certificação de exclusividade ou etapas de produção desconhecidas. O bloqueio anterior era histórico; utilizar o novo manifesto deste lote e o resultado efetivamente executado do gate. Autorizar uso de assets não autoriza aplicar arquivos, criar commit, merge, push ou deploy. O roteiro e rollback permanecem preservados.
