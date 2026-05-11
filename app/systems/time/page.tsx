import EssayLayout from '@/components/EssayLayout';

export const metadata = { title: 'The Brain Over Time · The Brain Atlas' };

export default function TimePage() {
  return (
    <EssayLayout
      tag="Across the Day, Across a Life"
      tint="#e8b04a"
      title="Which Part of the Brain is in Charge Right Now"
      subtitle="The brain is not a unitary self. It is a rotating cast, on a schedule that runs from milliseconds to decades."
      related={[
        { href: '/systems/consciousness', label: 'Consciousness' },
        { href: '/systems/autonomic', label: 'Autonomic' },
      ]}
    >
      <p>
        It is worth taking seriously how strange a fact this is: the
        organ inside your head is not in the same state from one moment to
        the next. The networks that are dominant when you wake at 3 AM
        anxious about something are not the networks that are dominant when
        you finally fall back asleep, and neither are the networks that get
        you through a focused hour at 10 AM. Calling all of these
        states &quot;you&quot; is convenient. It is also a smoothing
        that hides a lot.
      </p>

      <h2>The fast cycle: seconds and minutes</h2>

      <p>
        At the shortest timescale, attention itself flickers. Microsaccades,
        attention shifts, working-memory refreshes — these happen many times
        a second. The salience network is doing constant triage: is this
        external thing more important than what I was just thinking about?
        Is this internal feeling worth promoting into awareness?
      </p>

      <p>
        Just above that, on the seconds-to-minutes scale, the three big
        large-scale networks take turns. The <em>default mode network</em>
        runs when you stop trying to do anything specific — daydreaming,
        remembering, simulating, ruminating. The <em>executive control
        network</em> takes over when you actively engage with a task. The
        <em> salience network</em> is the switch.
      </p>

      <p>
        Most people, untrained, spend a surprising fraction of their day in
        the default mode network. It is the substrate of mental time travel
        — replaying yesterday, rehearsing tomorrow, narrating yourself. It
        is also where a lot of suffering happens, which is why so many
        contemplative practices, when measured under a scanner, show as
        reduced default-mode activity.
      </p>

      <h2>The medium cycle: the day</h2>

      <p>
        Layered on top of network dynamics is a circadian rhythm orchestrated
        from a tiny nucleus in the hypothalamus: the suprachiasmatic
        nucleus. About 20,000 neurons, sitting just above the optic
        chiasm, sampling light through a specialized class of retinal
        cells. They set the master clock that propagates to nearly every
        cell in the body.
      </p>

      <p>
        Across a single day, predictably:
      </p>

      <ul>
        <li>
          <strong>Early morning:</strong> cortisol peaks. Sympathetic tone
          rises. The prefrontal cortex is, for most people, at its sharpest
          mid-morning.
        </li>
        <li>
          <strong>Early afternoon:</strong> a small dip in alertness as
          adenosine accumulates and core body temperature briefly falls.
          This is real, not a cultural artifact.
        </li>
        <li>
          <strong>Late afternoon and early evening:</strong> physical
          performance peaks. Reaction times are fastest. Body temperature
          is highest.
        </li>
        <li>
          <strong>Evening:</strong> melatonin begins to rise as light fades.
          The wakefulness systems quiet down. The sleep-promoting nucleus
          in the hypothalamus takes the floor.
        </li>
        <li>
          <strong>Night:</strong> through stages of non-REM sleep, the brain
          consolidates declarative memory and flushes metabolic waste
          (including amyloid-beta) through the glymphatic system. Through
          REM, the cortex is active, the body is paralyzed, and emotional
          memory in particular is reprocessed.
        </li>
      </ul>

      <p>
        Which part of the brain is &quot;in charge&quot; at 3 PM is simply
        not which part is in charge at 3 AM, even if 3 AM is also a waking
        moment. People with insomnia notice this directly: nighttime
        thinking has a different texture, a different gravitational pull
        toward fear and self-criticism. That is not imagination. It is the
        prefrontal cortex running at reduced gain while the amygdala is
        relatively unmuted.
      </p>

      <h2>The longer cycle: weeks, months, seasons</h2>

      <p>
        Hormonal cycles, seasonal light exposure, and life-stage hormonal
        shifts all change the baseline. Estrogen and progesterone interact
        with serotonin, dopamine, and GABA. Testosterone modulates
        amygdala reactivity. Thyroid hormone tunes the overall metabolic
        rate of every neuron in the brain. None of these set what you
        think; all of them shift the probability of certain kinds of
        thinking.
      </p>

      <h2>The slow cycle: the whole life</h2>

      <p>
        The brain develops back-to-front. The brainstem and the limbic
        system are nearly mature at birth — they have to be, because they
        keep an infant alive. The prefrontal cortex is the last to come
        online. White matter in the prefrontal cortex continues to mature
        into the mid-twenties. This is why adolescents are not
        small adults with bad judgment; they are adults running on different
        hardware. Salience and reward circuits mature ahead of executive
        control. The result is a years-long window of high motivation and
        relatively weak self-regulation, which is biologically rational —
        it is when people are supposed to leave home, form new bonds, and
        take risks — and clinically inconvenient.
      </p>

      <p>
        On the far end of life, the brain begins to lose volume slowly in
        most people, with the prefrontal cortex and the hippocampus
        leading. Reaction times and working-memory capacity decline.
        Crystallized knowledge, semantic memory, and emotional regulation
        often improve into the seventies. The contour of cognition shifts;
        it does not simply diminish.
      </p>

      <h2>Neuroplasticity: the brain that changes</h2>

      <p>
        A few decades ago the dogma was that adult brains do not change.
        That was wrong in detail and almost wrong in spirit. Synapses are
        constantly being added and pruned. The strength of existing
        connections is constantly being adjusted by experience. Some
        regions, like the hippocampus and the olfactory bulb, generate
        new neurons throughout adult life, though the rate slows.
      </p>

      <p>
        The interesting question is not whether the brain changes — it
        always changes — but what changes it. The honest list:
      </p>

      <ul>
        <li>
          <strong>Repeated practice</strong> — anything done seriously for
          months. Musicians have measurably enlarged motor and auditory
          regions. Taxi drivers learning London&apos;s streets show
          hippocampal growth.
        </li>
        <li>
          <strong>Aerobic exercise</strong> — one of the most robust
          interventions for hippocampal volume and BDNF levels.
        </li>
        <li>
          <strong>Sleep</strong> — not background to plasticity; one of the
          main occasions when plasticity actually consolidates.
        </li>
        <li>
          <strong>Sustained attention practices</strong> — meditation in
          its various flavors. Reliable effects on prefrontal cortex,
          anterior cingulate, insula, and default-mode connectivity. Effects
          show up in weeks of daily practice and are larger in long-term
          practitioners.
        </li>
        <li>
          <strong>Relationships</strong> — sustained close contact with
          other humans seems to be neurally protective in ways we do not
          fully understand and underestimate at our peril.
        </li>
        <li>
          <strong>Chronic stress and chronic inflammation</strong> — both
          measurably shrink hippocampus and prefrontal cortex.
        </li>
        <li>
          <strong>Trauma</strong> — alters amygdala–prefrontal balance in
          ways that often persist for years but are not permanent.
        </li>
      </ul>

      <h2>The cast of characters</h2>

      <p>
        If you had to crudely sketch &quot;who is in charge&quot; at
        different moments, it might look something like this:
      </p>

      <ul>
        <li>
          <strong>Threat:</strong> amygdala, hypothalamus, brainstem. The
          prefrontal cortex is offline within milliseconds. You are not
          deliberating; the body is deciding.
        </li>
        <li>
          <strong>Hunger:</strong> hypothalamus and vagal signals. The
          contents of consciousness narrow toward food.
        </li>
        <li>
          <strong>Focused work:</strong> dorsolateral prefrontal cortex,
          posterior parietal cortex, anterior cingulate. Executive control
          network running.
        </li>
        <li>
          <strong>Daydreaming:</strong> default mode network. Medial
          prefrontal, posterior cingulate, precuneus.
        </li>
        <li>
          <strong>Felt emotion:</strong> insula, anterior cingulate,
          amygdala. Salience network.
        </li>
        <li>
          <strong>Habitual action:</strong> dorsal striatum, with motor
          cortex executing. The prefrontal cortex is, deliberately, not
          intervening.
        </li>
        <li>
          <strong>Skilled movement:</strong> cerebellum, motor cortex,
          basal ganglia all coordinated; conscious deliberation is, again,
          mostly out of the way.
        </li>
        <li>
          <strong>Restful awareness in skilled meditators:</strong>
          unusually low default-mode activity, often with stable
          fronto-parietal engagement. Not &quot;blank&quot; — selectively
          balanced.
        </li>
      </ul>

      <p>
        The brain is not a single CEO. It is more like a chamber group with
        a conductor that keeps changing. Whoever is conducting at this
        moment is what you call &quot;yourself&quot; right now. An hour
        from now it will be someone slightly different.
      </p>

      <p>
        That is not a problem to be solved. It is the situation. The work
        of contemplative life, and of psychotherapy, and of growing up, and
        of growing old gracefully, is in some sense the work of getting
        familiar with the whole cast — and being a little less surprised by
        which one shows up.
      </p>
    </EssayLayout>
  );
}
