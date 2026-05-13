'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getCitation, formatShortCite } from '@/lib/bibliography';

interface Props {
  id: string;
  /** Optional override of the displayed inline text. */
  as?: string;
  /** Optional page number, section, or specific anchor. */
  loc?: string;
}

/**
 * Inline citation. Renders the short form as a link to /awareness/bibliography#<id>.
 * On hover (desktop) or tap (mobile), shows a small popover with the full citation.
 * If the id is unknown, renders red text — this becomes visible immediately
 * in development and also fails the test suite.
 */
export default function Cite({ id, as, loc }: Props) {
  const entry = getCitation(id);
  const [open, setOpen] = useState(false);

  if (!entry) {
    return (
      <span
        className="text-red-400 underline decoration-wavy"
        title={`Missing bibliography entry: ${id}`}
      >
        [?{id}]
      </span>
    );
  }

  const label = as ?? formatShortCite(entry);
  const display = loc ? `${label}, ${loc}` : label;

  return (
    <span className="relative inline-block">
      <Link
        href={`/awareness/bibliography#${id}`}
        className="text-ink-100 underline decoration-ink-600 decoration-dotted underline-offset-2 hover:decoration-ink-300 hover:text-ink-50 transition-colors"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {display}
      </Link>
      {open && (
        <span
          role="tooltip"
          className="hidden md:block absolute z-40 left-1/2 -translate-x-1/2 top-full mt-1.5 w-[340px] max-w-[80vw] bg-ink-900/97 border border-ink-600 rounded-md p-3 text-[12px] leading-relaxed text-ink-100 shadow-xl backdrop-blur pointer-events-none"
        >
          <span className="block text-ink-300 text-[10px] uppercase tracking-[0.14em] mb-1">
            {entry.type}
            {entry.venue ? ` · ${entry.venue}` : ''}
          </span>
          <span className="block font-medium text-ink-50 mb-1">
            {entry.authors} ({entry.year})
          </span>
          <span className="block italic mb-1.5">{entry.title}</span>
          {entry.note && (
            <span className="block text-ink-200 text-[11px]">{entry.note}</span>
          )}
        </span>
      )}
    </span>
  );
}
