import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const source = path.join(root, 'site');
export const output = path.join(root, '_site');

export function getBasePath() {
  const index = process.argv.indexOf('--base-path');
  if (index !== -1 && process.argv[index + 1] === undefined) {
    throw new Error('Supply a value after --base-path, e.g. /my-website.');
  }
  const input = index !== -1 ? process.argv[index + 1] : (process.env.PAGES_BASE_PATH || '');
  const trimmed = input.replace(/^\/+|\/+$/g, '');
  if (!trimmed) return '';
  if (/[\s?#<>"'\\]/.test(trimmed) || trimmed.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error('The base path must be a URL path such as /my-website, not a full URL.');
  }
  return '/' + trimmed;
}
