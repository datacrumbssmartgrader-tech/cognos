import './admin.css';

// ═══════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════

type OrderStatus = 'received' | 'kitchen' | 'ready' | 'served' | 'cancelled';
type TableStatus = 'empty' | 'active' | 'disabled';
type AlertType   = 'waiter' | 'bill';
type ItemType    = 'single' | 'platter';
type DiscountType = 'none' | 'percent' | 'flat';

interface OrderItem  { name: string; qty: number; price: number; note?: string; extras?: string; }
interface AdminOrder { id: string; tableId: string; placedAt: number; servedAt?: number; items: OrderItem[]; total: number; status: OrderStatus; cancelReason?: string; }
interface TableData  { id: string; status: TableStatus; sessionStart: number | null; paid: boolean; }
interface Alert      { id: string; tableId: string; type: AlertType; time: number; dismissed: boolean; }

interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  cat: string;
  img: string;
  tags?: string[];
  hidden: boolean;
  type: ItemType;
  components: string[];   // item IDs included in a platter
  discountType: DiscountType;
  discountValue: number;
  prepTime: number;
}

// ═══════════════════════════════════════════════
//  CREDENTIAL  (single admin account)
// ═══════════════════════════════════════════════

const ADMIN = { name: 'Syed Abis', pin: '1234' };

// ═══════════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════════

const now  = Date.now();
const mins = (m: number) => m * 60 * 1000;

const TABLES: TableData[] = [
  { id: 'T01', status: 'empty',    sessionStart: null,           paid: false },
  { id: 'T02', status: 'empty',    sessionStart: null,           paid: false },
  { id: 'T03', status: 'active',   sessionStart: now - mins(42), paid: false },
  { id: 'T04', status: 'empty',    sessionStart: null,           paid: false },
  { id: 'T05', status: 'disabled', sessionStart: null,           paid: false },
  { id: 'T06', status: 'empty',    sessionStart: null,           paid: false },
  { id: 'T07', status: 'active',   sessionStart: now - mins(18), paid: false },
  { id: 'T08', status: 'empty',    sessionStart: null,           paid: false },
  { id: 'T09', status: 'active',   sessionStart: now - mins(71), paid: true  },
  { id: 'T10', status: 'empty',    sessionStart: null,           paid: false },
  { id: 'T11', status: 'active',   sessionStart: now - mins(9),  paid: false },
  { id: 'T12', status: 'empty',    sessionStart: null,           paid: false },
];

const ORDERS: AdminOrder[] = [
  {
    id: 'ORD-001', tableId: 'T03', placedAt: now - mins(38), status: 'served',
    items: [{ name: 'Seekh Kebab', qty: 2, price: 1200 }, { name: 'Garlic Naan', qty: 3, price: 180 }],
    total: 2940,
  },
  {
    id: 'ORD-002', tableId: 'T03', placedAt: now - mins(20), status: 'kitchen',
    items: [{ name: 'Chicken Karahi', qty: 1, price: 1600 }, { name: 'Mutton Karahi', qty: 1, price: 2200 }, { name: 'Tandoori Roti', qty: 4, price: 120, note: 'Extra crispy' }],
    total: 4280,
  },
  {
    id: 'ORD-003', tableId: 'T07', placedAt: now - mins(14), status: 'received',
    items: [{ name: 'Barra Lamb Chops', qty: 1, price: 2800, extras: '+Extra naan (2 pcs) PKR 240' }, { name: 'Kashmiri Chai', qty: 2, price: 400 }],
    total: 3840,
  },
  {
    id: 'ORD-004', tableId: 'T09', placedAt: now - mins(65), status: 'served',
    items: [{ name: 'Mixed Grill Platter', qty: 1, price: 3500 }, { name: 'Sindhi Mutton Biryani', qty: 2, price: 1800 }, { name: 'Mango Lassi', qty: 2, price: 450 }],
    total: 8000,
  },
  {
    id: 'ORD-005', tableId: 'T09', placedAt: now - mins(22), status: 'served',
    items: [{ name: 'Gulab Jamun', qty: 4, price: 650 }, { name: 'Kheer', qty: 2, price: 600 }],
    total: 3800,
  },
  {
    id: 'ORD-006', tableId: 'T11', placedAt: now - mins(7), status: 'received',
    items: [{ name: 'Fish Tikka', qty: 1, price: 1350 }, { name: 'Dahi Bara Chaat', qty: 1, price: 700 }, { name: 'Fresh Lime Soda', qty: 3, price: 300 }],
    total: 2950,
  },
];

const ALERTS: Alert[] = [
  { id: 'a1', tableId: 'T07', type: 'waiter', time: now - mins(3),  dismissed: false },
  { id: 'a2', tableId: 'T03', type: 'bill',   time: now - mins(8),  dismissed: false },
  { id: 'a3', tableId: 'T09', type: 'waiter', time: now - mins(15), dismissed: true  },
  { id: 'a4', tableId: 'T11', type: 'bill',   time: now - mins(2),  dismissed: false },
];

