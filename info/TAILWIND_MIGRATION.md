# Tailwind v4 Migration Plan

**Strategy:** Component-by-component. CSS definitions converted to `@apply` in the CSS files — HTML class names stay unchanged. Complex CSS (animations, pseudo-elements, vendor prefixes) kept as raw properties alongside `@apply`. Work in 2–3 component chunks per session.

---

## Setup ✅

| Step | File | Status |
|------|------|--------|
| Add `@tailwindcss/vite` plugin | `project/vite.config.ts` | ✅ Done |
| Create shared theme + tokens | `project/src/theme.css` | ✅ Done |
| Wire theme into all CSS entry files | `dine.css`, `style.css`, `admin.css` | ✅ Done |

**`src/theme.css` defines:**
- Colors → `bg-primary`, `text-gold`, `border-emerald`, `bg-bg`, `bg-dark`, `text-muted`, `border-border`, etc.
- Fonts → `font-display`, `font-cinzel`, `font-body`, `font-ui`, `font-urdu`
- Radius → `rounded` (14px), `rounded-lg` (22px), `rounded-xl` (28px)
- Shadows → `shadow`, `shadow-lg`
- Bridge `:root` aliases so unmigrated `var(--clr-*)` / `var(--ff-*)` still resolve during migration

---

## Components

### Buttons ✅
 
| Class(es) | File | Status |
|-----------|------|--------|
| `.btn-primary`, `.btn-ghost`, `.btn-full`, `.btn-lg`, `.welcome-waiter-btn` | `dine.css` | ✅ Done |
| `.w-btn`, `.w-btn-menu`, `.w-btn-waiter` | `dine.css` | ✅ Done |
| `.confirm-actions .btn-ghost`, `.waiter-sheet .btn-primary`, `.bill-ghost` | `dine.css` | ✅ Done |
| `.btn-pay`, `.btn-pay:disabled`, `.pay-cancel` | `dine.css` | ✅ Done |
| All landing variants (`.btn-primary`, `.btn-outline`, `.btn-hero-*`, `.btn-nav-cta`, `.btn-gold-sm`, `.btn-primary-sm`, `.btn-outline-sm`, `.btn-submit`) | `style.css` | ✅ Done |
| `.btn-pay`, `.btn-skip` | `style.css` | ✅ Done |
| `.login-btn`, `.logout-btn` | `admin.css` | ✅ Done |
| `.btn-primary`, `.btn-ghost`, `.btn-danger`, `.btn-paid-done`, `.btn-icon` | `admin.css` | ✅ Done |
| `.btn-status`, `.btn-status-next`, `.btn-status-cancel` | `admin.css` | ✅ Done |
| `.btn-res` variants, `.modal-close` | `admin.css` | ✅ Done |

---

### App Header ✅
`.app-header`, `.header-left`, `.header-logo`, `.header-table`, `.header-right`, `.icon-btn`, `.cart-badge`
— Files: `dine.css`

### Bottom Nav ✅
`.bottom-nav`, `.nav-buttons`, `.nav-item`, `.nav-item.active`, `.order-badge`
— Files: `dine.css`

### Search Bar ✅
`.search-wrap`, `.search-icon`, `.search-input`, `.search-clear`
— Files: `dine.css`

### Category Tabs ✅
`.cat-tabs-wrap`, `.cat-tabs`, `.cat-tab`, `.cat-tab.active`
— Files: `dine.css`

### Menu Grid + Item Cards ✅
`.menu-grid`, `.item-card`, `.item-card-img-wrap`, `.item-card-img`, `.item-card-tag`, `.item-card-body`, `.item-card-name`, `.item-card-desc`, `.item-card-footer`, `.item-card-price`, `.item-add-btn`, `.no-results`
— Files: `dine.css`

### Bottom Sheets (base) ✅
`.sheet-backdrop`, `.bottom-sheet`, `.sheet-handle`, `.sheet-close`
— Files: `dine.css`

### Item Detail Sheet ✅
`.item-sheet-img-wrap`, `.item-sheet-body`, `.item-sheet-tags`, `.item-sheet-tag`, `.item-sheet-name`, `.item-sheet-desc`, `.item-sheet-price-row`, `.item-sheet-section-title`, `.extras-list`, `.extra-option`, `.note-input`, `.item-sheet-footer`, `.qty-ctrl`, `.qty-btn`, `.qty-val`
— Files: `dine.css`

