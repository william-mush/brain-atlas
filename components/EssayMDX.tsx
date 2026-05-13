'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Props {
  tag: string;
  tint: string;
  title: string;
  subtitle?: string;
  related?: { href: string; label: string }[];
  children: React.ReactNode;
}

/**
 * Layout wrapper for long-form MDX essays in the awareness wing.
 *
 * Desktop (≥1280px): main column ~70ch, sidenotes float in a right margin
 *   (~18rem). Total max-width allows ~92rem of page width.
 * Mobile/tablet: single column. SideNote markers link to a numbered
 *   footnotes section appended at the end of the essay.
 *
 * Note collection on mobile: SideNote components emit window events on mount
 * that this wrapper does not currently aggregate (mobile users follow the
 * # anchor link to the inline aside, which is still in the document just
 * hidden by CSS). Future improvement: render a footnote list at the bottom.
 */
export default function EssayMDX({
  tag,
  tint,
  title,
  subtitle,
  related,
  children,
}: Props) {
  // The mobile footnotes section is rendered on the client after first paint,
  // collecting any [data-footnote-source] elements that were rendered by
  // <SideNote> on small screens.
  const [footnotes, setFootnotes] = useState<Array<{ num: number; html: string }>>(
    [],
  );

  useEffect(() => {
    // Only build the footnote list on narrow screens.
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= 1280) return;

    const sources = Array.from(
      document.querySelectorAll('[data-footnote-source]'),
    ) as HTMLElement[];
    const items = sources
      .map((el) => ({
        num: Number(el.dataset.num ?? 0),
        html: el.innerHTML,
      }))
      .filter((x) => x.num > 0)
      .sort((a, b) => a.num - b.num);
    // Deduplicate by num — sidenotes render a hidden source AND an aside,
    // but only one is the [data-footnote-source].
    const seen = new Set<number>();
    const deduped = items.filter((x) => {
      if (seen.has(x.num)) return false;
      seen.add(x.num);
      return true;
    });
    setFootnotes(deduped);
  }, []);

  return (
    <main className="mx-auto px-6 pt-12 pb-24 max-w-3xl xl:max-w-[92rem]">
      <Link
        href="/awareness"
        className="text-xs text-ink-300 hover:text-ink-100 inline-flex items-center gap-1 mb-8"
      >
        <span aria-hidden>←</span> awareness wing
      </Link>

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-8">
        <div className="max-w-3xl">
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

          {/* Mobile footnotes — collected from SideNote sources on narrow screens. */}
          {footnotes.length > 0 && (
            <section className="xl:hidden mt-16 pt-8 border-t border-ink-700">
              <h2 className="text-sm uppercase tracking-[0.22em] text-ink-300 mb-4">
                Notes
              </h2>
              <ol className="space-y-3 text-sm text-ink-200 leading-relaxed list-none pl-0">
                {footnotes.map((f) => (
                  <li
                    key={f.num}
                    id={`sn-${f.num}`}
                    className="flex gap-2"
                  >
                    <span className="text-ink-400 font-medium shrink-0">
                      {f.num}.
                    </span>
                    <span
                      // The source HTML may include nested elements/components rendered server-side.
                      dangerouslySetInnerHTML={{ __html: f.html }}
                    />
                  </li>
                ))}
              </ol>
            </section>
          )}

          {related && related.length > 0 && (
            <aside className="mt-16 pt-8 border-t border-ink-700">
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
        {/* Empty right-column placeholder so sidenotes have visual space.
            The actual sidenote DOM elements absolute-float into this column
            via negative right margin set in <SideNote>. */}
        <div className="hidden xl:block" aria-hidden />
      </div>
    </main>
  );
}
