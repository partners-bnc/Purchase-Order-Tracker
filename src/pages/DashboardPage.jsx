import React, { useState, useEffect } from "react";
import LandingPage from "../components/LandingPage";
import AppShell from "../components/AppShell";
import DashboardHomePage from "./DashboardHomePage";
import CreatePurchaseOrderPage from "./CreatePurchaseOrderPage";
import ImportFromExcelPage from "./ImportFromExcelPage";
import { supabase } from "../supabaseClient";

/* ─── helpers ─────────────────────────────────────────────────── */
const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tns = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
function chunk(n) {
  if (!n) return "";
  if (n < 20) return ones[n] + " ";
  if (n < 100) return tns[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "") + " ";
  return ones[Math.floor(n / 100)] + " Hundred " + chunk(n % 100);
}
function numWords(n) {
  if (n === 0) return "Zero";
  let r = "";
  const b = Math.floor(n / 1e9);
  if (b) r += chunk(b) + "Billion ";
  const m = Math.floor((n % 1e9) / 1e6);
  if (m) r += chunk(m) + "Million ";
  const t = Math.floor((n % 1e6) / 1e3);
  if (t) r += chunk(t) + "Thousand ";
  const rem = n % 1000;
  if (rem) r += chunk(rem);
  return r.trim();
}
function amtWords(v, currency = "USD") {
  const n = parseFloat(v) || 0;
  const d = Math.floor(n);
  const c = Math.round((n - d) * 100);
  let curr = "Dollars";
  let frac = "Cents";
  if (currency === "INR") { curr = "Rupees"; frac = "Paise"; }
  else if (currency === "EUR") { curr = "Euros"; frac = "Cents"; }
  else if (currency === "GBP") { curr = "Pounds"; frac = "Pence"; }

  return numWords(d) + " " + curr + (c > 0 ? " and " + numWords(c) + " " + frac : "") + " Only";
}

const DEFAULT_TC = [
  "GST Extra as applicable",
  "Price - The price mentioned in the Purchase Order is firm and fixed till the delivery of entire material and is not subject to any price Escalation on any ground. Pricing and Make/Brand mentioned in this Purchase Order are inclusive of Packing. No incremental / incidental charges are in the scope of Medivation. only Transit, Freight and Insurance will be in Medivation Bio Pvt Ltd scope.",
  "Freight and Taxes will be in Medivation Bio Pvt Ltd scope and charged extra as applicable at the time of dispatch. FOB Shanghai will be in scope of JIANGYIN HONGMENG RUBBER PLASTIC PRODUCT CO., LTD",
  "Payment Terms on Supply-\n• 100% Advance payment",
  "Replacement of Missing/Damaged Consignment: All consignments must be packed in a manner that will provide for efficient handling and prevent damage in transit. In the event of damage to any consignment or missing parts, Medivation shall inform JIANGYIN HONGMENG RUBBER PLASTIC PRODUCT CO., LTD and JIANGYIN HONGMENG RUBBER PLASTIC PRODUCT CO., LTD shall replace/make prompt arrangements for its manufacture and supply as to commission without any delay without any cost escalation",
  "Delays in Delivery – Strict time bound delivery is the essence of this PO. JIANGYIN HONGMENG RUBBER PLASTIC PRODUCT CO., LTD will be liable for delays in delivery other than causes beyond its control and without its fault or negligence.",
];

const emptyForm = () => ({
  voucherNo: "", date: "", currency: "USD",
  refNo: "", refDate: "", otherRef: "",
  invoiceName: "", invoiceAddress: "", invoiceGstin: "",
  invoiceState: "", invoiceStateCode: "", invoiceCin: "",
  consigneeName: "", consigneeAddress: "", consigneeGstin: "",
  consigneeState: "", consigneeStateCode: "",
  supplierName: "", supplierAddress: "", supplierMob: "", supplierEmail: "",
  dispatchedThrough: "", destination: "", termsOfDelivery: "",
  signatoryCompany: "", pan: "",
});
const emptyItems = () => [{ id: Date.now(), description: "", subItems: [], hsn: "", dueOn: "", quantity: "", unitPrice: "", unit: "NOS", amount: "" }];
const UNITS = ["NOS", "PCS", "KGS", "MTR", "LTR", "BOX", "BAG", "BTL", "CTN", "PKG", "SET", "GM"];
const newItem = () => ({
  id: Date.now() + Math.random(),
  description: "",
  subItems: [],
  hsn: "",
  dueOn: "",
  quantity: "",
  unitPrice: "",
  unit: "NOS",
  amount: "",
});
const defaultForm = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][today.getMonth()];
  const yy = String(today.getFullYear()).slice(-2);
  const dateStr = `${dd}-${mon}-${yy}`;
  return ({
    voucherNo: "MB/26-27/01",
    date: dateStr,
    currency: "USD",
    refNo: "MB/26-27/01",
    refDate: "",
    otherRef: "",
    invoiceName: "Medivation Bio Private Limited",
    invoiceAddress: "SIDCO Industrial Estate Lane, SIDCO Industrial Complex,\nBari Brahmana EPIP, Samba, Jammu",
    invoiceGstin: "01AAPCM3823P1Z5",
    invoiceState: "Jammu and Kashmir",
    invoiceStateCode: "01",
    invoiceCin: "U33119DL2022PTC392696",
    consigneeName: "Medivation Bio Private Limited",
    consigneeAddress: "SIDCO Industrial Estate Lane, SIDCO Industrial Complex,\nBari Brahmana EPIP, Samba, Jammu",
    consigneeGstin: "01AAPCM3823P1Z5",
    consigneeState: "Jammu and Kashmir",
    consigneeStateCode: "01",
    supplierName: "JIANGYIN HONGMENG RUBBER PLASTIC PRODUCT CO., LTD",
    supplierAddress: "NO.166, HETUN ROAD, LIGANG TOWN, JIANGYIN CITY, JIANGSU, CHINA.",
    supplierMob: "+86 133611660522",
    supplierEmail: "hyyeon@jiangyinhongmeng.com",
    dispatchedThrough: "",
    destination: "",
    termsOfDelivery: "",
    signatoryCompany: "Medivation Bio Private Limited",
    pan: "AAPCM3823P",
  });
};
const defaultItems = () => [
  {
    id: 1,
    description: "BCT Rubber Stopper Open Type 13-1F (HSN Code- 4016 9990.90)",
    subItems: [],
    hsn: "4016 9990.90",
    dueOn: "30th May 2026",
    quantity: "10500000",
    unitPrice: "0.00435",
    unit: "NOS",
    amount: "45675.00",
  },
];

