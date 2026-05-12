// Limb → brain region mappings for the awareness mode in /explore.
//
// This is the AUTHORITATIVE editorial mapping. The compendium has some
// region pointers on individual entries, but this file is the curated
// answer to "which regions does each limb engage."
//
// Each mapping carries a tint color (the same one used in the limb page
// EssayLayout `tint` prop, so the visual language matches), a list of
// region ids drawn from lib/regions.ts (validated by tests), and a short
// rationale shown in the limb selector UI.
//
// Note on yamas/niyamas: deliberately empty `regions` arrays. The whole
// editorial argument is that these limbs are about cognitive load and
// orientation, not specific anatomy. Showing them with no regions
// highlighted is the point — the UI should display the rationale and
// invite the reader to read the limb page rather than expecting anatomy.

import type { EightLimb } from './compendium';

export interface LimbMapping {
  limb: EightLimb;
  /** Sanskrit name with diacritics, as shown in UI */
  sanskrit: string;
  /** English gloss */
  gloss: string;
  /** Roman numeral, for ordering */
  numeral: string;
  /** Tint color — matches the EssayLayout tint on the limb page */
  tint: string;
  /** Region ids from lib/regions.ts. Empty for yamas/niyamas by design. */
  regions: string[];
  /** Short rationale shown in the UI when this limb is selected. */
  rationale: string;
  /** Path to the limb's essay page. */
  href: string;
}

export const LIMB_MAPPINGS: LimbMapping[] = [
  {
    limb: 'yamas',
    sanskrit: 'Yamas',
    gloss: 'ethical restraints',
    numeral: 'I',
    tint: '#e89aa3',
    regions: [],
    rationale:
      'No specific anatomy — and that is the point. The yamas reduce cognitive load (deception, harm, grasping) so that later limbs have a quiet nervous system to work with.',
    href: '/awareness/yamas',
  },
  {
    limb: 'niyamas',
    sanskrit: 'Niyamas',
    gloss: 'observances',
    numeral: 'II',
    tint: '#f0a878',
    regions: [],
    rationale:
      'Like the yamas, no single anatomical target. The niyamas orient attention — toward acceptance, metacognition, sustained effort — before contemplative training begins.',
    href: '/awareness/niyamas',
  },
  {
    limb: 'asana',
    sanskrit: 'Āsana',
    gloss: 'posture',
    numeral: 'III',
    tint: '#e8b04a',
    regions: ['cerebellum', 'insula', 'anterior-cingulate', 'thalamus'],
    rationale:
      'Proprioceptive and interoceptive cultivation. The body is mapped twice: by the cerebellum and somatosensory cortex (where it is in space) and by the insula and anterior cingulate (what it feels like from the inside).',
    href: '/awareness/asana',
  },
  {
    limb: 'pranayama',
    sanskrit: 'Prāṇāyāma',
    gloss: 'breath restraint',
    numeral: 'IV',
    tint: '#7a9461',
    regions: [
      'medulla',
      'pons',
      'insula',
      'anterior-cingulate',
      'thalamus',
      'hypothalamus',
    ],
    rationale:
      'The vagal afferent pathway. Breath modulation enters at the medulla (NTS), climbs through the pons (parabrachial nucleus) and thalamus, and lands in the insula and anterior cingulate — the cortical seat of the felt body.',
    href: '/awareness/pranayama',
  },
  {
    limb: 'pratyahara',
    sanskrit: 'Pratyāhāra',
    gloss: 'sensory withdrawal',
    numeral: 'V',
    tint: '#5a6b7a',
    regions: ['thalamus', 'reticular-formation'],
    rationale:
      'Thalamic gating. The thalamus is the brain\'s sensory relay; pratyāhāra is the cultivated turning-down of that relay. The reticular formation modulates the gating.',
    href: '/awareness/pratyahara',
  },
  {
    limb: 'dharana',
    sanskrit: 'Dhāraṇā',
    gloss: 'concentration',
    numeral: 'VI',
    tint: '#4f8a8b',
    regions: ['frontal-lobe', 'parietal-lobe'],
    rationale:
      'Sustained selective attention. The executive control network — dorsolateral prefrontal cortex and posterior parietal cortex — is the substrate modern cognitive neuroscience has independently identified for what classical yoga calls one-pointedness.',
    href: '/awareness/dharana',
  },
  {
    limb: 'dhyana',
    sanskrit: 'Dhyāna',
    gloss: 'meditation',
    numeral: 'VII',
    tint: '#7a9461',
    regions: ['frontal-lobe', 'parietal-lobe', 'anterior-cingulate'],
    rationale:
      'When holding attention becomes resting in it. Executive engagement decreases; the default mode network — anchored in medial prefrontal and posterior cingulate regions — quiets. Effort drops out, attention persists.',
    href: '/awareness/dhyana',
  },
  {
    limb: 'samadhi',
    sanskrit: 'Samādhi',
    gloss: 'absorption',
    numeral: 'VIII',
    tint: '#8a6fa3',
    // Samadhi deliberately includes everything — for the visual dissolution.
    regions: [
      'frontal-lobe',
      'parietal-lobe',
      'temporal-lobe',
      'insula',
      'anterior-cingulate',
      'thalamus',
      'hypothalamus',
      'medulla',
      'pons',
      'cerebellum',
    ],
    rationale:
      'Not a region. Network dissolution rather than network activation. The map you have built across the earlier limbs fades — the apparatus that normally constructs a located self goes quiet. This is the only limb whose visual is the fade-out itself.',
    href: '/awareness/samadhi',
  },
];

export function getLimbMapping(limb: EightLimb): LimbMapping | undefined {
  return LIMB_MAPPINGS.find((m) => m.limb === limb);
}

/** Union of all regions touched by any limb (excluding empty mappings). */
export function allLimbRegions(): string[] {
  const ids = new Set<string>();
  for (const m of LIMB_MAPPINGS) {
    for (const r of m.regions) ids.add(r);
  }
  return Array.from(ids);
}
