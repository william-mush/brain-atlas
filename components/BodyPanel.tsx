'use client';

import { REGION_LABELS, getBodyPart, BODY_PARTS, type BodyPart } from '@/lib/body';
import {
  getSimpleStateForPart,
  isAtRiskForPart,
  isPrimaryForPart,
  SIMPLE_STATE_COLORS,
  SIMPLE_STATE_LABELS,
  SIMPLE_STATE_DESCRIPTIONS,
  STATE_LABELS,
  muscleEntriesByState,
  peersOfMuscleInState,
  entryForPart,
  simpleStateOfEntry,
  muscleCountsByState,
  type Pose,
  type SimpleState,
  type MuscleState,
  type MuscleStateEntry,
} from '@/lib/poses';
import { POSE_ANGLES } from '@/lib/pose-angles';

// ============================================================
// PANEL STATE MACHINE
// ============================================================
// The right panel's content is determined by `focus`. The three modes
// are mutually exclusive; navigation between them happens via callbacks
// the parent BodyExplorer owns.
//
//   { kind: 'overview' }                       — pose summary
//   { kind: 'state-detail', state: SimpleState } — all muscles in one state
//   { kind: 'muscle-focus', partId: string }   — one muscle, in this pose

export type PanelFocus =
  | { kind: 'overview' }
  | { kind: 'state-detail'; state: SimpleState }
  | { kind: 'muscle-focus'; partId: string };

interface Props {
  /** Selected body part id (used for the no-pose branch). */
  partId: string | null;
  /** The active pose, if any. */
  activePose: Pose | null;
  /** Where the panel is currently focused within the pose. Ignored when no pose. */
  focus: PanelFocus;
  /** Close handler for the no-pose, part-selected branch. */
  onClose: () => void;
  /** Select a body part (used both for the 3D model and for in-panel links). */
  onSelect: (id: string) => void;
  /** Clear the active pose entirely. */
  onClearPose: () => void;
  /** Navigate within the pose-focused panel. */
  onSetFocus: (focus: PanelFocus) => void;
}

const LEGEND_STATES: SimpleState[] = ['working', 'stretching', 'at-risk', 'quiet'];

export default function BodyPanel({
  partId,
  activePose,
  focus,
  onClose,
  onSelect,
  onClearPose,
  onSetFocus,
}: Props) {
  // ============================================================
  // BRANCH 1: A pose is active. The panel renders pose context with
  // the focus determining what specific view inside the pose.
  // ============================================================
  if (activePose) {
    return (
      <PoseFocusedPanel
        pose={activePose}
        focus={focus}
        onClearPose={onClearPose}
        onSelect={onSelect}
        onSetFocus={onSetFocus}
      />
    );
  }

  // ============================================================
  // BRANCH 2: No pose, but a body part is selected — anatomy view
  // (the existing standalone-part behavior).
  // ============================================================
  const part = partId ? getBodyPart(partId) : null;
  if (part) {
    return <BodyPartAnatomyPanel part={part} onClose={onClose} />;
  }

  // ============================================================
  // BRANCH 3: Nothing selected — welcome / instructions.
  // ============================================================
  return <EmptyPanel />;
}

// ============================================================
// Pose-focused panel (the main work of this redesign)
// ============================================================

interface PoseFocusedPanelProps {
  pose: Pose;
  focus: PanelFocus;
  onClearPose: () => void;
  onSelect: (id: string) => void;
  onSetFocus: (focus: PanelFocus) => void;
}

