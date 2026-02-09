# Specification

## Summary
**Goal:** Fix ZAR pricing so all money values are stored/displayed in rands, enable admin deletion for retailers and products, and deliver a role-based order workflow (customer → shopper → driver) using the existing Internet Identity login.

**Planned changes:**
- Standardize listing/product/order monetary values to ZAR rands (not cents) across backend state, frontend entry forms, catalogue display, and money-related analytics totals.
- Add a conditional backend migration to convert legacy listing prices stored as cents into rands (divide by 100, rounding down if needed).
- Implement and wire up admin retailer deletion end-to-end (backend removeRetailer + frontend action), including confirmation and UI refresh without full reload; deletion also removes associated listings.
- Add admin ability to delete products from the universal catalogue (backend removeProduct + frontend action), including confirmation and UI refresh; deletion also removes associated listings.
- Implement backend order creation and persistence for customers/users, including line items (listingId, quantity, unit price in rands) and validated status transitions through: placed → shopping → readyForDelivery → outForDelivery → delivered.
- Add backend shopper APIs to list placed orders, accept an order (assign shopper), and mark shopping done (moves order to readyForDelivery) with role checks.
- Add backend driver APIs to list ready-for-delivery orders, accept/collect (assign driver), and mark delivered with role checks.
- Implement role-based frontend dashboards: customers browse listings and place orders; shoppers manage placed orders; drivers manage ready-for-delivery orders; navigation shows dashboards based on role; all UI text remains English.
- Update admin listing creation/edit UI copy and formatting so price fields clearly use rands and no screen shows cents as rands.

**User-visible outcome:** Admins see consistent ZAR rand pricing everywhere and can delete retailers/products (with confirmations) while data updates immediately; customers can place orders from listings; shoppers can accept and complete shopping on new orders; drivers can accept deliveries and mark orders delivered, with dashboards shown based on the logged-in user’s role.
