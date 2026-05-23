import React from "react";

export default function AppShell({
  workspace = "po", // "po" or "donation"
  activeTab,
  onTabChange,
  poList = [],
  receiptList = [],
  onGoHome,
  topbarTitle,
  topbarSub,
  children,
}) {
  const isPO = workspace === "po";

  const sidebarItems = isPO
    ? [
        { id: "dashboard", ic: "📊", label: "Dashboard", badge: poList.length || null },
        { id: "create", ic: "➕", label: "Create Purchase Order" },
        { id: "import", ic: "📥", label: "Import from Excel" },
        { id: "team", ic: "👥", label: "Team Members" },
      ]
    : [
        { id: "dashboard", ic: "📊", label: "Dashboard", badge: receiptList.length || null },
        { id: "create", ic: "➕", label: "Generate Receipt" },
        { id: "import", ic: "📥", label: "Excel Bulk Import" },
        { id: "donors", ic: "👥", label: "Donors Directory" },
      ];

  const brandIcon = isPO ? "PO" : "DF";
  const brandName = isPO ? "PO Tracker" : "Donation Flow";
  const actionButtonText = isPO ? "＋ New PO" : "＋ New Receipt";
  const avatarText = isPO ? "AU" : "SS";
  const userName = isPO ? "Admin User" : "Sanjhi Sikhiya";
  const userRole = isPO ? "Super Admin" : "Administrator";

  return (
    <div className="app-shell">
      <div className="sidebar">
        {/* Adjusted brand section layout */}
        <div className="sb-brand" style={{ marginTop: "-36px", height: "65px" }}>
          <div className="sb-brand-ic" style={{ background: isPO ? "var(--teal-d)" : "linear-gradient(135deg, #0d9488, #14b8a6)" }}>
            {brandIcon}
          </div>
          <div className="sb-brand-name" style={{ fontSize: "1.3rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {brandName}
          </div>
        </div>

        <div className="sb-section" style={{ marginTop: "1.25rem" }}>Workspace</div>
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            className={`sb-item${activeTab === item.id ? " active" : ""}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="sb-item-ic">{item.ic}</span>
            {item.label}
            {item.badge ? <span className="sb-badge">{item.badge}</span> : null}
          </button>
        ))}

        <div className="sb-bottom">
          <div className="sb-user">
            <div className="sb-avatar">{avatarText}</div>
            <div className="sb-user-info">
              <div className="sb-user-name">{userName}</div>
              <div className="sb-user-role">
                <span className="sb-role-dot" style={{ background: isPO ? "#139488" : "#0d9488" }}></span> {userRole}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-area">
        <div className="topbar">
          <div>
            <div className="topbar-title">{topbarTitle}</div>
            <div className="topbar-sub">{topbarSub}</div>
          </div>

          <div className="topbar-right">
            <button
              className="btn-p"
              style={{ padding: ".5rem 1.1rem", fontSize: ".8rem" }}
              onClick={onGoHome}
            >
              ← Home
            </button>
            <button
              className={`btn-p${activeTab === "create" ? " active" : ""}`}
              style={{ padding: ".5rem 1.1rem", fontSize: ".8rem" }}
              onClick={() => onTabChange("create")}
            >
              {actionButtonText}
            </button>
          </div>
        </div>

        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}