import React, { useState } from "react";

export default function OrganizationProfilePage() {
  const defaultCreds = [
    { key: "reg80g", label: "80G EXEMPTION No", val: "80G/AALTS4686BF20214/Dated 28/05/2021" },
    { key: "reg12a", label: "12AA REGN No", val: "12AA/AALTS4686BE20214/Dated" },
    { key: "validity", label: "12AA & 80G validity", val: "Valid from AY 2022-23 to AY 2026-27" },
    { key: "trust", label: "CIN", val: "U80900PB2018NPL048338" },
    { key: "pan", label: "PAN No", val: "AALTS4686B" },
    { key: "csr", label: "CSR1 Registration No", val: "CSR0000261 dated 02/04/2021" }
  ];

  const [creds, setCreds] = useState(() => {
    const saved = localStorage.getItem("ssf_credentials_grid");
    let parsed = saved ? JSON.parse(saved) : defaultCreds;
    parsed = parsed.map(c => {
      if (c.key === "trust") {
        return {
          ...c,
          label: "CIN",
          val: (c.val && c.val !== "______" && c.val !== "" && !c.val.includes("32703")) ? c.val : "U80900PB2018NPL048338"
        };
      }
      if (c.key === "validity" && c.val) {
        return {
          ...c,
          val: c.val.startsWith("From") ? c.val.replace("From", "Valid from") : c.val
        };
      }
      return c;
    });
    return parsed;
  });

  const [notif, setNotif] = useState("");

  const handleValueChange = (index, value) => {
    setCreds(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], val: value };
      return copy;
    });
  };

  const handleSave = () => {
    localStorage.setItem("ssf_credentials_grid", JSON.stringify(creds));
    
    setNotif("Credentials saved successfully! Your generated receipts will automatically reflect these updates.");
    setTimeout(() => setNotif(""), 4000);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--color-text-main)", margin: 0 }}>🛡️ NGO Regulatory Credentials & Trust Settings</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: "0.25rem 0 0" }}>
              Configure Sanjhi Sikhiya Foundation's regulatory trust credentials. The keys are permanently fixed to maintain tax-compliance, while their values can be modified below.
            </p>
          </div>
          <button className="btn-p" style={{ background: "var(--teal-d)", border: "none" }} onClick={handleSave}>
            💾 Save Settings
          </button>
        </div>

        {notif && (
          <div style={{ background: "#DCFCE7", color: "#15803D", padding: "0.85rem 1rem", borderRadius: "10px", fontSize: "0.8rem", fontWeight: "600", marginBottom: "1.5rem", border: "1px solid #BBF7D0" }}>
            ✓ {notif}
          </div>
        )}

        {/* CREDENTIALS DATA TABLE */}
        <div style={{ overflowX: "auto", border: "1px solid var(--color-border)", borderRadius: "12px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700", color: "#475569", width: "40%" }}>Regulatory Certificate Key (Fixed)</th>
                <th style={{ padding: "0.85rem 1rem", fontWeight: "700", color: "#475569" }}>Registration Value / Details (Editable)</th>
              </tr>
            </thead>
            <tbody>
              {creds.map((c, i) => (
                <tr key={c.key} style={{ borderBottom: i < creds.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                  <td style={{ padding: "1rem", fontWeight: "700", color: "var(--color-text-main)" }}>
                    {c.label}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <input
                      type="text"
                      value={c.val}
                      onChange={(e) => handleValueChange(i, e.target.value)}
                      style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "0.85rem", fontFamily: "'Courier New', Courier, monospace", fontWeight: "600", background: "#f8fafc", color: "#0F766E" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STATIC BRAND INFORMATION BUBBLE */}
      <div style={{ background: "#F0FDFA", border: "1px dashed var(--teal-l)", borderRadius: "16px", padding: "1.25rem 1.5rem", display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "1.4rem" }}>ℹ️</span>
        <div style={{ fontSize: "0.78rem", color: "#0F766E", lineHeight: "1.5" }}>
          <b>Exemption Table Rules:</b> These six regulatory audit identifiers appear directly on the generated tax exemption certificates. Donors require these values to verify the exemption status of Sanjhi Sikhiya Foundation on the Income Tax Portal.
        </div>
      </div>

    </div>
  );
}
