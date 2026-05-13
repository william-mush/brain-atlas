'use client';

import { REGION_LABELS, getBodyPart } from '@/lib/body';
import {
  getSimpleStateForPart,
  isAtRiskForPart,
  isPrimaryForPart,
  SIMPLE_STATE_COLORS,
  SIMPLE_STATE_LABELS,
  SIMPLE_STATE_DESCRIPTIONS,
  type Pose,
  type SimpleState,
} from '@/lib/poses';

interface Props {
  partId: string | null;
  activePose: Pose | null;
  onClose: () => void;
  onSelect: (id: string) => void;
  onClearPose: () => void;
}

const LEGEND_STATES: SimpleState[] = ['working', 'stretching', 'at-risk', 'quiet'];

export default function BodyPanel({ partId, activePose, onClose, onClearPose }: Props) {
  const part = partId ? getBodyPart(partId) : null;

  // No part selected, but a pose is active — show pose details
  if (!part && activePose) {
    return (
      <div className="h-full flex flex-col min-h-0">
        <div className="flex items-start justify-between gap-4 p-6 pb-3 border-b border-ink-700 bg-ink-800/95 backdrop-blur sticky top-0 z-10 flex-shrink-0">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest mb-1 text-[#e89a4a]">
              Pose
              {activePose.sequence && <span className="text-ink-400 ml-2 normal-case tracking-normal font-serif italic">{activePose.sequence}</span>}
            </p>
            <h2 className="font-serif text-2xl text-ink-50 leading-tight">{activePose.english}</h2>
            <p className="font-serif italic text-ink-300 text-sm mt-0.5">{activePose.sanskrit}</p>
          </div>
          <button onClick={onClearPose} className="text-ink-300 hover:text-ink-50 text-xs underline decoration-ink-600 hover:decoration-ink-100" aria-label="Clear pose">
            clear pose
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
          {/* Plain-language description first — for everyone */}
          {activePose.plainLanguage && (
            <p className="text-ink-50 leading-relaxed text-base">{activePose.plainLanguage}</p>
          )}

          {/* Injury sites near the top — students need to see this */}
          {activePose.injurySites && activePose.injurySites.length > 0 && (
            <section className="bg-[#e8b04a]/10 border border-[#e8b04a]/40 rounded-md p-3 space-y-2">
              <h3 className="text-xs uppercase tracking-widest text-[#e8b04a] flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-sm bg-[#e8b04a]" />
                Where tension goes — and where injuries happen
              </h3>
              <ul className="space-y-2 text-sm text-ink-100 leading-relaxed">
                {activePose.injurySites.map((s, i) => (
                  <li key={i}>
                    <span className="text-[#e8b04a] font-medium">{s.muscle ? muscleLabelFromSlug(s.muscle) : s.region}:</span>{' '}
                    <span>{s.note}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Detailed description */}
          <details>
            <summary className="text-xs uppercase tracking-widest text-ink-300 cursor-pointer hover:text-ink-100">
              Full description &amp; intent
            </summary>
            <div className="mt-3 space-y-3">
              <p className="text-sm text-ink-100 leading-relaxed">{activePose.description}</p>
              <p className="text-sm text-ink-200 leading-relaxed italic">{activePose.intent}</p>
            </div>
          </details>

          <section>
            <h3 className="text-xs uppercase tracking-widest text-ink-300 mb-2">Cues</h3>
            <ul className="space-y-1.5 text-sm text-ink-100">
              {activePose.cues.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#e89a4a]" />
                  <span className="leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {activePose.watchFor && activePose.watchFor.length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-widest text-[#c45050] mb-2">Watch for</h3>
              <ul className="space-y-1.5 text-sm text-ink-200">
                {activePose.watchFor.map((w, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#c45050]" />
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Primary muscles list — the "stars" of this pose */}
          {activePose.primaryMuscles && activePose.primaryMuscles.length > 0 && (
            <section className="border-t border-ink-700/60 pt-5">
              <h3 className="text-xs uppercase tracking-widest text-ink-300 mb-2">Star muscles in this pose</h3>
              <p className="text-xs text-ink-300 mb-2">
                The 4-6 muscles that are the main story. Everything else on the body fades back.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activePose.primaryMuscles.map((slug) => (
                  <span key={slug} className="text-xs px-2 py-0.5 rounded-full border border-[#d65a3a]/60 text-ink-100 bg-[#d65a3a]/10">
                    {muscleLabelFromSlug(slug)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Color legend */}
          <section className="border-t border-ink-700/60 pt-5">
            <h3 className="text-xs uppercase tracking-widest text-ink-300 mb-2">Colors</h3>
            <ul className="space-y-2">
              {LEGEND_STATES.map((s) => (
                <li key={s} className="flex gap-2 items-start">
                  <span
                    className="mt-1 inline-block w-3 h-3 rounded-sm flex-shrink-0 border border-ink-600"
                    style={{ backgroundColor: SIMPLE_STATE_COLORS[s] }}
                  />
                  <div className="text-xs leading-relaxed">
                    <div className="text-ink-50 font-medium">{SIMPLE_STATE_LABELS[s]}</div>
                    <div className="text-ink-300">{SIMPLE_STATE_DESCRIPTIONS[s]}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="h-full flex flex-col items-start justify-start gap-4 p-6 text-ink-200">
        <h2 className="font-serif text-2xl text-ink-50">The Body</h2>
        <p className="text-sm leading-relaxed">
          Each muscle and bone comes from <a href="https://z-anatomy.com" target="_blank" rel="noreferrer" className="underline decoration-ink-500">Z-Anatomy</a>, a libre 3D atlas. Annotations are written through the lens of Ashtanga Vinyasa.
        </p>
        <p className="text-sm leading-relaxed">
          Click a muscle for its origin, insertion, and yoga role. Pick a pose on the left to color every muscle by what it&apos;s doing in that pose.
        </p>
        <p className="text-xs uppercase tracking-widest text-ink-300 mt-4">
          Origin (green) and insertion (pink) dots appear when a muscle is selected.
        </p>
      </div>
    );
  }

  // A part is selected. If a pose is also active, show its state at the top.
  const simpleState = activePose && part.kind === 'muscle' ? getSimpleStateForPart(activePose, part) : null;
  const isPrimary = activePose && part.kind === 'muscle' ? isPrimaryForPart(activePose, part) : false;
  const isAtRisk = activePose && part.kind === 'muscle' ? isAtRiskForPart(activePose, part) : false;
  const poseStateNote = activePose && part.kind === 'muscle'
    ? findStateNote(activePose, part.id)
    : null;
  const injuryNote = activePose && part.kind === 'muscle' && isAtRisk
    ? findInjuryNote(activePose, part.id)
    : null;

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-start justify-between gap-4 p-6 pb-3 border-b border-ink-700 bg-ink-800/95 backdrop-blur sticky top-0 z-10 flex-shrink-0">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: part.kind === 'muscle' ? '#c45050' : '#e8dec5' }}>
            {REGION_LABELS[part.region]} · {part.kind}
            {isPrimary && <span className="ml-2 text-[#d65a3a]">· STAR of this pose</span>}
          </p>
          <h2 className="font-serif text-2xl text-ink-50 leading-tight">
            {part.name}
            {part.side && <span className="text-ink-400 text-lg font-mono ml-2">{part.side === 'l' ? 'L' : 'R'}</span>}
          </h2>
        </div>
        <button onClick={onClose} className="text-ink-300 hover:text-ink-50 text-xl leading-none flex-shrink-0" aria-label="Close">×</button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
        {/* Pose state at the top if a pose is active */}
        {activePose && simpleState && (
          <section
            className="border rounded-md p-3 space-y-2"
            style={{
              backgroundColor: SIMPLE_STATE_COLORS[simpleState] + '14',
              borderColor: SIMPLE_STATE_COLORS[simpleState] + '60',
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-widest text-ink-300">In {activePose.english}</p>
              <span className="text-[10px] text-ink-400 italic font-serif">{activePose.sanskrit}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-sm border border-ink-600"
                style={{ backgroundColor: SIMPLE_STATE_COLORS[simpleState] }}
              />
              <span className="text-sm text-ink-50 font-medium">{SIMPLE_STATE_LABELS[simpleState]}</span>
            </div>
            {injuryNote && (
              <p className="text-xs text-ink-100 leading-relaxed">{injuryNote}</p>
            )}
            {!injuryNote && poseStateNote && (
              <p className="text-xs text-ink-100 leading-relaxed">{poseStateNote}</p>
            )}
          </section>
        )}

        {activePose && !simpleState && part.kind === 'muscle' && (
          <p className="text-xs text-ink-400 italic">
            Quiet in this pose — no specific role.
          </p>
        )}

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

function findStateNote(pose: Pose, partId: string): string | undefined {
  const m = partId.match(/^muscle_(.+?)_([lr])$/);
  if (!m) return undefined;
  const slug = m[1];
  const side = m[2] as 'l' | 'r';
  for (const e of pose.states) {
    if (e.muscle !== slug) continue;
    const s = e.side || 'both';
    if (s === side || s === 'both') {
      if (e.note) return e.note;
    }
  }
  return undefined;
}

function findInjuryNote(pose: Pose, partId: string): string | undefined {
  if (!pose.injurySites) return undefined;
  const m = partId.match(/^muscle_(.+?)_([lr])$/);
  if (!m) return undefined;
  const slug = m[1];
  const side = m[2] as 'l' | 'r';
  for (const s of pose.injurySites) {
    if (!s.muscle || s.muscle !== slug) continue;
    const ss = s.side || 'both';
    if (ss === 'both' || ss === side) return s.note;
  }
  return undefined;
}

/** Turn a muscle slug like 'long_head_of_biceps_femoris' into 'Long Head Of Biceps Femoris' */
function muscleLabelFromSlug(slug: string): string {
  return slug
    .split('_')
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ');
}
