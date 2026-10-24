import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve, relative, sep } from 'node:path';

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? files(path) : /\.(ts|tsx)$/.test(path) ? [path] : [];
  });
}

for (const name of ['motion-tokens', 'motion-recipes']) {
  const root = resolve('packages', name);
  for (const file of files(resolve(root, 'src'))) {
    const source = readFileSync(file, 'utf8');
    for (const [, specifier] of source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)) {
      if (specifier.includes('showcase') || specifier.includes('skills/'))
        throw new Error(`Forbidden import in ${file}`);
      if (specifier.startsWith('.')) {
        const target = resolve(dirname(file), specifier);
        if (relative(root, target).startsWith(`..${sep}`))
          throw new Error(`Private cross-package import: ${file}`);
      }
    }
  }
}
const recipes = JSON.parse(readFileSync('packages/motion-recipes/package.json', 'utf8'));
const expected = [
  'button-feedback',
  'accordion-transition',
  'presence-transition',
  'async-state-feedback',
  'navigation-indicator',
]
  .flatMap((name) => ['./' + name, './' + name + '.css'])
  .concat([
    './scroll-reveal',
    './staggered-entrance',
    './scroll-progress',
    './layout-reflow',
    './skeleton-to-content',
    './data-change-feedback',
    './expandable-cards',
  ])
  .sort();
if (
  '.' in recipes.exports ||
  JSON.stringify(Object.keys(recipes.exports).sort()) !== JSON.stringify(expected)
)
  throw new Error('Unexpected recipe exports');
console.log(
  'PASS package boundaries: directed imports and seventeen explicit recipe subpaths (four original paths retained)',
);
