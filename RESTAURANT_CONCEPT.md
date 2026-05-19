# RIWAYAT — Restaurant App
## Project Context & Design Document

> Master reference file. Update this whenever decisions are made or phases completed.

---

## Current Focus

**All three UI phases are now complete.** Backend integration is the next milestone. The public-facing website (Phase 1) is parked; it will be polished and connected when backend work begins.

| Phase | Status | Priority |
|-------|--------|----------|
| Phase 1 — Public Website UI | ✅ Built | ⏸ Parked — polish + backend later |
| Phase 2 — QR In-Restaurant Ordering UI | ✅ Built | ✅ Complete, demo-ready |
| Phase 3 — Staff Admin Dashboard UI | ✅ Built | ✅ Complete, demo-ready |
| Backend / Database | ⏳ Pending | 🔥 Next milestone |
| Online Payments (Stripe) | ⏳ Pipeline | After backend — reservation deposits on public site |

---

## Restaurant Identity

| Field | Detail |
|-------|--------|
| **Working Name** | RIWAYAT (روایات) — means "Traditions" in Urdu. Placeholder until owner confirms. |
| **Cuisine** | Pakistani fine dining — Mughal-inspired, elevated traditional dishes |
| **Tone** | Regal, opulent, warm hospitality. Rich heritage, not cold luxury. |
| **Target Guest** | Affluent diners, cultural food lovers, special occasion visitors |
| **Ambiance** | Mughal arched interiors, carved wood, brass fixtures, candlelit warmth |
| **Location** | Lahore, Pakistan (Gulberg III placeholder address) |
| **Est.** | 2006 (placeholder) |
| **Phone** | +92 300 123 4567 (placeholder) |
| **In-restaurant payment** | In-app card payment on Bill screen (card form bottom sheet → 1.8s mock → confirmed receipt) |
| **Online payment** | Stripe — for public website reservation deposits (future) |

---

## Design System (LOCKED)

### Color Palette
| Role | Name | Hex |
|------|------|-----|
| Primary | Deep Maroon | `#6B1A2A` |
| Primary Dark | Dark Maroon | `#4e1320` |
| Primary Light | Mid Maroon | `#8a2236` |
| Gold | Royal Gold | `#C9973A` |
| Gold Light | Warm Gold | `#e0b060` |
| Gold Dark | Deep Gold | `#a57a2a` |
| Accent | Emerald Green | `#1B5E3B` |
| Background | Ivory / Warm Cream | `#FBF5E6` |
| Background Alt | Deep Cream | `#f4ead5` |
| Dark | Deep Charcoal | `#1C1018` |
| Dark 2 | Dark Plum | `#2a1e26` |
| Text | Near-Black | `#1A1017` |
| Muted | Warm Taupe | `#8A7265` |

### Typography
| Role | Font | Source |
|------|------|--------|
| Display / Headings | Cormorant Garamond | Google Fonts |
| Sub-headings / Logo / Tags | Cinzel | Google Fonts |
| Body text | Mulish | Google Fonts |
| UI / Buttons / Labels | Poppins | Google Fonts |
| Decorative Urdu | Noto Nastaliq Urdu | Google Fonts |

### Design Motifs (Phase 1)
- **Jali pattern** — SVG geometric lattice at low opacity as section texture
- **Gold rule dividers** — thin gradient lines with `✦` gem center between sections
- **Gold border frames** — offset border on images referencing Mughal arch aesthetics
- **Hero Ken Burns** — slow zoom animation on background image
- **Scroll reveal** — IntersectionObserver fade-up/left/right on section entry

### Design Motifs (Phase 2 / 3 — Internal)
- Same color palette, same fonts
- Mobile-first app shell: max-width 430px, `100dvh`, no page scroll
- Bottom sheets / modals for all overlays (item detail, confirm, waiter)
- Bottom navigation bar (Menu | Cart | Orders | Bill — 4 tabs)
- Call Waiter accessible via header icon button on all 4 screens
- Toast notifications (dark pill, slide-up animation)

---

## File Structure

```
d:\day1\New folder\              ← Git root (github.com/syedabis/Riwayat)
├── .gitignore                   ← Excludes .claude/ memory folder
├── RESTAURANT_CONCEPT.md        ← This file
└── restaurant-app/              ← Vite project root
    ├── index.html               ← Phase 1: public marketing site (10 sections)
    ├── dine.html                ← Phase 2: QR in-restaurant ordering app
    ├── package.json
    ├── package-lock.json
    ├── vite.config.ts           ← Multi-page build (index + dine entries)
    ├── tsconfig.json
    ├── .gitignore               ← Excludes node_modules, dist
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    └── src/
        ├── main.ts              ← Phase 1 interactions + payment step logic
        ├── style.css            ← Phase 1 stylesheet (~1,000 lines)
        ├── dine.ts              ← Phase 2 full app logic
        └── dine.css             ← Phase 2 app-shell stylesheet (~600 lines)
```

