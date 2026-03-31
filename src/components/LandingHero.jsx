import React from "react";
import FlowerScene from "./FlowerScene";

const CSS = `
@keyframes floatA {
  0%,100%{ transform:translateY(0px) rotate3d(1,1,0,5deg); }
  50%    { transform:translateY(-12px) rotate3d(1,1,0,9deg); }
}
@keyframes floatB {
  0%,100%{ transform:translateY(0px) rotate3d(1,-1,0,4deg); }
  50%    { transform:translateY(-10px) rotate3d(1,-1,0,8deg); }
}
@keyframes floatC {
  0%,100%{ transform:translateY(0px); }
  50%    { transform:translateY(-7px); }
}
@keyframes orbPulse {
  0%,100%{ transform:scale(1); opacity:.18; }
  50%    { transform:scale(1.12); opacity:.28; }
}
@keyframes barGrow {
  0%  { height:0; }
  100%{ height:var(--h); }
}
@keyframes pulse {
  0%,100%{ box-shadow:0 4px 20px rgba(13,148,136,.4); }
  50%    { box-shadow:0 4px 32px rgba(13,148,136,.7); }
}
@keyframes shimmer {
  0%  { background-position:-200% 0; }
  100%{ background-position:200% 0; }
}
@keyframes fadeUp {
  from{ opacity:0; transform:translateY(18px); }
  to  { opacity:1; transform:translateY(0); }
}
@keyframes rotateSlow {
  from{ transform:translateY(-50%) rotate(0deg); }
  to  { transform:translateY(-50%) rotate(360deg); }
}
@keyframes rotateSlow2 {
  from{ transform:translateY(-50%) rotate(0deg); }
  to  { transform:translateY(-50%) rotate(-360deg); }
}

.hw {
  position:relative;
  height:calc(100vh - 44px);
  max-height:860px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  padding:0 5%;
  background:#F0FDFA;
  clip-path:none;
}
.hw-bg { position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:0; }
.hw-orb { position:absolute; border-radius:50%; }
.hw-orb1 { width:580px; height:580px; background:radial-gradient(circle,rgba(13,148,136,.22) 0%,transparent 65%); top:-180px; right:-80px; animation:orbPulse 9s ease-in-out infinite; }
.hw-orb2 { width:320px; height:320px; background:radial-gradient(circle,rgba(13,148,136,.14) 0%,transparent 65%); bottom:-70px; right:32%; animation:orbPulse 12s ease-in-out infinite 2s; }
.hw-orb3 { width:180px; height:180px; background:radial-gradient(circle,rgba(94,234,212,.28) 0%,transparent 65%); top:15%; right:46%; animation:orbPulse 10s ease-in-out infinite 1s; }
.hw-ring1 { position:absolute; width:440px; height:440px; border-radius:50%; border:1.5px dashed rgba(13,148,136,.18); top:50%; right:6%; animation:rotateSlow 28s linear infinite; }
.hw-ring2 { position:absolute; width:290px; height:290px; border-radius:50%; border:1px dashed rgba(13,148,136,.12); top:50%; right:12%; animation:rotateSlow2 18s linear infinite; }
.hw-dot { position:absolute; border-radius:50%; background:rgba(13,148,136,.28); }
.hw-d1 { width:8px; height:8px; top:20%; right:24%; animation:floatC 5s ease-in-out infinite; }
.hw-d2 { width:5px; height:5px; top:62%; right:52%; animation:floatC 7s ease-in-out infinite 1s; }
.hw-d3 { width:10px; height:10px; bottom:22%; right:20%; animation:floatC 6s ease-in-out infinite .5s; }
.hw-d4 { width:6px; height:6px; top:35%; right:40%; animation:floatC 8s ease-in-out infinite 1.5s; }

.hw-inner {
  position:relative; z-index:1;
  display:grid; grid-template-columns:1.1fr .9fr;
  align-items:center; gap:1rem;
  width:100%; max-width:1140px; margin:0 auto;
  flex:1; padding-bottom:80px; padding-top:150px;
  padding-left:;
}
.hw-left { text-align:left; animation:fadeUp .7s ease both; margin-left:-20%; }
.hw-pill { display:inline-flex; align-items:center; gap:.4rem; background:rgba(13,148,136,.13); color:#0F766E; border:1px solid rgba(13,148,136,.28); padding:.28rem .85rem; border-radius:20px; font-size:.76rem; font-weight:600; margin-bottom:.9rem; }
.hw-h1 { font-size:3.8rem; font-weight:900; line-height:1.08; margin-bottom:.8rem; letter-spacing:-.03em; background:linear-gradient(135deg,#0F172A 0%,#0D9488 45%,#0F766E 72%,#134E4A 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.hw-sub { font-size:.92rem; color:#475569; line-height:1.65; margin-bottom:1.5rem; max-width:420px; }
.hw-btns { display:flex; gap:.75rem; flex-wrap:wrap; }
.hw-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;margin-top:1.4rem;padding-top:1.1rem;border-top:1px solid rgba(13,148,136,.18);max-width:480px;}
.hw-metric-val{font-size:1.55rem;font-weight:800;color:#0F172A;line-height:1;display:flex;align-items:baseline;gap:.1rem;}
.hw-metric-val sup{font-size:.7rem;color:#0D9488;font-weight:700;}
.hw-metric-lbl{font-size:.65rem;color:#64748B;margin-top:.22rem;font-weight:500;line-height:1.3;}
.hw-metric-trend{font-size:.65rem;color:#0D9488;font-weight:600;margin-top:.18rem;}
.hbtn-p { background:linear-gradient(135deg,#0D9488,#0F766E); color:#fff; border:none; padding:.85rem 1.85rem; border-radius:12px; font-size:.95rem; font-weight:700; cursor:pointer; font-family:inherit; transition:all .2s; animation:pulse 2.5s ease-in-out infinite; }
.hbtn-p:hover { transform:translateY(-2px); }
.hbtn-o { background:rgba(255,255,255,.75); color:#0D9488; border:1.5px solid #0D9488; padding:.85rem 1.85rem; border-radius:12px; font-size:.95rem; font-weight:700; cursor:pointer; font-family:inherit; transition:all .2s; backdrop-filter:blur(6px); }
.hbtn-o:hover { background:#F0FDFA; transform:translateY(-2px); }

.hw-right { position:relative; height:380px; margin-left:-25%; }

.hw-po { position:absolute; bottom:0; left:0; background:rgba(255,255,255,.92); backdrop-filter:blur(16px); border-radius:16px; padding:1rem; width:228px; box-shadow:0 20px 50px rgba(13,148,136,.2),0 2px 10px rgba(0,0,0,.06); border:1px solid rgba(13,148,136,.2); animation:floatA 6s ease-in-out infinite; z-index:3; }
.hw-po-hd { background:linear-gradient(135deg,#0D9488,#0F766E); border-radius:9px; padding:.5rem .75rem; margin-bottom:.7rem; display:flex; align-items:center; justify-content:space-between; }
.hw-po-title { color:#fff; font-size:.68rem; font-weight:700; letter-spacing:.05em; }
.hw-po-badge { background:rgba(255,255,255,.22); color:#fff; font-size:.56rem; padding:.1rem .38rem; border-radius:5px; font-weight:600; }
.hw-po-row { display:flex; justify-content:space-between; padding:.22rem 0; border-bottom:1px solid #F1F5F9; }
.hw-po-row:last-of-type { border-bottom:none; }
.hw-po-lbl { font-size:.6rem; color:#94A3B8; }
.hw-po-val { font-size:.64rem; font-weight:600; color:#0F172A; }
.hw-po-val.t { color:#0D9488; }
.hw-shimmer { height:4px; border-radius:2px; margin-top:.6rem; background:linear-gradient(90deg,#CCFBF1 25%,#0D9488 50%,#CCFBF1 75%); background-size:200% 100%; animation:shimmer 2s linear infinite; }
.hw-po-total { display:flex; justify-content:space-between; align-items:center; margin-top:.6rem; background:#F0FDFA; border-radius:7px; padding:.38rem .55rem; }
.hw-po-tlbl { font-size:.6rem; color:#0F766E; font-weight:600; }
.hw-po-tval { font-size:.82rem; font-weight:800; color:#0D9488; }

.hw-stats { position:absolute; top:0; left:250px; background:rgba(255,255,255,.92); backdrop-filter:blur(16px); border-radius:16px; padding:1rem; width:200px; box-shadow:0 20px 50px rgba(13,148,136,.2),0 2px 10px rgba(0,0,0,.06); border:1px solid rgba(13,148,136,.2); animation:floatB 7s ease-in-out infinite; z-index:3; }
.hw-stats-title { font-size:.62rem; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:.07em; margin-bottom:.7rem; }
.hw-srow { display:flex; align-items:center; gap:.5rem; margin-bottom:.5rem; }
.hw-sdot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.hw-slbl { font-size:.62rem; color:#64748B; flex:1; }
.hw-sval { font-size:.74rem; font-weight:700; color:#0F172A; }
.hw-chart { display:flex; align-items:flex-end; gap:3px; height:38px; margin-top:.7rem; padding-top:.35rem; border-top:1px solid #F1F5F9; }
.hw-bar { flex:1; border-radius:3px 3px 0 0; animation:barGrow .9s ease-out both; }
.hw-ring-wrap { display:flex; align-items:center; justify-content:center; margin-top:.7rem; }
.hw-ring { width:48px; height:48px; border-radius:50%; border:4px solid #CCFBF1; border-top-color:#0D9488; border-right-color:#0D9488; display:flex; align-items:center; justify-content:center; animation:floatC 4s ease-in-out infinite; box-shadow:0 0 12px rgba(13,148,136,.2); }
.hw-ring-txt { font-size:.62rem; font-weight:800; color:#0D9488; text-align:center; line-height:1.2; }
`;