/* ─── CSS ─────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --teal:#0D9488;--teal-d:#0F766E;--teal-l:#F0FDFA;--teal-m:#CCFBF1;
  --bg:#F0FDFA;--white:#FFFFFF;--border:#E2E8F0;--text:#0F172A;
  --muted:#64748B;--muted-l:#94A3B8;--shadow:0 1px 3px rgba(0,0,0,0.06),0 4px 12px rgba(0,0,0,0.04);
  --red:#EF4444;--red-d:#B91C1C;--red-l:#FEF2F2;--green:#16A34A;--blue:#2563EB;--amber:#D97706;
}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);font-size:14px;}

/* ─ DELETE MODAL ─ */
.confirm-box{background:#fff;width:90%;max-width:380px;border-radius:18px;padding:1.5rem;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);position:relative;animation:popIn 0.25s ease-out;}
@keyframes popIn { from{transform:scale(0.9);opacity:0;} to{transform:scale(1);opacity:1;} }
.confirm-ic{width:50px;height:50px;background:var(--red-l);color:var(--red);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:1.15rem;}
.confirm-t{font-size:1.15rem;font-weight:700;margin-bottom:.5rem;color:var(--text);}
.confirm-d{font-size:.875rem;color:var(--muted);line-height:1.5;margin-bottom:1.5rem;}
.confirm-btns{display:flex;gap:.75rem;}
.btn-cf{flex:1;padding:.65rem;border-radius:10px;font-size:.875rem;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;border:none;transition:all .15s;}
.btn-cf-del{background:var(--red);color:#fff;}
.btn-cf-del:hover{background:var(--red-d);}
.btn-cf-can{background:#F1F5F9;color:var(--muted);}
.btn-cf-can:hover{background:#E2E8F0;color:var(--text);}

/* ─ LANDING ─ */
.landing{height:100vh;display:flex;flex-direction:column;background:var(--bg);overflow:hidden;}
.l-nav{height:44px;background:var(--white);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 2rem;position:sticky;top:0;z-index:50;}
.l-nav-brand{display:flex;align-items:center;gap:.6rem;font-weight:700;font-size:1rem;color:var(--teal-d);}
.l-nav-icon{width:34px;height:34px;background:var(--teal);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:.85rem;}
.l-hero{padding:5rem 2rem 2.5rem;text-align:center;}
.l-pill{display:inline-flex;align-items:center;gap:.4rem;background:var(--teal-m);color:var(--teal-d);padding:.25rem .85rem;border-radius:20px;font-size:.75rem;font-weight:600;margin-bottom:1.25rem;}
.l-h1{font-size:2.8rem;font-weight:700;line-height:1.15;margin-bottom:.9rem;}
.l-h1 span{color:var(--teal);}
.l-sub{font-size:1rem;color:var(--muted);max-width:500px;margin:0 auto 2rem;line-height:1.7;}
.l-btns{display:flex;gap:.85rem;justify-content:center;flex-wrap:wrap;}
.btn-p{background:var(--teal);color:#fff;border:none;padding:.75rem 1.75rem;border-radius:10px;font-size:.9rem;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all .18s;display:inline-flex;align-items:center;gap:.4rem;}
.btn-p:hover{background:var(--teal-d);transform:translateY(-1px);}
.btn-o{background:#fff;color:var(--teal);border:1.5px solid var(--teal);padding:.75rem 1.75rem;border-radius:10px;font-size:.9rem;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all .18s;}
.btn-o:hover{background:var(--teal-l);}
.l-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;max-width:860px;margin:2.5rem auto 0;padding:0 2rem;}
.l-stat{background:#fff;border-radius:14px;padding:1.25rem 1.5rem;border:1px solid var(--border);box-shadow:var(--shadow);}
.l-stat-n{font-size:1.8rem;font-weight:700;color:var(--teal-d);}
.l-stat-l{font-size:.78rem;color:var(--muted);margin-top:.2rem;}
.l-stat-t{font-size:.72rem;color:var(--green);margin-top:.3rem;font-weight:500;}
.l-feats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;max-width:860px;margin:2rem auto 3rem;padding:0 2rem;}
.l-feat{background:#fff;border-radius:14px;padding:1.25rem;border:1px solid var(--border);box-shadow:var(--shadow);}
.l-feat-ic{width:38px;height:38px;background:var(--teal-m);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:.85rem;font-size:1.1rem;}
.l-feat-t{font-weight:600;font-size:.9rem;margin-bottom:.3rem;}
.l-feat-d{font-size:.8rem;color:var(--muted);line-height:1.55;}

/* ─ APP SHELL (sidebar) ─ */
.app-shell{display:flex;min-height:100vh;background:var(--bg);}
.sidebar{width:280px;background:#fff;border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:40;}
.sb-brand{height:36px;display:flex;align-items:center;gap:.75rem;padding:0 1.25rem;border-bottom:1px solid var(--border);}
.sb-brand-ic{width:36px;height:36px;background:var(--teal);border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:.85rem;flex-shrink:0;box-shadow:0 2px 8px rgba(13,148,136,0.25);}
.sb-brand-name{font-weight:700;font-size:1rem;color:var(--teal-d);line-height:1;letter-spacing:-.01em;}
.sb-section{padding:.75rem 1.25rem .25rem;font-size:.62rem;font-weight:700;color:var(--muted-l);text-transform:uppercase;letter-spacing:.09em;}
.sb-item{display:flex;align-items:center;gap:.65rem;padding:.65rem 1.1rem;margin:.1rem .6rem;border-radius:9px;cursor:pointer;font-size:.86rem;font-weight:500;color:var(--muted);transition:all .15s;border:none;background:none;width:calc(100% - 1.2rem);text-align:left;font-family:'Inter',sans-serif;white-space:nowrap;}
.sb-item:hover{background:var(--teal-l);color:var(--teal-d);}
.sb-item.active{background:var(--teal-m);color:var(--teal-d);font-weight:600;}
.sb-item-ic{font-size:1rem;width:20px;text-align:center;flex-shrink:0;}
.sb-badge{margin-left:auto;background:var(--teal);color:#fff;border-radius:12px;padding:.15rem .5rem;font-size:.65rem;font-weight:700;}
.sb-bottom{margin-top:auto;padding:1rem 1.25rem;border-top:1px solid var(--border);}
.sb-user{display:flex;align-items:center;gap:.75rem;background:var(--teal-l);border:1px solid var(--teal-m);border-radius:12px;padding:.65rem .85rem;}
.sb-avatar{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--teal),var(--teal-d));color:#fff;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0;box-shadow:0 2px 6px rgba(13,148,136,0.3);}
.sb-user-info{flex:1;min-width:0;}
.sb-user-name{font-size:.82rem;font-weight:700;color:var(--text);}
.sb-user-role{font-size:.7rem;color:var(--teal-d);font-weight:500;margin-top:.1rem;display:flex;align-items:center;gap:.3rem;}
.sb-role-dot{width:6px;height:6px;border-radius:50%;background:var(--teal);display:inline-block;}
.main-area{margin-left:280px;flex:1;display:flex;flex-direction:column;min-height:100vh;}
.topbar{height:65px;background:#fff;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 1.75rem;position:sticky;top:0;z-index:30;}
.topbar-title{font-weight:700;font-size:1rem;}
.topbar-sub{font-size:.75rem;color:var(--muted);}
.topbar-right{display:flex;align-items:center;gap:.75rem;}
.main-content{padding:1.75rem;flex:1;}

/* ─ DASHBOARD ─ */
.dash-stats,.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.75rem;}
.dash-stat,.stat-card{background:#fff;border-radius:14px;padding:1.1rem 1.25rem;border:1px solid var(--border);box-shadow:var(--shadow);display:flex;align-items:center;gap:.9rem;}
.ds-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;}
.ds-body{flex:1;}
.ds-n{font-size:1.55rem;font-weight:700;color:var(--text);line-height:1.1;}
.ds-l{font-size:.72rem;color:var(--muted);margin-top:.2rem;font-weight:500;}
.ds-t{font-size:.68rem;margin-top:.3rem;font-weight:500;}
.ds-t.up{color:var(--green);}
.ds-t.warn{color:var(--amber);}
.dash-section-hd{font-weight:700;font-size:.95rem;margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;}
.po-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;}
.po-card{background:#fff;border-radius:14px;padding:1.25rem;border:1px solid var(--border);box-shadow:var(--shadow);cursor:pointer;transition:all .15s;}
.po-card:hover{border-color:var(--teal);box-shadow:0 2px 12px rgba(13,148,136,0.12);}
.po-card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;}
.po-card-company{font-weight:600;font-size:.9rem;margin-bottom:.15rem;}
.po-card-voucher{font-size:.75rem;color:var(--muted);}
.po-badge{font-size:.68rem;padding:.2rem .6rem;border-radius:12px;font-weight:600;}
.po-badge.active{background:#DCFCE7;color:#15803D;}
.po-badge.draft{background:#F1F5F9;color:#475569;}
.po-badge.pending{background:#FEF3C7;color:#92400E;}
.po-card-rows{font-size:.78rem;color:var(--muted);display:flex;flex-direction:column;gap:.3rem;margin-bottom:.85rem;}
.po-card-rows span{display:flex;justify-content:space-between;}
.po-card-rows span b{color:var(--text);font-weight:500;}
.po-card-footer{display:flex;gap:.5rem;border-top:1px solid var(--border);padding-top:.75rem;}
.btn-sm{padding:.35rem .85rem;border-radius:7px;font-size:.75rem;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;border:none;transition:all .15s;display:inline-flex;align-items:center;gap:.3rem;}
.btn-sm-teal{background:var(--teal);color:#fff;}
.btn-sm-teal:hover{background:var(--teal-d);}
.btn-sm-out{background:#fff;color:var(--teal);border:1.5px solid var(--teal);}
.btn-sm-out:hover{background:var(--teal-l);}
.btn-sm-red{background:#FEE2E2;color:#B91C1C;}
.btn-sm-red:hover{background:#FECACA;}
.empty-state{text-align:center;padding:4rem 2rem;color:var(--muted);}
.empty-ic{font-size:3rem;margin-bottom:1rem;}
.empty-t{font-weight:600;font-size:1rem;margin-bottom:.5rem;color:var(--text);}
.empty-d{font-size:.85rem;line-height:1.6;margin-bottom:1.5rem;}

/* ─ FORM ─ */
.form-wrap{max-width:1200px;}
.sec-card{background:#fff;border-radius:14px;padding:1.5rem;margin-bottom:1.25rem;border:1px solid var(--border);box-shadow:var(--shadow);}
.sec-hd{display:flex;align-items:center;gap:.6rem;margin-bottom:1.25rem;padding-bottom:.75rem;border-bottom:1px solid var(--border);}
.sec-num{width:26px;height:26px;background:var(--teal);color:#fff;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;flex-shrink:0;}
.sec-lbl{font-weight:600;font-size:.9rem;}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;}
.ff{display:flex;flex-direction:column;gap:.3rem;}
.ff label{font-size:.7rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;}
.ff input,.ff textarea,.ff select{border:1.5px solid var(--border);border-radius:8px;padding:.55rem .8rem;font-size:.875rem;font-family:'Inter',sans-serif;color:var(--text);transition:border .18s;background:#fff;}
.ff input:focus,.ff textarea:focus,.ff select:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 3px rgba(13,148,136,0.08);}
.ff textarea{resize:vertical;min-height:68px;line-height:1.5;}
.items-tbl{width:100%;border-collapse:collapse;font-size:.82rem;}
.items-tbl th{background:var(--teal-m);color:var(--teal-d);padding:.55rem .65rem;text-align:left;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;}
.items-tbl td{padding:.45rem .4rem;border-bottom:1px solid #F1F5F9;vertical-align:top;}
.items-tbl td input,.items-tbl td select{width:100%;border:1.5px solid var(--border);border-radius:6px;padding:.38rem .55rem;font-size:.8rem;font-family:'Inter',sans-serif;background:#fff;color:var(--text);}
.items-tbl td input:focus,.items-tbl td select:focus{outline:none;border-color:var(--teal);}
.amt-cell{font-weight:600;color:var(--teal-d);text-align:right;padding-right:.65rem!important;vertical-align:middle!important;}
.del-btn{background:none;border:none;cursor:pointer;color:#CBD5E1;font-size:.95rem;transition:color .15s;padding:.15rem .3rem;}
.del-btn:hover{color:var(--red);}
.add-row-btn{margin-top:.7rem;background:var(--teal-l);color:var(--teal-d);border:1.5px dashed var(--teal);padding:.45rem .9rem;border-radius:8px;cursor:pointer;font-size:.78rem;font-weight:600;font-family:'Inter',sans-serif;display:inline-flex;align-items:center;gap:.35rem;transition:all .15s;}
.add-row-btn:hover{background:var(--teal-m);}
.total-bar{display:flex;justify-content:flex-end;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);}
.total-box{background:var(--teal);color:#fff;padding:.7rem 1.25rem;border-radius:10px;text-align:right;}
.tot-lbl{font-size:.7rem;opacity:.85;}
.tot-amt{font-size:1.25rem;font-weight:700;}
.words-box{margin-top:.75rem;background:var(--teal-l);border:1px solid var(--teal-m);border-radius:8px;padding:.65rem .9rem;font-size:.82rem;color:var(--teal-d);}
.tc-item{display:flex;gap:.65rem;margin-bottom:.65rem;align-items:flex-start;}
.tc-num{min-width:24px;height:24px;background:var(--teal-m);color:var(--teal-d);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;flex-shrink:0;margin-top:.15rem;}
.tc-item textarea{flex:1;border:1.5px solid var(--border);border-radius:8px;padding:.45rem .7rem;font-size:.8rem;font-family:'Inter',sans-serif;resize:vertical;min-height:56px;}
.tc-item textarea:focus{outline:none;border-color:var(--teal);}
.form-action-bar{background:#fff;border-top:1px solid var(--border);padding:1rem 1.75rem;display:flex;justify-content:flex-end;gap:.75rem;position:sticky;bottom:0;z-index:20;margin-left:-1.75rem;margin-right:-1.75rem;margin-bottom:-1.75rem;}
.btn-gen{background:var(--teal);color:#fff;border:none;padding:.75rem 1.75rem;border-radius:10px;font-size:.9rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:.45rem;font-family:'Inter',sans-serif;transition:all .18s;}
.btn-gen:hover{background:var(--teal-d);transform:translateY(-1px);}
.btn-cancel{background:#fff;color:var(--muted);border:1.5px solid var(--border);padding:.75rem 1.25rem;border-radius:10px;font-size:.85rem;font-weight:500;cursor:pointer;font-family:'Inter',sans-serif;transition:all .18s;}
.btn-cancel:hover{border-color:var(--muted);color:var(--text);}
.copy-btn{background:var(--teal-l);color:var(--teal-d);border:1.5px solid var(--teal-m);padding:.4rem .85rem;border-radius:7px;cursor:pointer;font-size:.75rem;font-weight:600;font-family:'Inter',sans-serif;display:inline-flex;align-items:center;gap:.35rem;transition:all .15s;}
.copy-btn:hover{background:var(--teal-m);}

/* ─ IMPORT PAGE ─ */
.import-wrap{max-width:700px;}
.import-zone{border:2px dashed var(--border);border-radius:14px;padding:3rem 2rem;text-align:center;cursor:pointer;transition:all .18s;background:#fff;}
.import-zone:hover,.import-zone.drag{border-color:var(--teal);background:var(--teal-l);}
.import-ic{font-size:2.5rem;margin-bottom:.75rem;}
.import-t{font-weight:600;font-size:.95rem;margin-bottom:.4rem;}
.import-d{font-size:.82rem;color:var(--muted);line-height:1.5;}
.import-instructions{background:#fff;border-radius:14px;padding:1.25rem;border:1px solid var(--border);margin-top:1.25rem;}
.import-inst-hd{font-weight:600;font-size:.9rem;margin-bottom:.75rem;}
.import-step{display:flex;gap:.65rem;margin-bottom:.6rem;align-items:flex-start;font-size:.82rem;color:var(--muted);}
.import-step-n{min-width:22px;height:22px;background:var(--teal);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;flex-shrink:0;}

/* ─ TEAM PAGE ─ */
.team-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem;}
.team-card{background:#fff;border-radius:14px;padding:1.25rem;border:1px solid var(--border);box-shadow:var(--shadow);display:flex;align-items:flex-start;gap:.9rem;}
.team-av{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;color:#fff;flex-shrink:0;}
.team-name{font-weight:600;font-size:.9rem;}
.team-role{font-size:.75rem;color:var(--muted);margin-top:.15rem;}
.team-badge{font-size:.65rem;padding:.15rem .5rem;border-radius:10px;font-weight:600;margin-top:.4rem;display:inline-block;}

/* ─ PREVIEW MODAL ─ */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:100;overflow-y:auto;padding:1.5rem 1rem;}
.modal-inner{max-width:920px;margin:0 auto;}
.modal-toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:.85rem;}
.modal-title{color:#fff;font-weight:700;font-size:1rem;display:flex;align-items:center;gap:.5rem;}
.modal-btns{display:flex;gap:.6rem;flex-wrap:wrap;}
.mbtn{padding:.5rem 1rem;border-radius:8px;border:none;cursor:pointer;font-size:.78rem;font-weight:600;font-family:'Inter',sans-serif;transition:all .18s;display:flex;align-items:center;gap:.35rem;}
.mbtn-close{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.2);}
.mbtn-close:hover{background:rgba(255,255,255,.22);}
.mbtn-pdf{background:#F87171;color:#fff;}
.mbtn-pdf:hover{background:#EF4444;}
.mbtn-email{background:#60A5FA;color:#fff;}
.mbtn-email:hover{background:#3B82F6;}

/* ─ PO DOCUMENT (print-accurate) ─ */
.po-doc{background:#fff;font-family:Arial,Helvetica,sans-serif;font-size:10.5px;color:#000;line-height:1.4;padding:18px 22px;}
.po-doc *{box-sizing:border-box;}
.po-title{text-align:center;font-size:15px;font-weight:bold;margin-bottom:10px;letter-spacing:1px;}
.po-tbl{width:100%;border-collapse:collapse;border:1px solid #000;}
.po-tbl td,.po-tbl th{border:1px solid #000;padding:5px 7px;vertical-align:top;font-size:10.5px;}
.po-lbl{font-size:9px;color:#555;margin-bottom:2px;}
.po-val{font-weight:500;}
.po-bold{font-weight:600;}
.po-center{text-align:center;}
.po-right{text-align:right;}
.po-items th{background:#f5f5f5;font-weight:bold;font-size:9.5px;text-align:center;border:1px solid #000;padding:4px 6px;}
.po-items td{border:1px solid #000;padding:4px 6px;font-size:10px;}
.po-amt{font-weight:600;text-align:center;}
@media print{.modal-toolbar,.modal-bg{display:none!important;} .po-doc{padding:0;}}
`;

/* ─── PRINT UTIL (opens print dialog for PDF) ─────────────────── */
function printElement(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const w = window.open("", "_blank", "width=900,height=700");
  w.document.write(`<!DOCTYPE html><html><head><title>&#8203;</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:Arial,Helvetica,sans-serif;font-size:10.5px;color:#000;padding:10mm;}
      .print-container { width: 190mm; margin: 0 auto; }
      table{border-collapse:collapse;width:100%;}
      td,th{border:1px solid #000;padding:5px 7px;vertical-align:top;font-size:10.5px;}
      .po-title{text-align:center;font-size:15px;font-weight:bold;margin-bottom:10px;letter-spacing:1px;}
      .po-lbl{font-size:9px;color:#555;margin-bottom:2px;}
      .po-bold{font-weight:600;}
      .po-center{text-align:center;}
      .po-right{text-align:right;}
      .po-amt{font-weight:600;text-align:center;}
      th{background:#f5f5f5;font-weight:bold;font-size:9.5px;text-align:center;}
      @page{size:A4; margin:0;}
      @page :first{ margin-top:0; }
      html,body{-webkit-print-color-adjust:exact;}
    </style>
  </head><body><div class="print-container">${el.innerHTML}</div></body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => {
    w.print();
  }, 500);
}

/* ─── EXPORT CSV ─────────────────────────────────────────────── */
function exportCSV(form, items, tc) {
  const gt = items.reduce(
    (s, it) => s + (parseFloat(it.amount) || parseFloat(it.quantity || 0) * parseFloat(it.unitPrice || 0)),
    0
  );
  const rows = [
    ["PURCHASE ORDER"],
    ["Voucher No", form.voucherNo, "Date", form.date, "Currency", form.currency],
    ["Reference No & Date", form.refNo + (form.refDate ? " | " + form.refDate : ""), "Other References", form.otherRef],
    [],
    ["INVOICE TO"],
    ["Company", form.invoiceName],
    ["Address", form.invoiceAddress],
    ["GSTIN", form.invoiceGstin],
    ["State", form.invoiceState, "Code", form.invoiceStateCode],
    ["CIN", form.invoiceCin],
    ["PAN", form.pan],
    [],
    ["CONSIGNEE"],
    ["Company", form.consigneeName],
    ["Address", form.consigneeAddress],
    ["GSTIN", form.consigneeGstin],
    ["State", form.consigneeState, "Code", form.consigneeStateCode],
    [],
    ["SUPPLIER"],
    ["Company", form.supplierName],
    ["Address", form.supplierAddress],
    ["Mobile", form.supplierMob],
    ["Email", form.supplierEmail],
    [],
    ["LOGISTICS"],
    ["Dispatched Through", form.dispatchedThrough],
    ["Destination", form.destination],
    ["Terms of Delivery", form.termsOfDelivery],
    [],
    ["S.No.", "Description", "HSN Code", "Due On", "Quantity", "Unit Price", "Unit", "Amount"],
    ...items.map((it, i) => [
      i + 1,
      it.description,
      it.hsn,
      it.dueOn,
      it.quantity,
      it.unitPrice,
      it.unit,
      (
        parseFloat(it.amount) ||
        parseFloat(it.quantity || 0) * parseFloat(it.unitPrice || 0) ||
        0
      ).toFixed(2),
    ]),
    [],
    ["", "", "", "", "", "", "GRAND TOTAL", gt.toFixed(2)],
    ["Amount in Words", amtWords(gt, form.currency)],
    [],
    ["TERMS & CONDITIONS"],
    ...tc.map((t, i) => [i + 1, t]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${String(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `PO_${form.voucherNo.replace(/\//g, "_")}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── EMAIL ─────────────────────────────────────────────────── */
function sendEmail(form, items, gt) {
  const sub = `Purchase Order ${form.voucherNo} – ${form.supplierName}`;
  const b = [
    `Dear ${form.supplierName},`,
    ``,
    `Please find below Purchase Order details:`,
    ``,
    `Voucher No  : ${form.voucherNo}`,
    `Date        : ${form.date}`,
    `Reference   : ${form.refNo}${form.refDate ? " | " + form.refDate : ""}`,
    ``,
    `ITEMS:`,
    ...items.map(
      (it, i) =>
        `  ${i + 1}. ${it.description}` +
        `\n     Qty: ${it.quantity} ${it.unit} @ ${form.currency} ${it.unitPrice} = ${form.currency} ${(
          parseFloat(it.amount) ||
          parseFloat(it.quantity || 0) * parseFloat(it.unitPrice || 0) ||
          0
        ).toFixed(2)}`
    ),
    ``,
    `Total: ${form.currency} ${gt.toFixed(2)}`,
    `(${amtWords(gt, form.currency)})`,
    ``,
    `Regards,`,
    form.invoiceName,
  ].join("\n");
  window.location.href = `mailto:?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(b)}`;
}

/* ═══════════════════════════════════════════════════════════════
   PO DOCUMENT COMPONENT
═══════════════════════════════════════════════════════════════ */
function PODoc({ form, items, tc, id = "po-document" }) {
  const gt = items.reduce(
    (s, it) => s + (parseFloat(it.amount) || parseFloat(it.quantity || 0) * parseFloat(it.unitPrice || 0)),
    0
  );
  return (
    <div className="po-doc" id={id}>
      <div className="po-title">PURCHASE ORDER</div>

      <table className="po-tbl" style={{ marginBottom: 0 }}>
        <tbody>
          <tr>
            <td style={{ width: "50%", verticalAlign: "top" }}>
              <div className="po-lbl">Invoice To</div>
              <div className="po-bold">{form.invoiceName}</div>
              <div style={{ whiteSpace: "pre-line" }}>{form.invoiceAddress}</div>
              <div>GSTIN/UIN: {form.invoiceGstin}</div>
              <div>
                State Name: {form.invoiceState}, Code: {form.invoiceStateCode}
              </div>
              {form.invoiceCin && <div>CIN: {form.invoiceCin}</div>}
            </td>
            <td style={{ width: "25%", verticalAlign: "top" }}>
              <div className="po-lbl">VOUCHER NO</div>
              <div className="po-bold">{form.voucherNo}</div>
              <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid #000", margin: "6px -7px 0", padding: "6px 7px 0" }}>
                <div className="po-lbl">Reference No. &amp; Date</div>
                <div className="po-bold">
                  {form.refNo}
                  {form.refDate && <span> &nbsp;{form.refDate}</span>}
                </div>
              </div>
            </td>
            <td style={{ width: "25%", verticalAlign: "top" }}>
              <div className="po-lbl">Dated</div>
              <div className="po-bold">{form.date}</div>
              <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid #000", margin: "6px -7px 0", padding: "6px 7px 0" }}>
                <div className="po-lbl">Other References</div>
                <div>{form.otherRef || "—"}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="po-tbl" style={{ marginBottom: 0, borderTop: "none" }}>
        <tbody>
          <tr>
            <td style={{ width: "50%", verticalAlign: "top", borderTop: "none" }}>
              <div className="po-lbl">Consignee (Ship to)</div>
              <div className="po-bold">{form.consigneeName}</div>
              <div style={{ whiteSpace: "pre-line" }}>{form.consigneeAddress}</div>
              <div>GSTIN/UIN: {form.consigneeGstin}</div>
              <div>
                State Name: {form.consigneeState}, Code: {form.consigneeStateCode}
              </div>
            </td>
            <td style={{ width: "50%", borderTop: "none", padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", height: "100%" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "none",
                        borderBottom: "1px solid #000",
                        borderRight: "1px solid #000",
                        padding: "5px 7px",
                        width: "50%",
                        verticalAlign: "top",
                      }}
                    >
                      <div className="po-lbl">Dispatched Through</div>
                      <div>{form.dispatchedThrough}</div>
                    </td>
                    <td
                      style={{
                        border: "none",
                        borderBottom: "1px solid #000",
                        padding: "5px 7px",
                        verticalAlign: "top",
                      }}
                    >
                      <div className="po-lbl">Destination</div>
                      <div>{form.destination}</div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: "none", padding: "5px 7px", verticalAlign: "top" }}>
                      <div className="po-lbl">Terms of Delivery</div>
                      <div>{form.termsOfDelivery}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="po-tbl" style={{ marginBottom: 0, borderTop: "none" }}>
        <tbody>
          <tr>
            <td style={{ borderTop: "none" }}>
              <div className="po-lbl">Supplier (Bill from)</div>
              <div className="po-bold">{form.supplierName}</div>
              <div style={{ whiteSpace: "pre-line" }}>{form.supplierAddress}</div>
              <div>Mob : - {form.supplierMob}</div>
              <div>Email : – {form.supplierEmail}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="po-tbl po-items" style={{ marginBottom: 0, borderTop: "none" }}>
        <thead>
          <tr>
            <th style={{ width: "5%" }}>
              S.
              <br />
              No.
            </th>
            <th style={{ width: "40%", textAlign: "left" }}>Description of Goods</th>
            <th style={{ width: "12%" }}>Due On</th>
            <th style={{ width: "10%" }}>Quantity</th>
            <th style={{ width: "12%" }}>
              Unit Price
              <br />({form.currency})
            </th>
            <th style={{ width: "6%" }}>Unit</th>
            <th style={{ width: "15%" }}>
              Amount
              <br />({form.currency})
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => {
            const amt = parseFloat(it.amount) || parseFloat(it.quantity || 0) * parseFloat(it.unitPrice || 0) || 0;
            const rowSpan = 1 + (it.subItems?.length || 0);
            return (
              <React.Fragment key={it.id}>
                <tr>
                  <td className="po-center" style={{ verticalAlign: "middle" }}>{i + 1}</td>
                  <td style={{ verticalAlign: "middle" }}>{it.description}</td>
                  <td rowSpan={rowSpan} className="po-center" style={{ verticalAlign: "middle" }}>{it.dueOn}</td>
                  <td rowSpan={rowSpan} className="po-right" style={{ verticalAlign: "middle" }}>{Number(it.quantity || 0).toLocaleString()}</td>
                  <td rowSpan={rowSpan} className="po-center" style={{ verticalAlign: "middle" }}>{it.unitPrice}</td>
                  <td rowSpan={rowSpan} className="po-center" style={{ verticalAlign: "middle" }}>{it.unit}</td>
                  <td rowSpan={rowSpan} className="po-amt" style={{ verticalAlign: "middle" }}>{amt.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                </tr>
                {it.subItems && it.subItems.map((sub, j) => (
                  <tr key={`${it.id}-sub-${j}`}>
                    <td className="po-center" style={{ verticalAlign: "middle", fontWeight: "bold" }}>{`${i + 1}.${j + 1}`}</td>
                    <td style={{ verticalAlign: "middle" }}>{sub}</td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
          <tr>
            <td colSpan={5}>
              <strong>Note- Currency in {form.currency}</strong>
            </td>
            <td></td>
            <td className="po-amt" style={{ fontSize: 12 }}>
              {gt.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </td>
          </tr>
        </tbody>
      </table>

      <table className="po-tbl" style={{ marginBottom: 0, borderTop: "none" }}>
        <tbody>
          <tr>
            <td style={{ width: "55%", borderTop: "none" }}>
              <div className="po-lbl">Amount Chargeable (in words)</div>
              <div className="po-bold" style={{ marginTop: 3 }}>
                {amtWords(gt, form.currency)}
              </div>
              {form.pan && <div style={{ marginTop: 6, fontSize: 10 }}>Company's PAN: {form.pan}</div>}
            </td>
            <td style={{ width: "45%", textAlign: "right", borderTop: "none" }}>
              <div style={{ height: 42 }}></div>
              <div className="po-bold">for {form.signatoryCompany}</div>
              <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>Authorised Signatory</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="po-tbl" style={{ borderTop: "none" }}>
        <tbody>
          <tr>
            <td colSpan={2} style={{ borderTop: "none" }}>
              <strong>Terms & Conditions:</strong>
            </td>
          </tr>
          {tc.map((t, i) => (
            <tr key={i}>
              <td
                style={{
                  width: "20px",
                  verticalAlign: "top",
                  fontWeight: "bold",
                  textAlign: "center",
                  borderRight: "1px solid #ddd",
                }}
              >
                {i + 1}
              </td>
              <td style={{ whiteSpace: "pre-line", fontSize: 10 }}>{t}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeamMembersPage() {
  const TEAM = [
    { name: "Gurvinder Singh", role: "Chartered Accountant", initials: "GS", color: "#0D9488" },
    { name: "Shadab Khan", role: "Finance Head", initials: "SK", color: "#D97706" },
  ];

  return (
    <div>
      <div className="dash-section-hd" style={{ marginBottom: "1.25rem" }}>
        Team Members
        <span style={{ fontSize: ".78rem", color: "var(--muted)", fontWeight: 400 }}>{TEAM.length} members</span>
      </div>
      <div className="team-grid">
        {TEAM.map((m, i) => (
          <div className="team-card" key={i}>
            <div className="team-av" style={{ background: m.color }}>
              {m.initials}
            </div>
            <div>
              <div className="team-name">{m.name}</div>
              <div className="team-role">{m.role}</div>
              <span
                className="team-badge"
                style={{ background: m.isAdmin ? "#DCFCE7" : "#F1F5F9", color: m.isAdmin ? "#15803D" : "#475569" }}
              >
                {m.isAdmin ? "Super Admin" : "Member"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [screen, setScreen] = useState("landing");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [poList, setPoList] = useState([]);
  const [form, setForm] = useState(defaultForm());
  const [items, setItems] = useState(defaultItems());
  const [tc, setTc] = useState(DEFAULT_TC);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPO, setPreviewPO] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const sf = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const gt = items.reduce(
    (s, it) => s + (parseFloat(it.amount) || parseFloat(it.quantity || 0) * parseFloat(it.unitPrice || 0)),
    0
  );

  const updateItem = (id, key, val) =>
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const u = { ...it, [key]: val };
        if (key === "quantity" || key === "unitPrice") {
          const q = parseFloat(key === "quantity" ? val : it.quantity) || 0;
          const p = parseFloat(key === "unitPrice" ? val : it.unitPrice) || 0;
          u.amount = (q * p).toFixed(2);
        }
        return u;
      })
    );

  const fetchPOs = async () => {
    const { data: pos, error } = await supabase.from("purchase_orders").select("*, po_items(*, po_sub_items(*)), po_terms(*)");
    if (error) { console.error("Error fetching POs:", error); return; }
    
    const mapped = pos.map(dbPo => {
      const mappedItems = dbPo.po_items.sort((a,b) => a.item_index - b.item_index).map(it => ({
         id: it.id, 
         description: it.description || "",
         hsn: it.hsn || "", 
         dueOn: it.due_on || "",
         quantity: it.quantity || "",
         unitPrice: it.unit_price || "",
         unit: it.unit || "NOS",
         amount: it.amount || "",
         subItems: it.po_sub_items.sort((a,b) => a.sub_index - b.sub_index).map(sub => sub.description)
      }));
      const mappedTc = dbPo.po_terms.sort((a,b) => a.term_index - b.term_index).map(t => t.content);

      return {
        id: dbPo.id,
        voucherNo: dbPo.voucher_no,
        date: dbPo.date,
        supplierName: dbPo.supplier_name,
        invoiceName: dbPo.invoice_name,
        currency: dbPo.currency,
        total: parseFloat(dbPo.grand_total) || 0,
        status: dbPo.status || "Active",
        itemCount: mappedItems.length,
        form: {
          voucherNo: dbPo.voucher_no || "", date: dbPo.date || "", currency: dbPo.currency || "USD",
          refNo: dbPo.ref_no || "", refDate: dbPo.ref_date || "", otherRef: dbPo.other_ref || "",
          invoiceName: dbPo.invoice_name || "", invoiceAddress: dbPo.invoice_address || "", invoiceGstin: dbPo.invoice_gstin || "",
          invoiceState: dbPo.invoice_state || "", invoiceStateCode: dbPo.invoice_state_code || "", invoiceCin: dbPo.invoice_cin || "",
          consigneeName: dbPo.consignee_name || "", consigneeAddress: dbPo.consignee_address || "", consigneeGstin: dbPo.consignee_gstin || "",
          consigneeState: dbPo.consignee_state || "", consigneeStateCode: dbPo.consignee_state_code || "",
          supplierName: dbPo.supplier_name || "", supplierAddress: dbPo.supplier_address || "", supplierMob: dbPo.supplier_mob || "",
          supplierEmail: dbPo.supplier_email || "", dispatchedThrough: dbPo.dispatched_through || "", destination: dbPo.destination || "",
          termsOfDelivery: dbPo.terms_of_delivery || "", signatoryCompany: dbPo.signatory_company || "", pan: dbPo.pan || ""
        },
        items: mappedItems,
        tc: mappedTc
      };
    });
    
    mapped.sort((a, b) => {
      const dbA = pos.find(p => p.id === a.id);
      const dbB = pos.find(p => p.id === b.id);
      return new Date(dbB.created_at) - new Date(dbA.created_at);
    });
    setPoList(mapped);
  };

  useEffect(() => {
    fetchPOs();
  }, []);

  const handleSaveAndGenerate = async () => {
    const poData = {
      voucher_no: form.voucherNo, date: form.date, currency: form.currency,
      ref_no: form.refNo, ref_date: form.refDate, other_ref: form.otherRef,
      dispatched_through: form.dispatchedThrough, destination: form.destination, terms_of_delivery: form.termsOfDelivery,
      invoice_name: form.invoiceName, invoice_gstin: form.invoiceGstin, invoice_address: form.invoiceAddress,
      invoice_state: form.invoiceState, invoice_state_code: form.invoiceStateCode, invoice_cin: form.invoiceCin, pan: form.pan,
      consignee_name: form.consigneeName, consignee_gstin: form.consigneeGstin, consignee_address: form.consigneeAddress,
      consignee_state: form.consigneeState, consignee_state_code: form.consignee_state_code,
      supplier_name: form.supplierName, supplier_address: form.supplierAddress, supplier_mob: form.supplierMob, supplier_email: form.supplierEmail,
      signatory_company: form.signatoryCompany, grand_total: gt, status: "Active"
    };

    let poId = editingId;
    if (poId) {
      await supabase.from("purchase_orders").update(poData).eq("id", poId);
      await supabase.from("po_items").delete().eq("po_id", poId);
      await supabase.from("po_terms").delete().eq("po_id", poId);
    } else {
      const { data: newPo, error } = await supabase.from("purchase_orders").insert(poData).select().single();
      if (error) { console.error("Error inserting PO:", error); return; }
      poId = newPo.id;
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemAmount = parseFloat(item.amount) || parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0) || 0;
        const { data: insertedItem } = await supabase.from("po_items").insert({
            po_id: poId, item_index: i + 1, description: item.description, hsn: item.hsn,
            due_on: item.dueOn, quantity: item.quantity, unit_price: item.unitPrice, unit: item.unit, amount: itemAmount
        }).select().single();
        
        if (insertedItem && item.subItems && item.subItems.length > 0) {
            const subInserts = item.subItems.map((sub, j) => ({ item_id: insertedItem.id, sub_index: j + 1, description: sub }));
            await supabase.from("po_sub_items").insert(subInserts);
        }
    }

    if (tc && tc.length > 0) {
        const termInserts = tc.map((t, i) => ({ po_id: poId, term_index: i + 1, content: t }));
        await supabase.from("po_terms").insert(termInserts);
    }

    await fetchPOs();
    setPreviewPO({ form, items, tc });
    setEditingId(null);
    setShowPreview(true);
  };

  const handleEditPO = (po) => {
    setForm({ ...po.form });
    setItems([...po.items]);
    setTc([...po.tc]);
    setEditingId(po.id);
    setActiveTab("create");
  };

  const resetForm = () => {
    setForm(emptyForm());
    setItems(emptyItems());
    setTc([]);
    setEditingId(null);
  };

  const tabTitles = {
    dashboard: { title: "Dashboard Overview", sub: "All purchase orders at a glance" },
    create: { title: "Create Purchase Order", sub: "Fill all sections then click Generate" },
    import: { title: "Import from Excel / CSV", sub: "Upload your template to auto-fill the form" },
    team: { title: "Team Members", sub: "Manage your team and their roles" },
  };

  const totalsByCurrency = poList.reduce((acc, p) => {
    const cur = p.currency || "USD";
    acc[cur] = (acc[cur] || 0) + (p.total || 0);
    return acc;
  }, {});

  const dashboardMetrics = {
    totalOrders: poList.length,
    totalsByCurrency,
    completedOrders: poList.filter((p) => p.status === "Active" || p.status === "Completed").length,
  };

  return (
    <>
      <style>{CSS}</style>

      {screen === "landing" ? (
        <LandingPage
          onOpenDashboard={() => {
            setScreen("app");
            setActiveTab("dashboard");
          }}
          onCreatePO={() => {
            setScreen("app");
            setActiveTab("create");
          }}
        />
      ) : (
        <AppShell
          activeTab={activeTab}
          onTabChange={setActiveTab}
          poList={poList}
          onExportFirstPO={() => {
            if (poList.length > 0) exportCSV(poList[0].form, poList[0].items, poList[0].tc);
            else alert("No POs yet. Create one first.");
          }}
          onPreviewFirstPO={() => {
            if (poList.length > 0) {
              setPreviewPO(poList[0]);
              setShowPreview(true);
            } else {
              alert("No POs yet.");
            }
          }}
          onGoHome={() => setScreen("landing")}
          topbarTitle={tabTitles[activeTab]?.title}
          topbarSub={tabTitles[activeTab]?.sub}
        >
          {activeTab === "dashboard" && (
            <DashboardHomePage
              metrics={dashboardMetrics}
              recentOrders={poList}
              onCreatePurchaseOrder={() => setActiveTab("create")}
              onViewPO={(po) => { setPreviewPO(po); setShowPreview(true); }}
              onEditPO={handleEditPO}
              onDeletePO={(id) => setDeleteId(id)}
              onEmailPO={(po) => sendEmail(po.form, po.items, po.total)}

            />
          )}

          {activeTab === "create" && (
            <CreatePurchaseOrderPage
              form={form} items={items} tc={tc} gt={gt} amtWords={amtWords}
              setForm={setForm} setItems={setItems} setTc={setTc}
              updateItem={updateItem} resetForm={resetForm}
              handleSaveAndGenerate={handleSaveAndGenerate}
              editingId={editingId}
              sf={sf} UNITS={UNITS}
            />
          )}

          {activeTab === "import" && (
            <ImportFromExcelPage
              onImport={(parsedForm, parsedItems, parsedTc) => {
                setForm(f => ({ ...f, ...parsedForm }));
                if (parsedItems.length > 0) setItems(parsedItems);
                if (parsedTc.length > 0) setTc(parsedTc);
                setEditingId(null);
                setActiveTab("create");
              }}
            />
          )}

          {activeTab === "team" && <TeamMembersPage />}
        </AppShell>
      )}

      {showPreview &&
        (() => {
          const po = previewPO || { form, items, tc };
          const totalAmt = po.items.reduce(
            (s, it) => s + (parseFloat(it.amount) || parseFloat(it.quantity || 0) * parseFloat(it.unitPrice || 0)),
            0
          );
          const docId = "po-preview-doc";
          return (
            <div className="modal-bg">
              <div className="modal-inner">
                <div className="modal-toolbar">
                  <div className="modal-title">📋 Purchase Order Preview</div>
                  <div className="modal-btns">
                    <button className="mbtn mbtn-email" onClick={() => sendEmail(po.form, po.items, totalAmt)}>
                      ✉ Share Email
                    </button>
                    <button className="mbtn mbtn-pdf" onClick={() => printElement(docId)}>
                      🖨 Print / PDF
                    </button>
                    <button
                      className="mbtn mbtn-close"
                      onClick={() => {
                        setShowPreview(false);
                        setPreviewPO(null);
                      }}
                    >
                      ✕ Close
                    </button>
                  </div>
                </div>
                <PODoc form={po.form} items={po.items} tc={po.tc} id={docId} />
              </div>
            </div>
          );
        })()}
      {deleteId && (
        <div className="modal-bg" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="confirm-box">
            <div className="confirm-ic">🗑️</div>
            <div className="confirm-t">Delete Purchase Order?</div>
            <div className="confirm-d">Are you sure? This action will permanently remove this purchase order from your database and cannot be undone.</div>
            <div className="confirm-btns">
              <button className="btn-cf btn-cf-can" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-cf btn-cf-del" onClick={async () => { 
                await supabase.from("purchase_orders").delete().eq("id", deleteId);
                await fetchPOs();
                setDeleteId(null); 
              }}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
