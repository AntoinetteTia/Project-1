export interface ChartPoint {
  date: string;
  value: number;
}

export default function LineChart({
  points,
  unit,
}: {
  points: ChartPoint[];
  unit: string;
}) {
  if (points.length === 0) return null;

  const width = 320;
  const height = 140;
  const padX = 12;
  const padY = 16;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const stepX =
    points.length > 1 ? (width - padX * 2) / (points.length - 1) : 0;

  const coords = points.map((p, i) => {
    const x = padX + i * stepX;
    const y =
      height - padY - ((p.value - min) / range) * (height - padY * 2);
    return { x, y, ...p };
  });

  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(" ");

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label={`Body weight trend chart, ranging from ${min} to ${max} ${unit}`}
      >
        <path
          d={path}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={2.5} fill="var(--accent)" />
        ))}
        <text x={padX} y={height - 2} fontSize={9} fill="var(--text-muted)">
          {points[0].date.slice(5)}
        </text>
        <text
          x={width - padX}
          y={height - 2}
          fontSize={9}
          fill="var(--text-muted)"
          textAnchor="end"
        >
          {points[points.length - 1].date.slice(5)}
        </text>
        <text x={padX} y={10} fontSize={9} fill="var(--text-muted)">
          {max}
          {unit}
        </text>
        <text
          x={padX}
          y={height - padY - 2}
          fontSize={9}
          fill="var(--text-muted)"
        >
          {min}
          {unit}
        </text>
      </svg>
    </div>
  );
}
