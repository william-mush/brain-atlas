import EssayLayout from '@/components/EssayLayout';
import EvidenceTag from '@/components/EvidenceTag';
import Link from 'next/link';

export const metadata = {
  title: 'Āsana · The Eight Limbs · The Brain Atlas',
};

export default function AsanaPage() {
  return (
    <EssayLayout
      tag="Third Limb"
      tint="#e8b04a"
      title="Āsana — The Body You Stop Managing"
      subtitle="The Sūtras say the seat should be steady and comfortable. They do not say it should be impressive."
      related={[
        { href: '/awareness/pranayama', label: 'Prāṇāyāma' },
        { href: '/regions/insula', label: 'The Insula' },
        { href: '/systems/vagus-nerve', label: 'The Vagus Nerve' },
        { href: '/awareness', label: 'Back to the Eight Limbs' },
      ]}
    >
      <p>
        Modern yoga has put āsana at the center. In the West, &quot;doing
        yoga&quot; usually means doing postures, and the postures have
        gotten increasingly athletic. The Sūtras say something narrower
        and far less impressive: <em>sthira-sukham āsanam</em> — the seat
        should be steady and comfortable.
      </p>

      <p>
        That is the whole definition in the classical text. Āsana, in
        Patañjali, is what you do so that the body stops being the thing
        you are managing. The function is preparatory. The body settles,
        and the practitioner becomes available for the later work.
      </p>

      <h2>The neuroanatomy of being in a body</h2>

      <p>
        Two cortical maps matter for what āsana cultivates.
      </p>

      <p>
        Proprioception — your sense of where the body is in space — is
        carried up from the limbs through the dorsal columns, processed
        through the cerebellum and the thalamus, and represented in
        primary somatosensory cortex.
        <EvidenceTag level="evidenced" /> Sustained postural training
        refines this map. Long-term practitioners across many physical
        disciplines (yoga, dance, gymnastics, martial arts) show thicker
        cortex in the somatosensory and cerebellar regions consistent
        with skill-learning effects.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        <Link href="/compendium/interoception">Interoception</Link> — the
        felt sense of the body&apos;s internal state — is processed
        through a different pathway: vagal afferents to the nucleus
        tractus solitarius, up through the parabrachial nucleus and
        thalamus to the <Link href="/regions/insula">insula</Link> and
        the <Link href="/regions/anterior-cingulate">anterior cingulate
        cortex</Link>. The right anterior insula is the cortical seat of
        the felt body.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        Āsana works on both maps at once. The held posture gives
        proprioception something to refine. The held attention to the
        breath and the body inside the posture gives interoception
        something to refine. Done well, āsana is not exercise that
        happens to be slow. It is deliberate, sustained training of the
        two cortical maps that make a body knowable from the inside.
      </p>

      <h2>The evidence in practitioners</h2>

      <p>
        <Link href="/compendium/lazar-2005">Lazar et al. (2005)</Link>{' '}
        found that long-term meditators had thicker cortex in the right
        anterior insula and in prefrontal regions associated with
        attention. The effect was largest in the oldest practitioners,
        suggesting the practice may offset age-related cortical thinning.
        Later replications and extensions across meditation and yoga
        populations have repeatedly found insular and somatosensory
        changes.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        <Link href="/compendium/farb-interoception">Farb et al.</Link>{' '}
        showed the functional version: experienced practitioners can
        detect their own heartbeats, their own breath, their own visceral
        signals more accurately than controls, and the accuracy maps onto
        insular activation. Practitioners can <em>feel</em> their bodies
        more precisely. The improvement is not metaphorical.
        <EvidenceTag level="evidenced" />
      </p>

      <h2>Why the order matters</h2>

      <p>
        Patañjali puts āsana third, after the ethical limbs and before
        prāṇāyāma. The order is structural. The{' '}
        <Link href="/awareness/yamas">yamas</Link> and{' '}
        <Link href="/awareness/niyamas">niyamas</Link> have lowered the
        cognitive load and oriented attention. The body is now available
        to be settled. Once it is settled, the breath becomes available
        to be regulated. Once the breath is regulated, the autonomic
        state shifts, and the later limbs become possible.
      </p>

      <p>
        Skipping āsana is possible — many traditions do — but it costs
        something. A practitioner who has not settled into the body has
        not closed one of the major sources of distraction. The body
        keeps tugging at attention. Pratyāhāra, the sensory withdrawal
        of the fifth limb, becomes much harder when the body has not yet
        learned to be still.
        <EvidenceTag level="suggestive" />
      </p>

      <h2>What modern yoga gets wrong, and right</h2>

      <p>
        The most common critique of modern yoga from a classical
        standpoint is that it has inflated āsana — making it the goal
        rather than the preparation. That critique is fair as far as it
        goes. A practice that is mostly athletic postures, performed
        without breath awareness and without interoceptive attention, is
        not really practicing the third limb in Patañjali&apos;s sense.
        It is exercising.
      </p>

      <p>
        But modern yoga gets something right that the classical
        tradition often took for granted: the body that the West arrives
        in is often a body that has never been carefully inhabited.
        Sustained sitting in stillness, without preliminary attention to
        the body, is not realistic for most practitioners. The Western
        elaboration of āsana — many postures, sustained holds, attention
        to alignment — does for the modern body something the classical
        tradition could assume from agricultural and pastoral life: it
        teaches the body to be a body. Once that lesson is in place, the
        classical narrowness of <em>sthira-sukham āsanam</em> becomes
        available again.
      </p>

      <h2>The honest summary</h2>

      <p>
        Āsana refines two cortical maps — proprioceptive and
        interoceptive — that the later limbs depend on. The neuroscience
        of this is well-evidenced; long-term practitioners show
        measurable structural and functional changes in the relevant
        regions. The classical definition is narrow on purpose: the
        body should be steady and comfortable so that it can be left
        alone. Modern practice has expanded the limb&apos;s scope, for
        reasons that make sense given the bodies arriving on modern
        mats, but the function remains the same. The body is what you
        settle so that the rest of the work can begin.
      </p>
    </EssayLayout>
  );
}
