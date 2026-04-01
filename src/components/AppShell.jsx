import React from "react";

export default function AppShell({
  activeTab,
  onTabChange,
  poList,
  onExportFirstPO,
  onPreviewFirstPO,
  onGoHome,
  topbarTitle,
  topbarSub,
  children,
}) {
  const sidebarItems = [
    { id: "dashboard", ic: "📊", label: "Dashboard", badge: poList.length || null },
    { id: "create", ic: "➕", label: "Create Purchase Order" },
    { id: "import", ic: "📥", label: "Import from Excel" },
    { id: "team", ic: "👥", label: "Team Members" },
  ];

  return (
    <div className="app-shell">
      <div className="sidebar">
        {/* You can adjust the marginTop here to shift the PO Tracker up or down */}
        <div className="sb-brand" style={{ marginTop: "-30px", height: "65px" }}>
          <div className="sb-brand-ic">PO</div>
          <div className="sb-brand-name" style={{ fontSize: "1.3rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>PO Tracker</div>
        </div>

        <div className="sb-section" style={{marginTop:"1.25rem"}}>Workspace</div>
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

        <div className="sb-section" style={{ marginTop: ".5rem" }}>
          Reports
        </div>
        <button className="sb-item" onClick={onExportFirstPO}>
          <span className="sb-item-ic">📤</span> Export Excel
        </button>
        <button className="sb-item" onClick={onPreviewFirstPO}>
          <span className="sb-item-ic">🖨</span> Export PDF
        </button>

        <div className="sb-bottom">
          <div className="sb-user">
            <div className="sb-avatar">AU</div>
            <div className="sb-user-info">
              <div className="sb-user-name">Admin User</div>
              <div className="sb-user-role">
                <span className="sb-role-dot"></span> Super Admin
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
              ＋ New PO
            </button>
          </div>
        </div>

        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}