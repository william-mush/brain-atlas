/**
 * The vagal afferent pipeline: body → medulla (NTS) → pons (parabrachial)
 * → thalamus → insula / ACC.
 *
 * Sparse SVG, labeled, in the existing ink palette. Drawn for the synthesis
 * page and reused on the pranayama essay.
 */
export default function VagalPipeline() {
  // Stops along the pathway. Positioned vertically from body at bottom
  // to cortex at top.
  const stops = [
    { y: 30, label: 'Insula · ACC', detail: 'cortical seat of felt body', color: '#4f8a8b' },
    { y: 90, label: 'Thalamus', detail: 'sensory relay', color: '#8a6fa3' },
    { y: 150, label: 'Parabrachial n. (pons)', detail: 'autonomic integration', color: '#e8b04a' },
    { y: 210, label: 'NTS (medulla)', detail: 'first listener', color: '#f0a878' },
    { y: 270, label: 'Vagus nerve', detail: '~80% of fibers ascend', color: '#7a9461' },
    { y: 330, label: 'Body', detail: 'heart, lungs, gut, viscera', color: '#cfc7b1' },
  ];

  return (
    <svg
      viewBox="0 0 480 380"
      width="100%"
      style={{ maxWidth: 460 }}
      role="img"
      aria-label="The vagal afferent pathway: from body to cortex via medulla, pons, and thalamus."
    >
      {/* Pathway line connecting the stops */}
      <line
        x1={130}
        y1={30}
        x2={130}
        y2={330}
        stroke="#3d3625"
        strokeWidth={1.5}
        strokeDasharray="3 4"
      />
      {/* Upward-arrow markers along the line, indicating direction of signal flow */}
      {[60, 120, 180, 240, 300].map((y) => (
        <polygon
          key={y}
          points={`130,${y - 4} 126,${y + 2} 134,${y + 2}`}
          fill="#7a6f52"
        />
      ))}

      {stops.map((s) => (
        <g key={s.label}>
          {/* Node circle */}
          <circle
            cx={130}
            cy={s.y}
            r={9}
            fill="#0e0c08"
            stroke={s.color}
            strokeWidth={2}
          />
          <circle cx={130} cy={s.y} r={3.5} fill={s.color} />
          {/* Label to the right */}
          <text
            x={155}
            y={s.y - 2}
            fill="#f6f5f1"
            fontFamily="Georgia, serif"
            fontSize={14}
            fontStyle="italic"
          >
            {s.label}
          </text>
          <text
            x={155}
            y={s.y + 14}
            fill="#a99e7e"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontSize={11}
          >
            {s.detail}
          </text>
        </g>
      ))}

      {/* Annotation for cortical destination */}
      <text
        x={20}
        y={20}
        fill="#574d36"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={10}
        letterSpacing={1.2}
      >
        CORTEX
      </text>
      <text
        x={20}
        y={350}
        fill="#574d36"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={10}
        letterSpacing={1.2}
      >
        PERIPHERY
      </text>
    </svg>
  );
}
