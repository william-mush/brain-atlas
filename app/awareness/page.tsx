import Link from 'next/link';

export const metadata = {
  title: 'The Eight Limbs as a Map of Awareness · The Brain Atlas',
};

const limbs: Array<{
  number: string;
  sanskrit: string;
  gloss: string;
  href?: string;
  status: 'live' | 'planned';
  blurb: string;
}> = [
  {
    number: 'I',
    sanskrit: 'Yamas',
    gloss: 'ethical restraints',
    status: 'planned',
    blurb:
      'The five things to refrain from. Read as the signal-to-noise floor of the practice.',
  },
  {
    number: 'II',
    sanskrit: 'Niyamas',
    gloss: 'observances',
    status: 'planned',
    blurb:
      'The five things to cultivate. Read as the orientation of attention before training begins.',
  },
  {
    number: 'III',
    sanskrit: 'Āsana',
    gloss: 'posture',
    status: 'planned',
    blurb:
      'The body as known. Somatosensory cortex, cerebellum, the proprioceptive substrate.',
  },
  {
    number: 'IV',
    sanskrit: 'Prāṇāyāma',
    gloss: 'breath restraint',
    href: '/awareness/pranayama',
    status: 'live',
    blurb:
      'The subtle body, taken seriously. Vagus, insula, the interoceptive pipeline.',
  },
  {
    number: 'V',
    sanskrit: 'Pratyāhāra',
    gloss: 'sensory withdrawal',
    status: 'planned',
    blurb: 'Thalamic gating. The most-skipped limb in modern yoga.',
  },
  {
    number: 'VI',
    sanskrit: 'Dhāraṇā',
    gloss: 'concentration',
    status: 'planned',
    blurb: 'One-pointedness. The executive control network.',
  },
  {
    number: 'VII',
    sanskrit: 'Dhyāna',
    gloss: 'meditation',
    status: 'planned',
    blurb:
      'When holding attention becomes resting in it. The default mode quiets.',
  },
  {
    number: 'VIII',
    sanskrit: 'Samādhi',
    gloss: 'absorption',
    status: 'planned',
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
        </p>
      </article>

      <ol className="space-y-3 list-none pl-0">
        {limbs.map((l) => {
          const body = (
            <>
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
                {l.status === 'planned' && (
                  <span className="text-[10px] uppercase tracking-[0.14em] text-ink-400 ml-auto">
                    coming
                  </span>
                )}
              </div>
              <p className="text-ink-200 text-[15px] pl-9 leading-relaxed">
                {l.blurb}
              </p>
            </>
          );
          if (l.href) {
            return (
              <li key={l.sanskrit}>
                <Link
                  href={l.href}
                  className="block rounded-lg border border-ink-700 bg-ink-800/40 hover:bg-ink-800 hover:border-ink-600 transition p-5"
                >
                  {body}
                </Link>
              </li>
            );
          }
          return (
            <li
              key={l.sanskrit}
              className="block rounded-lg border border-ink-700/60 bg-ink-800/20 p-5 opacity-60"
            >
              {body}
            </li>
          );
        })}
      </ol>

      <aside className="mt-14 pt-8 border-t border-ink-700 text-sm text-ink-300 max-w-2xl">
        <p className="mb-2">
          A ninth section, on{' '}
          <em>Advaita Vedānta</em> and <em>Kashmir Shaivism</em>, frames
          the metaphysics. The two non-dual traditions make different
          structural predictions about what cultivated awareness looks
          like, and the difference matters for the neuroscience.
        </p>
      </aside>
    </main>
  );
}
