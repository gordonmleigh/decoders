import { readFile, readdir, writeFile } from 'fs/promises';
import { basename, extname, join, relative, resolve } from 'path';
import Prettier from 'prettier';

const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const srcDir = resolve('./src');

const prettierConfig = await Prettier.resolveConfig('package.json');

const files = (await collectFiles(srcDir))
  .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  .map((x) => relative(srcDir, x))
  .filter((x) => x !== 'index');

packageJson.exports = Object.fromEntries(
  files.map((file) => [
    `./${file}`,
    {
      import: `./lib/${file}.js`,
      types: `./lib/${file}.d.ts`,
    },
  ]),
);

await writePretty('package.json', JSON.stringify(packageJson, null, 2));

async function writePretty(path, data) {
  await writeFile(
    path,
    Prettier.format(data, {
      filepath: path,
      ...prettierConfig,
    }),
  );
}

async function collectFiles(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  const matches = [];

  for (const file of files) {
    if (file.isDirectory() && file.name !== 'internal') {
      matches.push(...(await collectFiles(join(dir, file.name))));
    } else if (matchFile(file.name)) {
      matches.push(join(dir, basename(file.name, extname(file.name))));
    }
  }

  return matches;
}

function matchFile(fileName) {
  return (
    (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) &&
    !fileName.endsWith('.internal.ts') &&
    !fileName.endsWith('.test.ts')
  );
}
