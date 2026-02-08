# Specification

## Summary
**Goal:** Add an admin-only Retailers management section with editable retailer details (including operating hours), improve admin listing creation selectors, and prevent ordering while a retailer is closed.

**Planned changes:**
- Add a new admin-only Retailers route/section (inside the existing admin gate) for registering retailers and managing existing retailers in one place.
- Implement a retailers list/table backed by live data with Edit and Remove actions, including a confirmation step for removals and cache refresh after changes.
- Add/extend backend APIs to list all retailers, update a retailer, and remove a retailer; restrict update/remove to admin callers.
- Expand the retailer model to store weekly operating hours (Mon–Sun) and date-specific holiday overrides; add admin UI to edit these schedules and persist them.
- Add backend logic to determine whether a retailer is currently open (using weekly hours + holiday overrides) and surface open/closed status in retailer browsing UI; ensure the UI does not imply orders can be placed while closed.
- Replace free-text province entry in retailer registration with a dropdown of the 9 South African provinces.
- Update the existing Admin Dashboard listing creation form so Retailer and Product selectors load from live backend data and support type-to-search.
- Add safe backend state migration/conditional upgrade logic so existing retailer records gain default operating hours without data loss.

**User-visible outcome:** Admin users can register, view, edit, and remove retailers (including setting weekly hours and holiday overrides). Customers can see when retailers are open/closed, and the UI prevents proceeding as if an order can be placed while a retailer is closed. Admin listing creation has searchable, backend-populated retailer and product dropdowns.
