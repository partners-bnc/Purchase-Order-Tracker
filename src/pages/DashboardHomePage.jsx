import React from "react";

const CURRENCY_SYMBOLS = { USD: "$", INR: "₹", EUR: "€", GBP: "£" };

export default function DashboardHomePage({
  metrics = { totalOrders: 0, totalsByCurrency: {}, completedOrders: 0 },
  recentOrders = [],
  onCreatePurchaseOrder,
  onViewPO,
  onEditPO,
  onDeletePO,
  onEmailPO,
}) {
  const { totalOrders, totalsByCurrency = {} } = metrics;
  const currencyEntries = Object.entries(totalsByCurrency);

  const statCards = [
    { title: "Total Purchase Orders", value: totalOrders, icon: "📋", bg: "#EFF6FF", trend: "All time", tc: "up" },
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
        Recent Purchase Orders
        <button className="btn-sm btn-sm-teal" onClick={onCreatePurchaseOrder}>＋ New PO</button>
      </div>

      {recentOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-ic">📋</div>
          <div className="empty-t">No Purchase Orders Yet</div>
          <div className="empty-d">Create your first purchase order to see it here.</div>
          <button className="btn-p" onClick={onCreatePurchaseOrder}>＋ Create Purchase Order</button>
        </div>
      ) : (
        <div className="po-cards">
          {recentOrders.map((po) => (
            <div className="po-card" key={po.id}>
              <div className="po-card-header">
                <div>
                  <div className="po-card-company">
                    {po.supplierName?.length > 40 ? po.supplierName.slice(0, 40) + "…" : po.supplierName}
                  </div>
                  <div className="po-card-voucher">{po.voucherNo} · {po.date}</div>
                </div>
                <span className={`po-badge ${(po.status || "active").toLowerCase()}`}>{po.status}</span>
              </div>
              <div className="po-card-rows">
                <span>Invoice To <b>{po.invoiceName}</b></span>
                <span>Items <b>{po.itemCount} line item{po.itemCount !== 1 ? "s" : ""}</b></span>
                <span>Total <b>{po.currency} {po.total?.toLocaleString("en-US", { minimumFractionDigits: 2 })}</b></span>
              </div>
              <div className="po-card-footer">
                <button className="btn-sm btn-sm-teal" onClick={() => onViewPO(po)}>👁 View</button>
                <button className="btn-sm btn-sm-out" onClick={() => onEditPO(po)}>✏ Edit</button>
                <button className="btn-sm btn-sm-out" onClick={() => onEmailPO(po)}>✉ Email</button>
                <button className="btn-sm btn-sm-red" style={{ marginLeft: "auto" }} onClick={() => onDeletePO(po.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
