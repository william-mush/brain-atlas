import { redirect } from 'next/navigation';
import { POSES, getPose } from '@/lib/poses';

// The /poses/[id] URLs were briefly a standalone two-canvas view.
// They're now redirects into the /body page with the pose pre-selected
// via `?pose=<id>`. The /body page is where all the muscle data and
// drill-down navigation lives; this keeps the URL space consistent
// without duplicating the experience.

export function generateStaticParams() {
  return POSES.map((p) => ({ id: p.id }));
}

export default async function PosePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pose = getPose(id);
  if (!pose) {
    redirect('/body');
  }
  redirect(`/body?pose=${encodeURIComponent(id)}`);
}
