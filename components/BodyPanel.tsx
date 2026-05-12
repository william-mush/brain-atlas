'use client';

import { REGION_LABELS, getBodyPart } from '@/lib/body';

interface Props {
  partId: string | null;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export default function BodyPanel({ partId, onClose }: Props) {
  const part = partId ? getBodyPart(partId) : null;

  if (!part) {
    return (
      <div className="h-full flex flex-col items-start justify-start gap-4 p-6 text-ink-200">
        <h2 className="font-serif text-2xl text-ink-50">The Body</h2>
        <p className="text-sm leading-relaxed">
          Each muscle and bone you can see comes from <a href="https://z-anatomy.com" target="_blank" rel="noreferrer" className="underline decoration-ink-500">Z-Anatomy</a>, a libre 3D atlas of human anatomy. The annotations are written through the lens of Ashtanga Vinyasa — what a muscle does in a pose, what stretches it, what compensations to watch for.
        </p>
        <p className="text-sm leading-relaxed">
          Click a muscle to see its origin, insertion, and how it shows up on the mat. A green dot marks the origin (proximal attachment) and a pink dot marks the insertion (distal). The line between them is the muscle&apos;s line of pull.
        </p>
        <p className="text-xs uppercase tracking-widest text-ink-300 mt-4">
          Pose-level annotations and biomechanical simulation come next — Phase 2 and Phase 3.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-start justify-between gap-4 p-6 pb-3 border-b border-ink-700 bg-ink-800/95 backdrop-blur sticky top-0 z-10 flex-shrink-0">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: part.kind === 'muscle' ? '#c45050' : '#e8dec5' }}>
            {REGION_LABELS[part.region]} · {part.kind}
          </p>
          <h2 className="font-serif text-2xl text-ink-50 leading-tight">
            {part.name}
            {part.side && <span className="text-ink-400 text-lg font-mono ml-2">{part.side === 'l' ? 'L' : 'R'}</span>}
          </h2>
        </div>
        <button onClick={onClose} className="text-ink-300 hover:text-ink-50 text-xl leading-none flex-shrink-0" aria-label="Close">×</button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
        {part.summary && <p className="text-ink-100 leading-relaxed">{part.summary}</p>}

        {(part.origin || part.insertion) && (
          <section className="space-y-2.5">
            {part.origin && (
              <div>
                <p className="text-xs uppercase tracking-widest text-[#7a9461] mb-1">Origin</p>
                <p className="text-sm text-ink-100 leading-relaxed">{part.origin}</p>
              </div>
            )}
            {part.insertion && (
              <div>
                <p className="text-xs uppercase tracking-widest text-[#e89aa3] mb-1">Insertion</p>
                <p className="text-sm text-ink-100 leading-relaxed">{part.insertion}</p>
              </div>
            )}
          </section>
        )}

        {part.joints && part.joints.length > 0 && (
          <section>
            <h3 className="text-xs uppercase tracking-widest text-ink-300 mb-2">Crosses</h3>
            <div className="flex flex-wrap gap-1.5">
              {part.joints.map((j) => (
                <span key={j} className="text-xs px-2 py-0.5 rounded-full border border-ink-600 text-ink-200">{j}</span>
              ))}
            </div>
          </section>
        )}

        {part.actions && part.actions.length > 0 && (
          <section>
            <h3 className="text-xs uppercase tracking-widest text-ink-300 mb-2">Actions</h3>
            <ul className="space-y-1.5 text-sm text-ink-100">
              {part.actions.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#c45050]" />
                  <span className="leading-relaxed">{a}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {part.antagonists && part.antagonists.length > 0 && (
          <section>
            <h3 className="text-xs uppercase tracking-widest text-ink-300 mb-2">Antagonists</h3>
            <p className="text-sm text-ink-200">{part.antagonists.join(', ')}</p>
          </section>
        )}

        {part.yoga && (
          <section className="border-t border-ink-700/60 pt-5">
            <h3 className="text-xs uppercase tracking-widest text-[#e8b04a] mb-2">In Yoga Practice</h3>
            <p className="text-sm text-ink-100 leading-relaxed italic">{part.yoga}</p>
          </section>
        )}
      </div>
    </div>
  );
}
