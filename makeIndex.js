const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, 'src');

const files = collectFiles(srcDir)
  .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  .map((x) => path.relative(srcDir, x))
  .filter((x) => x !== 'index');

const index = ['// AUTO-GENERATED '].concat(files.map((x) => `export * from './${x}';`));
fs.writeFileSync(path.join(srcDir, 'index.ts'), index.join('\n'));

function collectFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const matches = [];

  for (const file of files) {
    if (file.isDirectory() && file.name !== 'internal') {
      matches.push(...collectFiles(path.join(dir, file.name)));
    } else if (matchFile(file.name)) {
      matches.push(path.join(dir, path.basename(file.name, '.ts')));
    }
  }

  return matches;
}

function matchFile(fileName) {
  return fileName.endsWith('.ts') &&
    !fileName.endsWith('.internal.ts') &&
    !fileName.endsWith('.test.ts');
}