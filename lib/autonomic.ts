// Autonomic / arousal / interoceptive role for every region.
//
// Each region in /lib/regions.ts gets a paragraph here that says — directly,
// specifically, and without padding — how it participates in the autonomic
// nervous system, the stress axis, arousal regulation, and interoception.
//
// When a region has little or no direct autonomic role (most primary sensory
// cortex, for instance), the note says so plainly. The point is to make the
// through-line of body-and-brain visible across the whole atlas.

import type { AutonomicNote } from './regions';

export const AUTONOMIC_NOTES: Record<string, AutonomicNote> = {
  // ============================================================
  // CORE AUTONOMIC HUBS — the regions where this is the main story
  // ============================================================

  hypothalamus: {
    tags: ['sympathetic', 'parasympathetic', 'hpa', 'interoception', 'modulator'],
    text:
      'The single most important integrator of autonomic function in the brain. The hypothalamus reads the state of the body — through hormones in the blood, through vagal afferents relayed by the NTS, and through direct sensing of glucose, temperature, and osmolarity — and writes the body\'s set points back through two channels. Through descending projections to the brainstem and spinal cord it directs sympathetic and parasympathetic outflow simultaneously; through the pituitary it drives the HPA axis (corticotropin-releasing hormone → ACTH → cortisol) that sustains the stress response over hours. The paraventricular nucleus orchestrates the cortisol response. The suprachiasmatic nucleus sets the circadian rhythm of autonomic tone. The arcuate nucleus regulates appetite. When this region is functioning, you have homeostasis. When it isn\'t, almost nothing else works.',
  },

  'vagus-nerve': {
    tags: ['parasympathetic', 'interoception'],
    text:
      'The vagus is the parasympathetic nervous system, for most practical purposes — roughly three-quarters of all parasympathetic fibers in the body run in this nerve. About 80% of vagal fibers are afferent, carrying news from the heart, lungs, liver, pancreas, and gut up to the nucleus tractus solitarius. The other 20% carry the brainstem\'s parasympathetic output back down: slowing the heart on each exhale (the source of heart-rate variability), constricting bronchi, stimulating peristalsis and secretion, promoting digestion and absorption, releasing acetylcholine onto splenic macrophages to damp inflammation. The vagus is also the structural substrate of the gut–brain axis; when people say "the gut talks to the brain," this nerve is what they mean.',
  },

  medulla: {
    tags: ['parasympathetic', 'sympathetic', 'interoception', 'arousal'],
    text:
      'The medulla is where staying alive is computed. Within it sit the cardiovascular control nuclei that set heart rate and blood pressure beat-to-beat; the pre-Bötzinger complex that generates each breath; the dorsal motor nucleus of the vagus that issues most parasympathetic outflow to the body; and the nucleus tractus solitarius, the first central relay for vagal afferents from heart, lungs, and gut. Sympathetic and parasympathetic streams are continuously balanced here, below conscious awareness. Damage to the medulla — even small lesions — disrupts breathing or cardiac control and is often immediately fatal. The medulla is the autonomic nervous system\'s machine room.',
  },

  pons: {
    tags: ['parasympathetic', 'sympathetic', 'arousal'],
    text:
      'The pons coordinates breathing rhythm with the medulla (pontine respiratory group), generates REM sleep, and houses key parts of the ascending arousal system — including the locus coeruleus, the brain\'s primary noradrenergic nucleus, whose firing rate tracks vigilance, novelty, and stress. Through the locus coeruleus the pons broadcasts noradrenaline across the cortex, biasing the system toward alertness and sympathetic readiness. Parabrachial nuclei in the pons relay autonomic and interoceptive information from the NTS upward toward the thalamus and forebrain.',
  },

  midbrain: {
    tags: ['arousal', 'sympathetic', 'modulator'],
    text:
      'The midbrain contributes to autonomic regulation mainly through two systems. The periaqueductal gray (PAG) coordinates the defensive response — fight, flight, freeze — including the sympathetic surge, the pain modulation, and the breath-holding that come with acute threat. The dopaminergic nuclei (substantia nigra, ventral tegmental area) shape motivation and movement initiation, which influences sympathetic state indirectly. The midbrain is also a major node of the ascending reticular activating system that sets the level of cortical arousal.',
  },

  thalamus: {
    tags: ['interoception', 'arousal'],
    text:
      'The thalamus relays interoceptive signals — heart, lungs, gut, baroreceptors, temperature, pain — from the brainstem to the insular cortex and ACC, where they become felt experience. The thalamocortical loop is also one of the principal neural correlates of consciousness itself: when it disengages, in deep sleep, anesthesia, or some brain injuries, awareness shuts off even though the cortex is structurally intact. The thalamus is not directly autonomic, but body-state and consciousness both depend on it.',
  },

  hippocampus: {
    tags: ['hpa', 'modulator'],
    text:
      'The hippocampus is densely supplied with glucocorticoid receptors and is one of the brain\'s main feedback regulators of the HPA axis: it inhibits cortisol release when stress has passed. Chronic stress — sustained cortisol exposure — measurably shrinks the hippocampus, weakening that brake, which makes future stress responses harder to terminate. This is a major mechanism by which chronic stress and trauma propagate themselves over time. The hippocampus also tags experiences with context, including the body\'s state at the time, which is why somatic memory feels location-bound.',
  },

  amygdala: {
    tags: ['sympathetic', 'hpa', 'arousal'],
    text:
      'The amygdala is the launch button for the body\'s threat response. When it detects a salient stimulus — especially threat — it signals the hypothalamus to fire the sympathetic system (fast: heart rate, blood pressure, pupil dilation, glucose mobilization within seconds) and to initiate the HPA cascade (slower: cortisol over minutes to hours). It also recruits the brainstem arousal nuclei. The amygdala drives the body before the cortex catches up — you flinch from a snake-shaped stick first and identify it second. Excessive amygdala output relative to prefrontal regulation is one of the more robust neural signatures of anxiety disorders and post-traumatic stress.',
  },

  insula: {
    tags: ['interoception', 'modulator'],
    text:
      'The insula is the cortical map of inside the body — the place where the felt sense of being alive lives. Posterior insula receives the raw interoceptive feed (heartbeat, breath, gut, temperature) relayed up through NTS → thalamus → cortex. Middle insula re-represents it. Anterior insula hosts the more abstract, emotionally colored awareness of the body that meditators, dancers, and emotionally skilled clinicians tend to have measurably more of. Interoceptive accuracy — how well you can feel your own heartbeat — correlates with anterior insular volume. The insula is also a major target of vagal afferents, so the gut–brain axis surfaces here.',
  },

  'anterior-cingulate': {
    tags: ['parasympathetic', 'sympathetic', 'modulator', 'interoception'],
    text:
      'The anterior cingulate cortex is the cortical region most directly tied to autonomic control. It has dense projections to the hypothalamus and brainstem and can modulate heart rate, blood pressure, and respiratory rhythm. Subgenual ACC activity is reduced in depression and increased after effective treatment; it has been a deep-brain-stimulation target for treatment-resistant depression precisely because of this autonomic-affective coupling. The ACC also handles the affective side of pain (its unpleasantness, not its location) and tracks effort and conflict — situations that load the autonomic system. With the anterior insula it forms the salience network, the system that decides what the brain pays attention to next.',
  },

  fornix: {
    tags: ['hpa'],
    text:
      'The fornix carries hippocampal output downstream toward the mammillary bodies and hypothalamus. Through this bundle the hippocampus feeds its inhibitory signal to the HPA axis — the message that the stressor is over and cortisol release can stop. Damage to the fornix disrupts both episodic memory and parts of the stress-axis feedback loop.',
  },

  // Cranial nerve regions
  'cn1-olfactory': {
    tags: ['arousal'],
    text:
      'Smell is the one sensory pathway that bypasses the thalamus and projects directly into the limbic system — including the amygdala. This direct route is why smells can trigger autonomic responses (revulsion, appetite, arousal) faster and more viscerally than other senses, and why olfactory memories tend to be saturated with bodily feeling.',
  },

  'cn2-optic': {
    tags: ['arousal', 'modulator'],
    text:
      'A small population of intrinsically photosensitive retinal ganglion cells, separate from the visual pathway proper, projects to the suprachiasmatic nucleus and helps set circadian rhythm. The pretectal nucleus uses retinal input to drive the pupillary light reflex — a directly autonomic, parasympathetic response. So vision is mostly cognitive, but it does talk to the autonomic system at these two interfaces.',
  },
  'xie-cn2-optic': {
    tags: ['arousal', 'modulator'],
    text:
      'A small population of intrinsically photosensitive retinal ganglion cells, separate from the visual pathway proper, projects to the suprachiasmatic nucleus and helps set circadian rhythm. The pretectal nucleus uses retinal input to drive the pupillary light reflex — a directly autonomic, parasympathetic response. So vision is mostly cognitive, but it does talk to the autonomic system at these two interfaces.',
  },

  'cn3-oculomotor': {
    tags: ['parasympathetic'],
    text:
      'The oculomotor nerve carries the parasympathetic fibers that constrict the pupil and accommodate the lens for near vision. The pupillary constriction in bright light, and the pupillary dilation in fear, arousal, or cognitive load, are mediated by the balance between this parasympathetic output and sympathetic fibers from the superior cervical ganglion. Pupil size is one of the simplest noninvasive readouts of autonomic state.',
  },
  'xie-cn3-oculomotor': {
    tags: ['parasympathetic'],
    text:
      'The oculomotor nerve carries the parasympathetic fibers that constrict the pupil and accommodate the lens for near vision. The pupillary constriction in bright light, and the pupillary dilation in fear, arousal, or cognitive load, are mediated by the balance between this parasympathetic output and sympathetic fibers from the superior cervical ganglion. Pupil size is one of the simplest noninvasive readouts of autonomic state.',
  },

  'cn4-trochlear': {
    tags: ['none'],
    text: 'Pure motor nerve to a single eye muscle — no autonomic role.',
  },

  'cn5-trigeminal': {
    tags: ['parasympathetic'],
    text:
      'The trigeminal nerve\'s sensory branches mediate the "diving reflex" — when cold water hits the face, trigeminal afferents trigger an abrupt parasympathetic response: heart rate drops, peripheral vessels constrict, oxygen is preserved. This is why splashing cold water on the face calms an anxious nervous system in measurable seconds. Trigeminal neuralgia, conversely, produces such intense pain that the autonomic and emotional response can be severe.',
  },
  'xie-cn5-trigeminal': {
    tags: ['parasympathetic'],
    text:
      'The trigeminal nerve\'s sensory branches mediate the "diving reflex" — when cold water hits the face, trigeminal afferents trigger an abrupt parasympathetic response: heart rate drops, peripheral vessels constrict, oxygen is preserved. This is why splashing cold water on the face calms an anxious nervous system in measurable seconds. Trigeminal neuralgia, conversely, produces such intense pain that the autonomic and emotional response can be severe.',
  },

  'cn6-abducens': {
    tags: ['none'],
    text: 'Pure motor nerve to one eye muscle — no autonomic role.',
  },

  'cn7-facial': {
    tags: ['parasympathetic'],
    text:
      'The facial nerve carries the parasympathetic fibers that drive lacrimal (tear) and salivary glands. It also innervates the stapedius muscle in the inner ear, which dampens loud sounds — a small but real autonomic-adjacent protective reflex. Bell\'s palsy (facial nerve dysfunction) often produces both motor loss and disrupted tearing or salivation on the affected side. Conventional polyvagal theory frames the muscles of facial expression that this nerve controls as part of a "social engagement" system whose tone reflects parasympathetic state.',
  },
  'xie-cn78-facial-vestibulocochlear': {
    tags: ['parasympathetic'],
    text:
      'CN VII (facial) carries the parasympathetic fibers that drive tear and salivary glands and the stapedius muscle of the inner ear. CN VIII (vestibulocochlear) is sensory only and not directly autonomic, though vestibular signals influence autonomic state — motion sickness is the clearest example. The Xie atlas treats these two nerves as a bundled pair because they emerge together at the pontomedullary junction and diffusion MRI cannot reliably separate them.',
  },

  'cn8-vestibulocochlear': {
    tags: ['none'],
    text:
      'Hearing and balance are sensory, not autonomic. However, vestibular signals influence autonomic state — motion sickness is a vestibular signal driving sympathetic and parasympathetic outflow into nausea and vagal collapse. Tinnitus and some forms of hyperacusis are also tied to autonomic stress states.',
  },

  'cn9-glossopharyngeal': {
    tags: ['parasympathetic', 'interoception'],
    text:
      'CN IX carries parasympathetic fibers to the parotid salivary gland and, more importantly, afferent fibers from the carotid sinus and carotid body — the baroreceptors and chemoreceptors that monitor blood pressure and arterial oxygen / CO₂. These signals travel up CN IX to the NTS and drive the baroreflex, which adjusts heart rate and vascular tone beat-by-beat. CN IX is one of the principal nerves of the homeostatic sensory loop.',
  },

  'cn11-accessory': {
    tags: ['none'],
    text: 'Motor only — to neck and shoulder muscles. No direct autonomic role.',
  },

  'cn12-hypoglossal': {
    tags: ['none'],
    text: 'Pure motor to the tongue. No direct autonomic role, though it coordinates with vagal output during swallowing.',
  },

  'reticular-formation': {
    tags: ['arousal', 'sympathetic', 'parasympathetic'],
    text:
      'The reticular formation is a diffuse network running the length of the brainstem. The ascending reticular activating system within it sets the global level of cortical arousal — sleep, drowsiness, wakefulness, vigilance, alarm — using noradrenaline (locus coeruleus), serotonin (raphe nuclei), acetylcholine (pedunculopontine), and a few other transmitters. The descending portion modulates autonomic tone and pain. Damage to the reticular formation produces coma. There is no "autonomic life" in any direction without it.',
  },

  // Basal ganglia & diencephalon (non-cortex)
  caudate: { tags: ['modulator'], text: 'Indirectly relevant. The dorsal striatum gates habits, including the autonomic habits — habitual breath-holding, habitual jaw clenching, habitual posture — that maintain chronic sympathetic states. Treatment of OCD, which involves striatal-orbitofrontal loops, often produces measurable changes in autonomic baseline.' },
  putamen: { tags: ['modulator'], text: 'Like the caudate, the putamen is a habit and skilled-movement nucleus rather than a direct autonomic regulator. But motor habits (posture, gait, breathing patterns) carry autonomic consequences, so the putamen contributes indirectly to chronic autonomic state.' },
  'globus-pallidus': { tags: ['none'], text: 'The output nucleus of the basal ganglia. Its role is in gating movement and habit, not in autonomic regulation.' },

  pituitary: {
    tags: ['hpa', 'sympathetic'],
    text:
      'The pituitary is where the nervous system meets the bloodstream. The anterior pituitary releases ACTH on signal from the hypothalamus, driving cortisol release from the adrenal cortex — the slow arm of the stress response. The posterior pituitary releases oxytocin (which damps sympathetic tone and lowers blood pressure) and vasopressin (which raises blood pressure and conserves water). Without the pituitary, the hypothalamus would have no way to write hormone-mediated commands to the body.',
  },

  'corpus-callosum': { tags: ['none'], text: 'White-matter highway between the two hemispheres. No direct autonomic role, but it carries the bilateral information that lets autonomic states feel coherent rather than fragmented.' },

  cerebellum: {
    tags: ['modulator'],
    text:
      'The cerebellum was long thought to be purely motor. It now appears to provide the same kind of predictive timing it gives to movement to autonomic and emotional processes as well — coordinating the timing of breath with movement, anticipating physiological consequences of action. Cerebellar damage can produce a "cerebellar cognitive affective syndrome" that includes blunted emotional expression, suggesting a real autonomic role even if it is subtle.',
  },

  'cerebrum-shell-left': { tags: ['none'], text: 'Bulk white matter of the left hemisphere. No specific autonomic role — but the long-range fibers carry every cortical contribution to autonomic regulation downward.' },
  'cerebrum-shell-right': { tags: ['none'], text: 'Bulk white matter of the right hemisphere. The right hemisphere has somewhat stronger involvement in autonomic and emotional processing, especially of negative-valence states.' },
  'occipital-lobe': { tags: ['none'], text: 'Visual cortex. No direct autonomic role, though visual content (a snake, a face, a sudden movement) is what often triggers the cascade through the amygdala.' },

  // Procedural placeholder regions for non-meshed structures
  'frontal-lobe': { tags: ['modulator'], text: 'The prefrontal cortex is the brain\'s top-down regulator of autonomic state. Through its dense projections to the amygdala, hypothalamus, and brainstem, it inhibits the threat response, reappraises stressors, and damps sympathetic surges. Effective psychotherapy seems to strengthen this prefrontal brake. Damage to the orbitofrontal and ventromedial prefrontal cortex disrupts emotional and autonomic regulation.' },
  'parietal-lobe': { tags: ['interoception'], text: 'Mostly somatosensory and spatial, with limited direct autonomic role. The posterior parietal regions contribute to body schema — the sense of the body in space — which is one channel of interoceptive awareness alongside the insular channel.' },
  'temporal-lobe': { tags: ['hpa'], text: 'The medial temporal lobe (hippocampus and amygdala) is where the autonomic story sits — see those regions individually. Lateral temporal cortex is mostly language, auditory, and semantic.' },

  'spinal-cord': {
    tags: ['sympathetic', 'parasympathetic'],
    text:
      'The spinal cord is where autonomic output leaves the central nervous system. Sympathetic preganglionic neurons sit in the lateral horn from T1 to L2 and project to the sympathetic chain ganglia running alongside the vertebrae. Sacral parasympathetic neurons at S2–S4 supply the lower abdominal and pelvic organs. The cord also carries ascending visceral sensory information that doesn\'t go through the vagus (especially pain and pelvic sensation). A high spinal cord injury disables sympathetic regulation below the lesion, producing dramatic blood-pressure instability.',
  },

  'sympathetic-chain': {
    tags: ['sympathetic'],
    text:
      'The sympathetic chain is the cable along which the sympathetic nervous system actually reaches the body. Paired ganglia run on either side of the vertebral column from the upper cervical region down to the coccyx. Preganglionic fibers from the spinal cord synapse here; postganglionic fibers fan out to nearly every organ, releasing noradrenaline. This is the "accelerator" itself.',
  },

  'enteric-nervous-system': {
    tags: ['parasympathetic', 'interoception'],
    text:
      'The 500 million neurons embedded in the gut wall constitute a third division of the autonomic nervous system. The enteric nervous system controls gut motility and secretion on its own — peristalsis continues in a gut isolated from the central nervous system — and the gut produces roughly 95% of the body\'s serotonin locally. The vagus is the main two-way link with the brain, and the gut microbiome modulates what the enteric system reports up. When people speak of "gut feelings," this is what they mean, both metaphorically and biologically.',
  },

  // ============================================================
  // CRANIAL NERVES — procedural ones not yet covered above
  // ============================================================

  // Vagus already covered as 'vagus-nerve' above.

  // ============================================================
  // FREESURFER fsaverage CORTICAL REGIONS
  // 68 entries (34 per hemisphere). Most cortex has either an indirect role
  // (limbic/regulatory contributions) or essentially no autonomic role
  // (primary sensory cortex). I write the truth in both cases.
  // ============================================================
};

