import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { source, output, getBasePath } from './config.mjs';

const basePath = getBasePath();
await rm(output, { recursive: true, force: true });
await cp(source, output, { recursive: true });

async function processDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await processDirectory(file);
    else if (entry.name.endsWith('.html')) {
      const original = await readFile(file, 'utf8');
      // Leave external, data, mailto and fragment URLs untouched.
      const html = original.replace(/(\b(?:href|src)\s*=\s*["'])\/(?!\/)/gi, (_match, start) => `${start}${basePath}/`);
      await writeFile(file, html);
    }
  }
}

await processDirectory(output);
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`Built _site for ${basePath || '/'}; no dependencies or credentials required.`);
