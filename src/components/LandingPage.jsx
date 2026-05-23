import React from "react";
import LandingHero from "./LandingHero";

export default function LandingPage({ onOpenPO, onOpenDonation, onCreatePO }) {
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
          
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              className="btn-p"
              style={{
                padding: ".5rem 1.25rem",
                fontSize: ".8rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #0d9488, #0f766e)",
                border: "none",
                borderRadius: "10px",
                color: "#ffffff",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(13, 148, 136, 0.2)"
              }}
              onClick={onOpenPO}
            >
              PO Tracker
            </button>
            <button
              className="btn-p"
              style={{
                padding: ".5rem 1.25rem",
                fontSize: ".8rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                border: "none",
                borderRadius: "10px",
                color: "#ffffff",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)"
              }}
              onClick={onOpenDonation}
            >
              Donation Receipt
            </button>
          </div>
        </div>
      </nav>

      <LandingHero onCreatePO={onCreatePO} onViewDashboard={onOpenPO} />
    </div>
  );
}
