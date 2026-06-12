# Frontend-Backend Integration Status

**Started:** June 1, 2026  
**Status:** 🔄 IN PROGRESS  
**Backend Tests:** 74/74 passing ✅

---

## Integration Checklist

### Core Features
- [x] **Menu System**
  - [x] Fetch from `/api/menu` (public) - **INTEGRATED**
  - [ ] Admin menu CRUD via `/api/admin/menu`
  - [ ] Menu item images upload to Cloudinary
  - [ ] Real-time menu updates via SSE

- [x] **Session Management**
  - [x] Create session via `/api/sessions` with QR token - **INTEGRATED**
  - [x] Store session_id in sessionStorage
  - [ ] Retrieve session orders via `/api/sessions/:id/orders`

- [x] **Orders**
  - [x] Submit order via `/api/orders` - **INTEGRATED**
  - [ ] Track order status via `/api/orders/:id`
  - [x] Real-time order updates via SSE stream - **INTEGRATED**
  - [ ] Mark order as served/cancelled

- [ ] **Authentication**
  - [ ] Login endpoint `/api/auth/login` (PIN-based)
  - [ ] Verify token via `/api/auth/me`
  - [ ] Logout via `/api/auth/logout`
  - [ ] HTTP-only cookie storage
  - [ ] Auth protection on admin routes

- [x] **Real-Time Updates (SSE)**
  - [ ] Admin stream (`/api/admin/stream`)
  - [x] Dine stream (`/api/dine/stream/[session_id]`) - **INTEGRATED**
  - [x] Event handlers: order, menu, alerts, payments - **CREATED**

- [ ] **Admin Dashboard**
  - [ ] Login screen
  - [ ] Menu manager (CRUD operations)
  - [ ] Live orders display
  - [ ] Waiter alerts management
  - [ ] Payments tracking
  - [ ] Customer history & export

- [x] **Customer Features**
  - [ ] Welcome screen (QR scan or manual session)
  - [x] User details screen - **API READY**
  - [x] Menu browsing & search - **INTEGRATED**
  - [x] Cart management - **WORKING**
  - [x] Order placement - **INTEGRATED**
  - [ ] Order tracking - **PARTIAL**
  - [ ] Bill & payment

- [ ] **Image Uploads**
  - [ ] Cloudinary integration for menu items
  - [ ] Upload via `/api/upload/image`
  - [ ] Error handling for failed uploads

- [ ] **Payments**
  - [ ] Record payment via `/api/sessions/:id/payment`
  - [ ] Track payment status
  - [ ] Generate bills with payment breakdown

---

## Files to Modify

### Customer-Facing Components
- `src/app/dine/page.tsx` - Main dine flow controller
- `src/components/dine/MenuGrid.tsx` - Menu display (API integration)
- `src/components/dine/WelcomeScreen.tsx` - Session creation
- `src/components/dine/CartScreen.tsx` - Order submission
- `src/components/dine/OrderTracker.tsx` - Real-time tracking
- `src/components/dine/BillScreen.tsx` - Payment processing
- `src/components/dine/WaiterSheet.tsx` - Waiter alerts
- `src/components/dine/PaymentSheet.tsx` - Payment details

### Admin Components
- `src/app/admin/page.tsx` - Admin dashboard
- `src/components/admin/LoginScreen.tsx` - Authentication
- `src/components/admin/MenuManager.tsx` - Menu CRUD
- `src/components/admin/LiveOrders.tsx` - Real-time orders
- `src/components/admin/AlertsPanel.tsx` - Waiter alerts
- `src/components/admin/PaymentsTab.tsx` - Payment tracking

### Utilities & Hooks
- `src/lib/api.ts` (NEW) - API client functions
- `src/lib/useSSE.ts` (NEW) - SSE stream hook
- `src/lib/useAuth.ts` (NEW) - Authentication hook
- `tests/utils.js` - Already has request utility

---

## API Endpoints Reference

### Public Endpoints
- `POST /api/auth/login` - Login with PIN
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `GET /api/menu` - Fetch all public menu items
- `GET /api/tables/:qr_token` - Get table by QR token
- `POST /api/sessions` - Create customer session
- `GET /api/sessions/:session_id/orders` - Get session orders
- `GET /api/sessions/:session_id/payment` - Get payment status
- `POST /api/sessions/:session_id/payment` - Record payment
- `GET /api/dine/stream/:session_id` - Real-time dine updates (SSE)
- `POST /api/orders` - Submit order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id` - Update order status

### Admin-Protected Endpoints (Require Auth)
- `GET /api/admin/menu` - List menu items
- `POST /api/admin/menu` - Create menu item
- `PUT /api/admin/menu/:id` - Update menu item
- `DELETE /api/admin/menu/:id` - Delete menu item
- `GET /api/admin/tables` - List all tables
- `GET /api/admin/alerts` - List active alerts
- `POST /api/admin/alerts` - Create alert
- `PATCH /api/admin/alerts/:id` - Resolve alert
- `DELETE /api/admin/alerts/:id` - Delete alert
- `GET /api/admin/payments` - List payments
- `PATCH /api/admin/payments/:id` - Update payment status
- `GET /api/admin/stream` - Real-time admin updates (SSE)
- `POST /api/upload/image` - Upload image to Cloudinary

---

## Implementation Progress

### Phase 1: Core API Utilities (Step 1)
- [ ] Create `src/lib/api.ts` with request wrapper
- [ ] Create `src/lib/useSSE.ts` for stream handling
- [ ] Create `src/lib/useAuth.ts` for auth state

### Phase 2: Customer Flow (Steps 2-5)
- [ ] Integrate menu fetching
- [ ] Implement session creation
- [ ] Add order placement
- [ ] Add SSE stream listeners
- [ ] Implement real-time updates

### Phase 3: Authentication (Step 6)
- [ ] Build login screen
- [ ] Implement auth check on admin routes
- [ ] Add logout functionality
- [ ] Handle token expiry

### Phase 4: Admin Dashboard (Step 7)
- [ ] Menu manager CRUD
- [ ] Live orders display
- [ ] Admin stream integration
- [ ] Payment tracking

### Phase 5: Advanced Features (Steps 8-9)
- [ ] Payment processing
- [ ] Image upload functionality
- [ ] Error handling & validation

---

## Notes

- Backend database uses `@neondatabase/serverless` (HTTP-based, no WebSocket)
- SSE streams broadcast events to all connected listeners
- Session storage is temporary, no persistent token needed for dine flow
- Admin endpoints require `rw_session` HTTP-only cookie
- Images uploaded to Cloudinary (not stored locally)
- Prices stored as NUMERIC in database, convert to Number for JSON

---

## Last Updated: Starting June 1, 2026
