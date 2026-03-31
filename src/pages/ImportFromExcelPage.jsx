import React, { useRef } from "react";
import * as XLSX from "xlsx";

/* ── Download template matching the exact layout the parser reads ── */
function downloadTemplate() {
  const rows = [
    ["PURCHASE ORDER", "", "", "", "", "", "", ""],
    ["Voucher No", "MB/25-26/67", "", "Date", "01-Apr-26", "Currency", "USD", ""],
    ["Reference No & Date", "MB/25-26/67", "", "Other References", "Na", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["INVOICE TO", "", "", "", "", "", "", ""],
    ["Company", "Medivation Bio Private Limited", "", "", "", "", "", ""],
    ["Address", "SIDCO Industrial Estate Lane, SIDCO Industrial Complex, Bari Brahmana EPIP, Samba, Jammu", "", "", "", "", "", ""],
    ["GSTIN", "01AAPCM3823P1Z5", "", "", "", "", "", ""],
    ["State", "Jammu and Kashmir", "", "Code", "", "1", "", ""],
    ["CIN", "U33119DL2022PTC392696", "", "", "", "", "", ""],
    ["PAN", "AAPCM3823P", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["CONSIGNEE", "", "", "", "", "", "", ""],
    ["Company", "Medivation Bio Private Limited", "", "", "", "", "", ""],
    ["Address", "SIDCO Industrial Estate Lane, SIDCO Industrial Complex, Bari Brahmana EPIP, Samba, Jammu", "", "", "", "", "", ""],
    ["GSTIN", "01AAPCM3823P1Z5", "", "", "", "", "", ""],
    ["State", "Jammu and Kashmir", "", "Code", "", "1", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["SUPPLIER", "", "", "", "", "", "", ""],
    ["Company", "JIANGYIN HONGMENG RUBBER PLASTIC PRODUCT CO., LTD", "", "", "", "", "", ""],
    ["Address", "NO.166, HETUN ROAD, LIGANG TOWN, JIANGYIN CITY, JIANGSU, CHINA.", "", "", "", "", "", ""],
    ["Mobile", "+86 133611660522", "", "", "", "", "", ""],
    ["Email", "hyyeon@jiangyinhongmeng.com", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["LOGISTICS", "", "", "", "", "", "", ""],
    ["Dispatched Through", "", "", "", "", "", "", ""],
    ["Destination", "", "", "", "", "", "", ""],
    ["Terms of Delivery", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["S.No.", "Description", "HSN Code", "Due On", "Quantity", "Unit Price", "Unit", "Amount"],
    ["1", "BCT Rubber Stopper Open Type 13-1F (HSN Code- 4016 9990.90)", "4016 9990.90", "30th May 2026", "10500000", "0.00435", "Nos", "45675"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "GRAND TOTAL", "", "45675"],
    ["Amount in Words", "Forty Five Thousand Six Hundred Seventy Five Dollars Only", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["TERMS & CONDITIONS", "", "", "", "", "", "", ""],
    ["1", "GST Extra as applicable", "", "", "", "", "", ""],
    ["2", "Price is firm and fixed till delivery.", "", "", "", "", "", ""],
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 22 }, { wch: 55 }, { wch: 18 }, { wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 14 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "PO_Template.xlsx");
}

/* ── Parser matching the exact layout ── */
function parseRows(rows) {
  const form = {};
  const items = [];
  const tc = [];
  let section = "";
  let itemsStarted = false;
  let tcStarted = false;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const A = String(row[0] ?? "").trim();
    const B = String(row[1] ?? "").trim();
    const C = String(row[2] ?? "").trim();
    const D = String(row[3] ?? "").trim();
    const E = String(row[4] ?? "").trim();
    const F = String(row[5] ?? "").trim();
    const G = String(row[6] ?? "").trim();

    if (!A && !B) continue;

    const AU = A.toUpperCase();

    // Section headers
    if (AU === "PURCHASE ORDER") continue;
    if (AU === "INVOICE TO")   { section = "invoice"; continue; }
    if (AU === "CONSIGNEE")    { section = "consignee"; continue; }
    if (AU === "SUPPLIER")     { section = "supplier"; continue; }
    if (AU === "LOGISTICS")    { section = "logistics"; continue; }
    if (AU === "TERMS & CONDITIONS" || AU === "TERMS AND CONDITIONS") { tcStarted = true; section = "tc"; continue; }
    if (AU === "AMOUNT IN WORDS") continue;
    if (AU === "S.NO.")        { itemsStarted = true; section = "items"; continue; }

    // Row 2: Voucher No | value | | Date | value | Currency | value
    if (AU === "VOUCHER NO") {
      form.voucherNo = B;
      form.date = E;
      form.currency = G || F;
      continue;
    }

    // Row 3: Reference No & Date | value | | Other References | value
    if (AU === "REFERENCE NO & DATE" || AU === "REFERENCE NO. & DATE" || AU === "REFERENCE NO & DATE") {
      form.refNo = B;
      form.otherRef = E || D;
      continue;
    }

    if (section === "invoice") {
      if (AU === "COMPANY")      form.invoiceName = B;
      else if (AU === "ADDRESS") form.invoiceAddress = B;
      else if (AU === "GSTIN")   form.invoiceGstin = B;
      else if (AU === "STATE")   { form.invoiceState = B; form.invoiceStateCode = F || E; }
      else if (AU === "CIN")     form.invoiceCin = B;
      else if (AU === "PAN")     form.pan = B;
    } else if (section === "consignee") {
      if (AU === "COMPANY")      form.consigneeName = B;
      else if (AU === "ADDRESS") form.consigneeAddress = B;
      else if (AU === "GSTIN")   form.consigneeGstin = B;
      else if (AU === "STATE")   { form.consigneeState = B; form.consigneeStateCode = F || E; }
    } else if (section === "supplier") {
      if (AU === "COMPANY")      form.supplierName = B;
      else if (AU === "ADDRESS") form.supplierAddress = B;
      else if (AU === "MOBILE")  form.supplierMob = B;
      else if (AU === "EMAIL")   form.supplierEmail = B;
      else if (AU === "SIGNATORY COMPANY") form.signatoryCompany = B;
    } else if (section === "logistics") {
      if (AU === "DISPATCHED THROUGH") form.dispatchedThrough = B;
      else if (AU === "DESTINATION")   form.destination = B;
      else if (AU === "TERMS OF DELIVERY") form.termsOfDelivery = B;
    } else if (section === "items") {
      // Skip grand total row
      if (AU === "" && F.toUpperCase().includes("GRAND")) continue;
      // Item row: S.No in A (number), Description in B
      const sno = A;
      const desc = B;
      if (!desc || isNaN(parseFloat(sno)) === false && !desc) continue;
      if (desc && !D.toUpperCase().includes("GRAND")) {
        const hsn   = C;
        const dueOn = D;
        const qty   = E;
        const price = F;
        const unit  = G || "Nos";
        const q = parseFloat(qty) || 0;
        const p = parseFloat(price) || 0;
        items.push({
          id: Date.now() + Math.random(),
          description: desc, hsn, dueOn,
          quantity: qty, unitPrice: price,
          unit, amount: (q * p).toFixed(2),
        });
      }
    } else if (section === "tc") {
      // TC rows: number in A, text in B
      if (B) tc.push(B);
    }
  }

  // Fallback signatory
  if (!form.signatoryCompany) form.signatoryCompany = form.invoiceName || "";

  return { form, items, tc };
}

export default function ImportFromExcelPage({ onImport }) {
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    if (!name.endsWith(".xlsx") && !name.endsWith(".xls") && !name.endsWith(".csv")) {
      alert("Please upload a .xlsx, .xls or .csv file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array", raw: false });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        const { form, items, tc } = parseRows(rows);
        if (!form.voucherNo && !form.invoiceName) {
          alert("Could not read data. Make sure your file matches the template layout.");
          return;
        }
        onImport(form, items, tc);
      } catch (err) {
        alert("Error reading file: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="import-wrap">
      <div
        className="import-zone"
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("drag"); }}
        onDragLeave={(e) => e.currentTarget.classList.remove("drag")}
        onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("drag"); handleFile(e.dataTransfer.files[0]); }}
      >
        <div className="import-ic">📁</div>
        <div className="import-t">Drop your Excel or CSV file here</div>
        <div className="import-d">Supports .xlsx, .xls and .csv</div>
        <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
        <button className="btn-p" style={{ marginTop: "1.25rem" }} onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}>
          Browse File
        </button>
      </div>

      <div className="import-instructions">
        <div className="import-inst-hd">How to import</div>
        {[
          "Download the Excel template below",
          "Fill in your data — keep the same row/column structure",
          "Voucher No, Date, Currency on row 2 — Reference on row 3",
          "Items go after the S.No. header row (col A=S.No, B=Description, C=HSN, D=Due On, E=Qty, F=Unit Price, G=Unit)",
          "Terms & Conditions: number in col A, text in col B under TERMS & CONDITIONS",
          "Upload here — all fields auto-fill instantly",
        ].map((s, i) => (
          <div className="import-step" key={i}>
            <div className="import-step-n">{i + 1}</div>
            <div>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <button className="btn-p" onClick={downloadTemplate}>⬇ Download Excel Template</button>
      </div>
    </div>
  );
}
