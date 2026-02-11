# Specification

## Summary
**Goal:** Implement a complete listings module that supports promo pricing, exposes only orderable catalogue items to shoppers, and enables checkout/orders using listing IDs with correct pricing and stock validation.

**Planned changes:**
- Extend the backend listing model to enforce one listing per (retailerId, productId), store normal price plus optional promo price with start/end (end can be indefinite), and compute which price is currently active.
- Add admin-only backend CRUD APIs for listings (create/update/delete/list with filters) with clear validation errors (e.g., duplicate retailer+product).
- Add a shopper/guest backend catalogue API that returns global products augmented with only orderable listings (active + in-stock) and includes pricing fields needed to show active price and promo savings.
- Implement backend order creation using (listingId, quantity), validating orderability and stock, computing totals using active price, decrementing stock atomically, storing delivery method (including pickup point) and payment method, and exposing customer order query methods.
- Add/update a conditional backend state migration for the listings schema change and any new indices for (retailerId, productId) uniqueness.
- Wire frontend hooks to real backend methods for listings, catalogue, and orders; update admin listings UI to fully support create/edit/delete and handle backend validation errors.
- Update admin listing editor UI to configure promo pricing (promo dates, optional indefinite end), validate promo price < normal price, and show calculated savings.
- Update shopper catalogue UI to use the real backend catalogue, add to cart using listingId, and display promo pricing with savings while hiding/disable non-orderable listings.
- Update checkout flow to call real backend order creation with listingIds, quantities, delivery method (including pickup point), and payment method; show clear error messages on validation failures and clear cart on success.

**User-visible outcome:** Admins can manage retailer product listings with promo pricing and stock/status; shoppers see only in-stock active listings with correct promo display and savings, can add items to cart by listing, and can successfully place orders (including pickup point delivery) with accurate totals and stock validation.
