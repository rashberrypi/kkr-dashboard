"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/lib/constants";
import PersonProfileModal from "./PersonProfileModal";

export default function PortfoliosTable() {
  const [data, setData] = useState<any[]>([]);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [p, r] = await Promise.all([
        axios.get(`${API}/portfolios`),
        axios.get(`${API}/person-portco`),
      ]);

      setData(p.data);
      setRelationships(r.data);
    }
    load();
  }, []);

  function getLinkedPeople(externalId: string) {
    return relationships.filter(
      (r) => r.externalId === externalId
    );
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}>All Portfolios</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#111" }}>
              <th style={th}>Name</th>
              <th style={th}>Industry</th>
              <th style={th}>Region</th>
              <th style={th}>Entry Year</th>
              <th style={th}>Linked People</th>
            </tr>
          </thead>

          <tbody>
            {data.map((p, i) => {
              const linked = getLinkedPeople(p.externalId);

              return (
                <tr key={i} style={{ borderBottom: "1px solid #222" }}>
                  <td style={td}>{p.name}</td>
                  <td style={td}>{p.basics?.industry}</td>
                  <td style={td}>{p.basics?.region}</td>
                  <td style={td}>{p.investment?.entryYear}</td>

                  <td style={td}>
                    {linked.length === 0 && "-"}
                    {linked.map((r: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          cursor: "pointer",
                          color: "#E900FF",
                          marginBottom: "4px",
                        }}
                        onClick={() => setSelectedSlug(r.personSlug)}
                      >
                        {r.personSlug
                          .split("-")
                          .slice(0, 2)
                          .map(
                            (w: string) =>
                              w.charAt(0).toUpperCase() + w.slice(1)
                          )
                          .join(" ")}
                      </div>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedSlug && (
        <PersonProfileModal
          slug={selectedSlug}
          onClose={() => setSelectedSlug(null)}
        />
      )}
    </div>
  );
}

const th = {
  padding: "12px",
  textAlign: "left" as const,
  fontSize: "12px",
  color: "#888",
};

const td = {
  padding: "12px",
  fontSize: "13px",
};