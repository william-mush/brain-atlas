// Glossary of non-English terms used across the awareness wing.
//
// Each entry has: the term in its native script form (or transliteration with
// proper diacritics), a short English gloss, the source tradition, an optional
// longer description, and an optional href that links to where the term gets
// fuller treatment elsewhere in the wing.

export type Tradition =
  | 'sanskrit-yoga'
  | 'sanskrit-buddhism'
  | 'pali-buddhism'
  | 'tibetan-buddhism'
  | 'kashmir-shaivism'
  | 'daoism'
  | 'sufism';

export const TRADITION_LABELS: Record<Tradition, string> = {
  'sanskrit-yoga': 'Sanskrit — Yoga',
  'sanskrit-buddhism': 'Sanskrit — Buddhism',
  'pali-buddhism': 'Pāli — Theravāda Buddhism',
  'tibetan-buddhism': 'Tibetan — Vajrayāna Buddhism',
  'kashmir-shaivism': 'Sanskrit — Kashmir Shaivism',
  'daoism': 'Chinese — Daoism',
  'sufism': 'Arabic — Sufism',
};

export interface GlossaryEntry {
  /** The term with proper diacritics, as it appears in prose. */
  term: string;
  /** One-line gloss for quick scanning. */
  gloss: string;
  /** Source tradition or language. */
  tradition: Tradition;
  /** Optional paragraph-length description. */
  description?: string;
  /** Optional internal href where the term is treated more fully. */
  href?: string;
  /** Optional alternative transliterations or related forms. */
  alsoSeen?: string[];
}