/**
 * Per-Desikan-Killiany cortical region autonomic notes.
 * Applied to both left and right hemisphere by region name.
 * Right-hemisphere versions sometimes get a slight elaboration where
 * laterality is known to matter (e.g. right insula, right inferior frontal).
 */
const DESIKAN_AUTONOMIC: Record<string, AutonomicNote> = {
  // ---- frontal lobe ----
  superiorfrontal: { tags: ['modulator'], text: 'Part of the prefrontal cortex\'s top-down regulation of emotion and autonomic state. Activity here is associated with sustained attention and working memory — both effortful states that engage sympathetic arousal — and with the ability to reappraise emotional stimuli, which damps amygdala-driven autonomic surges.' },
  rostralmiddlefrontal: { tags: ['modulator'], text: 'Dorsolateral prefrontal cortex. A central node of the executive control network and a major top-down regulator of the amygdala. Stimulating this region (e.g. with TMS, used as a depression treatment) shifts autonomic balance toward parasympathetic dominance over time.' },
  caudalmiddlefrontal: { tags: ['modulator'], text: 'Premotor and frontal-eye-field territory. Indirectly autonomic via its role in attention shifts; little direct role.' },
  parsopercularis: { tags: ['modulator'], text: 'Inferior frontal gyrus — on the right side, a key node for response inhibition and stopping ongoing action. Inhibition of motor responses and inhibition of emotional/autonomic responses share circuitry here.' },
  parstriangularis: { tags: ['modulator'], text: 'Inferior frontal gyrus. Part of the right-hemisphere inhibitory control network when on the right; language network when on the left.' },
  parsorbitalis: { tags: ['modulator'], text: 'Anterior inferior frontal gyrus. Contributes to inhibitory control of behavior and emotion, which feeds into autonomic regulation.' },
  lateralorbitofrontal: { tags: ['modulator'], text: 'Orbitofrontal cortex represents reward value and behavioral flexibility. Lesions produce disinhibition — including disinhibited autonomic and emotional reactivity. Phineas Gage\'s case is the canonical demonstration.' },
  medialorbitofrontal: { tags: ['modulator'], text: 'Medial orbitofrontal cortex represents subjective value and emotional decision-making. It projects to the amygdala and hypothalamus and contributes to the cortical brake on threat-driven autonomic responses.' },
  precentral: { tags: ['none'], text: 'Primary motor cortex. No direct autonomic role.' },
  paracentral: { tags: ['parasympathetic'], text: 'The paracentral lobule contains the cortical representation of the bladder, bowel, and pelvic floor, which means it has the most direct cortical role in autonomic control of micturition and defecation of any cortical region. Damage here produces incontinence.' },
  frontalpole: { tags: ['modulator'], text: 'The frontal pole hosts the highest-order goal representations — long-term plans, meta-cognition. These shape the persistent affective and autonomic state through which the rest of the brain operates.' },

  // ---- parietal lobe ----
  superiorparietal: { tags: ['none'], text: 'Mostly spatial attention and visuomotor coordination. No direct autonomic role.' },
  inferiorparietal: { tags: ['interoception'], text: 'The temporoparietal junction (especially on the right) contributes to body ownership and the sense of embodiment, which is one channel of interoception alongside the insular channel. Indirectly autonomic.' },
  supramarginal: { tags: ['none'], text: 'Phonological and ideomotor functions. No direct autonomic role.' },
  postcentral: { tags: ['none'], text: 'Primary somatosensory cortex. Tactile sensation from the body surface, not visceral sensation — the latter goes to the insula via different pathways. Not autonomic.' },
  precuneus: { tags: ['modulator'], text: 'A hub of the default mode network. Self-referential thought, especially negative rumination, tracks with both default-mode activity and elevated sympathetic tone — one of the mechanisms by which worry is also a body state.' },

  // ---- temporal lobe ----
  superiortemporal: { tags: ['none'], text: 'Auditory cortex and language comprehension. Not directly autonomic.' },
  middletemporal: { tags: ['none'], text: 'Visual motion (area MT) and semantic memory. Not autonomic.' },
  inferiortemporal: { tags: ['none'], text: 'High-level visual recognition — objects, faces, categories. Not autonomic.' },
  bankssts: { tags: ['none'], text: 'Multimodal language and biological-motion processing. Not autonomic.' },
  fusiform: { tags: ['none'], text: 'Face and visual-word-form processing. Indirectly relevant: faces are powerful triggers of autonomic responses through downstream amygdala activation, but the fusiform itself is recognition, not regulation.' },
  transversetemporal: { tags: ['none'], text: 'Primary auditory cortex (Heschl gyrus). Not autonomic.' },
  entorhinal: { tags: ['hpa'], text: 'Gateway between the rest of cortex and the hippocampus. Carries information that the hippocampus uses for context-dependent regulation of the HPA axis. The earliest region to show Alzheimer pathology.' },
  parahippocampal: { tags: ['hpa'], text: 'Scene processing and context-dependent memory. Through its hippocampal connectivity it contributes to the contextual regulation of the stress response.' },
  temporalpole: { tags: ['modulator'], text: 'A semantic memory hub closely tied to social cognition and emotional context. It feeds the amygdala the meaning of social and emotional stimuli.' },

  // ---- occipital lobe ----
  lateraloccipital: { tags: ['none'], text: 'Object shape processing. Not autonomic.' },
  lingual: { tags: ['none'], text: 'Visual processing of the upper visual field. Not autonomic.' },
  pericalcarine: { tags: ['none'], text: 'Primary visual cortex (V1). Not autonomic — though the visual scene is the trigger for many autonomic responses downstream.' },
  cuneus: { tags: ['none'], text: 'Early visual cortex (lower visual field). Not autonomic.' },

  // ---- cingulate ----
  rostralanteriorcingulate: { tags: ['parasympathetic', 'modulator'], text: 'The forward portion of the ACC — heavily implicated in affective regulation and a deep-brain-stimulation target in treatment-resistant depression. It directly projects to autonomic centers and modulates heart-rate variability, blood pressure, and the felt unpleasantness of pain.' },
  caudalanteriorcingulate: { tags: ['sympathetic', 'modulator'], text: 'The posterior portion of the ACC, more involved in conflict monitoring, error detection, and effortful cognitive control — situations that engage sympathetic arousal. With the anterior insula, this region forms the salience network that decides what gets cortical attention.' },
  posteriorcingulate: { tags: ['modulator'], text: 'A central hub of the default mode network. The default mode is associated with self-referential thought and autobiographical memory, and it correlates with parasympathetic-leaning relaxed wakefulness — but rumination in this network is also associated with sustained sympathetic tone, so the relationship is bidirectional.' },
  isthmuscingulate: { tags: ['none'], text: 'Bridge between posterior cingulate and parahippocampal cortex. Memory-related; minimal direct autonomic role.' },

  // ---- insula ----
  // (The Desikan "insula" label is the same anatomical region as our BP3D 'insula' — see that entry. Including a per-hemisphere note here for completeness.)
  insula: { tags: ['interoception', 'modulator'], text: 'The cortical map of inside the body. Posterior insula receives raw interoceptive signals from the NTS via the thalamus; anterior insula hosts the felt awareness of body state. Right anterior insula in particular is one of the most consistent neural correlates of interoceptive accuracy and is enlarged in long-term meditators.' },
};

/**
 * Resolve an autonomic note for a region id. Looks in AUTONOMIC_NOTES first
 * (specific override), then falls back to a Desikan-region match for
 * fsaverage parcellation ids like fsavg-L-insula.
 */
export function getAutonomicNote(regionId: string): AutonomicNote | undefined {
  if (AUTONOMIC_NOTES[regionId]) return AUTONOMIC_NOTES[regionId];

  // fsaverage region pattern: fsavg-{L|R}-{desikanname}
  const m = regionId.match(/^fsavg-[LR]-(.+)$/);
  if (m) {
    const desikan = m[1];
    return DESIKAN_AUTONOMIC[desikan];
  }
  return undefined;
}
