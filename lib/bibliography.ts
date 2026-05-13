// The bibliography. Every paper or book cited anywhere in the awareness
// wing has an entry here, keyed by a short id (typically lastname-year).
//
// The <Cite> component looks up by id and renders an inline citation with
// hover/tap-to-expand. The /awareness/bibliography page renders the full
// list. Tests validate that every <Cite id="..."> in the MDX corresponds
// to a real entry — broken citations cannot reach a deploy.

export type WorkType = 'paper' | 'book' | 'chapter' | 'preprint' | 'sutra';

export interface BiblioEntry {
  id: string;
  type: WorkType;
  /** "Smith JA, Jones B" — APA-ish short form. Use "et al." for >3 authors. */
  authors: string;
  year: number | string; // string allows "c. 400 BCE" for sutras
  /** Paper or book title. Italicize at render time for books. */
  title: string;
  /** Journal (for papers) or publisher (for books). */
  venue?: string;
  volume?: string;
  pages?: string;
  doi?: string;
  url?: string;
  /** Editorial note explaining why this entry matters. ~1-3 sentences. */
  note?: string;
  /** Optional verbatim quotation we cite in prose. */
  quote?: string;
}

export const BIBLIOGRAPHY: BiblioEntry[] = [
  // ---------- FOUNDATIONAL PHILOSOPHY OF MIND ----------
  {
    id: 'nagel-1974',
    type: 'paper',
    authors: 'Nagel T',
    year: 1974,
    title: 'What Is It Like to Be a Bat?',
    venue: 'The Philosophical Review',
    volume: '83 (4)',
    pages: '435–450',
    doi: '10.2307/2183914',
    url: 'https://www.jstor.org/stable/2183914',
    note: 'The paper that crystallized the modern problem of subjective experience. Nagel argues that no amount of objective description of bat physiology will tell you what it is like, from the inside, to echolocate. The phrase "what it is like" enters the philosophical lexicon and never leaves.',
    quote:
      'fundamentally an organism has conscious mental states if and only if there is something that it is like to be that organism — something it is like for the organism.',
  },
  {
    id: 'chalmers-1995',
    type: 'paper',
    authors: 'Chalmers DJ',
    year: 1995,
    title: 'Facing Up to the Problem of Consciousness',
    venue: 'Journal of Consciousness Studies',
    volume: '2 (3)',
    pages: '200–219',
    url: 'https://consc.net/papers/facing.html',
    note: 'Introduces the "hard problem" framing: explaining why there is subjective experience at all, as distinct from the easy problems of explaining specific cognitive functions. Two decades later, the hard problem is exactly as hard as Chalmers said it was.',
  },
  {
    id: 'block-1995',
    type: 'paper',
    authors: 'Block N',
    year: 1995,
    title: 'On a Confusion about a Function of Consciousness',
    venue: 'Behavioral and Brain Sciences',
    volume: '18 (2)',
    pages: '227–247',
    doi: '10.1017/S0140525X00038188',
    note: 'Introduces the distinction between phenomenal consciousness (P-consciousness — the felt qualities) and access consciousness (A-consciousness — availability for reasoning and report). The most important conceptual distinction in 30 years of consciousness science; under-applied in contemplative neuroscience.',
  },
  {
    id: 'metzinger-2003',
    type: 'book',
    authors: 'Metzinger T',
    year: 2003,
    title: 'Being No One: The Self-Model Theory of Subjectivity',
    venue: 'MIT Press',
    note: 'Argues that the self is a model the brain runs, not a thing the brain has. Directly relevant to samādhi: if the self is a model, then deep meditation might be the model temporarily relaxing its grip.',
  },

  // ---------- GLOBAL WORKSPACE & ACCESS THEORIES ----------
  {
    id: 'baars-1988',
    type: 'book',
    authors: 'Baars BJ',
    year: 1988,
    title: 'A Cognitive Theory of Consciousness',
    venue: 'Cambridge University Press',
    note: 'The original Global Workspace formulation. Consciousness as a "theatre" in which winning content is broadcast widely. The framework that dominates the empirical literature on consciousness, for better and for worse.',
  },
  {
    id: 'dehaene-2014',
    type: 'book',
    authors: 'Dehaene S',
    year: 2014,
    title: 'Consciousness and the Brain: Deciphering How the Brain Codes Our Thoughts',
    venue: 'Viking',
    note: 'The most readable modern statement of Global Neuronal Workspace theory. Argues for a late, widespread "ignition" signature in fronto-parietal cortex (~300 ms post-stimulus) as the neural correlate of consciousness.',
  },
  {
    id: 'mashour-2020',
    type: 'paper',
    authors: 'Mashour GA, Roelfsema P, Changeux J-P, Dehaene S',
    year: 2020,
    title: 'Conscious Processing and the Global Neuronal Workspace Hypothesis',
    venue: 'Neuron',
    volume: '105 (5)',
    pages: '776–798',
    doi: '10.1016/j.neuron.2020.01.026',
    url: 'https://www.cell.com/neuron/fulltext/S0896-6273(20)30052-6',
    note: 'A thorough modern review of GNW, including the neuroimaging signature, anaesthesia evidence, and computational implementation. The clearest one-stop summary if you want to know what GNW commits to today.',
  },

  // ---------- INTEGRATED INFORMATION THEORY ----------
  {
    id: 'tononi-2008',
    type: 'paper',
    authors: 'Tononi G',
    year: 2008,
    title: 'Consciousness as Integrated Information: A Provisional Manifesto',
    venue: 'Biological Bulletin',
    volume: '215 (3)',
    pages: '216–242',
    doi: '10.2307/25470707',
    url: 'https://www.journals.uchicago.edu/doi/10.2307/25470707',
    note: 'The clearest accessible statement of IIT 2.0, before the theory got more mathematically baroque. Consciousness as integrated information (Φ), a structural property of certain networks. Bold, falsifiable in places, and either profound or wrong.',
  },
  {
    id: 'tononi-2016',
    type: 'paper',
    authors: 'Tononi G, Boly M, Massimini M, Koch C',
    year: 2016,
    title:
      'Integrated information theory: from consciousness to its physical substrate',
    venue: 'Nature Reviews Neuroscience',
    volume: '17 (7)',
    pages: '450–461',
    doi: '10.1038/nrn.2016.44',
    note: 'IIT 3.0, written by Tononi with Koch and others. The mathematical machinery becomes formidable; the philosophical commitments become more explicit. The paper most often cited when people argue that IIT predicts the cerebellum is not conscious.',
  },

  // ---------- THE COGITATE ADVERSARIAL COLLABORATION ----------
  {
    id: 'cogitate-2023',
    type: 'preprint',
    authors: 'Cogitate Consortium',
    year: 2023,
    title:
      'An adversarial collaboration to critically evaluate theories of consciousness',
    venue: 'bioRxiv',
    doi: '10.1101/2023.06.23.546249',
    url: 'https://www.biorxiv.org/content/10.1101/2023.06.23.546249v3',
    note: 'A preregistered head-to-head test of IIT vs. GNW, designed by proponents of both. The result was mixed and contested — IIT got partial support for posterior cortical involvement; GNW got partial support for fronto-parietal involvement; the field declared the question still open. A landmark for how consciousness science should be done.',
  },

  // ---------- PREDICTIVE PROCESSING & FREE ENERGY ----------
  {
    id: 'friston-2010',
    type: 'paper',
    authors: 'Friston K',
    year: 2010,
    title: 'The free-energy principle: a unified brain theory?',
    venue: 'Nature Reviews Neuroscience',
    volume: '11 (2)',
    pages: '127–138',
    doi: '10.1038/nrn2787',
    note: 'The free-energy principle in one place. The brain as a prediction machine that minimizes surprise. Foundational for predictive processing and for everything Anil Seth has written since.',
  },
  {
    id: 'seth-friston-2016',
    type: 'paper',
    authors: 'Seth AK, Friston KJ',
    year: 2016,
    title: 'Active interoceptive inference and the emotional brain',
    venue: 'Philosophical Transactions of the Royal Society B',
    volume: '371 (1708)',
    pages: '20160007',
    doi: '10.1098/rstb.2016.0007',
    url: 'https://royalsocietypublishing.org/doi/10.1098/rstb.2016.0007',
    note: 'The central paper for thinking about prāṇāyāma in modern neuroscience terms. Interoception as active inference — the brain predicting the body\'s state and updating on prediction error. The framework explains why slow breathing changes felt experience: it changes the prediction-error landscape.',
  },
  {
    id: 'seth-2021',
    type: 'book',
    authors: 'Seth A',
    year: 2021,
    title: 'Being You: A New Science of Consciousness',
    venue: 'Faber & Faber',
    note: 'Arguably the most important popular-science book on consciousness of the last decade. Seth synthesizes predictive processing, interoception, and the "controlled hallucination" account of perception. The framework most useful for translating between contemplative phenomenology and modern neuroscience.',
  },
  {
    id: 'clark-2013',
    type: 'paper',
    authors: 'Clark A',
    year: 2013,
    title:
      'Whatever next? Predictive brains, situated agents, and the future of cognitive science',
    venue: 'Behavioral and Brain Sciences',
    volume: '36 (3)',
    pages: '181–204',
    doi: '10.1017/S0140525X12000477',
    note: 'Clark\'s synthesis paper on predictive processing. The clearest argument for why prediction is not just one cognitive function among many but a unifying account of cortical computation.',
  },

  // ---------- THE ENTROPIC BRAIN & PSYCHEDELICS ----------
  {
    id: 'carhart-harris-2014',
    type: 'paper',
    authors:
      'Carhart-Harris RL, Leech R, Hellyer PJ, Shanahan M, Feilding A, Tagliazucchi E, Chialvo DR, Nutt D',
    year: 2014,
    title:
      'The entropic brain: a theory of conscious states informed by neuroimaging research with psychedelic drugs',
    venue: 'Frontiers in Human Neuroscience',
    volume: '8',
    pages: '20',
    doi: '10.3389/fnhum.2014.00020',
    url: 'https://www.frontiersin.org/articles/10.3389/fnhum.2014.00020/full',
    note: 'The entropic brain hypothesis: that consciousness is graded by the entropy (disorder, flexibility) of neural activity, and that "primary states" — psychedelic, dreaming, deep meditation, early developmental — share a high-entropy signature. The structural twin of the network-dissolution account of samādhi.',
  },
  {
    id: 'carhart-harris-2019',
    type: 'paper',
    authors: 'Carhart-Harris RL, Friston KJ',
    year: 2019,
    title:
      'REBUS and the Anarchic Brain: Toward a Unified Model of the Brain Action of Psychedelics',
    venue: 'Pharmacological Reviews',
    volume: '71 (3)',
    pages: '316–344',
    doi: '10.1124/pr.118.017160',
    note: 'REBUS — RElaxed Beliefs Under pSychedelics — unifies the entropic brain with the predictive processing framework. Psychedelics relax high-level priors; the bottom-up signal becomes more available. Maps cleanly onto descriptions of contemplative depth, with caveats.',
  },

  // ---------- MEDITATION NEUROSCIENCE — REVIEWS ----------
  {
    id: 'tang-holzel-posner-2015',
    type: 'paper',
    authors: 'Tang Y-Y, Hölzel BK, Posner MI',
    year: 2015,
    title: 'The neuroscience of mindfulness meditation',
    venue: 'Nature Reviews Neuroscience',
    volume: '16 (4)',
    pages: '213–225',
    doi: '10.1038/nrn3916',
    note: 'The most-cited modern review of meditation neuroscience. Synthesizes findings on attention, emotion regulation, self-awareness, and the structural brain changes seen in long-term practitioners. The starting point for anyone new to the field.',
  },
  {
    id: 'lutz-slagter-2008',
    type: 'paper',
    authors: 'Lutz A, Slagter HA, Dunne JD, Davidson RJ',
    year: 2008,
    title: 'Attention regulation and monitoring in meditation',
    venue: 'Trends in Cognitive Sciences',
    volume: '12 (4)',
    pages: '163–169',
    doi: '10.1016/j.tics.2008.01.005',
    url: 'https://www.cell.com/trends/cognitive-sciences/fulltext/S1364-6613(08)00057-9',
    note: 'The framework paper for thinking about meditation styles in cognitive-neuroscience terms. Distinguishes focused attention (FA) from open monitoring (OM) and maps each onto distinct neural signatures. Roughly: dhāraṇā = FA, dhyāna = OM.',
  },
  {
    id: 'van-dam-2018',
    type: 'paper',
    authors: 'Van Dam NT, van Vugt MK, Vago DR, et al.',
    year: 2018,
    title:
      'Mind the Hype: A Critical Evaluation and Prescriptive Agenda for Research on Mindfulness and Meditation',
    venue: 'Perspectives on Psychological Science',
    volume: '13 (1)',
    pages: '36–61',
    doi: '10.1177/1745691617709589',
    note: 'A pointed critique of methodological problems in the mindfulness literature: small samples, weak controls, definitional drift, publication bias, and the inflation of clinical claims beyond what the data support. Required reading for honesty.',
  },

  // ---------- MEDITATION NEUROSCIENCE — PRIMARY STUDIES ----------
  {
    id: 'lazar-2005',
    type: 'paper',
    authors: 'Lazar SW, Kerr CE, Wasserman RH, et al.',
    year: 2005,
    title: 'Meditation experience is associated with increased cortical thickness',
    venue: 'NeuroReport',
    volume: '16 (17)',
    pages: '1893–1897',
    doi: '10.1097/01.wnr.0000186598.66243.19',
    url: 'https://pubmed.ncbi.nlm.nih.gov/16272874/',
    note: 'First imaging evidence that meditation thickens cortex in regions associated with attention and interoception, particularly the right anterior insula. Effect largest in the oldest practitioners. Replicated and refined many times since, with appropriate caveats about cross-sectional design.',
  },
  {
    id: 'brewer-2011',
    type: 'paper',
    authors:
      'Brewer JA, Worhunsky PD, Gray JR, Tang Y-Y, Weber J, Kober H',
    year: 2011,
    title: 'Meditation experience is associated with differences in default mode network activity and connectivity',
    venue: 'PNAS',
    volume: '108 (50)',
    pages: '20254–20259',
    doi: '10.1073/pnas.1112029108',
    url: 'https://www.pnas.org/doi/10.1073/pnas.1112029108',
    note: 'Experienced meditators show reduced default mode network activity during meditation and altered DMN coupling at rest. The clearest neural correlate yet for the experiential shift from dhāraṇā (effortful attention) to dhyāna (resting in attention).',
  },
  {
    id: 'josipovic-2014',
    type: 'paper',
    authors: 'Josipovic Z',
    year: 2014,
    title:
      'Neural correlates of nondual awareness in meditation',
    venue: 'Annals of the New York Academy of Sciences',
    volume: '1307',
    pages: '9–18',
    doi: '10.1111/nyas.12261',
    note: 'fMRI of advanced Tibetan Buddhist practitioners during reported non-dual awareness. The anti-correlation between extrinsic (task-positive) and intrinsic (default mode) networks is reduced. Suggests the inside/outside distinction has a measurable network correlate.',
  },
  {
    id: 'farb-2013',
    type: 'paper',
    authors: 'Farb NAS, Segal ZV, Anderson AK',
    year: 2013,
    title:
      'Mindfulness meditation training alters cortical representations of interoceptive attention',
    venue: 'Social Cognitive and Affective Neuroscience',
    volume: '8 (1)',
    pages: '15–26',
    doi: '10.1093/scan/nss066',
    url: 'https://pubmed.ncbi.nlm.nih.gov/23071617/',
    note: 'Mindfulness training measurably alters insular activation during interoceptive attention. Provides functional, not just structural, evidence that the practice trains the body-sensing pathway.',
  },
  {
    id: 'bernardi-2001',
    type: 'paper',
    authors:
      'Bernardi L, Sleight P, Bandinelli G, Cencetti S, Fattorini L, Wdowczyc-Szulc J, Lagi A',
    year: 2001,
    title:
      'Effect of rosary prayer and yoga mantras on autonomic cardiovascular rhythms: comparative study',
    venue: 'BMJ',
    volume: '323 (7327)',
    pages: '1446–1449',
    doi: '10.1136/bmj.323.7327.1446',
    url: 'https://pubmed.ncbi.nlm.nih.gov/11751348/',
    note: 'Recitation of the Ave Maria rosary and the yoga mantra "om-mani-padme-om" both entrained breathing to ~6/min and produced large synchronized oscillations in heart rate and blood pressure. The cleanest demonstration that two unrelated contemplative traditions independently converged on the same physiological lever.',
  },
  {
    id: 'zaccaro-2018',
    type: 'paper',
    authors: 'Zaccaro A, Piarulli A, Laurino M, et al.',
    year: 2018,
    title:
      'How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing',
    venue: 'Frontiers in Human Neuroscience',
    volume: '12',
    pages: '353',
    doi: '10.3389/fnhum.2018.00353',
    url: 'https://www.frontiersin.org/articles/10.3389/fnhum.2018.00353/full',
    note: 'Systematic review of fifteen studies on slow breathing. Consistent findings: increased HRV, RSA amplification, parasympathetic dominance, subjective comfort and alertness. The single most-cited modern synthesis of slow-breathing physiology.',
  },
  {
    id: 'grossman-2023',
    type: 'paper',
    authors: 'Grossman P',
    year: 2023,
    title:
      'Fundamental challenges and likely refutations of the five basic premises of the polyvagal theory',
    venue: 'Biological Psychology',
    volume: '180',
    pages: '108589',
    doi: '10.1016/j.biopsycho.2023.108589',
    note: 'A pointed critique of the evolutionary and anatomical claims in polyvagal theory. Argues that the framework has outpaced its evidence and that simpler autonomic models account for the same clinical phenomena. Required reading for anyone citing polyvagal claims.',
  },

  // ---------- EMBODIED COGNITION & BUDDHIST DIALOGUE ----------
  {
    id: 'varela-thompson-rosch-1991',
    type: 'book',
    authors: 'Varela FJ, Thompson E, Rosch E',
    year: 1991,
    title: 'The Embodied Mind: Cognitive Science and Human Experience',
    venue: 'MIT Press',
    note: 'The founding text of the embodied/enactive cognition program, written with explicit engagement of Buddhist Madhyamaka philosophy. Argues that mind is not in the head but in the dynamic loop between organism and world. The natural bridge between contemplative traditions and Western cognitive science.',
  },
  {
    id: 'thompson-2014',
    type: 'book',
    authors: 'Thompson E',
    year: 2014,
    title:
      'Waking, Dreaming, Being: Self and Consciousness in Neuroscience, Meditation, and Philosophy',
    venue: 'Columbia University Press',
    note: 'Evan Thompson\'s synthesis of contemporary consciousness science with Indian and Buddhist philosophy. Probably the most philosophically careful book in this neighborhood. Engages with samādhi and non-dual awareness without inflating either.',
  },

  // ---------- ATTENTION SCHEMA, RECURRENT, AND HIGHER-ORDER ----------
  {
    id: 'graziano-2019',
    type: 'book',
    authors: 'Graziano MSA',
    year: 2019,
    title: 'Rethinking Consciousness: A Scientific Theory of Subjective Experience',
    venue: 'W. W. Norton',
    note: 'Graziano\'s attention schema theory in book-length form. Consciousness as the brain\'s simplified model of its own attentional processes. The theory makes specific predictions and is testable; it is also widely disputed.',
  },
  {
    id: 'lamme-2006',
    type: 'paper',
    authors: 'Lamme VAF',
    year: 2006,
    title: 'Towards a true neural stance on consciousness',
    venue: 'Trends in Cognitive Sciences',
    volume: '10 (11)',
    pages: '494–501',
    doi: '10.1016/j.tics.2006.09.001',
    note: 'Argues that local recurrent processing in sensory cortex is sufficient for phenomenal consciousness, independent of broadcast to a global workspace. Picks a fight with GWT that is still being adjudicated.',
  },
  {
    id: 'rosenthal-2005',
    type: 'book',
    authors: 'Rosenthal D',
    year: 2005,
    title: 'Consciousness and Mind',
    venue: 'Clarendon Press',
    note: 'The foundational statement of higher-order thought theory: a mental state is conscious when it is the target of a higher-order representation. Out of fashion in empirical circles, still influential in philosophy.',
  },

  // ---------- THE SOURCES ----------
  {
    id: 'patanjali',
    type: 'sutra',
    authors: 'Patañjali',
    year: 'c. 400 BCE',
    title: 'Yoga Sūtras',
    note: 'The foundational text of classical yoga. ~196 aphorisms, traditionally divided into four chapters (samādhi-pāda, sādhana-pāda, vibhūti-pāda, kaivalya-pāda). The eightfold path appears in sūtras 2.29–3.3.',
  },
  {
    id: 'nagarjuna-mmk',
    type: 'sutra',
    authors: 'Nāgārjuna',
    year: 'c. 200 CE',
    title: 'Mūlamadhyamakakārikā (Fundamental Verses on the Middle Way)',
    note: 'The foundational text of Madhyamaka Buddhism. A 27-chapter argument that all phenomena lack inherent existence (svabhāva) — not nihilism, but the rejection of independent self-subsisting entities. Anticipates contemporary anti-essentialism and process metaphysics by about 1,800 years.',
  },
  {
    id: 'garfield-1995',
    type: 'book',
    authors: 'Garfield JL',
    year: 1995,
    title: 'The Fundamental Wisdom of the Middle Way: Nāgārjuna\'s Mūlamadhyamakakārikā',
    venue: 'Oxford University Press',
    note: 'The most accessible philosophically-careful English translation of the MMK, with commentary that translates Nāgārjuna into vocabulary modern analytic philosophy can engage with.',
  },
  {
    id: 'vasubandhu-twenty',
    type: 'sutra',
    authors: 'Vasubandhu',
    year: 'c. 400 CE',
    title: 'Viṃśatikā (Twenty Verses on Mind-Only)',
    note: 'A short Yogācāra text defending the doctrine that what we perceive is mental representation, not external object. The arguments anticipate modern representationalist accounts in philosophy of mind by 1,500 years; the conclusions go further.',
  },
  {
    id: 'siderits-yogacara',
    type: 'book',
    authors: 'Siderits M',
    year: 2007,
    title: 'Buddhism as Philosophy: An Introduction',
    venue: 'Hackett',
    note: 'The clearest available introduction to Indian Buddhist philosophy — Abhidhamma, Madhyamaka, Yogācāra — for readers coming from Western analytic philosophy. Mark Siderits translates the technical machinery without softening the arguments.',
  },
  {
    id: 'buddhaghosa-visuddhimagga',
    type: 'sutra',
    authors: 'Buddhaghosa',
    year: 'c. 430 CE',
    title: 'Visuddhimagga (The Path of Purification)',
    note: 'The classical Theravāda compendium of Buddhist doctrine and practice, including the most complete extant treatment of the 89 cittas — Theravāda Abhidhamma\'s taxonomy of states of consciousness. Phenomenologically more granular than anything in Patañjali.',
  },
  {
    id: 'zhuangzi',
    type: 'sutra',
    authors: 'Zhuāngzǐ',
    year: 'c. 3rd c. BCE',
    title: 'Zhuāngzǐ',
    note: 'The foundational Daoist contemplative text. Chapter 6 contains the locus classicus for zuòwàng ("sitting and forgetting") — a description of contemplative absorption indistinguishable in some respects from what Patañjali calls samādhi, arriving at the conclusion from a completely different metaphysical starting point.',
  },
  {
    id: 'kohn-2010',
    type: 'book',
    authors: 'Kohn L',
    year: 2010,
    title: 'Sitting in Oblivion: The Heart of Daoist Meditation',
    venue: 'Three Pines Press',
    note: 'The most thorough modern English-language treatment of zuòwàng, including Sīmǎ Chéngzhēn\'s 8th-century Zuòwànglùn and its seven-stage developmental scheme. Useful for placing Daoist contemplative practice next to the Yoga Sūtras without flattening either.',
  },
  {
    id: 'longchenpa',
    type: 'sutra',
    authors: 'Longchenpa',
    year: 'c. 1350',
    title: 'Seven Treasuries',
    note: 'The most influential synthesis of Dzogchen ("Great Perfection") teachings. Distinguishes rigpa (pure awareness, the recognition of the basis) from sems (ordinary dualistic mind). The Tibetan tradition\'s most rigorous attempt to describe the state Patañjali calls samādhi from inside the experience.',
  },
  {
    id: 'wallace-2007',
    type: 'book',
    authors: 'Wallace BA',
    year: 2007,
    title: 'Contemplative Science: Where Buddhism and Neuroscience Converge',
    venue: 'Columbia University Press',
    note: 'B. Alan Wallace\'s argument that contemplative traditions produce expertise about mental phenomena that neuroscience needs as a data source, not a curiosity. Wallace was a Tibetan monk for fourteen years before becoming a Stanford-trained philosopher of science; he is unusually qualified to make the case.',
  },
  {
    id: 'newberg-2010',
    type: 'book',
    authors: 'Newberg AB',
    year: 2010,
    title: 'Principles of Neurotheology',
    venue: 'Ashgate',
    note: 'Newberg\'s synthesis of his imaging work on Tibetan monks, Franciscan nuns, and Pentecostal speakers-in-tongues. Argues for shared neural signatures across mystical experiences. Methodologically loose by Van Dam\'s standards; conceptually ambitious.',
  },
  {
    id: 'griffiths-2006',
    type: 'paper',
    authors: 'Griffiths RR, Richards WA, McCann U, Jesse R',
    year: 2006,
    title: 'Psilocybin can occasion mystical-type experiences having substantial and sustained personal meaning and spiritual significance',
    venue: 'Psychopharmacology',
    volume: '187 (3)',
    pages: '268–283',
    doi: '10.1007/s00213-006-0457-5',
    note: 'The Johns Hopkins study that re-opened serious scientific research on psychedelics by demonstrating that psilocybin reliably produces experiences participants rate, months later, as among the most meaningful of their lives. Mystical-type-experience scales used were adapted from Stace and Pahnke; the structural parallels with contemplative reports are striking.',
  },
  {
    id: 'carhart-harris-2012',
    type: 'paper',
    authors:
      'Carhart-Harris RL, Erritzoe D, Williams T, Stone JM, Reed LJ, Colasanti A, Tyacke RJ, Leech R, Malizia AL, Murphy K, Hobden P, Evans J, Feilding A, Wise RG, Nutt DJ',
    year: 2012,
    title: 'Neural correlates of the psychedelic state as determined by fMRI studies with psilocybin',
    venue: 'PNAS',
    volume: '109 (6)',
    pages: '2138–2143',
    doi: '10.1073/pnas.1119598109',
    note: 'The imaging study that established the now-canonical finding: psilocybin reduces, rather than increases, brain activity, particularly in the default mode network. The result was unexpected — researchers had assumed psychedelics would increase cortical activity. Foundational for the entropic-brain framework.',
  },
  {
    id: 'rosenthal-1986',
    type: 'paper',
    authors: 'Rosenthal DM',
    year: 1986,
    title: 'Two concepts of consciousness',
    venue: 'Philosophical Studies',
    volume: '49 (3)',
    pages: '329–359',
    doi: '10.1007/BF00355521',
    note: 'The original statement of higher-order thought theory. A mental state is conscious when it is the object of a higher-order representation. Out of fashion in empirical neuroscience but still influential in philosophy.',
  },
  {
    id: 'lau-rosenthal-2011',
    type: 'paper',
    authors: 'Lau H, Rosenthal D',
    year: 2011,
    title: 'Empirical support for higher-order theories of conscious awareness',
    venue: 'Trends in Cognitive Sciences',
    volume: '15 (8)',
    pages: '365–373',
    doi: '10.1016/j.tics.2011.05.009',
    note: 'Lau\'s empirical case for higher-order theories: PFC activity tracks subjective awareness more reliably than it tracks objective task performance, suggesting that consciousness is built on metacognitive access rather than first-order content. The case the COGITATE collaboration was partly designed to test.',
  },
  {
    id: 'lamme-2010',
    type: 'paper',
    authors: 'Lamme VAF',
    year: 2010,
    title: 'How neuroscience will change our view on consciousness',
    venue: 'Cognitive Neuroscience',
    volume: '1 (3)',
    pages: '204–220',
    doi: '10.1080/17588921003731586',
    note: 'Lamme\'s argument that local recurrent processing in posterior cortex is sufficient for phenomenal consciousness, independent of broadcast to a global workspace. Picks the most direct fight with GWT in the literature.',
  },
  {
    id: 'graziano-webb-2015',
    type: 'paper',
    authors: 'Graziano MSA, Webb TW',
    year: 2015,
    title: 'The attention schema theory: a mechanistic account of subjective awareness',
    venue: 'Frontiers in Psychology',
    volume: '6',
    pages: '500',
    doi: '10.3389/fpsyg.2015.00500',
    note: 'Attention schema theory in concise paper form. Consciousness as the brain\'s simplified model of its own attention — analogous to the body schema in motor control. The theory makes specific behavioral predictions and is testable; whether it is true is contested.',
  },
  {
    id: 'thompson-2007',
    type: 'book',
    authors: 'Thompson E',
    year: 2007,
    title: 'Mind in Life: Biology, Phenomenology, and the Sciences of Mind',
    venue: 'Harvard University Press',
    note: 'Evan Thompson\'s mature statement of the enactive program, picking up where Varela left off. The book that completes the bridge from autopoiesis through phenomenology to the contemplative material that Thompson would take up in full in 2014.',
  },
  {
    id: 'siegel-1989',
    type: 'paper',
    authors: 'Siegel RK',
    year: 1989,
    title: 'Intoxication: Life in Pursuit of Artificial Paradise',
    venue: 'E. P. Dutton',
    note: 'Cited not in this essay but worth noting in the historical record: Siegel\'s argument that pharmacological alteration of consciousness is a near-universal human behavior with cross-species parallels. Useful context for thinking about why the brain has receptor systems that respond to plant-derived compounds at all.',
  },
  {
    id: 'bryant-2009',
    type: 'book',
    authors: 'Bryant EF',
    year: 2009,
    title:
      'The Yoga Sūtras of Patañjali: A New Edition, Translation, and Commentary',
    venue: 'North Point Press',
    note: 'The most widely respected modern English translation, with extensive commentary drawing on traditional Sanskrit commentators (Vyāsa, Vācaspati Miśra, Vijñānabhikṣu). The translation I quote from when quoting the Sūtras.',
  },
];

