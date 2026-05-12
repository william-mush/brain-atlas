import EssayLayout from '@/components/EssayLayout';
import EvidenceTag from '@/components/EvidenceTag';
import Link from 'next/link';

export const metadata = {
  title: 'The Eight Limbs as a Map of Awareness · Synthesis · The Brain Atlas',
};

export default function SynthesisPage() {
  return (
    <EssayLayout
      tag="Synthesis"
      tint="#8a6fa3"
      title="The Eight Limbs as a Map of Awareness"
      subtitle="A neuroanatomical reading of Patañjali, with honest seams."
      related={[
        { href: '/awareness', label: 'The Eight Limbs' },
        { href: '/awareness/pranayama', label: 'Prāṇāyāma' },
        { href: '/compendium', label: 'The Compendium' },
        { href: '/systems/consciousness', label: 'What "Conscious" Even Means' },
      ]}
    >
      <p>
        Patañjali compiled the <em>Yoga Sūtras</em> around 400 BCE. He had
        no MRI. He had a population of practitioners, a method of
        introspection refined across centuries, and the patience to write
        down what he found. He produced a model of mind that, in its
        structural claims, is now partially testable by instruments that
        did not exist for two millennia after his death.
      </p>

      <p>
        This essay does not argue that Patañjali &quot;knew
        neuroscience.&quot; That claim is anachronistic and unfalsifiable
        and would embarrass both traditions. The claim is weaker and more
        interesting: two vocabularies — one developed by sustained
        first-person inquiry, one by third-person measurement — appear to
        be converging on the same architecture from opposite sides. Where
        they converge, both gain credibility. Where they diverge, the
        divergence is informative.
      </p>

      <p>
        Throughout this essay, every substantive claim is tagged for
        evidence. <strong>Evidenced</strong>
        <EvidenceTag level="evidenced" /> means the claim is supported by
        replicated empirical findings. <strong>Suggestive</strong>
        <EvidenceTag level="suggestive" /> means the claim is consistent
        with current data but rests on small samples, contested
        mechanisms, or analogical inference. <strong>Philosophical</strong>
        <EvidenceTag level="philosophical" /> means the claim is best held
        as a way of speaking about experience; no scan will settle it. The
        tags are not hedges. They are the editorial discipline that keeps
        a paper like this honest.
      </p>

      <h2>Awareness is layered, not unitary</h2>

      <p>
        The single most important move in this essay is reframing the
        eight limbs. The conventional reading treats them as stages on a
        ladder: you complete the yamas before moving to the niyamas before
        moving to āsana, and so on, until samādhi at the top. That reading
        is not wrong, but it misses what is most useful.
      </p>

      <p>
        Read instead as a <em>stack</em>. The eight limbs name eight
        layers of the nervous-system substrate that produce awareness.
        Each layer must be in some workable state for the next layer&apos;s
        work to be possible — not perfect, but workable. The ethical limbs
        set a noise floor. The postural limb settles the body. Prāṇāyāma
        tunes the autonomic state. Pratyāhāra closes the sensory gate.
        Dhāraṇā and dhyāna train attention. Samādhi is what remains when
        the apparatus that normally constructs a located self goes quiet.
      </p>

      <p>
        Modern neuroscience independently arrived at a similar layering.
        The <Link href="/systems/consciousness">existing essay on
        consciousness in this atlas</Link> lays out the structural
        version: wakefulness is a brainstem and thalamic phenomenon; the
        contents of awareness are a cortical phenomenon; the sense of being
        a self located in a body is an insular and parietal phenomenon;
        the sense that <em>this</em> matters right now is a salience-network
        phenomenon. None of these is the seat of consciousness. They are
        instruments in the same band.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        The eight limbs and the neuroscience of consciousness are saying
        roughly the same thing. Awareness is not one thing. It is a
        layered, modular, cultivable phenomenon — and the layers can be
        trained one at a time even though they end up acting together.
      </p>

      <h2>The ethical substrate — yamas and niyamas</h2>

      <p>
        The five <em>yamas</em> — <em>ahiṃsā</em> (non-harming),{' '}
        <em>satya</em> (truthfulness), <em>asteya</em> (non-stealing),{' '}
        <em>brahmacarya</em> (restraint), <em>aparigraha</em>{' '}
        (non-grasping) — and the five <em>niyamas</em> — <em>śauca</em>{' '}
        (purity), <em>santoṣa</em> (contentment), <em>tapas</em>{' '}
        (discipline), <em>svādhyāya</em> (self-study), <em>īśvara-
        praṇidhāna</em> (surrender to the divine) — are the limbs most
        often misread.
      </p>

      <p>
        They are not a moral code in the modern Western sense. They are
        not a list of commandments whose violation is punished. They are
        more usefully read as <strong>prerequisites for signal</strong>.
      </p>

      <p>
        The argument goes like this. Every later limb depends on the
        nervous system being available for training. A mind tangled in
        deception is not available, because deception requires constant
        simulation and maintenance of two parallel models of reality —
        what you said versus what is true. fMRI studies of lying show
        consistent prefrontal recruitment, and the act of lying is
        measurably slower than telling the truth.
        <EvidenceTag level="evidenced" /> A mind tangled in harm is not
        available, because harm produces ongoing threat-monitoring; the
        harmed party may retaliate, the action may be discovered. A mind
        tangled in grasping is not available, because grasping installs a
        permanent low-grade arousal — the thing must be obtained, the
        thing must be kept. Addiction research has mapped this kind of
        chronic craving onto sustained activity in the ventral striatum
        and persistent demands on executive control.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        Each yama and niyama, read this way, names a specific cognitive
        load that the practice asks you to remove. The ethical limbs do
        not make you a better person in some abstract moral sense — that
        is a side effect at best. They make your nervous system available
        for the work the later limbs ask it to do.
        <EvidenceTag level="suggestive" />
      </p>

      <p>
        This is a structural claim that goes deeper than it might first
        appear. Patañjali identified, through introspection across many
        practitioners and many decades, the specific cognitive loads that
        prevent contemplative training. Modern cognitive neuroscience,
        starting from entirely different problems, has independently
        identified the same loads. The convergence is striking even if it
        is not yet rigorously tested. There is, to my knowledge, no
        controlled trial of &quot;practice yamas, see what happens to
        meditation depth.&quot; The hypothesis is implicit in every
        traditional manual and has never been formally tested.
        <EvidenceTag level="philosophical" />
      </p>

      <h2>The body as known — āsana</h2>

      <p>
        Modern yoga has reduced āsana to physical posture, often with
        athletic ambitions. The Sūtras treat it as something narrower and
        more functional: <em>sthira-sukham āsanam</em>, the seat should be
        steady and comfortable. Āsana, in Patañjali, is what you do so
        that the body stops being the thing you are managing.
      </p>

      <p>
        The neuroanatomical correlates of sustained postural attention
        are well-characterized. Proprioception — your sense of the body&apos;s
        position in space — is carried up the dorsal columns, processed
        through the cerebellum and the thalamus, and represented
        cortically in primary somatosensory cortex and the posterior
        parietal regions that integrate body schema.
        <EvidenceTag level="evidenced" /> Sustained postural practice
        thickens and refines this representation. Long-term yoga
        practitioners show structural changes in somatosensory and
        cerebellar regions consistent with skill-learning effects in other
        domains.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        More importantly for what follows: āsana cultivates{' '}
        <Link href="/compendium/interoception">interoception</Link> — the
        felt sense of internal state — alongside proprioception. The body
        becomes known from the inside, not just located in space. The
        right anterior <Link href="/regions/insula">insula</Link>, the
        cortical seat of interoceptive integration, shows reliable
        structural and functional changes in long-term practitioners
        (<Link href="/compendium/lazar-2005">Lazar et al., 2005</Link>;{' '}
        <Link href="/compendium/farb-interoception">Farb et al.</Link>).
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        Patañjali&apos;s ordering matters. Āsana is third, after the
        ethical limbs and before prāṇāyāma. The body settles before the
        breath is regulated; the breath is regulated before attention is
        turned inward. The sequence reflects a real engineering
        constraint: you cannot productively work on interoceptive
        sensitivity if your body is in the way.
      </p>

      <h2>The subtle body — prāṇāyāma</h2>

      <p>
        This is the limb where the ancient and modern vocabularies meet
        most cleanly. The{' '}
        <Link href="/awareness/pranayama">dedicated page on prāṇāyāma</Link>{' '}
        treats this in full; the summary here is just enough to place it
        in the arc.
      </p>

      <p>
        Slow breathing at roughly six breaths per minute — a rate
        strikingly close to what most prāṇāyāma traditions converge on —
        produces a measurable cascade: respiratory sinus arrhythmia
        amplifies, heart-rate variability climbs, baroreflex sensitivity
        increases, and the parasympathetic nervous system takes over from
        the sympathetic (<Link href="/compendium/zaccaro-2018">Zaccaro
        et al., 2018</Link>; <Link href="/compendium/bernardi-2001">
        Bernardi et al., 2001</Link>).
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        The mechanism is the <Link href="/systems/vagus-nerve">vagus
        nerve</Link>. Roughly eighty percent of its fibers carry
        information up from the body to the brain, landing first in the
        nucleus tractus solitarius and projecting through the parabrachial
        nucleus and thalamus to the insula and anterior cingulate. This
        pathway is the physical route by which the body&apos;s state
        becomes available to conscious experience. Prāṇāyāma works on the
        front end of that pathway by changing what the body is doing.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        The traditional language describes prāṇāyāma as working on the{' '}
        <em>sūkṣma śarīra</em> — the subtle body — through{' '}
        <em>nāḍīs</em> and <em>cakras</em>. These are not anatomical
        structures. There is no nerve called <em>iḍā</em> and no plexus
        called the <em>maṇipūra cakra</em>.
        <EvidenceTag level="philosophical" /> But the language is not
        useless. The nāḍī and cakra system is a phenomenological map — a
        vocabulary refined for describing where in the body certain felt
        qualities of attention seem to be located. It is the inside-out
        view of what modern neuroscience now describes from the outside
        in: the body as a constantly updated source of conscious
        experience, with certain regions carrying more felt charge than
        others.
      </p>

      <h2>Closing the gate — pratyāhāra</h2>

      <p>
        Pratyāhāra is the fifth limb and the most often skipped in modern
        practice. Patañjali describes it as the withdrawal of the senses
        from their objects — the eyes no longer chasing the visual field,
        the ears no longer hooked by sound. It is not sensory deprivation;
        the senses still work. It is the cultivated turning-down of the
        sensory pull.
      </p>

      <p>
        The neuroanatomical correlate is thalamic gating. The thalamus is
        the brain&apos;s sensory relay: nearly all sensory input passes
        through it on the way to cortex. Thalamic gating is a real and
        well-characterized phenomenon — it is what allows sleep, what is
        disrupted in some forms of attentional disorder, and what
        modulates moment-to-moment attention even in waking states.
        <EvidenceTag level="evidenced" /> Pratyāhāra is, in effect, the
        voluntary cultivation of a process the brain does involuntarily
        every time you fall asleep.
      </p>

      <p>
        Why the limb is skipped in modern yoga is worth a sentence. Modern
        yoga is largely visual and externalized — performed in mirrors, in
        classes, in flows. Pratyāhāra cuts against all of that. It is the
        first limb where the work is no longer visible to anyone but the
        practitioner. The neuroscience matters here because it gives
        pratyāhāra back its weight: it is not a vague spiritual gesture.
        It is the necessary precondition for sustained attention, and
        modern attention research agrees.
        <EvidenceTag level="suggestive" />
      </p>

      <h2>One-pointedness — dhāraṇā</h2>

      <p>
        Dhāraṇā is the sixth limb and the limb modern cognitive
        neuroscience understands best. It is sustained selective attention
        on a single object — breath, mantra, image, sensation. The
        cognitive operation is straightforward in principle and famously
        hard in practice.
      </p>

      <p>
        The substrate is the executive control network: dorsolateral
        prefrontal cortex, posterior parietal cortex, and the connections
        between them.
        <EvidenceTag level="evidenced" /> Long-term meditators show
        structural thickening in this network and improved performance on
        attention tasks that would be hard for anyone else (the
        attentional blink paradigm, sustained vigilance tasks, working
        memory under interference).
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        Dhāraṇā is where the Western and Eastern vocabularies overlap most
        completely. The cognitive science of attention has independently
        described what classical yoga describes — and the description
        agrees in almost every detail, including the difficulty (the mind
        wanders within seconds), the trainability (practice produces
        durable improvements), and the structural cost (sustained
        attention is metabolically expensive and cannot be held
        indefinitely without rest).
      </p>

      <h2>Resting in attention — dhyāna</h2>

      <p>
        The shift from dhāraṇā to dhyāna is subtle but crucial. Dhāraṇā is
        the muscle. Dhyāna is when the muscle stops needing to work.
        Attention is still on the object, but no longer through effort —
        the practitioner is no longer holding attention, they are{' '}
        <em>resting in</em> it.
      </p>

      <p>
        The neural signature is a shift away from the effortful executive
        signature of dhāraṇā and toward decreased activity in the default
        mode network — particularly the posterior cingulate cortex, which
        is reliably implicated in self-referential thought and mind-
        wandering. <Link href="/compendium/brewer-dmn">Brewer et al.&apos;s
        2011 fMRI work</Link> on experienced meditators showed this
        signature clearly: less DMN activity during meditation, and a
        reduction that persisted even at rest.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        The traditional description is that dhyāna is &quot;an unbroken
        flow of awareness toward the object,&quot; and that the
        distinction between the meditator and the meditated-upon begins
        to blur. The neuroscience says something close: the network that
        normally constructs the experiencing self quiets, while the
        network that holds the object stays active. The subject-object
        boundary is, in effect, a network phenomenon. When the network
        quiets, the boundary thins.
      </p>

      <h2>The eighth limb — samādhi</h2>

      <p>
        Samādhi is where the essay has to be most careful, and where the
        editorial discipline of the evidence tags earns its keep.
      </p>

      <p>
        The Sūtras describe samādhi as the dissolution of the subject-
        object distinction — a state in which only the object remains,
        and the sense of being someone observing it has gone. There are
        further sub-classifications in the text (with and without seed,
        with and without form), but the central claim is the same: at the
        depths of contemplative practice, the apparent self does not
        merely quiet. It is, briefly, not there.
      </p>

      <p>
        Neuroscience cannot currently measure that. What it can measure
        is structural: in advanced practitioners, the networks that
        normally produce the sense of a located self show reduced
        activity, reduced inter-network anti-correlation, and altered
        coupling.{' '}
        <Link href="/compendium/josipovic-nondual">Josipovic&apos;s 2014
        imaging</Link> of Tibetan Buddhist practitioners during reported
        non-dual states found a striking finding: the usual anti-
        correlation between the default mode network and the executive
        network was reduced. The networks that normally trade off were
        instead operating together, or perhaps neither was operating in
        its usual mode.
        <EvidenceTag level="suggestive" />
      </p>

      <p>
        The honest summary is this: samādhi appears to be characterized
        not by activation of any particular region but by{' '}
        <em>network dissolution</em>. The apparatus that constructs the
        located self goes quiet. Whatever remains is not located in any
        scan we can currently take.
        <EvidenceTag level="suggestive" />
      </p>

      <p>
        This is also the right place to acknowledge a structural fact
        about the brain that may matter for the metaphysics. There is no
        region that is &quot;you.&quot; The sense of self is constructed,
        in real time, by the coordinated activity of multiple networks.
        Damage one part and a specific feature of the self goes — the
        body-ownership signal, the autobiographical memory, the moral
        agency. None of these is the self; all of them together make up
        what we call one. Samādhi is, on this reading, the temporary
        suspension of that construction.
      </p>

      <h2>The non-dual traditions — Advaita Vedānta and Kashmir Shaivism</h2>

      <p>
        Patañjali works inside <Link href="/compendium/samkhya">Sāṃkhya
        metaphysics</Link>: <em>puruṣa</em> (consciousness) and{' '}
        <em>prakṛti</em> (matter) are distinct, and liberation is the
        discriminative recognition that consciousness is not the
        modifications of mind. The non-dual traditions disagree.
      </p>

      <p>
        <Link href="/compendium/advaita-vedanta">Advaita Vedānta</Link>,
        systematized by{' '}
        <Link href="/compendium/shankara">Ādi Śaṅkara</Link> around 800 CE,
        takes the <em>via negativa</em>. The apparent self is{' '}
        <em>māyā</em> — illusion arising from ignorance. The witness
        (<em><Link href="/compendium/sakshi">sākṣī</Link></em>) is not a
        region, not a content, not even a state. It is whatever is{' '}
        <em>aware of</em> states. The structural prediction of Advaita is
        that contemplative practice should reveal the apparent self as
        unreal — that what looks like a person is, on closer inspection,
        simply awareness mistaken for something it is not.
        <EvidenceTag level="philosophical" />
      </p>

      <p>
        <Link href="/compendium/kashmir-shaivism">Kashmir Shaivism</Link>,
        synthesized by{' '}
        <Link href="/compendium/abhinavagupta">Abhinavagupta</Link> two
        centuries later, takes the <em>via positiva</em>. The self is
        real, but it is a recognition-event —{' '}
        <em><Link href="/compendium/pratyabhijna">pratyabhijñā</Link></em>,
        the moment in which awareness recognizes itself in what appears.
        The key term is{' '}
        <em><Link href="/compendium/spanda">spanda</Link></em>: the subtle
        pulsation by which awareness manifests as world. The Shaivite
        framework does not deny the self. It expands it.
        <EvidenceTag level="philosophical" />
      </p>

      <p>
        Both traditions are non-dualist. They disagree on what the
        non-duality looks like from the inside. And the disagreement
        matters for the neuroscience, in a way that is rarely noted.
      </p>

      <p>
        The neuroscience of self-as-network — the picture in which the
        apparent self is produced by the coordinated activity of multiple
        networks, no single one of which is the self — is more{' '}
        <em>consistent</em> with the Shaivite picture than the Advaitic
        one. Advaita says: the constructed self is illusion to be
        dissolved; only awareness remains. Shaivism says: the constructed
        self is awareness recognizing itself in form; it is real, it is
        beautiful, it is worth studying. The DMN does not go away in
        advanced meditators. It gets quieter, it re-organizes, and it
        comes back when meditation ends. That is a Shaivite picture more
        than an Advaitic one.
        <EvidenceTag level="suggestive" />
      </p>

      <p>
        This is not a claim that Shaivism is &quot;right&quot; and
        Advaita &quot;wrong.&quot; The metaphysics of both is{' '}
        <strong>philosophical</strong> in the strict sense — no scan will
        settle it. The structural predictions, however, are different,
        and only one of them survives contact with imaging data
        unmodified. That is worth noting.
      </p>

      <p>
        There is also a more speculative resonance worth mentioning and
        marking honestly. The spanda concept — awareness as pulsation —
        has an interesting kinship with the neuroscience of neural
        oscillation. Gamma binding, alpha rhythms, the thalamocortical
        sweep that produces the felt continuity of experience: the brain
        is in some real sense a rhythmic, pulsing organ, and conscious
        experience appears to ride on those rhythms. The kinship between
        spanda and the neuroscience of oscillation is{' '}
        <strong>suggestive at most</strong>. It is not an identity claim.
        It is a hint that the Shaivite intuition about the texture of
        awareness was not arbitrary.
        <EvidenceTag level="suggestive" />
      </p>

      <h2>What this framework is good for</h2>

      <p>
        Three audiences come away with different things.
      </p>

      <p>
        For practitioners: a clearer model of why the limbs are in the
        order they are. The sequence is not ceremonial. It is structural,
        and the structure has, at this point, been partially confirmed
        from the outside. Practitioners can take the order seriously
        without taking it on faith.
      </p>

      <p>
        For neuroscientists: a phenomenological taxonomy refined over
        centuries, available as a hypothesis source. Patañjali had no
        instruments and twenty-four centuries less data. He still
        identified — by introspection across many practitioners and many
        decades — distinctions that modern neuroscience has independently
        re-derived. The eight-limb framework is, at minimum, a serious
        proposal for which states are worth measuring and in what order.
      </p>

      <p>
        For the curious general reader: a worked example of how to take an
        ancient framework seriously without either dismissing it or
        inflating it. The yamas/niyamas are not metaphysics about good
        and evil. Prāṇāyāma is not magic. Samādhi is not literally union
        with God, in any sense a scan could falsify. But none of these
        are nothing, either. Each one names something real about what
        nervous systems do, and the doing is cultivable.
      </p>

      <h2>The map dissolves</h2>

      <p>
        This essay has been a map. The map is not the territory. Patañjali
        knew this; the Sūtras famously refuse to describe samādhi
        positively, because positive description would substitute a
        concept for the state. Modern neuroscience also knows this; no
        scan of a meditator is a meditation, and the felt quality of
        sustained attention is not the same as the imaging signature of
        it.
      </p>

      <p>
        What this essay has tried to do is something more modest. It has
        tried to show that the eight limbs name layers of awareness that
        are real, separable, and partly trainable; that modern
        neuroscience has independently identified the same layers; that
        the two vocabularies, used carefully, illuminate each other; and
        that the highest states described by the contemplative tradition
        are characterized — to the extent we can characterize them at all
        — by the quieting and dissolution of the apparatus that normally
        produces the sense of being someone.
      </p>

      <p>
        Honest answer, still: nobody knows what is doing the experiencing.
        The eight limbs do not solve the hard problem of consciousness.
        They do something humbler and more useful — they describe what
        awareness <em>does</em> when it is trained, and they offer a
        protocol for training it. Two and a half millennia later, that
        protocol is still the most carefully worked-out method we have.
        It deserves to be taken seriously, including by the science that
        is now in a position to test parts of it.
      </p>
    </EssayLayout>
  );
}
