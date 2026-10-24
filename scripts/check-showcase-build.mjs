import assert from 'node:assert/strict';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'apps/showcase/dist');
const base = process.env.SHOWCASE_BASE_PATH ?? '/';
assert.ok(['/', '/terra-motion-skills/'].includes(base), 'Unsupported showcase base');
const references = [
  'expandable-cards.tsx',
  'layout-reflow.tsx',
  'skeleton-to-content.tsx',
  'data-change-feedback.tsx',
  'layout-transitions.md',
  'scroll-reveal.tsx',
  'staggered-entrance.tsx',
  'scroll-progress.tsx',
  'scroll-motion.md',
  'motion-foundations.md',
  'microinteraction-design.md',
  'motion-contract.md',
  'references-and-licenses.md',
  'button-feedback.tsx',
  'accordion-transition.tsx',
  'presence-transition.tsx',
  'async-state-feedback.tsx',
  'navigation-indicator.tsx',
];
const required = [
  'index.html',
  'lab/index.html',
  'referencias/index.html',
  'identity/terra-commerce-original.png',
  'identity/README.md',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'ASSET_NOTICES.md',
  ...references.map((file) => `reference/${file}`),
];
for (const file of required)
  assert.ok(existsSync(resolve(dist, file)), `Missing artifact file: ${file}`);
for (const file of ['LICENSE', 'THIRD_PARTY_NOTICES.md', 'ASSET_NOTICES.md']) {
  assert.ok(
    readFileSync(resolve(dist, file)).equals(readFileSync(resolve(root, file))),
    `License text differs: ${file}`,
  );
}
const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
assert.equal(
  readdirSync(resolve(dist, 'assets')).filter((name) =>
    /^terra-material-reference-[\w-]+\.webp$/.test(name),
  ).length,
  1,
  'Expected exactly one optimized material asset',
);
const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map((match) => match[1]);
const entryFiles = new Set(assets.map((url) => url.slice(base.length)));
assert.ok(
  assets.some((url) => url.endsWith('.js')) && assets.some((url) => url.endsWith('.css')),
  'Missing JS/CSS entrypoints',
);
for (const url of assets) {
  assert.ok(url.startsWith(`${base}assets/`), `Asset outside expected base: ${url}`);
  assert.ok(existsSync(resolve(dist, url.slice(base.length))), `Missing asset: ${url}`);
}
for (const route of ['lab', 'referencias']) {
  assert.equal(
    readFileSync(resolve(dist, route, 'index.html'), 'utf8'),
    html,
    'Route does not share tested entrypoint: ' + route,
  );
}
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/,
  /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,})\b/,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /https?:\/\/[^\s/:@]+:[^\s/@]+@/,
  /[A-Za-z]:[\\/](?:Users|Projetos)[\\/]/i,
];
let files = 0;
let bytes = 0;
function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = resolve(directory, entry.name);
    const name = relative(dist, full).replaceAll('\\', '/');
    const stat = lstatSync(full);
    assert.ok(!stat.isSymbolicLink(), `Symlink in artifact: ${name}`);
    if (entry.isDirectory()) {
      assert.ok(
        ['assets', 'reference', 'identity', 'lab', 'referencias'].includes(name),
        `Unexpected artifact directory: ${name}`,
      );
      inspect(full);
    } else {
      assert.ok(
        required.includes(name) ||
          (entryFiles.has(name) && /^assets\/[\w-]+\.(?:js|css)$/.test(name)) ||
          /^assets\/terra-material-reference-[\w-]+\.webp$/.test(name),
        `Unexpected artifact file: ${name}`,
      );
      if (/\.(png|webp)$/.test(name)) {
        const original = name.startsWith('identity/')
          ? resolve(root, 'apps/showcase/public/identity/terra-commerce-original.png')
          : resolve(root, 'apps/showcase/src/prototype/assets/terra-material-reference.webp');
        assert.ok(
          readFileSync(full).equals(readFileSync(original)),
          'Unexpected or modified identity image: ' + name,
        );
      }
      const text = /\.(png|webp)$/.test(name) ? '' : readFileSync(full, 'utf8');
      for (const pattern of secretPatterns)
        assert.ok(!pattern.test(text), `Private data pattern in artifact: ${name}`);
      if (name.startsWith('reference/') && name.endsWith('.md')) {
        for (const [, target] of text.matchAll(/\]\(([^)]+)\)/g)) {
          assert.ok(
            /^https:\/\//.test(target) || target.startsWith('#'),
            `Unresolved exported Markdown link: ${name}: ${target}`,
          );
        }
      }
      files++;
      bytes += stat.size;
    }
  }
}
inspect(dist);
assert.ok(bytes < 1_000_000_000, 'Artifact exceeds Pages size limit');
console.log(
  JSON.stringify({
    base,
    files,
    bytes,
    entrypoints: assets,
    referenceDocuments: references.length,
    noticesIdentical: true,
    forbiddenFiles: 0,
    credentialPatternMatches: 0,
  }),
);
