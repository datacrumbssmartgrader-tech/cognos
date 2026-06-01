"use client"
import React from "react"

export default function AdminSidebar() {
  return (
    <aside id="sidebar">
      <div className="sidebar-brand">
        <div className="sb-logo-en">Admin</div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-item">Live Orders</div>
        <div className="nav-item">Tables</div>
        <div className="nav-item">Menu</div>
        <div className="nav-item">Alerts</div>
        <div className="nav-item">History</div>
        <div className="nav-item">Payments</div>
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-avatar">N</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">Admin</div>
          <div className="sidebar-user-role">Owner</div>
        </div>
      </div>
    </aside>
  )
}
