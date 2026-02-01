/**
 * Commit To You — cover art (SVG-in-React)
 *
 * Goals:
 * - Looks clean/"normal" (minimalist poster style)
 * - Easy to tweak without editing raw SVG paths
 * - All geometry controlled by a config object + props
 *
 * Usage:
 *   <CommitToYouCover />
 *   <CommitToYouCover title="COMMIT TO YOU" subtitle="AlexTheMan" />
 *   <CommitToYouCover config={{ trafficLight: { active: "green" } }} />
 */

// -----------------------------
// Types
// -----------------------------

type LightState = "red" | "amber" | "green";

type Point = { x: number; y: number };

type FigureSide = "left" | "right";

type FigureConfig = {
  side: FigureSide;
  // Position of the figure (poster-space, not pixels). Range: 0..100.
  x: number;
  y: number;
  // Scale relative to poster-space.
  scale: number;
  // Silhouette styling
  strokeWidth: number;
  stroke: string;
  fill: string;
  // Pose / proportions
  headRadius: number;
  shoulderWidth: number;
  torsoHeight: number;
  hipWidth: number;
  legLength: number;
  // Arm reach: 0..1 (how far hands reach toward center)
  reach: number;
  // How "open" the stance is: 0..1
  stance: number;
};

type TrafficLightConfig = {
  x: number;
  y: number;
  scale: number;
  active: LightState;
  // If true, shows a subtle CI hint by drawing a tiny check mark in the active lens.
  ciHint: boolean;
};

type TextConfig = {
  title: string;
  subtitle: string;
  // 0..1 (how much the title hugs the top)
  topBias: number;
};

type Palette = {
  bgTop: string;
  bgBottom: string;
  vignette: string;
  ground: string;
  trafficHousing: string;
  trafficPole: string;
  lensOff: string;
  red: string;
  amber: string;
  green: string;
  highlight: string;
  text: string;
  textSubtle: string;
};

type CoverConfig = {
  // Poster-space is 0..100 in both axes; we map that to the SVG viewBox.
  palette: Palette;
  text: TextConfig;
  trafficLight: TrafficLightConfig;
  figures: {
    left: Omit<FigureConfig, "side">;
    right: Omit<FigureConfig, "side">;
  };
  // Hand connection (soft curved line) to emphasize commitment.
  connection: {
    enabled: boolean;
    stroke: string;
    strokeWidth: number;
    opacity: number;
  };
};

export type CommitToYouCoverProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
  title?: string;
  subtitle?: string;
  config?: PartialDeep<CoverConfig>;
};

// -----------------------------
// Defaults
// -----------------------------

const defaultConfig: CoverConfig = {
  palette: {
    bgTop: "#0b1220",
    bgBottom: "#070a10",
    vignette: "#000000",
    ground: "#0a0f1b",
    trafficHousing: "#121826",
    trafficPole: "#0f1523",
    lensOff: "#1f2a3c",
    red: "#ff3b30",
    amber: "#ffcc00",
    green: "#34c759",
    highlight: "#e6f0ff",
    text: "#eef2ff",
    textSubtle: "#aab4c6",
  },
  text: {
    title: "COMMIT TO YOU",
    subtitle: "Commit To You",
    topBias: 0.18,
  },
  trafficLight: {
    x: 50,
    y: 24,
    scale: 1,
    active: "green",
    ciHint: true,
  },
  figures: {
    left: {
      x: 18,
      y: 62,
      scale: 1.05,
      strokeWidth: 1.7,
      stroke: "rgba(238, 242, 255, 0.85)",
      fill: "rgba(238, 242, 255, 0.10)",
      headRadius: 3.3,
      shoulderWidth: 12,
      torsoHeight: 17,
      hipWidth: 9,
      legLength: 18,
      reach: 0.78,
      stance: 0.35,
    },
    right: {
      x: 82,
      y: 62,
      scale: 1.05,
      strokeWidth: 1.7,
      stroke: "rgba(238, 242, 255, 0.85)",
      fill: "rgba(238, 242, 255, 0.10)",
      headRadius: 3.3,
      shoulderWidth: 12,
      torsoHeight: 17,
      hipWidth: 9,
      legLength: 18,
      reach: 0.78,
      stance: 0.35,
    },
  },
  connection: {
    enabled: true,
    stroke: "rgba(238, 242, 255, 0.35)",
    strokeWidth: 1.2,
    opacity: 1,
  },
};