// Base menu data — new fields added via map below
const BASE_MENU = [
  { id: 's1',  cat: 'starters',  name: 'Seekh Kebab',           price: 1200, desc: 'Minced lamb with aromatic spices, grilled over charcoal.',         img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=80&q=70', hidden: false },
  { id: 's2',  cat: 'starters',  name: 'Chicken Malai Boti',    price: 1100, desc: 'Tender chicken in cream and mild spice marinade.',                  img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=80&q=70', hidden: false },
  { id: 's3',  cat: 'starters',  name: 'Fish Tikka',            price: 1350, desc: 'Fresh fish marinated in carom and citrus, char-grilled.',           img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=80&q=70', hidden: false },
  { id: 's4',  cat: 'starters',  name: 'Nihari Shorba',         price: 850,  desc: 'Rich slow-cooked broth with slow-braised beef, served with naan.',  img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=80&q=70', hidden: false },
  { id: 's5',  cat: 'starters',  name: 'Shammi Kebab',          price: 950,  desc: 'Minced beef and lentil patties, pan-fried crisp.',                  img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=80&q=70', hidden: false },
  { id: 's6',  cat: 'starters',  name: 'Dahi Bara Chaat',       price: 700,  desc: 'Lentil dumplings in yoghurt with tamarind and mint chutney.',       img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&q=70', hidden: false },
  { id: 'g1',  cat: 'grills',    name: 'Barra Lamb Chops',      price: 2800, desc: 'Raan chops in Kashmiri spice rub, grilled to perfection.',          img: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=80&q=70', hidden: false },
  { id: 'g2',  cat: 'grills',    name: 'Chapli Kebab',          price: 1400, desc: 'Peshawar-style spiced mince patties on the griddle.',               img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=80&q=70', hidden: false },
  { id: 'g3',  cat: 'grills',    name: 'Tandoori Prawns',       price: 1800, desc: 'Tiger prawns in a turmeric-citrus marinade, clay oven fired.',      img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=80&q=70', hidden: false },
  { id: 'g4',  cat: 'grills',    name: 'Achari Murgh Tikka',    price: 1300, desc: 'Chicken in pickle-spiced yoghurt, smoky and tangy.',                img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=80&q=70', hidden: false },
  { id: 'g5',  cat: 'grills',    name: 'Reshmi Kebab',          price: 1250, desc: 'Silky chicken mince kebabs with rose water and saffron.',           img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=80&q=70', hidden: false },
  { id: 'g6',  cat: 'grills',    name: 'Mixed Grill Platter',   price: 3500, desc: 'Assortment of our signature kebabs — ideal for sharing.',           img: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=80&q=70', hidden: false },
  { id: 'k1',  cat: 'karahi',    name: 'Chicken Karahi',        price: 1600, desc: 'Wok-tossed chicken in tomatoes, ginger and green chilli.',          img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&q=70', hidden: false },
  { id: 'k2',  cat: 'karahi',    name: 'Mutton Karahi',         price: 2200, desc: 'Slow-cooked tender mutton, rich karahi gravy.',                     img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=80&q=70', hidden: false },
  { id: 'k3',  cat: 'karahi',    name: 'Rogan Josh',            price: 2400, desc: 'Kashmiri lamb curry, bloomed spices, scarlet colour.',              img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=80&q=70', hidden: false },
  { id: 'k4',  cat: 'karahi',    name: 'Saag Gosht',            price: 2100, desc: 'Lamb simmered in spiced mustard greens.',                           img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=80&q=70', hidden: false },
  { id: 'k5',  cat: 'karahi',    name: 'Lahori Dal Makhani',    price: 1100, desc: 'Black lentils slow-cooked overnight with butter and cream.',        img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&q=70', hidden: false },
  { id: 'k6',  cat: 'karahi',    name: 'Nihari',                price: 2000, desc: 'Braised beef shank in deep, slow-cooked spiced gravy.',             img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=80&q=70', hidden: false },
  { id: 'b1',  cat: 'biryani',   name: 'Sindhi Mutton Biryani', price: 1800, desc: 'Dum-cooked mutton with saffron-scented Sindhi spices.',             img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=80&q=70', hidden: false },
  { id: 'b2',  cat: 'biryani',   name: 'Chicken Biryani',       price: 1400, desc: 'Classic layered biryani with whole spices and fried onions.',       img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=80&q=70', hidden: false },
  { id: 'b3',  cat: 'biryani',   name: 'Zafrani Pulao',         price: 900,  desc: 'Fragrant saffron rice with whole spices and golden raisins.',       img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=80&q=70', hidden: false },
  { id: 'b4',  cat: 'biryani',   name: 'Prawn Biryani',         price: 2000, desc: 'Tiger prawns layered with spiced basmati, slow-steamed.',           img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=80&q=70', hidden: false },
  { id: 'br1', cat: 'breads',    name: 'Tandoori Roti',         price: 120,  desc: 'Wholemeal flatbread, freshly baked in the clay oven.',              img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=80&q=70', hidden: false },
  { id: 'br2', cat: 'breads',    name: 'Garlic Naan',           price: 180,  desc: 'Leavened bread brushed with garlic butter and coriander.',          img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&q=70', hidden: false },
  { id: 'br3', cat: 'breads',    name: 'Peshwari Naan',         price: 250,  desc: 'Stuffed with almonds, coconut and sultanas.',                       img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=80&q=70', hidden: false },
  { id: 'br4', cat: 'breads',    name: 'Laccha Paratha',        price: 200,  desc: 'Multi-layered flaky flatbread from the griddle.',                   img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&q=70', hidden: false },
  { id: 'd1',  cat: 'desserts',  name: 'Gulab Jamun',           price: 650,  desc: 'Soft milk dumplings soaked in rose and cardamom syrup.',            img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=80&q=70', hidden: false },
  { id: 'd2',  cat: 'desserts',  name: 'Shahi Tukra',           price: 750,  desc: 'Royal bread pudding with condensed milk and pistachios.',           img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=80&q=70', hidden: false },
  { id: 'd3',  cat: 'desserts',  name: 'Pistachio Kulfi',       price: 550,  desc: 'Frozen milk ice cream set on a stick, dense and creamy.',           img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=80&q=70', hidden: false },
  { id: 'd4',  cat: 'desserts',  name: 'Kheer',                 price: 600,  desc: 'Rice pudding slow-cooked with cardamom and rose water.',            img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&q=70', hidden: false },
  { id: 'bv1', cat: 'beverages', name: 'Kashmiri Chai',         price: 400,  desc: 'Pink salt tea brewed with pistachios and almonds.',                 img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=80&q=70', hidden: false },
  { id: 'bv2', cat: 'beverages', name: 'Mango Lassi',           price: 450,  desc: 'Chilled yoghurt blended with Sindhri mango pulp.',                 img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&q=70', hidden: false },
  { id: 'bv3', cat: 'beverages', name: 'Rooh Afza Sharbat',     price: 350,  desc: 'Classic rose syrup drink with basil seeds and ice.',                img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=80&q=70', hidden: false },
  { id: 'bv4', cat: 'beverages', name: 'Fresh Lime Soda',       price: 300,  desc: 'Freshly squeezed lime with sparkling water and mint.',              img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&q=70', hidden: false },
];

// ═══════════════════════════════════════════════
//  APP STATE
// ═══════════════════════════════════════════════

let pendingCancelOrderId = '';
let pendingTableBillId   = '';
let editingMenuItemId: string | null = null;
let activeSection        = 'orders';
let currentItemImg       = '';           // URL or data URL for current edit
let currentItemType: ItemType = 'single';
let nextItemId           = 100;

let orders     = [...ORDERS];
let alerts     = [...ALERTS];
const storedAlerts = localStorage.getItem('riwayat_alerts');
if (storedAlerts) {
  alerts = JSON.parse(storedAlerts);
} else {
  localStorage.setItem('riwayat_alerts', JSON.stringify(alerts));
}

setInterval(() => {
  const sa = localStorage.getItem('riwayat_alerts');
  if (sa) {
    const parsed = JSON.parse(sa);
    if (JSON.stringify(parsed) !== JSON.stringify(alerts)) {
      alerts = parsed;
      updateBadges();
      if (document.getElementById('section-alerts') && !document.getElementById('section-alerts')!.hidden) renderAlerts();
    }
  }
}, 2000);
let tables     = [...TABLES];
let menuItems: MenuItem[] = BASE_MENU.map(b => ({
  ...b,
  type: 'single' as ItemType,
  components: [] as string[],
  discountType: 'none' as DiscountType,
  discountValue: 0,
  prepTime: 15,
}));

// ═══════════════════════════════════════════════
//  ELEMENT REFS
// ═══════════════════════════════════════════════

const loginScreen    = document.getElementById('login-screen')!;
const dashboard      = document.getElementById('dashboard')!;
const pinInput       = document.getElementById('pin-input') as HTMLInputElement;
const loginError     = document.getElementById('login-error')!;
const btnLogin       = document.getElementById('btn-login')!;
const sidebar        = document.getElementById('sidebar')!;
const sidebarOverlay = document.getElementById('sidebar-overlay')!;
const btnHamburger   = document.getElementById('btn-hamburger')!;
const btnLogout      = document.getElementById('btn-logout')!;
const toastStack     = document.getElementById('toastStack')!;
const topbarTitle    = document.getElementById('topbar-title')!;

// ═══════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════

function fmt(n: number) { return 'PKR ' + n.toLocaleString('en-PK'); }

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m ago`;
}

function sessionDuration(start: number | null): string {
  if (!start) return '—';
  const diff = Math.floor((Date.now() - start) / 60000);
  return diff < 60 ? `${diff}m` : `${Math.floor(diff / 60)}h ${diff % 60}m`;
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function statusLabel(s: OrderStatus): string {
  return { received: 'Received', kitchen: 'In Kitchen', ready: 'Ready', served: 'Served', cancelled: 'Cancelled' }[s];
}

function nextStatus(s: OrderStatus): OrderStatus | null {
  return ({ received: 'kitchen', kitchen: 'ready', ready: 'served' } as Record<string, OrderStatus>)[s] ?? null;
}

function nextStatusLabel(s: OrderStatus): string {
  return ({ received: '→ Kitchen', kitchen: '→ Ready', ready: '→ Served' } as Record<string, string>)[s] ?? '';
}

function catLabel(cat: string): string {
  const map: Record<string, string> = { starters: 'Starters', grills: 'Grills', karahi: 'Karahi & Curries', biryani: 'Biryani & Rice', breads: 'Breads', desserts: 'Desserts', beverages: 'Beverages', platters: 'Platters' };
  return map[cat] ?? cat;
}

function tableTotal(tableId: string): number {
  return orders.filter(o => o.tableId === tableId && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
}

function hasAlert(tableId: string): boolean {
  return alerts.some(a => a.tableId === tableId && !a.dismissed);
}

function finalPrice(item: MenuItem): number {
  if (item.discountType === 'none')    return item.price;
  if (item.discountType === 'percent') return Math.round(item.price * (1 - item.discountValue / 100));
  return Math.max(0, item.price - item.discountValue);
}

function discountLabel(item: MenuItem): string {
  if (item.discountType === 'none') return '';
  if (item.discountType === 'percent') return `${item.discountValue}% off`;
  return `PKR ${item.discountValue} off`;
}

// ═══════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════

function showToast(msg: string, type: 'success' | 'info' | 'error' = 'info') {
  const icons = { success: 'ri-check-line', info: 'ri-information-line', error: 'ri-error-warning-line' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="${icons[type]}"></i>${msg}`;
  toastStack.appendChild(t);
  setTimeout(() => { t.classList.add('removing'); setTimeout(() => t.remove(), 220); }, 3200);
}

// ═══════════════════════════════════════════════
//  NAV BADGES
// ═══════════════════════════════════════════════

function updateBadges() {
  const active  = orders.filter(o => ['received','kitchen','ready'].includes(o.status));
  const pending = alerts.filter(a => !a.dismissed);
  const ob = document.getElementById('nav-badge-orders')!;
  const ab = document.getElementById('nav-badge-alerts')!;
  if (active.length  > 0) { ob.textContent = String(active.length);  ob.hidden = false; } else ob.hidden = true;
  if (pending.length > 0) { ab.textContent = String(pending.length); ab.hidden = false; ab.className = 'nav-badge gold'; } else ab.hidden = true;
}

// ═══════════════════════════════════════════════
//  LOGIN
// ═══════════════════════════════════════════════

btnLogin.addEventListener('click', doLogin);
pinInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

function doLogin() {
  if (pinInput.value.trim() !== ADMIN.pin) {
    loginError.hidden = false;
    pinInput.value = '';
    pinInput.focus();
    return;
  }
  loginScreen.hidden = true;
  dashboard.hidden = false;
  document.getElementById('sidebar-user-name')!.textContent = ADMIN.name;
  document.getElementById('sidebar-user-role')!.textContent = 'Admin';
  document.getElementById('sidebar-avatar')!.textContent    = initials(ADMIN.name);
  document.getElementById('topbar-avatar')!.textContent     = initials(ADMIN.name);
  updateBadges();
  showSection('orders');
}

btnLogout.addEventListener('click', () => {
  dashboard.hidden = true;
  loginScreen.hidden = false;
  pinInput.value = '';
  loginError.hidden = true;
});

// ═══════════════════════════════════════════════
//  SIDEBAR / NAVIGATION
// ═══════════════════════════════════════════════

btnHamburger.addEventListener('click', () => {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('visible');
  sidebarOverlay.style.pointerEvents = 'auto';
});
sidebarOverlay.addEventListener('click', closeSidebar);

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('visible');
  sidebarOverlay.style.pointerEvents = 'none';
}

document.getElementById('sidebar-nav')!.addEventListener('click', e => {
  const item = (e.target as HTMLElement).closest<HTMLElement>('.nav-item');
  if (!item?.dataset.section) return;
  showSection(item.dataset.section);
  closeSidebar();
});

const SECTION_TITLES: Record<string, string> = { orders: 'Live Orders', tables: 'Tables', menu: 'Menu', alerts: 'Alerts', history: 'Order History', payments: 'Payments' };

function showSection(name: string) {
  activeSection = name;
  document.querySelectorAll<HTMLElement>('.section').forEach(s => s.classList.remove('active'));
  document.querySelector<HTMLElement>(`#section-${name}`)?.classList.add('active');
  document.querySelectorAll<HTMLElement>('.nav-item').forEach(i => i.classList.toggle('active', i.dataset.section === name));
  topbarTitle.textContent = SECTION_TITLES[name] ?? name;
  if (name === 'orders')  renderOrders();
  if (name === 'tables')  renderTables();
  if (name === 'menu')    renderMenu();
  if (name === 'alerts')  renderAlerts();
  if (name === 'history') renderHistory();
  if (name === 'payments') {
    const pFrom = document.getElementById('payments-date-from') as HTMLInputElement;
    const pTo   = document.getElementById('payments-date-to')   as HTMLInputElement;
    const localDateStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (!pFrom.value) {
      const d = new Date(); d.setMonth(d.getMonth() - 1);
      pFrom.value = localDateStr(d);
    }
    if (!pTo.value) pTo.value = localDateStr(new Date());
    renderPayments();
  }
}

// ═══════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════

document.getElementById('orders-filter')!.addEventListener('change', renderOrders);

function renderOrders() {
  const grid   = document.getElementById('orders-grid')!;
  const filter = (document.getElementById('orders-filter') as HTMLSelectElement).value;
  const active: OrderStatus[] = ['received', 'kitchen', 'ready'];
  const visible = filter === 'active' ? orders.filter(o => active.includes(o.status)) : orders;

  if (visible.length === 0) {
    grid.innerHTML = `<div class="orders-empty"><i class="ri-restaurant-line"></i>No orders to show</div>`;
    return;
  }
  grid.innerHTML = visible.map(o => {
    const maxPrep = Math.max(0, ...o.items.map(it => menuItems.find(m => m.name === it.name)?.prepTime || 0));
    return `
    <div class="order-card">
      <div class="order-card-head">
        <span class="order-table-badge">${o.tableId}</span>
        <span class="order-id">#${o.id}</span>
        <span class="order-time">${timeAgo(o.placedAt)}${maxPrep > 0 ? ` &middot; ⏱️ ${maxPrep}m` : ''}</span>
      </div>
      <div class="order-card-body">
        <div class="order-items">
          ${o.items.map(it => `
            <div class="order-item-row">
              <span class="order-item-qty">${it.qty}×</span>
              <span class="order-item-name">${it.name}</span>
              <span class="order-item-price">${fmt(it.price * it.qty)}</span>
            </div>
            ${it.note   ? `<div class="order-item-note">Note: ${it.note}</div>` : ''}
            ${it.extras ? `<div class="order-item-extras">${it.extras}</div>`   : ''}
          `).join('')}
        </div>
        <div class="order-total">
          <span class="order-total-label">Total</span>
          <span class="order-total-amount">${fmt(o.total)}</span>
        </div>
      </div>
      <div class="order-card-foot">
        <span class="badge badge-${o.status}">${statusLabel(o.status)}</span>
        <div class="order-status-btns">
          ${nextStatus(o.status) ? `<button class="btn-status btn-status-next" data-action="advance" data-id="${o.id}">${nextStatusLabel(o.status)}</button>` : ''}
          ${o.status !== 'served' && o.status !== 'cancelled' ? `<button class="btn-status btn-status-cancel" data-action="cancel" data-id="${o.id}">Cancel</button>` : ''}
        </div>
      </div>
    </div>
  `}).join('');
  const count = orders.filter(o => active.includes(o.status)).length;
  document.getElementById('orders-sub')!.textContent = count > 0 ? `${count} active order${count > 1 ? 's' : ''} across tables` : 'No active orders right now';
  updateBadges();
}

document.getElementById('orders-grid')!.addEventListener('click', e => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!btn) return;
  if (btn.dataset.action === 'advance') advanceOrder(btn.dataset.id!);
  if (btn.dataset.action === 'cancel')  openCancelModal(btn.dataset.id!);
});

function advanceOrder(id: string) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  const next = nextStatus(o.status);
  if (!next) return;
  o.status = next;
  if (o.status === 'served') o.servedAt = Date.now();
  showToast(`Order #${id} → ${statusLabel(next)}`, 'success');
  renderOrders();
  if (activeSection === 'tables') renderTables();
}

function openCancelModal(id: string) {
  pendingCancelOrderId = id;
  document.getElementById('modal-cancel')!.hidden = false;
}

document.getElementById('btn-confirm-cancel')!.addEventListener('click', () => {
  const o = orders.find(x => x.id === pendingCancelOrderId);
  if (o) {
    o.status = 'cancelled';
    o.cancelReason = (document.getElementById('cancel-reason') as HTMLSelectElement).value;
    showToast(`Order #${o.id} cancelled`, 'error');
    renderOrders();
  }
  closeModal('modal-cancel');
});

// ═══════════════════════════════════════════════
//  TABLES
// ═══════════════════════════════════════════════

function renderTables() {
  document.getElementById('tables-grid')!.innerHTML = tables.map(t => {
    const total      = tableTotal(t.id);
    const orderCount = orders.filter(o => o.tableId === t.id && o.status !== 'cancelled').length;
    const alert      = hasAlert(t.id);
    const isActive   = t.status === 'active';
    const isDisabled = t.status === 'disabled';
    return `
      <div class="table-card ${isActive ? 'active-table' : ''} ${isDisabled ? 'disabled-table' : ''}">
        ${alert ? '<div class="table-alert-dot"></div>' : ''}
        <div class="table-id">${t.id}</div>
        <div class="table-status-row">
          <span class="badge badge-table-${t.status}">${t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span>
          ${t.paid ? '<span class="badge badge-paid">Paid</span>' : ''}
        </div>
        <div class="table-meta">
          ${isActive
            ? `<div class="table-meta-row"><i class="ri-time-line"></i>${sessionDuration(t.sessionStart)}</div>
               <div class="table-meta-row"><i class="ri-receipt-line"></i>${orderCount} order${orderCount !== 1 ? 's' : ''} · ${fmt(total)}</div>`
            : `<div class="table-meta-row">—</div>`}
        </div>
        <div class="table-card-actions">
          ${isActive ? `<button data-action="view-bill"    data-table="${t.id}">View Bill</button>` : ''}
          ${isActive ? `<button data-action="reset-table"  data-table="${t.id}" class="danger">Reset</button>` : ''}
          ${!isDisabled && !isActive ? `<button data-action="disable-table" data-table="${t.id}" class="danger">Disable</button>` : ''}
          ${isDisabled              ? `<button data-action="enable-table"  data-table="${t.id}">Enable</button>` : ''}
        </div>
      </div>`;
  }).join('');
}

document.getElementById('tables-grid')!.addEventListener('click', e => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!btn) return;
  const { action, table } = btn.dataset as { action: string; table: string };
  if (action === 'view-bill')    openTableBill(table);
  if (action === 'reset-table')  resetTable(table);
  if (action === 'disable-table') disableTable(table);
  if (action === 'enable-table')  enableTable(table);
});

function resetTable(id: string) {
  const t = tables.find(x => x.id === id)!;
  t.status = 'empty'; t.sessionStart = null; t.paid = false;
  showToast(`${id} session reset`, 'info');
  renderTables();
}
function disableTable(id: string) {
  const t = tables.find(x => x.id === id)!;
  t.status = 'disabled'; t.sessionStart = null; t.paid = false;
  showToast(`${id} disabled`, 'info');
  renderTables();
}
function enableTable(id: string) {
  tables.find(x => x.id === id)!.status = 'empty';
  showToast(`${id} enabled`, 'success');
  renderTables();
}

function openTableBill(tableId: string) {
  pendingTableBillId = tableId;
  const t           = tables.find(x => x.id === tableId)!;
  const tableOrders = orders.filter(o => o.tableId === tableId && o.status !== 'cancelled');
  const total       = tableTotal(tableId);

  document.getElementById('table-bill-title')!.textContent = `${tableId} — Running Bill`;

  const btnPaid  = document.getElementById('btn-mark-paid')!;
  const btnReset = document.getElementById('btn-reset-table')!;
  if (t.paid) {
    btnPaid.innerHTML = '<i class="ri-check-line"></i> Paid';
    btnPaid.classList.add('btn-paid-done');
    btnPaid.setAttribute('disabled', '');
  } else {
    btnPaid.innerHTML = '<i class="ri-secure-payment-line"></i> Mark as Paid';
    btnPaid.classList.remove('btn-paid-done');
    btnPaid.removeAttribute('disabled');
  }
  btnReset.style.display = t.paid ? '' : 'none';

  document.getElementById('table-bill-body')!.innerHTML = `
    <div class="bill-meta">
      <div class="bill-meta-item">Session: <strong>${sessionDuration(t.sessionStart)}</strong></div>
      <div class="bill-meta-item">${tableOrders.length} order${tableOrders.length !== 1 ? 's' : ''}</div>
      ${t.paid ? '<div class="bill-meta-item"><span class="badge badge-paid">Paid</span></div>' : ''}
    </div>
    ${tableOrders.map(o => `
      <div class="bill-batch">
        <div class="bill-batch-head">
          <span>#${o.id} · ${timeAgo(o.placedAt)}</span>
          <span class="badge badge-${o.status}">${statusLabel(o.status)}</span>
        </div>
        ${o.items.map(it => `<div class="bill-item-row"><span>${it.qty}× ${it.name}</span><span>${fmt(it.price * it.qty)}</span></div>`).join('')}
      </div>
    `).join('')}
    <div class="bill-grand-total"><span>Grand Total</span><span>${fmt(total)}</span></div>`;

  document.getElementById('modal-table-bill')!.hidden = false;
}

document.getElementById('btn-mark-paid')!.addEventListener('click', () => {
  const t = tables.find(x => x.id === pendingTableBillId);
  if (!t || t.paid) return;
  t.paid = true;
  showToast(`${t.id} marked as paid`, 'success');
  openTableBill(pendingTableBillId);
  if (activeSection === 'tables') renderTables();
});

document.getElementById('btn-reset-table')!.addEventListener('click', () => {
  resetTable(pendingTableBillId);
  closeModal('modal-table-bill');
});

// ═══════════════════════════════════════════════
//  MENU MANAGEMENT
// ═══════════════════════════════════════════════

document.getElementById('menu-cat-filter')!.addEventListener('change', renderMenu);

function renderMenu() {
  const cat      = (document.getElementById('menu-cat-filter') as HTMLSelectElement).value;
  const tbody    = document.getElementById('menu-tbody')!;
  const filtered = cat === 'all' ? menuItems : menuItems.filter(m => m.cat === cat);

  tbody.innerHTML = filtered.map(m => {
    const fp      = finalPrice(m);
    const disc    = discountLabel(m);
    const priceHtml = disc
      ? `<span class="price-original">${fmt(m.price)}</span><br/><span class="price-discounted">${fmt(fp)}</span>`
      : `<span class="price-discounted">${fmt(fp)}</span>`;

    const componentsHtml = m.type === 'platter' && m.components.length > 0
      ? `<div style="font-size:.7rem;color:var(--clr-muted);margin-top:2px">${m.components.map(id => menuItems.find(x => x.id === id)?.name ?? id).join(', ')}</div>`
      : '';

    return `<tr data-item-id="${m.id}">
      <td>
        <div class="menu-item-cell">
          <img src="${m.img}" alt="${m.name}" class="menu-item-thumb" loading="lazy" onerror="this.style.display='none'" />
          <div>
            <div class="menu-item-name">
              ${m.name}
              ${m.type === 'platter' ? '<span class="badge badge-platter" style="margin-left:6px;font-size:.65rem">Platter</span>' : ''}
              ${disc ? `<span class="badge badge-discount" style="margin-left:6px;font-size:.65rem">${disc}</span>` : ''}
            </div>
            <div class="menu-item-desc">${m.desc}</div>
            ${componentsHtml}
          </div>
        </div>
      </td>
      <td>${catLabel(m.cat)}</td>
      <td class="price-cell">${priceHtml}</td>
      <td>
        <div class="status-toggles">
          <span class="toggle-chip toggle-hide ${m.hidden  ? 'on' : ''}" data-toggle="hidden"  data-id="${m.id}">Hide</span>
        </div>
      </td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon" data-action="edit-item"   data-id="${m.id}" title="Edit"><i class="ri-edit-line"></i></button>
          <button class="btn-icon danger" data-action="delete-item" data-id="${m.id}" title="Delete"><i class="ri-delete-bin-line"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

document.getElementById('menu-tbody')!.addEventListener('click', e => {
  const btn  = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
  const chip = (e.target as HTMLElement).closest<HTMLElement>('.toggle-chip');
  if (btn) {
    if (btn.dataset.action === 'edit-item')   openMenuItemModal(btn.dataset.id!);
    if (btn.dataset.action === 'delete-item') deleteMenuItem(btn.dataset.id!);
  }
  if (chip) toggleMenuField(chip.dataset.id!, chip.dataset.toggle as 'hidden');
});

function toggleMenuField(id: string, field: 'hidden') {
  const item = menuItems.find(m => m.id === id);
  if (!item) return;
  item[field] = !item[field];
  const label = item.hidden ? 'hidden' : 'visible';
  showToast(`${item.name} — ${label}`, 'info');
  renderMenu();
}

function deleteMenuItem(id: string) {
  const item = menuItems.find(m => m.id === id);
  if (!item) return;
  menuItems = menuItems.filter(m => m.id !== id);
  showToast(`${item.name} removed`, 'error');
  renderMenu();
}

// ── Image upload ─────────────────────────────
const imgUploadArea   = document.getElementById('img-upload-area')!;
const imgFileInput    = document.getElementById('mi-img-file') as HTMLInputElement;
const imgPreview      = document.getElementById('img-preview') as HTMLImageElement;
const uploadPlaceholder = document.getElementById('upload-placeholder')!;

imgUploadArea.addEventListener('click', () => imgFileInput.click());
imgFileInput.addEventListener('change', () => {
  const file = imgFileInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    currentItemImg = e.target?.result as string;
    imgPreview.src = currentItemImg;
    imgPreview.hidden = false;
    uploadPlaceholder.hidden = true;
  };
  reader.readAsDataURL(file);
});

// ── Item type toggle ─────────────────────────
document.getElementById('item-type-tabs')!.addEventListener('click', e => {
  const tab = (e.target as HTMLElement).closest<HTMLElement>('.type-tab');
  if (!tab) return;
  currentItemType = tab.dataset.type as ItemType;
  document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById('platter-components-group')!.hidden = currentItemType !== 'platter';
  const catSel = document.getElementById('mi-cat') as HTMLSelectElement;
  if (currentItemType === 'platter') {
    catSel.value = 'platters';
    catSel.disabled = true;
    renderPlatterList([]);
  } else {
    catSel.disabled = false;
  }
});

// ── Discount toggle ──────────────────────────
document.getElementById('mi-discount-type')!.addEventListener('change', () => {
  const val  = (document.getElementById('mi-discount-type') as HTMLSelectElement).value;
  const grp  = document.getElementById('discount-value-group')!;
  const lbl  = document.getElementById('discount-value-label')!;
  grp.hidden = val === 'none';
  lbl.textContent = val === 'percent' ? 'Percentage (%)' : 'Amount (PKR)';
});

// ── Platter components list ──────────────────
function renderPlatterList(selectedIds: string[]) {
  const singles = menuItems.filter(m => m.type === 'single' && m.id !== editingMenuItemId);
  document.getElementById('platter-items-list')!.innerHTML = singles.map(m => `
    <label class="platter-item-check">
      <input type="checkbox" value="${m.id}" ${selectedIds.includes(m.id) ? 'checked' : ''} />
      <span class="platter-item-name">${m.name}</span>
      <span class="platter-item-price">${fmt(m.price)}</span>
      <span class="platter-item-cat">${catLabel(m.cat)}</span>
    </label>
  `).join('');
}

function getSelectedComponents(): string[] {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>('#platter-items-list input[type="checkbox"]:checked')
  ).map(cb => cb.value);
}

// ── Open modal ───────────────────────────────
document.getElementById('btn-add-item')!.addEventListener('click', () => openMenuItemModal(null));

function openMenuItemModal(id: string | null) {
  editingMenuItemId = id;
  document.getElementById('menu-item-modal-title')!.textContent = id ? 'Edit Item' : 'Add Item';

  // Reset image
  currentItemImg = '';
  imgFileInput.value = '';
  imgPreview.hidden = true;
  imgPreview.src = '';
  uploadPlaceholder.hidden = false;

  // Reset type tabs
  currentItemType = 'single';
  document.querySelectorAll('.type-tab').forEach(t => t.classList.toggle('active', t.getAttribute('data-type') === 'single'));
  document.getElementById('platter-components-group')!.hidden = true;
  (document.getElementById('mi-cat') as HTMLSelectElement).disabled = false;

  // Reset discount
  (document.getElementById('mi-discount-type') as HTMLSelectElement).value = 'none';
  document.getElementById('discount-value-group')!.hidden = true;
  (document.getElementById('mi-discount-value') as HTMLInputElement).value = '';

  if (id) {
    const item = menuItems.find(m => m.id === id)!;
    (document.getElementById('mi-name')  as HTMLInputElement).value    = item.name;
    (document.getElementById('mi-cat')   as HTMLSelectElement).value   = item.cat;
    (document.getElementById('mi-price') as HTMLInputElement).value    = String(item.price);
    (document.getElementById('mi-prep-time') as HTMLInputElement).value = String(item.prepTime || 15);
    (document.getElementById('mi-desc')  as HTMLTextAreaElement).value = item.desc;

    // Image
    if (item.img) {
      currentItemImg = item.img;
      imgPreview.src = item.img;
      imgPreview.hidden = false;
      uploadPlaceholder.hidden = true;
    }

    // Type
    currentItemType = item.type;
    document.querySelectorAll('.type-tab').forEach(t => t.classList.toggle('active', t.getAttribute('data-type') === item.type));
    const catSelEdit = document.getElementById('mi-cat') as HTMLSelectElement;
    if (item.type === 'platter') {
      document.getElementById('platter-components-group')!.hidden = false;
      renderPlatterList(item.components);
      catSelEdit.value = 'platters';
      catSelEdit.disabled = true;
    } else {
      catSelEdit.disabled = false;
    }

    // Discount
    (document.getElementById('mi-discount-type') as HTMLSelectElement).value = item.discountType;
    if (item.discountType !== 'none') {
      document.getElementById('discount-value-group')!.hidden = false;
      document.getElementById('discount-value-label')!.textContent = item.discountType === 'percent' ? 'Percentage (%)' : 'Amount (PKR)';
      (document.getElementById('mi-discount-value') as HTMLInputElement).value = String(item.discountValue);
    }
  } else {
    (document.getElementById('mi-name')  as HTMLInputElement).value    = '';
    (document.getElementById('mi-cat')   as HTMLSelectElement).value   = 'starters';
    (document.getElementById('mi-price') as HTMLInputElement).value    = '';
    (document.getElementById('mi-prep-time') as HTMLInputElement).value = '15';
    (document.getElementById('mi-desc')  as HTMLTextAreaElement).value = '';
    renderPlatterList([]);
  }

  document.getElementById('modal-menu-item')!.hidden = false;
}

document.getElementById('btn-save-item')!.addEventListener('click', () => {
  const name          = (document.getElementById('mi-name')           as HTMLInputElement).value.trim();
  const cat           = (document.getElementById('mi-cat')            as HTMLSelectElement).value;
  const price         = parseInt((document.getElementById('mi-price') as HTMLInputElement).value) || 0;
  const prepTime      = parseInt((document.getElementById('mi-prep-time') as HTMLInputElement).value) || 15;
  const desc          = (document.getElementById('mi-desc')           as HTMLTextAreaElement).value.trim();
  const discountType  = (document.getElementById('mi-discount-type')  as HTMLSelectElement).value as DiscountType;
  const discountValue = parseFloat((document.getElementById('mi-discount-value') as HTMLInputElement).value) || 0;
  const components    = currentItemType === 'platter' ? getSelectedComponents() : [];

  if (!name || !price) { showToast('Name and price are required', 'error'); return; }
  if (currentItemType === 'platter' && components.length === 0) {
    showToast('Select at least one item for the platter', 'error'); return;
  }

  // Use uploaded image, or existing image if editing without re-upload
  const finalImg = currentItemImg || 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=80&q=70';

  if (editingMenuItemId) {
    const item = menuItems.find(m => m.id === editingMenuItemId);
    if (item) Object.assign(item, { name, cat, price, desc, img: finalImg, type: currentItemType, components, discountType, discountValue, prepTime });
    showToast(`${name} updated`, 'success');
  } else {
    menuItems.push({ id: `item-${nextItemId++}`, name, cat, price, desc, img: finalImg, hidden: false, type: currentItemType, components, discountType, discountValue, prepTime });
    showToast(`${name} added`, 'success');
  }
  renderMenu();
  closeModal('modal-menu-item');
});

// ═══════════════════════════════════════════════
//  ORDER HISTORY
// ═══════════════════════════════════════════════

document.getElementById('history-search')!.addEventListener('input', renderHistory);
document.getElementById('history-table-filter')!.addEventListener('change', renderHistory);
document.getElementById('history-status-filter')!.addEventListener('change', renderHistory);
document.getElementById('history-date-from')!.addEventListener('change', renderHistory);
document.getElementById('history-date-to')!.addEventListener('change', renderHistory);

function renderHistory() {
  const tbody        = document.getElementById('history-tbody')!;
  const search       = (document.getElementById('history-search')        as HTMLInputElement).value.trim().toLowerCase();
  const tableFilter  = (document.getElementById('history-table-filter')  as HTMLSelectElement).value;
  const statusFilter = (document.getElementById('history-status-filter') as HTMLSelectElement).value as OrderStatus | '';
  const dateFrom     = (document.getElementById('history-date-from')     as HTMLInputElement).value;
  const dateTo       = (document.getElementById('history-date-to')       as HTMLInputElement).value;

  let filtered = [...orders].sort((a, b) => b.placedAt - a.placedAt);

  if (search) {
    filtered = filtered.filter(o =>
      o.id.toLowerCase().includes(search) ||
      o.tableId.toLowerCase().includes(search) ||
      o.items.some(it => it.name.toLowerCase().includes(search))
    );
  }
  if (tableFilter)  filtered = filtered.filter(o => o.tableId === tableFilter);
  if (statusFilter) filtered = filtered.filter(o => o.status  === statusFilter);
  if (dateFrom) {
    const [y, m, d] = dateFrom.split('-').map(Number);
    const start = new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
    filtered = filtered.filter(o => o.placedAt >= start);
  }
  if (dateTo) {
    const [y, m, d] = dateTo.split('-').map(Number);
    const end = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
    filtered = filtered.filter(o => o.placedAt <= end);
  }

  const hasFilters = search || tableFilter || statusFilter || dateFrom || dateTo;
  document.getElementById('history-sub')!.textContent = hasFilters
    ? `${filtered.length} of ${orders.length} order${orders.length !== 1 ? 's' : ''}`
    : `${orders.length} order${orders.length !== 1 ? 's' : ''} total`;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--clr-muted);font-family:var(--ff-ui)">${orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(o => {
    const totalQty = o.items.reduce((s, i) => s + i.qty, 0);
    const maxPrep = Math.max(0, ...o.items.map(it => menuItems.find(m => m.name === it.name)?.prepTime || 0));
    const servedHtml = (o.status === 'served' && o.servedAt) 
      ? `<br><span style="color:var(--clr-primary)">Served: ${new Date(o.servedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>` 
      : '';
    return `
      <tr class="history-row" data-order-id="${o.id}">
        <td>
          <span class="history-expand-icon"><i class="ri-arrow-right-s-line"></i></span>
          <span style="font-family:var(--ff-ui);font-weight:600;color:var(--clr-text)">#${o.id}</span>
        </td>
        <td><span class="order-table-badge">${o.tableId}</span></td>
        <td style="white-space:nowrap;font-family:var(--ff-ui);font-size:.8rem;color:var(--clr-muted)">
          ${new Date(o.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          <span style="margin-left:.35rem">${timeAgo(o.placedAt)}</span>
          ${maxPrep > 0 ? `<br><i class="ri-timer-line" style="margin-right:2px;vertical-align:middle"></i>Prep: ${maxPrep}m` : ''}
          ${servedHtml}
        </td>
        <td style="font-family:var(--ff-ui);font-size:.82rem;color:var(--clr-muted)">${totalQty} item${totalQty !== 1 ? 's' : ''}</td>
        <td class="text-right" style="font-family:var(--ff-ui);font-weight:700;color:var(--clr-primary)">${fmt(o.total)}</td>
        <td><span class="badge badge-${o.status}">${statusLabel(o.status)}</span></td>
      </tr>
      <tr class="history-detail" id="hd-${o.id}" hidden>
        <td colspan="6" style="padding:0">
          <div class="history-detail-inner">
            ${o.items.map(it => `
              <div class="order-item-row">
                <span class="order-item-qty">${it.qty}×</span>
                <span class="order-item-name">${it.name}</span>
                ${it.note   ? `<span class="order-item-note">· ${it.note}</span>` : ''}
                ${it.extras ? `<span class="order-item-extras">${it.extras}</span>` : ''}
                <span class="order-item-price">${fmt(it.price * it.qty)}</span>
              </div>
            `).join('')}
            ${o.cancelReason ? `<div class="history-cancel-note"><i class="ri-information-line"></i> Cancelled: ${o.cancelReason}</div>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

document.getElementById('history-tbody')!.addEventListener('click', e => {
  const row = (e.target as HTMLElement).closest<HTMLElement>('.history-row');
  if (!row) return;
  const id = row.dataset.orderId!;
  const detail = document.getElementById(`hd-${id}`)!;
  const isOpen = !detail.hidden;
  detail.hidden = isOpen;
  row.classList.toggle('history-row-open', !isOpen);
});

// ═══════════════════════════════════════════════
//  PAYMENTS
// ═══════════════════════════════════════════════

let activePayTab = 'overview';

document.getElementById('pay-tabs')!.addEventListener('click', e => {
  const tab = (e.target as HTMLElement).closest<HTMLElement>('.pay-tab');
  if (!tab?.dataset.tab) return;
  activePayTab = tab.dataset.tab;
  document.querySelectorAll('.pay-tab').forEach(t => t.classList.toggle('active', t === tab));
  document.querySelectorAll('.pay-panel').forEach(p => p.classList.toggle('active', p.id === `pay-panel-${activePayTab}`));
  renderPayments();
});

document.getElementById('payments-date-from')!.addEventListener('change', renderPayments);
document.getElementById('payments-date-to')!.addEventListener('change', renderPayments);

function getFilteredOrdersForExport() {
  const { start, end } = getPayDateRange();
  return orders.filter(o => o.status !== 'cancelled' && o.placedAt >= start && o.placedAt <= end);
}

document.getElementById('btn-export-items')?.addEventListener('click', () => {
  const ro = getFilteredOrdersForExport();
  const itemMap = new Map<string, { name: string; cat: string; qty: number; revenue: number }>();
  ro.forEach(o => o.items.forEach(it => {
    const e = itemMap.get(it.name);
    if (e) { e.qty += it.qty; e.revenue += it.price * it.qty; }
    else    itemMap.set(it.name, { name: it.name, cat: menuItems.find(m => m.name === it.name)?.cat ?? '—', qty: it.qty, revenue: it.price * it.qty });
  }));
  const itemsSorted = [...itemMap.values()].sort((a, b) => b.qty - a.qty);

  let csv = 'Item,Category,Qty Sold,Revenue\n';
  itemsSorted.forEach(it => {
    csv += `"${it.name}","${it.cat}",${it.qty},${it.revenue}\n`;
  });
  downloadCsv(csv, `items_sold_${new Date().toISOString().split('T')[0]}.csv`);
});

document.getElementById('btn-export-payments')?.addEventListener('click', () => {
  const { start, end } = getPayDateRange();
  let csv = 'Table,Date,Time,Duration (mins),Orders,Total (PKR),Status\n';
  
  const tablesInRange = tables.filter(t => 
    t.sessionStart !== null && t.sessionStart >= start && t.sessionStart <= end
  );
  
  tablesInRange.forEach(t => {
    const rangeTotal = orders.filter(o => o.tableId === t.id && o.status !== 'cancelled' && o.placedAt >= start && o.placedAt <= end).reduce((s, o) => s + o.total, 0);
    const orderCount = orders.filter(o => o.tableId === t.id && o.status !== 'cancelled' && o.placedAt >= start && o.placedAt <= end).length;
    const sessionDate = new Date(t.sessionStart!).toLocaleDateString();
    const sessionTime = new Date(t.sessionStart!).toLocaleTimeString();
    
    csv += `"${t.id}","${sessionDate}","${sessionTime}","${sessionDuration(t.sessionStart)}",${orderCount},${rangeTotal},"${t.paid ? 'Paid' : 'Outstanding'}"\n`;
  });
  downloadCsv(csv, `payments_${new Date().toISOString().split('T')[0]}.csv`);
});

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function getPayDateRange(): { start: number; end: number; isOneDay: boolean } {
  const t = new Date();
  const todayStr = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
  const fromVal  = (document.getElementById('payments-date-from') as HTMLInputElement).value || todayStr;
  const toVal    = (document.getElementById('payments-date-to')   as HTMLInputElement).value || todayStr;
  const [fy, fm, fd] = fromVal.split('-').map(Number);
  const [ty, tm, td] = toVal.split('-').map(Number);
  return {
    start:     new Date(fy, fm - 1, fd,  0,  0,  0,   0).getTime(),
    end:       new Date(ty, tm - 1, td, 23, 59, 59, 999).getTime(),
    isOneDay:  fromVal === toVal,
  };
}

function renderPayments() {
  const { start, end, isOneDay } = getPayDateRange();

  const fromVal = (document.getElementById('payments-date-from') as HTMLInputElement).value;
  const toVal   = (document.getElementById('payments-date-to')   as HTMLInputElement).value;
  const fmtD    = (v: string) => { const [y, m, d] = v.split('-').map(Number); return new Date(y, m-1, d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }); };
  document.getElementById('payments-sub')!.textContent =
    isOneDay ? `Today · ${fmtD(fromVal)}` : `${fmtD(fromVal)} – ${fmtD(toVal)}`;

  if (activePayTab === 'overview') renderPaymentsOverview(start, end, isOneDay);
  if (activePayTab === 'items')    renderPaymentsItems(start, end);
  if (activePayTab === 'records')  renderPaymentsRecords(start, end);
}

function renderPaymentsOverview(start: number, end: number, isOneDay: boolean) {
  const ro = orders.filter(o => o.status !== 'cancelled' && o.placedAt >= start && o.placedAt <= end);

  const totalRevenue = ro.reduce((s, o) => s + o.total, 0);
  const orderCount   = ro.length;
  const collected    = ro.filter(o =>  tables.find(t => t.id === o.tableId)?.paid).reduce((s, o) => s + o.total, 0);
  const outstanding  = ro.filter(o => { const t = tables.find(x => x.id === o.tableId); return t && !t.paid && t.status === 'active'; }).reduce((s, o) => s + o.total, 0);

  document.getElementById('payments-stats')!.innerHTML = `
    <div class="pay-stat-card">
      <div class="pay-stat-label">Total Revenue</div>
      <div class="pay-stat-value">${fmt(totalRevenue)}</div>
      <div class="pay-stat-meta">${orderCount} order${orderCount !== 1 ? 's' : ''}</div>
    </div>
    <div class="pay-stat-card pay-stat-emerald">
      <div class="pay-stat-label">Collected</div>
      <div class="pay-stat-value">${fmt(collected)}</div>
    </div>
    <div class="pay-stat-card pay-stat-gold">
      <div class="pay-stat-label">Outstanding</div>
      <div class="pay-stat-value">${fmt(outstanding)}</div>
    </div>
  `;

  renderSalesChart(start, end, isOneDay, ro);
}

function renderSalesChart(start: number, end: number, isOneDay: boolean, ro: AdminOrder[]) {
  let labels: string[] = [];
  let values: number[] = [];

  if (isOneDay) {
    values = Array(24).fill(0);
    ro.forEach(o => { values[new Date(o.placedAt).getHours()] += o.total; });
    labels = Array.from({ length: 24 }, (_, i) =>
      i === 0 ? '12a' : i < 12 ? `${i}a` : i === 12 ? '12p' : `${i - 12}p`
    );
  } else {
    const dayMap = new Map<string, number>();
    const cursor = new Date(start); cursor.setHours(0, 0, 0, 0);
    const endD   = new Date(end);
    const localKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    while (cursor <= endD) {
      dayMap.set(localKey(cursor), 0);
      cursor.setDate(cursor.getDate() + 1);
    }
    ro.forEach(o => {
      const d = new Date(o.placedAt);
      const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (dayMap.has(k)) dayMap.set(k, (dayMap.get(k) ?? 0) + o.total);
    });
    labels = [...dayMap.keys()].map(k => { const d = new Date(k + 'T12:00:00'); return `${d.getDate()}/${d.getMonth()+1}`; });
    values = [...dayMap.values()];
  }

  const barCount   = values.length;
  const maxVal     = Math.max(...values, 1);
  const W = 800, H = 220, padL = 68, padR = 20, padT = 20, padB = 40;
  const chartW     = W - padL - padR;
  const chartH     = H - padT - padB;
  const gap        = chartW / barCount;
  const barW       = Math.max(3, gap * 0.65);
  const labelEvery = isOneDay ? 4 : barCount > 14 ? 2 : 1;

  const parts: string[] = [];

  [0.25, 0.5, 0.75, 1.0].forEach(f => {
    const y   = padT + chartH * (1 - f);
    const lbl = maxVal * f >= 1000 ? `${((maxVal * f) / 1000).toFixed(1)}k` : String(Math.round(maxVal * f));
    parts.push(`<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W-padR}" y2="${y.toFixed(1)}" stroke="rgba(107,26,42,.08)" stroke-width="1"/>`);
    parts.push(`<text x="${padL-8}" y="${(y+4).toFixed(1)}" text-anchor="end" font-family="Poppins,sans-serif" font-size="9" fill="#8A7265">${lbl}</text>`);
  });
  parts.push(`<line x1="${padL}" y1="${padT+chartH}" x2="${W-padR}" y2="${padT+chartH}" stroke="rgba(107,26,42,.18)" stroke-width="1.5"/>`);

  values.forEach((v, i) => {
    const cx   = padL + i * gap + gap / 2;
    const bx   = cx - barW / 2;
    const barH = v > 0 ? Math.max(2, (v / maxVal) * chartH) : 2;
    const by   = padT + chartH - barH;
    const isMax = v === maxVal && v > 0;
    parts.push(`<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" rx="2.5" fill="${isMax ? '#C9973A' : '#6B1A2A'}" opacity="${v > 0 ? '1' : '0.1'}"/>`);
    if (v > 0 && barH > 22) {
      const lbl = v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);
      parts.push(`<text x="${cx.toFixed(1)}" y="${(by-5).toFixed(1)}" text-anchor="middle" font-family="Poppins,sans-serif" font-size="8" fill="${isMax ? '#a57a2a' : '#6B1A2A'}" font-weight="600">${lbl}</text>`);
    }
    if (i % labelEvery === 0) {
      parts.push(`<text x="${cx.toFixed(1)}" y="${(padT+chartH+16).toFixed(1)}" text-anchor="middle" font-family="Poppins,sans-serif" font-size="${barCount > 20 ? '7' : '9'}" fill="#8A7265">${labels[i]}</text>`);
    }
  });

  document.getElementById('pay-chart-wrap')!.innerHTML = `
    <div class="pay-chart-title">${isOneDay ? 'Revenue by Hour' : 'Revenue by Day'}</div>
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">${parts.join('')}</svg>
  `;
}

function renderPaymentsItems(start: number, end: number) {
  const ro    = orders.filter(o => o.status !== 'cancelled' && o.placedAt >= start && o.placedAt <= end);
  const tbody = document.getElementById('items-sold-tbody')!;

  if (ro.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--clr-muted);font-family:var(--ff-ui)">No items sold in this period</td></tr>`;
    return;
  }

  const itemMap = new Map<string, { name: string; cat: string; qty: number; revenue: number }>();
  ro.forEach(o => o.items.forEach(it => {
    const e = itemMap.get(it.name);
    if (e) { e.qty += it.qty; e.revenue += it.price * it.qty; }
    else    itemMap.set(it.name, { name: it.name, cat: menuItems.find(m => m.name === it.name)?.cat ?? '—', qty: it.qty, revenue: it.price * it.qty });
  }));

  const sorted = [...itemMap.values()].sort((a, b) => b.qty - a.qty).slice(0, 3);
  tbody.innerHTML = sorted.map((item, i) => {
    const rank  = i + 1;
    const badge = rank === 1 ? '<span class="badge badge-received" style="margin-left:.5rem">Bestseller</span>'
                : rank === 2 ? '<span class="badge badge-served"   style="margin-left:.5rem">Popular</span>' : '';
    return `
      <tr>
        <td class="text-center"><span class="sell-rank sell-rank-${rank <= 3 ? rank : 'n'}">${rank}</span></td>
        <td style="font-family:var(--ff-ui);font-size:.85rem">${item.name}${badge}</td>
        <td style="font-family:var(--ff-ui);font-size:.82rem;color:var(--clr-muted)">${catLabel(item.cat)}</td>
        <td class="text-right" style="font-family:var(--ff-ui);font-weight:700">${item.qty}</td>
        <td class="text-right" style="font-family:var(--ff-ui);font-weight:700;color:var(--clr-primary)">${fmt(item.revenue)}</td>
      </tr>`;
  }).join('');
}

function renderPaymentsRecords(start: number, end: number) {
  const tablesInRange = tables.filter(t =>
    orders.some(o => o.tableId === t.id && o.status !== 'cancelled' && o.placedAt >= start && o.placedAt <= end)
  ).map(t => {
    const rangeTotal = orders.filter(o => o.tableId === t.id && o.status !== 'cancelled' && o.placedAt >= start && o.placedAt <= end).reduce((s, o) => s + o.total, 0);
    const orderCount = orders.filter(o => o.tableId === t.id && o.status !== 'cancelled' && o.placedAt >= start && o.placedAt <= end).length;
    return { ...t, rangeTotal, orderCount };
  }).sort((a, b) => b.rangeTotal - a.rangeTotal).slice(0, 3);
  const tbody = document.getElementById('payments-tbody')!;

  if (tablesInRange.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--clr-muted);font-family:var(--ff-ui)">No records in this period</td></tr>`;
    return;
  }

  tbody.innerHTML = tablesInRange.map(t => {
    const rangeTotal = t.rangeTotal;
    const orderCount = t.orderCount;
    const sessionDate = t.sessionStart ? new Date(t.sessionStart).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
    const sessionTime = t.sessionStart ? new Date(t.sessionStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
    const statusBadge = t.paid ? '<span class="badge badge-paid">Paid</span>' : '<span class="badge badge-received">Outstanding</span>';
    return `
      <tr>
        <td><span class="order-table-badge">${t.id}</span></td>
        <td style="font-family:var(--ff-ui);font-size:.82rem;color:var(--clr-muted);white-space:nowrap">${sessionDate}</td>
        <td style="font-family:var(--ff-ui);font-size:.82rem;color:var(--clr-muted)">${sessionTime}</td>
        <td style="font-family:var(--ff-ui);font-size:.82rem;color:var(--clr-muted)">${sessionDuration(t.sessionStart)}</td>
        <td style="font-family:var(--ff-ui);font-size:.82rem;color:var(--clr-muted)">${orderCount}</td>
        <td class="text-right" style="font-family:var(--ff-ui);font-weight:700;color:var(--clr-primary)">${fmt(rangeTotal)}</td>
        <td>${statusBadge}</td>
        <td>
          <div class="actions-cell">
            <button class="btn-icon" data-action="pay-view-bill" data-table="${t.id}" title="View Bill"><i class="ri-receipt-line"></i></button>
            ${!t.paid ? `<button class="btn-icon pay-mark-btn" data-action="pay-mark-paid" data-table="${t.id}" title="Mark Paid"><i class="ri-secure-payment-line"></i></button>` : ''}
          </div>
        </td>
      </tr>`;
  }).join('');
}

document.getElementById('payments-tbody')!.addEventListener('click', e => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!btn) return;
  const tableId = btn.dataset.table!;
  if (btn.dataset.action === 'pay-view-bill') openTableBill(tableId);
  if (btn.dataset.action === 'pay-mark-paid') {
    const t = tables.find(x => x.id === tableId);
    if (t && !t.paid) {
      t.paid = true;
      showToast(`${t.id} marked as paid`, 'success');
      renderPayments();
      if (activeSection === 'tables') renderTables();
    }
  }
});

// ═══════════════════════════════════════════════
//  ALERTS
// ═══════════════════════════════════════════════

function renderAlerts() {
  const list    = document.getElementById('alerts-list')!;
  const pending = alerts.filter(a => !a.dismissed);
  document.getElementById('alerts-sub')!.textContent =
    pending.length > 0 ? `${pending.length} pending request${pending.length > 1 ? 's' : ''}` : 'No pending alerts';

  if (alerts.length === 0) {
    list.innerHTML = `<div class="alerts-empty"><i class="ri-alarm-warning-line"></i>No alerts yet</div>`;
    return;
  }
  list.innerHTML = alerts.map(a => `
    <div class="alert-card ${a.dismissed ? 'dismissed' : ''}">
      <div class="alert-icon ${a.type}">
        <i class="${a.type === 'waiter' ? 'ri-service-line' : 'ri-receipt-2-line'}"></i>
      </div>
      <div class="alert-info">
        <div class="alert-table">${a.tableId}</div>
        <div class="alert-type">${a.type === 'waiter' ? 'Waiter requested' : 'Bill requested'}</div>
        <div class="alert-time">${timeAgo(a.time)}</div>
      </div>
      <button class="alert-dismiss ${a.dismissed ? 'done' : ''}" data-action="dismiss" data-id="${a.id}">
        ${a.dismissed ? '<i class="ri-check-line"></i> Done' : 'Dismiss'}
      </button>
    </div>
  `).join('');
  updateBadges();
}

document.getElementById('alerts-list')!.addEventListener('click', e => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!btn) return;
  const a = alerts.find(x => x.id === btn.dataset.id);
  if (a) { 
    a.dismissed = true; 
    localStorage.setItem('riwayat_alerts', JSON.stringify(alerts));
  }
  renderAlerts();
  if (activeSection === 'tables') renderTables();
});

document.getElementById('btn-dismiss-all')!.addEventListener('click', () => {
  alerts.forEach(a => a.dismissed = true);
  localStorage.setItem('riwayat_alerts', JSON.stringify(alerts));
  renderAlerts();
  showToast('All alerts dismissed', 'success');
});

// ═══════════════════════════════════════════════
//  MODALS
// ═══════════════════════════════════════════════

function closeModal(id: string) { document.getElementById(id)!.hidden = true; }

document.body.addEventListener('click', e => {
  const btn = (e.target as HTMLElement).closest('[data-modal]') as HTMLElement;
  if (btn) {
    closeModal(btn.dataset.modal!);
  }
});
document.querySelectorAll<HTMLElement>('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.hidden = true; });
});

// ═══════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════

pinInput.focus();
