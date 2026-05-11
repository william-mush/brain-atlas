import { notFound } from 'next/navigation';
import EssayLayout from '@/components/EssayLayout';
import { REGION_ESSAYS } from '@/lib/region-essays';

export function generateStaticParams() {
  return Object.keys(REGION_ESSAYS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essay = REGION_ESSAYS[slug];
  if (!essay) return { title: 'Not found' };
  return { title: `${essay.title} · The Brain Atlas` };
}

export default async function RegionEssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essay = REGION_ESSAYS[slug];
  if (!essay) notFound();

  return (
    <EssayLayout
      tag={essay.tag}
      tint={essay.tint}
      title={essay.title}
      related={[
        { href: '/explore', label: 'Back to the 3D atlas' },
        { href: '/systems/consciousness', label: 'Consciousness' },
        { href: '/systems/autonomic', label: 'Autonomic' },
      ]}
    >
      {essay.body}
    </EssayLayout>
  );
}