### Dev Server
```bash
cd "d:\day1\New folder\restaurant-app"
npm run dev
# Phase 1 → http://localhost:5173/
# Phase 2 → http://localhost:5173/dine.html?table=T07
```

---

## Phase 1 — Public Website ✅ BUILT (Parked)

> Built and functional. Not the current focus. Will be polished and wired to backend later.

### Sections
| # | Section | Status |
|---|---------|--------|
| 1 | Navbar | ✅ Sticky, scroll effect, mobile hamburger, active link tracking |
| 2 | Hero | ✅ Full-screen Ken Burns zoom, Jali overlay, Urdu accent, CTAs |
| 3 | About / Our Story | ✅ Stats, gold-framed image, Est. badge |
| 4 | Signature Dishes | ✅ 3 cards with photo, hover zoom, badges |
| 5 | Full Menu | ✅ 7 tabbed categories, 40+ items with PKR prices |
| 6 | Specials & Offers | ✅ Dark bg, 3 offer cards, Featured ribbon |
| 7 | Gallery | ✅ CSS grid masonry, lightbox with keyboard nav (Esc / ← / →) |
| 8 | Testimonials | ✅ Auto-play carousel, dot navigation, prev/next |
| 9 | Reservation Form → Payment Step | ✅ Validated form → Stripe deposit UI → confirmation |
| 10 | Location & Hours | ✅ Hours table, WhatsApp + Call buttons |
| 11 | Footer | ✅ Newsletter, social links, legal |
| — | WhatsApp float | ✅ Fixed bottom-right |
| — | Back to top | ✅ Appears after 500px scroll |

### Reservation → Payment Flow (3 steps)
1. Form (name, phone, date, time, guests, occasion, notes) with field validation + future-date check
2. Payment step — "Secure Your Table" deposit card:
   - PKR 1,000 refundable deposit (deducted from final bill)
   - Card number field with live network detection (Visa / MC / Amex)
   - Card number formatted as `XXXX XXXX XXXX XXXX`
   - Expiry formatted as `MM / YY`
   - CVV (3 digits), Cardholder name
   - "Pay PKR 1,000 Securely" → 1.8s mock processing → success
   - "Skip — I'll pay at the venue" → bypass payment → confirmation
3. Final confirmation with context-aware message (paid vs skipped)

### main.ts Features
- Navbar scroll effect + active section tracking (IntersectionObserver sections)
- Smooth scroll with navbar-height offset
- Mobile hamburger (closes on outside click, link click)
- Menu tab switching with panel animation
- Gallery lightbox (open/close/prev/next, keyboard Esc/←/→)
- Testimonials carousel (auto-play 5s, dot nav, prev/next, resetAutoplay on interaction)
- Reservation form validation (required fields + future-date guard)
- Payment step: show/hide, card formatting, mock pay flow, skip flow
- Newsletter form: feedback animation, re-enable after 3.5s
- IntersectionObserver scroll reveal (`.reveal-up`, `.reveal-left`, `.reveal-right`)
- Back-to-top visibility toggle (> 500px scroll)
- Date input min set to today on load

---

## Phase 2 — QR In-Restaurant Ordering ✅ BUILT

> Accessible at `/dine.html?table=T07`. Mobile-first app shell, max-width 430px.
> All data and order state is in-memory (mock). No backend yet.

### Customer Flow (implemented)
```
Scan QR → /dine.html?table=T07
      ↓
tableId read from URL query param
      ↓
Welcome screen (logo, table number, "Browse Menu" CTA)
      ↓
Menu browser: category tabs + live search + 34-item grid
      ↓
Tap card → Item detail bottom sheet (photo, desc, extras, note, qty)
  OR press + on card → quick-add (qty 1, no note)
      ↓
"Add to Cart" → cart badge on nav updates, toast shown
      ↓
Cart screen (nav tab): itemized, qty controls, subtotal
      ↓
"Place Order" → Order confirmation sheet (summary + total, cannot undo)
      ↓
"Yes, Place Order" → order added to current billing round, cart cleared
      ↓
ORDER DEMO SIMULATION:
  10s → status: "In Kitchen" + toast
  35s → status: "On Its Way" + toast
  60s → status: "Served" + toast, badge clears
      ↓
Order Tracker screen: batch cards with status badges, running total
      ↓
My Bill screen: billing rounds shown as stacked cards
  - Unpaid orders (same round) grouped together
  - Pay button shows unpaid total only
  - Paid rounds shown above with green "Paid" status, dimmed
      ↓
"Pay PKR X" → card payment sheet → 1.8s mock → confirmed
  → current round marked Paid, new billing round starts
      ↓
Guest can order again → new items form a separate billing round
  → billed and paid independently
      ↓
"Request Bill" → toast + button locked (resets after each payment)
```

