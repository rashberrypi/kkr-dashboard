export default function KpiCard({ onClick, title, value, icon, accent, dim }: any) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s",
        background: "#0a0a0a",
        border: "1px solid #1a1a1a",
        borderRadius: "12px",
        padding: "28px 24px",
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