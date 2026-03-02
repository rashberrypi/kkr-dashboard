export default function ConfidenceBadge({ value }: { value: string | number }) {
  const v = typeof value === "string" ? parseFloat(value) : value;
  const pct = isNaN(v) ? null : Math.round(v * (v <= 1 ? 100 : 1));

  const color =
    pct === null
      ? "#555"
      : pct >= 80
      ? "#00e676"
      : pct >= 50
      ? "#E900FF"
      : "#ff4444";

  return (
    <span style={{ color, fontWeight: 600, fontSize: "13px" }}>
      {pct !== null ? `${pct}%` : value || "—"}
    </span>
  );
}