// -----------------------------
// Component
// -----------------------------

export default function CommitToYouCover({
  width = 1024,
  height = 1024,
  className,
  title,
  subtitle,
  config,
}: CommitToYouCoverProps) {
  const cfg = mergeDeep<CoverConfig>(defaultConfig, config);
  if (title) cfg.text.title = title;
  if (subtitle) cfg.text.subtitle = subtitle;

  // ViewBox is 0..100 poster-space (square).
  const vb = "0 0 100 100";

  const leftFigure: FigureConfig = { side: "left", ...cfg.figures.left };
  const rightFigure: FigureConfig = { side: "right", ...cfg.figures.right };

  // Key points for hands (used for connection curve)
  const leftHand = figureHandPoint(leftFigure);
  const rightHand = figureHandPoint(rightFigure);

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={vb}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${cfg.text.title} cover art`}
    >
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={cfg.palette.bgTop} />
          <stop offset="100%" stopColor={cfg.palette.bgBottom} />
        </linearGradient>

        <radialGradient id="vignette" cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="75%" stopColor="rgba(0,0,0,0.25)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>

        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect x={0} y={0} width={100} height={100} fill="url(#bg)" />

      {/* Ground plane */}
      <path
        d="M0,72 C18,68 34,69 50,72 C66,75 82,76 100,72 L100,100 L0,100 Z"
        fill={cfg.palette.ground}
        opacity={0.95}
      />

      {/* Traffic light (symbol + CI hint) */}
      <TrafficLight cfg={cfg} />

      {/* Subtle connection between hands */}
      {cfg.connection.enabled && (
        <CommitConnection
          a={leftHand}
          b={rightHand}
          stroke={cfg.connection.stroke}
          strokeWidth={cfg.connection.strokeWidth}
          opacity={cfg.connection.opacity}
        />
      )}

      {/* Figures */}
      <Figure cfg={leftFigure} />
      <Figure cfg={rightFigure} />

      {/* Title block */}
      <TitleBlock cfg={cfg} />

      {/* Vignette */}
      <rect x={0} y={0} width={100} height={100} fill="url(#vignette)" />

      {/* Safe border */}
      <rect
        x={3.5}
        y={3.5}
        width={93}
        height={93}
        fill="none"
        stroke="rgba(238, 242, 255, 0.12)"
        strokeWidth={0.8}
        rx={4}
      />
    </svg>
  );
}

// -----------------------------
// Pieces
// -----------------------------

function TitleBlock({ cfg }: { cfg: CoverConfig }) {
  const y = 6 + cfg.text.topBias * 16;
  return (
    <g>
      <text
        x={50}
        y={y}
        textAnchor="middle"
        fill={cfg.palette.text}
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        fontWeight={800}
        fontSize={7.2}
        letterSpacing={1.6}
      >
        {cfg.text.title}
      </text>
      <text
        x={50}
        y={y + 6.8}
        textAnchor="middle"
        fill={cfg.palette.textSubtle}
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        fontWeight={600}
        fontSize={3.2}
        letterSpacing={0.8}
        opacity={0.95}
      >
        {cfg.text.subtitle}
      </text>
    </g>
  );
}

function TrafficLight({ cfg }: { cfg: CoverConfig }) {
  const { x, y, scale, active, ciHint } = cfg.trafficLight;
  const s = scale;

  // Housing geometry
  const w = 10 * s;
  const h = 20 * s;
  const r = 2.2 * s;

  const poleW = 2.2 * s;
  const poleH = 46 * s;

  const lensR = 2.3 * s;
  const lensX = x;
  const lensYs: readonly [number, number, number] = [y + 4.6 * s, y + 10 * s, y + 15.4 * s];
  const [redY, amberY, greenY] = lensYs;

  const lensColor = (state: LightState) => {
    if (state === "red") return cfg.palette.red;
    if (state === "amber") return cfg.palette.amber;
    return cfg.palette.green;
  };

  const isOn = (state: LightState) => active === state;

  return (
    <g>
      {/* Pole */}
      <rect
        x={x - poleW / 2}
        y={y + h - 1.2 * s}
        width={poleW}
        height={poleH}
        rx={poleW / 2}
        fill={cfg.palette.trafficPole}
        opacity={0.98}
      />

      {/* Housing */}
      <rect
        x={x - w / 2}
        y={y}
        width={w}
        height={h}
        rx={r}
        fill={cfg.palette.trafficHousing}
        stroke="rgba(238, 242, 255, 0.14)"
        strokeWidth={0.6}
      />

      {/* Visor lips */}
      {lensYs.map((yy, i) => (
        <path
          key={i}
          d={roundedVisorPath({ x: x - w / 2 + 0.8 * s, y: yy - 3.2 * s, w: w - 1.6 * s, h: 6.2 * s, r: 1.6 * s })}
          fill="rgba(0,0,0,0.22)"
        />
      ))}

      {/* Lenses */}
      <Lens
        cx={lensX}
        cy={redY}
        r={lensR}
        on={isOn("red")}
        onColor={lensColor("red")}
        offColor={cfg.palette.lensOff}
      />
      <Lens
        cx={lensX}
        cy={amberY}
        r={lensR}
        on={isOn("amber")}
        onColor={lensColor("amber")}
        offColor={cfg.palette.lensOff}
      />
      <Lens
        cx={lensX}
        cy={greenY}
        r={lensR}
        on={isOn("green")}
        onColor={lensColor("green")}
        offColor={cfg.palette.lensOff}
        ciHint={ciHint}
      />

      {/* Small caption under housing (optional vibe) */}
      <text
        x={x}
        y={y + h + 6.2 * s}
        textAnchor="middle"
        fill="rgba(238, 242, 255, 0.22)"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        fontWeight={700}
        fontSize={2.2 * s}
        letterSpacing={0.7 * s}
      >
        CI
      </text>
    </g>
  );
}

function Lens({
  cx,
  cy,
  r,
  on,
  onColor,
  offColor,
  ciHint,
}: {
  cx: number;
  cy: number;
  r: number;
  on: boolean;
  onColor: string;
  offColor: string;
  ciHint?: boolean;
}) {
  return (
    <g filter={on ? "url(#softGlow)" : undefined}>
      <circle cx={cx} cy={cy} r={r} fill={on ? onColor : offColor} opacity={on ? 1 : 0.85} />
      {/* subtle glass highlight */}
      <path
        d={`M ${cx - r * 0.55} ${cy - r * 0.35} C ${cx - r * 0.15} ${cy - r * 0.85}, ${cx + r * 0.55} ${cy - r * 0.55}, ${cx + r * 0.65} ${cy - r * 0.05}`}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={0.45}
        strokeLinecap="round"
      />

      {/* CI check hint */}
      {ciHint && on && (
        <path
          d={`M ${cx - r * 0.45} ${cy + r * 0.05} L ${cx - r * 0.15} ${cy + r * 0.35} L ${cx + r * 0.48} ${cy - r * 0.35}`}
          fill="none"
          stroke="rgba(0,0,0,0.55)"
          strokeWidth={0.55}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  );
}

function Figure({ cfg }: { cfg: FigureConfig }) {
  const {
    side,
    x,
    y,
    scale,
    stroke,
    fill,
    strokeWidth,
    headRadius,
    shoulderWidth,
    torsoHeight,
    hipWidth,
    legLength,
    reach,
    stance,
  } = cfg;

  // Convert to a simple skeletal silhouette made from circles/paths.
  // Anchor: (x,y) is roughly the hips center.
  const s = scale;

  const dir = side === "left" ? 1 : -1; // +1 faces right, -1 faces left

  const headC: Point = { x, y: y - (torsoHeight + headRadius * 2.2) * s };
  const neck: Point = { x, y: y - (torsoHeight + headRadius * 0.35) * s };

  const shoulderL: Point = { x: x - (shoulderWidth / 2) * s, y: y - torsoHeight * s };
  const shoulderR: Point = { x: x + (shoulderWidth / 2) * s, y: y - torsoHeight * s };

  const hipL: Point = { x: x - (hipWidth / 2) * s, y };
  const hipR: Point = { x: x + (hipWidth / 2) * s, y };

  // Hands: reach towards center
  const armLen = (shoulderWidth * 0.95 + 8) * s;
  const reachX = armLen * reach * dir;
  const elbowDrop = (3 + 2 * (1 - reach)) * s;

  const nearShoulder = side === "left" ? shoulderR : shoulderL;
  const farShoulder = side === "left" ? shoulderL : shoulderR;

  const hand: Point = { x: nearShoulder.x + reachX, y: nearShoulder.y + 2.2 * s };
  const elbow: Point = { x: nearShoulder.x + reachX * 0.55, y: nearShoulder.y + elbowDrop };

  // Other arm rests down slightly
  const restHand: Point = { x: farShoulder.x - 2.5 * dir * s, y: farShoulder.y + 9.8 * s };
  const restElbow: Point = { x: farShoulder.x - 1.2 * dir * s, y: farShoulder.y + 5.0 * s };

  // Legs stance
  const spread = (2.4 + 6.0 * stance) * s;
  const footY = y + legLength * s;
  const kneeY = y + legLength * 0.55 * s;

  const kneeL: Point = { x: hipL.x - spread * 0.25, y: kneeY };
  const kneeR: Point = { x: hipR.x + spread * 0.25, y: kneeY };

  const footL: Point = { x: hipL.x - spread * 0.55, y: footY };
  const footR: Point = { x: hipR.x + spread * 0.55, y: footY };

  // Torso outline
  const torsoPath = `
    M ${shoulderL.x} ${shoulderL.y}
    C ${shoulderL.x} ${shoulderL.y + 3.2 * s}, ${hipL.x - 0.8 * s} ${y - 5.0 * s}, ${hipL.x} ${y}
    L ${hipR.x} ${y}
    C ${hipR.x + 0.8 * s} ${y - 5.0 * s}, ${shoulderR.x} ${shoulderR.y + 3.2 * s}, ${shoulderR.x} ${shoulderR.y}
    Z
  `;

  return (
    <g>
      {/* Filled silhouette */}
      <path d={torsoPath} fill={fill} />

      {/* Head */}
      <circle cx={headC.x} cy={headC.y} r={headRadius * s} fill={fill} />

      {/* Outline + limbs */}
      <g
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.98}
      >
        <path d={torsoPath} />

        {/* Neck */}
        <path d={`M ${neck.x} ${neck.y} L ${x} ${y - torsoHeight * s}`} />

        {/* Reaching arm */}
        <path d={`M ${nearShoulder.x} ${nearShoulder.y} L ${elbow.x} ${elbow.y} L ${hand.x} ${hand.y}`} />

        {/* Rest arm */}
        <path d={`M ${farShoulder.x} ${farShoulder.y} L ${restElbow.x} ${restElbow.y} L ${restHand.x} ${restHand.y}`} />

        {/* Legs */}
        <path d={`M ${hipL.x} ${hipL.y} L ${kneeL.x} ${kneeL.y} L ${footL.x} ${footL.y}`} />
        <path d={`M ${hipR.x} ${hipR.y} L ${kneeR.x} ${kneeR.y} L ${footR.x} ${footR.y}`} />

        {/* Feet */}
        <path d={`M ${footL.x - 1.6 * s} ${footL.y} L ${footL.x + 1.6 * s} ${footL.y}`} />
        <path d={`M ${footR.x - 1.6 * s} ${footR.y} L ${footR.x + 1.6 * s} ${footR.y}`} />

        {/* Simple hand */}
        <circle cx={hand.x} cy={hand.y} r={0.9 * s} fill={stroke} opacity={0.55} />
      </g>
    </g>
  );
}

function CommitConnection({
  a,
  b,
  stroke,
  strokeWidth,
  opacity,
}: {
  a: Point;
  b: Point;
  stroke: string;
  strokeWidth: number;
  opacity: number;
}) {
  const midX = (a.x + b.x) / 2;
  // Pull curve upward a bit for "reach" feeling
  const c1: Point = { x: midX - 7, y: Math.min(a.y, b.y) - 9 };
  const c2: Point = { x: midX + 7, y: Math.min(a.y, b.y) - 9 };
  return (
    <path
      d={`M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
      strokeLinecap="round"
    />
  );
}

