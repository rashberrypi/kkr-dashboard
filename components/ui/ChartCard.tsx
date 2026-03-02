export default function ChartCard({ title, children }: any) {
  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid #1a1a1a",
        borderRadius: "12px",
        padding: "28px",
      }}
    >
      <h3
        style={{
          margin: "0 0 24px 0",
          fontSize: "11px",
          fontWeight: 600,
          color: "#666",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}