# RIWAYAT — Feature Specification & Planning Document

> Complete record of all features built, in progress, and planned.
> Cross-reference with `RESTAURANT_CONCEPT.md` for design system and architecture decisions.
> Update this file whenever a feature ships or requirements change.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Built and working |
| 🔒 | Built and locked — no changes unless owner requests |
| ⏳ | Planned, not yet started |
| 🔥 | Current active build |
| 💡 | Idea / under consideration |
| ❌ | Explicitly out of scope |

---

## Project Overview

**RIWAYAT (روایات)** — Pakistani fine dining restaurant app. Three-phase build:

| Phase | Scope | Status |
|-------|-------|--------|
| Phase 1 | Public marketing website | 🔒 Built & locked |
| Phase 2 | QR in-restaurant ordering (customer-facing) | ✅ Complete |
| Phase 3 | Staff admin dashboard (internal) | ✅ Complete |
| Backend | Database, auth, real-time, APIs | ⏳ After all UI phases |
| Payments | Stripe live integration | ⏳ After backend |

**Build strategy:** All UI phases first in vanilla HTML + TypeScript + Vite (mock data, no backend). Backend and live integrations added in a second pass.

---

## Phase 1 — Public Marketing Website

**Files:** `index.html`, `src/style.css`, `src/main.ts`
**URL:** `http://localhost:5173/`
**Status:** 🔒 Locked. No modifications unless owner explicitly requests.

### 1.1 Navbar
| Feature | Status | Detail |
|---------|--------|--------|
| Sticky positioning | ✅ | Fixed to top, full-width |
| Scroll transparency effect | ✅ | Transparent on hero, solid dark on scroll past 60px |
| Active section tracking | ✅ | IntersectionObserver highlights current nav link |
| Smooth scroll to sections | ✅ | Offset accounts for navbar height (`--nav-h` CSS var) |
| Mobile hamburger menu | ✅ | Toggles with animation, closes on outside click or link click |
| Aria accessibility | ✅ | `aria-expanded` on hamburger, focus management |

### 1.2 Hero Section
| Feature | Status | Detail |
|---------|--------|--------|
| Full-screen background | ✅ | `100vh`, food photography |
| Ken Burns zoom animation | ✅ | Slow CSS scale animation on background image |
| Jali pattern overlay | ✅ | SVG geometric lattice at low opacity |
| Urdu accent text | ✅ | Noto Nastaliq Urdu font |
| CTA buttons | ✅ | "Reserve a Table" + "View Menu" |

### 1.3 About / Our Story
| Feature | Status | Detail |
|---------|--------|--------|
| Stats row | ✅ | Est. year, covers, experience years |
| Gold-framed image | ✅ | Offset border referencing Mughal arch aesthetic |
| Est. badge | ✅ | Decorative badge overlaid on image |

### 1.4 Signature Dishes
| Feature | Status | Detail |
|---------|--------|--------|
| 3 dish cards | ✅ | Photo, name, description, price |
| Hover zoom on image | ✅ | CSS transform scale |
| Featured badge | ✅ | Chef's Pick / Signature tags |

### 1.5 Full Menu
| Feature | Status | Detail |
|---------|--------|--------|
| 7 tabbed categories | ✅ | Starters, Grills, Karahi, Biryani, Breads, Desserts, Beverages |
| 40+ menu items | ✅ | Name, description, PKR price |
| Tab switching animation | ✅ | Active panel shown, others hidden |

### 1.6 Specials & Offers
| Feature | Status | Detail |
|---------|--------|--------|
| Dark background section | ✅ | Contrast break |
| 3 offer cards | ✅ | Weekend special, group offer, celebration package |
| Featured ribbon | ✅ | CSS ribbon on primary offer |

### 1.7 Gallery
| Feature | Status | Detail |
|---------|--------|--------|
| CSS grid masonry layout | ✅ | Variable height grid |
| Lightbox | ✅ | Full-screen overlay on click |
| Lightbox navigation | ✅ | Prev / Next buttons |
| Keyboard navigation | ✅ | Esc to close, ← → to navigate |
| Caption display | ✅ | Shown below image in lightbox |