// -----------------------------
// Geometry helpers
// -----------------------------

function figureHandPoint(cfg: FigureConfig): Point {
  const { side, x, y, scale, shoulderWidth, torsoHeight, reach } = cfg;
  const s = scale;
  const dir = side === "left" ? 1 : -1;

  const nearShoulderX = side === "left" ? x + (shoulderWidth / 2) * s : x - (shoulderWidth / 2) * s;
  const nearShoulderY = y - torsoHeight * s;
  const armLen = (shoulderWidth * 0.95 + 8) * s;
  const reachX = armLen * reach * dir;
  return { x: nearShoulderX + reachX, y: nearShoulderY + 2.2 * s };
}

function roundedVisorPath({ x, y, w, h, r }: { x: number; y: number; w: number; h: number; r: number }) {
  // Rounded top, flat-ish bottom for the "visor" above each lens.
  const right = x + w;
  const bottom = y + h;
  const top = y;

  return [
    `M ${x + r} ${bottom}`,
    `L ${right - r} ${bottom}`,
    `C ${right - r * 0.25} ${bottom}, ${right} ${bottom - r * 0.25}, ${right} ${bottom - r}`,
    `L ${right} ${top + r}`,
    `C ${right} ${top + r * 0.25}, ${right - r * 0.25} ${top}, ${right - r} ${top}`,
    `L ${x + r} ${top}`,
    `C ${x + r * 0.25} ${top}, ${x} ${top + r * 0.25}, ${x} ${top + r}`,
    `L ${x} ${bottom - r}`,
    `C ${x} ${bottom - r * 0.25}, ${x + r * 0.25} ${bottom}, ${x + r} ${bottom}`,
    "Z",
  ].join(" ");
}

