import React, { useState, useEffect } from "react";
import { amtWordsIndian } from "../utils/numberToWords";

export default function CreateReceiptPage({
  onSave,
  onCancel,
  editingReceipt,
}) {
  const [form, setForm] = useState({
    receiptNo: "",
    date: new Date().toISOString().split("T")[0],
    taxYear: "2026-27",
    donorName: "",
    donorPan: "",
    donorAddress: "",
    donorEmail: "",
    donorPhone: "",
    amount: "",
    towards: "Specific Grants",
    modeOfPayment: "Electronic modes including account payee cheque/draft",
    notes: "RTGS CR-HSBC0110002-NET SOLUTIONS INDIA PRIVATE LIMITED-SANJHI SIKHIYA FOUNDATION-HSBCR22026032435586953"
   });

  const defaultCreds = [
    { key: "reg80g",   label: "80G Registration No.", val: "ABACS7907E25CD02 Dated 20-01-2026",  from: "AY 2027-28", to: "AY 2031-32" },
    { key: "reg12a",   label: "12AB Registration No.",        val: "ABACS7907E25CD01 Dated 20-01-2026", from: "AY 2027-28", to: "AY 2036-37" },
    { key: "trust",    label: "CIN",                  val: "U80900PB2018NPL048338" },
    { key: "pan",      label: "PAN",                  val: "ABACS7907E" },
    { key: "csr",      label: "CSR 1 Registration No.",       val: "CSR00015126" },
  ];

  const [creds, setCreds] = useState(() => {
    const saved = localStorage.getItem("ssf_credentials_grid");
    let parsed = saved ? JSON.parse(saved) : defaultCreds;
    
    // Migrate labels and values dynamically
    parsed = parsed.map(c => {
      if (c.key === "reg80g") {
        return {
          ...c,
          label: "80G Registration No.",
          val: (c.val === "80G/ABACS7907EF20211/DATED 30-05-2022" || c.val === "80G - ABACS7907E25CD02 Dated 20/01/2026" || c.val === "80G - ABACS7907E25CD02 Dated 20-01-2026" || !c.val) ? "ABACS7907E25CD02 Dated 20-01-2026" : c.val,
          from: (c.from === "AY 2022-23" || !c.from) ? "AY 2027-28" : c.from,
          to: (c.to === "AY 2026-27" || !c.to) ? "AY 2031-32" : c.to
        };
      }
      if (c.key === "reg12a") {
        return {
          ...c,
          label: "12AB Registration No.",
          val: (c.val === "12AA/ABACS7907EF20211/DATED 28-05-2021" || c.val === "12AB - ABACS7907E25CD01 Dated 20/01/2026" || c.val === "12AB - ABACS7907E25CD01 Dated 20-01-2026" || !c.val) ? "ABACS7907E25CD01 Dated 20-01-2026" : c.val,
          from: (c.from === "AY 2022-23" || !c.from) ? "AY 2027-28" : c.from,
          to: (c.to === "AY 2026-27" || !c.to) ? "AY 2036-37" : c.to
        };
      }
      if (c.key === "trust") {
        const cleaned = c.val ? c.val.replace(/\s+/g, "") : "";
        return {
          ...c,
          label: "CIN",
          val: (cleaned && cleaned !== "______" && cleaned !== "") ? cleaned : "U80900PB2018NPL048338"
        };
      }
      if (c.key === "pan") {
        const cleaned = c.val ? c.val.replace(/\s+/g, "") : "";
        return {
          ...c,
          label: "PAN",
          val: (cleaned && cleaned !== "") ? cleaned : "ABACS7907E"
        };
      }
      if (c.key === "csr") {
        const cleaned = c.val ? c.val.replace(/\s+/g, "") : "";
        return {
          ...c,
          label: "CSR 1 Registration No.",
          val: (cleaned && cleaned !== "") ? cleaned : "CSR00015126"
        };
      }
      return c;
    });
    // back-fill from / to for old flat val entries (rows 0 and 1)
    parsed.forEach((c, i) => {
      if (i < 2 && !c.from && !c.to && c.val) {
        const m = c.val.match(/From\s+(.+?)\s+to\s+(.+)/i);
        if (m) { c.from = m[1].trim(); c.to = m[2].trim(); }
      }
    });
    return parsed;
  });

  const handleCredValueChange = (index, field, value) => {
    const copy = [...creds];
    let finalVal = value;
    if (field === "val" && (copy[index].key === "pan" || copy[index].key === "trust" || copy[index].key === "csr")) {
      finalVal = value.replace(/\s+/g, "");
    }
    copy[index] = { ...copy[index], [field]: finalVal };
    setCreds(copy);
    localStorage.setItem("ssf_credentials_grid", JSON.stringify(copy));
  };

  useEffect(() => {
    if (editingReceipt) {
      setForm({
        receiptNo: editingReceipt.receiptNo || "",
        date: editingReceipt.date || "",
        taxYear: editingReceipt.taxYear || "2026-27",
        donorName: editingReceipt.donorName || "",
        donorPan: editingReceipt.donorPan || "",
        donorAddress: editingReceipt.donorAddress || "",
        donorEmail: editingReceipt.donorEmail || "",
        donorPhone: editingReceipt.donorPhone || "",
        amount: editingReceipt.amount || "",
        towards: editingReceipt.towards || "Specific Grants",
        modeOfPayment: editingReceipt.modeOfPayment || "Electronic modes including account payee cheque/draft",
        notes: editingReceipt.notes || ""
      });
    } else {
      // Auto-generate a manual suggestion
      const rand = Math.floor(1000 + Math.random() * 9000);
      setForm(f => ({
        ...f,
        receiptNo: `SSF/REC/${new Date().getFullYear()}/${rand}`,
        taxYear: "2026-27"
      }));
    }
  }, [editingReceipt]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.receiptNo || !form.donorName || !form.amount) {
      alert("Please fill in the Receipt Number, Donor Name, and Amount.");
      return;
    }
    
    const numericAmount = parseFloat(form.amount) || 0;

    const reg80g = creds.find(c => c.key === "reg80g") || {};
    const reg12a = creds.find(c => c.key === "reg12a") || {};
    const trust = creds.find(c => c.key === "trust") || {};
    const pan = creds.find(c => c.key === "pan") || {};
    const csr = creds.find(c => c.key === "csr") || {};

    const finalReceipt = {
      ...form,
      amount: numericAmount,
      amountInWords: amtWordsIndian(numericAmount),
      reg80gVal: reg80g.val || "",
      reg80gFrom: reg80g.from || "",
      reg80gTo: reg80g.to || "",
      reg12aVal: reg12a.val || "",
      reg12aFrom: reg12a.from || "",
      reg12aTo: reg12a.to || "",
      cinVal: trust.val || "",
      panVal: pan.val || "",
      csrVal: csr.val || "",
    };
    
    onSave(finalReceipt);
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: "2rem" }}>
      
      {/* LEFT FORM */}
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* SECTION 1: DOCUMENT METADATA */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--color-border)" }}>
          <div className="section-title" style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--color-text-main)" }}>
            📌 Receipt Registry & Metadata
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>Receipt No</label>
              <input
                type="text"
                placeholder="e.g. SSF/REC/2026/012"
                value={form.receiptNo}
                onChange={(e) => setForm(f => ({ ...f, receiptNo: e.target.value }))}
                style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "0.85rem" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>Tax Year</label>
              <input
                type="text"
                placeholder="e.g. 2026-27"
                value={form.taxYear || ""}
                onChange={(e) => setForm(f => ({ ...f, taxYear: e.target.value }))}
                style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "0.85rem" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>Dated</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "0.85rem" }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: DONOR DIRECTORY DETAILS */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--color-border)" }}>
          <div className="section-title" style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--color-text-main)" }}>
            🤝 Donor Directory Details
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>Received with thanks from</label>
              <input
                type="text"
                placeholder="e.g. Genpact India Private Limited"
                value={form.donorName}
                onChange={(e) => setForm(f => ({ ...f, donorName: e.target.value }))}
                style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "0.85rem" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>PAN</label>
                <input
                  type="text"
                  placeholder="e.g. AABCE4461B"
                  value={form.donorPan}
                  onChange={(e) => setForm(f => ({ ...f, donorPan: e.target.value.toUpperCase() }))}
                  maxLength={10}
                  style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "0.85rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>Towards</label>
                <input
                  type="text"
                  value={form.towards}
                  onChange={(e) => setForm(f => ({ ...f, towards: e.target.value }))}
                  style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "0.85rem" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>Email ID</label>
                <input
                  type="email"
                  placeholder="donor@company.com"
                  value={form.donorEmail}
                  onChange={(e) => setForm(f => ({ ...f, donorEmail: e.target.value }))}
                  style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "0.85rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>Contact No.</label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.donorPhone}
                  onChange={(e) => setForm(f => ({ ...f, donorPhone: e.target.value }))}
                  style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "0.85rem" }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>Address</label>
              <textarea
                placeholder="Full billing address..."
                rows={2}
                value={form.donorAddress}
                onChange={(e) => setForm(f => ({ ...f, donorAddress: e.target.value }))}
                style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "0.85rem", resize: "none" }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: TRANSACTION DETAILS */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--color-border)" }}>
          <div className="section-title" style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--color-text-main)" }}>
            💳 Transaction Details
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>Mode of Payment</label>
              <input
                type="text"
                placeholder="e.g. Electronic modes including account payee cheque/draft"
                value={form.modeOfPayment}
                onChange={(e) => setForm(f => ({ ...f, modeOfPayment: e.target.value }))}
                style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "0.85rem" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>Bank Transaction Reference</label>
              <textarea
                placeholder="e.g. RTGS CR-HSBC0110002..."
                rows={2}
                value={form.notes}
                onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                style={{ width: "100%", padding: "0.55rem 0.8rem", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "0.85rem", resize: "none" }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: DONATION VALUE */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--color-border)" }}>
          <div className="section-title" style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--color-text-main)" }}>
            💰 Donation Value
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>The sum of ₹</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontWeight: "700", fontSize: "0.95rem" }}>₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))}
                style={{ width: "100%", padding: "0.55rem 0.8rem 0.55rem 2rem", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "700" }}
              />
            </div>
            {form.amount && (
              <div style={{ background: "#F0FDF4", color: "#15803D", padding: "0.75rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "600", marginTop: "0.75rem" }}>
                ✍️ {amtWordsIndian(parseFloat(form.amount) || 0)}
              </div>
            )}
          </div>
        </div>

        {/* CONTROLS */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button type="submit" className="btn-p" style={{ flex: 1, padding: "0.8rem" }}>
            {editingReceipt ? "💾 Update & Log Receipt" : "＋ Generate & Log Receipt"}
          </button>
          <button type="button" className="btn-p" style={{ background: "#F1F5F9", color: "#475569", border: "1px solid #CBD5E1", flex: 0.4, padding: "0.8rem" }} onClick={onCancel}>
            Cancel
          </button>
        </div>

      </form>

      {/* RIGHT PRESETS & TRUSTEE PANEL */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* NGO SANJHI SIKHIYA DETAILS */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "0.8rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🏢</span>
            <div>
              <div style={{ fontWeight: "800", fontSize: "0.95rem", color: "var(--color-text-main)" }}>Sanjhi Sikhiya Foundation</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Fixed Entity Registry (Punjab)</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.78rem", borderTop: "1px solid var(--color-border)", paddingTop: "0.75rem", color: "var(--color-text-sub)" }}>
            <div>📍 <b>HQ Address:</b> Sector 72 SAS Nagar, Mohali, Punjab</div>
            <div>🏢 <b>CIN Number:</b> U80900PB2018NPL048338</div>
            <div>🏦 <b>HDFC Bank A/c:</b> 50100274224722 (Jalandhar Branch)</div>
            <div>💳 <b>IFSC Code:</b> HDFC0000340</div>
          </div>
        </div>

        {/* NGO REGULATORY CREDENTIALS */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--color-border)" }}>
          <div className="section-title" style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "0.5rem", color: "var(--color-text-main)" }}>
            🛡️ NGO Regulatory Credentials
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: "0 0 1rem 0" }}>
            Configure trust credentials. Values are permanently fixed in key structure and saved automatically to generated receipts.
          </p>

          <div style={{ overflowX: "auto", border: "1px solid var(--color-border)", borderRadius: "12px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.78rem" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--color-border)" }}>
                  <th style={{ padding: "0.6rem 0.8rem", fontWeight: "700", color: "#475569", width: "35%" }}>Key (Fixed)</th>
                  <th style={{ padding: "0.6rem 0.8rem", fontWeight: "700", color: "#475569", width: "65%" }}>Value / Details</th>
                </tr>
              </thead>
              <tbody>
                {creds.map((c, i) => (
                  <tr key={c.key} style={{ borderBottom: i < creds.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                    <td style={{ padding: "0.65rem 0.8rem", fontWeight: "700", color: "var(--color-text-main)" }}>
                      {c.label}
                    </td>
                    <td style={{ padding: "0.6rem 0.8rem" }}>
                      <input
                        type="text"
                        value={c.val || ""}
                        onChange={(e) => handleCredValueChange(i, "val", e.target.value)}
                        placeholder="Registration Details"
                        style={{ width: "100%", padding: "0.4rem 0.6rem", border: "1px solid var(--color-border)", borderRadius: "6px", fontSize: "0.78rem", fontFamily: "monospace", fontWeight: "600", background: "#f8fafc", color: "#0F766E" }}
                      />
                      {i < 2 && (
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.5rem" }}>
                          <span style={{ fontSize: "0.72rem", fontWeight: "600", color: "var(--muted)" }}>From</span>
                          <input
                            type="text"
                            value={c.from || ""}
                            onChange={(e) => handleCredValueChange(i, "from", e.target.value)}
                            placeholder="e.g. AY 2022-23"
                            style={{ width: "40%", padding: "0.3rem 0.5rem", border: "1px solid var(--color-border)", borderRadius: "6px", fontSize: "0.74rem", fontFamily: "monospace", fontWeight: "600", background: "#f8fafc", color: "#0F766E" }}
                          />
                          <span style={{ fontSize: "0.72rem", fontWeight: "600", color: "var(--muted)", marginLeft: "0.5rem" }}>To</span>
                          <input
                            type="text"
                            value={c.to || ""}
                            onChange={(e) => handleCredValueChange(i, "to", e.target.value)}
                            placeholder="e.g. AY 2026-27"
                            style={{ width: "40%", padding: "0.3rem 0.5rem", border: "1px solid var(--color-border)", borderRadius: "6px", fontSize: "0.74rem", fontFamily: "monospace", fontWeight: "600", background: "#f8fafc", color: "#0F766E" }}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>

      </div>

      {/* ── ACTION BAR ── */}
      <div className="form-action-bar" style={{ marginTop: "2rem" }}>
        <button className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-gen" onClick={handleSave}>
          ✓ {editingReceipt ? "Update Receipt" : "Generate Receipt"}
        </button>
      </div>

    </>
  );
}
