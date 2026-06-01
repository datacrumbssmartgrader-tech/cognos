"use client"
import React, { useEffect, useRef, useState } from "react"
import { MENU } from "@/lib/menuData"

type OrderStatus = "received" | "kitchen" | "ready" | "served" | "paid" | "cancelled"

interface OrderItem {
  name: string
  qty: number
  price: number
}

interface Order {
  id: string
  table: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  placedAt: number
}

const STATUS_FLOW: OrderStatus[] = ["received", "kitchen", "ready", "served", "paid"]

function formatTime(ts: number) {
  const d = new Date(ts)
  return d.toLocaleTimeString()
}

export default function LiveOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const nextId = useRef(1)
  const timers = useRef<Record<string, number[]>>({})

  useEffect(() => {
    // start mock order generator
    const gen = setInterval(() => {
      addMockOrder()
    }, 12000)

    // seed a couple orders immediately
    addMockOrder()
    const t = setTimeout(addMockOrder, 2000)

    return () => {
      clearInterval(gen)
      clearTimeout(t)
      // clear any pending timers
      Object.values(timers.current).flat().forEach(id => clearTimeout(id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function rnd(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }

  function pickItems() {
    const count = rnd(1, 4)
    const items: OrderItem[] = []
    for (let i = 0; i < count; i++) {
      const m = MENU[rnd(0, MENU.length - 1)]
      items.push({ name: m.name, qty: rnd(1, 2), price: m.price })
    }
    return items
  }

  function calcTotal(items: OrderItem[]) {
    return items.reduce((s, it) => s + it.price * it.qty, 0)
  }

  function scheduleAutoProgress(orderId: string) {
    // move to `kitchen` after 8s, `ready` after 18s
    const ids: number[] = []
    const t1 = window.setTimeout(() => updateStatus(orderId, "kitchen"), 8000)
    ids.push(t1)
    const t2 = window.setTimeout(() => updateStatus(orderId, "ready"), 18000)
    ids.push(t2)
    timers.current[orderId] = ids
  }

  function addMockOrder() {
    const items = pickItems()
    const id = String(nextId.current++)
    const order: Order = {
      id,
      table: `T${rnd(1,20).toString().padStart(2,'0')}`,
      items,
      total: calcTotal(items),
      status: "received",
      placedAt: Date.now()
    }
    setOrders(prev => [order, ...prev])
    scheduleAutoProgress(order.id)
  }

  function updateStatus(id: string, status: OrderStatus) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  function advanceOrder(id: string) {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o
      const idx = STATUS_FLOW.indexOf(o.status as OrderStatus)
      const next = idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : o.status
      return { ...o, status: next }
    }))
  }

  function markPaid(id: string) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "paid" } : o))
  }

  function cancelOrder(id: string) {
    // clear timers
    if (timers.current[id]) timers.current[id].forEach(t => clearTimeout(t))
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "cancelled" } : o))
  }

  return (
    <section>
      <div className="section-header">
        <div>
          <div className="section-title">Live Orders</div>
          <div className="section-sub">Mock orders stream — admin actions enabled</div>
        </div>
        <div className="section-actions">
          <button className="btn-ghost" onClick={() => addMockOrder()}>Add mock order</button>
        </div>
      </div>

      <div className="orders-grid mt-4">
        {orders.length === 0 && (
          <div className="orders-empty">No live orders</div>
        )}

        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-head">
              <div className="order-table-badge">{order.table}</div>
              <div className="order-id">#{order.id} • {formatTime(order.placedAt)}</div>
              <div className={`badge ${order.status === 'received' ? 'badge-received' : order.status === 'kitchen' ? 'badge-kitchen' : order.status === 'ready' ? 'badge-ready' : order.status === 'served' ? 'badge-served' : order.status === 'paid' ? 'badge-paid' : 'badge-cancelled'}`}>{order.status}</div>
            </div>
            <div className="order-card-body">
              <div className="order-items">
                {order.items.map((it, idx) => (
                  <div key={idx} className="order-item-row">
                    <div className="order-item-qty">{it.qty}x</div>
                    <div className="order-item-name">{it.name}</div>
                    <div className="order-item-price">PKR {it.price * it.qty}</div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <div className="order-total-label">Total</div>
                <div className="order-total-amount">PKR {order.total}</div>
              </div>
            </div>
            <div className="order-card-foot">
              <div className="order-status-btns">
                <button className="btn-status btn-status-next" onClick={() => advanceOrder(order.id)}>Next</button>
                <button className="btn-status btn-status-cancel" onClick={() => cancelOrder(order.id)}>Cancel</button>
              </div>
              <div className="order-actions">
                <button className="btn-icon" onClick={() => markPaid(order.id)}>Mark paid</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
