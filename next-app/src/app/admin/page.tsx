"use client";
import React, { useEffect } from "react";
import "./admin.css";
import { initAdmin,alerts } from "./adminClient";

export default function AdminPage() {
  useEffect(() => {
    // 1. Initialize your buttons and dashboard actions
    initAdmin();

    // 2. Start the timer safely here! (Next.js only runs this inside the browser)
    const intervalId = setInterval(() => {
      const sa = localStorage.getItem('riwayat_alerts');
      if (sa) {
        try {
          const parsed = JSON.parse(sa);
          // Check if alerts data has actually changed
          if (JSON.stringify(parsed) !== JSON.stringify(alerts)) {
            
            // Force your legacy script variables to update
            // Since alerts was exported as a let variable, we can mutate its contents:
            alerts.length = 0; 
            alerts.push(...parsed);

            // Trigger the badge update if the function is active in your DOM
            // @ts-ignore
            if (typeof updateBadges === 'function') {
              // @ts-ignore
              updateBadges();
            }
          }
        } catch (e) {
          console.error("Failed to parse alerts in background loop", e);
        }
      }
    }, 1000);

    // 3. If someone leaves the admin page, clear the timer so it doesn't cause leaks
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <>
      

{/* ═══════════════════════════ LOGIN SCREEN ═══════════════════════════ */}
<div id="login-screen">
  <div className="login-bg"></div>
  <div className="login-card">
    <div className="login-logo">
      <span className="login-logo-en">ROOSTER'S DEN</span>
      <span className="login-logo-ur">روایات</span>
    </div>
    <p className="login-subtitle">Staff Access</p>

    <div className="pin-field">
      <label className="pin-label">PIN</label>
      <input id="pin-input" type="password" inputmode="numeric" maxlength="4"
             placeholder="• • • •" autocomplete="off" />
    </div>

    <button id="btn-login" className="login-btn">
      <i className="ri-login-circle-line"></i> Sign In
    </button>
    <p id="login-error" className="login-error" hidden>Incorrect PIN. Please try again.</p>
  </div>
</div>

{/* ═══════════════════════════ DASHBOARD ═══════════════════════════ */}
<div id="dashboard" hidden>

  {/* Sidebar overlay (tablet) */}
  <div id="sidebar-overlay"></div>

  {/* ── Sidebar ── */}
  <aside id="sidebar">
    <div className="sidebar-brand">
      <span className="sb-logo-en">ROOSTER'S DEN</span>
      <span className="sb-logo-ur">روایات</span>
    </div>

    <nav className="sidebar-nav" id="sidebar-nav">
      <a className="nav-item active" data-section="orders">
        <i className="ri-restaurant-line"></i>
        <span>Live Orders</span>
        <span className="nav-badge" id="nav-badge-orders" hidden></span>
      </a>
      <a className="nav-item" data-section="tables">
        <i className="ri-layout-grid-line"></i>
        <span>Tables</span>
      </a>
      <a className="nav-item" data-section="menu">
        <i className="ri-book-open-line"></i>
        <span>Menu</span>
      </a>
      <a className="nav-item" data-section="alerts">
        <i className="ri-alarm-warning-line"></i>
        <span>Alerts</span>
        <span className="nav-badge" id="nav-badge-alerts" hidden></span>
      </a>
      <a className="nav-item" data-section="history">
        <i className="ri-history-line"></i>
        <span>Order History</span>
      </a>
      <a className="nav-item" data-section="payments">
        <i className="ri-secure-payment-line"></i>
        <span>Payments</span>
      </a>
    </nav>

    <div className="sidebar-footer">
      <div className="sidebar-user">
        <div className="sidebar-avatar" id="sidebar-avatar"></div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name" id="sidebar-user-name"></span>
          <span className="sidebar-user-role" id="sidebar-user-role"></span>
        </div>
      </div>
      <button id="btn-logout" className="logout-btn" title="Sign out">
        <i className="ri-logout-box-r-line"></i>
      </button>
    </div>
  </aside>

  {/* ── Main ── */}
  <div id="main">

    {/* Topbar (tablet / mobile) */}
    <header id="topbar">
      <button id="btn-hamburger" aria-label="Open menu">
        <i className="ri-menu-line"></i>
      </button>
      <span className="topbar-title" id="topbar-title">Live Orders</span>
      <div className="topbar-user">
        <div className="topbar-avatar" id="topbar-avatar"></div>
      </div>
    </header>

    {/* ── Section: Live Orders ── */}
    <section id="section-orders" className="section active">
      <div className="section-header">
        <div>
          <h1 className="section-title">Live Orders</h1>
          <p className="section-sub" id="orders-sub">All active table orders</p>
        </div>
        <div className="section-actions">
          <select id="orders-filter" className="filter-select">
            <option value="active">Active only</option>
            <option value="all">Show all</option>
          </select>
        </div>
      </div>
      <div id="orders-grid" className="orders-grid"></div>
    </section>

    {/* ── Section: Tables ── */}
    <section id="section-tables" className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Tables</h1>
          <p className="section-sub">12 tables — click any to view session</p>
        </div>
      </div>
      <div id="tables-grid" className="tables-grid"></div>
    </section>

    {/* ── Section: Menu Management ── */}
    <section id="section-menu" className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Menu Management</h1>
          <p className="section-sub">34 items across 7 categories</p>
        </div>
        <div className="section-actions">
          <select id="menu-cat-filter" className="filter-select">
            <option value="all">All Categories</option>
            <option value="starters">Starters</option>
            <option value="grills">Grills</option>
            <option value="karahi">Karahi &amp; Curries</option>
            <option value="biryani">Biryani &amp; Rice</option>
            <option value="breads">Breads</option>
            <option value="desserts">Desserts</option>
            <option value="beverages">Beverages</option>
          <option value="platters">Platters</option>
          </select>
          <button id="btn-add-item" className="btn-primary admin-only">
            <i className="ri-add-line"></i> Add Item
          </button>
        </div>
      </div>
      <div className="menu-table-wrap">
        <table id="menu-table" className="menu-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th className="text-right">Price (PKR)</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody id="menu-tbody"></tbody>
        </table>
      </div>
    </section>

    {/* ── Section: Waiter Alerts ── */}
    <section id="section-alerts" className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Waiter Alerts</h1>
          <p className="section-sub" id="alerts-sub">Pending requests from tables</p>
        </div>
        <div className="section-actions">
          <button id="btn-dismiss-all" className="btn-ghost">
            <i className="ri-check-double-line"></i> Dismiss All
          </button>
        </div>
      </div>
      <div id="alerts-list" className="alerts-list"></div>
    </section>

    {/* ── Section: Order History ── */}
    <section id="section-history" className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Order History</h1>
          <p className="section-sub" id="history-sub">All orders received</p>
        </div>
        <div className="section-actions history-filters">
          <input id="history-search" type="text" className="filter-input history-search-input" placeholder="Search order or item…" />
          <select id="history-table-filter" className="filter-select">
            <option value="">All Tables</option>
            <option value="T01">T01</option>
            <option value="T02">T02</option>
            <option value="T03">T03</option>
            <option value="T04">T04</option>
            <option value="T05">T05</option>
            <option value="T06">T06</option>
            <option value="T07">T07</option>
            <option value="T08">T08</option>
            <option value="T09">T09</option>
            <option value="T10">T10</option>
            <option value="T11">T11</option>
            <option value="T12">T12</option>
          </select>
          <select id="history-status-filter" className="filter-select">
            <option value="">All Statuses</option>
            <option value="received">Received</option>
            <option value="kitchen">In Kitchen</option>
            <option value="ready">Ready</option>
            <option value="served">Served</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input id="history-date-from" type="date" className="filter-input" title="From date" />
          <input id="history-date-to"   type="date" className="filter-input" title="To date" />
        </div>
      </div>
      <div className="menu-table-wrap">
        <table className="menu-table" id="history-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Table</th>
              <th>Time</th>
              <th>Items</th>
              <th className="text-right">Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="history-tbody"></tbody>
        </table>
      </div>
    </section>
{/* ── Section: Payments ── */}
<section id="section-payments" className="section">
  <div className="section-header">
    <div>
      <h1 className="section-title">Payments</h1>
      <p className="section-sub" id="payments-sub">Today's payment overview</p>
    </div>

    <div className="section-actions">
      <input id="payments-date-from" type="date" className="filter-input" />
      <input id="payments-date-to" type="date" className="filter-input" />
    </div>
  </div>

  {/* Overview + Orders + Payments in same tab */}
  <div className="pay-panel active" id="pay-panel-overview">

    {/* Stats */}
    <div className="payments-stats" id="payments-stats"></div>

    {/* Graph */}
    <div className="pay-chart-wrap" id="pay-chart-wrap"></div>

    {/* Items Sold Table */}
    <div className="section-header" style={{"marginTop":"1.5rem","padding":"0"}}>
      <div>
        <h1 className="section-title">Items Sold</h1>
        <p className="section-sub">Most sold items this period</p>
      </div>
      <div className="section-actions">
        <button id="btn-export-items" className="btn-primary"><i className="ri-file-excel-line"></i> Export Items</button>
      </div>
    </div>

    <div className="menu-table-wrap">
      <table className="menu-table">
        <thead>
          <tr>
            <th className="text-center" style={{"width":"3rem"}}>#</th>
            <th>Item</th>
            <th>Category</th>
            <th className="text-right">Qty Sold</th>
            <th className="text-right">Revenue</th>
          </tr>
        </thead>

        <tbody id="items-sold-tbody"></tbody>
      </table>
    </div>

    {/* Payment Records Heading with Export Button */}
    <div className="section-header" style={{"marginTop":"2rem","padding":"0"}}>
      <div>
        <h1 className="section-title">Payment Records</h1>
        <p className="section-sub">All payments received</p>
      </div>
      <div className="section-actions">
        <button id="btn-export-payments" className="btn-primary"><i className="ri-file-excel-line"></i> Export Payments</button>
      </div>
    </div>

    {/* Payment Records Table */}
    <div className="menu-table-wrap">
      <table className="menu-table">
        <thead>
          <tr>
            <th>Table</th>
            <th>Date</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Orders</th>
            <th className="text-right">Total</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody id="payments-tbody"></tbody>
      </table>
    </div>

  </div>
</section>
  </div>{/* /main */}
</div>{/* /dashboard */}

{/* ═══════════════════════════ MODALS ═══════════════════════════ */}

{/* Cancel Order Modal */}
<div id="modal-cancel" className="modal-backdrop" hidden>
  <div className="modal">
    <div className="modal-header">
      <h2 className="modal-title">Cancel Order</h2>
      <button className="modal-close" data-modal="modal-cancel"><i className="ri-close-line"></i></button>
    </div>
    <div className="modal-body">
      <p className="modal-desc">Select a reason for cancellation:</p>
      <select id="cancel-reason" className="modal-select">
        <option value="item-unavailable">Item no longer available</option>
        <option value="customer-request">Customer request</option>
        <option value="kitchen-error">Kitchen error</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div className="modal-footer">
      <button className="btn-ghost" data-modal="modal-cancel">Go Back</button>
      <button id="btn-confirm-cancel" className="btn-danger">Cancel Order</button>
    </div>
  </div>
</div>

{/* Table Bill Modal */}
<div id="modal-table-bill" className="modal-backdrop" hidden>
  <div className="modal modal-wide">
    <div className="modal-header">
      <h2 className="modal-title" id="table-bill-title">Table Bill</h2>
      <button className="modal-close" data-modal="modal-table-bill"><i className="ri-close-line"></i></button>
    </div>
    <div className="modal-body" id="table-bill-body"></div>
    <div className="modal-footer">
      <button className="btn-ghost" data-modal="modal-table-bill">Close</button>
      <button id="btn-mark-paid" className="btn-primary">
        <i className="ri-secure-payment-line"></i> Mark as Paid
      </button>
      <button id="btn-reset-table" className="btn-danger">Reset Table</button>
    </div>
  </div>
</div>

{/* Add/Edit Menu Item Modal */}
<div id="modal-menu-item" className="modal-backdrop" hidden>
  <div className="modal modal-wide">
    <div className="modal-header">
      <h2 className="modal-title" id="menu-item-modal-title">Add Item</h2>
      <button className="modal-close" data-modal="modal-menu-item"><i className="ri-close-line"></i></button>
    </div>
    <div className="modal-body">
      <div className="form-grid">

        {/* Item type toggle */}
        <div className="form-group form-full">
          <label className="form-label">Type</label>
          <div className="type-tabs" id="item-type-tabs">
            <button className="type-tab active" data-type="single">Single Item</button>
            <button className="type-tab" data-type="platter">Platter</button>
          </div>
        </div>

        {/* Name */}
        <div className="form-group form-full">
          <label className="form-label">Name</label>
          <input id="mi-name" type="text" className="form-input" placeholder="e.g. Chicken Karahi" />
        </div>

        {/* Category + Price */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <select id="mi-cat" className="form-input">
            <option value="starters">Starters</option>
            <option value="grills">Grills</option>
            <option value="karahi">Karahi &amp; Curries</option>
            <option value="biryani">Biryani &amp; Rice</option>
            <option value="breads">Breads</option>
            <option value="desserts">Desserts</option>
            <option value="beverages">Beverages</option>
            <option value="platters">Platters</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Price (PKR)</label>
          <input id="mi-price" type="number" className="form-input" placeholder="1200" min="0" />
        </div>
        <div className="form-group">
          <label className="form-label">Prep Time (mins)</label>
          <input id="mi-prep-time" type="number" className="form-input" placeholder="15" min="0" />
        </div>

        {/* Description */}
        <div className="form-group form-full">
          <label className="form-label">Description</label>
          <textarea id="mi-desc" className="form-input form-textarea" placeholder="Short description…" rows="2"></textarea>
        </div>

        {/* Image upload */}
        <div className="form-group form-full">
          <label className="form-label">Image</label>
          <div className="img-upload-area" id="img-upload-area">
            <img id="img-preview" alt="preview" hidden />
            <div className="upload-placeholder" id="upload-placeholder">
              <i className="ri-image-add-line"></i>
              <span>Click to upload image</span>
              <small>JPG, PNG, WEBP</small>
            </div>
            <input id="mi-img-file" type="file" accept="image/*" hidden />
          </div>
        </div>

        {/* Platter components (shown when type = platter) */}
        <div className="form-group form-full" id="platter-components-group" hidden>
          <label className="form-label">Items in this Platter</label>
          <div className="platter-items-list" id="platter-items-list"></div>
        </div>

        {/* Discount */}
        <div className="form-group">
          <label className="form-label">Discount</label>
          <select id="mi-discount-type" className="form-input">
            <option value="none">No Discount</option>
            <option value="percent">Percentage (%)</option>
            <option value="flat">Flat Amount (PKR)</option>
          </select>
        </div>
        <div className="form-group" id="discount-value-group" hidden>
          <label className="form-label" id="discount-value-label">Value</label>
          <input id="mi-discount-value" type="number" className="form-input" placeholder="0" min="0" />
        </div>

      </div>
    </div>
    <div className="modal-footer">
      <button className="btn-ghost" data-modal="modal-menu-item">Cancel</button>
      <button id="btn-save-item" className="btn-primary">Save Item</button>
    </div>
  </div>
</div>

{/* Toast stack */}
<div id="toastStack"></div>



    </>
  );
}
