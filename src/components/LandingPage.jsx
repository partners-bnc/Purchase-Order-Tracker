import React from "react";
import LandingHero from "./LandingHero";

export default function LandingPage({ onOpenDashboard, onCreatePO }) {
  return (
    <div className="landing" style={{ position: "relative" }}>
      <nav style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "75px",
        display: "flex",
        alignItems: "center",
        padding: "8px 5% 0",
        background : "transparent",
        zIndex: 10,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1140px",
          margin: "0 auto",
          paddingLeft: "",
          marginLeft: "-0%",
        }}>
          <div className="l-nav-brand">
            <div className="l-nav-icon">PO</div>
            Purchase Orders Tracker
          </div>
          <button
            className="btn-p"
            style={{ padding: ".4rem 1rem", fontSize: ".8rem" }}
            onClick={onOpenDashboard}
          >
            Open Dashboard
          </button>
        </div>
      </nav>

      <LandingHero onCreatePO={onCreatePO} onViewDashboard={onOpenDashboard} />
    </div>
  );
}
