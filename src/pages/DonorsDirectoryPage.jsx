import React, { useState } from "react";

export default function DonorsDirectoryPage({ receiptList = [] }) {
  const [search, setSearch] = useState("");

  // Aggregate donation metrics by unique PAN card (or Name if PAN is missing)
  const donorRegistry = receiptList.reduce((acc, r) => {
    const key = (r.donorPan || r.donorName || "UNKNOWN").toUpperCase();
    if (!acc[key]) {
      acc[key] = {
        name: r.donorName,
        pan: r.donorPan || "N/A",
        email: r.donorEmail || "N/A",
        phone: r.donorPhone || "N/A",
        address: r.donorAddress || "N/A",
        totalDonated: 0,
        frequency: 0,
        lastDonationDate: r.date
      };
    }
    acc[key].totalDonated += parseFloat(r.amount || 0);
    acc[key].frequency += 1;
    if (new Date(r.date) > new Date(acc[key].lastDonationDate)) {
      acc[key].lastDonationDate = r.date;
    }
    return acc;
  }, {});

  const donors = Object.values(donorRegistry).filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.pan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* HEADER CONTROLLER */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="🔍 Search donors directory by name or PAN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            maxWidth: "480px",
            padding: "0.6rem 1rem",
            border: "1px solid var(--color-border)",
            borderRadius: "10px",
            fontSize: "0.85rem"
          }}
        />
        <div style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: "600" }}>
          Registered Contributors: <span style={{ color: "var(--color-text-main)", fontSize: "0.9rem", fontWeight: "800" }}>{donors.length}</span>
        </div>
      </div>

      {/* REGISTRY LIST */}
      {donors.length === 0 ? (
        <div className="empty-state" style={{ background: "#ffffff", padding: "3rem 1rem" }}>
          <div className="empty-ic">👥</div>
          <div className="empty-t">No Donors Registered Yet</div>
          <div className="empty-d">Log receipts or import files to populate your donor CRM.</div>
        </div>
      ) : (
        <div style={{ background: "#ffffff", border: "1px solid var(--color-border)", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlignment: "left", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700", color: "#475569" }}>Donor Name / Organization</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700", color: "#475569" }}>PAN Code</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700", color: "#475569" }}>Email / Mobile</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700", color: "#475569" }}>LTV Total (INR)</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700", color: "#475569" }}>Frequency</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700", color: "#475569" }}>Last Contribution</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((d, i) => (
                <tr key={i} style={{ borderBottom: i < donors.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: "700", color: "var(--color-text-main)", fontSize: "0.85rem" }}>{d.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--muted)", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "0.15rem" }}>
                      📍 {d.address}
                    </div>
                  </td>
                  <td style={{ padding: "1rem", fontFamily: "monospace", fontWeight: "700" }}>{d.pan}</td>
                  <td style={{ padding: "1rem" }}>
                    <div>✉️ {d.email}</div>
                    {d.phone !== "N/A" && <div style={{ marginTop: "0.15rem" }}>📞 {d.phone}</div>}
                  </td>
                  <td style={{ padding: "1rem", fontWeight: "700", color: "var(--teal-d)", fontSize: "0.85rem" }}>
                    ₹{d.totalDonated.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.15rem 0.5rem", borderRadius: "20px", fontWeight: "600", fontSize: "0.72rem" }}>
                      {d.frequency} receipt{d.frequency > 1 ? "s" : ""}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", color: "var(--muted)" }}>{d.lastDonationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
