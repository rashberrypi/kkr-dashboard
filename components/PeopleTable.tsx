"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/lib/constants";
import { useRouter } from "next/navigation";

interface Person {
  _id: string;
  fullName: string;
  currentTitle?: string;
  primaryTeam?: string;
  officeLocation?: string;
  currentGp?: string;
  syncStatus?: string;
  lastEnrichedAt?: string;
}

export default function PeopleTable() {
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const res = await axios.get(`${API}/people`);
      setData(res.data);
    }
    load();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <div>
        <h1 style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "#ffffff",
          marginBottom: "8px",
          letterSpacing: "-0.025em"
        }}>
          All People
        </h1>
        <p style={{
          fontSize: "1rem",
          color: "#666",
          marginTop: "0",
          marginBottom: "24px"
        }}>
          Select a person to view details
        </p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#111" }}>
              <th style={th}>Full Name</th>
              <th style={th}>Title</th>
              <th style={th}>Team</th>
              <th style={th}>Office</th>
              <th style={th}>GP</th>
              <th style={th}>Sync Status</th>
              <th style={th}>Last Enriched</th>
            </tr>
          </thead>

          <tbody>
            {data.map((p, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: "1px solid #222",
                  cursor: "pointer",
                }}
                onClick={() => router.push(`/people/${p._id}`)}
              >
                <td style={td}>{p.fullName}</td>
                <td style={td}>{p.currentTitle}</td>
                <td style={td}>{p.primaryTeam}</td>
                <td style={td}>{p.officeLocation}</td>
                <td style={td}>{p.currentGp}</td>
                <td style={td}>{p.syncStatus}</td>
                <td style={td}>
                  {p.lastEnrichedAt
                    ? new Date(p.lastEnrichedAt).toLocaleDateString()
                    : "-"}
                </td>
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
};

const td = {
  padding: "12px",
  fontSize: "13px",
};