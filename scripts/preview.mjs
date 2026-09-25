import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { output } from './config.mjs';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.pdf': 'application/pdf', '.svg': 'image/svg+xml' };
http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let target = path.resolve(output, '.' + pathname);
    if (target !== output && !target.startsWith(output + path.sep)) {
      response.writeHead(403).end(); return;
    }
    let status = 200;
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      await stat(target);
    } catch { target = path.join(output, '404.html'); status = 404; }
    const content = await readFile(target);
    response.writeHead(status, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch { response.writeHead(400).end('Bad request'); }
}).listen(8080, '127.0.0.1', () => console.log('Preview: http://localhost:8080 — Ctrl+C to stop.'));
