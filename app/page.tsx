"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { API } from "@/lib/constants";

import KpiCard from "@/components/ui/KpiCard";
import ChartCard from "@/components/ui/ChartCard";
import PieBlock from "@/components/charts/PieBlock";
import BarBlock from "@/components/charts/BarBlock";
import RelationshipsTable from "@/components/RelationshipsTable";
import PortfoliosTable from "@/components/PortfoliosTable";
import PeopleTable from "@/components/PeopleTable";
import ControlCenter from "@/components/ControlCenter";

export default function Home() {
  const [overview, setOverview] = useState<any>(null);
  const [portfolioDist, setPortfolioDist] = useState<any>(null);
  const [peopleDist, setPeopleDist] = useState<any>(null);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<
    "dashboard" | "portfolios" | "people"
  >("dashboard");

  console.log("API VALUE:", process.env.NEXT_PUBLIC_API);

  useEffect(() => {
    async function load() {
      const [o, p, pe, r] = await Promise.all([
        axios.get(`${API}/analytics/overview`),
        axios.get(`${API}/analytics/portfolio-distribution`),
        axios.get(`${API}/analytics/people-distribution`),
        axios.get(`${API}/person-portco?limit=200`),
      ]);

      setOverview(o.data);
      setPortfolioDist(p.data);
      setPeopleDist(pe.data);
      setRelationships(r.data);
    }

    load();
  }, []);

  if (!overview) {
    return (
      <div
        style={{
          background: "#000",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#E900FF",
        }}
      >
        Loading intelligence data...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        color: "#fff",
      }}
    >
      {/* Top Nav */}
      <nav
        style={{
          background: "#0a0a0a",
          borderBottom: "1px solid #1a1a1a",
          padding: "0 40px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ControlCenter />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#E900FF",
              boxShadow: "0 0 8px #E900FF",
            }}
          />
          <span style={{ fontSize: "18px", fontWeight: 700 }}>JERRY</span>
          <span
            style={{
              fontSize: "11px",
              color: "#555",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginLeft: "8px",
              paddingLeft: "16px",
              borderLeft: "1px solid #222",
            }}
          >
            Portfolio Intelligence
          </span>
        </div>
      </nav>

      <div style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto" }}>
        {/* KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "48px",
          }}
        >
          <KpiCard
            title="Total Portfolios"
            value={overview.totalPortfolios}
            icon="◈"
            accent={activeView === "portfolios"}
            onClick={() => setActiveView("portfolios")}
          />

          <KpiCard
            title="Total People"
            value={overview.totalPeople}
            icon="◉"
            accent={activeView === "people"}
            onClick={() => setActiveView("people")}
          />

          <KpiCard
            title="Relationships"
            value={overview.totalRelationships}
            icon="◎"
            accent={activeView === "dashboard"}
            onClick={() => setActiveView("dashboard")}
          />

          <KpiCard
            title="Stub Portcos"
            value={overview.stubPortfolios}
            icon="◌"
            dim
          />
        </div>

        {/* ===================== */}
        {/* CONDITIONAL RENDERING */}
        {/* ===================== */}

        {activeView === "dashboard" && (
          <>
            {/* charts */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "40px"
            }}>
              <ChartCard title="Portfolio by Industry">
                <PieBlock data={portfolioDist?.byIndustry || []} />
              </ChartCard>

              <ChartCard title="People by Office">
                <BarBlock data={peopleDist?.byOffice || []} />
              </ChartCard>
            </div>

            <RelationshipsTable relationships={relationships} />
          </>
        )}

        {activeView === "portfolios" && <PortfoliosTable />}
        {activeView === "people" && <PeopleTable />}

        <div
          style={{
            marginTop: "60px",
            textAlign: "center",
            color: "#222",
            fontSize: "12px",
          }}
        >
          Jerry Intelligence Platform — Berry SRL © 2026
        </div>
      </div>
    </div>
  );
}