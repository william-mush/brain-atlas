import EssayLayout from '@/components/EssayLayout';
import EvidenceTag from '@/components/EvidenceTag';
import Link from 'next/link';

export const metadata = {
  title: 'Samādhi · The Eight Limbs · The Brain Atlas',
};

export default function SamadhiPage() {
  return (
    <EssayLayout
      tag="Eighth Limb"
      tint="#8a6fa3"
      title="Samādhi — The Map Dissolves"
      subtitle="Not a region. Not even, strictly, a state. Network dissolution rather than network activation."
      related={[
        { href: '/awareness/dhyana', label: 'Dhyāna' },
        { href: '/awareness/advaita-shaivism', label: 'Advaita & Shaivism' },
        { href: '/awareness/synthesis', label: 'The Synthesis' },
        { href: '/awareness', label: 'Back to the Eight Limbs' },
      ]}
    >
      <p>
        <em>Samādhi</em> is the eighth limb, and it is where the
        editorial discipline of this whole project earns its keep. There
        is enormous temptation, on a page like this, to inflate. There
        is equal temptation, on a page like this, to flatten — to reduce
        samādhi to whatever the imaging can currently see. Both moves
        betray the material. The task is to say what can honestly be
        said, mark what cannot, and leave the rest for the reader to
        sit with.
      </p>

      <h2>What the Sūtras say</h2>

      <p>
        The classical description is that samādhi is the dissolution of
        the subject-object distinction. The meditator and the
        meditated-upon are no longer two. There is only the object —
        and even that language is misleading, because if there is no
        subject distinct from the object, &quot;object&quot; loses its
        usual meaning.
      </p>

      <p>
        Patañjali distinguishes several sub-types: <em>samprajñāta</em>{' '}
        (with conceptual content) and <em>asamprajñāta</em> (without
        conceptual content); <em>sabīja</em> (with seed) and{' '}
        <em>nirbīja</em> (without seed). The deeper distinctions need
        not concern us here. The structural claim across all sub-types
        is the same: at the depth of contemplative practice, the
        apparent self does not merely quiet. It is, briefly, not there.
      </p>

      <p>
        This is a claim about phenomenology, made by practitioners
        across many centuries, in many traditions, with remarkable
        consistency. It is not a claim about the absence of a brain.
        Practitioners come out of samādhi and report on it. The brain
        was running the whole time. What was missing, by report, was
        the felt structure of being someone running it.
      </p>

      <h2>What neuroscience can and cannot measure</h2>

      <p>
        Neuroscience cannot currently measure the absence of a felt
        self. It can measure brain activity, and it can correlate
        activity with reported experience, but the experience itself
        remains inaccessible to direct measurement. This is not a
        failure of imaging technology; it is the hard problem of
        consciousness, which no scan can dissolve.
        <EvidenceTag level="philosophical" />
      </p>

      <p>
        What neuroscience <em>can</em> measure is structural correlates
        of reported deep states. Three findings matter.
      </p>

      <p>
        First, in advanced practitioners, the default mode network —
        the substrate of self-referential thought — shows reduced
        activity during deep meditation, and the reduction extends
        beyond the meditation session into rest periods.{' '}
        <Link href="/compendium/brewer-dmn">Brewer 2011</Link>.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        Second, the usual anti-correlation between the default mode
        network and the executive control network — the two networks
        that normally trade off, one being active when the other is not —
        is reduced or absent during reported non-dual states.{' '}
        <Link href="/compendium/josipovic-nondual">Josipovic 2014</Link>.
        The networks that normally take turns are instead operating
        together, or perhaps neither is operating in its usual mode.
        <EvidenceTag level="suggestive" />
      </p>

      <p>
        Third, the networks that produce the sense of being a self
        located in a body — including the medial prefrontal cortex,
        the temporoparietal junction, and the insula — show reduced
        activity in advanced practitioners during deep states. The
        apparatus that normally constructs a located self is, in some
        measurable sense, less busy.
        <EvidenceTag level="suggestive" />
      </p>

      <h2>Network dissolution, not network activation</h2>

      <p>
        Putting the three findings together: samādhi appears to be
        characterized not by the activation of any particular region or
        network but by the <em>quieting</em> and <em>re-coupling</em> of
        the networks that normally produce the located self. The
        apparatus dissolves. Whatever remains is not located in any
        scan we can currently take.
        <EvidenceTag level="suggestive" />
      </p>

      <p>
        This is the most defensible neuroscientific claim about samādhi
        that the current literature supports. It is also the claim that
        most cleanly matches the phenomenological reports across
        contemplative traditions. The match is not proof — it is
        consistency, which is much weaker — but consistency between
        two completely independent methods of inquiry is worth noticing.
      </p>

      <h2>The visual argument</h2>

      <p>
        The 3D atlas in the explore view of this site lets you light up
        regions one at a time. Each of the earlier limbs in this wing
        points to specific anatomy:{' '}
        <Link href="/regions/insula">insula</Link> for interoception,{' '}
        <Link href="/regions/thalamus">thalamus</Link> for sensory
        gating, prefrontal regions for sustained attention. The map
        accumulates as the limbs progress.
      </p>

      <p>
        Samādhi does not point to a region. It points to the
        dissolution of the apparatus the earlier regions form. If the
        atlas had an &quot;awareness mode,&quot; clicking samādhi would
        not highlight new structures. It would fade the highlights
        already in place. The map dissolves.
      </p>

      <p>
        This is not a stylistic flourish. It is the structural argument
        of the whole framework, made visually. The earlier limbs train
        specific networks; samādhi is what is left when those networks
        no longer produce their usual constructions. The map is not the
        territory, and at the eighth limb the map and the territory
        come apart in the most explicit possible way.
      </p>

      <h2>The hard problem, briefly and honestly</h2>

      <p>
        The hard problem of consciousness — why there is something it
        is like to be a brain at all — is not solved by anything in
        this essay. The eight limbs describe what awareness <em>does</em>{' '}
        when it is trained. They do not explain what awareness{' '}
        <em>is</em>. Samādhi, on a strict reading, is a state in which
        the usual constructions of self quiet enough that whatever lies
        beneath them becomes more nakedly available. What lies beneath
        them is the hard problem.
      </p>

      <p>
        Different traditions name it differently —{' '}
        <em><Link href="/compendium/sakshi">sākṣī</Link></em> in
        Advaita, the pure recognition of{' '}
        <em><Link href="/compendium/pratyabhijna">pratyabhijñā</Link></em>{' '}
        in Kashmir Shaivism, <em>puruṣa</em> in Sāṃkhya, the
        original mind in Zen. The naming is theology; the pointing-at
        is phenomenology; the existence of the thing pointed at is a
        philosophical claim no scan will settle.
        <EvidenceTag level="philosophical" />
      </p>

      <h2>The honest summary</h2>

      <p>
        Samādhi, as described by Patañjali and the broader contemplative
        tradition, is the dissolution of the subject-object structure of
        experience. Neuroscience cannot measure this directly. It can
        measure the structural correlates — the quieting of networks
        that normally produce the located self, the altered coupling
        between networks that normally trade off. The correlates are
        consistent with the phenomenological reports. The reports are
        consistent across traditions. The convergence is real and
        unexplained.
      </p>

      <p>
        The eighth limb is what the practice is for. It is also, in a
        precise sense, what the practice is not — the moment at which
        the practitioner is no longer the practitioner and the practice
        is no longer the practice. The map dissolves. Whatever remains
        is not what this essay is about. It is what the essay has been
        pointing at, all along, from a distance the essay cannot close.
      </p>
    </EssayLayout>
  );
}