### Screens Built
| Screen | Implementation |
|--------|---------------|
| Disabled Table | Dark screen, shown if `?table=DISABLED` |
| Welcome | Blurred food bg, logo (EN + Urdu), table badge from URL, Browse + Call Waiter |
| Menu Browser | App header (with waiter icon), live search with clear, category tabs (All + 7 cats), 2-col card grid |
| Item Detail | Bottom sheet: 16:9 photo, tags, name, desc, price, extras (multi-select), note textarea, qty stepper, "Add to Cart — PKR X" |
| Cart | Full screen (nav tab): item rows with image + qty controls, subtotal, Place Order |
| Order Confirmation | Bottom sheet: items summary, total, Go Back / Confirm |
| Order Tracker | Status badges (Received / In Kitchen / On Its Way / Served), running total |
| My Bill | Billing rounds as stacked cards — paid rounds (green badge, dimmed) + unpaid with Pay / Request Bill |
| Payment | Bottom sheet: amount due card, card/expiry/CVV/name fields, 1.8s mock → confirmed |
| Call Waiter | Header icon on all screens → bottom sheet → "Thank You" dismiss |

### Menu Data (hardcoded in dine.ts)
34 items across 7 categories. All prices in PKR:

| Category | Items | Price Range |
|----------|-------|-------------|
| Starters (6) | Seekh Kebab, Malai Boti, Fish Tikka, Nihari Shorba, Shammi Kebab, Dahi Bara | 700–1,350 |
| Grills (6) | Barra Lamb Chops, Chapli Kebab, Tandoori Prawns, Achari Tikka, Reshmi Kebab, Mixed Grill Platter | 1,250–3,500 |
| Karahi & Curries (6) | Chicken Karahi, Mutton Karahi, Rogan Josh, Saag Gosht, Dal Makhani, Nihari | 1,100–2,400 |
| Biryani & Rice (4) | Sindhi Mutton Biryani, Chicken Biryani, Zafrani Pulao, Prawn Biryani | 900–2,000 |
| Breads (4) | Tandoori Roti, Garlic Naan, Peshwari Naan, Laccha Paratha | 120–250 |
| Desserts (4) | Gulab Jamun, Shahi Tukra, Pistachio Kulfi, Kheer | 550–750 |
| Beverages (4) | Kashmiri Chai, Mango Lassi, Rooh Afza, Fresh Lime Soda | 300–450 |

### dine.ts Architecture
```
MENU[]                  ← 34 MenuItem objects (id, name, desc, price, cat, img, tags?, extras?)
cart: CartItem[]        ← active cart (survives screen switches, cleared on order place)
orders: OrderBatch[]    ← placed orders (status: received | kitchen | on-its-way | served)
currentBillingRound     ← int, increments each time a payment is confirmed
paidRounds: Set<number> ← which billing rounds have been paid

Screen navigation   ← showScreen('menu'|'cart'|'tracker'|'bill') swaps hidden attr
Bottom sheets       ← openSheet(backdrop, sheet) / closeSheet() toggle .open class
Cart badge          ← updateCartBadge() — total qty across all cart items
Order badge         ← updateOrderBadge() — count of non-served orders
Demo simulation     ← startOrderSimulation(batch): setTimeout chain updates batch.status
Toast               ← showToast(msg, 'success'|'info'): appended to #toastStack, auto-removes
```

### Session Rules (current — mock)
- `tableId` read from `?table=` URL param on load
- No `sessionToken` yet (no backend) — all state is in-memory, lost on page refresh
- `?table=DISABLED` shows the unavailable screen
- Full session logic (localStorage token, 4h expiry, multi-device same session) — pending backend

---

## Phase 3 — Staff Admin Dashboard ✅ BUILT

> URL: `/admin.html` | PIN: `1234` | Not linked from any customer-facing page

### Admin Sections Built
| Section | Status | Notes |
|---------|--------|-------|
| Login | ✅ | PIN screen (1234). Single admin account (Syed Abis). |
| Live Orders | ✅ | Cards with table, time, items, total, status badge. Filter: Active / All. Advance status, cancel with reason. |
| Tables | ✅ | 12-table grid. Active / Empty / Disabled. Session timer, order count, alert dot. Reset / Disable / Enable. View Bill modal. Mark as Paid. |
| Menu Management | ✅ | Full CRUD. Add / Edit / Delete. Sold Out / Hidden toggles. Category filter (incl. Platters). Single item + Platter type. Discount (% or flat). Image upload. |
| Waiter Alerts | ✅ | Waiter + Bill request cards. Dismiss individual or all. Badge count in nav. |
| Order History | ✅ | Expandable rows. Filters: text search, table, status, date range (from/to). Default sort: newest first. |
| Payments | ✅ | 3-tab section with shared date range filter (default: last 30 days). See breakdown below. |

