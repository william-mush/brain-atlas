'use client';

import { useEffect, useId, useState } from 'react';

interface Props {
  /** The content shown in the margin (desktop) or footnote (mobile). */
  children: React.ReactNode;
  /** Optional manual number. If omitted, the component auto-numbers. */
  n?: number;
  /** Marginalia color tint. Defaults to muted ink. */
  tint?: string;
}

// Auto-incrementing counter, reset between essays via the SideNoteProvider
// pattern below. The order is determined by render order, which is the same
// as reading order in MDX.
let counter = 0;
let lastResetKey: string | null = null;

function nextNumber(resetKey: string): number {
  if (resetKey !== lastResetKey) {
    counter = 0;
    lastResetKey = resetKey;
  }
  counter += 1;
  return counter;
}

/**
 * Tufte-style sidenote.
 *
 * Desktop (≥1280px / xl): inline superscript marker; aside content floats in
 *   the right margin via absolute positioning relative to the essay column.
 * Mobile/tablet: superscript marker links to a numbered footnote at the
 *   bottom of the page (collected automatically by the EssayMDX wrapper).
 *
 * Number is auto-assigned in render order across the essay. Pass `n` to
 *   override (rarely needed).
 */
export default function SideNote({ children, n, tint }: Props) {
  // Use a stable per-instance number. The first render sets it via the
  // auto-counter; we keep it in state so re-renders don't reshuffle.
  const id = useId();
  const [num] = useState(() => n ?? nextNumber('default'));
  const noteId = `sn-${num}`;
  const refId = `snref-${num}`;

  // Register this note with the EssayMDX collector (for mobile footnote list).
  useEffect(() => {
    const detail = { num, id: noteId, refId, html: null as HTMLElement | null };
    const ev = new CustomEvent('sidenote:register', { detail });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(ev);
    }
  }, [num, noteId, refId]);

  const accent = tint ?? '#a99e7e'; // ink-300

  return (
    <>
      <sup
        id={refId}
        className="text-[0.7em] align-super select-none"
        style={{ color: accent }}
      >
        <a
          href={`#${noteId}`}
          className="no-underline hover:underline"
          style={{ color: accent }}
        >
          {num}
        </a>
      </sup>
      {/* Wide-screen sidenote: float into right margin. */}
      <aside
        id={noteId}
        data-sidenote
        data-num={num}
        className="hidden xl:block float-right clear-right w-[18rem] -mr-[20rem] mt-1 mb-3 pl-3 border-l text-[0.82rem] leading-snug text-ink-200 italic font-sans"
        style={{ borderColor: accent }}
      >
        <span className="not-italic font-medium mr-1" style={{ color: accent }}>
          {num}.
        </span>
        {children}
      </aside>
      {/* Mobile: keep a copy as a hidden footnote-source for the collector. */}
      <span
        data-footnote-source
        data-num={num}
        className="hidden"
        aria-hidden
      >
        {children}
      </span>
    </>
  );
}
