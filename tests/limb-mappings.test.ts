import { describe, expect, it } from 'vitest';
import {
  LIMB_MAPPINGS,
  getLimbMapping,
  allLimbRegions,
} from '@/lib/limb-mappings';
import { REGIONS } from '@/lib/regions';

// The limb-mappings drive the awareness mode visualization in /explore.
// Broken region ids here render as missing highlights — silent failures.

describe('limb mappings', () => {
  const regionIds = new Set(REGIONS.map((r) => r.id));
  const canonicalLimbs = [
    'yamas',
    'niyamas',
    'asana',
    'pranayama',
    'pratyahara',
    'dharana',
    'dhyana',
    'samadhi',
  ] as const;

  it('has exactly eight mappings, one per limb', () => {
    expect(LIMB_MAPPINGS.length).toBe(8);
    const limbs = LIMB_MAPPINGS.map((m) => m.limb);
    for (const l of canonicalLimbs) {
      expect(limbs).toContain(l);
    }
  });

  it('mappings are in canonical order (yamas → samādhi)', () => {
    const order = LIMB_MAPPINGS.map((m) => m.limb);
    expect(order).toEqual(canonicalLimbs);
  });

  it('every region id in every mapping is a real region', () => {
    const broken: string[] = [];
    for (const m of LIMB_MAPPINGS) {
      for (const r of m.regions) {
        if (!regionIds.has(r)) broken.push(`${m.limb} -> ${r}`);
      }
    }
    expect(broken, `Broken region refs in limb mappings: ${broken.join('; ')}`).toEqual([]);
  });

  it('yamas and niyamas have no anatomy by design', () => {
    // This is the editorial argument made explicit in code. If a future
    // edit accidentally adds regions here, the test catches it.
    const yamas = getLimbMapping('yamas');
    const niyamas = getLimbMapping('niyamas');
    expect(yamas?.regions).toEqual([]);
    expect(niyamas?.regions).toEqual([]);
  });

  it('every other limb has at least one region', () => {
    const empty = LIMB_MAPPINGS.filter(
      (m) => m.limb !== 'yamas' && m.limb !== 'niyamas' && m.regions.length === 0,
    ).map((m) => m.limb);
    expect(empty, `Limbs missing regions: ${empty.join(', ')}`).toEqual([]);
  });

  it('every mapping has a tint, rationale, and href', () => {
    for (const m of LIMB_MAPPINGS) {
      expect(m.tint, `${m.limb} missing tint`).toMatch(/^#[0-9a-f]{6}$/i);
      expect(m.rationale.trim().length, `${m.limb} missing rationale`).toBeGreaterThan(20);
      expect(m.href, `${m.limb} missing href`).toMatch(/^\/awareness\//);
    }
  });

  describe('getLimbMapping', () => {
    it('returns the mapping for a known limb', () => {
      const m = getLimbMapping('pranayama');
      expect(m).toBeDefined();
      expect(m?.limb).toBe('pranayama');
      expect(m?.regions).toContain('insula');
    });
  });

  describe('allLimbRegions', () => {
    it('returns the union of all regions across limbs', () => {
      const all = allLimbRegions();
      // The union should be at least as big as the biggest single limb mapping
      const max = Math.max(...LIMB_MAPPINGS.map((m) => m.regions.length));
      expect(all.length).toBeGreaterThanOrEqual(max);
      // Every returned id should be unique
      expect(new Set(all).size).toBe(all.length);
      // And every returned id should be a real region
      for (const id of all) {
        expect(regionIds.has(id), `${id} not a real region`).toBe(true);
      }
    });
  });
});
