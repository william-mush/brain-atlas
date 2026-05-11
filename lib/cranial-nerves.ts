// The twelve cranial nerves, modeled as named procedural tubes.
//
// Each nerve emerges from a specific point on the brain or brainstem
// and travels to its peripheral target. We represent the path as a list
// of control points in our scene frame (x right, y up, z forward).
// The renderer draws a smooth Catmull–Rom curve through these points.
//
// Coordinates are checked against the actual BodyParts3D mesh bounds for
// midbrain, pons, medulla, hypothalamus, and pituitary loaded from
// /models/brain.glb, so the emergence points sit on real anatomy.

export type CranialNerveType = 'sensory' | 'motor' | 'mixed';
export type Side = 'left' | 'right' | 'midline';

export interface CranialNerve {
  id: string;
  roman: string;
  number: number;
  name: string;
  shortName?: string;
  type: CranialNerveType;
  color: string;
  /** Both sides — left & right paths for paired nerves. Midline nerves use only `right`. */
  paths: { side: Side; points: [number, number, number][] }[];
  /** Visual tube radius. Larger for major nerves (V, VII, X). */
  radius: number;
  summary: string;
  functions: string[];
  /** Region ids in regions.ts that this nerve connects to / passes near */
  relatedRegions?: string[];
}

// Anatomical anchor points (all in scene units):
//   Olfactory bulb above cribriform plate: (±0.15, 0.05, 0.85)
//   Eye centers: (±0.55, -0.05, 0.95)
//   Optic chiasm: (0, -0.15, 0.42)
//   Lateral midbrain: (±0.22, -0.10, 0.10)
//   Pons lateral surface: (±0.36, -0.45, 0.20)
//   Pontomedullary junction: (±0.20, -0.65, 0.05)
//   Medulla lateral: (±0.22, -0.95, -0.05)
//   Inner ear region: (±0.5, -0.55, 0.10)
//   Tongue / pharynx region: (0, -1.30, 0.55)
//   Neck / carotid sheath start: (±0.18, -1.45, 0.10)

