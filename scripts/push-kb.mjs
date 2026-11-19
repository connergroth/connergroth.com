#!/usr/bin/env node
/**
 * Push the private fact sheet that /api/ask answers from into Redis.
 * The sheet is not in this repo (it's public). Everything after the first line
 * that is exactly `---` following the front matter is what gets sent.
 *
 *   node scripts/push-kb.mjs [path-to-fact-sheet.md]
 *
 * Reads UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN from the environment
 * or .env.local.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envFile = resolve(root, '.env.local');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
  }
}
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
if (!url || !token) throw new Error('No Upstash REST url/token in the environment or .env.local');

const file = process.argv[2] || resolve(homedir(), 'GitHub/brain/Career/site-ask/fact-sheet.md');
const raw = readFileSync(file, 'utf8');
// front matter, then an HTML comment for humans, then `---`, then the sheet
const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^[\s\S]*?\n---\n/, '').trim();
if (body.length < 500) throw new Error(`Sheet looks empty (${body.length} chars); not pushing`);

const res = await fetch(`${url}/pipeline`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify([['SET', 'cg:ask:kb', body]]),
});
if (!res.ok) throw new Error(`Redis said ${res.status}`);
console.log(`pushed ${body.length} chars (~${Math.round(body.length / 4)} tokens) from ${file}`);
