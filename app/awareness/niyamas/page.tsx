import EssayLayout from '@/components/EssayLayout';
import EvidenceTag from '@/components/EvidenceTag';
import Link from 'next/link';

export const metadata = {
  title: 'Niyamas · The Eight Limbs · The Brain Atlas',
};

export default function NiyamasPage() {
  return (
    <EssayLayout
      tag="Second Limb"
      tint="#f0a878"
      title="Niyamas — Orientation Before Training"
      subtitle="If the yamas remove load, the niyamas point attention. They are how you arrive."
      related={[
        { href: '/awareness/yamas', label: 'Yamas' },
        { href: '/awareness/asana', label: 'Āsana' },
        { href: '/awareness/synthesis', label: 'The Synthesis' },
        { href: '/awareness', label: 'Back to the Eight Limbs' },
      ]}
    >
      <p>
        The five <em>niyamas</em> are the second limb: <em>śauca</em>{' '}
        (purity, both physical and mental), <em>santoṣa</em>{' '}
        (contentment), <em>tapas</em> (disciplined effort, literally{' '}
        <em>heat</em>), <em>svādhyāya</em> (self-study, traditionally
        including study of scripture), and <em>īśvara-praṇidhāna</em>{' '}
        (surrender to or contemplation of the divine).
      </p>

      <p>
        Where the <Link href="/awareness/yamas">yamas</Link> are mostly{' '}
        <em>via negativa</em> — the things to refrain from — the niyamas
        are <em>via positiva</em>. They name orientations to cultivate.
        If the yamas remove load, the niyamas point attention. Together
        they describe what the practitioner brings to the mat before any
        physical practice begins.
      </p>

      <h2>Cleaning the channel — śauca</h2>

      <p>
        <em>Śauca</em> is the most physically literal of the niyamas:
        keep the body clean, keep the practice space clean, keep the food
        clean. The deeper reading extends to mental purity — the
        cultivation of clear thought, the avoidance of mental clutter.
      </p>

      <p>
        The structural function is the same as the yamas&apos;: load
        reduction. Physical cleanliness reduces the autonomic background
        signal — the body has less to attend to, less to be subtly
        distracted by. Mental cleanliness, in the sense Patañjali means,
        is the practice of not carrying yesterday&apos;s arguments,
        grievances, and unfinished thoughts into today&apos;s practice.
        <EvidenceTag level="suggestive" />
      </p>

      <h2>The hardest one — santoṣa</h2>

      <p>
        <em>Santoṣa</em>, contentment, is the niyama most often
        underestimated and most quietly demanding. It is not passivity.
        It is not resignation. It is the cultivated capacity to be at
        peace with current conditions without that peace depending on
        current conditions being any particular way.
      </p>

      <p>
        The cognitive neuroscience of this is interesting and
        underdeveloped. Persistent discontent — the felt sense that
        present conditions are wrong and need to change — recruits the
        same circuitry as grasping (see{' '}
        <Link href="/awareness/yamas">aparigraha</Link>). It is a
        sustained low-grade alarm. The cultivation of <em>santoṣa</em> is
        the dampening of that alarm, not by force but by sustained
        attention to what is actually present.
        <EvidenceTag level="suggestive" />
      </p>

      <p>
        Acceptance-based therapies — ACT, MBSR — work with something very
        close to <em>santoṣa</em>, and the evidence base for those
        therapies is real and replicated. The convergence is worth
        noting. Patañjali identified contentment as a precondition for
        contemplative depth. Modern clinical psychology has independently
        identified acceptance as a precondition for psychological
        flexibility.
        <EvidenceTag level="evidenced" />
      </p>

      <h2>Heat — tapas</h2>

      <p>
        <em>Tapas</em> literally means heat, and in the Sūtras it names
        the disciplined effort the practice requires. It is what you do
        when the practice is hard and you do it anyway. Translated as
        &quot;discipline&quot; it sounds austere; translated as
        &quot;burning effort&quot; it sounds dramatic. Both miss the
        functional point: <em>tapas</em> is the sustained application of
        effort over time.
      </p>

      <p>
        The neural correlate is the executive control network — the same
        substrate <Link href="/awareness/dharana">dhāraṇā</Link> later
        works with directly. <em>Tapas</em> trains the willingness to
        return to the practice when the practice is uncomfortable.
        Without it, the later limbs are not sustainable; the practitioner
        will leave the mat whenever the work becomes hard.
        <EvidenceTag level="suggestive" />
      </p>

      <h2>Self-study — svādhyāya</h2>

      <p>
        <em>Svādhyāya</em> traditionally has two senses: study of the
        sacred texts, and study of oneself. Modern readings tend to
        emphasize the second. The structural function is metacognitive —
        the practitioner cultivates the capacity to observe their own
        mind, to notice patterns of reactivity, to see the shape of
        their own conditioning.
      </p>

      <p>
        Metacognition has a reasonably well-characterized neural
        substrate — anterior prefrontal cortex, particularly the
        frontopolar regions, in coordination with the precuneus and
        medial prefrontal regions of the default mode network.
        <EvidenceTag level="evidenced" /> Practices that train
        metacognitive awareness — including many forms of meditation —
        produce measurable changes in these regions.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        <em>Svādhyāya</em> is, in this reading, the cultivation of the
        observer that <Link href="/awareness/dharana">dhāraṇā</Link>{' '}
        will later put to work. You cannot one-pointedly attend if you
        cannot notice when attention has wandered. The noticing is
        metacognition. The niyama is the practice that makes the
        noticing reliable.
      </p>

      <h2>Surrender — īśvara-praṇidhāna</h2>

      <p>
        <em>Īśvara-praṇidhāna</em> is the niyama hardest for modern
        secular readers, because it explicitly invokes a divine. The
        traditional translation is &quot;surrender to īśvara,&quot; where
        īśvara is variously translated as God, Lord, or the supreme self.
      </p>

      <p>
        Two ways to take this honestly. The theological reading takes the
        niyama at face value: practitioners cultivate devotion to a
        divine, and the devotion does work. The structural reading,
        useful for secular readers, is that <em>īśvara-praṇidhāna</em> is
        the practice of relinquishing the felt sense of being the
        manager of one&apos;s own life. The grasping after control is
        itself a cognitive load. Letting it go — by surrendering to a
        divine, or by surrendering to the practice itself, or by
        surrendering to what is — reduces the load.
        <EvidenceTag level="philosophical" />
      </p>

      <p>
        The Sūtras themselves are notably non-sectarian on this point.
        Patañjali does not require any specific theology. He observes
        that practitioners who cultivate this orientation reach the later
        limbs more reliably than those who do not. That is, in the
        framing of this essay, a structural observation rather than a
        theological one.
      </p>

      <h2>What the niyamas add to the yamas</h2>

      <p>
        The yamas remove specific loads. The niyamas add a specific
        orientation — toward cleanliness, contentment, sustained effort,
        self-knowledge, and surrender of control. Together they describe
        a nervous system that is both lighter and more focused than the
        baseline. The yamas have taken away what was costing too much.
        The niyamas have pointed what remains in a useful direction.
      </p>

      <p>
        Modern psychology has names for most of what the niyamas
        describe: acceptance, grit, metacognition, the relinquishing of
        control as a contributor to wellbeing. Each maps imperfectly onto
        a niyama; none is identical. The classical list is older and
        more specific to contemplative training. But the convergence is,
        again, striking. Two traditions, working on different problems,
        with different methods, twenty-four centuries apart, identified
        roughly the same set of orientations as preconditions for the
        kind of work they each cared about.
        <EvidenceTag level="suggestive" />
      </p>
    </EssayLayout>
  );
}