export const CRANIAL_NERVES: CranialNerve[] = [
  {
    id: 'cn1-olfactory',
    roman: 'I',
    number: 1,
    name: 'Olfactory Nerve',
    shortName: 'CN I',
    type: 'sensory',
    color: '#d8a3ce',
    radius: 0.012,
    summary:
      'The shortest cranial nerve. Carries smell from olfactory receptors in the nasal mucosa through the cribriform plate to the olfactory bulbs — the only sensory pathway that does not relay through the thalamus.',
    functions: [
      'Sense of smell',
      'Direct projection from periphery to forebrain (no thalamic relay)',
      'Closely tied to memory and emotion via direct connections to limbic structures',
    ],
    relatedRegions: ['hippocampus', 'amygdala'],
    paths: [
      {
        side: 'right',
        points: [
          [0.13, 0.08, 0.78], // olfactory bulb
          [0.12, -0.02, 0.85], // descending through cribriform plate
          [0.18, -0.18, 0.95], // upper nasal cavity
          [0.22, -0.32, 1.05], // mid nasal mucosa
        ],
      },
      {
        side: 'left',
        points: [
          [-0.13, 0.08, 0.78],
          [-0.12, -0.02, 0.85],
          [-0.18, -0.18, 0.95],
          [-0.22, -0.32, 1.05],
        ],
      },
    ],
  },
  {
    id: 'cn2-optic',
    roman: 'II',
    number: 2,
    name: 'Optic Nerve',
    shortName: 'CN II',
    type: 'sensory',
    color: '#e8b04a',
    radius: 0.025,
    summary:
      'A bundle of about a million axons carrying vision from the retina to the brain. Fibers from the nasal half of each retina cross at the optic chiasm, so the left half of the visual world ends up entirely in the right hemisphere.',
    functions: [
      'Vision: from retinal ganglion cells to lateral geniculate nucleus of the thalamus',
      'Crossing at the optic chiasm sends contralateral visual field to each hemisphere',
      'Drives pupillary reflexes via the pretectal nucleus',
    ],
    relatedRegions: ['thalamus', 'occipital-lobe'],
    paths: [
      {
        side: 'right',
        points: [
          [0.55, -0.08, 0.95], // back of right eye
          [0.35, -0.12, 0.78], // posterior orbit
          [0.15, -0.15, 0.55], // approaching chiasm
          [0.0, -0.18, 0.42], // optic chiasm (midline)
          [-0.15, -0.20, 0.30], // crossed fibers continuing as right optic tract
          [-0.30, -0.18, 0.15], // toward LGN of thalamus
        ],
      },
      {
        side: 'left',
        points: [
          [-0.55, -0.08, 0.95],
          [-0.35, -0.12, 0.78],
          [-0.15, -0.15, 0.55],
          [0.0, -0.18, 0.42],
          [0.15, -0.20, 0.30],
          [0.30, -0.18, 0.15],
        ],
      },
    ],
  },
  {
    id: 'cn3-oculomotor',
    roman: 'III',
    number: 3,
    name: 'Oculomotor Nerve',
    shortName: 'CN III',
    type: 'motor',
    color: '#e89aa3',
    radius: 0.012,
    summary:
      'Emerges from the front of the midbrain and runs forward to the eye. Drives most of the muscles that move the eyeball, plus the muscle that lifts the upper lid and the parasympathetic fibers that constrict the pupil.',
    functions: [
      'Movement of four of the six extraocular muscles',
      'Elevation of the upper eyelid (levator palpebrae)',
      'Parasympathetic pupil constriction and lens accommodation',
    ],
    relatedRegions: ['midbrain'],
    paths: [
      {
        side: 'right',
        points: [
          [0.08, -0.10, 0.30], // interpeduncular fossa of midbrain
          [0.25, -0.10, 0.55], // through cavernous sinus
          [0.45, -0.08, 0.85], // entering orbit
          [0.55, -0.05, 0.95], // eye muscles
        ],
      },
      {
        side: 'left',
        points: [
          [-0.08, -0.10, 0.30],
          [-0.25, -0.10, 0.55],
          [-0.45, -0.08, 0.85],
          [-0.55, -0.05, 0.95],
        ],
      },
    ],
  },
  {
    id: 'cn4-trochlear',
    roman: 'IV',
    number: 4,
    name: 'Trochlear Nerve',
    shortName: 'CN IV',
    type: 'motor',
    color: '#c47480',
    radius: 0.008,
    summary:
      'The smallest cranial nerve and the only one to emerge from the back of the brainstem. Wraps around the midbrain and innervates a single muscle — the superior oblique — which rotates the eye downward and inward.',
    functions: [
      'Innervates the superior oblique muscle of the eye',
      'Causes downward and inward rotation (looking at the tip of the nose)',
    ],
    relatedRegions: ['midbrain'],
    paths: [
      {
        side: 'right',
        points: [
          [0.0, -0.05, -0.18], // dorsal midbrain (where it actually emerges)
          [0.12, -0.05, -0.05], // wrapping around midbrain
          [0.25, -0.05, 0.20],
          [0.42, -0.05, 0.55],
          [0.55, -0.05, 0.90], // superior oblique muscle
        ],
      },
      {
        side: 'left',
        points: [
          [0.0, -0.05, -0.18],
          [-0.12, -0.05, -0.05],
          [-0.25, -0.05, 0.20],
          [-0.42, -0.05, 0.55],
          [-0.55, -0.05, 0.90],
        ],
      },
    ],
  },
  {
    id: 'cn5-trigeminal',
    roman: 'V',
    number: 5,
    name: 'Trigeminal Nerve',
    shortName: 'CN V',
    type: 'mixed',
    color: '#b8956b',
    radius: 0.022,
    summary:
      'The largest cranial nerve. Carries sensation from almost the entire face and motor control of the muscles of chewing. Three divisions — ophthalmic (V1), maxillary (V2), and mandibular (V3) — fan out toward forehead, cheek, and jaw.',
    functions: [
      'Sensation from the face, scalp, cornea, and oral cavity',
      'Motor control of the muscles of mastication',
      'Substrate of trigeminal neuralgia — one of the most intense pains known',
    ],
    relatedRegions: ['pons', 'thalamus'],
    paths: [
      // V1 — ophthalmic, to forehead
      {
        side: 'right',
        points: [
          [0.30, -0.45, 0.30], // lateral pons emergence
          [0.45, -0.30, 0.55],
          [0.55, -0.10, 0.80],
          [0.50, 0.15, 0.95], // forehead
        ],
      },
      // V2 — maxillary, to cheek
      {
        side: 'right',
        points: [
          [0.30, -0.45, 0.30],
          [0.50, -0.40, 0.60],
          [0.65, -0.45, 0.90], // cheek
        ],
      },
      // V3 — mandibular, to jaw
      {
        side: 'right',
        points: [
          [0.30, -0.45, 0.30],
          [0.50, -0.65, 0.55],
          [0.65, -0.85, 0.80], // jaw
        ],
      },
      // mirror left
      {
        side: 'left',
        points: [
          [-0.30, -0.45, 0.30],
          [-0.45, -0.30, 0.55],
          [-0.55, -0.10, 0.80],
          [-0.50, 0.15, 0.95],
        ],
      },
      {
        side: 'left',
        points: [
          [-0.30, -0.45, 0.30],
          [-0.50, -0.40, 0.60],
          [-0.65, -0.45, 0.90],
        ],
      },
      {
        side: 'left',
        points: [
          [-0.30, -0.45, 0.30],
          [-0.50, -0.65, 0.55],
          [-0.65, -0.85, 0.80],
        ],
      },
    ],
  },
  {
    id: 'cn6-abducens',
    roman: 'VI',
    number: 6,
    name: 'Abducens Nerve',
    shortName: 'CN VI',
    type: 'motor',
    color: '#e89aa3',
    radius: 0.008,
    summary:
      'Emerges from the pontomedullary junction near the midline and runs forward to innervate a single muscle: the lateral rectus, which abducts the eye (turns it outward).',
    functions: [
      'Innervates the lateral rectus muscle',
      'Abduction of the eye (turning it laterally)',
      'Particularly vulnerable to raised intracranial pressure',
    ],
    relatedRegions: ['pons'],
    paths: [
      {
        side: 'right',
        points: [
          [0.06, -0.65, 0.15], // pontomedullary junction near midline
          [0.20, -0.55, 0.40],
          [0.45, -0.30, 0.80],
          [0.58, -0.10, 0.95], // lateral rectus
        ],
      },
      {
        side: 'left',
        points: [
          [-0.06, -0.65, 0.15],
          [-0.20, -0.55, 0.40],
          [-0.45, -0.30, 0.80],
          [-0.58, -0.10, 0.95],
        ],
      },
    ],
  },
  {
    id: 'cn7-facial',
    roman: 'VII',
    number: 7,
    name: 'Facial Nerve',
    shortName: 'CN VII',
    type: 'mixed',
    color: '#e89c70',
    radius: 0.015,
    summary:
      'Motor control of the muscles of facial expression, plus taste from the front of the tongue and parasympathetic fibers to the salivary and lacrimal glands. When it fails on one side, half the face droops — Bell\'s palsy.',
    functions: [
      'Motor: muscles of facial expression (smiling, frowning, closing the eye)',
      'Taste from the anterior two-thirds of the tongue',
      'Parasympathetic to lacrimal and salivary glands',
      'Stapedius muscle (dampens loud sounds in the inner ear)',
    ],
    relatedRegions: ['pons'],
    paths: [
      {
        side: 'right',
        points: [
          [0.22, -0.62, 0.10], // pontomedullary junction, lateral
          [0.38, -0.55, 0.25],
          [0.55, -0.45, 0.50],
          [0.65, -0.35, 0.80], // emerging at the side of the face
          [0.70, -0.45, 0.92],
        ],
      },
      {
        side: 'left',
        points: [
          [-0.22, -0.62, 0.10],
          [-0.38, -0.55, 0.25],
          [-0.55, -0.45, 0.50],
          [-0.65, -0.35, 0.80],
          [-0.70, -0.45, 0.92],
        ],
      },
    ],
  },
  {
    id: 'cn8-vestibulocochlear',
    roman: 'VIII',
    number: 8,
    name: 'Vestibulocochlear Nerve',
    shortName: 'CN VIII',
    type: 'sensory',
    color: '#4f8a8b',
    radius: 0.013,
    summary:
      'Two nerves running together. The cochlear branch carries hearing from the cochlea. The vestibular branch carries balance information from the semicircular canals — your sense of where your head is and how it is moving.',
    functions: [
      'Hearing (cochlear division)',
      'Balance and head position (vestibular division)',
      'Damage produces deafness, tinnitus, vertigo',
    ],
    relatedRegions: ['pons', 'cerebellum', 'temporal-lobe'],
    paths: [
      {
        side: 'right',
        points: [
          [0.25, -0.60, 0.05], // pontomedullary junction
          [0.40, -0.55, 0.10],
          [0.55, -0.55, 0.20], // inner ear
        ],
      },
      {
        side: 'left',
        points: [
          [-0.25, -0.60, 0.05],
          [-0.40, -0.55, 0.10],
          [-0.55, -0.55, 0.20],
        ],
      },
    ],
  },
  {
    id: 'cn9-glossopharyngeal',
    roman: 'IX',
    number: 9,
    name: 'Glossopharyngeal Nerve',
    shortName: 'CN IX',
    type: 'mixed',
    color: '#7a9461',
    radius: 0.012,
    summary:
      'Motor to one swallowing muscle, sensation from the back of the tongue and pharynx, taste from the posterior third of the tongue, and parasympathetic to the parotid gland. Also carries baroreceptor signals from the carotid sinus.',
    functions: [
      'Taste from the posterior third of the tongue',
      'Sensation from pharynx (gag reflex afferent limb)',
      'Parasympathetic to the parotid salivary gland',
      'Carotid baroreceptors and chemoreceptors',
    ],
    relatedRegions: ['medulla'],
    paths: [
      {
        side: 'right',
        points: [
          [0.18, -0.85, 0.05], // upper lateral medulla
          [0.30, -0.95, 0.30],
          [0.30, -1.10, 0.55], // pharynx
          [0.18, -1.25, 0.60], // back of tongue
        ],
      },
      {
        side: 'left',
        points: [
          [-0.18, -0.85, 0.05],
          [-0.30, -0.95, 0.30],
          [-0.30, -1.10, 0.55],
          [-0.18, -1.25, 0.60],
        ],
      },
    ],
  },
  {
    id: 'cn10-vagus',
    roman: 'X',
    number: 10,
    name: 'Vagus Nerve',
    shortName: 'CN X',
    type: 'mixed',
    color: '#7a9461',
    radius: 0.018,
    summary:
      'The wanderer. ~80% of its fibers carry signals up from the heart, lungs, and gut to the brainstem. The longest cranial nerve and the workhorse of the parasympathetic nervous system. Reaches nearly every organ above the pelvis.',
    functions: [
      'Parasympathetic control of heart, lungs, larynx, GI tract',
      'Visceral sensation from heart, lungs, and gut to the brainstem',
      'Heart-rate variability — the rhythmic vagal slowing of the heart',
      'Gut–brain axis: main neural pathway between gut and brain',
      'Modulates inflammation through the cholinergic anti-inflammatory pathway',
    ],
    relatedRegions: ['medulla', 'insula', 'enteric-nervous-system'],
    paths: [
      {
        side: 'right',
        points: [
          [0.20, -0.95, 0.0], // lateral medulla
          [0.22, -1.25, 0.10],
          [0.20, -1.60, 0.10], // entering neck, alongside carotid
          [0.16, -2.10, 0.15], // upper thorax — heart
          [0.10, -2.70, 0.15], // diaphragm — stomach
          [0.05, -3.15, 0.15], // gut
        ],
      },
      {
        side: 'left',
        points: [
          [-0.20, -0.95, 0.0],
          [-0.22, -1.25, 0.10],
          [-0.20, -1.60, 0.10],
          [-0.16, -2.10, 0.15],
          [-0.10, -2.70, 0.15],
          [-0.05, -3.15, 0.15],
        ],
      },
    ],
  },
  {
    id: 'cn11-accessory',
    roman: 'XI',
    number: 11,
    name: 'Accessory Nerve',
    shortName: 'CN XI',
    type: 'motor',
    color: '#c47480',
    radius: 0.011,
    summary:
      'A pure motor nerve with an unusual origin: fibers come from both the medulla and the upper cervical spinal cord, joining briefly inside the skull before innervating two large neck muscles — sternocleidomastoid and trapezius.',
    functions: [
      'Innervates sternocleidomastoid (turning the head)',
      'Innervates trapezius (shrugging the shoulder)',
    ],
    relatedRegions: ['medulla', 'spinal-cord'],
    paths: [
      {
        side: 'right',
        points: [
          [0.18, -1.05, -0.02], // lower medulla
          [0.18, -1.30, 0.0],
          [0.30, -1.55, 0.05], // sternocleidomastoid
          [0.45, -1.85, 0.0], // trapezius
        ],
      },
      {
        side: 'left',
        points: [
          [-0.18, -1.05, -0.02],
          [-0.18, -1.30, 0.0],
          [-0.30, -1.55, 0.05],
          [-0.45, -1.85, 0.0],
        ],
      },
    ],
  },
  {
    id: 'cn12-hypoglossal',
    roman: 'XII',
    number: 12,
    name: 'Hypoglossal Nerve',
    shortName: 'CN XII',
    type: 'motor',
    color: '#e89aa3',
    radius: 0.011,
    summary:
      'Motor innervation of the tongue. When it fails on one side, the tongue deviates toward the weak side on protrusion because the strong side pushes harder.',
    functions: [
      'Motor control of all intrinsic and most extrinsic tongue muscles',
      'Essential for speech, chewing, and swallowing',
    ],
    relatedRegions: ['medulla'],
    paths: [
      {
        side: 'right',
        points: [
          [0.08, -0.95, 0.10], // ventral medulla, near midline
          [0.15, -1.15, 0.30],
          [0.15, -1.30, 0.55], // tongue
        ],
      },
      {
        side: 'left',
        points: [
          [-0.08, -0.95, 0.10],
          [-0.15, -1.15, 0.30],
          [-0.15, -1.30, 0.55],
        ],
      },
    ],
  },
];

export function getCranialNerve(id: string): CranialNerve | undefined {
  return CRANIAL_NERVES.find((n) => n.id === id);
}