function PoseFocusedPanel({
  pose,
  focus,
  onClearPose,
  onSelect,
  onSetFocus,
}: PoseFocusedPanelProps) {
  return (
    <div className="h-full flex flex-col min-h-0">
      <PoseHeader pose={pose} focus={focus} onClearPose={onClearPose} onSetFocus={onSetFocus} />

      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
        {focus.kind === 'overview' && (
          <PoseOverview pose={pose} onSetFocus={onSetFocus} />
        )}
        {focus.kind === 'state-detail' && (
          <StateDetailView
            pose={pose}
            state={focus.state}
            onSelect={onSelect}
            onSetFocus={onSetFocus}
          />
        )}
        {focus.kind === 'muscle-focus' && (
          <MuscleFocusView
            pose={pose}
            partId={focus.partId}
            onSelect={onSelect}
            onSetFocus={onSetFocus}
          />
        )}
      </div>
    </div>
  );
}

// ----- Header (pose name + breadcrumb + clear) -----

function PoseHeader({
  pose,
  focus,
  onClearPose,
  onSetFocus,
}: {
  pose: Pose;
  focus: PanelFocus;
  onClearPose: () => void;
  onSetFocus: (focus: PanelFocus) => void;
}) {
  const inOverview = focus.kind === 'overview';
  const breadcrumb =
    focus.kind === 'state-detail'
      ? SIMPLE_STATE_LABELS[focus.state]
      : focus.kind === 'muscle-focus'
        ? muscleLabelFromPartId(focus.partId)
        : null;

  return (
    <div className="flex items-start justify-between gap-4 p-6 pb-3 border-b border-ink-700 bg-ink-800/95 backdrop-blur sticky top-0 z-10 flex-shrink-0">
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-widest mb-1 text-[#e89a4a]">
          Pose
          {pose.sequence && (
            <span className="text-ink-400 ml-2 normal-case tracking-normal font-serif italic">
              {pose.sequence}
            </span>
          )}
        </p>
        <h2 className="font-serif text-2xl text-ink-50 leading-tight">{pose.english}</h2>
        <p className="font-serif italic text-ink-300 text-sm mt-0.5">{pose.sanskrit}</p>
        {breadcrumb && (
          <button
            onClick={() => onSetFocus({ kind: 'overview' })}
            className="mt-2 text-[11px] text-ink-300 hover:text-ink-50 flex items-center gap-1 group"
          >
            <span aria-hidden>←</span>
            <span className="group-hover:underline">back to overview</span>
            <span className="text-ink-500 mx-1">·</span>
            <span className="text-ink-100">{breadcrumb}</span>
          </button>
        )}
      </div>
      <button
        onClick={onClearPose}
        className="text-ink-300 hover:text-ink-50 text-xs underline decoration-ink-600 hover:decoration-ink-100 flex-shrink-0"
        aria-label="Clear pose"
      >
        clear pose
      </button>
    </div>
  );
}

// ----- Overview (pose summary; entry points to state and muscle drill-downs) -----

function PoseOverview({
  pose,
  onSetFocus,
}: {
  pose: Pose;
  onSetFocus: (focus: PanelFocus) => void;
}) {
  const counts = muscleCountsByState(pose);

  return (
    <>
      {pose.plainLanguage && (
        <p className="text-ink-50 leading-relaxed text-base">{pose.plainLanguage}</p>
      )}

      {pose.injurySites && pose.injurySites.length > 0 && (
        <section className="bg-[#e8b04a]/10 border border-[#e8b04a]/40 rounded-md p-3 space-y-2">
          <h3 className="text-xs uppercase tracking-widest text-[#e8b04a] flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-sm bg-[#e8b04a]" />
            Where tension goes — and where injuries happen
          </h3>
          <ul className="space-y-2 text-sm text-ink-100 leading-relaxed">
            {pose.injurySites.map((s, i) => (
              <li key={i}>
                <span className="text-[#e8b04a] font-medium">
                  {s.muscle ? muscleLabelFromSlug(s.muscle) : s.region}:
                </span>{' '}
                <span>{s.note}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onSetFocus({ kind: 'state-detail', state: 'at-risk' })}
            className="mt-1 text-[11px] text-[#e8b04a] hover:text-ink-50 underline decoration-[#e8b04a]/40"
          >
            See every muscle at risk →
          </button>
        </section>
      )}

      <details>
        <summary className="text-xs uppercase tracking-widest text-ink-300 cursor-pointer hover:text-ink-100">
          Full description &amp; intent
        </summary>
        <div className="mt-3 space-y-3">
          <p className="text-sm text-ink-100 leading-relaxed">{pose.description}</p>
          <p className="text-sm text-ink-200 leading-relaxed italic">{pose.intent}</p>
        </div>
      </details>

      <section>
        <h3 className="text-xs uppercase tracking-widest text-ink-300 mb-2">Cues</h3>
        <ul className="space-y-1.5 text-sm text-ink-100">
          {pose.cues.map((c, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#e89a4a]" />
              <span className="leading-relaxed">{c}</span>
            </li>
          ))}
        </ul>
      </section>

      {pose.watchFor && pose.watchFor.length > 0 && (
        <section>
          <h3 className="text-xs uppercase tracking-widest text-[#c45050] mb-2">Watch for</h3>
          <ul className="space-y-1.5 text-sm text-ink-200">
            {pose.watchFor.map((w, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#c45050]" />
                <span className="leading-relaxed">{w}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Muscle involvement — drill-in entry points */}
      <section className="border-t border-ink-700/60 pt-5">
        <h3 className="text-xs uppercase tracking-widest text-ink-300 mb-1">
          Muscle involvement
        </h3>
        <p className="text-xs text-ink-300 mb-3">
          Click any state to see every muscle doing that work in this pose,
          with notes. Click a muscle in the 3D view (or below) to drill into it.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {LEGEND_STATES.map((s) => (
            <button
              key={s}
              onClick={() => onSetFocus({ kind: 'state-detail', state: s })}
              disabled={counts[s] === 0}
              className="flex items-center gap-2 rounded-md border border-ink-700 hover:border-ink-500 hover:bg-ink-800/60 transition px-2.5 py-2 text-left disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-ink-700"
              style={{
                backgroundColor:
                  counts[s] > 0 ? SIMPLE_STATE_COLORS[s] + '0d' : undefined,
                borderColor: counts[s] > 0 ? SIMPLE_STATE_COLORS[s] + '40' : undefined,
              }}
            >
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0 border border-ink-700"
                style={{ backgroundColor: SIMPLE_STATE_COLORS[s] }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-ink-50 font-medium leading-tight">
                  {SIMPLE_STATE_LABELS[s]}
                </div>
                <div className="text-[10px] text-ink-300 mt-0.5">
                  {counts[s]} muscle{counts[s] === 1 ? '' : 's'}
                </div>
              </div>
              <span className="text-ink-400 text-[10px]">→</span>
            </button>
          ))}
        </div>
      </section>

      {/* Bone involvement — angle inventory from pose-angles.ts */}
      <PoseBoneInvolvement poseId={pose.id} />
    </>
  );
}

// ----- State-detail view (every muscle in one state, with notes) -----

function StateDetailView({
  pose,
  state,
  onSelect,
  onSetFocus,
}: {
  pose: Pose;
  state: SimpleState;
  onSelect: (id: string) => void;
  onSetFocus: (focus: PanelFocus) => void;
}) {
  const entries = muscleEntriesByState(pose, state);
  const primarySet = new Set(pose.primaryMuscles ?? []);

  // For at-risk view, also surface injurySites entries that don't have
  // a state entry of their own — those are pose-warning entries.
  const extraInjuries =
    state === 'at-risk' && pose.injurySites
      ? pose.injurySites.filter(
          (s) =>
            s.muscle &&
            !entries.some((e) => e.muscle === s.muscle),
        )
      : [];

  return (
    <>
      <section
        className="rounded-md p-3 border"
        style={{
          backgroundColor: SIMPLE_STATE_COLORS[state] + '14',
          borderColor: SIMPLE_STATE_COLORS[state] + '60',
        }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="inline-block w-3 h-3 rounded-sm flex-shrink-0 border border-ink-700"
            style={{ backgroundColor: SIMPLE_STATE_COLORS[state] }}
          />
          <h3 className="text-sm text-ink-50 font-medium">
            {SIMPLE_STATE_LABELS[state]} muscles in {pose.english}
          </h3>
        </div>
        <p className="text-xs text-ink-200 leading-relaxed">
          {SIMPLE_STATE_DESCRIPTIONS[state]}
        </p>
      </section>

      {entries.length === 0 && extraInjuries.length === 0 && (
        <p className="text-sm text-ink-300 italic">
          No muscles in this pose are{' '}
          {SIMPLE_STATE_LABELS[state].toLowerCase()}.
        </p>
      )}

      {entries.length > 0 && (
        <section>
          <ul className="space-y-3">
            {entries.map((entry, i) => (
              <MuscleEntryCard
                key={`${entry.muscle}-${entry.side ?? 'both'}-${i}`}
                pose={pose}
                entry={entry}
                isPrimary={primarySet.has(entry.muscle)}
                onClick={() => {
                  // Click into a muscle: select it on the 3D body AND drill into it
                  const partId = partIdForEntry(entry);
                  if (partId) {
                    onSelect(partId);
                    onSetFocus({ kind: 'muscle-focus', partId });
                  }
                }}
              />
            ))}
          </ul>
        </section>
      )}

      {extraInjuries.length > 0 && (
        <section className="border-t border-ink-700/60 pt-4">
          <h4 className="text-xs uppercase tracking-widest text-[#e8b04a] mb-2">
            Also at risk in this pose
          </h4>
          <ul className="space-y-2">
            {extraInjuries.map((s, i) => (
              <li
                key={i}
                className="text-xs text-ink-100 leading-relaxed border-l-2 border-[#e8b04a]/60 pl-3"
              >
                <div className="font-medium text-ink-50 mb-0.5">
                  {s.muscle ? muscleLabelFromSlug(s.muscle) : s.region}
                </div>
                <div>{s.note}</div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

// ----- Muscle-focus view (one muscle, in this pose, with peers) -----

function MuscleFocusView({
  pose,
  partId,
  onSelect,
  onSetFocus,
}: {
  pose: Pose;
  partId: string;
  onSelect: (id: string) => void;
  onSetFocus: (focus: PanelFocus) => void;
}) {
  const part = getBodyPart(partId);
  if (!part) {
    return (
      <p className="text-sm text-ink-300 italic">
        Couldn&apos;t find that part. <button onClick={() => onSetFocus({ kind: 'overview' })} className="underline">Back to overview</button>.
      </p>
    );
  }

  // For bones, just show anatomy + return-to-pose link
  if (part.kind === 'bone') {
    return <BodyPartAnatomyInPose part={part} />;
  }

  const entry = entryForPart(pose, part);
  const simpleState = getSimpleStateForPart(pose, part);
  const isPrimary = isPrimaryForPart(pose, part);
  const isAtRisk = isAtRiskForPart(pose, part);

  const injuryNote =
    isAtRisk && pose.injurySites
      ? pose.injurySites.find((s) => {
          if (!s.muscle) return false;
          const m = part.id.match(/^muscle_(.+?)_([lr])$/);
          if (!m) return false;
          if (s.muscle !== m[1]) return false;
          const side = s.side || 'both';
          return side === 'both' || side === m[2];
        })?.note
      : undefined;

  const peers = entry ? peersOfMuscleInState(pose, entry) : [];
  const primarySet = new Set(pose.primaryMuscles ?? []);

  return (
    <>
      {/* What this muscle is doing in this pose */}
      <section>
        <p className="text-xs uppercase tracking-widest text-ink-300 mb-1">
          {part.name}
          {part.side && <span className="text-ink-400 ml-2 font-mono">{part.side === 'l' ? 'L' : 'R'}</span>}
          {isPrimary && (
            <span className="ml-2 text-[#d65a3a]">· primary in this pose</span>
          )}
        </p>
        {simpleState ? (
          <div
            className="rounded-md border p-3"
            style={{
              backgroundColor: SIMPLE_STATE_COLORS[simpleState] + '14',
              borderColor: SIMPLE_STATE_COLORS[simpleState] + '60',
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0 border border-ink-700"
                style={{ backgroundColor: SIMPLE_STATE_COLORS[simpleState] }}
              />
              <span className="text-sm text-ink-50 font-medium">
                {SIMPLE_STATE_LABELS[simpleState]}
              </span>
              {entry && (
                <span className="text-[11px] text-ink-300 italic">
                  · {detailedStateGloss(entry.state)}
                </span>
              )}
            </div>
            {entry?.note && (
              <p className="text-sm text-ink-100 leading-relaxed">{entry.note}</p>
            )}
            {injuryNote && injuryNote !== entry?.note && (
              <p className="text-sm text-[#e8b04a] leading-relaxed mt-2 pt-2 border-t border-[#e8b04a]/30">
                <strong>Injury watch:</strong> {injuryNote}
              </p>
            )}
            <button
              onClick={() => onSetFocus({ kind: 'state-detail', state: simpleState })}
              className="mt-2 text-[11px] text-ink-300 hover:text-ink-50 underline decoration-ink-600"
            >
              See every muscle that is {SIMPLE_STATE_LABELS[simpleState].toLowerCase()} in this pose →
            </button>
          </div>
        ) : (
          <p className="text-sm text-ink-300 italic">
            This muscle is along for the ride in {pose.english} — no specific role.
          </p>
        )}
      </section>

      {/* Peers — other muscles doing the same thing */}
      {peers.length > 0 && simpleState && (
        <section className="border-t border-ink-700/60 pt-5">
          <h3 className="text-xs uppercase tracking-widest text-ink-300 mb-1">
            Working alongside it
          </h3>
          <p className="text-xs text-ink-300 mb-3">
            Other muscles {SIMPLE_STATE_LABELS[simpleState].toLowerCase()} in {pose.english}:
          </p>
          <ul className="space-y-2">
            {peers.map((p, i) => (
              <MuscleEntryCard
                key={`${p.muscle}-${p.side ?? 'both'}-${i}`}
                pose={pose}
                entry={p}
                compact
                isPrimary={primarySet.has(p.muscle)}
                onClick={() => {
                  const peerId = partIdForEntry(p);
                  if (peerId) {
                    onSelect(peerId);
                    onSetFocus({ kind: 'muscle-focus', partId: peerId });
                  }
                }}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Anatomy (collapsed by default — the pose context is the headline) */}
      <details className="border-t border-ink-700/60 pt-5">
        <summary className="text-xs uppercase tracking-widest text-ink-300 cursor-pointer hover:text-ink-100">
          Anatomy details
        </summary>
        <div className="mt-3 space-y-3">
          {part.summary && (
            <p className="text-sm text-ink-100 leading-relaxed">{part.summary}</p>
          )}
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
          {part.joints && part.joints.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-widest text-ink-300 mb-1.5">Crosses</h4>
              <div className="flex flex-wrap gap-1.5">
                {part.joints.map((j) => (
                  <span key={j} className="text-xs px-2 py-0.5 rounded-full border border-ink-600 text-ink-200">{j}</span>
                ))}
              </div>
            </div>
          )}
          {part.actions && part.actions.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-widest text-ink-300 mb-1.5">Actions</h4>
              <ul className="space-y-1 text-sm text-ink-100">
                {part.actions.map((a) => (
                  <li key={a} className="flex gap-2">
                    <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#c45050]" />
                    <span className="leading-relaxed">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {part.yoga && (
            <div className="pt-2 border-t border-ink-700/60">
              <h4 className="text-xs uppercase tracking-widest text-[#e8b04a] mb-1.5">In yoga practice</h4>
              <p className="text-sm text-ink-100 leading-relaxed italic">{part.yoga}</p>
            </div>
          )}
        </div>
      </details>
    </>
  );
}

// ============================================================
// Reusable subcomponents
// ============================================================

function MuscleEntryCard({
  pose,
  entry,
  isPrimary,
  onClick,
  compact = false,
}: {
  pose: Pose;
  entry: MuscleStateEntry;
  isPrimary: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  const state = simpleStateOfEntry(pose, entry);
  const side = entry.side && entry.side !== 'both' ? ` (${entry.side.toUpperCase()})` : '';
  return (
    <li>
      <button
        onClick={onClick}
        className="w-full text-left rounded-md border border-ink-700/60 hover:border-ink-500 hover:bg-ink-800/60 transition px-3 py-2 group"
        style={{
          borderLeftColor: SIMPLE_STATE_COLORS[state],
          borderLeftWidth: '3px',
        }}
      >
        <div className="flex items-baseline gap-2 flex-wrap">
          <span
            className={
              isPrimary
                ? 'text-ink-50 font-medium text-[13px]'
                : 'text-ink-100 text-[13px]'
            }
          >
            {muscleLabelFromSlug(entry.muscle)}
            {side}
          </span>
          {isPrimary && (
            <span className="text-[9px] uppercase tracking-[0.15em] text-[#d65a3a]">
              primary
            </span>
          )}
          <span className="text-[10px] text-ink-400 italic ml-auto">
            {detailedStateGloss(entry.state)}
          </span>
        </div>
        {!compact && entry.note && (
          <p className="text-xs text-ink-300 mt-1 leading-snug">{entry.note}</p>
        )}
      </button>
    </li>
  );
}

// Strip the leading category from STATE_LABELS — turns
// "Eccentric — lengthening under load" into "lengthening under load".
function detailedStateGloss(state: MuscleState): string {
  const full = STATE_LABELS[state];
  return full.split('—')[1]?.trim() ?? full;
}

// Bone-rotation thresholds for "this joint is meaningfully involved."
const BONE_INVOLVED_THRESHOLD = 5;

function boneLabel(key: string): string {
  const [bone, axis] = key.split('__');
  if (bone.startsWith('region:')) {
    const region = bone.slice('region:'.length);
    return region.charAt(0).toUpperCase() + region.slice(1) + ' spine';
  }
  const sideMatch = bone.match(/_(l|r)$/);
  const side = sideMatch ? (sideMatch[1] === 'l' ? 'Left ' : 'Right ') : '';
  const stem = sideMatch ? bone.slice(0, -2) : bone;
  const stemLabels: Record<string, string> = {
    UpperArm: 'shoulder',
    Forearm: 'elbow',
    Hand: 'wrist',
    Thigh: 'hip',
    Shin: 'knee',
    Foot: 'ankle',
  };
  const stemDisplay = stemLabels[stem] ?? stem.toLowerCase();
  const axisLabels: Record<string, string> = {
    x: 'flex/extend',
    y: 'rotate',
    z: 'abduct',
  };
  const axisDisplay = axisLabels[axis] ?? axis;
  return `${side}${stemDisplay} — ${axisDisplay}`;
}

function PoseBoneInvolvement({ poseId }: { poseId: string }) {
  const pose = POSE_ANGLES.find((p) => p.id === poseId);
  if (!pose) return null;
  const entries = Object.entries(pose.angles)
    .filter(([, deg]) => Math.abs(deg) >= BONE_INVOLVED_THRESHOLD)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  if (entries.length === 0) return null;
  return (
    <section className="border-t border-ink-700/60 pt-5">
      <h3 className="text-xs uppercase tracking-widest text-ink-300 mb-1">
        Joints &amp; bones engaged
      </h3>
      <p className="text-xs text-ink-300 mb-3">
        Which joints leave neutral and by how much.
      </p>
      <ul className="space-y-1">
        {entries.map(([key, deg]) => (
          <li key={key} className="flex items-baseline gap-2 text-xs">
            <span className="text-ink-100 flex-1">{boneLabel(key)}</span>
            <span className="font-mono text-ink-300 text-[11px]">
              {deg > 0 ? '+' : ''}
              {Math.round(deg)}°
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ============================================================
// Anatomy panels (non-pose branch + collapsed-in-pose branch)
// ============================================================

function BodyPartAnatomyPanel({ part, onClose }: { part: BodyPart; onClose: () => void }) {
  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-start justify-between gap-4 p-6 pb-3 border-b border-ink-700 bg-ink-800/95 backdrop-blur sticky top-0 z-10 flex-shrink-0">
        <div className="min-w-0">
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ color: part.kind === 'muscle' ? '#c45050' : '#e8dec5' }}
          >
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

function BodyPartAnatomyInPose({ part }: { part: BodyPart }) {
  // Bones clicked during a pose: render anatomy but framed as "within this pose".
  return (
    <section>
      <p className="text-xs uppercase tracking-widest text-ink-300 mb-1">
        Bone · {REGION_LABELS[part.region]}
      </p>
      <h3 className="font-serif text-xl text-ink-50 mb-3">
        {part.name}
        {part.side && <span className="text-ink-400 ml-2 font-mono text-sm">{part.side === 'l' ? 'L' : 'R'}</span>}
      </h3>
      {part.summary && <p className="text-sm text-ink-100 leading-relaxed">{part.summary}</p>}
    </section>
  );
}

function EmptyPanel() {
  return (
    <div className="h-full flex flex-col items-start justify-start gap-4 p-6 text-ink-200">
      <h2 className="font-serif text-2xl text-ink-50">The Body</h2>
      <p className="text-sm leading-relaxed">
        Each muscle and bone comes from{' '}
        <a
          href="https://z-anatomy.com"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-ink-500"
        >
          Z-Anatomy
        </a>
        , a libre 3D atlas. Annotations are written through the lens of Ashtanga Vinyasa.
      </p>
      <p className="text-sm leading-relaxed">
        Click a muscle for its origin, insertion, and yoga role. Pick a pose on the left to color every muscle by what it&apos;s doing in that pose — and then click any muscle to drill into what it&apos;s doing alongside its peers.
      </p>
      <p className="text-xs uppercase tracking-widest text-ink-300 mt-4">
        Origin (green) and insertion (pink) dots appear when a muscle is selected.
      </p>
    </div>
  );
}

// ============================================================
// Small utilities
// ============================================================

/** Turn 'long_head_of_biceps_femoris' into 'Long Head Of Biceps Femoris'. */
function muscleLabelFromSlug(slug: string): string {
  return slug
    .split('_')
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ');
}

/** Try to construct a body-part id for a muscle entry. Prefers 'r' side when side is 'both' (arbitrary but stable). */
function partIdForEntry(entry: MuscleStateEntry): string | null {
  const side = entry.side ?? 'r';
  const sideKey = side === 'both' ? 'r' : side;
  const candidate = `muscle_${entry.muscle}_${sideKey}`;
  const part = BODY_PARTS.find((p) => p.id === candidate);
  if (part) return candidate;
  // Fallback: try the other side
  const alt = `muscle_${entry.muscle}_${sideKey === 'r' ? 'l' : 'r'}`;
  return BODY_PARTS.some((p) => p.id === alt) ? alt : null;
}

/** Pretty-print a body-part id like 'muscle_latissimus_dorsi_l'. */
function muscleLabelFromPartId(partId: string): string {
  const part = getBodyPart(partId);
  if (part) {
    const side =
      part.side === 'l' ? ' (L)' : part.side === 'r' ? ' (R)' : '';
    return part.name + side;
  }
  return partId;
}
