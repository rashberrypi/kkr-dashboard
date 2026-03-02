export default function KpiCard({
  title,
  value,
  icon,
  accent = false,
  dim = false,
  onClick,
}: {
  title: string;
  value: number;
  icon: string;
  accent?: boolean;
  dim?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: accent ? "#111" : "#0a0a0a",
        border: accent ? "1px solid #E900FF" : "1px solid #1a1a1a",
        boxShadow: accent ? "0 0 15px rgba(233,0,255,0.4)" : "none",
        cursor: onClick ? "pointer" : "default",
        padding: "28px 24px",
        borderRadius: "8px",
        transition: "all 0.2s ease",
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #E900FF, transparent)",
          }}
        />
      )}

      <div style={{ fontSize: "18px", marginBottom: "12px", opacity: 0.5 }}>
        {icon}
      </div>

      <div
        style={{
          fontSize: "36px",
          fontWeight: 800,
          color: accent ? "#E900FF" : dim ? "#444" : "#fff",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value?.toLocaleString()}
      </div>

      <div
        style={{
          color: "#555",
          fontSize: "11px",
          marginTop: "8px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
    </div>
  );
}