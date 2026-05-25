import './dine.css';

// ═══════════════════════════════════════════════
//  MENU DATA
// ═══════════════════════════════════════════════

interface Extra { label: string; price: number; }
interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  cat: string;
  img: string;
  tags?: string[];
  extras?: Extra[];
  hidden?: boolean;
}

const MENU: MenuItem[] = [
  // Starters
  { id: 's1', cat: 'starters', name: 'Seekh Kebab', price: 1200, desc: 'Minced lamb with aromatic spices, grilled over charcoal.', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', tags: ['Chef\'s Pick'] },
  { id: 's2', cat: 'starters', name: 'Chicken Malai Boti', price: 1100, desc: 'Tender chicken in cream and mild spice marinade.', img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&q=80' },
  { id: 's3', cat: 'starters', name: 'Fish Tikka', price: 1350, desc: 'Fresh fish marinated in carom and citrus, char-grilled.', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
  { id: 's4', cat: 'starters', name: 'Nihari Shorba', price: 850, desc: 'Rich slow-cooked broth with slow-braised beef, served with naan.', img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80' },
  { id: 's5', cat: 'starters', name: 'Shammi Kebab', price: 950, desc: 'Minced beef and lentil patties, pan-fried crisp.', img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80' },
  { id: 's6', cat: 'starters', name: 'Dahi Bara Chaat', price: 700, desc: 'Lentil dumplings in yoghurt with tamarind and mint chutney.', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
  // Grills
  { id: 'g1', cat: 'grills', name: 'Barra Lamb Chops', price: 2800, desc: 'Raan chops in Kashmiri spice rub, grilled to perfection.', img: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&q=80', tags: ['Signature'] },
  { id: 'g2', cat: 'grills', name: 'Chapli Kebab', price: 1400, desc: 'Peshawar-style spiced mince patties on the griddle.', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80' },
  { id: 'g3', cat: 'grills', name: 'Tandoori Prawns', price: 1800, desc: 'Tiger prawns in a turmeric-citrus marinade, clay oven fired.', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
  { id: 'g4', cat: 'grills', name: 'Achari Murgh Tikka', price: 1300, desc: 'Chicken in pickle-spiced yoghurt, smoky and tangy.', img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&q=80' },
  { id: 'g5', cat: 'grills', name: 'Reshmi Kebab', price: 1250, desc: 'Silky chicken mince kebabs with rose water and saffron.', img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80' },
  { id: 'g6', cat: 'platters', name: 'Mixed Grill Platter', price: 3500, desc: 'Assortment of our signature kebabs — ideal for sharing.', img: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&q=80', tags: ['For 2'], extras: [{ label: 'Extra naan (2 pcs)', price: 240 }] },
  // Karahi & Curries
  { id: 'k1', cat: 'karahi', name: 'Chicken Karahi', price: 1600, desc: 'Wok-tossed chicken in tomatoes, ginger and green chilli.', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', tags: ['Bestseller'] },
  { id: 'k2', cat: 'karahi', name: 'Mutton Karahi', price: 2200, desc: 'Slow-cooked tender mutton, rich karahi gravy.', img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80' },
  { id: 'k3', cat: 'karahi', name: 'Rogan Josh', price: 2400, desc: 'Kashmiri lamb curry, bloomed spices, scarlet colour.', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
  { id: 'k4', cat: 'karahi', name: 'Saag Gosht', price: 2100, desc: 'Lamb simmered in spiced mustard greens.', img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80' },
  { id: 'k5', cat: 'karahi', name: 'Lahori Dal Makhani', price: 1100, desc: 'Black lentils slow-cooked overnight with butter and cream.', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
  { id: 'k6', cat: 'karahi', name: 'Nihari', price: 2000, desc: 'Braised beef shank in deep, slow-cooked spiced gravy.', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', tags: ['Weekend'] },
  // Biryani
  { id: 'b1', cat: 'biryani', name: 'Sindhi Mutton Biryani', price: 1800, desc: 'Dum-cooked mutton with saffron-scented Sindhi spices.', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', tags: ['Signature'] },
  { id: 'b2', cat: 'biryani', name: 'Chicken Biryani', price: 1400, desc: 'Classic layered biryani with whole spices and fried onions.', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80' },
  { id: 'b3', cat: 'biryani', name: 'Zafrani Pulao', price: 900, desc: 'Fragrant saffron rice with whole spices and golden raisins.', img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80' },
  { id: 'b4', cat: 'biryani', name: 'Prawn Biryani', price: 2000, desc: 'Tiger prawns layered with spiced basmati, slow-steamed.', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
  // Breads
  { id: 'br1', cat: 'breads', name: 'Tandoori Roti', price: 120, desc: 'Wholemeal flatbread, freshly baked in the clay oven.', img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80' },
  { id: 'br2', cat: 'breads', name: 'Garlic Naan', price: 180, desc: 'Leavened bread brushed with garlic butter and coriander.', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
  { id: 'br3', cat: 'breads', name: 'Peshwari Naan', price: 250, desc: 'Stuffed with almonds, coconut and sultanas.', img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80' },
  { id: 'br4', cat: 'breads', name: 'Laccha Paratha', price: 200, desc: 'Multi-layered flaky flatbread from the griddle.', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
  // Desserts
  { id: 'd1', cat: 'desserts', name: 'Gulab Jamun', price: 650, desc: 'Soft milk dumplings soaked in rose and cardamom syrup.', img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80' },
  { id: 'd2', cat: 'desserts', name: 'Shahi Tukra', price: 750, desc: 'Royal bread pudding with condensed milk and pistachios.', img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80' },
  { id: 'd3', cat: 'desserts', name: 'Pistachio Kulfi', price: 550, desc: 'Frozen milk ice cream set on a stick, dense and creamy.', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
  { id: 'd4', cat: 'desserts', name: 'Kheer', price: 600, desc: 'Rice pudding slow-cooked with cardamom and rose water.', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
  // Beverages
  { id: 'bv1', cat: 'beverages', name: 'Kashmiri Chai', price: 400, desc: 'Pink salt tea brewed with pistachios and almonds.', img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80', tags: ['Popular'] },
  { id: 'bv2', cat: 'beverages', name: 'Mango Lassi', price: 450, desc: 'Chilled yoghurt blended with Sindhri mango pulp.', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
  { id: 'bv3', cat: 'beverages', name: 'Rooh Afza Sharbat', price: 350, desc: 'Classic rose syrup drink with basil seeds and ice.', img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80' },
  { id: 'bv4', cat: 'beverages', name: 'Fresh Lime Soda', price: 300, desc: 'Freshly squeezed lime with sparkling water and mint.', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
];

// ═══════════════════════════════════════════════
//  SESSION
// ═══════════════════════════════════════════════

const params = new URLSearchParams(location.search);
const tableId: string = params.get('table') || 'T01';

// ═══════════════════════════════════════════════
//  CART STATE
// ═══════════════════════════════════════════════

interface CartItem {
  id: string;
  menuId: string;
  name: string;
  price: number;
  qty: number;
  note: string;
  img: string;
  cat: string;
  prepTime: number;
}

interface OrderBatch {
  id: string;
  items: CartItem[];
  total: number;
  status: 'received' | 'kitchen' | 'on-its-way' | 'served';
  placedAt: number;
  billingRound: number;
}

let cart: CartItem[] = [];
let orders: OrderBatch[] = [];
let nextCartId = 1;
let nextOrderId = 1;
let currentBillingRound = 1;
const paidRounds = new Set<number>();

// ═══════════════════════════════════════════════
//  ELEMENT REFS
// ═══════════════════════════════════════════════

const screenWelcome  = document.getElementById('screen-welcome')!;
const screenUserDetails = document.getElementById('screen-user-details')!;
const screenMenu     = document.getElementById('screen-menu')!;
const screenCart     = document.getElementById('screen-cart')!;
const screenTracker  = document.getElementById('screen-tracker')!;
const screenBill     = document.getElementById('screen-bill')!;
const screenDisabled = document.getElementById('screen-disabled')!;

const bottomNav    = document.getElementById('bottomNav')!;
const cartBadge    = document.getElementById('cartBadge')!;
const orderBadge   = document.getElementById('orderBadge')!;
const toastStack   = document.getElementById('toastStack')!;

// Table labels
const welcomeTableNum   = document.getElementById('welcomeTableNum')!;
const menuTableBadge    = document.getElementById('menuTableBadge')!;
const cartTableBadge    = document.getElementById('cartTableBadge')!;
const trackerTableBadge = document.getElementById('trackerTableBadge')!;
const billTableBadge    = document.getElementById('billTableBadge')!;

// Menu-top collapse refs
const menuTopEl    = document.querySelector<HTMLElement>('#screen-menu .menu-top')!;
const menuScrollEl = document.querySelector<HTMLElement>('#screen-menu .menu-scroll')!;

// Screens map
const screenMap: Record<string, HTMLElement> = {
  menu: screenMenu,
  cart: screenCart,
  tracker: screenTracker,
  bill: screenBill,
};

// ═══════════════════════════════════════════════
//  SCREEN NAVIGATION
// ═══════════════════════════════════════════════

// ─── Menu-top scroll collapse ───────────────────
function resetMenuTop(): void {
  menuScrollEl.scrollTop = 0;
  menuTopEl.style.height = `${Math.min(window.innerHeight * 0.75, 300)}px`;
}

menuScrollEl.addEventListener('scroll', () => {
  const scrollY   = menuScrollEl.scrollTop;
  const fullH     = Math.min(window.innerHeight * 0.75, 300);
  const minH      = (menuTopEl.querySelector<HTMLElement>('.app-header')?.offsetHeight ?? 52)
                  + (menuTopEl.querySelector<HTMLElement>('.search-wrap')?.offsetHeight  ?? 56);
  const maxScroll = 150;
  const ratio     = Math.min(scrollY / maxScroll, 1);
  const eased     = 1 - Math.pow(1 - ratio, 2);

  menuTopEl.style.height = `${fullH - (fullH - minH) * eased}px`;
});

function showScreen(name: 'menu' | 'cart' | 'tracker' | 'bill'): void {
  Object.values(screenMap).forEach(s => s.hidden = true);
  screenMap[name].hidden = false;

  document.querySelectorAll<HTMLElement>('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === name);
  });

  if (name === 'menu') resetMenuTop();
  if (name === 'cart') renderCartScreen();
  if (name === 'tracker') renderTracker();
  if (name === 'bill') renderBill();
}

document.querySelectorAll<HTMLButtonElement>('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    showScreen(btn.dataset.screen as 'menu' | 'cart' | 'tracker' | 'bill');
  });
});

document.getElementById('btnTrackerToMenu')?.addEventListener('click', () => showScreen('menu'));

// ═══════════════════════════════════════════════
//  INIT: READ TABLE + SHOW WELCOME
// ═══════════════════════════════════════════════

function init(): void {
  welcomeTableNum.textContent   = tableId;
  menuTableBadge.textContent    = tableId;
  cartTableBadge.textContent    = tableId;
  trackerTableBadge.textContent = tableId;
  billTableBadge.textContent    = tableId;

  // Simulate disabled table check (would be a real API call)
  const isDisabled = tableId === 'DISABLED';
  if (isDisabled) {
    screenDisabled.hidden = false;
    return;
  }

  const previewScreen = params.get('screen');
  if (previewScreen === 'menu') {
    bottomNav.hidden = false;
    resetMenuTop();
    showScreen('menu');
    buildMenuGrid('all');
    return;
  }

  const userDetailsStr = sessionStorage.getItem('riwayat_user');
  if (!userDetailsStr) {
    screenUserDetails.hidden = false;
  } else {
    window.userDetails = JSON.parse(userDetailsStr);
    screenWelcome.hidden = false;
  }
}

// Global user details
declare global {
  interface Window { userDetails: any; }
}

document.getElementById('btn-submit-details')?.addEventListener('click', () => {
  const name = (document.getElementById('ud-name') as HTMLInputElement).value.trim();
  const email = (document.getElementById('ud-email') as HTMLInputElement).value.trim();
  const phone = (document.getElementById('ud-phone') as HTMLInputElement).value.trim();
  
  if (!name || !phone) {
    showToast('Name and Phone are required.', 'error');
    return;
  }
  
  window.userDetails = { name, email, phone };
  sessionStorage.setItem('riwayat_user', JSON.stringify(window.userDetails));
  
  screenUserDetails.hidden = true;
  screenWelcome.hidden = false;
});

document.getElementById('btnBrowse')?.addEventListener('click', () => {
  screenWelcome.hidden = true;
  bottomNav.hidden = false;
  resetMenuTop();
  showScreen('menu');
  buildMenuGrid('all');
});

init();

// ═══════════════════════════════════════════════
//  MENU GRID
// ═══════════════════════════════════════════════

const menuGrid    = document.getElementById('menuGrid')!;
const noResults   = document.getElementById('noResults')!;
const searchInput = document.getElementById('menuSearch') as HTMLInputElement;
const searchClear = document.getElementById('searchClear')!;
const catTabs     = document.querySelectorAll<HTMLButtonElement>('.cat-tab');

let activecat = 'all';
let searchQuery = '';

function buildMenuGrid(cat: string): void {
  activecat = cat;
  let items = cat === 'all' ? MENU : MENU.filter(m => m.cat === cat);
  items = items.filter(m => !m.hidden);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    items = items.filter(m => m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q));
  }

  menuGrid.innerHTML = '';
  noResults.hidden = items.length > 0;

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-img-wrap">
        <img class="item-card-img" src="${item.img}" alt="${item.name}" loading="lazy" />
        ${item.tags?.[0] ? `<span class="item-card-tag">${item.tags[0]}</span>` : ''}
      </div>
      <div class="item-card-body">
        <div class="item-card-name">${item.name}</div>
        <div class="item-card-desc">${item.desc}</div>
        <div class="item-card-footer">
          <span class="item-card-price">PKR ${item.price.toLocaleString()}</span>
          <button class="item-add-btn" aria-label="Add ${item.name}"><i class="ri-add-line"></i></button>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openItemSheet(item));
    card.querySelector('.item-add-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      quickAddToCart(item);
    });
    menuGrid.appendChild(card);
  });
}

catTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    catTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    buildMenuGrid(tab.dataset.cat || 'all');
  });
});

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  searchClear.hidden = !searchQuery;
  buildMenuGrid(activecat);
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  searchClear.hidden = true;
  buildMenuGrid(activecat);
});

// ═══════════════════════════════════════════════
//  ITEM DETAIL SHEET
// ═══════════════════════════════════════════════

const itemBackdrop   = document.getElementById('itemBackdrop')!;
const itemSheet      = document.getElementById('itemSheet')!;
const itemSheetImg   = document.getElementById('itemSheetImg') as HTMLImageElement;
const itemSheetName  = document.getElementById('itemSheetName')!;
const itemSheetDesc  = document.getElementById('itemSheetDesc')!;
const itemSheetPrice = document.getElementById('itemSheetPrice')!;
const itemSheetTags  = document.getElementById('itemSheetTags')!;
const extrasSection  = document.getElementById('extrasSection')!;
const extrasList     = document.getElementById('extrasList')!;
const itemNote       = document.getElementById('itemNote') as HTMLTextAreaElement;
const qtyVal         = document.getElementById('qtyVal')!;
const addToCartPrice = document.getElementById('addToCartPrice')!;

let currentItem: MenuItem | null = null;
let currentQty = 1;
let selectedExtras: Extra[] = [];

function openItemSheet(item: MenuItem): void {
  currentItem = item;
  currentQty = 1;
  selectedExtras = [];

  itemSheetImg.src = item.img;
  itemSheetImg.alt = item.name;
  itemSheetName.textContent = item.name;
  itemSheetDesc.textContent = item.desc;
  itemSheetPrice.textContent = `PKR ${item.price.toLocaleString()}`;
  itemNote.value = '';
  qtyVal.textContent = '1';

  itemSheetTags.innerHTML = (item.tags || []).map(t => `<span class="item-sheet-tag">${t}</span>`).join('');

  if (item.extras?.length) {
    extrasSection.hidden = false;
    extrasList.innerHTML = item.extras.map(ex => `
      <div class="extra-option" data-label="${ex.label}" data-price="${ex.price}">
        <span class="extra-option-label">${ex.label}</span>
        <span class="extra-option-price">+PKR ${ex.price.toLocaleString()}</span>
      </div>
    `).join('');
    extrasList.querySelectorAll<HTMLElement>('.extra-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const label = opt.dataset.label!;
        const price = parseInt(opt.dataset.price!);
        const idx = selectedExtras.findIndex(e => e.label === label);
        if (idx >= 0) {
          selectedExtras.splice(idx, 1);
          opt.classList.remove('selected');
        } else {
          selectedExtras.push({ label, price });
          opt.classList.add('selected');
        }
        updateAddToCartPrice();
      });
    });
  } else {
    extrasSection.hidden = true;
    extrasList.innerHTML = '';
  }

  updateAddToCartPrice();
  openSheet(itemBackdrop, itemSheet);
}

function updateAddToCartPrice(): void {
  if (!currentItem) return;
  const extrasTotal = selectedExtras.reduce((s, e) => s + e.price, 0);
  const total = (currentItem.price + extrasTotal) * currentQty;
  addToCartPrice.textContent = `PKR ${total.toLocaleString()}`;
}

document.getElementById('qtyMinus')?.addEventListener('click', () => {
  if (currentQty > 1) { currentQty--; qtyVal.textContent = String(currentQty); updateAddToCartPrice(); }
});
document.getElementById('qtyPlus')?.addEventListener('click', () => {
  currentQty++; qtyVal.textContent = String(currentQty); updateAddToCartPrice();
});

document.getElementById('btnAddToCart')?.addEventListener('click', () => {
  if (!currentItem) return;
  const extrasTotal = selectedExtras.reduce((s, e) => s + e.price, 0);
  const unitPrice = currentItem.price + extrasTotal;
  const noteVal = itemNote.value.trim();
  const extrasLabel = selectedExtras.map(e => e.label).join(', ');
  const note = [extrasLabel, noteVal].filter(Boolean).join(' · ');

  const existing = cart.find(c => c.menuId === currentItem!.id && c.note === note);
  if (existing) {
    existing.qty += currentQty;
  } else {
    cart.push({ id: String(nextCartId++), menuId: currentItem.id, name: currentItem.name, price: unitPrice, qty: currentQty, note, img: currentItem.img, cat: currentItem.cat, prepTime: currentItem.prepTime || 15 });
  }

  updateCartBadge();
  closeSheet(itemBackdrop, itemSheet);
  showToast(`${currentItem.name} added to cart`, 'success');
});

document.getElementById('itemSheetClose')?.addEventListener('click', () => closeSheet(itemBackdrop, itemSheet));
itemBackdrop.addEventListener('click', () => closeSheet(itemBackdrop, itemSheet));

// ═══════════════════════════════════════════════
//  QUICK ADD (+ button on card)
// ═══════════════════════════════════════════════

function quickAddToCart(item: MenuItem): void {
  const existing = cart.find(c => c.menuId === item.id && c.note === '');
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: String(nextCartId++), menuId: item.id, name: item.name, price: item.price, qty: 1, note: '', img: item.img, cat: item.cat, prepTime: item.prepTime || 15 });
  }
  updateCartBadge();
  showToast(`${item.name} added`, 'success');
}

// ═══════════════════════════════════════════════
//  CART SCREEN
// ═══════════════════════════════════════════════

const cartScreenEmpty    = document.getElementById('cartScreenEmpty')!;
const cartScreenBody     = document.getElementById('cartScreenBody')!;
const cartItemsScreen    = document.getElementById('cartItemsScreen')!;
const cartSubtotalScreen = document.getElementById('cartSubtotalScreen')!;

function renderCartScreen(): void {
  if (cart.length === 0) {
    cartScreenEmpty.hidden = false;
    cartScreenBody.hidden = true;
    return;
  }
  cartScreenEmpty.hidden = true;
  cartScreenBody.hidden = false;

  cartItemsScreen.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        ${item.note ? `<div class="cart-item-note">${item.note}</div>` : ''}
        <div class="cart-item-controls">
          <button class="cart-qty-btn cart-minus" data-id="${item.id}"><i class="ri-subtract-line"></i></button>
          <span class="cart-qty-val">${item.qty}</span>
          <button class="cart-qty-btn cart-plus" data-id="${item.id}"><i class="ri-add-line"></i></button>
        </div>
      </div>
      <span class="cart-item-price">PKR ${(item.price * item.qty).toLocaleString()}</span>
    </div>
  `).join('');

  cartItemsScreen.querySelectorAll<HTMLElement>('.cart-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id!;
      const item = cart.find(c => c.id === id);
      if (!item) return;
      if (item.qty > 1) { item.qty--; } else { cart = cart.filter(c => c.id !== id); }
      renderCartScreen();
      updateCartBadge();
    });
  });
  cartItemsScreen.querySelectorAll<HTMLElement>('.cart-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = cart.find(c => c.id === btn.dataset.id);
      if (item) { item.qty++; renderCartScreen(); updateCartBadge(); }
    });
  });

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  cartSubtotalScreen.textContent = `PKR ${subtotal.toLocaleString()}`;
}

document.getElementById('btnCartToMenu')?.addEventListener('click', () => showScreen('menu'));

// ═══════════════════════════════════════════════
//  ORDER CONFIRMATION SHEET
// ═══════════════════════════════════════════════

const confirmBackdrop = document.getElementById('confirmBackdrop')!;
const confirmSheet    = document.getElementById('confirmSheet')!;
const confirmSummary  = document.getElementById('confirmSummary')!;

document.getElementById('btnPlaceOrderScreen')?.addEventListener('click', () => {
  if (cart.length === 0) return;
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  confirmSummary.innerHTML = cart.map(item => `
    <div class="confirm-row">
      <span>${item.qty}× ${item.name}</span>
      <span>PKR ${(item.price * item.qty).toLocaleString()}</span>
    </div>
  `).join('') + `
    <div class="confirm-row" style="font-weight:700;border-top:1px solid var(--clr-border);padding-top:.4rem;margin-top:.2rem">
      <span>Total</span><span>PKR ${subtotal.toLocaleString()}</span>
    </div>
  `;
  openSheet(confirmBackdrop, confirmSheet);
});

document.getElementById('btnConfirmCancel')?.addEventListener('click', () => {
  closeSheet(confirmBackdrop, confirmSheet);
  showScreen('cart');
});

document.getElementById('btnConfirmOrder')?.addEventListener('click', () => {
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const batch: OrderBatch = {
    id: String(nextOrderId++),
    items: [...cart],
    total: subtotal,
    status: 'received',
    placedAt: Date.now(),
    billingRound: currentBillingRound,
  };
  orders.push(batch);
  cart = [];
  updateCartBadge();
  updateOrderBadge();
  closeSheet(confirmBackdrop, confirmSheet);
  showToast('Order placed! Kitchen is on it.', 'success');
  showScreen('tracker');
  startOrderSimulation(batch);
});

// ═══════════════════════════════════════════════
//  TRACKER RENDER
// ═══════════════════════════════════════════════

const trackerList  = document.getElementById('trackerList')!;
const trackerEmpty = document.getElementById('trackerEmpty')!;

const STATUS_LABELS: Record<string, string> = {
  received:    'Order Received',
  kitchen:     'In Kitchen',
  'on-its-way':'On Its Way',
  served:      'Served',
};
const STATUS_CLASS: Record<string, string> = {
  received:    'status-received',
  kitchen:     'status-kitchen',
  'on-its-way':'status-on-its-way',
  served:      'status-served',
};

function renderTracker(): void {
  if (orders.length === 0) {
    trackerEmpty.hidden = false;
    return;
  }
  trackerEmpty.hidden = true;
  
  const now = Date.now();
  
  trackerList.innerHTML = orders.map(batch => {
    const groups = {
      Starters: batch.items.filter(i => i.cat === 'starters'),
      'Main Course': batch.items.filter(i => i.cat !== 'starters' && i.cat !== 'desserts'),
      Desserts: batch.items.filter(i => i.cat === 'desserts')
    };
    
    let itemsHtml = '';
    for (const [gName, gItems] of Object.entries(groups)) {
      if (gItems.length === 0) continue;
      const maxPrep = Math.max(...gItems.map(i => i.prepTime || 15));
      const finishTime = batch.placedAt + maxPrep * 60000;
      const remainingMs = Math.max(0, finishTime - now);
      const remainingMins = Math.ceil(remainingMs / 60000);
      const timerText = batch.status === 'served' ? 'Served' : (remainingMins > 0 ? `${remainingMins}m remaining` : 'Almost ready');
      
      itemsHtml += `
        <div class="order-batch-group" style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px dashed var(--clr-border);">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
            <strong style="color:var(--clr-gold); font-size:0.85rem;">${gName}</strong>
            <span class="badge" style="background:var(--clr-surface); color:white;">${timerText}</span>
          </div>
          ${gItems.map(it => `
            <div class="order-batch-item">
              <span>${it.qty}× ${it.name}</span>
              <span class="order-batch-item-price">PKR ${(it.price * it.qty).toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    return `
    <div class="order-batch">
      <div class="order-batch-header">
        <span class="order-batch-num">Order #${batch.id} · ${formatTime(batch.placedAt)}</span>
        <span class="order-status-badge ${STATUS_CLASS[batch.status]}">${STATUS_LABELS[batch.status]}</span>
      </div>
      <div class="order-batch-items">
        ${itemsHtml}
      </div>
    </div>
  `}).join('') + (orders.length ? `<div style="padding:.2rem 0"><div class="order-batch-header" style="border:none;padding-bottom:0"><span class="order-batch-num" id="trackerTotal"></span></div></div>` : '');

  const totalEl = document.getElementById('trackerTotal');
  if (totalEl) {
    const grand = orders.reduce((s, b) => s + b.total, 0);
    totalEl.textContent = `Running total: PKR ${grand.toLocaleString()}`;
  }
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

setInterval(() => {
  if (!screenTracker.hidden) renderTracker();
}, 30000);

// ═══════════════════════════════════════════════
//  BILL RENDER
// ═══════════════════════════════════════════════

const billEmpty     = document.getElementById('billEmpty')!;
const billContent   = document.getElementById('billContent')!;
const billRounds    = document.getElementById('billRounds')!;
const billActions   = document.getElementById('billActions')!;
const billPayAmount = document.getElementById('billPayAmount')!;

function renderBill(): void {
  if (orders.length === 0) {
    billEmpty.hidden = false;
    billContent.hidden = true;
    return;
  }
  billEmpty.hidden = true;
  billContent.hidden = false;

  // Group orders by billing round
  const roundMap = new Map<number, OrderBatch[]>();
  orders.forEach(b => {
    if (!roundMap.has(b.billingRound)) roundMap.set(b.billingRound, []);
    roundMap.get(b.billingRound)!.push(b);
  });

  let html = '';
  roundMap.forEach((batches, roundId) => {
    const isPaid = paidRounds.has(roundId);
    const roundTotal = batches.reduce((s, b) => s + b.total, 0);
    const allItems = batches.flatMap(b => b.items);
    html += `<div class="bill-round${isPaid ? ' bill-round-paid' : ''}">`;
    if (isPaid) html += `<div class="bill-round-status"><i class="ri-checkbox-circle-fill"></i> Paid</div>`;
    html += `<div class="bill-items">`;
    html += allItems.map(it => `
      <div class="bill-item-row">
        <span>${it.qty}× ${it.name}</span>
        <span class="bill-item-price">PKR ${(it.price * it.qty).toLocaleString()}</span>
      </div>`).join('');
    html += `</div><div class="bill-divider"></div>`;
    html += `<div class="bill-row bill-total">
      <span>${isPaid ? 'Total Paid' : 'Total'}</span>
      <span>PKR ${roundTotal.toLocaleString()}</span>
    </div></div>`;
  });
  billRounds.innerHTML = html;

  const unpaidOrders = orders.filter(b => !paidRounds.has(b.billingRound));
  if (unpaidOrders.length > 0) {
    const unpaidTotal = unpaidOrders.reduce((s, b) => s + b.total, 0);
    billPayAmount.textContent = `PKR ${unpaidTotal.toLocaleString()}`;
    billActions.hidden = false;
  } else {
    billActions.hidden = true;
  }
}

document.getElementById('btnRequestBill')?.addEventListener('click', () => {
  showToast('Bill request sent — staff will be with you shortly.', 'info');
  const btn = document.getElementById('btnRequestBill') as HTMLButtonElement;
  btn.innerHTML = '<i class="ri-check-line"></i> Request Sent';
  btn.disabled = true;
});

// ═══════════════════════════════════════════════
//  CALL WAITER SHEET
// ═══════════════════════════════════════════════

const waiterBackdrop = document.getElementById('waiterBackdrop')!;
const waiterSheet    = document.getElementById('waiterSheet')!;

function openWaiterSheet(): void {
  openSheet(waiterBackdrop, waiterSheet);
}

document.querySelectorAll('.btn-call-waiter-header').forEach(btn => btn.addEventListener('click', openWaiterSheet));
document.getElementById('btnCallWaiterWelcome')?.addEventListener('click', openWaiterSheet);
document.getElementById('btnWaiterDone')?.addEventListener('click', () => closeSheet(waiterBackdrop, waiterSheet));
waiterBackdrop.addEventListener('click', () => closeSheet(waiterBackdrop, waiterSheet));

document.getElementById('btnWaiterSubmit')?.addEventListener('click', () => {
  const msgEl = document.getElementById('waiter-complaint-msg') as HTMLTextAreaElement;
  const msg = msgEl?.value.trim() || '';
  const user = window.userDetails ? `${window.userDetails.name} (${window.userDetails.phone})` : 'Guest';
  const table = document.getElementById('welcomeTableNum')?.textContent || 'T?';
  
  const text = msg ? `Complaint from ${user}: ${msg}` : 'Waiter requested';
  
  const stored = localStorage.getItem('riwayat_alerts');
  const alerts = stored ? JSON.parse(stored) : [];
  alerts.unshift({
    id: 'a-' + Date.now(),
    tableId: table,
    type: msg ? 'complaint' : 'service',
    time: Date.now(),
    text: text,
    dismissed: false
  });
  localStorage.setItem('riwayat_alerts', JSON.stringify(alerts));
  
  closeSheet(waiterBackdrop, waiterSheet);
  showToast(msg ? 'Message submitted' : 'Waiter called', 'success');
  if (msgEl) msgEl.value = '';
});

// ═══════════════════════════════════════════════
//  SHEET UTILS
// ═══════════════════════════════════════════════

function openSheet(backdrop: HTMLElement, sheet: HTMLElement): void {
  backdrop.classList.add('open');
  sheet.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSheet(backdrop: HTMLElement, sheet: HTMLElement): void {
  backdrop.classList.remove('open');
  sheet.classList.remove('open');
  document.body.style.overflow = '';
}

// ═══════════════════════════════════════════════
//  BADGE UPDATES
// ═══════════════════════════════════════════════

function updateCartBadge(): void {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  cartBadge.textContent = String(total);
  cartBadge.hidden = total === 0;
}

function updateOrderBadge(): void {
  const active = orders.filter(o => o.status !== 'served').length;
  orderBadge.textContent = String(active);
  orderBadge.hidden = active === 0;
}

// ═══════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════

// ═══════════════════════════════════════════════
//  ORDER STATUS DEMO SIMULATION
// ═══════════════════════════════════════════════

interface SimStep { delay: number; status: OrderBatch['status']; msg: string; }

const SIM_STEPS: SimStep[] = [
  { delay: 10000,  status: 'kitchen',     msg: 'Your order is in the kitchen!' },
  { delay: 35000,  status: 'on-its-way',  msg: 'Your order is on its way to the table.' },
  { delay: 60000,  status: 'served',      msg: 'Enjoy your meal! Bon appétit.' },
];

function startOrderSimulation(batch: OrderBatch): void {
  SIM_STEPS.forEach(({ delay, status, msg }) => {
    setTimeout(() => {
      batch.status = status;
      updateOrderBadge();
      if (!screenTracker.hidden) renderTracker();
      showToast(msg, 'info');
    }, delay);
  });
}

function showToast(msg: string, type: 'success' | 'info' | 'error' = 'success'): void {
  const icon = type === 'success' ? 'ri-checkbox-circle-line' : type === 'error' ? 'ri-error-warning-line' : 'ri-information-line';
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<i class="${icon}"></i><span>${msg}</span>`;
  toastStack.appendChild(el);
  setTimeout(() => {
    el.classList.add('hide');
    el.addEventListener('animationend', () => el.remove());
  }, 3000);
}

// ═══════════════════════════════════════════════
//  PAYMENT SHEET
// ═══════════════════════════════════════════════

const payBackdrop    = document.getElementById('payBackdrop')!;
const paySheet       = document.getElementById('paySheet')!;
const payAmountVal   = document.getElementById('payAmountVal')!;
const btnPayLabel    = document.getElementById('btnPayLabel')!;
const payCardNum     = document.getElementById('payCardNum')    as HTMLInputElement;
const payExpiry      = document.getElementById('payExpiry')     as HTMLInputElement;
const payCvv         = document.getElementById('payCvv')        as HTMLInputElement;
const payName        = document.getElementById('payName')       as HTMLInputElement;
const payCardNetwork = document.getElementById('payCardNetwork')!;
const btnPay         = document.getElementById('btnPay')        as HTMLButtonElement;

function openPaySheet(): void {
  const unpaid = orders.filter(b => !paidRounds.has(b.billingRound));
  const grand = unpaid.reduce((s, b) => s + b.total, 0);
  const formatted = `PKR ${grand.toLocaleString()}`;
  payAmountVal.textContent = formatted;
  btnPayLabel.textContent = formatted;
  payCardNum.value = '';
  payExpiry.value = '';
  payCvv.value = '';
  payName.value = '';
  payCardNetwork.textContent = '';
  [payCardNum, payExpiry, payCvv, payName].forEach(f => f.classList.remove('error'));
  btnPay.disabled = false;
  btnPay.innerHTML = `<i class="ri-bank-card-line"></i> Pay ${formatted} Securely`;
  openSheet(payBackdrop, paySheet);
}

// Card number formatting + network detection
payCardNum.addEventListener('input', () => {
  let v = payCardNum.value.replace(/\D/g, '').slice(0, 16);
  payCardNum.value = v.replace(/(.{4})/g, '$1 ').trim();
  const prefix = v.slice(0, 2);
  if (v[0] === '4')                                      payCardNetwork.textContent = 'VISA';
  else if (['51','52','53','54','55'].includes(prefix))  payCardNetwork.textContent = 'MC';
  else if (['34','37'].includes(prefix))                 payCardNetwork.textContent = 'AMEX';
  else                                                   payCardNetwork.textContent = '';
  payCardNum.classList.remove('error');
});

payExpiry.addEventListener('input', () => {
  let v = payExpiry.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2);
  payExpiry.value = v;
  payExpiry.classList.remove('error');
});

payCvv.addEventListener('input', () => {
  payCvv.value = payCvv.value.replace(/\D/g, '').slice(0, 3);
  payCvv.classList.remove('error');
});

payName.addEventListener('input', () => payName.classList.remove('error'));

document.getElementById('btnPayNow')?.addEventListener('click', openPaySheet);
document.getElementById('btnPayCancel')?.addEventListener('click', () => closeSheet(payBackdrop, paySheet));
payBackdrop.addEventListener('click', () => closeSheet(payBackdrop, paySheet));

btnPay.addEventListener('click', () => {
  let valid = true;
  [payCardNum, payExpiry, payCvv, payName].forEach(el => {
    if (!el.value.trim()) { el.classList.add('error'); valid = false; }
  });
  if (!valid) return;

  const unpaid = orders.filter(b => !paidRounds.has(b.billingRound));
  const grand = unpaid.reduce((s, b) => s + b.total, 0);
  const formatted = `PKR ${grand.toLocaleString()}`;
  btnPay.disabled = true;
  btnPay.innerHTML = '<i class="ri-loader-4-line"></i> Processing…';

  setTimeout(() => {
    paidRounds.add(currentBillingRound);
    currentBillingRound++;
    const reqBtn = document.getElementById('btnRequestBill') as HTMLButtonElement;
    reqBtn.innerHTML = '<i class="ri-receipt-line"></i> Request Bill';
    reqBtn.disabled = false;
    closeSheet(payBackdrop, paySheet);
    showToast(`Payment of ${formatted} confirmed. Thank you!`, 'success');
    renderBill();
  }, 1800);
});
