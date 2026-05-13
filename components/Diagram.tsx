interface Props {
  caption: string;
  /** Optional source / attribution line under the caption. */
  source?: string;
  children: React.ReactNode;
}

/**
 * Wrapper for inline SVG diagrams. Provides consistent figure framing,
 * dark-background-aware sizing, and a caption slot.
 *
 * Use one per "diagram moment" — a place in the essay where a picture
 * earns its place. Diagrams should be sparse; if there are more than 4
 * in a single essay, one of them is probably decoration.
 */
export default function Diagram({ caption, source, children }: Props) {
  return (
    <figure className="my-8 not-prose">
      <div className="bg-ink-800/40 border border-ink-700 rounded-lg p-4 flex items-center justify-center overflow-x-auto">
        {children}
      </div>
      <figcaption className="mt-2 text-[12px] text-ink-300 italic font-sans leading-snug max-w-prose">
        {caption}
        {source && (
          <span className="block not-italic text-ink-400 text-[11px] mt-0.5">
            {source}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
