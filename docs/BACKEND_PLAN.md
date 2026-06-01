# Riwayat v2 — Backend Architecture Plan

> **Stack:** Next.js 15 (App Router) · NeonDB (PostgreSQL) · Cloudinary (image storage)  
> **Target:** Full-stack restaurant management system with real-time capabilities  
> **Last Updated:** 2026-05-29

---

## 1. Tech Stack Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | Server-side API routes + React frontend |
| Database | NeonDB (PostgreSQL) | Persistent storage for all data |
| Images | Cloudinary | Menu item image upload + CDN delivery |
| Auth | JWT + HTTP-only cookies | Admin session management |
| Real-time | Server-Sent Events (SSE) | Live order status updates to dine page |
| QR Codes | `qrcode` npm package | Per-table QR generation (server-side) |
| Excel Export | `xlsx` npm package | Export users/payments/history to `.xlsx` |
| SQL | `@neondatabase/serverless` raw client | Lightweight, no ORM overhead |

---

## 2. Database Schema (PostgreSQL / NeonDB)

### 2.1 Tables

---

#### `staff`
Stores admin accounts. Only two roles: `admin` (full access) and `user` (staff with limited access).

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | Auto-generated |
| `name` | `text` NOT NULL | Display name |
| `role` | `enum('admin','user')` | `admin` = full access; `user` = order status only |
| `pin_hash` | `text` NOT NULL | Bcrypt-hashed 4-digit PIN |
| `avatar_initials` | `text` | e.g. "RD" — auto-derived from name |
| `active` | `boolean` DEFAULT true | Soft disable without deleting |
| `created_at` | `timestamptz` DEFAULT now() | |

---

#### `customers`
Stores dine-in customers. Created/matched when a customer fills in the user-details screen (name + phone/email). Enables loyalty tracking — we can see how many times a customer has visited.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `name` | `text` NOT NULL | As entered by the customer |
| `email` | `text` | Optional, lowercased |
| `phone` | `text` | Used as unique identifier for returning customers |
| `total_sessions` | `integer` DEFAULT 0 | Auto-incremented each new session |
| `total_spent` | `numeric(12,2)` DEFAULT 0 | Cumulative amount paid |
| `first_visit` | `timestamptz` DEFAULT now() | |
| `last_visit` | `timestamptz` | Updated on each session start |

> **Match logic:** On session start, look up by `phone`. If found → link existing customer + increment `total_sessions`. If not found → create new customer record.

---

#### `restaurant_tables`
> Named `restaurant_tables` (not `tables`) to avoid collision with PostgreSQL reserved word.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` PK | "T01"–"T12" |
| `label` | `text` | Display label (e.g. "Table 1") |
| `status` | `enum('empty','active','disabled')` | Current state |
| `active_session_id` | `uuid` FK → `sessions` | NULL when empty |
| `alert_active` | `boolean` DEFAULT false | Waiter alert indicator dot |
| `qr_token` | `uuid` UNIQUE DEFAULT gen_random_uuid() | Unique token embedded in QR URL |
| `qr_regenerated_at` | `timestamptz` | When QR was last regenerated |

> **QR code flow:** Each table has a `qr_token`. The dine URL is: `https://yourapp.com/dine?t=T01&token=<qr_token>`. When the admin regenerates a QR, only `qr_token` changes — old QR codes immediately become invalid. The QR image itself is generated on-the-fly by the API (`/api/admin/tables/[id]/qr`) and displayed in the admin modal.

---

#### `sessions`
One session = one visit by a group at a table. Tied to a customer record and table.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | Embedded in QR scan URL as `?session=:id` after auth |
| `table_id` | `text` FK → `restaurant_tables` | |
| `customer_id` | `uuid` FK → `customers` | Links to customer record |
| `billing_round` | `integer` DEFAULT 1 | Increments each time a payment is made |
| `opened_at` | `timestamptz` DEFAULT now() | |
| `closed_at` | `timestamptz` | NULL while active |
| `total_paid` | `numeric(12,2)` DEFAULT 0 | Running sum of all payments in this session |

---

#### `orders`
One order batch = one "Place Order" tap by the customer.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `session_id` | `uuid` FK → `sessions` | |
| `table_id` | `text` | Denormalized for fast admin queries |
| `billing_round` | `integer` | Round in which this order was placed |
| `status` | `enum('received','kitchen','ready','served','cancelled')` | |
| `cancel_reason` | `text` | Set only when cancelled |
| `total` | `numeric(10,2)` | Sum of all item line totals |
| `placed_at` | `timestamptz` DEFAULT now() | |
| `updated_at` | `timestamptz` | Set on every status change |

