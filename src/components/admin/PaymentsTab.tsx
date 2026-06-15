"use client";
import React, { useEffect, useState } from "react";
import * as api from "@/lib/api";
import type { Payment } from "@/lib/api";
import type { LiveOrder } from "./LiveOrders";

interface PaymentsTabProps {
  orders?: LiveOrder[];
  refreshTick?: number;
}

type TableFilter = "all" | "paid" | "due";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(),
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

function filterByDate(payments: Payment[], from: string, to: string) {
  return payments.filter((p) => {
    const timeVal = p.created_at || (p as any).paid_at || new Date().toISOString();
    const d = timeVal.slice(0, 10);
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  });
}

function filterOrdersByDate(orders: LiveOrder[], from: string, to: string) {
  return orders.filter((o) => {
    const timeVal = o.created_at || new Date().toISOString();
    const d = timeVal.slice(0, 10);
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  });
}

// Simple bar chart
function PayGraphChart({ orders, dateFrom, dateTo }: { orders: LiveOrder[]; dateFrom: string; dateTo: string }) {
  const isOneDay = (!dateFrom && !dateTo) || dateFrom === dateTo;

  let labels: string[] = [];
  let values: number[] = [];

  if (isOneDay) {
    values = Array(24).fill(0);
    orders.forEach((o) => { values[new Date(o.created_at).getHours()] += Number(o.total) || 0; });
    labels = Array.from({ length: 24 }, (_, i) =>
      i === 0 ? "12a" : i < 12 ? `${i}a` : i === 12 ? "12p" : `${i - 12}p`
    );
  } else {
    const dayMap = new Map<string, number>();
    orders.forEach((o) => {
      const d = new Date(o.created_at);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      dayMap.set(k, (dayMap.get(k) ?? 0) + (Number(o.total) || 0));
    });
    const sortedKeys = [...dayMap.keys()].sort();
    labels = sortedKeys.map((k) => {
      const d = new Date(k + "T12:00:00");
      return `${d.getDate()}/${d.getMonth() + 1}`;
    });
    values = sortedKeys.map((k) => dayMap.get(k)!);
  }

  const barCount = values.length || 1;
  const maxVal = Math.max(...values, 1) || 1;
  const W = 800, H = 220, padL = 68, padR = 20, padT = 20, padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const gap = chartW / barCount;
  const barW = Math.max(3, gap * 0.65);
  const labelEvery = isOneDay ? 4 : barCount > 14 ? 2 : 1;

  const yLines = [0.25, 0.5, 0.75, 1.0].map((f) => {
    const y = padT + chartH * (1 - f);
    const lblVal = maxVal * f;
    const lbl = lblVal >= 1000 ? `${(lblVal / 1000).toFixed(1)}k` : String(Math.round(lblVal));
    return (
      <React.Fragment key={`line-${f}`}>
        <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="rgba(107,26,42,.08)" strokeWidth="1" />
        <text x={padL - 8} y={y + 4} textAnchor="end" fontFamily="Poppins,sans-serif" fontSize="9" fill="#8A7265">{lbl}</text>
      </React.Fragment>
    );
  });

  return (
    <div className="pay-chart-wrap" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <div className="pay-chart-title" style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1rem" }}>
        {isOneDay ? "Revenue by Hour" : "Revenue by Day"}
        <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--clr-muted)", marginLeft: "0.75rem" }}>
          (non-cancelled orders)
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", background: "var(--clr-surface)", borderRadius: "12px", padding: "1rem" }}>
        {yLines}
        <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="rgba(107,26,42,.18)" strokeWidth="1.5" />
        {values.map((v, i) => {
          const cx = padL + i * gap + gap / 2;
          const bx = cx - barW / 2;
          const barH = v > 0 ? Math.max(2, (v / maxVal) * chartH) : 2;
          const by = padT + chartH - barH;
          const isMax = v === maxVal && v > 0;
          return (
            <React.Fragment key={`bar-${i}`}>
              <rect x={bx} y={by} width={barW} height={barH} rx="2.5" fill={isMax ? "#C9973A" : "#6B1A2A"} opacity={v > 0 ? 1 : 0.1} />
              {v > 0 && barH > 22 && (
                <text x={cx} y={by - 5} textAnchor="middle" fontFamily="Poppins,sans-serif" fontSize="8" fill={isMax ? "#a57a2a" : "#6B1A2A"} fontWeight="600">
                  {v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                </text>
              )}
              {i % labelEvery === 0 && (
                <text x={cx} y={padT + chartH + 16} textAnchor="middle" fontFamily="Poppins,sans-serif" fontSize={barCount > 20 ? 7 : 9} fill="#8A7265">
                  {labels[i]}
                </text>
              )}
            </React.Fragment>
          );
        })}
      </svg>
    </div>
  );
}

