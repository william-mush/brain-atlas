import { describe, expect, it } from 'vitest';
import {
  COMPENDIUM,
  getEntry,
  entriesByType,
  entriesByLimb,
  entriesByEvidence,
} from '@/lib/compendium';

describe('compendium lookup helpers', () => {
  describe('getEntry', () => {
    it('returns the entry when the id exists', () => {
      const entry = getEntry('lazar-2005');
      expect(entry).toBeDefined();
      expect(entry?.id).toBe('lazar-2005');
      expect(entry?.type).toBe('experiment');
    });

    it('returns undefined for unknown ids', () => {
      expect(getEntry('this-id-does-not-exist')).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      expect(getEntry('')).toBeUndefined();
    });
  });

  describe('entriesByType', () => {
    it('returns all experiments', () => {
      const experiments = entriesByType('experiment');
      expect(experiments.length).toBeGreaterThan(0);
      expect(experiments.every((e) => e.type === 'experiment')).toBe(true);
    });

    it('returns all thinkers', () => {
      const thinkers = entriesByType('thinker');
      expect(thinkers.length).toBeGreaterThan(0);
      expect(thinkers.every((e) => e.type === 'thinker')).toBe(true);
    });

    it('every entry appears in exactly one type bucket', () => {
      const total =
        entriesByType('experiment').length +
        entriesByType('thinker').length +
        entriesByType('term').length +
        entriesByType('practice').length +
        entriesByType('region').length;
      expect(total).toBe(COMPENDIUM.length);
    });
  });

  describe('entriesByLimb', () => {
    it('returns entries tagged with the given limb', () => {
      const pranayama = entriesByLimb('pranayama');
      expect(pranayama.length).toBeGreaterThan(0);
      expect(pranayama.every((e) => e.limbs?.includes('pranayama'))).toBe(true);
    });

    it('returns empty array for limbs no entry is tagged with (graceful)', () => {
      // We don't currently tag any entry as `yamas` directly, but the
      // helper should still return an array (not crash).
      const yamas = entriesByLimb('yamas');
      expect(Array.isArray(yamas)).toBe(true);
    });
  });

  describe('entriesByEvidence', () => {
    it('returns entries by evidence level', () => {
      const evidenced = entriesByEvidence('evidenced');
      const suggestive = entriesByEvidence('suggestive');
      const philosophical = entriesByEvidence('philosophical');
      expect(evidenced.length).toBeGreaterThan(0);
      expect(suggestive.length).toBeGreaterThan(0);
      expect(philosophical.length).toBeGreaterThan(0);
      expect(evidenced.every((e) => e.evidence === 'evidenced')).toBe(true);
    });

    it('the three buckets sum to the total entry count', () => {
      const total =
        entriesByEvidence('evidenced').length +
        entriesByEvidence('suggestive').length +
        entriesByEvidence('philosophical').length;
      expect(total).toBe(COMPENDIUM.length);
    });
  });
});