---

#### `order_items`
Individual line items within an order.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `order_id` | `uuid` FK → `orders` ON DELETE CASCADE | |
| `menu_item_id` | `uuid` FK → `menu_items` | |
| `name` | `text` | Snapshot of item name at order time |
| `price` | `numeric(10,2)` | Unit price including extras |
| `qty` | `integer` | |
| `note` | `text` | Customer note + extras labels combined |

---

#### `menu_items`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `name` | `text` NOT NULL | |
| `description` | `text` | |
| `category` | `text` | e.g. "grills", "karahi", "biryani" |
| `price` | `numeric(10,2)` | Base price |
| `prep_time` | `integer` | Estimated prep time in minutes |
| `image_url` | `text` | Cloudinary delivery URL |
| `image_public_id` | `text` | Cloudinary public_id (for deletion) |
| `type` | `enum('single','platter')` | |
| `available` | `boolean` DEFAULT true | Available / sold-out toggle |
| `hidden` | `boolean` DEFAULT false | Admin hide toggle |
| `discount_type` | `enum('none','percent','flat')` DEFAULT 'none' | |
| `discount_value` | `numeric(6,2)` DEFAULT 0 | |
| `created_at` | `timestamptz` DEFAULT now() | |
| `updated_at` | `timestamptz` | |

---

#### `menu_extras`
Add-on options for a menu item.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `menu_item_id` | `uuid` FK → `menu_items` ON DELETE CASCADE | |
| `label` | `text` | e.g. "Extra Raita", "Add Naan" |
| `price` | `numeric(10,2)` | |

---

#### `payments`
One payment record per billing round. References the session AND the specific orders it covers.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `session_id` | `uuid` FK → `sessions` | |
| `table_id` | `text` | Denormalized |
| `billing_round` | `integer` | Which billing round this payment clears |
| `order_ids` | `uuid[]` | Array of order IDs this payment covers |
| `amount` | `numeric(10,2)` | Total paid |
| `method` | `enum('card','cash')` | Payment method |
| `paid_at` | `timestamptz` DEFAULT now() | |

> `order_ids` is a PostgreSQL array (`uuid[]`). To look up all orders a payment covers: `WHERE id = ANY(payment.order_ids)`.

---

#### `waiter_alerts`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `table_id` | `text` FK → `restaurant_tables` | |
| `session_id` | `uuid` FK → `sessions` | |
| `type` | `enum('waiter','bill','complaint')` | |
| `message` | `text` | Complaint message text |
| `dismissed` | `boolean` DEFAULT false | |
| `created_at` | `timestamptz` DEFAULT now() | |

---

### 2.2 Schema Relationship Diagram

```
staff
  └── (no FK, standalone auth table)

customers ──────────────────────────────────┐
                                            │
restaurant_tables ──────────────────────┐   │
    qr_token (embedded in QR URL)       │   │
                                        │   │
sessions ── table_id ───────────────────┘   │
         ── customer_id ─────────────────────┘
         │
         ├── orders ── order_items ── menu_items ── menu_extras
         │         \── payments (order_ids[])
         │
         └── waiter_alerts
```

---

## 3. Next.js API Routes

All routes under `next-app/src/app/api/`.

### 3.1 Auth

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/login` | Verify PIN → set JWT cookie |
| `POST` | `/api/auth/logout` | Clear session cookie |
| `GET`  | `/api/auth/me` | Validate session → return `{ id, name, role }` |

### 3.2 Menu (Public)

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/api/menu` | All available + visible items (for dine page) |

### 3.3 Admin — Menu

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/api/admin/menu` | All items including hidden (admin only) |
| `POST` | `/api/admin/menu` | Create item (after image upload) |
| `PUT`  | `/api/admin/menu/[id]` | Full update of item |
| `PATCH`| `/api/admin/menu/[id]/toggle` | Toggle `available` or `hidden` |
| `DELETE`| `/api/admin/menu/[id]` | Delete + destroy Cloudinary image |

### 3.4 Image Upload (Cloudinary)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/upload/image` | Receive file → upload to Cloudinary → return `{ url, public_id }` |

