import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { BIBLIOGRAPHY } from '@/lib/bibliography';

const APP_DIR = path.resolve(__dirname, '..', 'app');

// Walk app/ and collect all .mdx files
function collectMdxFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) collectMdxFiles(full, out);
    else if (full.endsWith('.mdx')) out.push(full);
  }
  return out;
}

describe('bibliography integrity', () => {
  const ids = new Set(BIBLIOGRAPHY.map((e) => e.id));

  it('has at least one entry', () => {
    expect(BIBLIOGRAPHY.length).toBeGreaterThan(0);
  });

  it('every entry has a unique id', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const e of BIBLIOGRAPHY) {
      if (seen.has(e.id)) dupes.push(e.id);
      seen.add(e.id);
    }
    expect(dupes, `Duplicate biblio ids: ${dupes.join(', ')}`).toEqual([]);
  });

  it('ids are kebab-case (safe for URL anchors)', () => {
    const bad = BIBLIOGRAPHY.filter(
      (e) => !/^[a-z][a-z0-9-]*$/.test(e.id),
    ).map((e) => e.id);
    expect(bad, `Non-kebab-case biblio ids: ${bad.join(', ')}`).toEqual([]);
  });

  it('every entry has authors, title, year', () => {
    const missing = BIBLIOGRAPHY.filter(
      (e) => !e.authors?.trim() || !e.title?.trim() || !e.year,
    ).map((e) => e.id);
    expect(missing, `Entries missing required fields: ${missing.join(', ')}`).toEqual([]);
  });

  describe('Cite references in MDX resolve to bibliography entries', () => {
    const mdxFiles = collectMdxFiles(APP_DIR);

    // Collect all <Cite id="..." /> usages across MDX files
    const usages: Array<{ file: string; id: string }> = [];
    const citePattern = /<Cite\s+[^>]*id\s*=\s*["']([a-z0-9-]+)["']/g;
    for (const f of mdxFiles) {
      const content = readFileSync(f, 'utf-8');
      let match: RegExpExecArray | null;
      while ((match = citePattern.exec(content)) !== null) {
        usages.push({ file: f, id: match[1] });
      }
    }

    it('found at least one <Cite> reference (sanity)', () => {
      // If we drop to zero, something is wrong with how MDX is being parsed
      // or the awareness wing was wiped. Either way: alert.
      expect(usages.length).toBeGreaterThan(0);
    });

    it('every <Cite id="..."> resolves to a real bibliography entry', () => {
      const broken: string[] = [];
      for (const u of usages) {
        if (!ids.has(u.id)) {
          const rel = path.relative(APP_DIR, u.file);
          broken.push(`${rel} -> ${u.id}`);
        }
      }
      expect(broken, `Broken <Cite> references: ${broken.join('; ')}`).toEqual([]);
    });
  });
});
