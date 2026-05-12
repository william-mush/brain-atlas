type Level = 'evidenced' | 'suggestive' | 'philosophical';

const styles: Record<Level, { bg: string; border: string; text: string; label: string }> = {
  evidenced: {
    bg: 'rgba(122, 148, 97, 0.15)',
    border: 'rgba(122, 148, 97, 0.45)',
    text: '#a8c089',
    label: 'evidenced',
  },
  suggestive: {
    bg: 'rgba(232, 176, 74, 0.13)',
    border: 'rgba(232, 176, 74, 0.40)',
    text: '#e8c47a',
    label: 'suggestive',
  },
  philosophical: {
    bg: 'rgba(138, 111, 163, 0.15)',
    border: 'rgba(138, 111, 163, 0.45)',
    text: '#b59ccc',
    label: 'philosophical',
  },
};

export default function EvidenceTag({ level }: { level: Level }) {
  const s = styles[level];
  return (
    <span
      className="inline-block align-baseline ml-1.5 px-1.5 py-[1px] rounded-full text-[10px] uppercase tracking-[0.14em] font-sans font-medium leading-tight whitespace-nowrap"
      style={{
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
      }}
      title={`Evidence level: ${s.label}`}
    >
      {s.label}
    </span>
  );
}
