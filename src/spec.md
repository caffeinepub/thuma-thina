# Specification

## Summary
**Goal:** Replace the landing page with a multi-retailer product catalogue and add an auth-gated checkout plus role-based order workflow dashboards (admin, shopper, driver, pickup point) with town-based filtering.

**Planned changes:**
- Update the default route ("/") to a customer-facing global catalogue that groups products and shows all retailer listing options (price/stock/status) per product, requiring selection of a specific retailer listing when adding to cart.
- Add an auth-gated checkout flow: allow logged-out browsing/cart, but require Internet Identity login/registration to place an order and then resume checkout post-login.
- Implement backend catalogue data model and APIs for admin-managed Products, Retailers, and Listings (product+retailer+price+stock/status), including admin-only create/update/delete and public querying for the catalogue.
- Build admin UI for managing products and their retailer listings (create/edit/delete/list) and ensure customer catalogue reflects changes.
- Add admin-managed Towns and require shoppers/drivers/pickup points to register/select a town; filter eligible/visible orders in dashboards by town.
- Implement order creation and persistence: checkout submits orders with listingIds+quantities, delivery method, payment method, total amount, and status; provide customer order history/details and role-based order retrieval.
- Implement shopper dashboard/workflow: town-filtered available orders, accept order, record progress, mark complete for driver handoff, and submit per-listing out-of-stock notes that mark that retailer listing out-of-stock until admin resets.
- Implement driver dashboard/workflow: town-filtered ready-for-delivery orders, accept delivery, mark picked up/delivered/completed, and remove completed deliveries from available queues.
- Implement pickup point ordering and dashboard: place orders via catalogue/checkout with required beneficiary name + contact number; track order progress and mark received/waiting for pickup.
- Implement admin oversight dashboards: consolidated orders view with filters (status/town/assignments) and per-user analytics summaries for shoppers/drivers/pickup points (counts and active assignments), access-controlled to admins.
- Ensure all new/updated user-facing UI copy is in English.
- Fix broken theme images by ensuring required theme assets exist under frontend/public/assets/generated and are referenced via deployment-safe public asset URLs; apply a cohesive warm earth-tone Thuma Thina visual refresh across new pages.

**User-visible outcome:** Users can browse a multi-retailer catalogue and build a cart per retailer listing, then log in with Internet Identity to place orders; admins can manage catalogue listings, towns, and oversee orders/analytics; shoppers and drivers can accept and process town-filtered orders; pickup points can place and track beneficiary orders, and theme images render correctly without broken links.
