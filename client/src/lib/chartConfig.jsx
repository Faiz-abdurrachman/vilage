// ============================================================
// SIDESA Chart Design System
// Premium chart configuration — consistent across all pages
// ============================================================

// ── Color Palettes ──────────────────────────────────────────

export const CHART_COLORS = {
  blue:    '#3b82f6',
  indigo:  '#6366f1',
  violet:  '#8b5cf6',
  rose:    '#f43f5e',
  pink:    '#ec4899',
  amber:   '#f59e0b',
  emerald: '#10b981',
  teal:    '#14b8a6',
  sky:     '#0ea5e9',
  slate:   '#64748b',
};

// Gender
export const GENDER_COLORS = ['#3b82f6', '#f43f5e'];

// Agama — 6 entries
export const AGAMA_COLORS = [
  '#3b82f6', // Islam
  '#10b981', // Kristen
  '#f59e0b', // Katolik
  '#8b5cf6', // Hindu
  '#f43f5e', // Budha
  '#14b8a6', // Konghucu
];

// Dusun — blue spectrum
export const DUSUN_COLORS = [
  '#1d4ed8',
  '#2563eb',
  '#3b82f6',
  '#60a5fa',
  '#93c5fd',
];

// Pendidikan — teal spectrum
export const PENDIDIKAN_COLORS = [
  '#0d9488',
  '#0f766e',
  '#14b8a6',
  '#2dd4bf',
  '#5eead4',
  '#99f6e4',
  '#10b981',
  '#34d399',
];

// Kelompok umur
export const UMUR_LAKI   = '#3b82f6';
export const UMUR_WANITA = '#f472b6';

// Mutasi tren
export const MUTASI_COLORS = {
  lahir:       '#3b82f6',
  meninggal:   '#94a3b8',
  pindahMasuk: '#10b981',
  pindahKeluar:'#f59e0b',
};

// ── Gradient IDs (for linearGradient defs) ──────────────────

export const GRADIENT_IDS = {
  blue:    'grad-blue',
  emerald: 'grad-emerald',
  rose:    'grad-rose',
  amber:   'grad-amber',
  violet:  'grad-violet',
  slate:   'grad-slate',
  lakiLaki:'grad-laki',
  perempuan:'grad-perempuan',
};

// Helper: returns <defs> with all gradients — add inside any SVG chart
// Usage: place <ChartGradients /> as first child of PieChart/BarChart/etc.
export function getGradientDefs() {
  const stops = [
    { id: GRADIENT_IDS.blue,     color: '#3b82f6' },
    { id: GRADIENT_IDS.emerald,  color: '#10b981' },
    { id: GRADIENT_IDS.rose,     color: '#f43f5e' },
    { id: GRADIENT_IDS.amber,    color: '#f59e0b' },
    { id: GRADIENT_IDS.violet,   color: '#8b5cf6' },
    { id: GRADIENT_IDS.slate,    color: '#94a3b8' },
    { id: GRADIENT_IDS.lakiLaki, color: '#3b82f6' },
    { id: GRADIENT_IDS.perempuan,color: '#f472b6' },
  ];
  return stops;
}

// ── Shared Style Objects ─────────────────────────────────────

export const GRID_STYLE = {
  strokeDasharray: '3 3',
  stroke: '#f1f5f9',
};

export const AXIS_STYLE = {
  tick:     { fontSize: 10, fill: '#94a3b8', fontFamily: 'Inter, sans-serif' },
  axisLine: false,
  tickLine: false,
};

export const AXIS_Y_STYLE = {
  tick:     { fontSize: 10, fill: '#94a3b8', fontFamily: 'Inter, sans-serif' },
  axisLine: false,
  tickLine: false,
};

export const LEGEND_STYLE = {
  iconType: 'circle',
  iconSize: 8,
  wrapperStyle: {
    fontSize: 11,
    fontFamily: 'Inter, sans-serif',
    color: '#64748b',
    paddingTop: 8,
  },
};

export const ANIMATION_CONFIG = {
  animationBegin: 0,
  animationDuration: 1000,
  animationEasing: 'ease-out',
};

// ── Tooltip ──────────────────────────────────────────────────

export const TOOLTIP_STYLE = {
  cursor: { fill: 'rgba(241,245,249,0.6)' },
};

// Custom Tooltip component props (render via content={<CustomTooltip />})
// Defined as a factory so both files can share the same look

export function buildTooltipContent(formatValue) {
  return function CustomTooltipContent({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
      <div
        style={{
          background: 'rgba(255,255,255,0.97)',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '8px 12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          fontSize: 12,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {label && (
          <p style={{ fontWeight: 600, color: '#334155', marginBottom: 4 }}>{label}</p>
        )}
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color, margin: '1px 0' }}>
            {entry.name}:{' '}
            <span style={{ fontWeight: 700, color: '#0f172a' }}>
              {formatValue ? formatValue(entry.value) : entry.value?.toLocaleString('id-ID')}
            </span>
          </p>
        ))}
      </div>
    );
  };
}

// ── Value Label (on top of bars) ────────────────────────────

export function BarValueLabel(props) {
  const { x, y, width, value } = props;
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 4}
      fill="#64748b"
      textAnchor="middle"
      fontSize={9}
      fontFamily="Inter, sans-serif"
      fontWeight={600}
    >
      {value?.toLocaleString('id-ID')}
    </text>
  );
}

// Horizontal bar value label (right side)
export function HBarValueLabel(props) {
  const { x, y, width, height, value } = props;
  if (!value) return null;
  return (
    <text
      x={x + width + 5}
      y={y + height / 2 + 1}
      fill="#64748b"
      textAnchor="start"
      fontSize={9}
      fontFamily="Inter, sans-serif"
      fontWeight={600}
      dominantBaseline="middle"
    >
      {value?.toLocaleString('id-ID')}
    </text>
  );
}

// ── Formatters ───────────────────────────────────────────────

export function formatNumber(n) {
  return Number(n || 0).toLocaleString('id-ID');
}

export function formatRupiah(n) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(0)}jt`;
  if (n >= 1_000)         return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
}
