# Specification

## Summary
**Goal:** Restore the Thuma Thina application to its Version 53 stable state, where all core backend modules and frontend features were fully functional.

**Planned changes:**
- Restore `backend/main.mo` with all working data types and actor methods for Products, Retailers, Listings, user registration/approval, and role-based approval for Shoppers, Drivers, and Pick-up Points
- Restore frontend hooks (`useProducts`, `useRetailers`, `useListings`, `useRoleApplications`, `useShopperApplication`, `useDriverApplication`, `usePickupPointApplication`, `useCategories`, `useTowns`, `useSystemSettings`) to call real backend actor methods instead of returning stubs or throwing errors
- Restore all admin pages (`AdminProductsPage`, `AdminRetailersPage`, `AdminManageListingsPage`, `AdminShoppersPage`, `AdminDriversPage`, `AdminPickupPointsPage`, `AdminOrdersPage`) to display and manage real backend data, removing all "backend-unavailable" banners
- Restore admin dialog components (`ProductEditDialog`, `RetailerEditDialog`, `ListingEditDialog`) with real create/edit forms connected to backend mutations
- Restore `CataloguePage`, `ProductDetailPage`, `RetailerListPage`, and `RetailerCatalogPage` to fetch and display real data from the backend
- Restore the `AdminOnly` guard component to properly render children for admin users and deny access to non-admins

**User-visible outcome:** Admins can manage products, retailers, listings, and approve/reject shopper, driver, and pick-up point applications. The catalogue and product/retailer pages display real data, and the admin dashboard is fully accessible to admin users with no stub errors or "backend unavailable" banners.
