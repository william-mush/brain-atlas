import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  POSES,
  getPose,
  muscleCountsByState,
  SIMPLE_STATE_COLORS,
  SIMPLE_STATE_LABELS,
} from '@/lib/poses';
import { POSE_ANGLES } from '@/lib/pose-angles';
import PosePageCanvases from '@/components/PosePageCanvases';

export function generateStaticParams() {
  return POSES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pose = getPose(id);
  if (!pose) return { title: 'Pose Not Found · The Brain Atlas' };
  return { title: `${pose.english} · The Brain Atlas` };
}

export default async function PosePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pose = getPose(id);
  if (!pose) notFound();

  const hasAngles = POSE_ANGLES.some((p) => p.id === id);
  const counts = muscleCountsByState(pose);

  return (
    <main className="h-[calc(100vh-64px)] flex flex-col bg-ink-900">
      <header className="px-6 py-3 border-b border-ink-700 bg-ink-800/60 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="min-w-0 flex-1">
          <Link
            href="/body"
            className="text-[11px] text-ink-300 hover:text-ink-100 inline-flex items-center gap-1 mb-1"
          >
            <span aria-hidden>←</span> body atlas
          </Link>
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-xl text-ink-50 leading-tight truncate">
              {pose.english}
            </h1>
            <span className="font-serif italic text-ink-300 text-sm">{pose.sanskrit}</span>
            {pose.sequence && (
              <span className="text-ink-400 text-xs italic font-serif">{pose.sequence}</span>
            )}
          </div>
        </div>
        {pose.plainLanguage && (
          <p className="text-xs text-ink-200 max-w-md leading-snug hidden lg:block">
            {pose.plainLanguage}
          </p>
        )}
      </header>

      <PosePageCanvases poseId={pose.id} hasAngles={hasAngles} />

      <footer className="px-6 py-3 border-t border-ink-700 bg-ink-800/60 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-4 text-xs flex-wrap">
          {(['working', 'stretching', 'at-risk', 'quiet'] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm border border-ink-700"
                style={{ backgroundColor: SIMPLE_STATE_COLORS[s] }}
              />
              <span className="text-ink-200">{SIMPLE_STATE_LABELS[s]}</span>
              <span className="text-ink-400">({counts[s]})</span>
            </div>
          ))}
        </div>
        <Link
          href="/body"
          className="text-[11px] text-ink-300 hover:text-ink-50 underline decoration-ink-600 hover:decoration-ink-100 flex-shrink-0"
        >
          full body atlas →
        </Link>
      </footer>
    </main>
  );
}
