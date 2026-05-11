// Anatomical regions of the brain & connected nervous system.
//
// Coordinates use a head-centered frame:
//   x: left(-) / right(+)
//   y: inferior(-) / superior(+)   (down / up)
//   z: posterior(-) / anterior(+)  (back / front)
//
// Units are arbitrary scene units, ~1 = a few centimeters.
// Geometry is a simple ellipsoid (scale on x/y/z) so each region
// can be picked, highlighted, and pulsed independently.

export type RegionCategory =
  | 'cortex'
  | 'limbic'
  | 'basal-ganglia'
  | 'diencephalon'
  | 'brainstem'
  | 'cerebellum'
  | 'cranial-nerve'
  | 'spinal'
  | 'enteric';

export interface BrainRegion {
  id: string;
  name: string;
  shortName?: string;
  category: RegionCategory;
  color: string; // hex
  position: [number, number, number];
  scale: [number, number, number];
  /** rotation in radians [x, y, z] */
  rotation?: [number, number, number];
  /** one-paragraph plain-English description */
  summary: string;
  /** longer functional notes shown in the side panel */
  functions: string[];
  /** related region ids — used to draw highlight links */
  connects?: string[];
  /** slug of a long-form essay in /content if one exists */
  essay?: string;
}

export const REGIONS: BrainRegion[] = [
  // ---------- CORTEX (lobes) ----------
  {
    id: 'frontal-lobe',
    name: 'Frontal Lobe',
    category: 'cortex',
    color: '#e89aa3',
    position: [0, 0.55, 1.05],
    scale: [1.55, 0.95, 1.05],
    summary:
      'The forward command center. Plans, decides, restrains impulses, holds the model of "future you."',
    functions: [
      'Executive function: planning, sequencing, working memory',
      'Voluntary motor control (primary motor cortex on the back edge)',
      'Inhibition of impulses and emotional regulation',
      'Language production (Broca\'s area, usually left)',
      'Self-awareness and social judgment',
    ],
    connects: ['parietal-lobe', 'anterior-cingulate', 'thalamus', 'striatum'],
    essay: 'frontal-lobe',
  },
  {
    id: 'parietal-lobe',
    name: 'Parietal Lobe',
    category: 'cortex',
    color: '#f0a878',
    position: [0, 0.95, -0.15],
    scale: [1.55, 0.7, 1.1],
    summary:
      'Where the body, space, and number live. Integrates touch, proprioception, and where things are in relation to you.',
    functions: [
      'Somatosensory cortex: touch, temperature, proprioception',
      'Spatial reasoning and navigation (with hippocampus)',
      'Mathematical and numerical cognition',
      'Attention and body schema',
    ],
    connects: ['frontal-lobe', 'occipital-lobe', 'temporal-lobe'],
    essay: 'parietal-lobe',
  },
  {
    id: 'occipital-lobe',
    name: 'Occipital Lobe',
    category: 'cortex',
    color: '#e8b04a',
    position: [0, 0.55, -1.25],
    scale: [1.3, 0.85, 0.75],
    summary:
      'Visual cortex. Almost the entire posterior pole of the brain is wired to the eyes.',
    functions: [
      'Primary visual processing (V1)',
      'Color, motion, shape, and edge detection',
      'Visual object recognition pathways (toward temporal and parietal)',
    ],
    connects: ['parietal-lobe', 'temporal-lobe', 'thalamus'],
    essay: 'occipital-lobe',
  },
  {
    id: 'temporal-lobe',
    name: 'Temporal Lobes',
    category: 'cortex',
    color: '#7a9461',
    position: [0, -0.1, 0.2],
    scale: [1.7, 0.55, 1.4],
    summary:
      'Hearing, language understanding, faces, memory. The temporal lobes sit on either side, just behind the temples.',
    functions: [
      'Auditory cortex and pitch / rhythm processing',
      'Language comprehension (Wernicke\'s area, usually left)',
      'Face and object recognition (fusiform area)',
      'Semantic memory — the meaning of things',
      'Gateway to the hippocampus and amygdala',
    ],
    connects: ['hippocampus', 'amygdala', 'occipital-lobe'],
    essay: 'temporal-lobe',
  },
  {
    id: 'insula',
    name: 'Insular Cortex',
    shortName: 'Insula',
    category: 'cortex',
    color: '#4f8a8b',
    position: [0, 0.05, 0.35],
    scale: [1.15, 0.4, 0.6],
    summary:
      'Hidden inside the lateral sulcus. The interoceptive map of the body — your felt sense of being alive.',
    functions: [
      'Interoception: heartbeat, breath, gut sensations',
      'Emotional awareness and bodily feeling-tone',
      'Empathy, disgust, craving, and pain',
      'Major cortical target of vagal afferents (via brainstem and thalamus)',
    ],
    connects: ['anterior-cingulate', 'amygdala', 'vagus-nerve', 'nucleus-tractus-solitarius'],
    essay: 'insula',
  },
  {
    id: 'anterior-cingulate',
    name: 'Anterior Cingulate Cortex',
    shortName: 'ACC',
    category: 'cortex',
    color: '#8a6fa3',
    position: [0, 0.55, 0.55],
    scale: [0.35, 0.5, 0.9],
    summary:
      'A belt of cortex on the midline. Where attention, conflict, effort, and the autonomic body meet emotion.',
    functions: [
      'Conflict monitoring and error detection',
      'Pain affect (the unpleasantness of pain, not just the sensation)',
      'Autonomic regulation — connects to heart and gut control',
      'Motivation and effort allocation',
    ],
    connects: ['insula', 'frontal-lobe', 'amygdala', 'hypothalamus'],
    essay: 'anterior-cingulate',
  },

  // ---------- LIMBIC ----------
  {
    id: 'hippocampus',
    name: 'Hippocampus',
    category: 'limbic',
    color: '#6b4869',
    position: [0, -0.05, -0.1],
    scale: [0.95, 0.25, 0.45],
    summary:
      'Seahorse-shaped. Writes new episodic memories and rebuilds them when you remember. Also a map of space.',
    functions: [
      'Encoding and consolidation of episodic / declarative memory',
      'Spatial mapping (place cells)',
      'Pattern separation — telling similar experiences apart',
      'Highly plastic; vulnerable to chronic stress and elevated cortisol',
    ],
    connects: ['temporal-lobe', 'amygdala', 'thalamus', 'prefrontal-cortex'],
    essay: 'hippocampus',
  },
  {
    id: 'amygdala',
    name: 'Amygdala',
    category: 'limbic',
    color: '#e89aa3',
    position: [0, 0.0, 0.25],
    scale: [0.45, 0.3, 0.35],
    summary:
      'Almond-shaped salience detector. Tags experience with emotional weight — especially threat — and recruits the body fast.',
    functions: [
      'Detection of biologically relevant stimuli (threat, reward, faces)',
      'Fear conditioning and emotional learning',
      'Triggers sympathetic arousal via hypothalamus and brainstem',
      'Modulates memory encoding through the hippocampus',
    ],
    connects: ['hippocampus', 'hypothalamus', 'insula', 'prefrontal-cortex'],
    essay: 'amygdala',
  },

  // ---------- BASAL GANGLIA ----------
  {
    id: 'striatum',
    name: 'Striatum (Caudate + Putamen)',
    shortName: 'Striatum',
    category: 'basal-ganglia',
    color: '#f0a878',
    position: [0, 0.15, 0.15],
    scale: [0.95, 0.55, 0.65],
    summary:
      'The selector. Dopamine-rich input nucleus of the basal ganglia. Chooses which action or thought gets to go through.',
    functions: [
      'Action selection and gating',
      'Habit formation (dorsal) and reward-based learning (ventral / nucleus accumbens)',
      'Dopaminergic input from the midbrain (substantia nigra, VTA)',
      'Impaired in Parkinson\'s, OCD, and addiction',
    ],
    connects: ['frontal-lobe', 'thalamus', 'substantia-nigra'],
    essay: 'basal-ganglia',
  },

  // ---------- DIENCEPHALON ----------
  {
    id: 'thalamus',
    name: 'Thalamus',
    category: 'diencephalon',
    color: '#4f8a8b',
    position: [0, 0.15, 0.0],
    scale: [0.55, 0.4, 0.55],
    summary:
      'Central relay and gateway to consciousness. Almost every sensory stream (except smell) passes through here on the way to cortex.',
    functions: [
      'Sensory and motor relay to the cortex',
      'Gating of attention and arousal level',
      'Critical hub for awake conscious experience',
      'Reciprocal loops with virtually every cortical area',
    ],
    connects: ['frontal-lobe', 'parietal-lobe', 'occipital-lobe', 'reticular-formation'],
    essay: 'thalamus',
  },
  {
    id: 'hypothalamus',
    name: 'Hypothalamus',
    category: 'diencephalon',
    color: '#e8b04a',
    position: [0, -0.15, 0.15],
    scale: [0.3, 0.25, 0.3],
    summary:
      'Pea-sized regulator. Body temperature, hunger, thirst, circadian rhythm, hormones, sex, and the stress axis all route through here.',
    functions: [
      'Homeostasis: temperature, fluid balance, hunger and satiety',
      'Circadian rhythm (suprachiasmatic nucleus)',
      'Master control of the pituitary and endocrine system',
      'HPA axis — drives cortisol release during stress',
      'Autonomic integration: directs sympathetic and parasympathetic outflow',
    ],
    connects: ['amygdala', 'pituitary', 'brainstem', 'vagus-nerve'],
    essay: 'hypothalamus',
  },
  {
    id: 'pituitary',
    name: 'Pituitary Gland',
    category: 'diencephalon',
    color: '#e89aa3',
    position: [0, -0.45, 0.15],
    scale: [0.13, 0.13, 0.13],
    summary:
      'The endocrine "master gland," hanging beneath the hypothalamus. Translates neural signals into circulating hormones.',
    functions: [
      'Anterior lobe: ACTH, TSH, growth hormone, prolactin, gonadotropins',
      'Posterior lobe: oxytocin, vasopressin',
      'Bridge between nervous system and bloodstream',
    ],
    connects: ['hypothalamus'],
  },

  // ---------- BRAINSTEM ----------
  {
    id: 'midbrain',
    name: 'Midbrain',
    category: 'brainstem',
    color: '#a99e7e',
    position: [0, -0.45, -0.05],
    scale: [0.32, 0.3, 0.4],
    summary:
      'Top of the brainstem. Contains dopaminergic nuclei (substantia nigra, VTA), reflexive visual and auditory orienting, and arousal centers.',
    functions: [
      'Substantia nigra → striatum (movement initiation)',
      'Ventral tegmental area → reward and motivation',
      'Superior / inferior colliculi: reflexive orienting to sight and sound',
      'Periaqueductal gray: pain modulation and defensive behavior',
    ],
    connects: ['striatum', 'pons', 'thalamus', 'reticular-formation'],
  },
  {
    id: 'substantia-nigra',
    name: 'Substantia Nigra',
    category: 'brainstem',
    color: '#3d3625',
    position: [0, -0.45, -0.05],
    scale: [0.18, 0.1, 0.2],
    summary:
      'Dark-pigmented dopamine nucleus in the midbrain. Loss of its cells produces Parkinson\'s disease.',
    functions: [
      'Provides dopamine to the dorsal striatum',
      'Essential for smooth voluntary movement',
      'Implicated in motor learning and habit',
    ],
    connects: ['striatum', 'midbrain'],
  },
  {
    id: 'pons',
    name: 'Pons',
    category: 'brainstem',
    color: '#a99e7e',
    position: [0, -0.7, -0.05],
    scale: [0.35, 0.28, 0.4],
    summary:
      'Bridge of the brainstem. Carries fibers between cortex and cerebellum and houses centers for sleep, breathing, and facial movement.',
    functions: [
      'Pontine respiratory group — paces breathing with the medulla',
      'REM sleep generation',
      'Cranial nerves V, VI, VII, VIII',
      'Massive crossroads of cortical-cerebellar traffic',
    ],
    connects: ['cerebellum', 'medulla', 'midbrain'],
  },
  {
    id: 'medulla',
    name: 'Medulla Oblongata',
    shortName: 'Medulla',
    category: 'brainstem',
    color: '#a99e7e',
    position: [0, -1.0, -0.05],
    scale: [0.3, 0.32, 0.35],
    summary:
      'Lowest brainstem segment, continuous with the spinal cord. Keeps you alive: heart rate, blood pressure, breathing, swallowing, vomiting.',
    functions: [
      'Cardiovascular control nuclei',
      'Respiratory rhythm generation (pre-Bötzinger complex)',
      'Nucleus tractus solitarius — receives vagal afferents from heart, lungs, gut',
      'Dorsal motor nucleus of the vagus — origin of parasympathetic output',
      'Decussation of the corticospinal tract (motor crossover)',
    ],
    connects: ['pons', 'spinal-cord', 'vagus-nerve', 'nucleus-tractus-solitarius'],
    essay: 'medulla',
  },
  {
    id: 'nucleus-tractus-solitarius',
    name: 'Nucleus Tractus Solitarius',
    shortName: 'NTS',
    category: 'brainstem',
    color: '#7a9461',
    position: [0.15, -1.0, -0.05],
    scale: [0.1, 0.18, 0.12],
    summary:
      'The brain\'s primary listener for the body. First central relay for vagal afferents from the heart, lungs, and gut.',
    functions: [
      'Receives interoceptive signals: baroreceptors, chemoreceptors, taste, gut stretch',
      'Projects to hypothalamus, amygdala, insula, and parabrachial nucleus',
      'Drives the baroreflex and other autonomic reflexes',
    ],
    connects: ['vagus-nerve', 'medulla', 'insula', 'hypothalamus'],
    essay: 'vagus-nerve',
  },
  {
    id: 'reticular-formation',
    name: 'Reticular Formation',
    category: 'brainstem',
    color: '#574d36',
    position: [0, -0.7, -0.1],
    scale: [0.2, 0.95, 0.18],
    summary:
      'A diffuse net running through the brainstem. Sets the level of consciousness and arousal — the volume knob on awareness.',
    functions: [
      'Ascending reticular activating system: wakefulness and arousal',
      'Sleep–wake transitions',
      'Modulates pain, posture, and autonomic tone',
      'Damage here produces coma',
    ],
    connects: ['thalamus', 'pons', 'medulla', 'midbrain'],
    essay: 'consciousness',
  },

  // ---------- CEREBELLUM ----------
  {
    id: 'cerebellum',
    name: 'Cerebellum',
    category: 'cerebellum',
    color: '#cfc7b1',
    position: [0, -0.55, -0.95],
    scale: [1.1, 0.55, 0.65],
    summary:
      'The "little brain." 80% of the brain\'s neurons live here. Smooths movement, learns skill, and now we know — also tunes thought.',
    functions: [
      'Motor coordination, timing, and learning',
      'Posture and balance',
      'Predictive models of action ("forward models")',
      'Cognitive and emotional modulation — recently recognized',
    ],
    connects: ['pons', 'thalamus', 'frontal-lobe'],
    essay: 'cerebellum',
  },

  // ---------- VAGUS & AUTONOMIC ----------
  {
    id: 'vagus-nerve',
    name: 'Vagus Nerve (CN X)',
    shortName: 'Vagus',
    category: 'cranial-nerve',
    color: '#7a9461',
    position: [0.2, -1.5, 0.0],
    scale: [0.06, 0.95, 0.06],
    summary:
      'The wanderer. Tenth cranial nerve. ~80% of its fibers carry information up from the body — heart, lungs, gut — to the brainstem.',
    functions: [
      'Parasympathetic supply to heart, lungs, larynx, stomach, liver, pancreas, intestines',
      'Carries gut and visceral sensation up to the NTS',
      'Slows the heart (cardiac brake) — basis of heart-rate variability',
      'Major substrate of the gut–brain axis',
      'Target of vagus-nerve stimulation in depression and epilepsy',
    ],
    connects: ['medulla', 'nucleus-tractus-solitarius', 'enteric-nervous-system', 'insula'],
    essay: 'vagus-nerve',
  },

  // ---------- SPINAL ----------
  {
    id: 'spinal-cord',
    name: 'Spinal Cord',
    category: 'spinal',
    color: '#cfc7b1',
    position: [0, -2.1, -0.05],
    scale: [0.18, 1.4, 0.22],
    summary:
      'A cable of central nervous tissue inside the vertebral column. Carries motor commands down and sensory information up — and runs reflexes locally.',
    functions: [
      'Ascending tracts: pain, temperature, touch, proprioception',
      'Descending tracts: corticospinal (voluntary movement)',
      'Local reflex arcs (stretch reflex, withdrawal reflex)',
      'Sympathetic outflow (T1–L2) and sacral parasympathetic (S2–S4)',
    ],
    connects: ['medulla', 'sympathetic-chain'],
    essay: 'spinal-cord',
  },
  {
    id: 'sympathetic-chain',
    name: 'Sympathetic Chain',
    category: 'spinal',
    color: '#e89aa3',
    position: [0.35, -2.1, -0.05],
    scale: [0.05, 1.3, 0.05],
    summary:
      'Paired ganglia running alongside the spinal column. The accelerator. "Fight, flight, or freeze."',
    functions: [
      'Speeds the heart, dilates pupils, mobilizes glucose',
      'Redirects blood from gut to muscles',
      'Releases noradrenaline from postganglionic fibers and adrenaline from the adrenal medulla',
      'Originates from thoracic and upper lumbar cord (T1–L2)',
    ],
    connects: ['spinal-cord', 'hypothalamus'],
    essay: 'autonomic-nervous-system',
  },

  // ---------- ENTERIC ----------
  {
    id: 'enteric-nervous-system',
    name: 'Enteric Nervous System',
    shortName: 'Gut Brain',
    category: 'enteric',
    color: '#f0a878',
    position: [0, -3.0, 0.1],
    scale: [0.6, 0.4, 0.4],
    summary:
      'A 500-million-neuron mesh embedded in the gut wall. Can run digestion entirely on its own — and talks constantly to the brain via the vagus.',
    functions: [
      'Local control of gut motility, secretion, and blood flow',
      'Produces ~95% of the body\'s serotonin',
      'Communicates with brain via vagal afferents and circulating signals',
      'Modulated by the gut microbiome',
    ],
    connects: ['vagus-nerve'],
    essay: 'gut-brain-axis',
  },
];

export function getRegion(id: string): BrainRegion | undefined {
  return REGIONS.find((r) => r.id === id);
}

export const CATEGORY_LABELS: Record<RegionCategory, string> = {
  cortex: 'Cerebral Cortex',
  limbic: 'Limbic System',
  'basal-ganglia': 'Basal Ganglia',
  diencephalon: 'Diencephalon',
  brainstem: 'Brainstem',
  cerebellum: 'Cerebellum',
  'cranial-nerve': 'Cranial Nerves',
  spinal: 'Spinal Cord & Autonomic',
  enteric: 'Enteric Nervous System',
};
