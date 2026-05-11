import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-ink-700">
        <div className="absolute inset-0 -z-10 opacity-50">
          <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-neural-rose/15 blur-3xl" />
          <div className="absolute top-0 right-0 w-[34rem] h-[34rem] rounded-full bg-neural-teal/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[30rem] h-[30rem] rounded-full bg-neural-amber/10 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-6 py-24 sm:py-32">
          <p className="text-xs uppercase tracking-[0.25em] text-ink-300 mb-5">
            An interactive atlas
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl text-ink-50 leading-[1.05] mb-6">
            The human brain,
            <br />
            in three dimensions
            <br />
            <span className="text-ink-300">and many opinions.</span>
          </h1>
          <p className="text-ink-100 text-lg max-w-2xl leading-relaxed mb-8">
            Rotate a brain in space. Light up a single region. Then read,
            slowly, about what that region <em>does</em> — what part of you it
            carries, what it talks to in the rest of the body, and what changes
            when it changes. From cortex down through brainstem, into the
            spinal cord, out along the vagus nerve, and into the 500-million-neuron
            mesh that lives in the gut.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-ink-50 text-ink-900 font-medium hover:bg-ink-100 transition"
            >
              Open the explorer <span aria-hidden>→</span>
            </Link>
            <Link
              href="/systems/vagus-nerve"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-ink-600 text-ink-50 hover:bg-ink-800 transition"
            >
              Read: the vagus nerve
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="font-serif text-3xl text-ink-50 mb-2">
          Five long reads
        </h2>
        <p className="text-ink-300 mb-10">
          The 3D model is the doorway. The essays are the building.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ESSAYS.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group block p-6 rounded-lg border border-ink-700 hover:border-ink-500 bg-ink-800/30 hover:bg-ink-800/60 transition"
            >
              <p
                className="text-[10px] uppercase tracking-[0.2em] mb-2"
                style={{ color: e.tint }}
              >
                {e.tag}
              </p>
              <h3 className="font-serif text-xl text-ink-50 mb-2 group-hover:text-ink-50">
                {e.title}
              </h3>
              <p className="text-sm text-ink-200 leading-relaxed">{e.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink-700 py-10 text-center text-xs text-ink-400">
        Built with care. Anatomy summarized for general readers — not medical
        advice.
      </footer>
    </main>
  );
}

const ESSAYS = [
  {
    href: '/systems/vagus-nerve',
    tag: 'Cranial Nerve X',
    tint: '#7a9461',
    title: 'The Vagus Nerve & the Gut–Brain Axis',
    blurb:
      'The longest cranial nerve wanders from brainstem to colon. Most of its fibers carry news from the body up, not commands from the brain down.',
  },
  {
    href: '/systems/autonomic',
    tag: 'Two Branches',
    tint: '#e89aa3',
    title: 'Sympathetic & Parasympathetic',
    blurb:
      'The accelerator and the brake. How the spinal cord, brainstem, and hypothalamus negotiate the body\'s state behind your back.',
  },
  {
    href: '/systems/consciousness',
    tag: 'Awareness',
    tint: '#8a6fa3',
    title: 'What "Conscious" Even Means',
    blurb:
      'Wakefulness vs. content. The thalamus, reticular formation, and cortex as three layers of a single experience.',
  },
  {
    href: '/systems/hemispheres',
    tag: 'Left & Right',
    tint: '#4f8a8b',
    title: 'Analytic & Intuitive',
    blurb:
      'The lateralization story is older than pop psychology and weirder. What hemispheric difference really seems to be.',
  },
  {
    href: '/systems/time',
    tag: 'Across the Day, Across a Life',
    tint: '#e8b04a',
    title: 'Which Part of the Brain Is in Charge Right Now',
    blurb:
      'Arousal cycles, default mode, salience, executive. The brain isn\'t a unitary "you" — it\'s a rotating cast.',
  },
];
