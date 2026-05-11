import EssayLayout from '@/components/EssayLayout';

export const metadata = { title: 'Credits & Licensing · The Brain Atlas' };

export default function CreditsPage() {
  return (
    <EssayLayout
      tag="Credits"
      tint="#cfc7b1"
      title="Credits & Licensing"
      related={[{ href: '/', label: 'Home' }, { href: '/explore', label: 'Explore' }]}
    >
      <h2>3D Anatomical Meshes</h2>
      <p>
        The 3D anatomical surfaces used in the explorer are derived from
        <strong> BodyParts3D</strong>, a project by the Database Center for
        Life Science (DBCLS) in Japan. The original surfaces are released
        under the Creative Commons Attribution-ShareAlike 2.1 Japan license
        (CC BY-SA 2.1 JP).
      </p>
      <blockquote>
        BodyParts3D, Copyright © The Database Center for Life Science,
        licensed by CC Attribution-Share Alike 2.1 Japan.
      </blockquote>
      <p>
        The original meshes were extracted from the BodyParts3D v4.0 OBJ
        archive (the &quot;is-a&quot; tree, 99% polygon-reduction variant),
        transformed into a head-centered coordinate frame, decimated by
        vertex clustering for fast web delivery, and packed into a single
        glTF binary (.glb) file. Each anatomical region is preserved as a
        named, individually selectable node.
      </p>
      <p>
        Under the share-alike clause, derivative works including this
        atlas&apos;s mesh file (<code>/models/brain.glb</code>) are
        themselves available under CC BY-SA 2.1 JP. Source for the
        extraction and conversion pipeline is in the project repository.
      </p>
      <p>
        Project home:{' '}
        <a
          href="https://lifesciencedb.jp/bp3d/"
          target="_blank"
          rel="noreferrer"
        >
          lifesciencedb.jp/bp3d
        </a>
        <br />
        Download archive:{' '}
        <a
          href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html"
          target="_blank"
          rel="noreferrer"
        >
          dbarchive.biosciencedbc.jp/en/bodyparts3d
        </a>
      </p>

      <h2>Regions not in BodyParts3D</h2>
      <p>
        A few structures referenced in the essays — the individual cortical
        lobes (frontal, parietal, temporal), the vagus nerve, the spinal
        cord, the sympathetic chain, and the enteric nervous system — are
        not provided as individual meshes by BodyParts3D. They are rendered
        as positioned markers so the educational content remains spatially
        coherent. Future versions may incorporate additional public-domain
        sources for these structures.
      </p>

      <h2>Anatomical content</h2>
      <p>
        The written content draws on standard neuroanatomy and a long
        readership of working neuroscientists. None of it is medical
        advice. Where descriptions of clinical phenomena appear, they are
        for general orientation only.
      </p>

      <h2>Software</h2>
      <p>
        Built with Next.js, React, React Three Fiber, Three.js, and
        Tailwind CSS. Source code:{' '}
        <a
          href="https://github.com/william-mush/brain-atlas"
          target="_blank"
          rel="noreferrer"
        >
          github.com/william-mush/brain-atlas
        </a>
        .
      </p>
    </EssayLayout>
  );
}