### Payments Section — Tab Detail
| Tab | Content |
|-----|---------|
| Overview | Stat cards: Total Revenue, Collected, Outstanding. SVG bar chart — hourly when from = to (single day), daily for multi-day ranges. Peak bar highlighted in gold. |
| Items Sold | All items ranked by qty sold (desc). Bestseller / Popular badges on top 2. Columns: rank, name, category, qty, revenue. Date-range filtered. |
| Payment Records | Per-table rows: date, time, duration, order count, total, paid/outstanding status. View Bill + Mark Paid actions. Date-range filtered. |

### Not Yet Built (post-backend scope)
| Section | Notes |
|---------|-------|
| Reservation Inbox | Needs public site form submissions — backend required |
| Staff Accounts | Multi-user auth — backend required |
| Role-based access | Single admin PIN for now; Owner / Admin / Staff roles pending backend |
| Sound alerts | Visual-only currently |

### Files
- `restaurant-app/admin.html`
- `restaurant-app/src/admin.css`
- `restaurant-app/src/admin.ts`
- `vite.config.ts` — admin entry added

---

## Technical Stack

### Current (UI Phase — all mock, no backend)
| Layer | Choice |
|-------|--------|
| Language | TypeScript (vanilla, no framework) |
| Build tool | Vite 8 (multi-page: index + dine + admin) |
| Styling | Vanilla CSS with custom properties (no Tailwind yet) |
| Fonts | Google Fonts (Cormorant Garamond, Cinzel, Poppins, Mulish, Noto Nastaliq) |
| Icons | RemixIcon CDN |
| Images | Unsplash (placeholder URLs, no upload needed yet) |
| Data | Hardcoded in TypeScript files (no DB yet) |
| State | In-memory variables (lost on refresh) |
| Repo | github.com/syedabis/Riwayat |

### Planned (Full Build — post UI)
| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | Next.js 14+ (App Router) | SSR for Phase 1 SEO, SPA feel for Phase 2 & 3 |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, fast admin UI components |
| Real-time | Pusher or Socket.io | Order push to admin without polling |
| Database | PostgreSQL via Prisma ORM | Relational: orders, sessions, menu, tables, staff |
| Auth | NextAuth.js (credentials) | Simple staff login, no email/OAuth needed |
| Sessions | Server-side + localStorage | Table session management + 4h expiry |
| Images | Cloudinary or Vercel Blob | Optimized food photography storage |
| Payments | Stripe | Public site: reservation deposits / celebration packages |
| Deployment | Vercel | Zero-config Next.js hosting |

---

## Open Questions

| # | Question | Impact |
|---|----------|--------|
| 1 | **Restaurant name confirmed?** | Logo, hero text, domain, brand assets |
| 2 | **Number of tables?** | Table grid in admin dashboard, QR code count |
| 3 | **PKR only or multi-currency?** | Currency display logic |
| 4 | **Dietary tags needed?** | Halal badge, Contains Nuts, Gluten-Free indicators |
| 5 | **Reservation notification method?** | Email to staff, WhatsApp, or admin inbox only? |
| 6 | **Number of staff accounts?** | Complexity of auth + roles system |

---

## Decisions Made

| Decision | Choice |
|----------|--------|
| Restaurant type | Pakistani fine dining, Mughal-inspired |
| Build order | Internal tools first (Phase 2 + 3), public site polish later |
| In-restaurant payment | In-app card payment on Bill screen — card form sheet, 1.8s mock, confirmed receipt |
| Online payment | Stripe — public website only, for reservation deposits |
| Admin scope | Full: orders + menu + table enable/disable + staff roles |
| UI-first approach | All UI in vanilla HTML + TypeScript before any backend |
| Design system | Maroon + Gold + Emerald + Ivory palette — locked |
| Typography | Cormorant Garamond + Cinzel + Mulish + Poppins — locked |
| Item detail UX | Bottom sheet modal (not new page) — slides up, dims background |
| Cart UX | Full screen (nav tab), not a bottom sheet. Opens like Orders/Bill. |
| Order simulation | Demo: 10s → kitchen, 35s → on its way, 60s → served |
| Billing rounds | Orders before payment = one round, billed together. Paying advances to next round. Paid rounds shown on bill with Paid badge. Unlimited rounds per session. |
| Call Waiter | Header icon on all app screens (Menu/Cart/Orders/Bill). Removed floating button. |

---

*Last updated: 2026-05-18 | All UI phases complete (Phase 1 ✅, Phase 2 ✅, Phase 3 ✅) | Phase 2 billing rounds + cart screen added | Next: backend integration*
