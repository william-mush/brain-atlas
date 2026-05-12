// The compendium — a structured index of entries referenced across the
// awareness wing and the synthesis paper.
//
// Each entry has a stable id, a type, a one-line summary, an evidence tag,
// and optional cross-references to other entries (by id) and to brain
// regions (by region id from lib/regions.ts).
//
// Design note: cross-references are id strings, not nested objects. Lookup
// happens at render time. This keeps the data flat and trivial to author.

export type EvidenceLevel = 'evidenced' | 'suggestive' | 'philosophical';

export type CompendiumType =
  | 'experiment' // a specific study or line of studies
  | 'thinker'    // a researcher, philosopher, or tradition-author
  | 'practice'   // a technique (e.g. nadi shodhana, vipassana)
  | 'term'       // a defined concept (e.g. HRV, spanda, dharana)
  | 'region';    // a pointer-entry to a brain region; the canonical data
                 // lives in lib/regions.ts, this is a compendium handle

export type EightLimb =
  | 'yamas'
  | 'niyamas'
  | 'asana'
  | 'pranayama'
  | 'pratyahara'
  | 'dharana'
  | 'dhyana'
  | 'samadhi';

export const LIMB_LABELS: Record<EightLimb, string> = {
  yamas: 'Yamas',
  niyamas: 'Niyamas',
  asana: 'Āsana',
  pranayama: 'Prāṇāyāma',
  pratyahara: 'Pratyāhāra',
  dharana: 'Dhāraṇā',
  dhyana: 'Dhyāna',
  samadhi: 'Samādhi',
};

export const TYPE_LABELS: Record<CompendiumType, string> = {
  experiment: 'Experiment',
  thinker: 'Thinker',
  practice: 'Practice',
  term: 'Term',
  region: 'Region',
};

export const TYPE_COLORS: Record<CompendiumType, string> = {
  experiment: '#7a9461',  // moss — empirical
  thinker: '#8a6fa3',     // violet — interpretive
  practice: '#e8b04a',    // amber — applied
  term: '#4f8a8b',        // teal — conceptual
  region: '#5a6b7a',      // slate — anatomical pointer
};

export interface CompendiumEntry {
  id: string;
  type: CompendiumType;
  /** Display title — for thinkers, "Last, First"; for terms, the canonical term */
  title: string;
  /** Secondary display — e.g. "Harvard, 2005" for a study, "1947–" for a thinker */
  subtitle?: string;
  /** One paragraph. Direct. The headline claim, not a hedge. */
  summary: string;
  /** Optional longer body — second/third paragraph for entries that earn it */
  body?: string;
  evidence: EvidenceLevel;
  limbs?: EightLimb[];
  /** External source (PubMed, DOI, open-access PDF, archive.org). */
  link?: { href: string; label: string };
  /** Other compendium entry ids — resolved at render time */
  related?: string[];
  /** Region ids from lib/regions.ts — for entries that touch specific anatomy */
  regions?: string[];
}

