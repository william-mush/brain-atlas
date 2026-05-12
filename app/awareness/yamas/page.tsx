import EssayLayout from '@/components/EssayLayout';
import EvidenceTag from '@/components/EvidenceTag';
import Link from 'next/link';

export const metadata = {
  title: 'Yamas · The Eight Limbs · The Brain Atlas',
};

export default function YamasPage() {
  return (
    <EssayLayout
      tag="First Limb"
      tint="#e89aa3"
      title="Yamas — The Noise Floor"
      subtitle="Not a moral code. A list of cognitive loads that block contemplative training."
      related={[
        { href: '/awareness/niyamas', label: 'Niyamas' },
        { href: '/awareness/synthesis', label: 'The Synthesis' },
        { href: '/awareness', label: 'Back to the Eight Limbs' },
      ]}
    >
      <p>
        The five <em>yamas</em> are the first limb: <em>ahiṃsā</em>{' '}
        (non-harming), <em>satya</em> (truthfulness), <em>asteya</em>{' '}
        (non-stealing), <em>brahmacarya</em> (restraint of the senses,
        often translated as celibacy but better read more broadly), and{' '}
        <em>aparigraha</em> (non-grasping). The conventional reading
        treats them as a moral code — rules of right conduct, to be
        followed because they are good.
      </p>

      <p>
        That reading is not wrong, but it misses the structural point.
        The yamas are the first limb not because they are the most
        important moral commitments but because they are the prerequisite
        condition for everything that follows. They are{' '}
        <strong>cognitive load reductions</strong>. They lower the noise
        floor of the nervous system, so that the later limbs can do their
        work.
      </p>

      <h2>The cognitive cost of deception</h2>

      <p>
        Begin with <em>satya</em>, truthfulness, because it is the
        cleanest case. The cognitive cost of lying is well-documented.
        Lying is slower than telling the truth — reaction-time studies
        across many populations show this consistently. It recruits
        prefrontal regions more heavily, because the liar must maintain
        two parallel models of reality: what they said, and what is true.
        Sustained deception over weeks or months produces measurable
        executive-function depletion.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        Patañjali was not running fMRI studies. But he was observing
        practitioners over time, and he noticed that a mind tangled in
        deception could not settle into sustained attention. The
        prescription was not moral — it was practical.{' '}
        <em>Satya</em> is the removal of a specific load that the later
        limbs cannot tolerate.
      </p>

      <h2>The cognitive cost of harm</h2>

      <p>
        <em>Ahiṃsā</em>, non-harming, is the most famous yama and the
        most easily misread. It is often presented as a categorical
        prohibition: do no harm. The structural reading is different:
        harm produces ongoing threat-monitoring. The harmed party may
        retaliate. The action may be discovered. The harm may need to be
        concealed. All of this requires sustained vigilance, which the
        nervous system pays for in autonomic arousal and in attentional
        bandwidth.
        <EvidenceTag level="suggestive" />
      </p>

      <p>
        A practitioner with significant outstanding harm in their life
        cannot do prāṇāyāma effectively, not because the universe is
        punishing them but because their sympathetic system is partly
        committed elsewhere. The breath will not slow. The interoceptive
        signal will not clear. The later limbs are unavailable.
      </p>

      <h2>The cognitive cost of grasping</h2>

      <p>
        <em>Aparigraha</em>, non-grasping, is the yama most easily
        underestimated, partly because Western culture is built on
        acquisition. The structural cost is real and well-mapped in
        addiction research. Chronic craving produces sustained activity
        in the ventral striatum and persistent demands on prefrontal
        control. The brain is not at rest; it is in a state of low-grade
        pursuit.
        <EvidenceTag level="evidenced" />
      </p>

      <p>
        The classical example in the Sūtras is wealth or sexual desire,
        but the principle generalizes. A mind constantly maintaining a
        list of things to obtain — possessions, achievements, status,
        approval — is not available for the work the later limbs require.
        The grasp does not have to be conscious to be expensive.
      </p>

      <h2>What the yamas are not</h2>

      <p>
        Two clarifications, both important.
      </p>

      <p>
        First: the yamas are not a test you pass before being allowed to
        practice. The traditional manuals are clear that the limbs are
        cultivated in parallel, not in strict sequence. You do not perfect{' '}
        <em>satya</em> before being allowed to do prāṇāyāma. You work on
        all of them, and the work on the later limbs reveals where the
        earlier ones still need attention.
      </p>

      <p>
        Second: the yamas are not exhaustively about morality. Some
        ethical questions a modern reader cares about — fairness across
        social systems, structural justice, the ethics of consumption —
        are not directly addressed by the classical list. The yamas are
        a clinical instrument, not a complete ethics. The ethics that
        comes out of sustained yogic practice is, in some traditions,
        considerably richer than the bare list, but the list itself is
        narrow on purpose: these are the loads that most reliably block
        the work.
      </p>

      <h2>The structural claim, stated clearly</h2>

      <p>
        Putting it together: the yamas identify five specific cognitive
        loads — deception, harm, theft, sensory indulgence, grasping —
        that prevent contemplative training. Each load names a real
        thing the nervous system does, with measurable autonomic and
        cognitive cost. The practice of the yamas is the systematic
        reduction of these loads, undertaken not for moral reasons but
        because the later limbs require the loads to be lower.
      </p>

      <p>
        This is, as far as I can tell, a falsifiable claim that has never
        been formally tested. There is no controlled trial of
        &quot;practice yamas, see what happens to meditation depth.&quot;
        The hypothesis is implicit in every traditional manual and has
        not been put to a modern test.
        <EvidenceTag level="suggestive" />
      </p>

      <p>
        The convergence with modern cognitive neuroscience is striking
        even without formal trials. The brain costs of deception, chronic
        threat-monitoring, and sustained craving are all well-documented.
        Patañjali identified, by introspection across many practitioners,
        the same loads that modern cognitive science has independently
        identified from the opposite direction. The yamas are not
        arbitrary virtues. They are a clinical list of the things that
        prevent the work.
      </p>
    </EssayLayout>
  );
}
