import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import EvidenceTag from '@/components/EvidenceTag';
import SideNote from '@/components/SideNote';
import Cite from '@/components/Cite';
import Diagram from '@/components/Diagram';
import EssayMDX from '@/components/EssayMDX';

// Global MDX component overrides. Available in every .mdx file without import.
// Lets the prose stay clean: just write Markdown, sprinkle <SideNote>, <Cite>,
// <EvidenceTag>, <Diagram>.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Anchor → Next Link for internal routes (preserves client-side routing
    // and prefetching); external links pass through as native <a>.
    a: ({ href, children, ...rest }) => {
      if (href && (href.startsWith('/') || href.startsWith('#'))) {
        return (
          <Link href={href} {...rest}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    },
    // The MDX components our essays use, exposed unprefixed in the prose.
    EvidenceTag,
    SideNote,
    Cite,
    Diagram,
    EssayMDX,
    ...components,
  };
}