export const COMPENDIUM: CompendiumEntry[] = [
  // ---------- EXPERIMENTS ----------
  {
    id: 'lazar-2005',
    type: 'experiment',
    title: 'Lazar et al. — Meditation experience and cortical thickness',
    subtitle: 'NeuroReport, 2005',
    summary:
      'First imaging study to show that long-term meditators have measurably thicker cortex in regions associated with interoception and attention, particularly the right anterior insula and prefrontal areas. The effect was largest in the oldest practitioners, suggesting meditation may offset age-related cortical thinning.',
    evidence: 'evidenced',
    limbs: ['pranayama', 'dharana', 'dhyana'],
    link: {
      href: 'https://pubmed.ncbi.nlm.nih.gov/16272874/',
      label: 'PubMed 16272874',
    },
    related: ['farb-interoception', 'insula-as-substrate'],
    regions: ['insula', 'frontal-lobe'],
  },
  {
    id: 'farb-interoception',
    type: 'experiment',
    title: 'Farb et al. — Interoceptive accuracy in meditators',
    subtitle: 'SCAN, 2013',
    summary:
      'Experienced meditators show more accurate detection of their own visceral signals (heartbeat, breath) and stronger insular activation during interoceptive attention. Provides functional evidence that contemplative practice trains the body-sensing pathway, not just the attentional one.',
    evidence: 'evidenced',
    limbs: ['pranayama', 'dhyana'],
    link: {
      href: 'https://pubmed.ncbi.nlm.nih.gov/23071617/',
      label: 'PubMed 23071617',
    },
    related: ['lazar-2005', 'insula-as-substrate', 'interoception'],
    regions: ['insula'],
  },
  {
    id: 'zaccaro-2018',
    type: 'experiment',
    title: 'Zaccaro et al. — Slow breathing systematic review',
    subtitle: 'Frontiers in Human Neuroscience, 2018',
    summary:
      'Systematic review of fifteen studies on slow breathing (~6 breaths/min). Consistent findings: increased heart-rate variability, increased respiratory sinus arrhythmia, parasympathetic dominance, and reports of comfort and alertness. The single most-cited modern synthesis of the autonomic effects of prāṇāyāma-rate breathing.',
    evidence: 'evidenced',
    limbs: ['pranayama'],
    link: {
      href: 'https://www.frontiersin.org/articles/10.3389/fnhum.2018.00353/full',
      label: 'Frontiers, open access',
    },
    related: ['hrv', 'rsa', 'vagal-tone'],
  },
  {
    id: 'bernardi-2001',
    type: 'experiment',
    title: 'Bernardi et al. — Rosary, yoga mantras, and baroreflex',
    subtitle: 'BMJ, 2001',
    summary:
      'Recitation of the Ave Maria rosary and the yoga mantra "om-mani-padme-om" both entrained breathing to roughly six per minute and produced large, synchronized oscillations in blood pressure and heart rate — a marked increase in baroreflex sensitivity. The clearest demonstration that two unrelated contemplative traditions independently converged on the same physiological lever.',
    evidence: 'evidenced',
    limbs: ['pranayama'],
    link: {
      href: 'https://pubmed.ncbi.nlm.nih.gov/15947398/',
      label: 'PubMed 15947398',
    },
    related: ['rsa', 'baroreflex'],
  },
  {
    id: 'brewer-dmn',
    type: 'experiment',
    title: 'Brewer et al. — Default mode quieting in experienced meditators',
    subtitle: 'PNAS, 2011',
    summary:
      'Experienced meditators show reduced activity in the default mode network, particularly the posterior cingulate cortex, during meditation — and the reduction is sustained even at rest. Provides the cleanest neural correlate for the shift from dhāraṇā (effortful attention) to dhyāna (resting in attention).',
    evidence: 'evidenced',
    limbs: ['dhyana', 'samadhi'],
    link: {
      href: 'https://pubmed.ncbi.nlm.nih.gov/22114193/',
      label: 'PubMed 22114193',
    },
    related: ['dmn', 'dharana-term', 'dhyana-term'],
  },
  {
    id: 'josipovic-nondual',
    type: 'experiment',
    title: 'Josipovic — Non-dual awareness and network anti-correlation',
    subtitle: 'Frontiers in Psychology, 2014',
    summary:
      'Imaging of advanced Tibetan Buddhist practitioners during reported "non-dual awareness" states. Found reduced anti-correlation between the default mode and executive networks — the two networks that normally trade off — suggesting the experiential collapse of the inside/outside distinction may have a structural correlate in network coupling.',
    evidence: 'suggestive',
    limbs: ['samadhi'],
    link: {
      href: 'https://www.frontiersin.org/articles/10.3389/fpsyg.2014.01477/full',
      label: 'Frontiers, open access',
    },
    related: ['dmn', 'samadhi-as-dissolution', 'spanda'],
  },
  {
    id: 'grossman-2023',
    type: 'experiment',
    title: 'Grossman — Critique of polyvagal theory',
    subtitle: 'Frontiers in Psychology, 2023',
    summary:
      'A pointed critique of several core evolutionary and anatomical claims in Porges\' polyvagal theory. Argues that the framework has outpaced its evidence and that the clinical phenomena it explains can be accounted for by simpler autonomic models. Required reading for anyone citing polyvagal claims uncritically.',
    evidence: 'evidenced',
    limbs: ['pranayama'],
    link: {
      href: 'https://www.frontiersin.org/articles/10.3389/fpsyg.2022.871227/full',
      label: 'Frontiers, open access',
    },
    related: ['porges', 'polyvagal-theory'],
  },

  // ---------- THINKERS ----------
  {
    id: 'patanjali',
    type: 'thinker',
    title: 'Patañjali',
    subtitle: 'fl. ~400 BCE',
    summary:
      'Compiler of the Yoga Sūtras, the foundational text of classical yoga. The Sūtras describe the eightfold path (aṣṭāṅga) and the practice of stilling the fluctuations of mind. Patañjali is a dualist working within the Samkhya school: puruṣa (consciousness) and prakṛti (matter) are distinct, and liberation is the recognition of that distinction.',
    evidence: 'philosophical',
    related: ['samkhya', 'yoga-sutras', 'shankara', 'abhinavagupta'],
  },
  {
    id: 'shankara',
    type: 'thinker',
    title: 'Ādi Śaṅkara',
    subtitle: 'c. 788–820 CE',
    summary:
      'Foundational systematizer of Advaita Vedānta. Argued that Brahman (ultimate reality) and ātman (the self) are identical, and that the apparent multiplicity of the world is māyā — illusion arising from ignorance. The path is via negativa: not this, not this. Awareness alone is real.',
    evidence: 'philosophical',
    related: ['advaita-vedanta', 'sakshi'],
  },
  {
    id: 'abhinavagupta',
    type: 'thinker',
    title: 'Abhinavagupta',
    subtitle: 'c. 950–1016 CE',
    summary:
      'The great synthesizer of Kashmir Shaivism. Where Advaita says the self is illusion to be dissolved, Abhinavagupta says the self is a recognition-event (pratyabhijñā) — consciousness recognizing itself in everything that appears. His framework introduces spanda, the subtle pulsation by which awareness manifests as world. A non-dualism that affirms experience rather than negating it.',
    evidence: 'philosophical',
    related: ['kashmir-shaivism', 'spanda', 'pratyabhijna'],
  },
  {
    id: 'porges',
    type: 'thinker',
    title: 'Stephen Porges',
    subtitle: '1945–',
    summary:
      'Psychophysiologist and originator of polyvagal theory, the framework that distinguishes a ventral vagal complex (safety, social engagement) from a dorsal vagal complex (shutdown), with the sympathetic system between them. Widely adopted in somatic and trauma-informed practice; partly contested in comparative anatomy.',
    evidence: 'suggestive',
    related: ['polyvagal-theory', 'grossman-2023'],
  },
  {
    id: 'damasio',
    type: 'thinker',
    title: 'Antonio Damasio',
    subtitle: '1944–',
    summary:
      'Neurologist and theorist of the body\'s role in conscious experience. The somatic marker hypothesis proposes that emotional bodily states act as fast guides to decision-making, often below the threshold of explicit awareness. The body is not downstream of the mind; the mind is partly constituted by the body\'s ongoing state.',
    evidence: 'evidenced',
    related: ['interoception', 'somatic-marker'],
  },

  // ---------- TERMS ----------
  {
    id: 'yoga-sutras',
    type: 'term',
    title: 'Yoga Sūtras',
    summary:
      'Patañjali\'s foundational text, ~196 aphorisms compiled around 400 BCE. The second sūtra defines yoga as the stilling of the fluctuations of mind (citta-vṛtti-nirodhaḥ). The text lays out the eightfold path and the structure of contemplative attainment. Concise to the point of opacity in places; commentaries (Vyāsa\'s especially) are how it is traditionally read.',
    evidence: 'philosophical',
    related: ['patanjali', 'samkhya'],
  },
  {
    id: 'samkhya',
    type: 'term',
    title: 'Sāṃkhya',
    summary:
      'One of the six orthodox schools of Indian philosophy, and the metaphysical frame within which Patañjali works. Dualist: puruṣa (pure consciousness, plural and inactive) and prakṛti (the active, manifesting principle that produces mind, body, world) are distinct. Liberation is the discriminative recognition (viveka) of puruṣa as separate from prakṛti.',
    evidence: 'philosophical',
    related: ['patanjali', 'yoga-sutras', 'advaita-vedanta'],
  },
  {
    id: 'interoception',
    type: 'term',
    title: 'Interoception',
    summary:
      'The sense of the internal state of the body — heartbeat, breath, gut tension, temperature, fullness. Carried up from the body largely by the vagus nerve, processed in the nucleus tractus solitarius and parabrachial nucleus, and represented cortically in the insula and anterior cingulate. The substrate of what contemplative traditions call the felt sense or the subtle body.',
    evidence: 'evidenced',
    limbs: ['asana', 'pranayama'],
    related: ['insula-as-substrate', 'damasio', 'farb-interoception'],
    regions: ['insula', 'anterior-cingulate'],
  },
  {
    id: 'hrv',
    type: 'term',
    title: 'Heart Rate Variability (HRV)',
    summary:
      'The beat-to-beat variation in heart rate. High HRV indicates strong parasympathetic (vagal) influence and is associated with better emotional regulation, recovery, and long-term cardiovascular health. Slow breathing reliably raises HRV — the single cleanest physiological effect of prāṇāyāma-rate breathing.',
    evidence: 'evidenced',
    limbs: ['pranayama'],
    related: ['rsa', 'vagal-tone', 'zaccaro-2018'],
  },
  {
    id: 'rsa',
    type: 'term',
    title: 'Respiratory Sinus Arrhythmia (RSA)',
    summary:
      'The natural acceleration of heart rate on the inbreath and deceleration on the outbreath, mediated by the vagus. Slow breathing amplifies RSA into large, regular oscillations — the physiological signature of breath-heart coupling that underlies the relaxation effect of contemplative breathing.',
    evidence: 'evidenced',
    limbs: ['pranayama'],
    related: ['hrv', 'baroreflex', 'vagal-tone'],
  },
  {
    id: 'baroreflex',
    type: 'term',
    title: 'Baroreflex sensitivity',
    summary:
      'The speed and depth of the body\'s automatic blood-pressure regulation. Slow breathing synchronizes blood-pressure oscillations with breath, amplifying baroreflex sensitivity. Bernardi showed that yoga mantras and the rosary independently entrain breathing to roughly the resonance frequency where this effect is maximal.',
    evidence: 'evidenced',
    limbs: ['pranayama'],
    related: ['bernardi-2001', 'rsa', 'hrv'],
  },
  {
    id: 'vagal-tone',
    type: 'term',
    title: 'Vagal tone',
    summary:
      'The degree of parasympathetic influence carried by the vagus nerve. Higher vagal tone correlates with better emotional regulation, recovery from stress, and inflammatory control. Slow breathing, meditation, and certain yoga practices reliably raise it, often within minutes.',
    evidence: 'evidenced',
    limbs: ['pranayama'],
    related: ['hrv', 'rsa', 'polyvagal-theory'],
  },
  {
    id: 'dmn',
    type: 'term',
    title: 'Default Mode Network (DMN)',
    summary:
      'The network of brain regions — medial prefrontal cortex, posterior cingulate, inferior parietal lobule — active during self-referential thought, mind-wandering, and remembering. Quiets in experienced meditators and shifts in coupling during reported non-dual states. The closest neural correlate of the constructed sense of self.',
    evidence: 'evidenced',
    limbs: ['dhyana', 'samadhi'],
    related: ['brewer-dmn', 'josipovic-nondual', 'samadhi-as-dissolution'],
    regions: ['frontal-lobe', 'parietal-lobe'],
  },
  {
    id: 'spanda',
    type: 'term',
    title: 'Spanda',
    summary:
      'In Kashmir Shaivism, the subtle pulsation or vibration by which awareness manifests as world. Not literal motion — a structural feature of consciousness itself. The Shaivite move is to say that awareness is not still; it pulses, and the world is its pulsing. An interesting resonance, but no more than that, with neural oscillation work.',
    evidence: 'philosophical',
    related: ['abhinavagupta', 'kashmir-shaivism', 'pratyabhijna'],
  },
  {
    id: 'pratyabhijna',
    type: 'term',
    title: 'Pratyabhijñā — recognition',
    summary:
      'The central Shaivite term: the moment in which awareness recognizes itself in what appears. Where Advaita says the self is to be negated, Shaivism says the self is to be recognized. The recognition is not a learning of new content but a re-cognition of what was already the case.',
    evidence: 'philosophical',
    related: ['abhinavagupta', 'spanda', 'sakshi'],
  },
  {
    id: 'sakshi',
    type: 'term',
    title: 'Sākṣī — the witness',
    summary:
      'In Advaita Vedānta, the witness: that which is aware of states without being a state. Not a region, not a content, not even a process. Closer to the hard problem of consciousness than to any neuroanatomical claim.',
    evidence: 'philosophical',
    related: ['shankara', 'advaita-vedanta'],
  },
  {
    id: 'advaita-vedanta',
    type: 'term',
    title: 'Advaita Vedānta',
    summary:
      'The non-dualist school systematized by Śaṅkara. Brahman and ātman are identical; the apparent multiplicity of the world is māyā. The path is via negativa — not this, not this — until only awareness remains. Makes a structural prediction that contemplative practice should dissolve the apparent self.',
    evidence: 'philosophical',
    related: ['shankara', 'sakshi', 'kashmir-shaivism'],
  },
  {
    id: 'kashmir-shaivism',
    type: 'term',
    title: 'Kashmir Shaivism',
    summary:
      'The non-dualist school synthesized by Abhinavagupta. Awareness is real, dynamic, and self-recognizing; the world is its self-expression (spanda). Differs from Advaita not in whether non-duality holds but in whether the apparent self is illusion (Advaita) or recognition (Shaivism). The Shaivite framing is more consistent with the neuroscience of self-as-network.',
    evidence: 'philosophical',
    related: ['abhinavagupta', 'spanda', 'pratyabhijna', 'advaita-vedanta'],
  },
  {
    id: 'polyvagal-theory',
    type: 'term',
    title: 'Polyvagal theory',
    summary:
      'Porges\' framework distinguishing a ventral vagal complex (safety, social engagement), a dorsal vagal complex (shutdown), and the sympathetic system between them. Widely useful clinically; partly contested in its evolutionary anatomy claims. Hold the vocabulary loosely.',
    evidence: 'suggestive',
    related: ['porges', 'grossman-2023', 'vagal-tone'],
  },
  {
    id: 'somatic-marker',
    type: 'term',
    title: 'Somatic marker hypothesis',
    summary:
      'Damasio\'s proposal that bodily emotional states act as fast, often non-conscious guides to decision-making. The body anticipates the consequences of choices through felt signals, and the conscious mind catches up afterward.',
    evidence: 'suggestive',
    related: ['damasio', 'interoception'],
  },
  {
    id: 'insula-as-substrate',
    type: 'term',
    title: 'Insula as substrate of self-feeling',
    summary:
      'The insula — particularly the right anterior insula — represents the body\'s state cortically and is consistently implicated in the felt sense of being a self located in a body. Long-term meditators show structural thickening here; people with insular damage show altered interoception and altered emotional life.',
    evidence: 'evidenced',
    related: ['interoception', 'lazar-2005', 'farb-interoception'],
    regions: ['insula'],
  },
  {
    id: 'samadhi-as-dissolution',
    type: 'term',
    title: 'Samādhi as network dissolution',
    summary:
      'The strongest defensible claim about samādhi from current neuroscience: deep contemplative states are characterized by reduced activity in the networks that normally construct the located self (default mode), and reduced anti-correlation between networks that normally trade off. Network dissolution, not network activation.',
    evidence: 'suggestive',
    limbs: ['samadhi'],
    related: ['dmn', 'brewer-dmn', 'josipovic-nondual'],
  },

  // ---------- PRACTICES ----------
  {
    id: 'nadi-shodhana',
    type: 'practice',
    title: 'Nāḍī Śodhana — alternate-nostril breathing',
    summary:
      'Slow, alternating-nostril breathing at roughly six breaths per minute. Traditionally described as balancing the iḍā and piṅgalā nāḍīs; physiologically, it produces the same parasympathetic dominance, HRV increase, and baroreflex amplification as other slow-breathing practices. The cleanest entry-level prāṇāyāma technique.',
    evidence: 'evidenced',
    limbs: ['pranayama'],
    related: ['hrv', 'rsa', 'vagal-tone'],
  },
  {
    id: 'ujjayi',
    type: 'practice',
    title: 'Ujjāyī — victorious breath',
    summary:
      'The slightly-constricted-throat breathing used throughout Ashtanga and many other vinyasa traditions. The audible quality serves as biofeedback: the breath becomes its own metronome. Likely increases vagal afferent signaling via slow, deep, resistance-loaded inhalation, though direct evidence is limited.',
    evidence: 'suggestive',
    limbs: ['asana', 'pranayama'],
    related: ['vagal-tone', 'interoception'],
  },
  {
    id: 'trataka',
    type: 'practice',
    title: 'Trāṭaka — fixed gaze',
    summary:
      'Sustained, unblinking gaze at a single point (a candle flame, traditionally). A classical dhāraṇā preparation. The cognitive demand is sustained selective attention — the function of the dorsolateral prefrontal cortex and the executive control network.',
    evidence: 'suggestive',
    limbs: ['dharana'],
    related: ['dharana-term'],
  },

  // ---------- TERMS: limb-specific ----------
  {
    id: 'dharana-term',
    type: 'term',
    title: 'Dhāraṇā — one-pointedness',
    summary:
      'The sixth limb. Sustained selective attention on a single object — breath, mantra, image. Maps onto the executive control network and the dorsolateral prefrontal cortex. The most "Western" of the limbs in that modern cognitive science of attention has independently identified its substrate.',
    evidence: 'evidenced',
    limbs: ['dharana'],
    related: ['dmn', 'trataka', 'lazar-2005'],
    regions: ['frontal-lobe'],
  },
  {
    id: 'dhyana-term',
    type: 'term',
    title: 'Dhyāna — meditation',
    summary:
      'The seventh limb. The shift from holding attention (dhāraṇā) to resting in it. Marked by decreased default mode activity and reduced effortful engagement of executive cortex. The muscle stops needing to work.',
    evidence: 'evidenced',
    limbs: ['dhyana'],
    related: ['dharana-term', 'brewer-dmn', 'dmn'],
  },
];

// ---------- LOOKUPS ----------

const BY_ID = new Map<string, CompendiumEntry>(
  COMPENDIUM.map((e) => [e.id, e])
);

export function getEntry(id: string): CompendiumEntry | undefined {
  return BY_ID.get(id);
}

export function entriesByType(type: CompendiumType): CompendiumEntry[] {
  return COMPENDIUM.filter((e) => e.type === type);
}

export function entriesByLimb(limb: EightLimb): CompendiumEntry[] {
  return COMPENDIUM.filter((e) => e.limbs?.includes(limb));
}

export function entriesByEvidence(level: EvidenceLevel): CompendiumEntry[] {
  return COMPENDIUM.filter((e) => e.evidence === level);
}