### 3.5 Dine App

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/dine/session` | Validate QR token, create/resume session, match/create customer |
| `POST` | `/api/dine/orders` | Place order batch → insert `orders` + `order_items` |
| `GET`  | `/api/dine/orders?session=:id` | Get all orders for active session |
| `POST` | `/api/dine/alert` | Submit waiter/bill/complaint alert |
| `POST` | `/api/dine/payment` | Record payment → insert `payments`, advance `billing_round`, update `customers.total_spent` |
| `GET`  | `/api/dine/stream?session=:id` | SSE — order status updates for dine page |

### 3.6 Admin — Orders

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/api/admin/orders?status=active` | Live orders (active = not served/cancelled) |
| `PATCH`| `/api/admin/orders/[id]/status` | Advance to next status |
| `PATCH`| `/api/admin/orders/[id]/cancel` | Cancel with reason |

### 3.7 Admin — Tables + QR

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/api/admin/tables` | All tables with active session + alert info |
| `PATCH`| `/api/admin/tables/[id]` | Update label, enable/disable table |
| `POST` | `/api/admin/tables/[id]/reset` | End session, clear table to empty |
| `GET`  | `/api/admin/tables/[id]/qr` | Generate + return QR code image (PNG) for current `qr_token` |
| `POST` | `/api/admin/tables/[id]/qr/regenerate` | Generate new `qr_token`, invalidate old QR |

### 3.8 Admin — Alerts

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/api/admin/alerts` | All undismissed alerts |
| `PATCH`| `/api/admin/alerts/[id]/dismiss` | Dismiss single alert |
| `POST` | `/api/admin/alerts/dismiss-all` | Dismiss all |

### 3.9 Admin — History

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/api/admin/history` | Order history (filters: table, status, date_from, date_to, search) |

### 3.10 Admin — Payments

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/api/admin/payments` | Payment records with filter support |
| `GET`  | `/api/admin/payments/stats` | Totals + revenue by day (for chart) |

### 3.11 Admin — Customers (Users Tab)

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/api/admin/customers` | All customers with session count, total spent, last visit (sortable) |
| `GET`  | `/api/admin/customers/[id]` | Single customer + their full session/order history |
| `GET`  | `/api/admin/customers/export` | Returns `.xlsx` file download of customer data |

### 3.12 Real-Time (SSE)

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/api/admin/stream` | SSE for admin — emits on new orders, status changes, alerts |
| `GET`  | `/api/dine/stream?session=:id` | SSE for dine page — emits order status updates |

**Events emitted by admin SSE:**
- `order:new` — new order placed by a table
- `order:status` — status change (received → kitchen → ready → served)
- `alert:new` — new waiter/bill/complaint alert
- `table:update` — table status changed

---

## 4. QR Code System

### 4.1 How It Works

Each table in `restaurant_tables` has a `qr_token` (UUID). The dine-in URL is:

```
https://yourapp.com/dine?table=T01&token=<qr_token>
```

When the dine app loads:
1. Reads `?table` and `?token` from URL
2. Calls `POST /api/dine/session` with `{ table_id, qr_token }`
3. API validates `qr_token` matches `restaurant_tables.qr_token` for that table
4. If valid → creates or resumes session → returns `{ session_id }`
5. If invalid (old QR) → returns 403 → dine app shows "QR code expired" screen

### 4.2 Admin QR Modal Behavior

In the **Tables** tab, each table card has a **QR Code** button. Clicking it opens a modal with:
- Current QR image (fetched from `GET /api/admin/tables/[id]/qr` → PNG)
- A **Download QR** button
- A **Regenerate QR** button — with a confirmation warning: _"Old QR codes for this table will stop working immediately."_

On regeneration:
1. API updates `qr_token` to a new UUID, sets `qr_regenerated_at`
2. Modal refreshes to show new QR image
3. Old printed/shared QR codes are immediately invalidated

### 4.3 QR Generation (Server-Side)

```typescript
// GET /api/admin/tables/[id]/qr
import QRCode from "qrcode";

const qrUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dine?table=${tableId}&token=${table.qr_token}`;
const pngBuffer = await QRCode.toBuffer(qrUrl, { type: "png", width: 400 });

