import { API } from "@/lib/constants";


async function getPerson(id: string) {
    const res = await fetch(
        `${API}/people/${id}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Backend error: ${text}`);
    }

    return res.json();
}


export default async function PersonProfile({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const data = await getPerson(id);
    const { person, portfolioRelationships } = data;

    return (
        <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>

            {/* ================= HEADER CARD ================= */}
            <div style={card}>
                <h1 style={{ fontSize: "30px", marginBottom: "5px" }}>
                    {person.fullName}
                </h1>

                <p style={{ color: "#888", marginBottom: "20px" }}>
                    {person.currentTitle} • {person.primaryTeam}
                </p>

                <div style={grid}>
                    <Info label="Office Location" value={person.officeLocation} />
                    <Info label="Current GP" value={person.currentGp} />
                    <Info label="Person Slug" value={person.personSlug} />
                    <Info label="Sync Status" value={person.syncStatus} />
                    <Info
                        label="Last Enriched"
                        value={
                            person.lastEnrichedAt
                                ? new Date(person.lastEnrichedAt).toLocaleString()
                                : "-"
                        }
                    />
                </div>
            </div>

            {/* ================= BIOGRAPHY ================= */}
            {person.rawBiography && (
                <div style={{ ...card, marginTop: "25px" }}>
                    <SectionTitle title="Biography" />
                    <p style={{ lineHeight: "1.7", color: "#ccc" }}>
                        {person.rawBiography}
                    </p>
                </div>
            )}

            {/* ================= SOURCES ================= */}
            {person.sources && (
                <div style={{ ...card, marginTop: "25px" }}>
                    <SectionTitle title="Sources" />

                    <div style={grid}>
                        <Info label="KKR URL" value={person.sources.kkrUrl} link />
                        <Info label="SEC URL" value={person.sources.secUrl} link />
                        <Info label="LinkedIn URL" value={person.sources.linkedinUrl} link />
                        <Info label="Bloomberg URL" value={person.sources.bloombergUrl} link />
                    </div>
                </div>
            )}

            {/* ================= SYNC ERROR ================= */}
            {person.syncError && (
                <div
                    style={{
                        ...card,
                        marginTop: "25px",
                        border: "1px solid #5a1e1e",
                        background: "#1a0f0f",
                    }}
                >
                    <SectionTitle title="Sync Error" />
                    <p style={{ color: "#ff6b6b" }}>{person.syncError}</p>
                </div>
            )}

            {/* ================= PORTFOLIO RELATIONSHIPS ================= */}
            <div style={{ ...card, marginTop: "25px" }}>
                <SectionTitle title="Portfolio Relationships" />

                {portfolioRelationships.length === 0 ? (
                    <p style={{ color: "#666" }}>No linked portfolio companies</p>
                ) : (
                    <table style={{ width: "100%", marginTop: "10px" }}>
                        <thead>
                            <tr style={{ textAlign: "left", color: "#777" }}>
                                <th style={th}>Portfolio</th>
                                <th style={th}>Role</th>
                                <th style={th}>Confidence</th>
                                <th style={th}>Extracted By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolioRelationships.map((rel: any, i: number) => (
                                <tr key={i} style={{ borderBottom: "1px solid #222" }}>
                                    <td style={td}>{rel.portfolioName}</td>
                                    <td style={td}>{rel.role || "-"}</td>
                                    <td style={td}>
                                        {(rel.matchConfidence * 100).toFixed(0)}%
                                    </td>
                                    <td style={td}>{rel.extractedBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ================= META INFO ================= */}
            <div style={{ ...card, marginTop: "25px" }}>
                <SectionTitle title="Metadata" />

                <div style={grid}>
                    <Info label="Created At" value={new Date(person.createdAt).toLocaleString()} />
                    <Info label="Updated At" value={new Date(person.updatedAt).toLocaleString()} />
                    <Info label="Mongo ID" value={person._id} />
                    <Info label="Version (__v)" value={String(person.__v)} />
                </div>
            </div>
        </div>
    );
}

/* ================= UI COMPONENTS ================= */

function Info({
    label,
    value,
    link = false,
}: {
    label: string;
    value?: string;
    link?: boolean;
}) {
    if (!value) return null;

    return (
        <div>
            <p style={{ fontSize: "12px", color: "#666" }}>{label}</p>
            {link ? (
                <a
                    href={value}
                    target="_blank"
                    style={{ color: "#4da6ff", fontSize: "14px" }}
                >
                    {value}
                </a>
            ) : (
                <p style={{ fontSize: "14px" }}>{value}</p>
            )}
        </div>
    );
}

function SectionTitle({ title }: { title: string }) {
    return (
        <h3
            style={{
                marginBottom: "15px",
                fontSize: "16px",
                color: "#aaa",
                letterSpacing: "0.5px",
            }}
        >
            {title}
        </h3>
    );
}

/* ================= STYLES ================= */

const card = {
    background: "#111",
    padding: "25px",
    borderRadius: "8px",
};

const grid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
};

const th = {
    paddingBottom: "10px",
    fontSize: "12px",
};

const td = {
    padding: "10px 0",
    fontSize: "14px",
};