export const GLOSSARY: GlossaryEntry[] = [
  // ============================================================
  // SANSKRIT — YOGA (Patañjali's Yoga Sūtras and broader yogic vocabulary)
  // ============================================================

  // The eight limbs
  {
    term: 'aṣṭāṅga',
    gloss: 'the eight-limbed path',
    tradition: 'sanskrit-yoga',
    description:
      'Literally "eight (aṣṭa) limbs (aṅga)." The framework laid out in Yoga Sūtras 2.29: yamas, niyamas, āsana, prāṇāyāma, pratyāhāra, dhāraṇā, dhyāna, samādhi.',
    href: '/awareness',
  },
  {
    term: 'yamas',
    gloss: 'ethical restraints (the first limb)',
    tradition: 'sanskrit-yoga',
    href: '/awareness/yamas',
  },
  {
    term: 'niyamas',
    gloss: 'observances (the second limb)',
    tradition: 'sanskrit-yoga',
    href: '/awareness/niyamas',
  },
  {
    term: 'āsana',
    gloss: 'posture, seat (the third limb)',
    tradition: 'sanskrit-yoga',
    description:
      'In Patañjali, defined narrowly as "the seat should be steady and comfortable" (sthira-sukham āsanam, YS 2.46). Modern yoga has expanded the term to refer to the full system of postures.',
    href: '/awareness/asana',
  },
  {
    term: 'prāṇāyāma',
    gloss: 'breath restraint (the fourth limb)',
    tradition: 'sanskrit-yoga',
    description:
      'Extension or restraint of prāṇa, the breath and the vital force it carries. Includes the three phases recaka (outbreath), pūraka (inbreath), kumbhaka (retention).',
    href: '/awareness/pranayama',
  },
  {
    term: 'pratyāhāra',
    gloss: 'sensory withdrawal (the fifth limb)',
    tradition: 'sanskrit-yoga',
    href: '/awareness/pratyahara',
  },
  {
    term: 'dhāraṇā',
    gloss: 'concentration, one-pointedness (the sixth limb)',
    tradition: 'sanskrit-yoga',
    href: '/awareness/dharana',
  },
  {
    term: 'dhyāna',
    gloss: 'meditation, sustained absorption (the seventh limb)',
    tradition: 'sanskrit-yoga',
    href: '/awareness/dhyana',
  },
  {
    term: 'samādhi',
    gloss: 'absorption, the eighth limb',
    tradition: 'sanskrit-yoga',
    description:
      'The state in which the subject-object distinction thins or dissolves. Patañjali distinguishes samprajñāta (with conceptual content) from asamprajñāta (without), and sabīja (with seed) from nirbīja (without).',
    href: '/awareness/samadhi',
  },

  // The five yamas
  {
    term: 'ahiṃsā',
    gloss: 'non-harming',
    tradition: 'sanskrit-yoga',
    description:
      'The first yama. Negation of hiṃsā (harm). Read structurally, it names the cognitive load of sustained threat-monitoring.',
    href: '/awareness/yamas',
  },
  {
    term: 'satya',
    gloss: 'truthfulness',
    tradition: 'sanskrit-yoga',
    description:
      'The second yama. Read structurally, it names the cognitive load of maintaining two parallel models of reality.',
    href: '/awareness/yamas',
  },
  {
    term: 'asteya',
    gloss: 'non-stealing',
    tradition: 'sanskrit-yoga',
    description:
      'The third yama. Read structurally, it names the cognitive load of distributional anxiety — experiencing the world as adversarial-distributional.',
    href: '/awareness/yamas',
  },
  {
    term: 'brahmacarya',
    gloss: 'sensory restraint',
    tradition: 'sanskrit-yoga',
    description:
      'The fourth yama. Historically translated as celibacy; structurally, the cultivated capacity to not be governed by the pursuit of sensory pleasure.',
    href: '/awareness/yamas',
  },
  {
    term: 'aparigraha',
    gloss: 'non-grasping',
    tradition: 'sanskrit-yoga',
    description:
      'The fifth yama. Read structurally, it names the cognitive load of chronic craving — the brain in a state of low-grade pursuit.',
    href: '/awareness/yamas',
  },

  // The five niyamas
  {
    term: 'śauca',
    gloss: 'purity',
    tradition: 'sanskrit-yoga',
    description:
      'The first niyama. Bodily and mental cleanliness as reduction of background interoceptive noise.',
    href: '/awareness/niyamas',
  },
  {
    term: 'santoṣa',
    gloss: 'contentment',
    tradition: 'sanskrit-yoga',
    description:
      'The second niyama. The cultivated capacity to be at peace with current conditions without that peace depending on conditions being any particular way.',
    href: '/awareness/niyamas',
  },
  {
    term: 'tapas',
    gloss: 'disciplined effort, literally "heat"',
    tradition: 'sanskrit-yoga',
    description:
      'The third niyama. The willingness to apply oneself to the practice when the practice is uncomfortable.',
    href: '/awareness/niyamas',
  },
  {
    term: 'svādhyāya',
    gloss: 'self-study',
    tradition: 'sanskrit-yoga',
    description:
      'The fourth niyama. Traditionally both study of sacred texts and study of oneself; modern readings emphasize the metacognitive cultivation.',
    href: '/awareness/niyamas',
  },
  {
    term: 'īśvara-praṇidhāna',
    gloss: 'surrender to the divine',
    tradition: 'sanskrit-yoga',
    description:
      'The fifth niyama. The cultivated relinquishment of the felt sense of being the manager of one\'s own life.',
    href: '/awareness/niyamas',
  },

  // Other yogic / Sāṃkhya terms
  {
    term: 'citta',
    gloss: 'mind-stuff, mental substance',
    tradition: 'sanskrit-yoga',
    description:
      'The mental field that the practice works on. Yoga Sūtras 1.2 defines yoga as citta-vṛtti-nirodhaḥ — "the stilling of the fluctuations of citta."',
  },
  {
    term: 'vṛtti',
    gloss: 'fluctuation, modification of mind',
    tradition: 'sanskrit-yoga',
  },
  {
    term: 'prāṇa',
    gloss: 'breath, vital force',
    tradition: 'sanskrit-yoga',
  },
  {
    term: 'nāḍī',
    gloss: 'channel of subtle energy',
    tradition: 'sanskrit-yoga',
    description:
      'The traditional system of subtle-body channels. Not anatomical structures; usefully read as a phenomenological map of where in the body felt qualities of attention seem to be located.',
    alsoSeen: ['nāḍīs', 'iḍā', 'piṅgalā', 'suṣumnā'],
  },
  {
    term: 'cakra',
    gloss: 'wheel, center of subtle energy',
    tradition: 'sanskrit-yoga',
    description:
      'Centers along the central nāḍī (suṣumnā) where the subtle body\'s energy concentrates. As with nāḍīs, anatomically wrong as literal description, phenomenologically useful as map.',
    alsoSeen: ['cakras', 'chakra'],
  },
  {
    term: 'sūkṣma śarīra',
    gloss: 'the subtle body',
    tradition: 'sanskrit-yoga',
  },
  {
    term: 'puruṣa',
    gloss: 'pure consciousness (Sāṃkhya)',
    tradition: 'sanskrit-yoga',
    description:
      'In Sāṃkhya metaphysics, the principle of pure awareness, plural and inactive. Distinct from prakṛti (the active manifesting principle). Patañjali works within this dualist framework.',
  },
  {
    term: 'prakṛti',
    gloss: 'manifesting nature (Sāṃkhya)',
    tradition: 'sanskrit-yoga',
    description:
      'The active principle in Sāṃkhya, which manifests as mind, body, and world. Distinct from puruṣa.',
  },
  {
    term: 'Sāṃkhya',
    gloss: 'one of the six orthodox schools of Indian philosophy',
    tradition: 'sanskrit-yoga',
    description:
      'The dualist school that provides the metaphysical frame for Patañjali. Distinguishes puruṣa from prakṛti.',
  },
  {
    term: 'viveka',
    gloss: 'discriminative recognition',
    tradition: 'sanskrit-yoga',
    description:
      'The faculty by which puruṣa is recognized as distinct from prakṛti. Liberation in Sāṃkhya/Yoga.',
  },

  // Prāṇāyāma sub-phases
  {
    term: 'recaka',
    gloss: 'outbreath',
    tradition: 'sanskrit-yoga',
  },
  {
    term: 'pūraka',
    gloss: 'inbreath',
    tradition: 'sanskrit-yoga',
  },
  {
    term: 'kumbhaka',
    gloss: 'breath retention',
    tradition: 'sanskrit-yoga',
  },

  // Samādhi sub-classifications
  {
    term: 'samprajñāta',
    gloss: 'samādhi with conceptual content',
    tradition: 'sanskrit-yoga',
  },
  {
    term: 'asamprajñāta',
    gloss: 'samādhi without conceptual content',
    tradition: 'sanskrit-yoga',
  },
  {
    term: 'sabīja',
    gloss: '"with seed" samādhi',
    tradition: 'sanskrit-yoga',
  },
  {
    term: 'nirbīja',
    gloss: '"without seed" samādhi',
    tradition: 'sanskrit-yoga',
  },

  // ============================================================
  // SANSKRIT — ADVAITA VEDĀNTA
  // ============================================================
  {
    term: 'Advaita Vedānta',
    gloss: 'non-dual Vedānta',
    tradition: 'sanskrit-yoga',
    description:
      'The non-dualist school systematized by Ādi Śaṅkara around 800 CE. Holds the identity of brahman and ātman; the apparent multiplicity of the world is māyā.',
    href: '/awareness/advaita-shaivism',
    alsoSeen: ['advaita'],
  },
  {
    term: 'brahman',
    gloss: 'ultimate reality',
    tradition: 'sanskrit-yoga',
  },
  {
    term: 'ātman',
    gloss: 'self, identical with brahman in Advaita',
    tradition: 'sanskrit-yoga',
  },
  {
    term: 'māyā',
    gloss: 'illusion arising from ignorance',
    tradition: 'sanskrit-yoga',
  },
  {
    term: 'avidyā',
    gloss: 'ignorance, lack of knowledge',
    tradition: 'sanskrit-yoga',
  },
  {
    term: 'sākṣī',
    gloss: 'witness — pure awareness in Advaita',
    tradition: 'sanskrit-yoga',
    description:
      'That which is aware of states without being a state. Not a region, not a content. Closer to the hard problem of consciousness than to any neuroanatomical claim.',
    href: '/awareness/advaita-shaivism',
  },
  {
    term: 'neti, neti',
    gloss: '"not this, not this" — the via negativa',
    tradition: 'sanskrit-yoga',
  },

  // ============================================================
  // SANSKRIT — KASHMIR SHAIVISM
  // ============================================================
  {
    term: 'Kashmir Shaivism',
    gloss: 'non-dualist Shaiva tradition',
    tradition: 'kashmir-shaivism',
    description:
      'Synthesized by Abhinavagupta around 1000 CE. Like Advaita, a non-dualism; unlike Advaita, an affirming one — the apparent self is awareness recognizing itself in form.',
    href: '/awareness/advaita-shaivism',
  },
  {
    term: 'pratyabhijñā',
    gloss: 'recognition',
    tradition: 'kashmir-shaivism',
    description:
      'The central Shaivite term: the moment in which awareness recognizes itself in what appears. Not a learning of new content but a re-cognition of what was already the case.',
    href: '/awareness/advaita-shaivism',
  },
  {
    term: 'spanda',
    gloss: 'subtle pulsation of awareness',
    tradition: 'kashmir-shaivism',
    description:
      'The pulsing by which awareness manifests as world. A structural feature of consciousness; not literal motion.',
    href: '/awareness/advaita-shaivism',
  },

  // ============================================================
  // SANSKRIT / PĀLI — BUDDHISM
  // ============================================================
  {
    term: 'Madhyamaka',
    gloss: 'the "Middle Way" school of Mahāyāna Buddhism',
    tradition: 'sanskrit-buddhism',
    description:
      'Founded by Nāgārjuna (~200 CE). Central doctrine: all phenomena are empty (śūnya) of inherent existence (svabhāva). Anti-essentialist, anti-foundationalist.',
    href: '/awareness/east-west',
  },
  {
    term: 'śūnyatā',
    gloss: 'emptiness — lack of inherent existence',
    tradition: 'sanskrit-buddhism',
  },
  {
    term: 'svabhāva',
    gloss: 'inherent existence, own-nature',
    tradition: 'sanskrit-buddhism',
  },
  {
    term: 'Yogācāra',
    gloss: 'the "mind-only" school of Mahāyāna Buddhism',
    tradition: 'sanskrit-buddhism',
    description:
      'Developed by Asaṅga and Vasubandhu in the 4th century CE. Central claim: what we perceive are mental representations rather than mind-independent objects.',
    href: '/awareness/east-west',
    alsoSeen: ['Vijñānavāda', 'Cittamātra'],
  },
  {
    term: 'ālaya-vijñāna',
    gloss: 'storehouse consciousness',
    tradition: 'sanskrit-buddhism',
    description:
      'In Yogācāra, the underlying stream of consciousness that carries karmic seeds from moment to moment. Functionally analogous to implicit-memory systems in cognitive psychology.',
    href: '/awareness/east-west',
  },
  {
    term: 'bīja',
    gloss: 'seed (karmic latency)',
    tradition: 'sanskrit-buddhism',
  },
  {
    term: 'trisvabhāva',
    gloss: 'the three natures doctrine (Yogācāra)',
    tradition: 'sanskrit-buddhism',
  },

  // Theravāda / Pāli
  {
    term: 'Abhidhamma',
    gloss: 'the Theravāda compendium of doctrinal analysis',
    tradition: 'pali-buddhism',
    description:
      'The third basket (Piṭaka) of the Pāli Canon. Contains the most granular phenomenological taxonomy of mind ever produced, including the system of 89 cittas.',
    href: '/awareness/east-west',
  },
  {
    term: 'citta (Pāli)',
    gloss: 'moment of consciousness',
    tradition: 'pali-buddhism',
    description:
      'In Theravāda, the basic unit of mental analysis. 89 distinct cittas are enumerated in the classical scheme, distinguished by their object, their accompanying mental factors (cetasikā), and their ethical quality.',
  },
  {
    term: 'cetasikā',
    gloss: 'mental factors',
    tradition: 'pali-buddhism',
    description:
      'The 52 mental factors that accompany cittas. Combinations of citta and cetasikā produce the granular taxonomy of states.',
  },
  {
    term: 'kusala / akusala / abyākata',
    gloss: 'wholesome / unwholesome / indeterminate',
    tradition: 'pali-buddhism',
  },
  {
    term: 'jhāna',
    gloss: 'deep meditative absorption',
    tradition: 'pali-buddhism',
    description:
      'A series of progressively deeper absorption states, traditionally numbered first through eighth. Functionally similar to Patañjali\'s samādhi sub-classifications.',
    alsoSeen: ['jhānas', 'dhyāna (Sanskrit)'],
  },
  {
    term: 'vipassanā',
    gloss: 'insight meditation',
    tradition: 'pali-buddhism',
    description:
      'The contemplative practice of moment-to-moment observation of mental phenomena, traditionally aimed at insight into the three marks of existence (anicca/anattā/dukkha).',
  },
  {
    term: 'śamatha',
    gloss: 'calm-abiding meditation',
    tradition: 'sanskrit-buddhism',
    description:
      'The cultivation of stable, concentrated attention. Often paired with vipassanā as the two pillars of Buddhist meditation.',
  },

  // ============================================================
  // TIBETAN — DZOGCHEN
  // ============================================================
  {
    term: 'Dzogchen',
    gloss: '"Great Perfection" — the highest of the nine vehicles in Nyingma Buddhism',
    tradition: 'tibetan-buddhism',
    href: '/awareness/east-west',
  },
  {
    term: 'rigpa',
    gloss: 'pure awareness, recognition of the basis',
    tradition: 'tibetan-buddhism',
    description:
      'The central Dzogchen concept. The open, knowing background within which both experiencer and experiences arise. Contrasted with sems (ordinary dualistic mind).',
    href: '/awareness/east-west',
  },
  {
    term: 'sems',
    gloss: 'ordinary mind (citta)',
    tradition: 'tibetan-buddhism',
    description:
      'Dualistic everyday consciousness. The contrast with rigpa is central to Dzogchen practice.',
  },
  {
    term: 'trekchö',
    gloss: '"cutting through" — direct recognition of rigpa',
    tradition: 'tibetan-buddhism',
  },
  {
    term: 'tögal',
    gloss: '"crossing over" — visionary practice in Dzogchen',
    tradition: 'tibetan-buddhism',
  },
  {
    term: 'Mahāmudrā',
    gloss: 'the "Great Seal" tradition (Kagyu Buddhism)',
    tradition: 'tibetan-buddhism',
    description:
      'A meditation tradition with significant overlap with Dzogchen. Both describe contemplative awakening as the recognition of awareness as the open knowing background.',
  },

  // ============================================================
  // CHINESE — DAOISM
  // ============================================================
  {
    term: 'zuòwàng',
    gloss: '"sitting and forgetting" — Daoist contemplative practice',
    tradition: 'daoism',
    description:
      'The Daoist analogue of meditative absorption. Locus classicus in Zhuāngzǐ Chapter 6; formalized in Sīmǎ Chéngzhēn\'s 8th-century Zuòwànglùn.',
    href: '/awareness/east-west',
    alsoSeen: ['坐忘'],
  },
  {
    term: 'wúwéi',
    gloss: '"non-action" or "effortless action"',
    tradition: 'daoism',
    description:
      'The cultivated capacity to act without the forcing that grasping and aversion introduce. Acting from a settled and responsive substrate.',
    alsoSeen: ['無為'],
  },
  {
    term: 'Dao',
    gloss: 'the Way — the underlying nature of reality',
    tradition: 'daoism',
    alsoSeen: ['Tao', '道'],
  },

  // ============================================================
  // ARABIC — SUFISM
  // ============================================================
  {
    term: 'fanāʾ',
    gloss: '"annihilation" — extinction of the self in God',
    tradition: 'sufism',
    description:
      'The Sufi description of contemplative dissolution. Structurally parallel to samādhi: the apparent self drops away.',
    href: '/awareness/east-west',
  },
  {
    term: 'baqāʾ',
    gloss: '"subsistence" — return to functioning after fanāʾ',
    tradition: 'sufism',
    description:
      'The return to ordinary life after the annihilation experience, with the recognition that the apparent self was always a transient configuration.',
  },
];

// ---------- LOOKUPS ----------

export function entriesByTradition(t: Tradition): GlossaryEntry[] {
  return GLOSSARY.filter((e) => e.tradition === t);
}

export const TRADITION_ORDER: Tradition[] = [
  'sanskrit-yoga',
  'sanskrit-buddhism',
  'pali-buddhism',
  'tibetan-buddhism',
  'kashmir-shaivism',
  'daoism',
  'sufism',
];
