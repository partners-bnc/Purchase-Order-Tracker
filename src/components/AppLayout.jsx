import React from "react";

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="sidebar__eyebrow">Management</p>
          <h1 className="sidebar__brand">Purchase Order</h1>
        </div>

        <nav className="sidebar__nav" aria-label="Primary navigation">
          <a className="sidebar__link sidebar__link--active" href="/">
            Dashboard
          </a>
          <a className="sidebar__link" href="/">
            Purchase Orders
          </a>
          <a className="sidebar__link" href="/">
            Vendors
          </a>
          <a className="sidebar__link" href="/">
            Reports
          </a>
        </nav>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}

export default AppLayout;
