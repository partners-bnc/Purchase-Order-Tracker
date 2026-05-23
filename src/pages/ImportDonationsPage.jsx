import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { amtWordsIndian } from "../utils/numberToWords";

/* Download dynamic Excel/CSV bulk import sheet */
function downloadTemplate() {
  const headers = [
    "Receipt Number",
    "Date",
    "Donor Name",
    "Donor PAN",
    "Towards",
    "Amount (INR)",
    "Email",
    "Phone",
    "Address"
  ];
  
  const sampleRow1 = [
    "SSF/REC/2026/0101",
    "2026-05-23",
    "Genpact India Private Limited",
    "AABCE4461B",
    "CSR Educational Support",
    "1500000",
    "csr@genpact.com",
    "+91 9876543210",
    "Sector 54, DLF Phase 5, Gurugram, Haryana"
  ];

  const sampleRow2 = [
    "SSF/REC/2026/0102",
    "2026-05-24",
    "Anshuman Sharma",
    "CKKPS2204R",
    "General Charitable Pool",
    "75000",
    "anshuman@gmail.com",
    "",
    "Mohali, Punjab"
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow1, sampleRow2]);
  ws["!cols"] = [
    { wch: 22 }, // Receipt Number
    { wch: 14 }, // Date
    { wch: 32 }, // Donor Name
    { wch: 15 }, // Donor PAN
    { wch: 25 }, // Towards
    { wch: 15 }, // Amount (INR)
    { wch: 22 }, // Email
    { wch: 16 }, // Phone
    { wch: 45 }  // Address
  ];
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Donations");
  XLSX.writeFile(wb, "SSF_Donation_Import_Template.xlsx");
}

export default function ImportDonationsPage({ onImport }) {
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    if (!name.endsWith(".xlsx") && !name.endsWith(".xls") && !name.endsWith(".csv")) {
      alert("Please upload a valid .xlsx, .xls or .csv file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array", raw: false });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        
        if (rows.length < 2) {
          alert("Your sheet seems to be empty or missing headers.");
          return;
        }

        const importedReceipts = [];
        // Start from index 1 to skip header row
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const recNo = String(row[0] ?? "").trim();
          const name = String(row[2] ?? "").trim();
          const amountVal = parseFloat(row[5]) || 0;

          // Skip completely empty rows
          if (!recNo && !name && amountVal === 0) continue;

          if (!recNo || !name || amountVal <= 0) {
            console.warn(`Row ${i + 1} skipped due to missing required receipt, name, or valid amount.`);
            continue;
          }

          importedReceipts.push({
            receiptNo: recNo,
            date: String(row[1] ?? "").trim() || new Date().toISOString().split("T")[0],
            donorName: name,
            donorPan: String(row[3] ?? "").trim().toUpperCase(),
            towards: String(row[4] ?? "").trim() || "General Support",
            amount: amountVal,
            amountInWords: amtWordsIndian(amountVal),
            donorEmail: String(row[6] ?? "").trim(),
            donorPhone: String(row[7] ?? "").trim(),
            donorAddress: String(row[8] ?? "").trim()
          });
        }

        if (importedReceipts.length === 0) {
          alert("No valid donation receipt rows were detected in the uploaded file.");
          return;
        }

        onImport(importedReceipts);
        alert(`Successfully imported ${importedReceipts.length} donation receipt(s)!`);
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
        <div className="import-ic">📊</div>
        <div className="import-t">Drop your excel sheet here to bulk import donations</div>
        <div className="import-d">Supports .xlsx, .xls and .csv</div>
        <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
        <button className="btn-p" style={{ marginTop: "1.25rem", background: "var(--teal-d)" }} onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}>
          Browse File
        </button>
      </div>

      <div className="import-instructions">
        <div className="import-inst-hd" style={{ color: "var(--teal-d)" }}>💡 Excel Bulk Import Instructions</div>
        {[
          "Download the official Donation Excel/CSV template below.",
          "Ensure headers are present: Receipt Number, Date, Donor Name, Donor PAN, Towards, Amount (INR), Email, Phone, Address.",
          "Fill as many donation rows as you want — all rows are fully validated and registered.",
          "Amount fields are calculated into Indian word formatting automatically upon import.",
          "Drop or select the file here to register all transactions instantly into your cloud database."
        ].map((s, i) => (
          <div className="import-step" key={i}>
            <div className="import-step-n" style={{ background: "var(--teal-l)", color: "var(--teal-d)" }}>{i + 1}</div>
            <div>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <button className="btn-p" style={{ background: "#4f46e5", border: "none" }} onClick={downloadTemplate}>
          ⬇ Download Import Template (.xlsx)
        </button>
      </div>
    </div>
  );
}