const BARS = [
  {h:26,color:"#CCFBF1",delay:".1s"},
  {h:38,color:"#0D9488",delay:".2s"},
  {h:20,color:"#CCFBF1",delay:".3s"},
  {h:42,color:"#0D9488",delay:".4s"},
  {h:30,color:"#5EEAD4",delay:".5s"},
  {h:36,color:"#0D9488",delay:".6s"},
];

export default function LandingHero({ onCreatePO, onViewDashboard }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="hw">
        <div className="hw-bg">
          <div className="hw-orb hw-orb1" />
          <div className="hw-orb hw-orb2" />
          <div className="hw-orb hw-orb3" />
          <div className="hw-ring1" />
          <div className="hw-ring2" />
          <div className="hw-dot hw-d1" />
          <div className="hw-dot hw-d2" />
          <div className="hw-dot hw-d3" />
          <div className="hw-dot hw-d4" />
        </div>

        <div className="hw-inner">
          {/* LEFT */}
          <div className="hw-left">
            <div className="hw-pill">📋 Purchase Order Management</div>
            <h1 className="hw-h1">
              Create &amp; Track<br />
              <span>Purchase Orders</span><br />
              with Precision
            </h1>
            <p className="hw-sub">
              Fill structured PO forms, generate pixel-perfect documents,
              export to PDF, share via email, or import/export Excel — all in one workspace.
            </p>
            <div className="hw-btns">
              <button className="hbtn-p" onClick={onCreatePO}>＋ Create Purchase Order</button>
              <button className="hbtn-o" onClick={onViewDashboard}>View Dashboard</button>
            </div>

            {/* 4 STAT METRICS */}
            <div className="hw-metrics">
              {[
                { val:"24",  sup:"+", lbl:"Purchase Orders",   trend:"↑ 6 this month" },
                { val:"98",  sup:"%", lbl:"On-Time Delivery",   trend:"↑ High accuracy" },
                { val:"$1.2",sup:"M", lbl:"Total PO Value",     trend:"↑ All time" },
                { val:"100", sup:"%", lbl:"Free to Use",        trend:"✓ No hidden fees" },
              ].map((m,i)=>(
                <div className="hw-metric" key={i}>
                  <div className="hw-metric-val">{m.val}<sup>{m.sup}</sup></div>
                  <div className="hw-metric-lbl">{m.lbl}</div>
                  <div className="hw-metric-trend">{m.trend}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="hw-right">
            <div className="hw-po">
              <div className="hw-po-hd">
                <span className="hw-po-title">PURCHASE ORDER</span>
                <span className="hw-po-badge">Active</span>
              </div>
              {[
                {l:"Voucher No",v:"MB/25-26/67",t:true},
                {l:"Date",      v:"01-Apr-26",  t:true},
                {l:"Currency",  v:"USD",         t:false},
                {l:"Invoice To",v:"Medivation Bio",t:false},
                {l:"Supplier",  v:"Jiangyin Hongmeng",t:false},
                {l:"Items",     v:"1 line item", t:false},
              ].map((r,i)=>(
                <div className="hw-po-row" key={i}>
                  <span className="hw-po-lbl">{r.l}</span>
                  <span className={`hw-po-val${r.t?" t":""}`}>{r.v}</span>
                </div>
              ))}
              <div className="hw-shimmer" />
              <div className="hw-po-total">
                <span className="hw-po-tlbl">Grand Total</span>
                <span className="hw-po-tval">$45,675.00</span>
              </div>
            </div>

            <div className="hw-stats">
              <div className="hw-stats-title">📊 Dashboard Overview</div>
              {[
                {label:"Total POs",  val:"24",   color:"#0D9488"},
                {label:"Active",     val:"14",   color:"#16A34A"},
                {label:"Pending",    val:"8",    color:"#D97706"},
                {label:"Total Value",val:"$1.2M",color:"#2563EB"},
              ].map((s,i)=>(
                <div className="hw-srow" key={i}>
                  <div className="hw-sdot" style={{background:s.color}} />
                  <span className="hw-slbl">{s.label}</span>
                  <span className="hw-sval">{s.val}</span>
                </div>
              ))}
              <div className="hw-chart">
                {BARS.map((b,i)=>(
                  <div key={i} className="hw-bar" style={{
                    height:b.h, background:b.color,
                    "--h":b.h+"px", animationDelay:b.delay,
                  }}/>
                ))}
              </div>
              <div className="hw-ring-wrap">
                <div className="hw-ring">
                  <div className="hw-ring-txt">58%<br/><span style={{fontSize:".48rem",fontWeight:500}}>Done</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FLOWER SCENE — bottom right corner */}
        <FlowerScene />
      </div>
    </>
  );
}
