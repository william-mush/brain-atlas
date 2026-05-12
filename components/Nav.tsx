import Link from 'next/link';

export default function Nav() {
  return (
    <header className="h-16 border-b border-ink-700 bg-ink-900/90 backdrop-blur sticky top-0 z-30">
      <div className="h-full max-w-[1600px] mx-auto px-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-neural-rose via-neural-amber to-neural-teal" />
          <span className="font-serif text-lg text-ink-50 leading-none">
            The Atlas
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <div className="flex items-center gap-0.5 mr-3 px-1 py-0.5 rounded-full border border-ink-700 bg-ink-800/50">
            <NavLink href="/explore" pill>Brain</NavLink>
            <NavLink href="/body" pill>Body</NavLink>
          </div>
          <NavLink href="/systems/vagus-nerve">Vagus</NavLink>
          <NavLink href="/systems/autonomic">Autonomic</NavLink>
          <NavLink href="/systems/consciousness">Consciousness</NavLink>
          <NavLink href="/systems/hemispheres">Hemispheres</NavLink>
          <NavLink href="/systems/time">Brain Over Time</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  pill,
}: {
  href: string;
  children: React.ReactNode;
  pill?: boolean;
}) {
  if (pill) {
    return (
      <Link
        href={href}
        className="px-3 py-1 rounded-full text-ink-200 hover:text-ink-50 hover:bg-ink-700 transition text-xs font-medium"
      >
        {children}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-md text-ink-200 hover:text-ink-50 hover:bg-ink-800 transition"
    >
      {children}
    </Link>
  );
}
