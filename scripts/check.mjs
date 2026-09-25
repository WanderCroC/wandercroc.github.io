import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { output, getBasePath } from './config.mjs';

const basePath = getBasePath();
const origin = 'https://preview.invalid';
let pages = 0;
let links = 0;
const errors = [];

async function checkDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await checkDirectory(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    pages++;
    const relative = path.relative(output, file).split(path.sep).join('/');
    const pageURL = new URL(`${basePath}/${relative}`, origin);
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
      const value = match[1].replaceAll('&amp;', '&');
      const url = new URL(value, pageURL);
      if (url.origin !== origin) continue;
      links++;
      const prefix = basePath + '/';
      if (!url.pathname.startsWith(prefix)) {
        errors.push(`${relative}: URL escapes site base: ${value}`);
        continue;
      }
      const localPath = decodeURIComponent(url.pathname.slice(prefix.length));
      let target = path.resolve(output, localPath);
      if (target !== output && !target.startsWith(output + path.sep)) {
        errors.push(`${relative}: URL escapes output directory: ${value}`);
        continue;
      }
      try {
        if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
        if (!(await stat(target)).isFile()) throw new Error('Not a file');
        if (url.hash && target.endsWith('.html')) {
          const targetHTML = await readFile(target, 'utf8');
          const ids = [...targetHTML.matchAll(/\bid=["']([^"']+)["']/g)].map(item => item[1]);
          if (!ids.includes(decodeURIComponent(url.hash.slice(1)))) throw new Error('Missing fragment');
        }
      } catch {
        errors.push(`${relative}: Missing destination: ${value}`);
      }
    }
  }
}

await checkDirectory(output);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`Checked ${pages} pages and ${links} local links for ${basePath || '/'}.`);
