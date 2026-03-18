#!/usr/bin/env node
/**
 * Import static MDX blog posts and tags into Sanity.
 *
 * Prerequisites:
 *   - Add a token with Editor (write) permissions to .env.local:
 *       SANITY_API_TOKEN=sk...
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET should also be set.
 *
 * Usage:
 *   node scripts/import-to-sanity.mjs
 *
 * The script is idempotent — safe to re-run. It uses `createOrReplace` so
 * existing documents are overwritten, not duplicated.
 * Documents are created in published state and immediately queryable.
 */

import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import matter from 'gray-matter';

// Load .env.local (Node doesn't do this automatically — that's a Next.js feature)
try {
  const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local');
  const envFile = await readFile(envPath, 'utf-8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = val;
  }
} catch {
  // .env.local not found — rely on environment variables already being set
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = join(__dirname, '..', 'content', 'posts');

// ─── Sanity client ────────────────────────────────────────────────────────────

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error(
    '\nError: SANITY_API_TOKEN is not set.\n' +
    'Add a token with Editor permissions to .env.local:\n' +
    '  SANITY_API_TOKEN=sk...\n' +
    'Create one at: https://sanity.io/manage → your project → API → Tokens\n'
  );
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '66ukwul0',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   || 'production',
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// ─── Key generator ────────────────────────────────────────────────────────────

let _keyIdx = 0;
const nextKey = () => `k${_keyIdx++}`;

// ─── Inline markdown → Portable Text spans ───────────────────────────────────

function parseInline(text) {
  const markDefs = [];
  const children = [];
  // Order matters: ** before * to avoid partial matches
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      children.push({ _type: 'span', _key: nextKey(), text: text.slice(lastIndex, match.index), marks: [] });
    }
    if (match[1] !== undefined) {
      children.push({ _type: 'span', _key: nextKey(), text: match[1], marks: ['strong'] });
    } else if (match[2] !== undefined) {
      children.push({ _type: 'span', _key: nextKey(), text: match[2], marks: ['em'] });
    } else if (match[3] !== undefined) {
      children.push({ _type: 'span', _key: nextKey(), text: match[3], marks: ['code'] });
    } else if (match[4] !== undefined) {
      const linkKey = nextKey();
      markDefs.push({ _key: linkKey, _type: 'link', href: match[5] });
      children.push({ _type: 'span', _key: nextKey(), text: match[4], marks: [linkKey] });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    children.push({ _type: 'span', _key: nextKey(), text: text.slice(lastIndex), marks: [] });
  }
  if (children.length === 0) {
    children.push({ _type: 'span', _key: nextKey(), text: '', marks: [] });
  }
  return { children, markDefs };
}

function makeBlock(style, text, extra = {}) {
  const { children, markDefs } = parseInline(text);
  return { _type: 'block', _key: nextKey(), style, children, markDefs, ...extra };
}

// ─── Markdown body → Portable Text blocks ────────────────────────────────────

// Language aliases → values accepted by the schema's list
const LANG_ALIASES = { js: 'javascript', ts: 'typescript', sh: 'bash', shell: 'bash' };
const SCHEMA_LANGS = new Set(['tsx', 'typescript', 'javascript', 'jsx', 'css', 'html', 'bash', 'json']);

function normaliseLanguage(raw) {
  const lower = raw.toLowerCase().trim();
  const mapped = LANG_ALIASES[lower] ?? lower;
  return SCHEMA_LANGS.has(mapped) ? mapped : 'javascript';
}

function markdownToPortableText(markdown) {
  const blocks = [];

  // Split on fenced code blocks first so their contents are never parsed as text
  const parts = markdown.split(/(```[^\n]*\n[\s\S]*?```)/g);

  for (const part of parts) {
    const fenceMatch = part.match(/^```([^\n]*)\n([\s\S]*?)```$/);
    if (fenceMatch) {
      blocks.push({
        _type: 'codeBlock',
        _key: nextKey(),
        language: normaliseLanguage(fenceMatch[1]),
        code: fenceMatch[2].trimEnd(),
      });
      continue;
    }

    const lines = part.split('\n');
    let paraLines = [];

    const flushPara = () => {
      const text = paraLines.join(' ').trim();
      paraLines = [];
      if (text) blocks.push(makeBlock('normal', text));
    };

    for (const line of lines) {
      if      (/^#### /.test(line))  { flushPara(); blocks.push(makeBlock('h4', line.slice(5))); }
      else if (/^### /.test(line))   { flushPara(); blocks.push(makeBlock('h3', line.slice(4))); }
      else if (/^## /.test(line))    { flushPara(); blocks.push(makeBlock('h2', line.slice(3))); }
      else if (/^> /.test(line))     { flushPara(); blocks.push(makeBlock('blockquote', line.slice(2))); }
      else if (/^[-*] /.test(line))  {
        flushPara();
        blocks.push(makeBlock('normal', line.slice(2), { listItem: 'bullet', level: 1 }));
      }
      else if (/^\d+\. /.test(line)) {
        flushPara();
        blocks.push(makeBlock('normal', line.replace(/^\d+\. /, ''), { listItem: 'number', level: 1 }));
      }
      else if (line.trim() === '' || /^---+$/.test(line.trim())) { flushPara(); }
      else { paraLines.push(line); }
    }
    flushPara();
  }

  return blocks;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function tagId(slug)  { return `tag-${slug}`; }
function postId(slug) { return `post-${slug}`; }

function toTitleCase(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function importContent() {
  const files = (await readdir(POSTS_DIR))
    .filter(f => f.endsWith('.mdx'))
    .sort();

  // ── 1. Collect unique tags ────────────────────────────────────────────────
  const tagMap = new Map();
  for (const file of files) {
    const raw = await readFile(join(POSTS_DIR, file), 'utf-8');
    const { data } = matter(raw);
    for (const slug of (data.tags ?? [])) {
      if (!tagMap.has(slug)) {
        tagMap.set(slug, {
          _id:   tagId(slug),
          _type: 'tag',
          name:  toTitleCase(slug),
          slug:  { _type: 'slug', current: slug },
        });
      }
    }
  }

  // ── 2. Upsert tags ────────────────────────────────────────────────────────
  console.log(`\nImporting ${tagMap.size} tags...`);
  for (const tag of tagMap.values()) {
    await client.createOrReplace(tag);
    console.log(`  ✓ ${tag.name}`);
  }

  // ── 3. Upsert posts ───────────────────────────────────────────────────────
  console.log(`\nImporting ${files.length} posts...`);
  for (const file of files) {
    const raw  = await readFile(join(POSTS_DIR, file), 'utf-8');
    const { data, content } = matter(raw);

    const body    = markdownToPortableText(content);
    const tagRefs = (data.tags ?? []).map(slug => ({
      _key:  nextKey(),
      _type: 'reference',
      _ref:  tagId(slug),
    }));

    const doc = {
      _id:         postId(data.slug),
      _type:       'post',
      title:       data.title,
      slug:        { _type: 'slug', current: data.slug },
      excerpt:     data.excerpt,
      publishedAt: data.publishedAt,
      featured:    data.featured ?? false,
      tags:        tagRefs,
      body,
      // coverImage is omitted — the MDX images are local SVGs in /public.
      // Upload them manually in Sanity Studio, or add asset upload logic here.
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ ${data.title}`);
  }

  console.log('\nAll done! Documents are published and immediately queryable.');
  console.log('Open Sanity Studio to review content or add cover images.');
  console.log('\nNext: set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local to switch the app to Sanity.\n');
}

importContent().catch(err => {
  console.error('\nImport failed:', err.message);
  process.exit(1);
});
