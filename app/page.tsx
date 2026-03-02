"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_URL;

const COLORS = ["#E900FF", "#BF00CC", "#8F00A0", "#6A007A", "#FF4DFF", "#CC00E0", "#A800B8"];

const TOOLTIP_STYLE = {
  backgroundColor: "#111111",
  border: "1px solid #E900FF",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "13px",
};

export default function Home() {
  const [overview, setOverview] = useState<any>(null);
  const [portfolioDist, setPortfolioDist] = useState<any>(null);
  const [peopleDist, setPeopleDist] = useState<any>(null);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string>("personSlug");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    async function load() {
      const [o, p, pe, r] = await Promise.all([
        axios.get(`${API}/analytics/overview`),
        axios.get(`${API}/analytics/portfolio-distribution`),
        axios.get(`${API}/analytics/people-distribution`),
        axios.get(`${API}/person-portco?limit=50`)
      ]);
      setOverview(o.data);
      setPortfolioDist(p.data);
      setPeopleDist(pe.data);
      setRelationships(r.data);
    }
    load();
  }, []);

  const filtered = relationships
    .filter(r =>
      [r.personSlug, r.portfolioName, r.role, r.extractedBy]
        .some(v => (v || "").toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const va = (a[sortKey] || "").toString().toLowerCase();
      const vb = (b[sortKey] || "").toString().toLowerCase();
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  if (!overview) return (
    <div style={{ background: "#000000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#E900FF", fontFamily: "sans-serif", fontSize: "18px", letterSpacing: "0.1em" }}>
        Loading intelligence data...
      </div>
    </div>
  );

  return (
    <div style={{ background: "#000000", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", color: "#ffffff" }}>

      {/* Top Nav */}
      <nav style={{
        background: "#0a0a0a", borderBottom: "1px solid #1a1a1a",
        padding: "0 40px", height: "64px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E900FF", boxShadow: "0 0 8px #E900FF" }} />
          <span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "0.05em" }}>JERRY</span>
          <span style={{ fontSize: "11px", color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginLeft: "8px", paddingLeft: "16px", borderLeft: "1px solid #222" }}>
            Portfolio Intelligence
          </span>
        </div>
        <img
          src="https://www.spotandweb.it/wp-content/uploads/2024/04/Nuovo-logo-Berry-srl.png"
          alt="Berry SRL"
          style={{ height: "36px", objectFit: "contain", filter: "brightness(0) invert(1)" }}
        />
      </nav>

      <div style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, margin: 0 }}>Dashboard Overview</h1>
          <p style={{ color: "#555", marginTop: "6px", fontSize: "13px" }}>Real-time portfolio intelligence analytics</p>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "48px" }}>
          <KpiCard title="Total Portfolios" value={overview.totalPortfolios} icon="◈" />
          <KpiCard title="Total People" value={overview.totalPeople} icon="◉" />
          <KpiCard title="Relationships" value={overview.totalRelationships} icon="◎" accent />
          <KpiCard title="Stub Portcos" value={overview.stubPortfolios} icon="◌" dim />
        </div>

        {/* Charts Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          <ChartCard title="Portfolio by Industry"><PieBlock data={portfolioDist.byIndustry} /></ChartCard>
          <ChartCard title="Portfolio by Region"><BarBlock data={portfolioDist.byRegion} /></ChartCard>
        </div>

        {/* Charts Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "48px" }}>
          <ChartCard title="People by Team"><BarBlock data={peopleDist.byTeam} /></ChartCard>
          <ChartCard title="People by Office"><BarBlock data={peopleDist.byOffice} /></ChartCard>
        </div>

        {/* Table */}
        <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "24px 28px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>Person ↔ PortCo Relationships</h2>
              <span style={{ fontSize: "12px", color: "#555", marginTop: "4px", display: "block" }}>{filtered.length} records</span>
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search relationships..."
              style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "9px 16px", color: "#fff", fontSize: "13px", width: "240px", outline: "none" }}
              onFocus={e => (e.target.style.borderColor = "#E900FF")}
              onBlur={e => (e.target.style.borderColor = "#2a2a2a")}
            />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#111" }}>
                  {[
                    { key: "personSlug", label: "Person" },
                    { key: "portfolioName", label: "Portfolio" },
                    { key: "role", label: "Role" },
                    { key: "matchConfidence", label: "Confidence" },
                    { key: "extractedBy", label: "Extracted By" },
                  ].map(col => (
                    <th key={col.key} onClick={() => handleSort(col.key)} style={{
                      padding: "12px 20px", textAlign: "left",
                      color: sortKey === col.key ? "#E900FF" : "#666",
                      fontWeight: 600, fontSize: "11px", letterSpacing: "0.1em",
                      textTransform: "uppercase", cursor: "pointer",
                      borderBottom: "1px solid #1a1a1a", userSelect: "none", whiteSpace: "nowrap",
                    }}>
                      {col.label} {sortKey === col.key ? (sortDir === "asc" ? "↑" : "↓") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i}
                    style={{ background: i % 2 === 0 ? "#000" : "#050505", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#0f0f0f")}
                    onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "#000" : "#050505")}
                  >
                    <td style={{ padding: "12px 20px", borderBottom: "1px solid #0d0d0d", color: "#fff", fontWeight: 500 }}>{r.personSlug}</td>
                    <td style={{ padding: "12px 20px", borderBottom: "1px solid #0d0d0d", color: "#bbb" }}>{r.portfolioName}</td>
                    <td style={{ padding: "12px 20px", borderBottom: "1px solid #0d0d0d" }}>
                      {r.role
                        ? <span style={{ background: "#1a001a", border: "1px solid #E900FF44", color: "#E900FF", padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>{r.role}</span>
                        : <span style={{ color: "#333" }}>—</span>}
                    </td>
                    <td style={{ padding: "12px 20px", borderBottom: "1px solid #0d0d0d" }}><ConfidenceBadge value={r.matchConfidence} /></td>
                    <td style={{ padding: "12px 20px", borderBottom: "1px solid #0d0d0d", color: "#555", fontSize: "12px" }}>{r.extractedBy}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#333" }}>No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: "40px", textAlign: "center", color: "#222", fontSize: "12px" }}>
          Jerry Intelligence Platform — Berry SRL © 2025
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, accent, dim }: any) {
  return (
    <div style={{ background: "#0a0a0a", border: `1px solid ${accent ? "#E900FF44" : "#1a1a1a"}`, borderRadius: "12px", padding: "28px 24px", position: "relative", overflow: "hidden" }}>
      {accent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #E900FF, transparent)" }} />}
      <div style={{ fontSize: "18px", marginBottom: "12px", opacity: 0.5 }}>{icon}</div>
      <div style={{ fontSize: "36px", fontWeight: 800, color: accent ? "#E900FF" : dim ? "#444" : "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value?.toLocaleString()}
      </div>
      <div style={{ color: "#555", fontSize: "11px", marginTop: "8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{title}</div>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "28px" }}>
      <h3 style={{ margin: "0 0 24px 0", fontSize: "11px", fontWeight: 600, color: "#666", letterSpacing: "0.15em", textTransform: "uppercase" }}>{title}</h3>
      {children}
    </div>
  );
}

function PieBlock({ data }: any) {
  return (
    <PieChart width={320} height={260}>
      <Pie data={data} dataKey="count" nameKey="_id" outerRadius={100} innerRadius={55} paddingAngle={3}>
        {data.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
      </Pie>
      <Tooltip contentStyle={TOOLTIP_STYLE} />
      <Legend formatter={(value) => <span style={{ color: "#777", fontSize: "11px" }}>{value}</span>} />
    </PieChart>
  );
}

function BarBlock({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="3 3" stroke="#141414" vertical={false} />
        <XAxis dataKey="_id" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#E900FF11" }} />
        <Bar dataKey="count" fill="#E900FF" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ConfidenceBadge({ value }: { value: string | number }) {
  const v = typeof value === "string" ? parseFloat(value) : value;
  const pct = isNaN(v) ? null : Math.round(v * (v <= 1 ? 100 : 1));
  const color = pct === null ? "#555" : pct >= 80 ? "#00e676" : pct >= 50 ? "#E900FF" : "#ff4444";
  return <span style={{ color, fontWeight: 600, fontSize: "13px" }}>{pct !== null ? `${pct}%` : value || "—"}</span>;
}