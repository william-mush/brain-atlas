import { describe, expect, it } from 'vitest';
import { GLOSSARY, TRADITION_ORDER, entriesByTradition } from '@/lib/glossary';

describe('glossary integrity', () => {
  it('has at least one entry', () => {
    expect(GLOSSARY.length).toBeGreaterThan(0);
  });

  it('every entry has term, gloss, and tradition', () => {
    const missing = GLOSSARY.filter(
      (e) => !e.term?.trim() || !e.gloss?.trim() || !e.tradition,
    ).map((e) => e.term || '(no term)');
    expect(missing, `Glossary entries missing required fields: ${missing.join(', ')}`).toEqual([]);
  });

  it('every tradition referenced has a label and is in TRADITION_ORDER', () => {
    const traditionsUsed = new Set(GLOSSARY.map((e) => e.tradition));
    const orderedSet = new Set(TRADITION_ORDER);
    const orphans = [...traditionsUsed].filter((t) => !orderedSet.has(t));
    expect(orphans, `Glossary traditions not in TRADITION_ORDER: ${orphans.join(', ')}`).toEqual([]);
  });

  it('every internal href starts with /', () => {
    const bad = GLOSSARY.filter((e) => e.href && !e.href.startsWith('/')).map((e) => e.term);
    expect(bad, `Glossary hrefs not starting with /: ${bad.join(', ')}`).toEqual([]);
  });

  it('term+tradition pairs are unique', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const e of GLOSSARY) {
      const key = `${e.term}__${e.tradition}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes, `Duplicate glossary entries: ${dupes.join(', ')}`).toEqual([]);
  });

  it('every tradition order entry has at least one glossary entry', () => {
    for (const t of TRADITION_ORDER) {
      const count = entriesByTradition(t).length;
      expect(count, `Tradition ${t} has no entries`).toBeGreaterThan(0);
    }
  });
});
