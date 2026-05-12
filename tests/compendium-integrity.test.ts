import { describe, expect, it } from 'vitest';
import { COMPENDIUM } from '@/lib/compendium';
import { REGIONS } from '@/lib/regions';

// These tests are the editorial safety net for the compendium. They run
// fast and catch the silent failure modes that authoring large data files
// is prone to: typo'd cross-references that render as missing links, ids
// that drift apart as entries are added, duplicates that creep in over time.
//
// Run on every push (see .github/workflows/test.yml) so broken refs cannot
// reach a deploy.

describe('compendium integrity', () => {
  const ids = new Set(COMPENDIUM.map((e) => e.id));
  const regionIds = new Set(REGIONS.map((r) => r.id));

  it('has at least one entry', () => {
    expect(COMPENDIUM.length).toBeGreaterThan(0);
  });

  it('has unique ids across all entries', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const e of COMPENDIUM) {
      if (seen.has(e.id)) dupes.push(e.id);
      seen.add(e.id);
    }
    expect(dupes, `Duplicate compendium ids: ${dupes.join(', ')}`).toEqual([]);
  });

  it('uses kebab-case ids only', () => {
    const bad = COMPENDIUM.filter((e) => !/^[a-z][a-z0-9-]*$/.test(e.id)).map(
      (e) => e.id,
    );
    expect(bad, `Non-kebab-case ids: ${bad.join(', ')}`).toEqual([]);
  });

  it('every `related` reference resolves to a real compendium entry', () => {
    const broken: string[] = [];
    for (const e of COMPENDIUM) {
      for (const r of e.related ?? []) {
        if (!ids.has(r)) broken.push(`${e.id} -> ${r}`);
      }
    }
    expect(broken, `Broken related refs: ${broken.join('; ')}`).toEqual([]);
  });

  it('every `regions` reference resolves to a real region', () => {
    const broken: string[] = [];
    for (const e of COMPENDIUM) {
      for (const r of e.regions ?? []) {
        if (!regionIds.has(r)) broken.push(`${e.id} -> ${r}`);
      }
    }
    expect(broken, `Broken region refs: ${broken.join('; ')}`).toEqual([]);
  });

  it('every entry has a non-empty title and summary', () => {
    const missing = COMPENDIUM.filter(
      (e) => !e.title?.trim() || !e.summary?.trim(),
    ).map((e) => e.id);
    expect(missing, `Entries missing title/summary: ${missing.join(', ')}`).toEqual([]);
  });

  it('every entry has a valid evidence level', () => {
    const valid = new Set(['evidenced', 'suggestive', 'philosophical']);
    const bad = COMPENDIUM.filter((e) => !valid.has(e.evidence)).map(
      (e) => `${e.id} (${e.evidence})`,
    );
    expect(bad, `Invalid evidence levels: ${bad.join(', ')}`).toEqual([]);
  });

  it('every entry has a valid type', () => {
    const valid = new Set(['experiment', 'thinker', 'practice', 'term', 'region']);
    const bad = COMPENDIUM.filter((e) => !valid.has(e.type)).map(
      (e) => `${e.id} (${e.type})`,
    );
    expect(bad, `Invalid types: ${bad.join(', ')}`).toEqual([]);
  });

  it('experiments have an external link', () => {
    // This is editorial: an experiment entry without a source link is a
    // broken entry, because the whole point of the compendium is to make
    // the evidence verifiable.
    const missing = COMPENDIUM.filter(
      (e) => e.type === 'experiment' && !e.link?.href,
    ).map((e) => e.id);
    expect(missing, `Experiments missing source links: ${missing.join(', ')}`).toEqual([]);
  });

  it('limb tags are all from the canonical set', () => {
    const valid = new Set([
      'yamas',
      'niyamas',
      'asana',
      'pranayama',
      'pratyahara',
      'dharana',
      'dhyana',
      'samadhi',
    ]);
    const bad: string[] = [];
    for (const e of COMPENDIUM) {
      for (const l of e.limbs ?? []) {
        if (!valid.has(l)) bad.push(`${e.id} -> ${l}`);
      }
    }
    expect(bad, `Invalid limb tags: ${bad.join(', ')}`).toEqual([]);
  });
});