### Cart Sheet + Cart Screen ✅
`.cart-sheet`, `.cart-header`, `.cart-title`, `.cart-empty`, `.cart-body`, `.cart-items`, `.cart-item`, `.cart-item-img`, `.cart-item-info`, `.cart-item-name`, `.cart-item-note`, `.cart-item-controls`, `.cart-qty-btn`, `.cart-qty-val`, `.cart-item-price`, `.cart-divider`, `.cart-subtotal-row`, `.cart-note`, `.cart-scroll`, `#cartScreenBody`
— Files: `dine.css`

### Order Tracker ✅
`.tracker-scroll`, `.tracker-empty`, `.tracker-list`, `.order-batch`, `.order-batch-header`, `.order-batch-num`, `.order-status-badge`, `.status-received`, `.status-kitchen`, `.status-on-its-way`, `.status-served`, `.order-batch-items`, `.order-batch-item`, `.order-batch-item-price`
— Files: `dine.css`

### Bill Screen + Rounds ✅
`.bill-scroll`, `.bill-empty`, `.bill-content`, `.bill-items`, `.bill-item-row`, `.bill-item-price`, `.bill-divider`, `.bill-row`, `.bill-total`, `.bill-note`, `#billRounds`, `.bill-round`, `.bill-round-paid`, `.bill-round-status`, `.bill-actions`
— Files: `dine.css`

### Payment Sheet ✅
`.pay-sheet-body`, `.pay-amount-card`, `.pay-amount-label`, `.pay-amount-val`, `.pay-form`, `.card-field-wrap`, `.card-field`, `.card-network`, `.card-row`
— Files: `dine.css`

### Confirm + Waiter Sheets ✅
`.confirm-body`, `.confirm-icon`, `.confirm-title`, `.confirm-sub`, `.confirm-summary`, `.confirm-row`, `.confirm-actions`, `.waiter-body`, `.waiter-icon`, `.waiter-title`, `.waiter-sub`
— Files: `dine.css`

### Welcome Screen ✅
`#screen-welcome`, `.w-foreground`, `.w-badge`, `.w-heading`, `.w-row-menu`, `.w-actions`
— Files: `dine.css`

### Disabled Screen + Toast Stack + Waiter Float ✅
`#screen-disabled`, `.disabled-wrap`, `.disabled-icon`, `.disabled-title`, `.disabled-msg`, `.waiter-float`, `.toast-stack`, `.toast`, `.toast-success`, `.toast-info`
— Files: `dine.css`

### Landing Navbar ✅
`.navbar`, `.navbar.scrolled`, `.nav-container`, `.nav-logo`, `.logo-gem`, `.nav-links`, `.nav-link`, `.nav-link::after`, `.hamburger`, `.mobile-menu`, `.mobile-nav-link`, `.mobile-cta`
— Files: `style.css`

### Hero Section ✅
`.hero`, `.hero-bg`, `.hero-overlay`, `.jali-overlay`, `.hero-content`, `.hero-urdu`, `.hero-rule`, `.rule-line`, `.rule-gem`, `.hero-title`, `.hero-subtitle`, `.hero-tagline`, `.hero-actions`, `.scroll-cue`
— Files: `style.css`

### Landing Content Sections ✅
About, Signature Dishes, Menu tabs + grid, Specials, Gallery + lightbox, Testimonials carousel
— Files: `style.css`

### Reservation + Location + Footer ✅
Reservation form, payment deposit step, location/map, footer grid, newsletter form, floating elements (WhatsApp, back-to-top)
— Files: `style.css`

### Admin Dashboard ✅
We tackled the admin interface in chunks:
- [x] Base Layout, Sidebar, Topbar
- [x] Dashboard Grid & Status Badges
- [x] Live Orders & Order Cards
- [x] Table Grid
- [x] Menu Management & Toggles
- [x] Modals, Toasts, Alerts
- [x] History & Payments panels, modals
— Files: `admin.css`

---

## Cleanup ✅
- [x] Strip all dead CSS rules (anything fully replaced by `@apply`)
- [x] Keep only: `@keyframes`, complex `::before`/`::after` pseudo-elements, `::-webkit-scrollbar`, vendor prefixes
- [x] Kept some `:root` bridge aliases in `theme.css` to allow `var(--clr-*)` usages in `@apply` statements that don't have matching generic Tailwind constants.
- [x] Confirm `tsc && vite build` passes cleanly
