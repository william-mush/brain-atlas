import EssayLayout from '@/components/EssayLayout';

export const metadata = { title: 'Credits & Licensing · The Brain Atlas' };

export default function CreditsPage() {
  return (
    <EssayLayout
      tag="Credits"
      tint="#cfc7b1"
      title="Credits &amp; Licensing"
      related={[{ href: '/', label: 'Home' }, { href: '/explore', label: 'Explore' }]}
    >
      <p>
        The 3D atlas combines anatomical data from three open scientific
        sources, plus a few procedural placeholders for structures none of
        them cover. Each region in the explorer is labeled with its
        provenance.
      </p>

      <h2>BodyParts3D — subcortical and brainstem structures</h2>
      <p>
        Most subcortical and brainstem meshes (cerebellum, hippocampus,
        amygdala, thalamus, hypothalamus, basal ganglia, pons, medulla,
        midbrain, pituitary, corpus callosum, fornix, the BP3D
        occipital/insula/cingulate cortical surfaces, and the white-matter
        hemispheric shells) come from <strong>BodyParts3D</strong>, a
        project by the Database Center for Life Science (DBCLS), Japan.
      </p>
      <blockquote>
        BodyParts3D, Copyright © The Database Center for Life Science,
        licensed by CC Attribution-Share Alike 2.1 Japan.
      </blockquote>
      <p>
        Project home:{' '}
        <a href="https://lifesciencedb.jp/bp3d/" target="_blank" rel="noreferrer">
          lifesciencedb.jp/bp3d
        </a>
        <br />
        Archive:{' '}
        <a
          href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html"
          target="_blank"
          rel="noreferrer"
        >
          dbarchive.biosciencedbc.jp/en/bodyparts3d
        </a>
      </p>
      <p>
        Derived meshes in <code>/models/brain.glb</code> are made available
        under the same CC BY-SA 2.1 JP terms.
      </p>

      <h2>FreeSurfer fsaverage — the foliated cortex</h2>
      <p>
        The 68 named cortical regions (34 per hemisphere) come from the
        FreeSurfer <em>fsaverage</em> template — the average cortical
        surface derived from 40 MRI scans — parcellated using the
        <strong> Desikan–Killiany</strong> atlas. This is the gold-standard
        reference cortex used in academic neuroscience.
      </p>
      <p>
        Surfaces obtained from TemplateFlow:{' '}
        <a
          href="https://github.com/templateflow/tpl-fsaverage"
          target="_blank"
          rel="noreferrer"
        >
          github.com/templateflow/tpl-fsaverage
        </a>
      </p>
      <p>
        FreeSurfer is distributed by the Athinoula A. Martinos Center for
        Biomedical Imaging at MGH/Harvard.
      </p>
      <blockquote>
        Dale, Fischl, &amp; Sereno (1999); Fischl &amp; Dale (2000); Desikan
        et al. (2006). FreeSurfer is licensed for non-commercial research
        and educational use under MGH&apos;s standard license; redistribution
        of derivative surface meshes with attribution is permitted.
      </blockquote>
      <p>
        Citations:
      </p>
      <ul>
        <li>
          Dale AM, Fischl B, Sereno MI. Cortical surface-based analysis.
          I. Segmentation and surface reconstruction. <em>NeuroImage</em>{' '}
          9(2):179–194, 1999.
        </li>
        <li>
          Desikan RS, Ségonne F, Fischl B, et al. An automated labeling
          system for subdividing the human cerebral cortex on MRI scans
          into gyral-based regions of interest. <em>NeuroImage</em>{' '}
          31(3):968–980, 2006.
        </li>
      </ul>

      <h2>Xie et al. 2025 — diffusion-MRI cranial nerve atlas</h2>
      <p>
        Real anatomical paths for cranial nerves II, III, V, and VII/VIII
        come from a published diffusion-MRI tractography atlas built from
        50 Human Connectome Project subjects.
      </p>
      <ul>
        <li>
          Xie L, Huang J, Zhang J, et al. Automated Mapping the Pathways of
          Cranial Nerve II, III, V, and VII/VIII: A Multi-Parametric
          Multi-Stage Diffusion Tractography Atlas.{' '}
          <em>IEEE Transactions on Biomedical Engineering</em>, 2025.
          <a href="https://arxiv.org/abs/2507.23245" target="_blank" rel="noreferrer">
            {' '}arxiv.org/abs/2507.23245
          </a>
        </li>
        <li>
          Source data:{' '}
          <a
            href="https://github.com/IPIS-XieLei/CNsAtlas"
            target="_blank"
            rel="noreferrer"
          >
            github.com/IPIS-XieLei/CNsAtlas
          </a>
        </li>
      </ul>
      <p>
        The published repository does not currently include an explicit
        software license file. Derivative meshes are included here with
        full citation to the original work; please contact the original
        authors before any commercial use.
      </p>

      <h2>Procedural paths — the other cranial nerves</h2>
      <p>
        Cranial nerves I, IV, VI, IX, X (vagus), XI, and XII do not appear
        in the Xie 2025 atlas. Their paths in the atlas are rendered as
        procedural Catmull–Rom curves through anatomical landmarks
        (brainstem emergence points, ganglia, target organs). They are
        labeled <code>Procedural</code> in the source selector.
      </p>

      <h2>Anatomical content</h2>
      <p>
        The written content draws on standard neuroanatomy and a long
        readership of working neuroscientists. None of it is medical
        advice.
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