return new Response(pngBuffer, {
  headers: { "Content-Type": "image/png" }
});
```

---

## 5. Admin — Customers (Users) Tab

### 5.1 What It Shows

The **Customers** tab in the admin sidebar displays a table of all registered customers:

| Column | Description |
|--------|-------------|
| Name | Customer name |
| Phone | Contact number |
| Email | If provided |
| Sessions | Total number of visits |
| Total Spent | Cumulative spend (PKR) |
| Last Visit | Date of most recent session |
| First Visit | Date of first session |

**Sorting:** Clickable column headers (sort by sessions, total spent, last visit)  
**Search:** Filter by name, phone, or email

### 5.2 Export to Excel

Clicking **Export** calls `GET /api/admin/customers/export`. The API:
1. Queries all customers
2. Uses the `xlsx` package to generate a workbook
3. Returns a `.xlsx` file with headers: Name, Phone, Email, Total Visits, Total Spent, First Visit, Last Visit

```typescript
import * as XLSX from "xlsx";

const ws = XLSX.utils.json_to_sheet(customers);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Customers");
const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

return new Response(buf, {
  headers: {
    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Content-Disposition": `attachment; filename="customers-${Date.now()}.xlsx"`
  }
});
```

### 5.3 Customer Detail View (Drill-down)

Clicking a customer row shows a slide-over or modal with:
- Their session history (table, date, amount, duration)
- Top ordered items

---

## 6. Cloudinary Integration

### 6.1 Setup

```bash
npm install cloudinary
```

```
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
```

### 6.2 Upload Flow

```
Admin clicks "Upload Image" → Browser sends POST /api/upload/image (multipart)
  → Next.js route: cloudinary.uploader.upload(file, { folder: "riwayat/menu" })
  → Returns { secure_url, public_id }
Admin form sends POST /api/admin/menu with { ..., image_url, image_public_id }
```

### 6.3 Delete Flow

```
DELETE /api/admin/menu/[id]
  → Fetch item from DB → get image_public_id
  → cloudinary.uploader.destroy(public_id)
  → DELETE or hide item in DB
```

### 6.4 URL Transformations

```
https://res.cloudinary.com/{cloud}/image/upload/w_600,q_auto,f_auto/riwayat/menu/{public_id}
```

Delivers auto-compressed WebP/AVIF at 600px max width.

---

## 7. NeonDB Connection

```bash
npm install @neondatabase/serverless
```

```typescript
// src/lib/db.ts
import { neon } from "@neondatabase/serverless";
export const sql = neon(process.env.DATABASE_URL!);
```

Uses HTTP-based queries — no persistent TCP connection, safe for serverless/edge functions.

---

## 8. Auth Strategy

### 8.1 Roles

| Role | Permissions |
|------|-------------|
| `admin` | Full access — manage staff, menu, orders, tables, view all data, export |
| `user` | Limited — can only advance order status (received → kitchen → ready → served) |

### 8.2 Login Flow

```
POST /api/auth/login { pin: "1234" }
  → Query staff WHERE active = true (match by PIN since PINs are unique per role)
  → bcrypt.compare(pin, pin_hash)
  → Sign JWT { id, name, role } — 24h expiry
  → Set HTTP-only cookie "rw_session"
  → Return { name, role }
