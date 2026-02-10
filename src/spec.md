# Specification

## Summary
**Goal:** Add an admin “Manage Listings” dashboard to view and manage all listings grouped by retailer, including listing date, price, and inventory status.

**Planned changes:**
- Extend the backend Listing model to store a createdAt timestamp and add a migration to populate it for existing persisted listings.
- Add backend admin-only methods to update a listing (price/stock/status) and to delete a listing, with server-side authorization and clear error handling.
- Create a new admin-only frontend route/page (e.g., `/admin/listings`) that lists all retailers and their listings, showing listing date, ZAR price, and inventory status, with actions to edit, disable, delete (with confirmation), and create a new listing.
- Add/extend React Query hooks to fetch all listings for admin use and to perform update/delete mutations, with cache invalidation so changes appear without manual reload.

**User-visible outcome:** Admin users can open a Manage Listings page to see all listings grouped by retailer, view listing date/price/status, and create, edit, disable, or delete listings with updates reflected immediately.