### 1.8 Testimonials
| Feature | Status | Detail |
|---------|--------|--------|
| Auto-play carousel | ✅ | 5s interval |
| Dot navigation | ✅ | Clickable dots, active state |
| Prev / Next buttons | ✅ | Manual navigation resets autoplay |

### 1.9 Reservation → Payment Flow
| Feature | Status | Detail |
|---------|--------|--------|
| Reservation form | ✅ | Name, phone, date, time, guests, occasion, notes |
| Field validation | ✅ | All required fields checked on submit |
| Future-date guard | ✅ | Rejects past dates, sets `min` to today |
| Inline field errors | ✅ | Per-field error messages, cleared on fix |
| Payment step (step 2) | ✅ | "Secure Your Table" — PKR 1,000 refundable deposit |
| Card number field | ✅ | Formats as `XXXX XXXX XXXX XXXX` |
| Network detection | ✅ | Visa (4x), Mastercard (51–55), Amex (34/37) |
| Expiry field | ✅ | Formats as `MM / YY` |
| CVV field | ✅ | Digits only, max 3 |
| Mock pay flow | ✅ | 1.8s processing animation → success |
| Skip payment option | ✅ | "I'll pay at the venue" bypasses card step |
| Context-aware confirmation | ✅ | Different message for paid vs skipped |

### 1.10 Location & Hours
| Feature | Status | Detail |
|---------|--------|--------|
| Hours table | ✅ | Days and opening times |
| WhatsApp button | ✅ | Opens WhatsApp with pre-filled message |
| Call button | ✅ | `tel:` link |

### 1.11 Footer
| Feature | Status | Detail |
|---------|--------|--------|
| Newsletter signup | ✅ | Submit animation, re-enables after 3.5s |
| Social links | ✅ | Instagram, Facebook, WhatsApp |
| Legal links | ✅ | Privacy policy, terms (placeholder pages) |

### 1.12 Global Utilities
| Feature | Status | Detail |
|---------|--------|--------|
| WhatsApp float button | ✅ | Fixed bottom-right, always visible |
| Back to top button | ✅ | Appears after 500px scroll, smooth scroll to top |
| Scroll reveal animations | ✅ | IntersectionObserver — `.reveal-up`, `.reveal-left`, `.reveal-right` |

---

## Phase 2 — QR In-Restaurant Ordering (Customer)

**Files:** `dine.html`, `src/dine.css`, `src/dine.ts`
**URL:** `http://localhost:5173/dine.html?table=T07`
**Status:** ✅ Complete

### Architecture
- App shell pattern: `max-width: 430px`, `100dvh`, `overflow: hidden`
- Single-page, no routing — screens toggled with `[hidden]` attribute
- All state in-memory (lost on refresh — no backend yet)
- `tableId` read from `?table=` URL query param on load
- `?table=DISABLED` shows the unavailable screen

### 2.1 Welcome Screen
| Feature | Status | Detail |
|---------|--------|--------|
| Blurred food background | ✅ | Dark overlay gradient for readability |
| RIWAYAT logo (EN + Urdu) | ✅ | Cinzel + Noto Nastaliq |
| Table badge from URL | ✅ | Reads `?table=` param, displays prominently |
| Browse Menu CTA | ✅ | Enters app, shows bottom nav + waiter float |
| Call Waiter shortcut | ✅ | Opens waiter bottom sheet from welcome screen |

### 2.2 Menu Browser
| Feature | Status | Detail |
|---------|--------|--------|
| App header | ✅ | Logo, table badge, cart icon with badge |
| Live search | ✅ | Filters by name and description as you type |
| Search clear button | ✅ | Appears when search has text, resets on click |
| Category tabs | ✅ | All + 8 categories (incl. Platters), horizontal scroll, active state |
| 2-column item grid | ✅ | Card per item with image, name, desc, price |
| Quick-add button | ✅ | `+` on card adds qty 1 with no note, shows toast |
| Item detail on tap | ✅ | Opens bottom sheet (does not navigate away) |
| Sold Out state | ✅ | Badge overlay, card dimmed, pointer-events off |
| No results state | ✅ | Empty state shown when search returns nothing |
| 34 menu items | ✅ | 7 categories, PKR prices |

