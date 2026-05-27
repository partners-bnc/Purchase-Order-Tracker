import React from "react";

const CURRENCY_SYMBOLS = { USD: "$", INR: "₹", EUR: "€", GBP: "£" };

export default function DashboardHomePage({
  workspace = "po", // "po" or "donation"
  metrics = { totalOrders: 0, totalsByCurrency: {}, completedOrders: 0, totalReceipts: 0 },
  recentOrders = [], // represents recent records (POs or Receipts)
  onCreatePurchaseOrder, // triggers create PO or generate Receipt
  onViewPO, // views record
  onEditPO, // edits record
  onDeletePO, // deletes record
  onEmailPO, // emails record
}) {
  const isPO = workspace === "po";
  const { totalOrders = 0, totalsByCurrency = {}, totalReceipts = 0 } = metrics;
  const currencyEntries = Object.entries(totalsByCurrency);

  const mainCount = isPO ? totalOrders : totalReceipts;
  const mainLabel = isPO ? "Total Purchase Orders" : "Total Receipts";
  const mainIcon = isPO ? "📋" : "🧾";

  const statCards = [
    { title: mainLabel, value: mainCount, icon: mainIcon, bg: "#EFF6FF", trend: "All time", tc: "up" },
  ];

  return (
    <div>
      {/* KPI Cards */}
      <div className="dash-stats" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {statCards.map((c) => (
          <div key={c.title} className="dash-stat">
            <div className="ds-icon" style={{ background: c.bg }}>{c.icon}</div>
            <div className="ds-body">
              <div className="ds-l">{c.title}</div>
              <div className="ds-n">{c.value}</div>
              <div className={`ds-t ${c.tc}`}>{c.trend}</div>
            </div>
          </div>
        ))}
        {currencyEntries.map(([cur, amt]) => (
          <div key={cur} className="dash-stat">
            <div className="ds-icon" style={{ background: "#F0FDF4", fontSize: ".85rem", fontWeight: 700, color: "#15803D" }}>{cur}</div>
            <div className="ds-body">
              <div className="ds-l">Total ({cur})</div>
              <div className="ds-n" style={{ fontSize: "1.1rem" }}>
                {CURRENCY_SYMBOLS[cur] || ""}{Number(amt).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className="ds-t up">Grand total</div>
            </div>
          </div>
        ))}
      </div>

      {/* Section header */}
      <div className="dash-section-hd">
        {isPO ? "Recent Purchase Orders" : "Recent Donation Receipts"}
        <button className="btn-sm btn-sm-teal" onClick={onCreatePurchaseOrder}>
          {isPO ? "＋ New PO" : "＋ New Receipt"}
        </button>
      </div>

      {recentOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-ic">{isPO ? "📋" : "🧾"}</div>
          <div className="empty-t">{isPO ? "No Purchase Orders Yet" : "No Donation Receipts Yet"}</div>
          <div className="empty-d">
            {isPO 
              ? "Create your first purchase order to see it here." 
              : "Generate your first tax exemption donation certificate to see it here."}
          </div>
          <button className="btn-p" onClick={onCreatePurchaseOrder}>
            {isPO ? "＋ Create Purchase Order" : "＋ Generate Donation Receipt"}
          </button>
        </div>
      ) : (
        <div className="po-cards">
          {recentOrders.map((item) => {
            const id = item.id;
            const supplier = isPO 
              ? (item.supplierName || "N/A") 
              : (item.donorName || "N/A");
            
            const voucher = isPO 
              ? (item.voucherNo || "N/A") 
              : (item.receiptNo || "N/A");
            
            const date = item.date || "N/A";
            const status = item.status || "Active";
            
            const row1Label = isPO ? "Invoice To" : "PAN Card No";
            const row1Val = isPO ? (item.invoiceName || "N/A") : (item.donorPan || "N/A");
            
            const row2Label = isPO ? "Items" : "Towards";
            const row2Val = isPO 
              ? `${item.itemCount || 0} line item${item.itemCount !== 1 ? "s" : ""}` 
              : (item.towards || "General Support");
            
            const totalVal = isPO 
              ? `${item.currency || "USD"} ${(item.total || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}` 
              : `INR ${(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

            return (
              <div className="po-card" key={id}>
                <div className="po-card-header">
                  <div>
                    <div className="po-card-company">
                      {supplier.length > 40 ? supplier.slice(0, 40) + "…" : supplier}
                    </div>
                    <div className="po-card-voucher">{voucher} · {date}</div>
                  </div>
                  {isPO && (
                    <span className={`po-badge ${(status || "active").toLowerCase()}`}>{status}</span>
                  )}
                </div>
                <div className="po-card-rows">
                  <span>{row1Label} <b>{row1Val}</b></span>
                  <span>{row2Label} <b>{row2Val}</b></span>
                  <span>Total <b>{totalVal}</b></span>
                </div>
                <div className="po-card-footer">
                  <button className="btn-sm btn-sm-teal" onClick={() => onViewPO(item)}>👁 View</button>
                  <button className="btn-sm btn-sm-out" onClick={() => onEditPO(item)}>✏ Edit</button>
                  <button className="btn-sm btn-sm-out" onClick={() => onEmailPO(item)}>✉ Email</button>
                  <button className="btn-sm btn-sm-red" style={{ marginLeft: "auto" }} onClick={() => onDeletePO(id)}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
