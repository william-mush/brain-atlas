'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  /** The content shown in the margin (desktop) or footnote (mobile). */
  children: React.ReactNode;
  /** Marginalia color tint. Defaults to muted ink. */
  tint?: string;
}

/**
 * Tufte-style sidenote.
 *
 * Numbering is assigned at mount based on DOM order — each instance asks the
 * EssayMDX wrapper (which owns the counter) for its number. This works
 * correctly across SSR and client hydration because the number is rendered
 * as a placeholder (?) on the server and resolved to a real digit on first
 * client paint.
 *
 * Desktop (>=1280px / xl): the aside element is absolutely positioned by
 * the EssayMDX wrapper at the same vertical offset as the inline marker.
 * The wrapper uses ResizeObserver to keep positions current as the page
 * reflows.
 *
 * Mobile/tablet: the aside is rendered inline as a block element below the
 * paragraph that contains the marker. No magic positioning.
 */
export default function SideNote({ children, tint }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [num, setNum] = useState<number | null>(null);

  useEffect(() => {
    // Walk all SideNote markers in document order and find our position.
    // Querying at mount, after all sidenotes have rendered, gives stable
    // numbering regardless of React strict-mode double invocation.
    if (typeof document === 'undefined') return;
    const all = Array.from(
      document.querySelectorAll('[data-sidenote-marker]'),
    );
    const idx = all.indexOf(ref.current as Element);
    if (idx >= 0) setNum(idx + 1);
  }, []);

  // Slightly muted accent so the marker reads as marginalia, not as a UI chip.
  const accent = tint ?? '#8a7f60';
  const display = num ?? '?';

  return (
    <span
      ref={ref}
      data-sidenote-marker
      className="inline align-baseline"
    >
      <sup
        data-sidenote-anchor
        className="text-[0.7em] align-super select-none mr-[1px]"
        style={{ color: accent }}
      >
        {display}
      </sup>
      {/* Inline aside.
            Mobile (default): renders as a callout via display:inline-block.
            We keep a subtle left border on mobile only — it helps the eye
            separate the aside from the surrounding prose where there's no
            margin to provide that separation.
            Desktop (xl+): the EssayMDX wrapper absolute-positions us into
            the right margin. No border, no number prefix — the aside reads
            as a whispered annotation, the way Tufte's marginalia do. */}
      <span
        data-sidenote-content
        className="inline-block align-top w-full xl:w-80 mt-2 mb-3 xl:mt-0 xl:mb-0 pl-3 xl:pl-0 border-l xl:border-l-0 text-[0.82rem] xl:text-[0.78rem] leading-snug text-ink-300 italic font-sans not-prose"
        style={{ borderColor: accent }}
      >
        {/* Number prefix shown ONLY on mobile, where there's no spatial
            relationship to the marker. On desktop the visual alignment
            in the margin makes the number redundant. */}
        <span
          className="xl:hidden not-italic font-medium mr-1"
          style={{ color: accent }}
        >
          {display}.
        </span>
        {children}
      </span>
    </span>
  );
}