**Menu categories and price ranges:**
| Category | Count | Price Range |
|----------|-------|-------------|
| Starters | 6 | PKR 700 – 1,350 |
| Grills | 5 | PKR 1,250 – 2,800 |
| Karahi & Curries | 6 | PKR 1,100 – 2,400 |
| Biryani & Rice | 4 | PKR 900 – 2,000 |
| Breads | 4 | PKR 120 – 250 |
| Desserts | 4 | PKR 550 – 750 |
| Beverages | 4 | PKR 300 – 450 |
| Platters | 1 | PKR 3,500 |

### 2.3 Item Detail Bottom Sheet
| Feature | Status | Detail |
|---------|--------|--------|
| 16:9 food photo | ✅ | Full-width at top of sheet |
| Tags (Chef's Pick, Signature, etc.) | ✅ | Emerald pill badges |
| Name, description, base price | ✅ | |
| Add-ons / extras | ✅ | Multi-select, each adds to price |
| Special request textarea | ✅ | Optional, appended to cart item note |
| Quantity stepper | ✅ | Min 1, increases/decreases |
| Live price on CTA | ✅ | "Add to Cart — PKR X" updates with qty + extras |
| Close on backdrop tap | ✅ | |

### 2.4 Cart
| Feature | Status | Detail |
|---------|--------|--------|
| Cart badge on header icon | ✅ | Total quantity across all items |
| Cart bottom sheet | ✅ | Itemized list with images |
| Per-item qty controls | ✅ | Decrease removes item when reaches 0 |
| Item note display | ✅ | Extras and special request shown below name |
| Subtotal | ✅ | Live sum of all items |
| Empty state on last removal | ✅ | Stale item cleared from DOM; empty view shown correctly |
| Payment note | ✅ | "Payment collected by staff at your table" |
| Place Order button | ✅ | Opens confirmation sheet |
| Backdrop full coverage | ✅ | Dim overlay covers entire viewport — no bright strip on left |

### 2.5 Order Confirmation Sheet
| Feature | Status | Detail |
|---------|--------|--------|
| Order summary | ✅ | All items with quantities and per-item total |
| Grand total | ✅ | |
| Warning copy | ✅ | "Cannot be changed once confirmed" |
| Go Back button | ✅ | Returns to cart sheet |
| Confirm button | ✅ | Places order, clears cart, navigates to tracker |

### 2.6 Order Tracker Screen
| Feature | Status | Detail |
|---------|--------|--------|
| Order batch cards | ✅ | One card per placed order |
| Status badge per batch | ✅ | Received / In Kitchen / On Its Way / Served |
| Timestamp | ✅ | Time order was placed |
| Item list per batch | ✅ | Qty × name + price |
| Running total | ✅ | Sum across all batches |
| Order badge on nav | ✅ | Count of active (non-served) orders |
| Empty state | ✅ | With "Browse Menu" shortcut button |
| Live status updates | ✅ | Re-renders when simulation fires |

### 2.7 Order Demo Simulation
| Feature | Status | Detail |
|---------|--------|--------|
| Step 1 — In Kitchen | ✅ | After 10 seconds |
| Step 2 — On Its Way | ✅ | After 35 seconds |
| Step 3 — Served | ✅ | After 60 seconds |
| Toast per step | ✅ | Info toast with contextual message |
| Badge update | ✅ | Order badge decrements when batch served |
| Tracker re-render | ✅ | Only re-renders if tracker screen is active |

### 2.8 My Bill Screen
| Feature | Status | Detail |
|---------|--------|--------|
| Itemized list | ✅ | All items from all placed orders |
| Grand total | ✅ | Sum of all order batches |
| Pay Now button | ✅ | Primary CTA — opens payment sheet |
| Pay Now shows amount | ✅ | Button label updates with live total |
| Request Bill button | ✅ | Ghost CTA — staff brings physical bill |
| Request Bill lock | ✅ | Button disables + changes label after click |
| Empty state | ✅ | Before any orders are placed |
| Paid confirmation state | ✅ | Shows after digital payment — replaces action buttons |

### 2.9 In-App Payment Sheet
| Feature | Status | Detail |
|---------|--------|--------|
| Amount due card | ✅ | Maroon gradient, gold Cinzel amount |
| Card number field | ✅ | Formats `XXXX XXXX XXXX XXXX` live |
| Network detection | ✅ | VISA / MC / AMEX detected by prefix |
| Expiry field | ✅ | Formats `MM / YY` live |
| CVV field | ✅ | Digits only, max 3 |
| Cardholder name | ✅ | Free text |
| Empty field validation | ✅ | Red border on empty fields at submit |
| Error clears on input | ✅ | Red border removed as soon as user types |
| Processing state | ✅ | 1.8s — button shows spinner + "Processing…" |
| Payment confirmed | ✅ | Bill screen shows green receipt state |
| Cancel button | ✅ | Closes sheet, no payment made |
| Session lock after payment | ✅ | New orders blocked with toast message |

### 2.10 Call Waiter
| Feature | Status | Detail |
|---------|--------|--------|
| Floating gold button | ✅ | Always visible above bottom nav |
| Bottom sheet | ✅ | "A member of staff will be with you shortly" |
| Thank You dismiss | ✅ | Closes sheet |
| Welcome screen shortcut | ✅ | Also accessible before entering menu |

### 2.11 Toast Notifications
| Feature | Status | Detail |
|---------|--------|--------|
| Success toast (green icon) | ✅ | Item added, order placed, payment confirmed |
| Info toast (gold icon) | ✅ | Order status updates, bill request sent |
| Auto-dismiss | ✅ | 3 seconds, fade-out animation |
| Stack layout | ✅ | Multiple toasts stack vertically |

### 2.12 Disabled Table Screen
| Feature | Status | Detail |
|---------|--------|--------|
| Dark screen | ✅ | Shown when `?table=DISABLED` |
| Error icon + message | ✅ | Instructs guest to speak to staff |

---

## Phase 3 — Staff Admin Dashboard

**Files:** `admin.html`, `src/admin.css`, `src/admin.ts`
**URL:** `/admin.html` (PIN-protected, not linked from customer pages)
**Status:** ✅ Complete (UI with mock data)
**Vite config:** `admin` entry added to `rollupOptions.input`

> **Scope decisions made:** Single admin role (no role system — one PIN for all staff). Reservations Inbox and Staff Accounts removed — not needed at this stage. Platters and per-item discounts added beyond original spec.

### 3.1 Login Screen
| Feature | Status | Detail |
|---------|--------|--------|
| PIN input | ✅ | 4-digit PIN, Enter key supported |
| Login validation | ✅ | Mock credential in TS (real auth post-backend) |
| Wrong PIN error | ✅ | Inline error message, input cleared |
| Single admin account | ✅ | No role system — one account controls everything |

### 3.2 Live Orders Feed
| Feature | Status | Detail |
|---------|--------|--------|
| Order cards per table | ✅ | Table badge, order ID, time ago, items with qty + price |
| Special notes display | ✅ | Per-item notes and extras shown below item row |
| Color-coded status badges | ✅ | Received (gold), Kitchen (orange), Ready (emerald), Served (muted), Cancelled (red) |
| Order age display | ✅ | "X min ago" / "Xh Xm ago" relative time |
| Active-only filter | ✅ | Toggle between active orders and all orders |
| Active order count badge | ✅ | Nav badge shows count of non-served orders |
| Order total per card | ✅ | Shown in card footer |

### 3.3 Order Management
| Feature | Status | Detail |
|---------|--------|--------|
| Advance status | ✅ | Received → In Kitchen → Ready → Served (one step at a time) |
| Cancel order | ✅ | Opens modal with reason dropdown |
| Cancel reasons | ✅ | Item unavailable / Customer request / Kitchen error / Other |
| Cancel reason stored | ✅ | Attached to order object |
| Toast on status change | ✅ | Confirms action with new status |

### 3.4 Table Management
| Feature | Status | Detail |
|---------|--------|--------|
| 12-table grid (T01–T12) | ✅ | Responsive card grid |
| Table status badges | ✅ | Empty / Active / Disabled |
| Paid badge on table card | ✅ | Green "Paid" badge when bill marked paid |
| Waiter alert dot | ✅ | Pulsing gold dot when table has unhandled alert |
| Session duration | ✅ | Time elapsed since session start |
| Order count + total | ✅ | Active orders and running bill total on card |
| View Bill | ✅ | Full itemized bill modal per table |
| Mark as Paid | ✅ | Sets table paid flag, shows Paid badge in modal and on card |
| Reset table | ✅ | Clears session and paid flag; shown after bill is marked paid |
| Disable table | ✅ | Blocks QR app — shows disabled screen to guests |
| Enable table | ✅ | Re-enables QR ordering |

### 3.5 Menu Management
| Feature | Status | Detail |
|---------|--------|--------|
| Full item table (34 items) | ✅ | Name + image thumb + description, category, price, status toggles, actions |
| Add new item | ✅ | Modal: name, category, price, description, image upload |
| Image upload | ✅ | File picker (JPG/PNG/WEBP) → FileReader data URL preview |
| Edit item | ✅ | Pre-fills modal with existing values including image preview |
| Delete item | ✅ | Removes from in-memory list |
| Toggle Sold Out | ✅ | Chip toggle per item — shown in menu table |
| Toggle Hidden | ✅ | Hides item from customer QR app |
| Category filter | ✅ | Filter table by category |
| Inline price edit | ✅ | Input field in price column, updates on change |

### 3.6 Platters
| Feature | Status | Detail |
|---------|--------|--------|
| Platter item type | ✅ | Separate type from single items — toggle in add/edit modal |
| Category auto-set and locked | ✅ | Switching to Platter type forces category to "Platters" and disables the dropdown |
| Component selection | ✅ | Multi-select checkbox list of all single items |
| Platters category | ✅ | Own category in menu filter + item table |
| Platter badge | ✅ | "Platter" badge on item name in menu table |
| Components listed | ✅ | Comma-separated component names shown under platter name |
| Platter excluded from own list | ✅ | Cannot add a platter as a component of another platter |

### 3.7 Discounts
| Feature | Status | Detail |
|---------|--------|--------|
| Discount type: none | ✅ | No discount (default) |
| Discount type: percentage | ✅ | e.g. 20% off → final price = price × 0.80 |
| Discount type: flat | ✅ | e.g. PKR 200 off → final price = price − 200 |
| Applies to both items and platters | ✅ | Discount field in add/edit modal for both types |
| Strike-through price display | ✅ | Original price crossed out, discounted price shown in maroon |
| Discount badge | ✅ | "X% off" or "PKR X off" badge in item name column |

### 3.8 Order History
| Feature | Status | Detail |
|---------|--------|--------|
| Order history table | ✅ | Full list of all orders: ID, table, time, item count, total, status |
| Expandable rows | ✅ | Click any row to expand/collapse item breakdown |
| Expand chevron indicator | ✅ | Rotates 90° when row is open |
| Item breakdown | ✅ | Per-item qty × name, notes, extras, and line total |
| Cancelled order reason | ✅ | Cancellation reason shown in expanded detail row |
| Order count sub-heading | ✅ | "X orders total" shown below section title |
| All statuses shown | ✅ | Received, In Kitchen, Ready, Served, Cancelled |

### 3.9 Waiter Alerts Feed
| Feature | Status | Detail |
|---------|--------|--------|
| Alert cards | ✅ | Table ID, type (Call Waiter / Bill Request), time ago |
| Distinct icons per type | ✅ | Service bell for waiter, receipt for bill |
| Dismiss per alert | ✅ | Marks handled, card greys out |
| Dismiss All | ✅ | Clears all pending alerts at once |
| Pending count badge | ✅ | Gold nav badge with count of unhandled alerts |
| Dismissed state preserved | ✅ | Dismissed cards remain visible but greyed |

### 3.10 Sections removed from original spec
| Section | Decision |
|---------|----------|
| Reservation Inbox | ❌ Removed — not needed at this stage |
| Staff Accounts | ❌ Removed — single admin account, no multi-user management |
| Role matrix (Owner/Admin/Staff) | ❌ Removed — single admin role |
| Sound alerts | ⏳ Deferred to backend phase (needs real-time events) |
| Drag reorder | ⏳ Deferred — needs backend persistence to be meaningful |
| Bulk price update | ⏳ Deferred — inline price edit covers current need |

---

## Phase 4 — Backend

**Status:** ⏳ After all UI phases complete
**Prerequisite:** Phase 3 admin dashboard UI done

### 4.1 Database
| Feature | Status | Detail |
|---------|--------|--------|
| Tables schema | ⏳ | id, number, status, disabled |
| Sessions schema | ⏳ | tableId, token, startedAt, expiresAt (4h), paidAt |
| Orders schema | ⏳ | sessionId, items (JSON), total, status, placedAt |
| Menu schema | ⏳ | id, name, desc, price, category, available, hidden, sortOrder |
| Reservations schema | ⏳ | name, phone, date, time, guests, occasion, notes, depositPaid, status |
| Staff schema | ⏳ | id, name, role, passwordHash, lastActive |
| Alerts schema | ⏳ | tableId, type (waiter/bill), createdAt, handledAt |

### 4.2 Auth
| Feature | Status | Detail |
|---------|--------|--------|
| Staff login | ⏳ | Credentials-based, no email/OAuth |
| JWT session tokens | ⏳ | Stored in `sessionStorage`, 8h expiry |
| Role middleware | ⏳ | API routes check role from token |
| Table session token | ⏳ | UUID in `localStorage`, 4h expiry, one per table |

### 4.3 Real-time
| Feature | Status | Detail |
|---------|--------|--------|
| Order push to admin | ⏳ | Pusher or Socket.io — new orders appear instantly |
| Status sync to customer | ⏳ | Push status changes to dine app |
| Waiter alert push | ⏳ | Push call-waiter + bill-request to admin in real-time |

### 4.4 APIs Required
| Endpoint | Method | Consumer |
|----------|--------|---------|
| `/api/menu` | GET | Dine app, admin |
| `/api/menu/:id` | PATCH, DELETE | Admin |
| `/api/orders` | GET, POST | Dine app, admin |
| `/api/orders/:id/status` | PATCH | Admin |
| `/api/tables` | GET | Admin |
| `/api/tables/:id` | PATCH | Admin (disable/enable/reset) |
| `/api/sessions` | POST | Dine app (start session) |
| `/api/sessions/:token` | GET | Dine app (restore state) |
| `/api/alerts` | GET, POST | Dine app (create), admin (read) |
| `/api/alerts/:id/handle` | PATCH | Admin |
| `/api/reservations` | GET, POST | Public site, admin |
| `/api/staff` | GET, POST, DELETE | Admin (owner only) |
| `/api/auth/login` | POST | Admin dashboard |
| `/api/payments/confirm` | POST | Dine app (mock → real Stripe) |

---

## Phase 5 — Stripe Integration

**Status:** ⏳ After backend
**Scope:** Public website reservation deposits only

| Feature | Status | Detail |
|---------|--------|--------|
| Stripe Elements | ⏳ | Replace mock card form in Phase 1 reservation flow |
| PKR 1,000 deposit | ⏳ | Charge on reservation confirm |
| Refund on cancellation | ⏳ | Auto-refund if cancelled via admin |
| Webhook handling | ⏳ | `payment_intent.succeeded` → update reservation |
| Payment link fallback | ⏳ | WhatsApp payment link for phone reservations |

**Not in scope for Stripe:**
- ❌ In-app dine payment via Stripe (customer pays at table with card form — mock only for now)
- ❌ Table-side POS integration

---

## Design System (Locked)

### Colors
| Token | Name | Hex |
|-------|------|-----|
| `--clr-primary` | Deep Maroon | `#6B1A2A` |
| `--clr-primary-d` | Dark Maroon | `#4e1320` |
| `--clr-primary-l` | Mid Maroon | `#8a2236` |
| `--clr-gold` | Royal Gold | `#C9973A` |
| `--clr-gold-l` | Warm Gold | `#e0b060` |
| `--clr-gold-d` | Deep Gold | `#a57a2a` |
| `--clr-emerald` | Emerald Green | `#1B5E3B` |
| `--clr-bg` | Ivory | `#FBF5E6` |
| `--clr-bg-alt` | Deep Cream | `#f4ead5` |
| `--clr-dark` | Deep Charcoal | `#1C1018` |
| `--clr-text` | Near-Black | `#1A1017` |
| `--clr-muted` | Warm Taupe | `#8A7265` |

### Typography
| Role | Font | Used for |
|------|------|---------|
| Display | Cormorant Garamond | Section headings, item names, taglines |
| Cinzel | Cinzel | Logo, section labels, nav, badges |
| Body | Mulish | Descriptions, body copy |
| UI | Poppins | Buttons, inputs, labels, prices, metadata |
| Urdu | Noto Nastaliq Urdu | Decorative Urdu script accents |

### CSS Patterns (mandatory)
- `[hidden] { display: none !important }` declared globally in each stylesheet — overrides any explicit `display:` rule so `element.hidden = true` always works reliably
- Bottom sheets: `translateX(-50%) translateY(100%)` default → `translateX(-50%) translateY(0)` open
- All monetary values in `PKR` prefix with `.toLocaleString()` formatting
- Toast stack: always positioned above bottom nav (`bottom: calc(var(--nav-bottom) + 1rem)`)

---

## Open Questions

| # | Question | Affects | Priority |
|---|----------|---------|---------|
| 1 | Restaurant name confirmed? (`RIWAYAT` is placeholder) | Logo, domain, brand assets | High |
| 2 | How many tables? | Table grid in admin, QR code print run | High |
| 3 | Who manages the admin URL? Direct `/admin.html` or a subdomain? | Deployment config | Medium |
| 4 | Dietary tags needed? (Halal, Contains Nuts, Gluten-Free) | Menu data, item cards | Medium |
| 5 | Reservation notification method? | Email to staff vs WhatsApp vs admin inbox | Medium |
| 6 | Number of staff accounts? | Auth complexity | Low |
| 7 | Service charge percentage? | Bill screen, final total calculation | Medium |
| 8 | Table number format? (T01 vs 1 vs Table 1) | QR URL format, display labels | Medium |

---

## Technical Stack

### Current (UI Phase — all mock)
| Layer | Choice |
|-------|--------|
| Language | TypeScript (vanilla, no framework) |
| Build tool | Vite (multi-page: index + dine + admin entries) |
| Styling | Vanilla CSS with custom properties |
| Icons | RemixIcon CDN (`remixicon@4.2.0`) |
| Fonts | Google Fonts |
| Images | Unsplash placeholder URLs |
| State | In-memory TypeScript variables |
| Repo | github.com/syedabis/Riwayat |

### Planned (Post-UI full build)
| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | Next.js 14+ App Router | SSR for Phase 1 SEO, SPA feel for Phase 2 & 3 |
| Styling | Tailwind CSS + shadcn/ui | Admin UI speed |
| Real-time | Pusher or Socket.io | Order push without polling |
| Database | PostgreSQL via Prisma | Relational: orders, sessions, menu, staff |
| Auth | NextAuth.js (credentials) | Staff login, no email/OAuth needed |
| Images | Cloudinary or Vercel Blob | Food photography storage |
| Payments | Stripe | Public site reservation deposits |
| Deployment | Vercel | Zero-config Next.js hosting |

---

## Git Commit History

| Commit | Description |
|--------|-------------|
| `db3b3e8` | Initial commit — Riwayat restaurant app (Phase 1 + Phase 2 UI) |
| `c0b1f00` | Add order simulation + Stripe deposit UI |
| `d3264f7` | Add in-app card payment to dine (Phase 2 Bill screen) |

---

*Last updated: 2026-05-18 | Active build: Phase 3 admin dashboard — continuing admin section*
