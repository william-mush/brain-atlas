/**
 * The eight limbs as a stack of substrates. Yamas/niyamas at the bottom
 * (no anatomy, cognitive-load floor), āsana through dhāraṇā in the middle
 * (specific substrates), dhyāna and samādhi at the top (network dynamics
 * and dissolution).
 *
 * The visual point: the limbs are layered, not a ladder. Each rests on
 * the ones below it. Samādhi sits above the others as a thinning gradient,
 * not as a solid block — the rhetorical conclusion of the whole framework.
 */
export default function LayeredAwareness() {
  const layers = [
    {
      label: 'Samādhi',
      gloss: 'absorption',
      substrate: 'network dissolution',
      tint: '#8a6fa3',
      opacity: 0.35,
    },
    {
      label: 'Dhyāna',
      gloss: 'meditation',
      substrate: 'default mode quieting',
      tint: '#7a9461',
      opacity: 0.55,
    },
    {
      label: 'Dhāraṇā',
      gloss: 'concentration',
      substrate: 'executive control network',
      tint: '#4f8a8b',
      opacity: 0.75,
    },
    {
      label: 'Pratyāhāra',
      gloss: 'sensory withdrawal',
      substrate: 'thalamic gating',
      tint: '#5a6b7a',
      opacity: 0.85,
    },
    {
      label: 'Prāṇāyāma',
      gloss: 'breath',
      substrate: 'vagal afferent pathway',
      tint: '#7a9461',
      opacity: 0.92,
    },
    {
      label: 'Āsana',
      gloss: 'posture',
      substrate: 'somatosensory & interoceptive maps',
      tint: '#e8b04a',
      opacity: 0.95,
    },
    {
      label: 'Niyamas',
      gloss: 'observances',
      substrate: 'metacognition · acceptance',
      tint: '#f0a878',
      opacity: 0.98,
    },
    {
      label: 'Yamas',
      gloss: 'restraints',
      substrate: 'cognitive-load floor',
      tint: '#e89aa3',
      opacity: 1,
    },
  ];

  const layerH = 36;
  const startY = 30;
  const totalH = startY + layers.length * layerH + 30;

  return (
    <svg
      viewBox={`0 0 480 ${totalH}`}
      width="100%"
      style={{ maxWidth: 460 }}
      role="img"
      aria-label="The eight limbs as a layered stack of substrates, with yamas at the base and samādhi at the top."
    >
      {/* Axis label */}
      <text
        x={20}
        y={20}
        fill="#574d36"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={10}
        letterSpacing={1.2}
      >
        ↑ LATER LIMBS DEPEND ON EARLIER ONES
      </text>

      {layers.map((l, i) => {
        const y = startY + i * layerH;
        return (
          <g key={l.label}>
            <rect
              x={20}
              y={y}
              width={440}
              height={layerH - 6}
              fill={l.tint}
              fillOpacity={l.opacity * 0.18}
              stroke={l.tint}
              strokeOpacity={l.opacity}
              strokeWidth={1.5}
              rx={3}
            />
            <text
              x={36}
              y={y + 16}
              fill="#f6f5f1"
              fontFamily="Georgia, serif"
              fontSize={14}
              fontStyle="italic"
            >
              {l.label}
            </text>
            <text
              x={36}
              y={y + 28}
              fill="#a99e7e"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontSize={10}
            >
              {l.gloss}
            </text>
            <text
              x={300}
              y={y + 22}
              fill="#cfc7b1"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontSize={11}
              fontStyle="italic"
              textAnchor="middle"
            >
              {l.substrate}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
