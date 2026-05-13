'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface Props {
  tag: string;
  tint: string;
  title: string;
  subtitle?: string;
  related?: { href: string; label: string }[];
  children: React.ReactNode;
}

/**
 * Layout wrapper for long-form MDX essays.
 *
 * Desktop (>=1280px): main column ~72ch wide, with a 22rem right margin
 * holding absolutely-positioned sidenotes. Each [data-sidenote-content]
 * element is placed at the same vertical offset as its parent
 * [data-sidenote-marker], so a sidenote sits next to the sentence that
 * spawned it. We re-run the positioning on resize and on font load.
 *
 * Mobile/tablet: sidenotes render inline as block-level callouts below the
 * paragraph that contains the marker. No positioning, no JS needed.
 */
export default function EssayMDX({
  tag,
  tint,
  title,
  subtitle,
  related,
  children,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Position sidenotes absolutely in the right margin on wide screens.
    // We do this in a useEffect rather than CSS because the vertical
    // anchor depends on layout, which we can't know without measuring.
    if (typeof window === 'undefined') return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const place = () => {
      const isDesktop = window.innerWidth >= 1280;
      const markers = Array.from(
        wrapper.querySelectorAll<HTMLElement>('[data-sidenote-marker]'),
      );

      if (!isDesktop) {
        // Mobile: clear any inline positioning we set on a previous run, so
        // the content flows inline (display:inline-block) again.
        for (const marker of markers) {
          const note = marker.querySelector<HTMLElement>(
            '[data-sidenote-content]',
          );
          if (!note) continue;
          note.style.position = '';
          note.style.top = '';
          note.style.left = '';
          note.style.width = '';
        }
        return;
      }

      // Desktop: lift every note out of inline flow FIRST. Otherwise the
      // content's inline-block height inflates the marker's bounding rect
      // and we measure the wrong vertical position.
      for (const marker of markers) {
        const note = marker.querySelector<HTMLElement>(
          '[data-sidenote-content]',
        );
        if (!note) continue;
        note.style.position = 'absolute';
        note.style.visibility = 'hidden';
        // Temporarily place off-screen so we can measure article width
        // without the notes pushing layout around.
        note.style.left = '-9999px';
        note.style.width = '20rem';
        note.style.top = '0px';
      }

      // Measure the article's actual rendered right edge. The article is
      // `prose-atlas` with `max-width: 70ch`, but in serif at 1.05rem `1ch`
      // is wider than the rem-based estimate would suggest — so we read
      // the real number rather than guessing.
      const article = wrapper.querySelector<HTMLElement>('article.prose-atlas');
      const wrapperBox = wrapper.getBoundingClientRect();
      const articleBox = article?.getBoundingClientRect() ?? wrapperBox;
      // Offset the sidenote column to start GAP px right of the article's
      // right edge, expressed in wrapper-local coordinates.
      const GAP = 40;
      const sideLeft = articleBox.right - wrapperBox.left + GAP;

      let lastBottom = -Infinity;

      for (const marker of markers) {
        const note = marker.querySelector<HTMLElement>(
          '[data-sidenote-content]',
        );
        const anchor = marker.querySelector<HTMLElement>(
          '[data-sidenote-anchor]',
        );
        if (!note || !anchor) continue;

        const anchorBox = anchor.getBoundingClientRect();
        const desiredTop = anchorBox.top - wrapperBox.top;
        const top = Math.max(desiredTop, lastBottom + 8);

        note.style.left = `${sideLeft}px`;
        note.style.top = `${top}px`;
        note.style.visibility = 'visible';

        const noteRect = note.getBoundingClientRect();
        lastBottom = top + noteRect.height;
      }
    };

    place();

    const ro = new ResizeObserver(place);
    ro.observe(wrapper);
    window.addEventListener('resize', place);
    window.addEventListener('load', place);
    // Re-run after fonts settle (changes paragraph heights).
    if ('fonts' in document) {
      (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready.then(() => place());
    }

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('load', place);
    };
  }, []);

  return (
    <main className="mx-auto px-6 pt-12 pb-24 max-w-3xl xl:max-w-[80rem]">
      <Link
        href="/awareness"
        className="text-xs text-ink-300 hover:text-ink-100 inline-flex items-center gap-1 mb-8"
      >
        <span aria-hidden>←</span> awareness wing
      </Link>

      <div ref={wrapperRef} className="relative">
        <p
          className="text-[11px] uppercase tracking-[0.22em] mb-3"
          style={{ color: tint }}
        >
          {tag}
        </p>
        <article className="prose-atlas">
          <h1>{title}</h1>
          {subtitle && (
            <p className="text-ink-300 italic text-lg -mt-3 mb-8">
              {subtitle}
            </p>
          )}
          {children}
        </article>

        {related && related.length > 0 && (
          <aside className="mt-16 pt-8 border-t border-ink-700 max-w-prose">
            <p className="text-xs uppercase tracking-widest text-ink-300 mb-3">
              Keep reading
            </p>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="text-sm px-3 py-1.5 rounded-full border border-ink-600 text-ink-100 hover:bg-ink-800 transition"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
