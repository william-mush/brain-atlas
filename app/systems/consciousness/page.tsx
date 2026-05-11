import EssayLayout from '@/components/EssayLayout';

export const metadata = { title: 'Consciousness · The Brain Atlas' };

export default function ConsciousnessPage() {
  return (
    <EssayLayout
      tag="Awareness"
      tint="#8a6fa3"
      title="What &lsquo;Conscious&rsquo; Even Means"
      subtitle="Wakefulness and content are two different things, made by two different systems."
      related={[
        { href: '/systems/time', label: 'Which Part is in Charge Now' },
        { href: '/systems/hemispheres', label: 'Hemispheres' },
        { href: '/regions/thalamus', label: 'The Thalamus' },
      ]}
    >
      <p>
        &quot;Consciousness&quot; is a word that does too many jobs at once.
        In neuroscience it usually splits into at least two: the
        <em> level</em> of consciousness (are you awake, drowsy, asleep, in a
        coma?) and the <em>contents</em> of consciousness (what are you
        experiencing right now?). Different parts of the brain are
        responsible for each, and you can damage one while leaving the
        other intact.
      </p>

      <h2>The level: the reticular formation and the thalamus</h2>

      <p>
        Tucked through the core of the brainstem is a diffuse, almost net-
        like collection of nuclei called the reticular formation. Within it
        lives the ascending reticular activating system — a set of pathways
        that wake the cortex up. They use noradrenaline (from the locus
        coeruleus), serotonin (from the raphe nuclei), acetylcholine (from
        the pedunculopontine nucleus), and a few other transmitters. They
        project everywhere.
      </p>

      <p>
        Damage the reticular formation and a person enters coma even though
        the cortex is undamaged. The lights are on but no one is home — except
        in this case the lights are off. The thalamus is the second member
        of the wakefulness circuit. Sensory information funnels through it
        on the way to cortex; consciousness depends on that thalamocortical
        loop being awake and active. Patients in &quot;unresponsive
        wakefulness&quot; (the persistent vegetative state) often have
        intact brainstem arousal but severely disrupted thalamocortical
        connectivity.
      </p>

      <p>
        Sleep is not a passive failure of wakefulness. It is an active
        switching of these systems. The ventrolateral preoptic nucleus in
        the hypothalamus turns on at sleep onset and inhibits the arousal
        nuclei in the brainstem. The brainstem nuclei, in turn, inhibit the
        sleep nucleus when you are awake. Together they form a flip-flop
        switch — which is why sleep onset tends to be sudden and stable in
        each direction, rather than a gradual fade.
      </p>

      <h2>The contents: cortical assemblies, not single regions</h2>

      <p>
        When you are conscious of seeing a red apple, the corresponding
        activity in your brain is not a flash in some &quot;apple region.&quot;
        It is a coordinated pattern across many cortical areas — color in
        one, shape in another, association with the word in a third,
        smell-memory of an apple in a fourth — bound together by long-range
        synchrony.
      </p>

      <p>
        Two influential families of theories try to say what binding is.
      </p>

      <ul>
        <li>
          <strong>Global Workspace Theory</strong> (Bernard Baars, Stanislas
          Dehaene) says consciousness happens when a piece of information is
          broadcast widely across the cortex, becoming available to working
          memory, decision-making, language, and so on. The signature is a
          late, widespread spike of activity, especially in fronto-parietal
          networks, around 300 ms after the stimulus.
        </li>
        <li>
          <strong>Integrated Information Theory</strong> (Giulio Tononi)
          starts from the experience itself and works backward. It says
          that a system is conscious to the degree that it integrates
          information in a way that cannot be decomposed into independent
          parts — a quantity called Φ (phi). On this view consciousness is a
          structural property of certain networks, not a process they run.
        </li>
      </ul>

      <p>
        These theories make different predictions, and the field is
        genuinely arguing about them. They agree on something useful: cortex
        matters most, but it matters as a connected whole, not as a list of
        modules.
      </p>

      <h2>Three large-scale networks</h2>

      <p>
        Functional brain imaging has consistently picked out a small number
        of large-scale networks that seem to take turns running the show.
      </p>

      <ul>
        <li>
          <strong>The default mode network.</strong> Active when you are not
          focused on the outside world — daydreaming, remembering, thinking
          about other people, simulating the future. Centered on the medial
          prefrontal cortex, the posterior cingulate, and the
          inferior parietal lobule.
        </li>
        <li>
          <strong>The executive control network.</strong> Active when you
          deliberately focus on a task. Centered on the dorsolateral
          prefrontal cortex and the posterior parietal cortex.
        </li>
        <li>
          <strong>The salience network.</strong> A switching network that
          decides, moment by moment, whether to hand control to the default
          mode network or the executive network. Centered on the anterior
          insula and the anterior cingulate cortex.
        </li>
      </ul>

      <p>
        At any given moment, one of these networks tends to be in charge.
        Pay attention to the kind of attention you have, and you can almost
        feel the switching. A blank gaze out the window: default mode. A
        sudden refocus on this sentence: executive. The little jolt that
        moved you from one to the other: salience.
      </p>

      <h2>Where the body lives in this picture</h2>

      <p>
        The insula and anterior cingulate sit in the salience network. They
        are also the cortical destinations of the vagal afferent pathway.
        That is not a coincidence. Interoception — your felt sense of the
        body — is one of the major signals the salience network uses to
        decide what to attend to.
      </p>

      <p>
        Antonio Damasio&apos;s &quot;somatic marker&quot; idea, William
        James&apos; older theory of emotion, and the more recent work by
        Lisa Feldman Barrett all converge on roughly the same picture:
        the body&apos;s state is constantly shaping conscious experience,
        often below the threshold of explicit awareness, and the felt
        quality of every moment is partly the brain&apos;s interpretation
        of what the body is doing.
      </p>

      <h2>What is doing the experiencing?</h2>

      <p>
        Honest answer: nobody knows. The &quot;hard problem of
        consciousness&quot; — the question of why there is something it is
        like to be a brain at all — is a real philosophical problem and
        no neuroscientific result has yet dissolved it.
      </p>

      <p>
        What we can say is structural. Wakefulness is a brainstem and
        thalamic phenomenon. The contents of awareness are a large-scale
        cortical phenomenon. The sense of being a self located in a body is
        an insular and parietal phenomenon. The sense that <em>this</em> matters
        right now is a salience-network phenomenon. None of these is the
        seat of consciousness. They are all instruments in the same band.
      </p>

      <p>
        The most honest way to say it might be this: there is no part of
        the brain that is &quot;you.&quot; There is a brain that is busy
        producing &quot;you,&quot; freshly, every few hundred milliseconds.
      </p>
    </EssayLayout>
  );
}