export default function PaymentsTab({ refreshTick = 0 }: PaymentsTabProps) {
  const [payments, setPayments]       = useState<Payment[]>([]);
  const [allOrders, setAllOrders]     = useState<LiveOrder[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [dateFrom, setDateFrom]       = useState("");
  const [dateTo, setDateTo]           = useState("");
  const [tableFilter, setTableFilter] = useState<TableFilter>("all");
  const [updatingId, setUpdatingId]   = useState<string | null>(null);
  const [localRefreshTick, setLocalRefreshTick] = useState(0);

  // Self-fetch both payments and orders so stats are always accurate
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.fetchAdminPayments(),
      api.fetchAdminOrders(),
    ]).then(([payRes, ordRes]) => {
      // Payments
      const payData = payRes.data as any;
      const payList: Payment[] = Array.isArray(payData) ? payData : (payData?.payments ?? payData?.items ?? []);
      setPayments(
        payList.map((p: any) => ({
          ...p,
          id: p.id || p.payment_id,
          created_at: p.created_at || p.paid_at || new Date().toISOString(),
          amount: Number(p.amount),
          status: p.status === "confirmed" ? "received" : p.status,
        }))
      );
      // Orders — fetched fresh from DB so Outstanding/Cancelled are accurate
      const ordData = ordRes.data as any;
      const ordList = Array.isArray(ordData) ? ordData : (ordData?.orders ?? []);
      setAllOrders(ordList.map((o: any) => ({ ...o, total: Number(o.total) || 0 })));
    }).finally(() => setIsLoading(false));
  }, [refreshTick, localRefreshTick]);

  // --- Date-filtered slices ---
  const displayedPayments  = filterByDate(payments, dateFrom, dateTo);
  const allDateOrders      = filterOrdersByDate(allOrders, dateFrom, dateTo);
  const nonCancelledOrders = allDateOrders.filter((o) => o.status !== "cancelled");
  const cancelledOrders    = allDateOrders.filter((o) => o.status === "cancelled");

  // --- Stat calculations ---
  const receivedPayments  = displayedPayments.filter((p) => p.status === "received");
  const totalRevenue      = receivedPayments.reduce((s, p) => s + p.amount, 0);
  const receivedCount     = receivedPayments.length;

  // Cancelled = total value of cancelled orders
  const cancelledAmount = cancelledOrders.reduce((s, o) => s + o.total, 0);

  // --- Chart ---
  const chartOrders = nonCancelledOrders;

  // --- Items Sold (from non-cancelled orders) ---
  const itemMap = new Map<string, { name: string; qty: number; revenue: number }>();
  nonCancelledOrders.forEach((o) => {
    o.items.forEach((it) => {
      const e = itemMap.get(it.name);
      if (e) {
        e.qty += it.quantity;
        e.revenue += it.price * it.quantity;
      } else {
        itemMap.set(it.name, { name: it.name, qty: it.quantity, revenue: it.price * it.quantity });
      }
    });
  });
  const topItems = [...itemMap.values()].sort((a, b) => b.qty - a.qty).slice(0, 3);

  // --- Payment Records table rows ---
  const paidRows = [...displayedPayments]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, tableFilter === "paid" ? 10 : 3);

  // Calculate how much has been paid per session
  const sessionPaidMap = new Map<string, number>();
  payments.forEach((p) => {
    if (p.status === "received") {
      sessionPaidMap.set(p.session_id, (sessionPaidMap.get(p.session_id) || 0) + p.amount);
    }
  });

  // Due rows — non-cancelled orders grouped by session_id
  const sessionDueMap = new Map<string, { session_id: string; table_number: string; total: number; created_at: string; statuses: string[] }>();
  nonCancelledOrders.forEach((o) => {
    const e = sessionDueMap.get(o.session_id);
    if (e) {
      e.total += o.total;
      if (!e.statuses.includes(o.status)) e.statuses.push(o.status);
    } else {
      sessionDueMap.set(o.session_id, {
        session_id:   o.session_id,
        table_number: o.table_number,
        total:        o.total,
        created_at:   o.created_at,
        statuses:     [o.status],
      });
    }
  });
  const dueRows = [...sessionDueMap.values()]
    .filter(row => {
      const paid = sessionPaidMap.get(row.session_id) || 0;
      return (row.total - paid) > 0;
    })
    .map(row => {
      const paid = sessionPaidMap.get(row.session_id) || 0;
      return { ...row, total: row.total - paid };
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, tableFilter === "due" ? 10 : 3);

  // Outstanding = sum of remaining unpaid balances from the due rows
  const outstandingAmount = dueRows.reduce((s, row) => s + row.total, 0);

  const handleMarkPaid = async (sessionId: string, amount: number) => {
    setUpdatingId(sessionId);
    try {
      const res = await api.recordPayment(sessionId, amount, "cash");
      if ((res as any).error) {
        alert("Payment failed: " + (res as any).error);
      } else {
        setLocalRefreshTick(Date.now());
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelDue = async (sessionId: string) => {
    setUpdatingId(sessionId);
    try {
      const sessionOrders = allOrders.filter((o) => o.session_id === sessionId && o.status !== "cancelled");
      await Promise.all(sessionOrders.map((o) => api.updateOrderStatus(o.id, "cancelled")));
      setLocalRefreshTick(Date.now());
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    window.location.href = `/api/admin/payments/export/excel${params.toString() ? `?${params}` : ""}`;
  };

  // Rs. text badge for revenue card, icons for others
  const stats = [
    {
      label: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--clr-gold)", fontFamily: "monospace" }}>Rs.</span>,
    },
    {
      label: "Payments Received",
      value: String(receivedCount),
      icon: <i className="ri-checkbox-circle-line" style={{ fontSize: "1.8rem", color: "#48bb78" }} />,
    },
    {
      label: "Outstanding (Due)",
      value: `Rs. ${outstandingAmount.toLocaleString()}`,
      icon: <i className="ri-hourglass-line" style={{ fontSize: "1.8rem", color: "#ed8936" }} />,
    },
    {
      label: "Cancelled Orders",
      value: `Rs. ${cancelledAmount.toLocaleString()}`,
      icon: <i className="ri-close-circle-line" style={{ fontSize: "1.8rem", color: "#e53e3e" }} />,
    },
  ];

  return (
    <section id="section-payments">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Payments</h1>
          <p className="section-sub" id="payments-sub">Payment overview</p>
        </div>
        <div
          className="section-actions"
          style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem", flexWrap: "nowrap", whiteSpace: "nowrap" }}
        >
          <input type="date" className="filter-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <input type="date" className="filter-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      {/* ── 4 Stat Cards ─────────────────────────────────────── */}
      <div
        id="payments-stats"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{ background: "var(--clr-surface)", borderRadius: "12px", padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}
          >
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: "2.2rem" }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--clr-muted)", marginBottom: "0.2rem" }}>{stat.label}</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <PayGraphChart orders={chartOrders} dateFrom={dateFrom} dateTo={dateTo} />

      {/* ── Items Sold ────────────────────────────────────────── */}
      <div className="section-header" style={{ marginTop: "2rem", padding: "0" }}>
        <div>
          <h1 className="section-title">Items Sold</h1>
          <p className="section-sub">Top 3 sold items this period</p>
        </div>
        <div className="section-actions">
          <button
            className="btn-primary"
            onClick={() => {
              const params = new URLSearchParams();
              if (dateFrom) params.set("from", dateFrom);
              if (dateTo) params.set("to", dateTo);
              window.location.href = `/api/admin/orders/items-sold/export/excel${params.toString() ? `?${params}` : ""}`;
            }}
          >
            <i className="ri-file-excel-line"></i> Export
          </button>
        </div>
      </div>

      <div className="menu-table-wrap">
        <table className="menu-table">
          <thead>
            <tr>
              <th className="text-center" style={{ width: "3rem" }}>#</th>
              <th>Item</th>
              <th className="text-right">Qty Sold</th>
              <th className="text-right">Revenue (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {topItems.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--clr-muted)" }}>
                  No items sold in this period
                </td>
              </tr>
            ) : (
              topItems.map((item, i) => (
                <tr key={item.name}>
                  <td className="text-center">
                    <span className={`sell-rank sell-rank-${i + 1 <= 3 ? i + 1 : "n"}`}>{i + 1}</span>
                  </td>
                  <td style={{ fontFamily: "var(--ff-ui)", fontSize: ".85rem" }}>{item.name}</td>
                  <td className="text-right" style={{ fontFamily: "var(--ff-ui)", fontWeight: 700 }}>{item.qty}</td>
                  <td className="text-right" style={{ fontFamily: "var(--ff-ui)", fontWeight: 700, color: "var(--clr-primary)" }}>
                    Rs. {item.revenue.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Payment Records ───────────────────────────────────── */}
      <div className="section-header" style={{ marginTop: "2rem", padding: "0" }}>
        <div>
          <h1 className="section-title">Payment Records</h1>
          <p className="section-sub">
            {tableFilter === "all"
              ? "3 newest paid + 3 newest due"
              : tableFilter === "paid"
              ? "Confirmed payments"
              : "Unpaid / outstanding orders"}
          </p>
        </div>
        <div className="section-actions" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {/* Filter tabs: All / Paid / Due */}
          <div style={{ display: "flex", background: "var(--clr-surface)", borderRadius: "8px", padding: "3px", gap: "2px" }}>
            {(["all", "paid", "due"] as TableFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setTableFilter(f)}
                style={{
                  padding: "5px 14px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.15s",
                  background: tableFilter === f ? "var(--clr-primary)" : "transparent",
                  color: tableFilter === f ? "#fff" : "var(--clr-muted)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={handleExport}>
            <i className="ri-file-excel-line"></i> Export
          </button>
        </div>
      </div>

      <div className="menu-table-wrap">
        <table className="menu-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Date</th>
              <th>Time</th>
              <th className="text-right">Amount (Rs.)</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody id="payments-tbody">
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--clr-muted)" }}>Loading…</td>
              </tr>
            ) : (
              <>
                {/* ── Paid rows ── */}
                {(tableFilter === "all" || tableFilter === "paid") &&
                  (paidRows.length === 0 && tableFilter === "paid" ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--clr-muted)" }}>No payment records found</td>
                    </tr>
                  ) : (
                    paidRows.map((p) => {
                      const { date, time } = formatDateTime(p.created_at);
                      const isUpdating = updatingId === p.id;
                      return (
                        <tr key={`paid-${p.id}`}>
                          <td style={{ fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 600 }}>#{p.session_id.slice(0, 8)}</td>
                          <td>{date}</td>
                          <td>{time}</td>
                          <td className="text-right">Rs. {p.amount.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${p.status === "received" ? "badge-served" : p.status === "cancelled" ? "badge-cancelled" : "badge-received"}`} style={p.status === "pending" ? { background: "rgba(237,137,54,0.12)", color: "#c05621" } : undefined}>
                              {p.status === "pending" ? "Due" : p.status}
                            </span>
                          </td>
                          <td className="text-center">
                            <span style={{ color: "var(--clr-muted)", fontSize: "0.8rem", fontWeight: 600 }}>—</span>
                          </td>
                        </tr>
                      );
                    })
                  ))}

                {/* ── Due rows ── */}
                {(tableFilter === "all" || tableFilter === "due") &&
                  (dueRows.length === 0 && tableFilter === "due" ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--clr-muted)" }}>No outstanding orders</td>
                    </tr>
                  ) : (
                    dueRows.map((row) => {
                      const { date, time } = formatDateTime(row.created_at);
                      const latestStatus = row.statuses[row.statuses.length - 1];
                      return (
                        <tr key={`due-${row.session_id}`}>
                          <td style={{ fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 600 }}>T{row.table_number}</td>
                          <td>{date}</td>
                          <td>{time}</td>
                          <td className="text-right">Rs. {row.total.toLocaleString()}</td>
                          <td>
                            <span className="badge" style={{ background: "rgba(237,137,54,0.12)", color: "#c05621" }}>
                              Due
                            </span>
                          </td>
                          <td className="text-center">
                            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                              <button
                                className="btn-primary"
                                disabled={updatingId === row.session_id}
                                onClick={() => handleMarkPaid(row.session_id, row.total)}
                                style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem", borderRadius: "6px" }}
                              >
                                {updatingId === row.session_id ? "Saving..." : "Mark Paid"}
                              </button>
                              <button
                                className="btn-ghost"
                                disabled={updatingId === row.session_id}
                                onClick={() => handleCancelDue(row.session_id)}
                                style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem", borderRadius: "6px", color: "var(--clr-error)", border: "1px solid rgba(229, 62, 62, 0.2)" }}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ))}

                {/* Empty state for "all" when both empty */}
                {tableFilter === "all" && paidRows.length === 0 && dueRows.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--clr-muted)" }}>No records found</td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