// ---------- LOOKUPS ----------

const BY_ID = new Map<string, BiblioEntry>(BIBLIOGRAPHY.map((e) => [e.id, e]));

export function getCitation(id: string): BiblioEntry | undefined {
  return BY_ID.get(id);
}

/**
 * Format a citation in APA-ish short form for inline rendering.
 * "Lazar et al., 2005" or "Nagel, 1974"
 */
export function formatShortCite(entry: BiblioEntry): string {
  const yr = entry.year;
  const authors = entry.authors;
  // Pull last name from first author. Pattern: "Lastname F" or "Lastname FM, Other A"
  const firstAuthorLast = authors.split(',')[0].trim().split(' ')[0];
  if (authors.includes(',') || authors.toLowerCase().includes('et al')) {
    return `${firstAuthorLast} et al., ${yr}`;
  }
  return `${firstAuthorLast}, ${yr}`;
}

/**
 * Format a full citation, APA-ish, for the bibliography page.
 */
export function formatFullCite(entry: BiblioEntry): string {
  const parts: string[] = [];
  parts.push(`${entry.authors} (${entry.year}).`);
  const isBook = entry.type === 'book';
  if (isBook) {
    parts.push(`*${entry.title}*.`);
    if (entry.venue) parts.push(`${entry.venue}.`);
  } else {
    parts.push(`${entry.title}.`);
    if (entry.venue) {
      let v = `*${entry.venue}*`;
      if (entry.volume) v += `, ${entry.volume}`;
      if (entry.pages) v += `, ${entry.pages}`;
      v += '.';
      parts.push(v);
    }
  }
  if (entry.doi) parts.push(`https://doi.org/${entry.doi}`);
  return parts.join(' ');
}
