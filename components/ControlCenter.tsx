"use client";

import axios from "axios";
import { useState } from "react";
import { API } from "@/lib/constants";

type Endpoint = {
    label: string;
    method: "GET" | "POST";
    path: string;
};

const endpoints: Endpoint[] = [
    { label: "Sync Portfolios", method: "POST", path: "/scraper/sync/kkr" },
    { label: "Sync People", method: "POST", path: "/scraper/sync/kkr/people" },
    { label: "Run Full Pipeline", method: "POST", path: "/enrichment/run" },
    { label: "Run Bio Fetch", method: "POST", path: "/enrichment/run/bio-fetch" },
    { label: "Run Enrich", method: "POST", path: "/enrichment/run/enrich" },
    { label: "Check Status", method: "GET", path: "/enrichment/status" },
];

export default function ControlCenter() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [responses, setResponses] = useState<Record<string, any>>({});

    async function execute(ep: Endpoint) {
        try {
            setLoading(ep.path);

            const res =
                ep.method === "POST"
                    ? await axios.post(`${API}${ep.path}`)
                    : await axios.get(`${API}${ep.path}`);

            setResponses((prev) => ({
                ...prev,
                [ep.path]: res.data,
            }));
        } catch (err: any) {
            setResponses((prev) => ({
                ...prev,
                [ep.path]: err?.response?.data || "Error",
            }));
        } finally {
            setLoading(null);
        }
    }

    return (
        <>
            {/* Tools Icon */}
            <div
                style={iconStyle}
                onClick={() => setOpen(!open)}
            >
                🛠
            </div>

            {/* Dropdown Panel */}
            {open && (
                <div style={panelStyle}>
                    <div style={headerStyle}>CONTROL CENTRE</div>

                    {endpoints.map((ep) => (
                        <div key={ep.path} style={endpointBlock}>
                            <button
                                style={buttonStyle}
                                onClick={() => execute(ep)}
                            >
                                ▶ {ep.method} {ep.path}
                            </button>

                            {loading === ep.path && (
                                <div style={loadingStyle}>Running...</div>
                            )}

                            {responses[ep.path] && (
                                <pre style={responseStyle}>
                                    {JSON.stringify(responses[ep.path], null, 2)}
                                </pre>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

/* ================== STYLES ================== */

const iconStyle = {
    cursor: "pointer",
    fontSize: "18px",
    padding: "8px 12px",
    border: "1px solid #222",
    borderRadius: "6px",
    background: "#0f0f0f",
};

const panelStyle = {
    position: "absolute" as const,
    right: "40px",
    top: "70px",
    width: "420px",
    maxHeight: "70vh",
    overflowY: "auto" as const,
    background: "#0a0a0a",
    border: "1px solid #1a1a1a",
    borderRadius: "8px",
    padding: "20px",
    zIndex: 999,
    boxShadow: "0 0 30px rgba(0,0,0,0.6)",
};

const headerStyle = {
    marginBottom: "15px",
    fontSize: "14px",
    color: "#E900FF",
    letterSpacing: "1px",
};

const endpointBlock = {
    marginBottom: "20px",
};

const buttonStyle = {
    width: "100%",
    background: "#111",
    border: "1px solid #222",
    padding: "8px",
    fontSize: "12px",
    color: "#ccc",
    textAlign: "left" as const,
    cursor: "pointer",
    borderRadius: "4px",
};

const responseStyle = {
    marginTop: "8px",
    background: "#000",
    padding: "10px",
    fontSize: "11px",
    borderRadius: "4px",
    color: "#4da6ff",
    maxHeight: "200px",
    overflowY: "auto" as const,
};

const loadingStyle = {
    marginTop: "6px",
    fontSize: "11px",
    color: "#E900FF",
};