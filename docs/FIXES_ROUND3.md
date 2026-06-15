# COGNOS — Bug Fixes & UI Improvements (Round 3)

This document covers the latest set of UI refinements, state fixes, and feature additions applied during manual review.

## Progress

| # | Issue | Status |
|---|-------|--------|
| 1 | Table number missing on page refresh for returning users | ✅ Done |
| 2 | Landing page image optimization (1.6MB to 44KB) | ✅ Done |
| 3 | Horizontal scrolling/overflow on menu item bottom sheet | ✅ Done |
| 4 | Admin menu toggle for item availability | ✅ Done |
| 5 | Empty state fallback logic in customer menu | ✅ Done |

---

## Issue 1 — Table Number Missing for Returning Users

### Symptom
When a returning user with an active session refreshes the dine page (or re-enters without scanning a QR code), the table number displays incorrectly (defaulting to "T01" or empty) because the cached `riwayat_table_label` was missing from `sessionStorage`.

### Fix
- Updated `GET /api/sessions/[id]/orders` to perform a `LEFT JOIN` on `restaurant_tables` to fetch the authoritative `table_label` directly from the database.
- Added `table_label` to `SessionOrdersResponse` type in `api.ts`.
- Updated `dine/page.tsx` initialization logic to use the `table_label` from the session orders response and repopulate `sessionStorage`. This ensures the UI relies on the database as the source of truth for returning users.
- Ensured all session-teardown logic (like ending a session or closing a bill) clears `riwayat_table_label` from storage to prevent stale data.

---

## Issue 2 — Landing Image Optimization

### Symptom
The dine landing page took a long time to load because the background image was a heavy 1.6MB PNG file.

### Fix
- Compressed `bg-removebg-preview.png` into `.webp` format, reducing the file size to ~44KB.
- Updated `WelcomeScreen.module.css` to use the new `.webp` image.

---

## Issue 3 — Horizontal Scrolling on Menu Item Bottom Sheet

### Symptom
When a user tapped a menu item to open the details bottom sheet, the content (specifically the note textarea) would overflow horizontally, causing the entire page to become scrollable left-to-right.

### Fix
- Added `overflow-x: hidden` to `.bottom-sheet` and `.item-sheet-body` in `sheets.css`.
- Applied `box-sizing: border-box` and `max-width: 100%` to the `.note-input` textarea to prevent it from ignoring padding constraints and overflowing its parent container.

---

## Issue 4 — Admin Menu "Available" Status Toggle

### Symptom
The `MenuManager.tsx` UI showed a static badge for item availability ("Available" / "Hidden"), but there was no way for the admin to quickly toggle this without opening the edit modal (which previously lacked an availability field anyway).

### Fix
- Updated `lib/api.ts` with a `patchMenuItemField` helper to call the existing `PATCH /api/admin/menu/:id` endpoint.
- Replaced the static status badge in `MenuManager.tsx` with an interactive, pill-shaped toggle button.
- Implemented optimistic UI updates and a spinning loader (added `@keyframes spin` to `base.css`) during the API call.
- The `GET /api/menu` route for customers inherently respects `available = true`, so toggling the button instantly removes or restores the item on the customer menu.

---

## Issue 5 — Empty State Fallback Logic in Customer Menu

### Symptom
When the admin toggled all menu items to "Unavailable", the customer menu received an empty array from the backend. The frontend erroneously interpreted this as a missing API connection and fell back to rendering a hardcoded, 10-item dummy placeholder menu. Due to schema mismatches, these dummy items lost their images and clumped into the "All" category.

### Fix
- Updated `MenuGrid.tsx` fallback logic from `menuData && menuData.length > 0` to `menuData !== undefined`, ensuring that an intentionally empty list from the API is respected and renders "No dishes found".
- Completely removed the 10-item placeholder data from `lib/menuData.ts`, leaving it as `export const MENU: MenuItem[] = [];` to ensure no fake items pollute the UI going forward.
