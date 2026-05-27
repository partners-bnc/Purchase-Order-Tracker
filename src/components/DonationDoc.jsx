import React from "react";

export default function DonationDoc({ receipt, id = "donation-document" }) {
  if (!receipt) return null;

  /* ── credentials ── */
  const savedCreds = localStorage.getItem("ssf_credentials_grid");
  let creds = savedCreds ? JSON.parse(savedCreds) : [
    { key: "reg80g",   label: "80G Registration No.", val: "ABACS7907E25CD02 Dated 20-01-2026" },
    { key: "reg12a",   label: "12AB Registration No.",        val: "ABACS7907E25CD01 Dated 20-01-2026" },
    { key: "trust",    label: "CIN",                  val: "U80900PB2018NPL048338" },
    { key: "pan",      label: "PAN",                  val: "ABACS7907E" },
    { key: "csr",      label: "CSR 1 Registration No.",       val: "CSR00015126" }
  ];
  creds = creds.map(c => {
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
  const getCredVal = (key, def = "") => {
    if (key === "reg80g" && receipt.reg80gVal) return receipt.reg80gVal;
    if (key === "reg12a" && receipt.reg12aVal) return receipt.reg12aVal;
    if (key === "trust" && receipt.cinVal) return receipt.cinVal;
    if (key === "pan" && receipt.panVal) return receipt.panVal;
    if (key === "csr" && receipt.csrVal) return receipt.csrVal;
    return (creds.find(c => c.key === key) || { val: def }).val;
  };
  const getCredField = (key, field, def = "") => {
    if (key === "reg80g" && field === "from" && receipt.reg80gFrom) return receipt.reg80gFrom;
    if (key === "reg80g" && field === "to" && receipt.reg80gTo) return receipt.reg80gTo;
    if (key === "reg12a" && field === "from" && receipt.reg12aFrom) return receipt.reg12aFrom;
    if (key === "reg12a" && field === "to" && receipt.reg12aTo) return receipt.reg12aTo;
    return (creds.find(c => c.key === key) || {})[field] || def;
  };

  /* ── date formatter: YYYY-MM-DD → DD-MM-YYYY ── */
  const formatDate = (raw) => {
    if (!raw) return "";
    const p = raw.split("-");
    if (p.length === 3) return `${p[2]}-${p[1]}-${p[0]}`;
    return raw;
  };

  const rNo      = receipt.receiptNo    || "SSF/DR/2026-27/001";
  const rDate    = formatDate(receipt.date);
  const rTaxYear = receipt.taxYear      || "2026-27";
  const dName    = receipt.donorName    || "N/A";
  const dAddress = receipt.donorAddress || "N/A";
  const dPan     = receipt.donorPan     || "N/A";
  const dTowards = receipt.towards      || "Specific Grants";
  const dAmount  = parseFloat(receipt.amount || 0);
  const dWords   = receipt.amountInWords || "";
  const dMode    = receipt.modeOfPayment || "Electronic modes including account payee cheque / draft";
  const dNotes   = receipt.notes        || "";

  /* ─── Row helper: label is fixed width (flexShrink:0), value wraps freely on its own side ─── */
  const LBL_W = "195px";

  const Row = ({ label, children, borderTop = false }) => (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "8px",
      ...(borderTop ? { borderTop: "1px solid #cbd5e1", paddingTop: "7px", marginTop: "2px" } : {}),
    }}>
      <span style={{
        fontWeight: "700",
        color: "#374151",
        width: LBL_W,
        minWidth: LBL_W,
        flexShrink: 0,           /* ← key: label never shrinks, value wraps on its own side */
        fontSize: "0.82rem",
        lineHeight: "1.5",
      }}>
        {label}
      </span>
      <span style={{ color: "#1e293b", fontSize: "0.82rem", lineHeight: "1.5", flex: 1 }}>
        {children}
      </span>
    </div>
  );

  /* ── credential rows for the PDF table ── */
  const credRows = [
    ["80G Registration No.",
      <>
        {getCredVal("reg80g", "ABACS7907E25CD02 Dated 20-01-2026")}
        <br />
        <span style={{ color: "#64748b", fontSize: "0.6rem" }}>
          Valid from {getCredField("reg80g", "from", "AY 2027-28")} to {getCredField("reg80g", "to", "AY 2031-32")}
        </span>
      </>
    ],
    ["12AB Registration No.",
      <>
        {getCredVal("reg12a", "ABACS7907E25CD01 Dated 20-01-2026")}
        <br />
        <span style={{ color: "#64748b", fontSize: "0.6rem" }}>
          Valid from {getCredField("reg12a", "from", "AY 2027-28")} to {getCredField("reg12a", "to", "AY 2036-37")}
        </span>
      </>
    ],
    ["CIN", getCredVal("trust", "U80900PB2018NPL048338")],
    ["PAN", getCredVal("pan", "ABACS7907E")],
    ["CSR 1 Registration No.", getCredVal("csr", "CSR00015126")],
  ];

  return (
    <div
      className="po-doc donation-print-doc"
      id={id}
    style={{
      fontFamily: "'Outfit', 'Inter', 'Segoe UI', sans-serif",
      background: "#ffffff",
      color: "#1e293b",
      border: "1px solid #cbd5e1",
      width: "100%",
      maxWidth: "800px",
      margin: "0 auto",
      boxShadow: "none",
      lineHeight: "1.5",
      display: "flex",
      flexDirection: "column",
        padding: "14px 36px 14px",
    }}
    >

      {/* ══════ HEADER ══════ */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center", borderBottom: "3px solid #DAA32E", paddingBottom: "14px", marginBottom: "14px" }}>
        <div style={{ flexShrink: 0 }}>
          <img src="logo.png" alt="SSF Logo"
             style={{ height: "90px", width: "auto", objectFit: "contain" }}
             onError={e => { e.target.style.display = "none"; }} />
        </div>
        <div style={{ paddingLeft: "10px" }}>
          <h1 style={{
             margin: 0, fontSize: "1.75rem", fontWeight: "500", color: "#DAA32E",
             letterSpacing: "0.5px", lineHeight: 1.15, textTransform: "uppercase",
           }}>
             SANJHI SIKHIYA FOUNDATION
          </h1>
             <div style={{ fontSize: "0.80rem", color: "#4b5563", marginTop: "4px", lineHeight: "1.45", fontWeight: "500" }}>
             E-37, Aadh Towers, Sector 72, Phase 8, SAS Nagar, Punjab - 160071<br />
             <b>E-Mail:</b> team@sanjhisikhiya.org&nbsp;&nbsp;|&nbsp;&nbsp;<b>Phone:</b> ‪+91 9873038364
             </div>
        </div>
      </div>
 
      {/* ══════ TITLE ══════ */}
      <div style={{ textAlign: "center", marginBottom: "14px" }}>
        <h2 style={{
           margin: 0, fontSize: "1.45rem", fontWeight: "500", color: "#DAA32E",
           textTransform: "uppercase", letterSpacing: "3px",
         }}>
           DONATION RECEIPT
        </h2>
      </div>
 
      {/* ══════ DONOR DETAILS BLOCK ══════ */}
      <div style={{ border: "1.5px solid #cbd5e1", borderRadius: "8px", padding: "10px 16px", marginBottom: "12px" }}>
 
        {/* Receipt No / Tax Year / Date */}
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #cbd5e1", paddingBottom: "6px", marginBottom: "8px" }}>
          <div>
            <span style={{ fontWeight: "700", color: "#374151", fontSize: "0.77rem" }}>Receipt No : </span>
            <span style={{ fontFamily: "monospace", fontWeight: "800", fontSize: "0.84rem", color: "#DAA32E" }}>{rNo}</span>
          </div>
          <div>
            <span style={{ fontWeight: "700", color: "#374151", fontSize: "0.77rem" }}>Tax Year : </span>
            <span style={{ fontWeight: "800", color: "#DAA32E", fontSize: "0.77rem" }}>{rTaxYear}</span>
          </div>
          <div>
            <span style={{ fontWeight: "700", color: "#374151", fontSize: "0.77rem" }}>Dated : </span>
            <span style={{ fontWeight: "800", color: "#1e293b", fontSize: "0.77rem" }}>{rDate}</span>
          </div>
        </div>
 
        {/* All detail rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
 
          <Row label="Received with thanks from :">
            <span style={{ fontWeight: "800", color: "#DAA32E", fontSize: "0.9rem" }}>{dName}</span>
          </Row>

          {/* Address — value wraps only on value side */}
          <Row label="Address :">
            {dAddress}
          </Row>

          <Row label="PAN :">
            <span style={{ fontWeight: "800", fontFamily: "monospace", color: "#1e293b", fontSize: "0.86rem" }}>{dPan}</span>
          </Row>

          <Row label="Contact No. :">
            {receipt.donorPhone || "N/A"}
          </Row>

          <Row label="Email ID :">
            <span style={{ fontWeight: "700" }}>{receipt.donorEmail || "N/A"}</span>
          </Row>

          <Row label="The sum of ₹ :">
            <span style={{ fontWeight: "900", color: "#DAA32E", fontSize: "1rem" }}>
              {dAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </Row>

          <Row label="In words :">
            <span style={{ fontWeight: "800", color: "#DAA32E", fontStyle: "italic" }}>{dWords}</span>
          </Row>

          <Row label="Towards :">
            <span style={{ fontWeight: "700" }}>{dTowards}</span>
          </Row>

          <Row label="Mode of Payment :">
            {dMode}
          </Row>



          {dNotes && (
            <Row label="Bank Transaction Reference :">
              <span style={{ fontSize: "0.72rem", fontFamily: "monospace", background: "#f8fafc", padding: "3px 8px", borderRadius: "5px", border: "1px solid #cbd5e1", display: "inline-block", color: "#475569" }}>
                {dNotes}
              </span>
            </Row>
          )}

        </div>
      </div>

      {/* ══════ BOTTOM SECTION — 2-col table row + full-width notes + signature below ══════ */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px" }}>

        {/* Headings — side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "14px" }}>
          <div style={{ fontSize: "0.79rem", fontWeight: "800", color: "#DAA32E", letterSpacing: "0.4px", paddingTop: "4px" }}>Registration Details</div>
          <div style={{ fontSize: "0.79rem", fontWeight: "800", color: "#DAA32E", letterSpacing: "0.4px", paddingTop: "4px" }}>Bank Account Details</div>
        </div>

        {/* Content — table | bank card, side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "14px" }}>

          {/* Registration Details table */}
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1.5px solid #94a3b8", fontSize: "0.66rem" }}>
            <tbody>
              {credRows.map(([label, val]) => (
                <tr key={label}>
                  <td style={{ padding: "3px 6px", border: "1px solid #cbd5e1", fontWeight: "700", background: "#f8fafc", color: "#374151", width: "43%" }}>{label}</td>
                  <td style={{ padding: "3px 6px", border: "1px solid #cbd5e1", fontWeight: "600", color: "#1e293b", whiteSpace: "nowrap" }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bank Account Details */}
          <div style={{ fontSize: "0.72rem", color: "#334155", lineHeight: "1.6", background: "#f8fafc", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
            <b>Bank Name :</b> HDFC Bank Ltd.<br />
            <b>Account No. :</b> 50100274224722<br />
            <b>Branch :</b> HDFC Bank, Jalandhar Main Branch,<br />
            <span style={{ paddingLeft: "46px" }}>Model Town, Jalandhar - 144001, Punjab</span><br />
            <b>IFSC Code :</b> HDFC0000340
          </div>

        </div>

        {/* Terms & Conditions — full-width below table + bank card, two-column table-style layout */}
        <div style={{ marginTop: "2px", paddingTop: "6px" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "#374151", letterSpacing: "0.3px" }}>Terms & Conditions :</span>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "3px", fontSize: "0.64rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "1px 4px", verticalAlign: "top", color: "#64748b", whiteSpace: "nowrap", fontWeight: "700", width: "22px" }}>1).</td>
                <td style={{ padding: "1px 4px", verticalAlign: "top", color: "#64748b", lineHeight: "1.5" }}>
                  Form 10BE shall be issued upon filing of Form 10BD with the Income Tax Department.
                </td>
              </tr>
              <tr>
                <td style={{ padding: "1px 4px", verticalAlign: "top", color: "#64748b", whiteSpace: "nowrap", fontWeight: "700", width: "22px" }}>2).</td>
                <td style={{ padding: "1px 4px", verticalAlign: "top", color: "#64748b", lineHeight: "1.5" }}>
                  Donation received is eligible for deduction under Section 133 of the Income-tax Act, 2025 (corresponding to erstwhile Section 80G of the Income-tax Act, 1961), subject to applicable provisions of law.
                </td>
              </tr>
              <tr>
                <td style={{ padding: "1px 4px", verticalAlign: "top", color: "#64748b", whiteSpace: "nowrap", fontWeight: "700", width: "22px" }}>3).</td>
                <td style={{ padding: "1px 4px", verticalAlign: "top", color: "#64748b", lineHeight: "1.5" }}>
                  This receipt shall be valid subject to realization of the donated funds.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature — at the very bottom, left-aligned */}
        <div style={{ display: "flex", flexDirection: "column", paddingTop: "4px" }}>
          <div style={{ fontSize: "0.76rem", fontWeight: "800", color: "#DAA32E", marginBottom: "4px" }}>For Sanjhi Sikhiya Foundation</div>
          <div style={{ height: "60px", width: "200px" }}></div>
          <div style={{ height: "2px", background: "#000000", width: "200px" }}></div>
          <div style={{ fontSize: "0.68rem", color: "#64748b", marginTop: "4px", fontWeight: "700" }}>Simranpreet Singh Oberoi</div>
          <div style={{ fontSize: "0.63rem", color: "#64748b", marginTop: "2px", fontWeight: "500" }}>Co-Founder & CEO</div>
          <div style={{ fontSize: "0.63rem", color: "#64748b", marginTop: "2px", fontWeight: "500" }}>Authorized Signatory</div>
        </div>

      </div>
      {/* ══════ FOOTER ══════ */}
      <div style={{
        textAlign: "center",
        borderTop: "1px solid #cbd5e1",
        paddingTop: "7px",
        marginTop: "14px",
        fontSize: "0.64rem",
        color: "#64748b",
        fontWeight: "600",
        letterSpacing: "0.5px",
        pageBreakBefore: "avoid",
        breakBefore: "avoid",
      }}>
        This is a computer-generated receipt and does not require a physical signature. Thank you for your generous contribution.
      </div>

    </div>
  );
}
