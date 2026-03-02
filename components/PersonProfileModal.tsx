"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/lib/constants";

export default function PersonProfileModal({
  slug,
  onClose,
}: {
  slug: string;
  onClose: () => void;
}) {
  const [person, setPerson] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await axios.get(`${API}/people/${slug}`);
      setPerson(res.data);
    }
    load();
  }, [slug]);

  if (!person) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <button onClick={onClose} style={closeBtn}>
          ✕
        </button>

        <h2>{person.fullName}</h2>
        <p style={{ color: "#aaa" }}>{person.currentTitle}</p>

        <div style={{ marginTop: "20px" }}>
          <p><strong>Team:</strong> {person.primaryTeam}</p>
          <p><strong>Office:</strong> {person.officeLocation}</p>
          <p><strong>GP:</strong> {person.currentGp}</p>
          <p><strong>Status:</strong> {person.syncStatus}</p>
        </div>

        {person.rawBiography && (
          <div style={{ marginTop: "20px" }}>
            <h4>Biography</h4>
            <p style={{ whiteSpace: "pre-line", color: "#ccc" }}>
              {person.rawBiography}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modal = {
  background: "#111",
  padding: "30px",
  width: "600px",
  maxHeight: "80vh",
  overflowY: "auto" as const,
  borderRadius: "8px",
};

const closeBtn = {
  position: "absolute" as const,
  right: "20px",
  top: "20px",
  background: "transparent",
  color: "#fff",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
};