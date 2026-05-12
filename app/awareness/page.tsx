import Link from 'next/link';

export const metadata = {
  title: 'The Eight Limbs as a Map of Awareness · The Brain Atlas',
};

const limbs: Array<{
  number: string;
  sanskrit: string;
  gloss: string;
  href: string;
  blurb: string;
}> = [
  {
    number: 'I',
    sanskrit: 'Yamas',
    gloss: 'ethical restraints',
    href: '/awareness/yamas',
    blurb:
      'The five things to refrain from — not as a moral code, as a list of cognitive loads that block contemplative training.',
  },
  {
    number: 'II',
    sanskrit: 'Niyamas',
    gloss: 'observances',
    href: '/awareness/niyamas',
    blurb:
      'The five orientations to cultivate. If the yamas remove load, the niyamas point attention.',
  },
  {
    number: 'III',
    sanskrit: 'Āsana',
    gloss: 'posture',
    href: '/awareness/asana',
    blurb:
      'The body as known. Somatosensory cortex, cerebellum, the proprioceptive substrate.',
  },
  {
    number: 'IV',
    sanskrit: 'Prāṇāyāma',
    gloss: 'breath restraint',
    href: '/awareness/pranayama',
    blurb:
      'The subtle body, taken seriously. Vagus, insula, the interoceptive pipeline.',
  },
  {
    number: 'V',
    sanskrit: 'Pratyāhāra',
    gloss: 'sensory withdrawal',
    href: '/awareness/pratyahara',
    blurb: 'Thalamic gating. The most-skipped limb in modern yoga.',
  },
  {
    number: 'VI',
    sanskrit: 'Dhāraṇā',
    gloss: 'concentration',
    href: '/awareness/dharana',
    blurb: 'One-pointedness. The executive control network.',
  },
  {
    number: 'VII',
    sanskrit: 'Dhyāna',
    gloss: 'meditation',
    href: '/awareness/dhyana',
    blurb:
      'When holding attention becomes resting in it. The default mode quiets.',
  },
  {
    number: 'VIII',
    sanskrit: 'Samādhi',
    gloss: 'absorption',
    href: '/awareness/samadhi',
    blurb:
      'Not a region. Network dissolution rather than network activation.',
  },
];

export default function AwarenessHub() {
  return (
    <main className="max-w-4xl mx-auto px-6 pt-12 pb-24">
      <p className="text-[11px] uppercase tracking-[0.22em] mb-3 text-neural-violet">
        A Framework
      </p>
      <h1 className="font-serif text-4xl text-ink-50 leading-tight mb-3">
        The Eight Limbs as a Map of Awareness
      </h1>
      <p className="text-ink-300 italic text-lg mb-10 max-w-2xl">
        A neuroanatomical reading of Patañjali — Sanskrit-first, with the
        seams visible.
      </p>

      <article className="prose-atlas mb-14">
        <p>
          The <em>Yoga Sūtras</em> of Patañjali, compiled around 400 BCE,
          describe an eightfold path: <em>aṣṭāṅga</em>, literally{' '}
          <em>eight limbs</em>. The conventional reading treats them as
          stages on a ladder. A more useful reading — the one this section
          works from — treats them as <em>layers</em> of awareness that get
          cultivated in parallel, with later limbs only stabilizing when
          earlier ones are in place.
        </p>

        <p>
          Each limb addresses a different layer of the nervous-system
          substrate that modern neuroscience has independently mapped. The
          ethical limbs lower the noise. The postural limb settles the
          body. Prāṇāyāma tunes the autonomic state. Pratyāhāra closes the
          sensory gate. Dhāraṇā and dhyāna train attention. Samādhi is what
          remains when the apparatus that constructs the sense of a
          located self goes quiet.
        </p>

        <p>
          The pages below take each limb in turn and ask what is happening
          in the body and brain when the limb is practiced. Every claim is
          tagged for evidence — <strong>evidenced</strong>,{' '}
          <strong>suggestive</strong>, or <strong>philosophical</strong> —
          so the reader can see the seam between what the imaging shows,
          what the inference suggests, and what is best held as a way of
          speaking about experience.
        </p>

        <p>
          The full argument lives in the{' '}
          <Link href="/awareness/synthesis">synthesis paper</Link>. The
          per-limb pages are entry points. They can be read in order, or
          in any order at all — they describe a stack, not a sequence.
          Every claim in the prose is cross-referenced into the{' '}
          <Link href="/compendium">compendium</Link>, where the specific
          experiments and thinkers are catalogued with their own evidence
          tags.
        </p>

        <p>
          For the visual version, open the{' '}
          <Link href="/explore">3D atlas</Link> and toggle{' '}
          <strong>Awareness Mode</strong> in the top-left. The eight
          limbs become an overlay on the nervous system. Pick a limb
          and the regions it engages light up in the limb&apos;s color.
          Pick samādhi and the map dissolves.
        </p>
      </article>

      <ol className="space-y-3 list-none pl-0">
        {limbs.map((l) => (
          <li key={l.sanskrit}>
            <Link
              href={l.href}
              className="block rounded-lg border border-ink-700 bg-ink-800/40 hover:bg-ink-800 hover:border-ink-600 transition p-5"
            >
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="font-serif text-ink-400 text-sm w-6 shrink-0">
                  {l.number}
                </span>
                <span className="font-serif text-xl text-ink-50">
                  {l.sanskrit}
                </span>
                <span className="text-ink-300 text-sm italic">
                  — {l.gloss}
                </span>
              </div>
              <p className="text-ink-200 text-[15px] pl-9 leading-relaxed">
                {l.blurb}
              </p>
            </Link>
          </li>
        ))}
      </ol>

      <aside className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/awareness/synthesis"
          className="block rounded-lg border border-neural-violet/40 bg-ink-800/40 hover:bg-ink-800 transition p-5"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] mb-2 text-neural-violet">
            The Long Form
          </p>
          <p className="font-serif text-lg text-ink-50 mb-1">
            The Synthesis Paper
          </p>
          <p className="text-ink-300 text-sm">
            The full ~8,000-word argument tying the eight limbs to the
            neuroscience.
          </p>
        </Link>
        <Link
          href="/awareness/advaita-shaivism"
          className="block rounded-lg border border-neural-plum/40 bg-ink-800/40 hover:bg-ink-800 transition p-5"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] mb-2 text-neural-plum">
            The Metaphysical Frame
          </p>
          <p className="font-serif text-lg text-ink-50 mb-1">
            Advaita Vedānta &amp; Kashmir Shaivism
          </p>
          <p className="text-ink-300 text-sm">
            Two non-dual traditions, different structural predictions, one
            cleaner fit with the imaging.
          </p>
        </Link>
      </aside>
    </main>
  );
}
