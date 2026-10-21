import { readFileSync, lstatSync, realpathSync } from 'node:fs';
import { resolve, dirname, isAbsolute, sep, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const requiredSources = [
  'apps/showcase/public/identity/terra-commerce-original.png',
  'apps/showcase/src/prototype/assets/terra-material-reference.png',
];
const optimizedSource = 'apps/showcase/src/prototype/assets/terra-material-reference.webp';
function regularFile(root, name) {
  try {
    const base = realpathSync(root);
    const file = resolve(root, name);
    if (!file.startsWith(resolve(root) + sep)) return false;
    let part = resolve(root);
    for (const segment of relative(root, file).split(sep)) {
      part = resolve(part, segment);
      if (lstatSync(part).isSymbolicLink()) return false;
    }
    const info = lstatSync(file);
    return info.isFile() && info.size > 0 && realpathSync(file).startsWith(base + sep);
  } catch {
    return false;
  }
}
function validEvidence(root, evidence) {
  if (
    typeof evidence !== 'string' ||
    !evidence.startsWith('docs/') ||
    evidence.split(/[\\/]/).includes('..') ||
    isAbsolute(evidence)
  )
    return false;
  try {
    const docs = resolve(root, 'docs');
    const file = resolve(root, evidence);
    const info = lstatSync(file);
    return (
      !lstatSync(docs).isSymbolicLink() &&
      regularFile(root, evidence) &&
      info.isFile() &&
      !info.isSymbolicLink() &&
      realpathSync(file).startsWith(realpathSync(docs) + sep) &&
      readFileSync(file, 'utf8').trim().length > 0
    );
  } catch {
    return false;
  }
}
export function auditPublication(root, registry) {
  const blockers = [];
  if (
    !regularFile(root, 'ASSET_NOTICES.md') ||
    !readFileSync(resolve(root, 'ASSET_NOTICES.md'), 'utf8').trim()
  )
    blockers.push('Missing valid separate asset notice');
  const assets = Array.isArray(registry?.assets) ? registry.assets : [];
  if (
    registry?.schemaVersion !== 1 ||
    assets.length !== requiredSources.length ||
    new Set(assets.map((asset) => asset.source)).size !== requiredSources.length ||
    assets.some((asset) => !requiredSources.includes(asset.source))
  )
    blockers.push('Incomplete or duplicate identity asset inventory');
  for (const source of requiredSources) {
    const asset = assets.find((asset) => asset.source === source);
    if (!asset) {
      blockers.push('Missing asset record: ' + source);
      continue;
    }
    const path = resolve(root, source);
    if (
      !regularFile(root, source) ||
      createHash('sha256').update(readFileSync(path)).digest('hex') !== asset.sha256
    )
      blockers.push('Asset bytes differ: ' + source);
    if (
      source.includes('terra-material-reference.png') &&
      (!Array.isArray(asset.derivatives) ||
        asset.derivatives.length !== 1 ||
        asset.derivatives[0].source !== optimizedSource)
    )
      blockers.push('Missing optimized material provenance');
    for (const derivative of Array.isArray(asset.derivatives) ? asset.derivatives : []) {
      if (
        source !== requiredSources[1] ||
        derivative.source !== optimizedSource ||
        !regularFile(root, derivative.source) ||
        createHash('sha256')
          .update(readFileSync(resolve(root, derivative.source)))
          .digest('hex') !== derivative.sha256
      )
        blockers.push('Invalid derivative record: ' + source);
    }
    const permission = asset.distribution;
    if (
      permission?.status !== 'approved' ||
      typeof permission.holder !== 'string' ||
      !permission.holder.trim() ||
      typeof permission.terms !== 'string' ||
      !permission.terms.trim()
    )
      blockers.push('Public distribution rights unconfirmed: ' + source);
    const evidence = permission?.evidence;
    if (!validEvidence(root, evidence))
      blockers.push('Missing valid permission evidence: ' + source);
  }
  return {
    ready: blockers.length === 0,
    blockers,
    scope: 'Recorded permission and current bytes; not an independent legal certification',
  };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const result = auditPublication(
    root,
    JSON.parse(readFileSync(resolve(root, 'docs/ASSET_RIGHTS.json'), 'utf8')),
  );
  console.log(JSON.stringify(result, null, 2));
  if (!result.ready) process.exitCode = 2;
}
