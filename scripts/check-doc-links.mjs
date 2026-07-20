#!/usr/bin/env node
// Prüft alle relativen Markdown-Links unter docs/ auf Existenz des Ziels.
// CI-Gate gemäß docs/development-guidelines/04-documentation-standards.md.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const root = resolve(process.cwd(), 'docs');
const linkPattern = /\]\(([^)]+)\)/g;
let broken = 0;
let checked = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith('.md')) checkFile(full);
  }
}

function checkFile(file) {
  const content = readFileSync(file, 'utf8');
  // Codeblöcke ausblenden (Vorlagen enthalten Platzhalter-Links)
  const withoutCode = content.replace(/```[\s\S]*?```/g, '');
  for (const match of withoutCode.matchAll(linkPattern)) {
    const link = match[1].trim();
    if (/^(https?:|mailto:|#)/.test(link)) continue;
    const target = link.split('#')[0];
    if (!target) continue;
    checked += 1;
    const resolved = resolve(dirname(file), target);
    if (!existsSync(resolved)) {
      broken += 1;
      console.error(`BROKEN: ${file} -> ${link}`);
    }
  }
}

walk(root);
console.log(`docs:check-links — ${checked} Links geprüft, ${broken} defekt.`);
process.exit(broken > 0 ? 1 : 0);
