// Long-form essays attached to individual regions.
// Keyed by the `essay` slug in lib/regions.ts.

import type { ReactNode } from 'react';

export interface RegionEssay {
  slug: string;
  title: string;
  tag: string;
  tint: string;
  body: ReactNode;
}

export const REGION_ESSAYS: Record<string, RegionEssay> = {
  'frontal-lobe': {
    slug: 'frontal-lobe',
    title: 'The Frontal Lobe',
    tag: 'Cerebral Cortex',
    tint: '#e89aa3',
    body: (
      <>
        <p>
          The frontal lobe is the largest of the four cortical lobes and the
          one that has expanded most dramatically across primate evolution.
          It is everything from the central sulcus forward — roughly a third
          of the cortex by volume, with the prefrontal cortex (the part in
          front of the motor strip) accounting for most of the expansion.
        </p>
        <h2>Four functional zones</h2>
        <p>
          From back to front: the <strong>primary motor cortex</strong> sits
          on the precentral gyrus, with each part of the body mapped along
          its surface — the famous &quot;motor homunculus,&quot; with hands
          and lips disproportionately large because of how finely we control
          them. In front of that is <strong>premotor and supplementary
          motor cortex</strong>, which plans movements before they execute.
          Then <strong>dorsolateral prefrontal cortex</strong>, which holds
          information in mind, manipulates it, and decides between options.
          And finally <strong>orbitofrontal and ventromedial prefrontal
          cortex</strong>, sitting just above the eyes, which integrate
          emotion and value into decisions.
        </p>
        <h2>The executive functions</h2>
        <p>
          &quot;Executive function&quot; is a catch-all term for the things
          the prefrontal cortex makes possible: planning, working memory,
          inhibition of impulses, cognitive flexibility, sustained attention,
          and the running of internal goals. The classic case is Phineas
          Gage, whose orbitofrontal cortex was destroyed by an iron bar in
          1848; his intellect and language survived, but his judgment, his
          impulse control, and the part of him that had been a reliable
          husband and worker did not.
        </p>
        <h2>The slow developer</h2>
        <p>
          The prefrontal cortex is the last region of the brain to fully
          mature. Myelination of its long-range connections continues into
          the mid-twenties. Adolescents are not failing at adulthood; they
          are running on an incomplete frontal lobe by design — high
          motivation and high plasticity, low restraint. That is when
          learning happens. That is also when accidents happen.
        </p>
      </>
    ),
  },

  'parietal-lobe': {
    slug: 'parietal-lobe',
    title: 'The Parietal Lobe',
    tag: 'Cerebral Cortex',
    tint: '#f0a878',
    body: (
      <>
        <p>
          The parietal lobe is the part of the cortex that knows where things
          are. It contains the somatosensory cortex — your body&apos;s map of
          itself, mirroring the motor strip on the far side of the central
          sulcus — and the posterior parietal areas that build the larger
          space your body sits inside.
        </p>
        <h2>Body and space</h2>
        <p>
          Damage to the right parietal lobe produces hemispatial neglect:
          patients ignore the left half of the world, including the left half
          of their own body. They will eat from only one side of a plate,
          shave only one side of a face, draw only the right side of a clock
          and put all twelve numbers there. They are not blind to that side.
          They are not <em>aware</em> of it as a place where attention can go.
        </p>
        <h2>Number and abstraction</h2>
        <p>
          The intraparietal sulcus contains the brain&apos;s most reliable
          number system — an approximate, magnitude-based representation
          that you share with infants and crows. Symbolic mathematics is
          built on top of this older substrate. Calculation lights up the
          parietal lobes bilaterally, alongside frontal regions.
        </p>
        <h2>What it integrates</h2>
        <p>
          Vision arrives from the occipital lobe. Touch and proprioception
          arrive from the body. Auditory localization arrives from the
          temporal lobe. The parietal lobe is where these streams come
          together into a unified, action-ready sense of where everything is
          — including you.
        </p>
      </>
    ),
  },

  'occipital-lobe': {
    slug: 'occipital-lobe',
    title: 'The Occipital Lobe',
    tag: 'Cerebral Cortex',
    tint: '#e8b04a',
    body: (
      <>
        <p>
          Almost the entire back of the brain is given over to vision. The
          occipital lobe is the smallest of the four lobes by volume but the
          most monomaniacally specialized.
        </p>
        <h2>From retina to cortex</h2>
        <p>
          Light hits the retina; signals run down the optic nerve; they
          pass through a switching point (the optic chiasm), where fibers
          carrying the left visual field cross to the right hemisphere and
          vice versa. They synapse in the lateral geniculate nucleus of the
          thalamus and then arrive in primary visual cortex — V1 — on the
          medial surface of the occipital lobe.
        </p>
        <h2>What V1 does, what comes next</h2>
        <p>
          V1 represents edges, orientations, spatial frequencies. From there,
          two great streams diverge. The <em>ventral stream</em> runs forward
          into the temporal lobe — the &quot;what&quot; pathway — building
          recognition of objects, faces, and scenes. The <em>dorsal
          stream</em> runs upward into the parietal lobe — the
          &quot;where&quot; and &quot;how&quot; pathway — encoding motion,
          spatial layout, and action-relevant geometry.
        </p>
        <p>
          Damage to V1 produces cortical blindness in the corresponding part
          of the visual field — and yet, in a phenomenon called blindsight,
          some patients can still respond accurately to stimuli they
          consciously report not seeing. The brain&apos;s visual processing
          is older and more layered than awareness alone.
        </p>
      </>
    ),
  },

  'temporal-lobe': {
    slug: 'temporal-lobe',
    title: 'The Temporal Lobes',
    tag: 'Cerebral Cortex',
    tint: '#7a9461',
    body: (
      <>
        <p>
          The temporal lobes hang below the lateral sulcus, one on each side,
          behind the temples. They are where hearing happens, where language
          becomes meaning, where you recognize a face as someone you know.
        </p>
        <h2>Sound and language</h2>
        <p>
          Primary auditory cortex is on the upper surface of the temporal
          lobe (Heschl&apos;s gyrus). Around it spread association areas that
          extract pitch, rhythm, and timbre. In the dominant hemisphere
          (typically left), this auditory machinery feeds into Wernicke&apos;s
          area, which extracts meaning from speech. Damage there produces a
          fluent but empty speech — sentences that have grammatical shape but
          carry no content — and a failure to comprehend what others say.
        </p>
        <h2>Memory&apos;s gateway</h2>
        <p>
          On the inner (medial) surface of the temporal lobe lies the
          hippocampus, the structure most necessary for forming new episodic
          memories. The patient known as H.M., who had both medial temporal
          lobes removed to control epilepsy, could converse normally but
          could not form a single new lasting memory for more than fifty
          years. The temporal lobes are where the present becomes the past.
        </p>
        <h2>Faces, places, things</h2>
        <p>
          The fusiform gyrus on the underside of the temporal lobe contains
          specialized patches for recognizing faces (fusiform face area),
          places (parahippocampal place area), and bodies. Damage to the
          face area produces prosopagnosia: an inability to recognize
          familiar faces, including one&apos;s own.
        </p>
      </>
    ),
  },

  insula: {
    slug: 'insula',
    title: 'The Insular Cortex',
    tag: 'Cerebral Cortex',
    tint: '#4f8a8b',
    body: (
      <>
        <p>
          The insula is hidden. To see it you have to pull the temporal lobe
          down away from the frontal lobe — it lives folded deep inside the
          lateral sulcus, where it can be easy to miss in a casual diagram.
          For a long time it was thought to be a quiet bit of cortex. It is
          not. It is one of the most interesting regions in the brain.
        </p>
        <h2>The map of inside</h2>
        <p>
          The insula receives a continuous interoceptive map of the body:
          heartbeat, breath, gut tone, temperature, hunger, thirst, pain.
          The posterior insula gets the raw signal. As you move forward
          through the insula it becomes increasingly abstract, until in the
          right anterior insula it appears to host the felt sense of how
          you are doing as a body that wants things.
        </p>
        <h2>Empathy and disgust</h2>
        <p>
          The anterior insula activates both when you feel disgust yourself
          and when you watch someone else feel it. It activates both when
          you are in pain and when someone you love is. It is one of the
          better-studied substrates of empathy, in the literal sense of
          feeling what another person is feeling.
        </p>
        <h2>Why meditators care</h2>
        <p>
          People with consistent contemplative practice — long-term
          meditators, some musicians, some dancers — show measurably
          larger or more active insulae. Interoceptive awareness, in the
          lab and in life, is one of the most consistently trainable
          capacities. The implication is striking: paying attention to the
          body, repeatedly, builds the part of the brain that pays
          attention to the body.
        </p>
      </>
    ),
  },

  'anterior-cingulate': {
    slug: 'anterior-cingulate',
    title: 'The Anterior Cingulate Cortex',
    tag: 'Cerebral Cortex',
    tint: '#8a6fa3',
    body: (
      <>
        <p>
          The cingulate cortex is a long belt of cortex curved around the
          corpus callosum on the midline of each hemisphere. The anterior
          part is one of the busiest pieces of real estate in the brain. It
          touches emotion, attention, effort, pain, and autonomic control,
          and it does so in a way that suggests these are not as separate
          as we usually pretend.
        </p>
        <h2>Where things hurt</h2>
        <p>
          The ACC is involved in the affective component of pain — not the
          sensation itself, which arrives in the somatosensory cortex, but
          the unpleasantness of it, the suffering. Patients given cingulotomies
          for intractable pain often report that they still feel the pain
          but it no longer bothers them. The same region activates when
          people experience social rejection. The cliché that being excluded
          &quot;hurts&quot; is, neurally, less of a metaphor than you might
          assume.
        </p>
        <h2>Effort and conflict</h2>
        <p>
          The ACC tracks how much effort a task is taking and signals when
          something has gone wrong — when a response is incorrect, when
          competing impulses must be resolved, when attention needs to be
          renewed. Together with the anterior insula, it forms the core of
          the salience network — the system that decides what the brain
          should attend to next.
        </p>
        <h2>Body and self</h2>
        <p>
          The ACC has dense connections to the autonomic centers in the
          hypothalamus and brainstem. It is one of the cortical regions
          that can directly modulate heart rate, blood pressure, and
          arousal. This is why states of effortful focus, emotional
          intensity, and physical exertion share so much of their
          phenomenology: the same circuitry is running.
        </p>
      </>
    ),
  },

  hippocampus: {
    slug: 'hippocampus',
    title: 'The Hippocampus',
    tag: 'Limbic System',
    tint: '#6b4869',
    body: (
      <>
        <p>
          Curved like a seahorse — which is what hippocampus means in Greek
          — and tucked into the medial temporal lobe, the hippocampus is
          where the present becomes the past. It is also, separately and
          relatedly, the brain&apos;s atlas of space.
        </p>
        <h2>Making memory</h2>
        <p>
          The hippocampus encodes episodic memories: the specific events of
          your life, in their context. It does not store them permanently.
          Over weeks and years, memories are consolidated out into the
          cortex, and the hippocampus becomes less necessary to retrieve
          them. Recent episodic memories are hippocampus-dependent;
          decades-old ones often are not. This is why someone with severe
          hippocampal damage can lose the ability to form new memories
          while retaining much of their childhood.
        </p>
        <h2>Place cells, grid cells, time cells</h2>
        <p>
          When a rat runs through a maze, individual hippocampal neurons
          fire when the rat is in a particular location and not others.
          These are place cells, and they tile the environment. Adjacent in
          the entorhinal cortex are grid cells, which fire on a hexagonal
          lattice that effectively serves as the brain&apos;s coordinate
          system. Time cells fire at specific intervals during a remembered
          experience. The same machinery seems to organize both <em>where</em>
          and <em>when</em>.
        </p>
        <h2>Plasticity and vulnerability</h2>
        <p>
          The hippocampus is unusually plastic — one of the only regions
          where new neurons appear in adult mammals. It is also unusually
          vulnerable. Chronic stress and elevated cortisol shrink it; the
          earliest physical signs of Alzheimer&apos;s disease appear in the
          entorhinal cortex and hippocampus; oxygen deprivation damages it
          before most other regions. Aerobic exercise, on the other hand,
          consistently increases its volume.
        </p>
      </>
    ),
  },

  amygdala: {
    slug: 'amygdala',
    title: 'The Amygdala',
    tag: 'Limbic System',
    tint: '#e89aa3',
    body: (
      <>
        <p>
          The amygdala is small, almond-shaped, paired (one on each side),
          and located deep in the medial temporal lobe, just in front of
          the hippocampus. Its reputation as the &quot;fear center&quot; is
          half right. It is the salience detector: the part of the brain
          that tags experiences as biologically important.
        </p>
        <h2>Speed</h2>
        <p>
          Sensory information can reach the amygdala faster than it can
          reach cortex. The classic example: you flinch from a snake-shaped
          stick before you have consciously identified what you flinched
          at. The pathway goes from thalamus to amygdala, bypassing slower
          cortical processing. The cost is a high false-positive rate —
          you flinch from many sticks. The benefit is that the false
          negatives, the actual snakes, do not kill you.
        </p>
        <h2>What it does</h2>
        <p>
          The amygdala learns associations between stimuli and emotional
          consequences — classical fear conditioning is one of the most
          studied phenomena in all of neuroscience. It also influences
          memory: events with high emotional weight get encoded more
          strongly, partly because the amygdala signals the nearby
          hippocampus to do so. It drives autonomic and endocrine arousal
          through the hypothalamus.
        </p>
        <h2>The prefrontal brake</h2>
        <p>
          The ventromedial prefrontal cortex can inhibit the amygdala. This
          is part of how you regulate fear: you reappraise a situation, and
          the cortical reappraisal damps amygdala activity. People with
          anxiety disorders tend to show stronger amygdala responses and
          weaker prefrontal regulation; trauma can produce a similar
          pattern. One of the things that effective psychotherapy seems to
          do, measurably, is strengthen this top-down regulation.
        </p>
      </>
    ),
  },

  'basal-ganglia': {
    slug: 'basal-ganglia',
    title: 'The Basal Ganglia',
    tag: 'Basal Ganglia',
    tint: '#f0a878',
    body: (
      <>
        <p>
          The basal ganglia are a set of deep nuclei — the caudate and
          putamen (together called the striatum), the globus pallidus, the
          subthalamic nucleus, and the substantia nigra. They sit beneath
          the cortex like the gears of a watch, and they do the unglamorous
          work of choosing which of many competing possibilities gets to
          happen next.
        </p>
        <h2>Action selection</h2>
        <p>
          At any moment you could move in many ways and think many
          thoughts. Most of them, you do not. The basal ganglia are part
          of how the brain says no. They sit in cortico-striato-thalamo-
          cortical loops: cortex proposes; striatum selects or suppresses;
          thalamus relays the surviving proposal back to cortex; cortex
          acts. Dopamine, from the substantia nigra and ventral tegmental
          area, tunes the gain on this selection process.
        </p>
        <h2>Habit and reward</h2>
        <p>
          The dorsal striatum is the substrate of habit — actions that
          have been repeated enough that they no longer require conscious
          deliberation. The ventral striatum (centered on the nucleus
          accumbens) is the substrate of motivation and reward — what makes
          something feel worth pursuing. Addictive drugs hijack this
          system by flooding it with dopamine directly.
        </p>
        <h2>When it breaks</h2>
        <p>
          Parkinson&apos;s disease is the death of dopamine-producing cells
          in the substantia nigra. The result is difficulty initiating
          movement, rigidity, tremor at rest, and a slowing of cognition.
          Huntington&apos;s disease attacks the striatum directly and
          produces involuntary movements and progressive cognitive
          decline. OCD involves abnormal loops between the striatum and
          orbitofrontal cortex.
        </p>
      </>
    ),
  },

  thalamus: {
    slug: 'thalamus',
    title: 'The Thalamus',
    tag: 'Diencephalon',
    tint: '#4f8a8b',
    body: (
      <>
        <p>
          The thalamus is the brain&apos;s central relay station. Two
          egg-shaped masses, one on each side, sitting at the top of the
          brainstem. Almost every sensory stream (vision, hearing, touch,
          taste — but not, interestingly, smell) passes through the thalamus
          on the way to cortex. So does motor control feedback from the
          cerebellum and basal ganglia.
        </p>
        <h2>Not a passive switchboard</h2>
        <p>
          The thalamus does not just pass signals through. It actively
          gates them. Whether you notice a sound depends on whether the
          thalamic neurons relaying it are firing in &quot;tonic mode&quot;
          (faithful transmission) or &quot;burst mode&quot; (heavily
          filtered). The thalamic reticular nucleus, a thin shell around
          the rest of the thalamus, is the gatekeeper.
        </p>
        <h2>Necessary for consciousness</h2>
        <p>
          The thalamocortical loop — the constant back-and-forth between
          thalamus and cortex — is one of the most consistent neural
          correlates of consciousness. When this loop is disrupted, as in
          deep sleep, anesthesia, or some forms of brain injury,
          consciousness shuts off even though the cortex itself is largely
          intact. Patients in the persistent vegetative state often have
          severely disrupted thalamocortical connectivity even when the
          cortex is structurally preserved.
        </p>
      </>
    ),
  },

  hypothalamus: {
    slug: 'hypothalamus',
    title: 'The Hypothalamus',
    tag: 'Diencephalon',
    tint: '#e8b04a',
    body: (
      <>
        <p>
          The hypothalamus is small — about the size of an almond — and it
          quietly runs your body. Temperature, hunger, thirst, sleep,
          circadian rhythm, sex, stress, blood pressure, water balance:
          all of these are integrated and regulated here.
        </p>
        <h2>The control room</h2>
        <p>
          The hypothalamus is a collection of nuclei, each with a
          specialty. The suprachiasmatic nucleus is the master circadian
          clock, set by light entering the eyes. The paraventricular
          nucleus controls cortisol release (through the HPA axis) and
          oxytocin. The arcuate nucleus regulates appetite, integrating
          signals from leptin (fat stores) and ghrelin (an empty stomach).
          The preoptic area regulates temperature and sleep onset.
          Mammillary bodies are involved in memory. And so on.
        </p>
        <h2>Two channels of output</h2>
        <p>
          The hypothalamus reaches the body in two ways. It sends neural
          signals to the brainstem and spinal cord that shape autonomic
          tone — sympathetic and parasympathetic output. And it controls
          the pituitary gland, which releases hormones that act on the
          adrenal glands, thyroid, gonads, kidneys, and many other tissues.
          Nervous system and endocrine system meet here.
        </p>
        <h2>Where stress lives</h2>
        <p>
          The hypothalamus is the substrate of the stress response. When
          the amygdala flags a threat, the hypothalamus drives the
          sympathetic system (fast, within seconds) and the HPA axis
          (slower, peaking in minutes; cortisol can stay elevated for
          hours). When the threat passes, parasympathetic and prefrontal
          inputs bring things down. Chronic stress is, in part, the
          failure of that down-regulation.
        </p>
      </>
    ),
  },

  medulla: {
    slug: 'medulla',
    title: 'The Medulla',
    tag: 'Brainstem',
    tint: '#a99e7e',
    body: (
      <>
        <p>
          The medulla oblongata is the lowest segment of the brainstem,
          continuous with the spinal cord. It is small. It is also where
          most of the things you need to stay alive are controlled.
        </p>
        <h2>The vital nuclei</h2>
        <p>
          Within the medulla live the cardiovascular control centers, the
          respiratory rhythm generator (the pre-Bötzinger complex), the
          swallowing and vomiting centers, and the nuclei of cranial nerves
          IX through XII — including the nucleus tractus solitarius (which
          receives visceral sensation) and the dorsal motor nucleus of the
          vagus (which sends parasympathetic output back out).
        </p>
        <h2>Why the crossover is here</h2>
        <p>
          On the front of the medulla, the corticospinal tracts cross. The
          motor signals from the left hemisphere of the cortex switch to
          the right side of the body, and vice versa. This is why a stroke
          in one hemisphere causes weakness on the opposite side of the
          body.
        </p>
        <h2>The thinnest margin</h2>
        <p>
          Damage to the medulla — from stroke, hemorrhage, trauma, or
          herniation — is often immediately fatal because of the loss of
          respiratory and cardiac control. The brainstem is where the
          dividing line between alive and not-alive is most physically
          located.
        </p>
      </>
    ),
  },

  cerebellum: {
    slug: 'cerebellum',
    title: 'The Cerebellum',
    tag: 'Cerebellum',
    tint: '#cfc7b1',
    body: (
      <>
        <p>
          The cerebellum sits underneath the back of the brain, tucked
          behind the brainstem. It is small in volume but extravagant in
          cells: it contains more than half of all the neurons in the
          brain, packed into a tightly folded sheet of cortex with a
          remarkably regular architecture.
        </p>
        <h2>Smoothing movement</h2>
        <p>
          The classical role of the cerebellum is in motor control:
          coordinating the timing and force of movements so they come out
          smooth, fluent, and accurate. Damage to the cerebellum produces
          ataxia — movements that are jerky, mis-aimed, and poorly timed.
          The cerebellum is what lets a pianist play in time, a surgeon
          tie a knot, a child reach for a cup without spilling it.
        </p>
        <h2>Forward models</h2>
        <p>
          The deeper theory of what the cerebellum does is that it builds
          and continually refines internal &quot;forward models&quot; — predictions
          of the sensory consequences of every action. When you move, the
          cerebellum predicts what you should feel; the difference between
          prediction and what actually happens is an error signal, used to
          adjust the next prediction. This is how motor skill is acquired.
          It is also how you cannot tickle yourself: the cerebellum predicts
          the sensation and cancels it.
        </p>
        <h2>Cognition and emotion</h2>
        <p>
          Recent decades have made it clear that the cerebellum is involved
          in more than motion. The same kind of predictive smoothing seems
          to apply to thought and emotion. Cerebellar damage produces a
          syndrome of subtle cognitive and emotional dysregulation — the
          rhythm of thinking and feeling is off, the way movement would
          be. The cerebellum may be the brain&apos;s timing coach for
          everything it does, not only for the body.
        </p>
      </>
    ),
  },

  'spinal-cord': {
    slug: 'spinal-cord',
    title: 'The Spinal Cord',
    tag: 'Spinal Cord',
    tint: '#cfc7b1',
    body: (
      <>
        <p>
          The spinal cord is the central nervous system below the foramen
          magnum. It is a cable about the thickness of a finger, running
          inside the vertebral column, with thirty-one pairs of nerve roots
          branching out at intervals — eight cervical, twelve thoracic,
          five lumbar, five sacral, and one coccygeal.
        </p>
        <h2>Up and down</h2>
        <p>
          The spinal cord carries motor commands down, from cortex through
          the corticospinal tracts to motor neurons that drive muscles. It
          carries sensation up, through several distinct pathways: the
          dorsal columns for fine touch and proprioception, the
          spinothalamic tract for pain and temperature. The pathways
          decussate (cross sides) at different levels, which has clinical
          consequences: a lesion at certain spots produces a characteristic
          mix of preserved and lost sensation on each side.
        </p>
        <h2>Reflex arcs</h2>
        <p>
          The cord also computes on its own. A stretch reflex — the knee
          jerk on the doctor&apos;s table — is a two-synapse loop entirely
          local to the cord. The withdrawal reflex from a hot stove
          happens before any signal reaches the brain. Walking is to a
          large extent generated by spinal central pattern generators that
          can produce rhythmic stepping even in a decerebrate animal.
        </p>
        <h2>The autonomic outflow</h2>
        <p>
          The cord is also the highway for autonomic output. Sympathetic
          fibers exit between T1 and L2 and run to the sympathetic chain
          alongside the vertebrae. Sacral parasympathetic fibers exit at
          S2–S4 and serve the lower abdominal organs, bladder, and sexual
          function.
        </p>
        <h2>Injury</h2>
        <p>
          A complete spinal cord injury at a high cervical level can
          paralyze almost the entire body and disable autonomic regulation
          below the lesion. Lower lesions produce more limited losses.
          The cord does not heal well; regeneration of central axons is
          one of the most active and humbling areas of neuroscience.
        </p>
      </>
    ),
  },

  'vagus-nerve': {
    slug: 'vagus-nerve',
    title: 'The Vagus Nerve',
    tag: 'Cranial Nerve X',
    tint: '#7a9461',
    body: (
      <>
        <p>
          See the long-form essay at <a href="/systems/vagus-nerve">/systems/vagus-nerve</a>.
        </p>
      </>
    ),
  },

  'gut-brain-axis': {
    slug: 'gut-brain-axis',
    title: 'The Gut–Brain Axis',
    tag: 'Enteric Nervous System',
    tint: '#f0a878',
    body: (
      <>
        <p>
          See the long-form essay at <a href="/systems/vagus-nerve">/systems/vagus-nerve</a>,
          which is where most of the gut–brain story lives.
        </p>
      </>
    ),
  },

  'autonomic-nervous-system': {
    slug: 'autonomic-nervous-system',
    title: 'The Autonomic Nervous System',
    tag: 'Two Branches',
    tint: '#e89aa3',
    body: (
      <>
        <p>
          See the long-form essay at <a href="/systems/autonomic">/systems/autonomic</a>.
        </p>
      </>
    ),
  },

  consciousness: {
    slug: 'consciousness',
    title: 'Consciousness',
    tag: 'Awareness',
    tint: '#8a6fa3',
    body: (
      <>
        <p>
          See the long-form essay at <a href="/systems/consciousness">/systems/consciousness</a>.
        </p>
      </>
    ),
  },
};
