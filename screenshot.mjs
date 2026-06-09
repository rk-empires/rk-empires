// Screenshot a URL using the locally-installed Chrome in headless mode.
// Usage: node screenshot.mjs <url> [label] [width]
// Saves to ./temporary screenshots/screenshot-N[-label].png (auto-incremented).
import { mkdirSync, existsSync, readdirSync, rmSync, renameSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const url = process.argv[2] || 'http://localhost:3001';
const label = process.argv[3] || '';
const width = Number(process.argv[4]) || 1440;
const height = Number(process.argv[5]) || 2400;

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const outDir = resolve('temporary screenshots');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const nums = readdirSync(outDir)
  .map((f) => /^screenshot-(\d+)/.exec(f))
  .filter(Boolean)
  .map((m) => Number(m[1]));
const n = (nums.length ? Math.max(...nums) : 0) + 1;
const name = `screenshot-${n}${label ? '-' + label : ''}.png`;
const outPath = join(outDir, name);

execFileSync(CHROME, [
  '--headless=new',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  `--window-size=${width},${height}`,
  '--default-background-color=0A0A0BFF',
  `--screenshot=${outPath}`,
  url,
], { stdio: 'inherit' });

console.log('Saved', outPath);
