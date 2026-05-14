import { Suspense } from 'react';
import BodyExplorer from '@/components/BodyExplorer';

export const metadata = {
  title: 'Body Atlas · The Atlas',
};

export default function BodyPage() {
  // BodyExplorer reads `?pose=<id>` via useSearchParams, which Next 16
  // requires to live inside a Suspense boundary when used in client
  // components rendered from a server page.
  return (
    <Suspense fallback={null}>
      <BodyExplorer />
    </Suspense>
  );
}
