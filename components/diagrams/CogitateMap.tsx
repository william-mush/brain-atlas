/**
 * IIT vs GNW: where each theory predicts the conscious-content signature
 * should appear. IIT predicts posterior "hot zones" (occipital, parietal).
 * GNW predicts late frontal "ignition." COGITATE 2023 found partial
 * support for both, in different metrics.
 */
export default function CogitateMap() {
  return (
    <svg
      viewBox="0 0 480 280"
      width="100%"
      style={{ maxWidth: 460 }}
      role="img"
      aria-label="IIT predicts posterior hot zones; GNW predicts late frontal ignition. COGITATE 2023 found partial support for each."
    >
      {/* Schematic brain outline — side view */}
      <ellipse
        cx={240}
        cy={140}
        rx={180}
        ry={90}
        fill="none"
        stroke="#3d3625"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      {/* Brainstem stub */}
      <line
        x1={170}
        y1={220}
        x2={170}
        y2={250}
        stroke="#3d3625"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />

      {/* GNW prediction region (frontal) */}
      <ellipse
        cx={350}
        cy={130}
        rx={50}
        ry={60}
        fill="#4f8a8b"
        fillOpacity={0.22}
        stroke="#4f8a8b"
        strokeWidth={1.5}
      />
      <text
        x={350}
        y={120}
        fill="#f6f5f1"
        fontFamily="Georgia, serif"
        fontSize={13}
        fontStyle="italic"
        textAnchor="middle"
      >
        GNW
      </text>
      <text
        x={350}
        y={136}
        fill="#cfc7b1"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={9}
        textAnchor="middle"
      >
        late frontal
      </text>
      <text
        x={350}
        y={148}
        fill="#cfc7b1"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={9}
        textAnchor="middle"
      >
        ignition ~300ms
      </text>

      {/* IIT prediction region (posterior) */}
      <ellipse
        cx={130}
        cy={130}
        rx={50}
        ry={60}
        fill="#8a6fa3"
        fillOpacity={0.22}
        stroke="#8a6fa3"
        strokeWidth={1.5}
      />
      <text
        x={130}
        y={120}
        fill="#f6f5f1"
        fontFamily="Georgia, serif"
        fontSize={13}
        fontStyle="italic"
        textAnchor="middle"
      >
        IIT
      </text>
      <text
        x={130}
        y={136}
        fill="#cfc7b1"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={9}
        textAnchor="middle"
      >
        posterior
      </text>
      <text
        x={130}
        y={148}
        fill="#cfc7b1"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={9}
        textAnchor="middle"
      >
        hot zone
      </text>

      {/* Direction labels */}
      <text
        x={130}
        y={245}
        fill="#574d36"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={9}
        letterSpacing={1.2}
        textAnchor="middle"
      >
        POSTERIOR
      </text>
      <text
        x={350}
        y={245}
        fill="#574d36"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={9}
        letterSpacing={1.2}
        textAnchor="middle"
      >
        ANTERIOR
      </text>

      {/* Bottom caption */}
      <text
        x={240}
        y={275}
        fill="#7a6f52"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={10}
        fontStyle="italic"
        textAnchor="middle"
      >
        COGITATE 2023: partial support for each, neither walking away cleanly
      </text>

      {/* Top label */}
      <text
        x={240}
        y={30}
        fill="#a99e7e"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={11}
        textAnchor="middle"
      >
        Where each theory predicts the signature of consciousness
      </text>
    </svg>
  );
}
