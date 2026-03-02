"use client";

import { useState } from "react";

function slugToName(slug: string) {
  if (!slug) return "";
  const parts = slug.split("-");
  return parts
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function RelationshipsTable({
  relationships,
}: {
  relationships: any[];
}) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("personSlug");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = relationships
    .filter((r) =>
      [r.personSlug, r.portfolioName, r.role]
        .some((v) =>
          (v || "")
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase())
        )
    )
    .sort((a, b) => {
      const va = (a[sortKey] || "").toString().toLowerCase();
      const vb = (b[sortKey] || "").toString().toLowerCase();
      return sortDir === "asc"
        ? va.localeCompare(vb)
        : vb.localeCompare(va);
    });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        Person ↔ Portfolio Relationships
      </h2>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "10px",
          background: "#111",
          border: "1px solid #222",
          color: "#fff",
          width: "300px",
        }}
      />

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#111" }}>
              <th style={th} onClick={() => handleSort("personSlug")}>
                Person
              </th>
              <th style={th} onClick={() => handleSort("portfolioName")}>
                Portfolio
              </th>
              <th style={th} onClick={() => handleSort("role")}>
                Role
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r: any, i: number) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid #222" }}
              >
                <td style={td}>{slugToName(r.personSlug)}</td>
                <td style={td}>{r.portfolioName}</td>
                <td style={td}>{r.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = {
  padding: "12px",
  textAlign: "left" as const,
  fontSize: "12px",
  color: "#888",
  cursor: "pointer",
};

const td = {
  padding: "12px",
  fontSize: "13px",
};