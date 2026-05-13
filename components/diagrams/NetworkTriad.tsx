/**
 * The three large-scale networks of the resting brain: Default Mode (DMN),
 * Salience (SN), and Executive Control / Central Executive (ECN).
 *
 * Used on the dhāraṇā and dhyāna pages where the structural argument
 * depends on which network is dominant in which state. The visual point:
 * these aren't competing brain regions — they're competing dynamic
 * configurations that the brain switches between, and contemplative
 * practice shifts the balance.
 */
export default function NetworkTriad() {
  const networks = [
    {
      id: 'dmn',
      label: 'Default Mode',
      tint: '#8a6fa3',
      x: 120,
      y: 80,
      r: 56,
      role: 'self-referential thought',
      regions: 'medial PFC · posterior cingulate · inferior parietal',
    },
    {
      id: 'ecn',
      label: 'Executive Control',
      tint: '#4f8a8b',
      x: 360,
      y: 80,
      r: 56,
      role: 'task-focused attention',
      regions: 'dorsolateral PFC · posterior parietal',
    },
    {
      id: 'sn',
      label: 'Salience',
      tint: '#e8b04a',
      x: 240,
      y: 220,
      r: 56,
      role: 'switching · interoceptive monitoring',
      regions: 'anterior insula · anterior cingulate',
    },
  ];

  return (
    <svg
      viewBox="0 0 480 360"
      width="100%"
      style={{ maxWidth: 460 }}
      role="img"
      aria-label="The three large-scale networks of the brain: default mode, executive control, and salience, with salience as the switching network."
    >
      {/* Connecting lines indicating that salience switches between the other two */}
      <line
        x1={130}
        y1={120}
        x2={250}
        y2={205}
        stroke="#3d3625"
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <line
        x1={350}
        y1={120}
        x2={230}
        y2={205}
        stroke="#3d3625"
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <line
        x1={120}
        y1={80}
        x2={360}
        y2={80}
        stroke="#3d3625"
        strokeWidth={1}
        strokeDasharray="6 5"
      />
      <text
        x={240}
        y={70}
        fill="#7a6f52"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={10}
        fontStyle="italic"
        textAnchor="middle"
      >
        anti-correlated at rest
      </text>

      {networks.map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.tint}
            fillOpacity={0.18}
            stroke={n.tint}
            strokeWidth={1.5}
          />
          <text
            x={n.x}
            y={n.y - 6}
            fill="#f6f5f1"
            fontFamily="Georgia, serif"
            fontSize={14}
            fontStyle="italic"
            textAnchor="middle"
          >
            {n.label}
          </text>
          <text
            x={n.x}
            y={n.y + 10}
            fill="#cfc7b1"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontSize={10}
            textAnchor="middle"
          >
            {n.role}
          </text>
        </g>
      ))}

      {/* Region labels along the bottom */}
      {networks.map((n, i) => (
        <text
          key={n.id + '-r'}
          x={i === 2 ? 240 : i === 0 ? 120 : 360}
          y={310 + (i === 2 ? 20 : 0)}
          fill="#a99e7e"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize={10}
          textAnchor="middle"
        >
          {n.regions}
        </text>
      ))}
    </svg>
  );
}
