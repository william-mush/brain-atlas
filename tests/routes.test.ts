import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { LIMB_MAPPINGS } from '@/lib/limb-mappings';
import { COMPENDIUM } from '@/lib/compendium';
import { REGIONS } from '@/lib/regions';

const APP_DIR = path.resolve(__dirname, '..', 'app');

function routeExists(route: string): boolean {
  // route like '/awareness/pranayama' -> app/awareness/pranayama/page.{tsx,mdx}
  // route like '/compendium/lazar-2005' is dynamic — that one resolves via
  // app/compendium/[id]/page.tsx which we check separately.
  const trimmed = route.replace(/^\//, '');
  const base = trimmed === '' ? APP_DIR : path.join(APP_DIR, trimmed);
  return (
    existsSync(path.join(base, 'page.tsx')) ||
    existsSync(path.join(base, 'page.mdx'))
  );
}

describe('route existence', () => {
  describe('every limb mapping href has a real page', () => {
    for (const m of LIMB_MAPPINGS) {
      it(`${m.limb} → ${m.href} exists`, () => {
        expect(routeExists(m.href), `Missing page for ${m.href}`).toBe(true);
      });
    }
  });

  describe('core awareness wing pages exist', () => {
    const required = [
      '/awareness',
      '/awareness/synthesis',
      '/awareness/advaita-shaivism',
      '/awareness/theories',
      '/awareness/east-west',
      '/awareness/bibliography',
      '/awareness/glossary',
      '/compendium',
      '/explore',
    ];
    for (const r of required) {
      it(`${r} exists`, () => {
        expect(routeExists(r), `Missing required page: ${r}`).toBe(true);
      });
    }
  });

  describe('compendium dynamic route handles all entries', () => {
    it('app/compendium/[id]/page.tsx exists', () => {
      expect(existsSync(path.join(APP_DIR, 'compendium', '[id]', 'page.tsx'))).toBe(true);
    });
    it('every compendium id is non-empty and would render', () => {
      // We can't easily render here, but we can verify ids are safe URL
      // path components.
      for (const e of COMPENDIUM) {
        expect(e.id).toMatch(/^[a-z0-9-]+$/);
      }
    });
  });

  describe('regions dynamic route covers every region', () => {
    it('app/regions/[slug]/page.tsx exists', () => {
      expect(existsSync(path.join(APP_DIR, 'regions', '[slug]', 'page.tsx'))).toBe(true);
    });
    it('every region id is a safe URL path component', () => {
      // Region ids include uppercase L/R for hemisphere-specific parcels
      // (e.g. fsavg-L-bankssts). That's fine for URLs.
      for (const r of REGIONS) {
        expect(r.id).toMatch(/^[A-Za-z0-9-]+$/);
      }
    });
  });
});