// -----------------------------
// Deep merge utils (tiny, dependency-free)
// -----------------------------

type Primitive = string | number | boolean | null | undefined;

type PartialDeep<T> = unknown extends T
  ? T
  : T extends Primitive
  ? T
  : T extends Array<infer U>
  ? Array<PartialDeep<U>>
  : T extends Map<infer K, infer V>
  ? Map<K, PartialDeep<V>>
  : T extends Set<infer M>
  ? Set<PartialDeep<M>>
  : { [K in keyof T]?: PartialDeep<T[K]> };

// Prevent TypeScript from inferring T from the patch argument (important for strict configs).
// Without this, T may become PartialDeep<CoverConfig>, making cfg.* appear optional.
type NoInfer<T> = [T][T extends any ? 0 : never];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDeep<T>(base: T, patch?: PartialDeep<NoInfer<T>>): T {
  if (!patch) return structuredCloneSafe(base);

  const out: any = structuredCloneSafe(base);
  for (const key of Object.keys(patch) as Array<keyof T>) {
    const pv = (patch as any)[key];
    if (pv === undefined) continue;

    const bv = out[key];
    if (isObject(bv) && isObject(pv)) {
      out[key] = mergeDeep(bv, pv);
      continue;
    }

    out[key] = pv as any;
  }
  return out;
}

function structuredCloneSafe<T>(v: T): T {
  // Works in modern runtimes; fallback keeps it dev-friendly.
  if (typeof (globalThis as any).structuredClone === "function") {
    return (globalThis as any).structuredClone(v);
  }
  return JSON.parse(JSON.stringify(v));
}
