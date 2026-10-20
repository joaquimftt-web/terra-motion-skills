import { cpSync, mkdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const [sourceArgument = 'src', destinationArgument = 'dist'] = process.argv.slice(2);
const source = resolve(sourceArgument);
const destination = resolve(destinationArgument);

mkdirSync(destination, { recursive: true });
cpSync(source, destination, {
  recursive: true,
  filter: (path) => statSync(path).isDirectory() || path.endsWith('.css'),
});
