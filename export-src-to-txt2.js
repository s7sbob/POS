// export-src-to-txt.js
// Collects every file inside src/ and writes them (with paths) to src-files.txt

import { promises as fs } from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();     // where you launched the script
const SRC_DIR      = path.join(PROJECT_ROOT, 'src');
const OUT_FILE     = path.join(PROJECT_ROOT, 'src-files.txt');

async function getAllFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files   = await Promise.all(
    dirents.map((d) => {
      const res = path.join(dir, d.name);
      return d.isDirectory() ? getAllFiles(res) : res;
    })
  );
  return files.flat();
}

async function main() {
  console.time('⏱  Done in');

  const files = await getAllFiles(SRC_DIR);
  const outParts = [];

  for (const file of files) {
    const relPath = path.relative(PROJECT_ROOT, file).replace(/\\/g, '/');
    const content = await fs.readFile(file, 'utf8');

    outParts.push(`\n===== ${relPath} =====\n`);
    outParts.push(content);
  }

  await fs.writeFile(OUT_FILE, outParts.join(''), 'utf8');
  console.log(`✅  Wrote ${files.length} files into ${path.basename(OUT_FILE)}`);
  console.timeEnd('⏱  Done in');
}

main().catch((err) => {
  console.error('❌  Error:', err);
  process.exit(1);
});
