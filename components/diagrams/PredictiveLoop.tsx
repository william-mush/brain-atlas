/**
 * The predictive-processing loop. Top-down predictions descend; bottom-up
 * prediction errors ascend; the model updates until error is minimized.
 *
 * Used on the synthesis page section on predictive processing, and on the
 * theories page section on the Friston/Seth framework.
 */
export default function PredictiveLoop() {
  return (
    <svg
      viewBox="0 0 480 320"
      width="100%"
      style={{ maxWidth: 460 }}
      role="img"
      aria-label="The predictive processing loop: top-down predictions and bottom-up prediction errors."
    >
      {/* Top: higher-level model */}
      <rect
        x={120}
        y={30}
        width={240}
        height={50}
        rx={6}
        fill="#8a6fa3"
        fillOpacity={0.18}
        stroke="#8a6fa3"
        strokeWidth={1.5}
      />
      <text
        x={240}
        y={52}
        fill="#f6f5f1"
        fontFamily="Georgia, serif"
        fontSize={14}
        fontStyle="italic"
        textAnchor="middle"
      >
        Higher-level model
      </text>
      <text
        x={240}
        y={68}
        fill="#cfc7b1"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={10}
        textAnchor="middle"
      >
        priors, beliefs, expectations
      </text>

      {/* Bottom: sensory input */}
      <rect
        x={120}
        y={240}
        width={240}
        height={50}
        rx={6}
        fill="#7a9461"
        fillOpacity={0.18}
        stroke="#7a9461"
        strokeWidth={1.5}
      />
      <text
        x={240}
        y={262}
        fill="#f6f5f1"
        fontFamily="Georgia, serif"
        fontSize={14}
        fontStyle="italic"
        textAnchor="middle"
      >
        Sensory input
      </text>
      <text
        x={240}
        y={278}
        fill="#cfc7b1"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={10}
        textAnchor="middle"
      >
        body, world, interoception
      </text>

      {/* Down arrow — predictions */}
      <line
        x1={180}
        y1={80}
        x2={180}
        y2={240}
        stroke="#8a6fa3"
        strokeWidth={2}
      />
      <polygon points="174,232 186,232 180,242" fill="#8a6fa3" />
      <text
        x={142}
        y={165}
        fill="#b59ccc"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={11}
        textAnchor="middle"
      >
        predictions
      </text>

      {/* Up arrow — prediction error */}
      <line
        x1={300}
        y1={240}
        x2={300}
        y2={80}
        stroke="#7a9461"
        strokeWidth={2}
      />
      <polygon points="294,88 306,88 300,78" fill="#7a9461" />
      <text
        x={340}
        y={165}
        fill="#a8c089"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={11}
        textAnchor="middle"
      >
        prediction error
      </text>

      {/* Middle label */}
      <text
        x={240}
        y={170}
        fill="#7a6f52"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={10}
        fontStyle="italic"
        textAnchor="middle"
      >
        the loop minimizes
      </text>
    </svg>
  );
}
