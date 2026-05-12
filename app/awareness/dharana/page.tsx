import EssayLayout from '@/components/EssayLayout';
import EvidenceTag from '@/components/EvidenceTag';
import Link from 'next/link';

export const metadata = {
  title: 'Dhāraṇā · The Eight Limbs · The Brain Atlas',
};

export default function DharanaPage() {
  return (
    <EssayLayout
      tag="Sixth Limb"
      tint="#4f8a8b"
      title="Dhāraṇā — One-Pointedness"
      subtitle="The limb modern cognitive neuroscience understands best, because it has been studying the same thing under another name."
      related={[
        { href: '/awareness/pratyahara', label: 'Pratyāhāra' },
        { href: '/awareness/dhyana', label: 'Dhyāna' },
        { href: '/regions/frontal-lobe', label: 'The Frontal Lobe' },
        { href: '/awareness', label: 'Back to the Eight Limbs' },
      ]}
    >
      <p>
        <em>Dhāraṇā</em> is the sixth limb: sustained selective attention
        on a single object. The object can be the breath, a mantra, an
        image, a sensation, a candle flame. What matters is the
        sustaining — the willingness to bring attention back, again and
        again, when it wanders.
      </p>

      <p>
        The cognitive operation is simple to describe and famously hard
        to do. The mind wanders within seconds. The practitioner notices
        the wandering, releases it, and returns. The whole limb is the
        return.
      </p>

      <h2>The executive control network</h2>

      <p>
        Modern cognitive neuroscience has independently mapped the
        substrate of sustained selective attention. The executive
        control network — dorsolateral prefrontal cortex, posterior
        parietal cortex, and the connections between them — is what does
        the work.
        <EvidenceTag level="evidenced" /> Tasks that require sustained
        attention reliably activate this network; damage to it produces
        characteristic attentional deficits; long-term training in
        attention-demanding skills produces measurable structural
        changes in it.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        <Link href="/compendium/lazar-2005">Lazar et al. (2005)</Link>{' '}
        showed cortical thickening in prefrontal regions in long-term
        meditators. Follow-up work has consistently found that
        attention-focused meditation styles — concentration practices,
        mantra practices, breath-attention practices — produce changes
        in the executive control network specifically.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        The performance evidence is also clear. Lutz and Slagter&apos;s
        work on the attentional blink in long-term meditators found that
        intensive attention training reduces the &quot;blink&quot; — the
        normal failure to perceive a second target shortly after a
        first. Practitioners can sustain attention across intervals
        where most people&apos;s attention briefly fails.
        <EvidenceTag level="evidenced" />
      </p>

      <h2>Why this limb is the easiest to study</h2>

      <p>
        Of all eight limbs, dhāraṇā is the one Western cognitive science
        was already studying when it stumbled into yoga. The cognitive
        science of attention is a mature field. It has good paradigms
        (the attentional blink, the Stroop task, sustained vigilance),
        good neural correlates, and good intervention studies. When that
        field met the yogic tradition&apos;s long-term attention
        practitioners, both gained.
      </p>

      <p>
        The yogic tradition gained access to instruments that could
        measure what it had been training for centuries. The cognitive
        science gained a population that had done the training to a
        depth no controlled trial could replicate — practitioners with
        twenty, thirty, fifty thousand hours of attention practice.
      </p>

      <p>
        What both sides agree on:
      </p>

      <ul>
        <li>
          Sustained attention is trainable.
          <EvidenceTag level="evidenced" />
        </li>
        <li>
          The training produces durable structural changes in the
          executive control network.
          <EvidenceTag level="evidenced" />
        </li>
        <li>
          The benefits transfer — practitioners are better at attention-
          demanding tasks they have never specifically practiced.
          <EvidenceTag level="evidenced" />
        </li>
        <li>
          Sustained attention is metabolically expensive and cannot be
          held indefinitely without rest. Even advanced practitioners
          need to rest the muscle.
          <EvidenceTag level="evidenced" />
        </li>
      </ul>

      <h2>The dependence on earlier limbs</h2>

      <p>
        Dhāraṇā does not work without the limbs that precede it. A mind
        carrying the cognitive load of the{' '}
        <Link href="/awareness/yamas">yamas</Link>&apos; unfinished
        business — deception, harm, grasping — cannot sustain attention.
        A body that has not been settled by{' '}
        <Link href="/awareness/asana">āsana</Link> keeps tugging
        attention back to itself. An autonomic state that has not been
        regulated by <Link href="/awareness/pranayama">prāṇāyāma</Link>{' '}
        keeps producing arousal that competes for attention. Sensory
        input that has not been gated by{' '}
        <Link href="/awareness/pratyahara">pratyāhāra</Link> keeps
        capturing attention against the practitioner&apos;s will.
      </p>

      <p>
        This is why the order of the limbs is not arbitrary. Dhāraṇā is
        the work the entire practice has been preparing for. The earlier
        limbs are not separate disciplines; they are the conditions that
        make dhāraṇā possible.
      </p>

      <h2>The honest summary</h2>

      <p>
        Dhāraṇā is sustained selective attention. Its substrate is the
        executive control network. Modern cognitive neuroscience has
        independently identified the substrate, measured the training
        effect in long-term practitioners, and validated the
        transferability of the skill. This is the limb where the
        Eastern and Western vocabularies overlap most completely. They
        are, in different languages, describing the same thing, training
        the same circuitry, and noticing the same difficulties along the
        way. The convergence is not coincidence. It is two methods of
        inquiry finding the same feature of the nervous system from
        opposite sides.
      </p>
    </EssayLayout>
  );
}
