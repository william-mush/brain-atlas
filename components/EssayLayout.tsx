import Link from 'next/link';

interface Props {
  tag: string;
  tint: string;
  title: string;
  subtitle?: string;
  related?: { href: string; label: string }[];
  children: React.ReactNode;
}

export default function EssayLayout({
  tag,
  tint,
  title,
  subtitle,
  related,
  children,
}: Props) {
  return (
    <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
      <Link
        href="/"
        className="text-xs text-ink-300 hover:text-ink-100 inline-flex items-center gap-1 mb-8"
      >
        <span aria-hidden>←</span> all essays
      </Link>
      <p
        className="text-[11px] uppercase tracking-[0.22em] mb-3"
        style={{ color: tint }}
      >
        {tag}
      </p>
      <article className="prose-atlas">
        <h1>{title}</h1>
        {subtitle && (
          <p className="text-ink-300 italic text-lg -mt-3 mb-8">{subtitle}</p>
        )}
        {children}
      </article>

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
    </main>
  );
}
