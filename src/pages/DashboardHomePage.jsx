import React from "react";

export default function DashboardHomePage({
  metrics = { totalOrders: 0, totalAmount: 0, pendingOrders: 0, completedOrders: 0 },
  recentOrders = [],
  onCreatePurchaseOrder,
  onViewPO,
  onEditPO,
  onDeletePO,
  onEmailPO,
  formatCurrency,
}) {
  const statCards = [
    { title: "Total Purchase Orders", value: metrics.totalOrders,   icon: "📋", bg: "#EFF6FF", trend: "All time", tc: "up" },
    { title: "Total Amount",          value: formatCurrency ? formatCurrency(metrics.totalAmount) : metrics.totalAmount, icon: "💰", bg: "#F0FDF4", trend: "Grand total", tc: "up" },
    { title: "Pending Orders",        value: metrics.pendingOrders,  icon: "⏳", bg: "#FFFBEB", trend: "Awaiting action", tc: "warn" },
    { title: "Completed Orders",      value: metrics.completedOrders,icon: "✅", bg: "#F0FDFA", trend: "Fulfilled", tc: "up" },
  ];

  return (
    <div>
      {/* KPI Cards */}
      <div className="dash-stats">
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
                <button className="btn-sm btn-sm-out"  onClick={() => onEditPO(po)}>✏ Edit</button>
                <button className="btn-sm btn-sm-out"  onClick={() => onEmailPO(po)}>✉ Email</button>
                <button className="btn-sm btn-sm-red" style={{ marginLeft: "auto" }} onClick={() => onDeletePO(po.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
