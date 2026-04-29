import React from "react";

const UNITS = ["NOS", "PCS", "KGS", "MTR", "LTR", "BOX", "BAG", "BTL", "CTN", "PKG", "SET", "GM"];

export default function CreatePurchaseOrderPage({
  form, items, tc, gt, amtWords,
  setForm, setItems, setTc, updateItem, resetForm, handleSaveAndGenerate, editingId,
}) {
  const sf = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="form-wrap">
      <div className="sec-card">
        <div className="sec-hd"><div className="sec-num">1</div><div className="sec-lbl">Purchase Order Header</div></div>
        <div className="grid3">
          <div className="ff"><label>Voucher No</label><input value={form.voucherNo} onChange={sf("voucherNo")} placeholder="MB/25-26/66" /></div>
          <div className="ff"><label>Date</label><input value={form.date} onChange={sf("date")} placeholder="30-Mar-26" /></div>
          <div className="ff"><label>Currency</label><select value={form.currency} onChange={sf("currency")}><option>USD</option><option>INR</option><option>EUR</option><option>GBP</option></select></div>
          <div className="ff"><label>Reference No.</label><input value={form.refNo} onChange={sf("refNo")} placeholder="MB/25-26/66" /></div>
          <div className="ff"><label>Reference Date</label><input value={form.refDate} onChange={sf("refDate")} placeholder="30 March" /></div>
          <div className="ff"><label>Other References</label><input value={form.otherRef} onChange={sf("otherRef")} placeholder="e.g. anshu" /></div>
          <div className="ff"><label>Dispatched Through</label><input value={form.dispatchedThrough} onChange={sf("dispatchedThrough")} placeholder="Road / Air / Sea" /></div>
          <div className="ff"><label>Destination</label><input value={form.destination} onChange={sf("destination")} placeholder="Kolkata" /></div>
          <div className="ff"><label>Terms of Delivery</label><input value={form.termsOfDelivery} onChange={sf("termsOfDelivery")} placeholder="FOB / CIF / DDP" /></div>
        </div>
      </div>

      <div className="sec-card">
        <div className="sec-hd"><div className="sec-num">2</div><div className="sec-lbl">Invoice To</div></div>
        <div className="grid2">
          <div className="ff"><label>Company Name</label><input value={form.invoiceName} onChange={sf("invoiceName")} /></div>
          <div className="ff"><label>GSTIN / UIN</label><input value={form.invoiceGstin} onChange={sf("invoiceGstin")} /></div>
          <div className="ff" style={{ gridColumn: "1/-1" }}><label>Address</label><textarea value={form.invoiceAddress} onChange={sf("invoiceAddress")} rows={3} /></div>
          <div className="ff"><label>State Name</label><input value={form.invoiceState} onChange={sf("invoiceState")} /></div>
          <div className="ff"><label>State Code</label><input value={form.invoiceStateCode} onChange={sf("invoiceStateCode")} /></div>
          <div className="ff"><label>CIN (optional)</label><input value={form.invoiceCin} onChange={sf("invoiceCin")} /></div>
          <div className="ff"><label>Company PAN</label><input value={form.pan} onChange={sf("pan")} placeholder="AAPCM3823P" /></div>
        </div>
      </div>

      <div className="sec-card">
        <div className="sec-hd"><div className="sec-num">3</div><div className="sec-lbl">Consignee (Ship To)</div></div>
        <div style={{ marginBottom: ".75rem" }}>
          <button className="copy-btn" onClick={() => setForm((f) => ({ ...f, consigneeName: f.invoiceName, consigneeAddress: f.invoiceAddress, consigneeGstin: f.invoiceGstin, consigneeState: f.invoiceState, consigneeStateCode: f.invoiceStateCode }))}>↕ Same as Invoice To</button>
        </div>
        <div className="grid2">
          <div className="ff"><label>Company Name</label><input value={form.consigneeName} onChange={sf("consigneeName")} /></div>
          <div className="ff"><label>GSTIN / UIN</label><input value={form.consigneeGstin} onChange={sf("consigneeGstin")} /></div>
          <div className="ff" style={{ gridColumn: "1/-1" }}><label>Address</label><textarea value={form.consigneeAddress} onChange={sf("consigneeAddress")} rows={3} /></div>
          <div className="ff"><label>State Name</label><input value={form.consigneeState} onChange={sf("consigneeState")} /></div>
          <div className="ff"><label>State Code</label><input value={form.consigneeStateCode} onChange={sf("consigneeStateCode")} /></div>
        </div>
      </div>

      <div className="sec-card">
        <div className="sec-hd"><div className="sec-num">4</div><div className="sec-lbl">Supplier (Bill From)</div></div>
        <div className="grid2">
          <div className="ff" style={{ gridColumn: "1/-1" }}><label>Supplier / Company Name</label><input value={form.supplierName} onChange={sf("supplierName")} /></div>
          <div className="ff" style={{ gridColumn: "1/-1" }}><label>Address</label><textarea value={form.supplierAddress} onChange={sf("supplierAddress")} rows={2} /></div>
          <div className="ff"><label>Mobile / Phone</label><input value={form.supplierMob} onChange={sf("supplierMob")} /></div>
          <div className="ff"><label>Email</label><input value={form.supplierEmail} onChange={sf("supplierEmail")} /></div>
          <div className="ff"><label>Authorised Signatory Company</label><input value={form.signatoryCompany} onChange={sf("signatoryCompany")} /></div>
        </div>
      </div>

      <div className="sec-card">
        <div className="sec-hd"><div className="sec-num">5</div><div className="sec-lbl">Description of Goods / Line Items</div></div>
        <div style={{ overflowX: "auto" }}>
          <table className="items-tbl">
            <thead>
              <tr>
                <th style={{ minWidth: 50, width: "4%" }}>S.No.</th>
                <th style={{ minWidth: 240 }}>Description of Goods</th>
                <th style={{ minWidth: 120, width: "12%" }}>HSN Code</th>
                <th style={{ minWidth: 130, width: "12%" }}>Due On</th>
                <th style={{ minWidth: 100, width: "10%" }}>Quantity</th>
                <th style={{ minWidth: 120, width: "12%" }}>Unit Price ({form.currency})</th>
                <th style={{ minWidth: 90, width: "8%" }}>Unit</th>
                <th style={{ minWidth: 130, width: "13%", textAlign: "right" }}>Amount ({form.currency})</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => {
                const rowSpan = 1 + (it.subItems?.length || 0);
                return (
                  <React.Fragment key={it.id}>
                    <tr>
                      <td style={{ textAlign: "center", paddingTop: ".6rem", fontWeight: 600, color: "var(--muted)", verticalAlign: "middle" }}>{i + 1}</td>
                      <td style={{ verticalAlign: "middle" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <input value={it.description} onChange={(e) => updateItem(it.id, "description", e.target.value)} placeholder="Item description" style={{ minWidth: 180, flex: 1 }} />
                          <button type="button" onClick={() => {
                            const newSub = [...(it.subItems || []), ""];
                            updateItem(it.id, "subItems", newSub);
                          }} style={{ padding: "0 8px", cursor: "pointer", border: "1.5px solid var(--border)", background: "var(--teal-l)", color: "var(--teal-d)", borderRadius: "6px", fontWeight: 600 }} title="Add Sub Item">＋</button>
                        </div>
                      </td>
                      <td rowSpan={rowSpan} style={{ verticalAlign: "middle" }}><input value={it.hsn} onChange={(e) => updateItem(it.id, "hsn", e.target.value)} placeholder="4016 9990.90" /></td>
                      <td rowSpan={rowSpan} style={{ verticalAlign: "middle" }}><input value={it.dueOn} onChange={(e) => updateItem(it.id, "dueOn", e.target.value)} placeholder="30th May 2026" /></td>
                      <td rowSpan={rowSpan} style={{ verticalAlign: "middle" }}><input value={it.quantity} onChange={(e) => updateItem(it.id, "quantity", e.target.value)} placeholder="0" style={{ textAlign: "right" }} /></td>
                      <td rowSpan={rowSpan} style={{ verticalAlign: "middle" }}><input value={it.unitPrice} onChange={(e) => updateItem(it.id, "unitPrice", e.target.value)} placeholder="0.00" style={{ textAlign: "right" }} /></td>
                      <td rowSpan={rowSpan} style={{ verticalAlign: "middle" }}><select value={it.unit} onChange={(e) => updateItem(it.id, "unit", e.target.value)}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select></td>
                      <td rowSpan={rowSpan} className="amt-cell" style={{ verticalAlign: "middle" }}>{(parseFloat(it.amount) || (parseFloat(it.quantity || 0) * parseFloat(it.unitPrice || 0)) || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                      <td rowSpan={rowSpan} style={{ verticalAlign: "middle" }}><button className="del-btn" onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))}>✕</button></td>
                    </tr>
                    {it.subItems && it.subItems.map((sub, j) => (
                      <tr key={`${it.id}-sub-${j}`}>
                        <td style={{ textAlign: "center", verticalAlign: "middle", fontWeight: 600, color: "var(--muted)", fontSize: "0.85em" }}>{`${i+1}.${j+1}`}</td>
                        <td style={{ verticalAlign: "middle" }}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <input value={sub} onChange={(e) => {
                              const newSub = [...it.subItems];
                              newSub[j] = e.target.value;
                              updateItem(it.id, "subItems", newSub);
                            }} placeholder="Sub description" style={{ minWidth: 150, flex: 1 }} />
                            <button type="button" onClick={() => {
                              const newSub = it.subItems.filter((_, idx) => idx !== j);
                              updateItem(it.id, "subItems", newSub);
                            }} style={{ padding: "0 8px", cursor: "pointer", border: "1.5px solid #FECACA", background: "#FEE2E2", color: "#B91C1C", borderRadius: "6px", fontWeight: 600 }} title="Remove Sub Item">ー</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <button className="add-row-btn" onClick={() => setItems((p) => [...p, { id: Date.now() + Math.random(), description: "", subItems: [], hsn: "", dueOn: "", quantity: "", unitPrice: "", unit: "NOS", amount: "" }])}>＋ Add Item Row</button>
        <div className="total-bar">
          <div className="total-box">
            <div className="tot-lbl">Grand Total ({form.currency})</div>
            <div className="tot-amt">{gt.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
        <div className="words-box"><strong>Amount in Words:</strong> {amtWords(gt, form.currency)}</div>
      </div>

      <div className="sec-card">
        <div className="sec-hd"><div className="sec-num">6</div><div className="sec-lbl">Terms & Conditions</div></div>
        {tc.map((t, i) => (
          <div className="tc-item" key={i}>
            <div className="tc-num">{i + 1}</div>
            <textarea value={t} onChange={(e) => { const n = [...tc]; n[i] = e.target.value; setTc(n); }} rows={3} />
            <button
              type="button"
              className="del-btn"
              onClick={() => setTc(tc.filter((_, idx) => idx !== i))}
              title={`Remove term ${i + 1}`}
              aria-label={`Remove term ${i + 1}`}
            >
              X
            </button>
          </div>
        ))}
        <button className="add-row-btn" onClick={() => setTc([...tc, ""])}>＋ Add Term</button>
      </div>

      <div style={{ height: 80 }}></div>

      <div className="form-action-bar">
        <button className="btn-cancel" onClick={resetForm}>Reset Form</button>
        <button className="btn-gen" onClick={handleSaveAndGenerate}>
          {editingId ? "💾 Save Changes" : "⚡ Generate Purchase Order"}
        </button>
      </div>
    </div>
  );
}
