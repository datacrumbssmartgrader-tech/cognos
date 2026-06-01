"use client";

import { useState, useEffect } from "react";
import DineHeader from "@/components/dine/DineHeader";
import CategoryTabs from "@/components/dine/CategoryTabs";
import MenuGrid from "@/components/dine/MenuGrid";
import ItemDetailSheet from "@/components/dine/ItemDetailSheet";
import CartScreen, { CartItem } from "@/components/dine/CartScreen";
import OrderTracker, { OrderBatch } from "@/components/dine/OrderTracker";
import BillScreen from "@/components/dine/BillScreen";
import WaiterSheet from "@/components/dine/WaiterSheet";
import PaymentSheet from "@/components/dine/PaymentSheet";
import WelcomeScreen from "@/components/dine/WelcomeScreen";
import UserDetailsScreen from "@/components/dine/UserDetailsScreen";
import { MenuItem, Extra } from "@/lib/menuData";

export default function DinePage() {
  const [tableNumber, setTableNumber] = useState("T01");
  const [activeScreen, setActiveScreen] = useState<"loading" | "user-details" | "welcome" | "menu" | "cart" | "tracker" | "bill">("loading");
  
  // Menu state
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Cart & Orders state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderBatch[]>([]);
  const [nextCartId, setNextCartId] = useState(1);
  const [nextOrderId, setNextOrderId] = useState(1);
  const [currentBillingRound, setCurrentBillingRound] = useState(1);
  const [paidRounds, setPaidRounds] = useState<Set<number>>(new Set());

  // Sheets state
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemSheetOpen, setItemSheetOpen] = useState(false);
  const [waiterSheetOpen, setWaiterSheetOpen] = useState(false);
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);

  // Toast state
  const [toastMsg, setToastMsg] = useState<{msg: string, type: string} | null>(null);
  const [hasRequestedBill, setHasRequestedBill] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    if (table) setTableNumber(table);

    const previewScreen = params.get('screen');
    const storedUser = sessionStorage.getItem('riwayat_user');
    
    if (!storedUser) {
      setActiveScreen("user-details");
    } else if (previewScreen === 'menu') {
      setActiveScreen("menu");
    } else {
      setActiveScreen("welcome");
    }
  }, []);

  const handleUserDetailsSubmit = (details: { name: string; email: string; phone: string }) => {
    sessionStorage.setItem('riwayat_user', JSON.stringify(details));
    setActiveScreen("welcome");
  };

  // Listens to scroll offsets to add the compressed height class to the menu top hero panel
  const handleMenuScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 40) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const showToast = (msg: string, type: string = 'success') => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleQuickAdd = (item: MenuItem) => {
    const existing = cart.find(c => c.menuId === item.id && c.note === '');
    if (existing) {
      setCart(cart.map(c => c.id === existing.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, {
        id: String(nextCartId),
        menuId: item.id,
        name: item.name,
        price: item.price,
        qty: 1,
        note: '',
        img: item.img,
        cat: item.cat,
        prepTime: item.prepTime || 15
      }]);
      setNextCartId(prev => prev + 1);
    }
    showToast(`${item.name} added`, 'success');
  };

  const handleAddToCart = (item: MenuItem, qty: number, note: string, selectedExtras: Extra[]) => {
    const extrasTotal = selectedExtras.reduce((s, e) => s + e.price, 0);
    const unitPrice = item.price + extrasTotal;
    const extrasLabel = selectedExtras.map(e => e.label).join(', ');
    const fullNote = [extrasLabel, note].filter(Boolean).join(' · ');

    const existing = cart.find(c => c.menuId === item.id && c.note === fullNote);
    if (existing) {
      setCart(cart.map(c => c.id === existing.id ? { ...c, qty: c.qty + qty } : c));
    } else {
      setCart([...cart, {
        id: String(nextCartId),
        menuId: item.id,
        name: item.name,
        price: unitPrice,
        qty,
        note: fullNote,
        img: item.img,
        cat: item.cat,
        prepTime: item.prepTime || 15
      }]);
      setNextCartId(prev => prev + 1);
    }
    setItemSheetOpen(false);
    showToast(`${item.name} added to cart`, 'success');
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          if (newQty <= 0) return null;
          return { ...item, qty: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handlePlaceOrder = () => {
    const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const batch: OrderBatch = {
      id: String(nextOrderId),
      items: [...cart],
      total: subtotal,
      status: 'received',
      placedAt: Date.now(),
      billingRound: currentBillingRound,
    };
    setOrders([...orders, batch]);
    setNextOrderId(prev => prev + 1);
    setCart([]);
    showToast('Order placed! Kitchen is on it.', 'success');
    setActiveScreen('tracker');
  };

  const handleWaiterAlert = (msg: string, isComplaint: boolean) => {
    setWaiterSheetOpen(false);
    showToast(isComplaint ? 'Message submitted' : 'Waiter called', 'success');
  };

  const handlePaymentSuccess = () => {
    setPaymentSheetOpen(false);
    const newPaidRounds = new Set(paidRounds);
    orders.forEach(b => newPaidRounds.add(b.billingRound));
    setPaidRounds(newPaidRounds);
    setCurrentBillingRound(prev => prev + 1);
    showToast('Payment successful!', 'success');
  };

  const unpaidOrders = orders.filter(b => !paidRounds.has(b.billingRound));
  const amountDue = unpaidOrders.reduce((sum, b) => sum + b.total, 0);

  return (
    <div id="app">
      {activeScreen === "loading" && <div className="screen" style={{ backgroundColor: "var(--clr-bg)" }}></div>}
      
      {activeScreen === "user-details" && (
        <UserDetailsScreen onSubmit={handleUserDetailsSubmit} />
      )}

      {activeScreen === "welcome" && (
        <WelcomeScreen 
          tableNumber={tableNumber} 
          onBrowseMenu={() => setActiveScreen("menu")}
          onCallWaiter={() => setWaiterSheetOpen(true)}
        />
      )}

      {(activeScreen === "menu" || activeScreen === "cart" || activeScreen === "tracker" || activeScreen === "bill") && (
        <>
          {/* The #screen-menu selector rules and variable height tracking logic 
            are only mounted when the user is actively viewing the menu view.
          */}
          <div 
            id={activeScreen === "menu" ? "screen-menu" : undefined} 
            className={`screen ${activeScreen === "menu" && isScrolled ? "scrolled" : ""}`}
          >
        
        {/* TABS HEADER SYSTEM */}
        {activeScreen === "menu" ? (
          /* TAB STYLE A: MAIN MENU 
             Gets the big hero image background header block (.menu-top) and categories bar.
          */
          <>
            <div className="menu-header-block">
              <DineHeader 
                tableNumber={tableNumber} 
                onCallWaiter={() => setWaiterSheetOpen(true)}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                onClearSearch={() => setSearchQuery("")}
              />
              <CategoryTabs 
                activeCategory={activeCategory} 
                onCategoryChange={setActiveCategory} 
              />
            </div>

            <div className="menu-scroll" onScroll={handleMenuScroll}>
              <MenuGrid 
                activeCategory={activeCategory} 
                searchQuery={searchQuery}
                onItemClick={(item) => { setSelectedItem(item); setItemSheetOpen(true); }}
                onQuickAdd={handleQuickAdd}
              />
            </div>
          </>
        ) : (
          /* TAB STYLE B: OTHER DASHBOARD SCREENS (Cart, Tracker, Bill)
             Gets a clean, compact header structure without background image wrappers or extra heights.
          */
          <>
            <header className="app-header">
              <div className="header-left">
                <span className="header-logo">ROOSTER&apos;S DEN</span>
                <span className="header-table">{tableNumber}</span>
              </div>
              <div className="header-right">
                <button
                  className="icon-btn btn-call-waiter-header"
                  aria-label="Call Waiter"
                  onClick={() => setWaiterSheetOpen(true)}
                >
                  <i className="ri-service-line" />
                </button>
              </div>
            </header>

            <div className="menu-scroll">
              {activeScreen === "cart" && (
                <CartScreen 
                  cart={cart}
                  onUpdateQty={handleUpdateCartQty}
                  onBrowseMenu={() => setActiveScreen("menu")}
                  onPlaceOrder={handlePlaceOrder}
                />
              )}

              {activeScreen === "tracker" && (
                <OrderTracker 
                  orders={orders}
                  onBrowseMenu={() => setActiveScreen("menu")}
                />
              )}

              {activeScreen === "bill" && (
                <BillScreen 
                  orders={orders}
                  paidRounds={paidRounds}
                  onRequestBill={() => {
                    setHasRequestedBill(true);
                    showToast('Bill request sent — staff will be with you shortly.', 'info');
                  }}
                  onPayNow={() => setPaymentSheetOpen(true)}
                  hasRequestedBill={hasRequestedBill}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Bottom Layout Navigation Bar */}
      <nav className="bottom-nav">
        <div className="nav-buttons">
          <button className={`nav-item ${activeScreen === "menu" ? "active" : ""}`} onClick={() => setActiveScreen("menu")}>
            <i className="ri-restaurant-2-line"></i>
            <span>Menu</span>
          </button>
          <button className={`nav-item ${activeScreen === "cart" ? "active" : ""}`} onClick={() => setActiveScreen("cart")}>
            <i className="ri-shopping-bag-3-line"></i>
            <span>Cart</span>
            {cart.length > 0 && <span className="order-badge">{cart.reduce((s,c) => s+c.qty, 0)}</span>}
          </button>
          <button className={`nav-item ${activeScreen === "tracker" ? "active" : ""}`} onClick={() => setActiveScreen("tracker")}>
            <i className="ri-time-line"></i>
            <span>Orders</span>
            {orders.length > 0 && <span className="order-badge">{orders.length}</span>}
          </button>
          <button className={`nav-item ${activeScreen === "bill" ? "active" : ""}`} onClick={() => setActiveScreen("bill")}>
            <i className="ri-receipt-line"></i>
            <span>Bill</span>
          </button>
        </div>
      </nav>
        </>
      )}

      {/* Overlays & Drawers */}
      <ItemDetailSheet 
        item={selectedItem}
        isOpen={itemSheetOpen}
        onClose={() => setItemSheetOpen(false)}
        onAddToCart={handleAddToCart}
      />
      <WaiterSheet 
        isOpen={waiterSheetOpen}
        onClose={() => setWaiterSheetOpen(false)}
        onSubmitAlert={handleWaiterAlert}
      />
      <PaymentSheet 
        isOpen={paymentSheetOpen}
        amountDue={amountDue}
        onClose={() => setPaymentSheetOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Status Notifications */}
      {toastMsg && (
        <div className="toast-stack">
          <div className="toast-card toast-in">
            <i className={toastMsg.type === 'success' ? "ri-checkbox-circle-fill toast-icon toast-success" : "ri-information-fill toast-icon toast-info"}></i>
            <div className="toast-content">{toastMsg.msg}</div>
          </div>
        </div>
      )}
    </div>
  );
}