```

### 8.3 Middleware Guard

```typescript
// src/middleware.ts
export function middleware(req: NextRequest) {
  const token = req.cookies.get("rw_session")?.value;
  if (!token && req.nextUrl.pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // For role-specific routes: decode JWT and check role
}
```

---

## 9. Real-Time (SSE)

SSE streams from the server to the browser — no WebSockets needed.

**Admin stream** (`/api/admin/stream`): polls DB every 2 seconds, pushes `order:new`, `order:status`, `alert:new`, `table:update` events.

**Dine stream** (`/api/dine/stream?session=:id`): polls for status changes on the current session's orders, pushes `order:status` events so the customer sees live kitchen updates.

---

## 14. Testing Strategy

### 14.1 Test Framework & Setup

We use a simple **HTTP-based testing approach** with Node.js `fetch` API (no external test framework required during dev). Each phase includes a `tests/phase-*.test.js` file.

**Run tests:**
```bash
cd next-app
npm run test:phase-a
npm run test:phase-b
npm run test:phase-c
# etc.
```

**Or run all tests:**
```bash
npm run test
```

### 14.2 Test Structure

Each test file:
1. Starts the dev server (or assumes it's running)
2. Creates a session/auth token if needed
3. Tests each API endpoint (happy path + error cases)
4. Logs results in a clear format
5. Exit code 0 on success, 1 on failure

### 14.3 Test Utilities

Helper functions in `tests/utils.js`:
- `login(pin)` — Returns auth session with token
- `request(method, path, body, session)` — HTTP helper
- `expect(actual, expected)` — Simple assertion
- `describe(name, fn)` — Test grouping
- `test(name, fn)` — Individual test

### 14.4 Phase Testing Checklist

As each phase is built, tests verify:

**Phase A (Database)** — ✅ Complete
- [x] Database connects (no errors)
- [x] Admin user created with PIN 1234
- [x] 12 tables seeded (T01-T12)
- [x] 34 menu items seeded

**Phase B (Auth)** — ✅ Complete  
- [x] Login with correct PIN → returns user + JWT
- [x] Login with wrong PIN → 401 error
- [x] Me endpoint with valid token → returns user
- [x] Me endpoint without token → 401 error
- [x] Logout clears cookie
- [x] **Tests:** 7/7 passing (`npm run test:phase-b`)

**Phase C (Menu + Cloudinary)** — ✅ Complete
- [x] Upload image → returns { url, public_id }
- [x] Create menu item → inserted in DB
- [x] Get all menu (admin) → includes hidden items
- [x] Get public menu → excludes hidden items
- [x] Update menu item → changes reflected
- [x] Toggle available → status flips
- [x] Delete menu item → deleted from DB + Cloudinary
- [x] **Tests:** 8/8 passing (`npm run test:phase-c`)

**Phase D (QR + Tables)** — Upcoming
- [ ] Get QR code PNG → returns image
- [ ] Regenerate QR token → new token created, old invalidated
- [ ] Get tables → returns all with session info

**Phase E (Orders + Sessions)** — Upcoming
- [ ] Create session → customer matched/created
- [ ] Place order → inserted in orders + order_items
- [ ] Get orders for session → returns all
- [ ] Update order status → status changes

**Phase F (Customers Tab)** — Upcoming
- [ ] List customers → all users returned
- [ ] Export to Excel → .xlsx file generated

**Phase G (Alerts + Payments)** — Upcoming
- [ ] Create alert → alert saved
- [ ] Record payment → payment + session updated

**Phase H (Real-Time SSE)** — Upcoming
- [ ] Admin stream → emits events on changes
- [ ] Dine stream → emits order updates

**Phase I (Polish & Deploy)** — Upcoming
- [ ] All endpoints secured behind auth
- [ ] Error handling consistent
- [ ] Performance benchmarks met

### 14.5 Test Output Example

```
✅ Phase B — Auth Tests
  ✓ Login with PIN 1234 → user returned
  ✓ Login with wrong PIN → 401 error
  ✓ Me endpoint with token → user data
  ✓ Me endpoint without token → 401 error
  ✓ Logout → session cleared

Summary: 5/5 passed
```

---

```bash
# next-app/.env.local

DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
JWT_SECRET=your_long_random_secret_here

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx

NEXT_PUBLIC_BASE_URL=https://yourapp.vercel.app   # used for QR code URL generation
```

---

## 11. Implementation Phases

### Phase A — Database & Connection
- [x] Create NeonDB project + database
- [x] Write migration SQL (all tables above)
- [x] Set up `src/lib/db.ts` (using `@neondatabase/serverless`)
- [x] Seed menu data from `menuData.ts` (34 items seeded)
- [x] Seed initial admin staff record with bcrypt-hashed PIN (PIN: 1234)
- [x] Seed 12 tables (T01–T12) with initial `qr_token`s
**Status: ✅ COMPLETE** — Database migrated, tables created, admin account ready, 34 menu items + 12 tables seeded

### Phase B — Auth
- [x] Install `bcryptjs` + `jsonwebtoken` + `jose` packages
- [x] Build `POST /api/auth/login` (PIN verification, JWT creation, HTTP-only cookie)
- [x] Build `GET /api/auth/me` (Token validation, return user)
- [x] Build `POST /api/auth/logout` (Clear session cookie)
- [x] Create `src/middleware.ts` (JWT verification, protect /api/admin routes)
- [x] Create `src/lib/auth.ts` (Token signing/verification helpers)
**Status: ✅ COMPLETE** — Auth system ready. Login with PIN: 1234, JWT cookies, role-based access control

### Phase C — Menu + Cloudinary
- [ ] `npm install cloudinary`
- [ ] Build `POST /api/upload/image`
- [ ] Build full admin menu CRUD routes
- [ ] Wire admin "Add/Edit Item" modal

### Phase D — QR + Tables
- [ ] `npm install qrcode @types/qrcode`
- [ ] Build `GET /api/admin/tables/[id]/qr` (returns PNG)
- [ ] Build `POST /api/admin/tables/[id]/qr/regenerate`
- [ ] Build QR modal in admin Tables tab
- [ ] Update dine app session start to validate QR token

### Phase E — Orders + Sessions + Customers
- [ ] Build `POST /api/dine/session` (create session + match/create customer)
- [ ] Build `POST /api/dine/orders` + `GET /api/dine/orders`
- [ ] Build admin orders routes (live + status update + cancel)
- [ ] Update dine page to use real API

### Phase F — Customers Tab
- [ ] `npm install xlsx`
- [ ] Build `GET /api/admin/customers`
- [ ] Build `GET /api/admin/customers/export` (Excel)
- [ ] Build Customers section in admin sidebar + UI

### Phase G — Alerts + Payments
- [ ] Build alerts routes
- [ ] Build payments routes + stats
- [ ] Wire all admin sections

### Phase H — Real-Time SSE
- [ ] Build `GET /api/admin/stream`
- [ ] Build `GET /api/dine/stream`
- [ ] Replace client-side simulation with real SSE

### Phase I — Polish & Deploy
- [ ] Error boundaries + loading skeletons
- [ ] Deploy to Vercel
- [ ] Set env vars in Vercel dashboard
- [ ] End-to-end testing all flows

---

## 12. Folder Structure (Backend additions)

```
next-app/src/
├── app/
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       ├── menu/route.ts                         ← public
│       ├── upload/image/route.ts                 ← Cloudinary upload
│       ├── dine/
│       │   ├── session/route.ts
│       │   ├── orders/route.ts
│       │   ├── alert/route.ts
│       │   ├── payment/route.ts
│       │   └── stream/route.ts
│       └── admin/
│           ├── menu/
│           │   ├── route.ts
│           │   └── [id]/
│           │       ├── route.ts
│           │       └── toggle/route.ts
│           ├── orders/
│           │   ├── route.ts
│           │   └── [id]/
│           │       ├── status/route.ts
│           │       └── cancel/route.ts
│           ├── tables/
│           │   ├── route.ts
│           │   └── [id]/
│           │       ├── route.ts
│           │       ├── reset/route.ts
│           │       └── qr/
│           │           ├── route.ts              ← GET: return QR PNG
│           │           └── regenerate/route.ts   ← POST: new qr_token
│           ├── alerts/
│           │   ├── route.ts
│           │   ├── [id]/dismiss/route.ts
│           │   └── dismiss-all/route.ts
│           ├── customers/
│           │   ├── route.ts                      ← GET: list + search
│           │   ├── [id]/route.ts                 ← GET: detail view
│           │   └── export/route.ts               ← GET: .xlsx download
│           ├── history/route.ts
│           ├── payments/
│           │   ├── route.ts
│           │   └── stats/route.ts
│           └── stream/route.ts
├── lib/
│   ├── db.ts             ← Neon SQL connection
│   ├── auth.ts           ← JWT sign/verify helpers
│   ├── cloudinary.ts     ← Cloudinary v2 client
│   ├── qr.ts             ← QR generation helpers
│   ├── excel.ts          ← xlsx export helpers
│   └── menuData.ts       ← (existing → becomes seed source)
└── middleware.ts          ← Auth guard for /api/admin/*
```

---

## 13. Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Staff roles | `admin` / `user` only | Simpler, matches actual restaurant needs |
| Customer tracking | Separate `customers` table, matched by phone | Enables loyalty analytics without requiring login |
| QR sessions | `qr_token` in `restaurant_tables`, embedded in URL | Invalidatable, secure, no extra QR service needed |
| Payment → Orders link | `payments.order_ids uuid[]` array | One payment can cover multiple order batches in same billing round |
| Real-time | SSE with 2s DB poll | No WebSocket infra, works on Vercel free tier |
| Excel export | `xlsx` npm package | Lightweight, no external service |
| Image storage | Cloudinary | 25GB free, auto CDN, format conversion |
| Auth | JWT + HTTP-only cookie | Stateless, secure, no Redis needed |
| DB | Raw `neon` SQL | Simple, no ORM abstraction layer |
| Deployment | Vercel | Zero-config Next.js support |
