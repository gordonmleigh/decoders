import { writeFileSync, readdirSync } from 'fs';
import { resolve, relative, join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), 'src');

const files = collectFiles(srcDir)
  .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  .map((x) => relative(srcDir, x))
  .filter((x) => x !== 'index');

const index = ['// AUTO-GENERATED'].concat(
  files.map((x) => `export * from './${x}.js';`),
);
writeFileSync(join(srcDir, 'index.ts'), index.join('\n') + '\n');

function collectFiles(dir) {
  const files = readdirSync(dir, { withFileTypes: true });
  const matches = [];

  for (const file of files) {
    if (file.isDirectory() && file.name !== 'internal') {
      matches.push(...collectFiles(join(dir, file.name)));
    } else if (matchFile(file.name)) {
      matches.push(join(dir, basename(file.name, '.ts')));
    }
  }

  return matches;
}

function matchFile(fileName) {
  return (
    fileName.endsWith('.ts') &&
    !fileName.endsWith('.internal.ts') &&
    !fileName.endsWith('.test.ts')
  );
}
