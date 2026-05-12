import EssayLayout from '@/components/EssayLayout';
import EvidenceTag from '@/components/EvidenceTag';
import Link from 'next/link';

export const metadata = {
  title: 'Dhyāna · The Eight Limbs · The Brain Atlas',
};

export default function DhyanaPage() {
  return (
    <EssayLayout
      tag="Seventh Limb"
      tint="#7a9461"
      title="Dhyāna — When Holding Becomes Resting"
      subtitle="The shift from gripping attention to being held by it has a measurable neural signature."
      related={[
        { href: '/awareness/dharana', label: 'Dhāraṇā' },
        { href: '/awareness/samadhi', label: 'Samādhi' },
        { href: '/awareness', label: 'Back to the Eight Limbs' },
      ]}
    >
      <p>
        <em>Dhyāna</em> is the seventh limb, and it is most usefully
        defined by its difference from the sixth.{' '}
        <Link href="/awareness/dharana">Dhāraṇā</Link> is the muscle of
        attention working. Dhyāna is what happens when the muscle stops
        needing to work — when attention is no longer held by effort but
        simply remains where it is.
      </p>

      <p>
        The Sūtras describe dhyāna as an unbroken flow of awareness
        toward the object, and they note that the distinction between
        the meditator and the meditated-upon begins to thin. This is
        not yet samādhi — there is still a meditator — but the
        subject-object structure that ordinary experience takes for
        granted is starting to loosen.
      </p>

      <h2>The neural signature</h2>

      <p>
        The shift from dhāraṇā to dhyāna has a measurable neural
        correlate, and it is one of the more striking findings in the
        contemplative neuroscience literature.
      </p>

      <p>
        <Link href="/compendium/brewer-dmn">Brewer et al.&apos;s 2011
        work</Link> on experienced meditators showed reduced activity in
        the default mode network — particularly the posterior cingulate
        cortex — during meditation. The reduction was sustained even at
        rest, suggesting durable changes in the network&apos;s baseline
        activity. The default mode network is the substrate of
        self-referential thought, mind-wandering, autobiographical
        memory, and the constant background construction of a felt
        self. When it quiets, the felt self quiets too.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        At the same time, the executive control network signature that
        characterizes dhāraṇā — heavy DLPFC engagement, the felt effort
        of holding attention — decreases. Attention is still on the
        object, but the effort of holding it has dropped. This is the
        precise neural signature of the experiential shift the Sūtras
        describe.
        <EvidenceTag level="evidenced" />
      </p>

      <h2>What &quot;resting in&quot; means, mechanistically</h2>

      <p>
        In dhāraṇā, the practitioner repeatedly notices that attention
        has wandered and brings it back. The cognitive load is real:
        every return is a small executive operation. In dhyāna, the
        returns become unnecessary because the wandering has largely
        stopped. The default mode network — the source of the wandering
        — has quieted enough that attention does not have to defend
        itself constantly.
      </p>

      <p>
        This is not a mystical state. It is a measurable shift in
        network balance. The network that normally produces self-
        referential drift is less active. The network that holds the
        object remains active but no longer needs to suppress the drift.
        Attention persists, with less work.
        <EvidenceTag level="suggestive" />
      </p>

      <h2>The thinning of the subject-object boundary</h2>

      <p>
        The classical description of dhyāna says the boundary between
        the meditator and the meditated-upon thins. This sounds
        mystical and is, in fact, a structural claim that current
        neuroscience can partially address.
      </p>

      <p>
        The sense of being a subject — a someone, located somewhere,
        looking at something — is constructed by networks that include
        the medial prefrontal cortex, the posterior cingulate, the
        temporoparietal junction, and the insula. None of these is
        &quot;the self&quot;; together they produce the felt structure
        of being one. When these networks quiet, what they normally
        produce also quiets. The practitioner does not stop existing,
        but the felt sense of being someone observing the breath
        becomes less pronounced.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        The Sūtras describe this in first-person terms; the
        neuroscience describes it in third-person terms; they are, as
        far as anyone can currently tell, describing the same
        phenomenon.
      </p>

      <h2>Dhāraṇā and dhyāna are coupled</h2>

      <p>
        Patañjali treats the two limbs as a pair. They are not separate
        practices; they are phases of the same practice. The
        practitioner begins with dhāraṇā — effortful selective
        attention — and the practice ripens into dhyāna when the
        effort is no longer required.
      </p>

      <p>
        The neuroscience supports this coupling. The transition is not
        binary; it is a gradient. Skilled practitioners can move
        fluidly between the two modes, increasing effort when attention
        flags and releasing it when attention is stable. The brain
        signature shifts accordingly. The two networks — executive
        control and default mode — are in a constant negotiation, and
        sustained practice changes the terms of the negotiation.
        <EvidenceTag level="suggestive" />
      </p>

      <h2>The honest summary</h2>

      <p>
        Dhyāna is the state in which sustained attention persists
        without the effort that initially established it. It is
        characterized by reduced default mode activity, reduced
        executive effort signature, and a felt thinning of the
        subject-object distinction. The neural correlates are
        consistent across studies; the experiential description is
        consistent across centuries. The seventh limb is not the
        eighth — there is still a meditator — but it is the structural
        precondition for what the eighth describes.
      </p>
    </EssayLayout>
  );
}
