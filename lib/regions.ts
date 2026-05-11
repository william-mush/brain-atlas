// Anatomical regions of the brain & connected nervous system.
//
// Coordinates use a head-centered frame:
//   x: left(-) / right(+)
//   y: inferior(-) / superior(+)   (down / up)
//   z: posterior(-) / anterior(+)  (back / front)
//
// Regions with `meshNode` set are rendered from the BodyParts3D mesh
// (loaded from /models/brain.glb) — those are anatomically accurate.
// Regions without `meshNode` are rendered as procedural ellipsoids,
// positioned where they actually live, and used for structures that
// BodyParts3D does not provide as individual meshes (e.g. cortical lobes
// other than occipital, vagus nerve, spinal cord, etc.).

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
  color: string;
  /** node name in /models/brain.glb — if set, render the real mesh */
  meshNode?: string;
  /** procedural fallback position (for regions without a mesh) */
  position?: [number, number, number];
  /** procedural fallback scale */
  scale?: [number, number, number];
  rotation?: [number, number, number];
  /** id of a CranialNerve in lib/cranial-nerves.ts — if set, render as tube paths */
  nerveId?: string;
  summary: string;
  functions: string[];
  connects?: string[];
  essay?: string;
}

export const REGIONS: BrainRegion[] = [
  // ---------- CORTEX ----------
  {
    id: 'frontal-lobe',
    name: 'Frontal Lobe',
    category: 'cortex',
    color: '#e89aa3',
    // procedural marker — no BP3D mesh for the frontal lobe specifically
    position: [0, 0.55, 1.0],
    scale: [0.18, 0.18, 0.18],
    summary:
      'The forward command center. Plans, decides, restrains impulses, holds the model of "future you."',
    functions: [
      'Executive function: planning, sequencing, working memory',
      'Voluntary motor control (primary motor cortex on the back edge)',
      'Inhibition of impulses and emotional regulation',
      "Language production (Broca's area, usually left)",
      'Self-awareness and social judgment',
    ],
    connects: ['parietal-lobe', 'anterior-cingulate', 'thalamus', 'caudate'],
    essay: 'frontal-lobe',
  },
  {
    id: 'parietal-lobe',
    name: 'Parietal Lobe',
    category: 'cortex',
    color: '#f0a878',
    position: [0, 1.0, -0.2],
    scale: [0.18, 0.18, 0.18],
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
    meshNode: 'occipital-lobe',
    summary:
      'Visual cortex. The posterior pole of the brain is wired almost entirely to the eyes.',
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
    position: [0.95, -0.2, 0.2],
    scale: [0.2, 0.2, 0.2],
    summary:
      'Hearing, language understanding, faces, memory. The temporal lobes sit on either side, just behind the temples.',
    functions: [
      'Auditory cortex and pitch / rhythm processing',
      "Language comprehension (Wernicke's area, usually left)",
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
    meshNode: 'insula',
    summary:
      'Hidden inside the lateral sulcus. The interoceptive map of the body — your felt sense of being alive.',
    functions: [
      'Interoception: heartbeat, breath, gut sensations',
      'Emotional awareness and bodily feeling-tone',
      'Empathy, disgust, craving, and pain',
      'Major cortical target of vagal afferents (via brainstem and thalamus)',
    ],
    connects: ['anterior-cingulate', 'amygdala', 'vagus-nerve'],
    essay: 'insula',
  },
  {
    id: 'anterior-cingulate',
    name: 'Cingulate Cortex',
    shortName: 'Cingulate',
    category: 'cortex',
    color: '#8a6fa3',
    meshNode: 'cingulate',
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
    meshNode: 'hippocampus',
    summary:
      'Seahorse-shaped. Writes new episodic memories and rebuilds them when you remember. Also a map of space.',
    functions: [
      'Encoding and consolidation of episodic / declarative memory',
      'Spatial mapping (place cells)',
      'Pattern separation — telling similar experiences apart',
      'Highly plastic; vulnerable to chronic stress and elevated cortisol',
    ],
    connects: ['temporal-lobe', 'amygdala', 'thalamus', 'fornix'],
    essay: 'hippocampus',
  },
  {
    id: 'amygdala',
    name: 'Amygdala',
    category: 'limbic',
    color: '#c47480',
    meshNode: 'amygdala',
    summary:
      'Almond-shaped salience detector. Tags experience with emotional weight — especially threat — and recruits the body fast.',
    functions: [
      'Detection of biologically relevant stimuli (threat, reward, faces)',
      'Fear conditioning and emotional learning',
      'Triggers sympathetic arousal via hypothalamus and brainstem',
      'Modulates memory encoding through the hippocampus',
    ],
    connects: ['hippocampus', 'hypothalamus', 'insula', 'frontal-lobe'],
    essay: 'amygdala',
  },
  {
    id: 'fornix',
    name: 'Fornix',
    category: 'limbic',
    color: '#cfb98e',
    meshNode: 'fornix',
    summary:
      'A C-shaped bundle of white matter — the main output highway of the hippocampus, arcing toward the hypothalamus and mammillary bodies.',
    functions: [
      "Carries hippocampal output to the diencephalon",
      'Part of the Papez circuit of memory and emotion',
    ],
    connects: ['hippocampus', 'hypothalamus'],
  },

  // ---------- BASAL GANGLIA ----------
  {
    id: 'caudate',
    name: 'Caudate Nucleus',
    category: 'basal-ganglia',
    color: '#f0a878',
    meshNode: 'caudate',
    summary:
      'A C-shaped nucleus curving with the lateral ventricle. Part of the striatum; key in goal-directed action and learning.',
    functions: [
      'Goal-directed action selection',
      'Procedural and habit learning',
      'Reward and motivation (with nucleus accumbens)',
      'Implicated in OCD when cortico-striatal loops misfire',
    ],
    connects: ['putamen', 'globus-pallidus', 'thalamus', 'frontal-lobe'],
    essay: 'basal-ganglia',
  },
  {
    id: 'putamen',
    name: 'Putamen',
    category: 'basal-ganglia',
    color: '#e89c70',
    meshNode: 'putamen',
    summary:
      'The large outer nucleus of the striatum. Heavily involved in motor habit and the automation of skilled movement.',
    functions: [
      'Habit formation',
      'Motor learning and execution',
      'Receives dense dopaminergic input from substantia nigra',
    ],
    connects: ['caudate', 'globus-pallidus', 'thalamus'],
    essay: 'basal-ganglia',
  },
  {
    id: 'globus-pallidus',
    name: 'Globus Pallidus',
    category: 'basal-ganglia',
    color: '#c4a87a',
    meshNode: 'globus-pallidus',
    summary:
      'Output nucleus of the basal ganglia. Pale on histology. Its tonic inhibition of the thalamus is what the rest of the basal ganglia work to release.',
    functions: [
      'Tonic inhibition of motor thalamus',
      'Final gateway in the action selection loop',
      'Target of deep brain stimulation for Parkinson’s and dystonia',
    ],
    connects: ['putamen', 'caudate', 'thalamus'],
    essay: 'basal-ganglia',
  },

  // ---------- DIENCEPHALON ----------
  {
    id: 'thalamus',
    name: 'Thalamus',
    category: 'diencephalon',
    color: '#4f8a8b',
    meshNode: 'thalamus',
    summary:
      'Central relay and gateway to consciousness. Almost every sensory stream (except smell) passes through here on the way to cortex.',
    functions: [
      'Sensory and motor relay to the cortex',
      'Gating of attention and arousal level',
      'Critical hub for awake conscious experience',
      'Reciprocal loops with virtually every cortical area',
    ],
    connects: ['frontal-lobe', 'occipital-lobe', 'caudate', 'reticular-formation'],
    essay: 'thalamus',
  },
  {
    id: 'hypothalamus',
    name: 'Hypothalamus',
    category: 'diencephalon',
    color: '#e8b04a',
    meshNode: 'hypothalamus',
    summary:
      'Pea-sized regulator. Body temperature, hunger, thirst, circadian rhythm, hormones, sex, and the stress axis all route through here.',
    functions: [
      'Homeostasis: temperature, fluid balance, hunger and satiety',
      'Circadian rhythm (suprachiasmatic nucleus)',
      'Master control of the pituitary and endocrine system',
      'HPA axis — drives cortisol release during stress',
      'Autonomic integration: directs sympathetic and parasympathetic outflow',
    ],
    connects: ['amygdala', 'pituitary', 'medulla', 'vagus-nerve'],
    essay: 'hypothalamus',
  },
  {
    id: 'pituitary',
    name: 'Pituitary Gland',
    category: 'diencephalon',
    color: '#e89aa3',
    meshNode: 'pituitary',
    summary:
      'The endocrine "master gland," hanging beneath the hypothalamus. Translates neural signals into circulating hormones.',
    functions: [
      'Anterior lobe: ACTH, TSH, growth hormone, prolactin, gonadotropins',
      'Posterior lobe: oxytocin, vasopressin',
      'Bridge between nervous system and bloodstream',
    ],
    connects: ['hypothalamus'],
  },

  // ---------- WHITE MATTER ----------
  {
    id: 'corpus-callosum',
    name: 'Corpus Callosum',
    category: 'diencephalon',
    color: '#e0d4b8',
    meshNode: 'corpus-callosum',
    summary:
      'The 200-million-fiber white-matter bridge connecting the two cerebral hemispheres. Cutting it produces the famous split-brain syndrome.',
    functions: [
      'Inter-hemispheric communication',
      'Coordination of bilateral perception, attention, and action',
    ],
    connects: ['frontal-lobe', 'parietal-lobe'],
    essay: 'consciousness',
  },

  // ---------- BRAINSTEM ----------
  {
    id: 'midbrain',
    name: 'Midbrain',
    category: 'brainstem',
    color: '#a99e7e',
    meshNode: 'midbrain',
    summary:
      'Top of the brainstem. Contains dopaminergic nuclei (substantia nigra, VTA), reflexive visual and auditory orienting, and arousal centers.',
    functions: [
      'Substantia nigra → striatum (movement initiation)',
      'Ventral tegmental area → reward and motivation',
      'Superior / inferior colliculi: reflexive orienting to sight and sound',
      'Periaqueductal gray: pain modulation and defensive behavior',
    ],
    connects: ['caudate', 'pons', 'thalamus', 'reticular-formation'],
  },
  {
    id: 'pons',
    name: 'Pons',
    category: 'brainstem',
    color: '#a99e7e',
    meshNode: 'pons',
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
    meshNode: 'medulla',
    summary:
      'Lowest brainstem segment, continuous with the spinal cord. Keeps you alive: heart rate, blood pressure, breathing, swallowing, vomiting.',
    functions: [
      'Cardiovascular control nuclei',
      'Respiratory rhythm generation (pre-Bötzinger complex)',
      'Nucleus tractus solitarius — receives vagal afferents from heart, lungs, gut',
      'Dorsal motor nucleus of the vagus — origin of parasympathetic output',
      'Decussation of the corticospinal tract (motor crossover)',
    ],
    connects: ['pons', 'spinal-cord', 'vagus-nerve'],
    essay: 'medulla',
  },
  {
    id: 'reticular-formation',
    name: 'Reticular Formation',
    category: 'brainstem',
    color: '#574d36',
    // diffuse network running through the brainstem — marker dot
    position: [0, -0.55, -0.1],
    scale: [0.06, 0.5, 0.06],
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
    color: '#d9c3a3',
    meshNode: 'cerebellum',
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

  // ---------- WHITE-MATTER SHELLS ----------
  {
    id: 'cerebrum-shell-left',
    name: 'Left Cerebral Hemisphere',
    category: 'cortex',
    color: '#f0e6d4',
    meshNode: 'white-matter-left',
    summary:
      'White matter of the left cerebral hemisphere — the bulk of the cerebrum, beneath the gray cortical ribbon.',
    functions: [
      'Massive bundle of myelinated axons connecting cortex to itself, to subcortical structures, and to the spinal cord',
    ],
    connects: ['corpus-callosum'],
  },
  {
    id: 'cerebrum-shell-right',
    name: 'Right Cerebral Hemisphere',
    category: 'cortex',
    color: '#f0e6d4',
    meshNode: 'white-matter-right',
    summary:
      'White matter of the right cerebral hemisphere — the bulk of the cerebrum, beneath the gray cortical ribbon.',
    functions: [
      'Massive bundle of myelinated axons connecting cortex to itself, to subcortical structures, and to the spinal cord',
    ],
    connects: ['corpus-callosum'],
  },

  // ---------- CRANIAL NERVES ----------
  // The vagus is the longest and most consequential; it kept its short
  // canonical id ('vagus-nerve') for the many essays that link to it.
  // The other eleven cranial nerves are listed alongside with the 'cn#-'
  // prefix and share the same `nerveId` mechanism for procedural tube rendering.
  {
    id: 'cn1-olfactory',
    name: 'Olfactory Nerve (CN I)',
    shortName: 'CN I — Olfactory',
    category: 'cranial-nerve',
    color: '#d8a3ce',
    nerveId: 'cn1-olfactory',
    summary:
      'The shortest cranial nerve. Carries smell from the nasal mucosa to the olfactory bulbs — the only sensory pathway that does not relay through the thalamus.',
    functions: [
      'Sense of smell',
      'Direct projection from periphery to forebrain (no thalamic relay)',
      'Closely tied to memory and emotion via direct connections to limbic structures',
    ],
    connects: ['hippocampus', 'amygdala'],
  },
  {
    id: 'cn2-optic',
    name: 'Optic Nerve (CN II)',
    shortName: 'CN II — Optic',
    category: 'cranial-nerve',
    color: '#e8b04a',
    nerveId: 'cn2-optic',
    summary:
      'About a million axons carrying vision from the retina to the brain. Fibers from the nasal half of each retina cross at the optic chiasm so the left visual world ends up entirely in the right hemisphere.',
    functions: [
      'Vision: retinal ganglion cells to LGN of the thalamus',
      'Crossing at the optic chiasm splits visual fields between hemispheres',
      'Drives pupillary reflexes via the pretectal nucleus',
    ],
    connects: ['thalamus', 'occipital-lobe'],
  },
  {
    id: 'cn3-oculomotor',
    name: 'Oculomotor Nerve (CN III)',
    shortName: 'CN III — Oculomotor',
    category: 'cranial-nerve',
    color: '#e89aa3',
    nerveId: 'cn3-oculomotor',
    summary:
      'Emerges from the front of the midbrain and runs forward to the eye. Drives most of the muscles that move the eyeball plus the muscle that lifts the upper lid, and the parasympathetic fibers that constrict the pupil.',
    functions: [
      'Movement of four of the six extraocular muscles',
      'Elevation of the upper eyelid (levator palpebrae)',
      'Parasympathetic pupil constriction and lens accommodation',
    ],
    connects: ['midbrain'],
  },
  {
    id: 'cn4-trochlear',
    name: 'Trochlear Nerve (CN IV)',
    shortName: 'CN IV — Trochlear',
    category: 'cranial-nerve',
    color: '#c47480',
    nerveId: 'cn4-trochlear',
    summary:
      'The smallest cranial nerve and the only one to emerge from the back of the brainstem. Wraps around the midbrain and innervates a single eye muscle, the superior oblique.',
    functions: [
      'Innervates the superior oblique muscle of the eye',
      'Causes downward and inward rotation of the eye',
    ],
    connects: ['midbrain'],
  },
  {
    id: 'cn5-trigeminal',
    name: 'Trigeminal Nerve (CN V)',
    shortName: 'CN V — Trigeminal',
    category: 'cranial-nerve',
    color: '#b8956b',
    nerveId: 'cn5-trigeminal',
    summary:
      'The largest cranial nerve. Carries sensation from almost the entire face and motor control of the muscles of chewing. Three divisions — ophthalmic, maxillary, mandibular — fan out toward forehead, cheek, and jaw.',
    functions: [
      'Sensation from face, scalp, cornea, oral cavity',
      'Motor control of the muscles of mastication',
      'Substrate of trigeminal neuralgia — one of the most intense pains known',
    ],
    connects: ['pons', 'thalamus'],
  },
  {
    id: 'cn6-abducens',
    name: 'Abducens Nerve (CN VI)',
    shortName: 'CN VI — Abducens',
    category: 'cranial-nerve',
    color: '#e89aa3',
    nerveId: 'cn6-abducens',
    summary:
      'Emerges near the midline at the pontomedullary junction and runs forward to a single muscle: the lateral rectus, which abducts the eye.',
    functions: [
      'Innervates the lateral rectus muscle',
      'Abduction of the eye (turning it outward)',
      'Particularly vulnerable to raised intracranial pressure',
    ],
    connects: ['pons'],
  },
  {
    id: 'cn7-facial',
    name: 'Facial Nerve (CN VII)',
    shortName: 'CN VII — Facial',
    category: 'cranial-nerve',
    color: '#e89c70',
    nerveId: 'cn7-facial',
    summary:
      "Motor control of the muscles of facial expression, plus taste from the front of the tongue and parasympathetic fibers to salivary and lacrimal glands. When it fails on one side, half the face droops — Bell's palsy.",
    functions: [
      'Motor: muscles of facial expression',
      'Taste from the anterior two-thirds of the tongue',
      'Parasympathetic to lacrimal and salivary glands',
      'Stapedius muscle (dampens loud sounds in the inner ear)',
    ],
    connects: ['pons'],
  },
  {
    id: 'cn8-vestibulocochlear',
    name: 'Vestibulocochlear Nerve (CN VIII)',
    shortName: 'CN VIII — Vestibulocochlear',
    category: 'cranial-nerve',
    color: '#4f8a8b',
    nerveId: 'cn8-vestibulocochlear',
    summary:
      'Two nerves traveling together. The cochlear branch carries hearing from the cochlea. The vestibular branch carries balance from the semicircular canals — your sense of head position and motion.',
    functions: [
      'Hearing (cochlear division)',
      'Balance and head position (vestibular division)',
      'Damage produces deafness, tinnitus, vertigo',
    ],
    connects: ['pons', 'cerebellum', 'temporal-lobe'],
  },
  {
    id: 'cn9-glossopharyngeal',
    name: 'Glossopharyngeal Nerve (CN IX)',
    shortName: 'CN IX — Glossopharyngeal',
    category: 'cranial-nerve',
    color: '#7a9461',
    nerveId: 'cn9-glossopharyngeal',
    summary:
      'Motor to one swallowing muscle, sensation from the back of the tongue and pharynx, taste from the posterior third of the tongue, and parasympathetic to the parotid gland. Also carries carotid baroreceptor signals.',
    functions: [
      'Taste from the posterior third of the tongue',
      'Sensation from pharynx (afferent limb of the gag reflex)',
      'Parasympathetic to parotid salivary gland',
      'Carotid baroreceptors and chemoreceptors',
    ],
    connects: ['medulla'],
  },
  {
    id: 'vagus-nerve',
    name: 'Vagus Nerve (CN X)',
    shortName: 'CN X — Vagus',
    category: 'cranial-nerve',
    color: '#7a9461',
    nerveId: 'cn10-vagus',
    summary:
      'The wanderer. Tenth cranial nerve. ~80% of its fibers carry information up from the body — heart, lungs, gut — to the brainstem. Workhorse of the parasympathetic nervous system.',
    functions: [
      'Parasympathetic supply to heart, lungs, larynx, stomach, liver, pancreas, intestines',
      'Carries gut and visceral sensation up to the brainstem',
      'Slows the heart (cardiac brake) — basis of heart-rate variability',
      'Major substrate of the gut–brain axis',
      'Target of vagus-nerve stimulation in depression and epilepsy',
    ],
    connects: ['medulla', 'hypothalamus', 'enteric-nervous-system', 'insula'],
    essay: 'vagus-nerve',
  },
  {
    id: 'cn11-accessory',
    name: 'Accessory Nerve (CN XI)',
    shortName: 'CN XI — Accessory',
    category: 'cranial-nerve',
    color: '#c47480',
    nerveId: 'cn11-accessory',
    summary:
      'A pure motor nerve with an unusual origin: fibers from the medulla and the upper cervical spinal cord. Innervates two large neck muscles — sternocleidomastoid and trapezius.',
    functions: [
      'Innervates sternocleidomastoid (turning the head)',
      'Innervates trapezius (shrugging the shoulder)',
    ],
    connects: ['medulla', 'spinal-cord'],
  },
  {
    id: 'cn12-hypoglossal',
    name: 'Hypoglossal Nerve (CN XII)',
    shortName: 'CN XII — Hypoglossal',
    category: 'cranial-nerve',
    color: '#e89aa3',
    nerveId: 'cn12-hypoglossal',
    summary:
      'Motor innervation of the tongue. When it fails on one side, the tongue deviates toward the weak side on protrusion because the strong side pushes harder.',
    functions: [
      'Motor control of all intrinsic and most extrinsic tongue muscles',
      'Essential for speech, chewing, and swallowing',
    ],
    connects: ['medulla'],
  },

  // ---------- SPINAL ----------
  {
    id: 'spinal-cord',
    name: 'Spinal Cord',
    category: 'spinal',
    color: '#cfc7b1',
    position: [0, -2.0, -0.05],
    scale: [0.13, 1.3, 0.13],
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
    position: [0.32, -2.0, -0.05],
    scale: [0.04, 1.2, 0.04],
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
    position: [0, -2.8, 0.1],
    scale: [0.45, 0.3, 0.3],
    summary:
      'A 500-million-neuron mesh embedded in the gut wall. Can run digestion entirely on its own — and talks constantly to the brain via the vagus.',
    functions: [
      'Local control of gut motility, secretion, and blood flow',
      "Produces ~95% of the body's serotonin",
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
