# Specification

## Summary
**Goal:** Implement a persisted Orders data model and backend APIs so customer-created orders can be stored and surfaced as an eligible “available orders” feed on the Driver Dashboard, while supporting basic admin order listing and status updates.

**Planned changes:**
- Implement Orders persistence in `backend/main.mo`, including OrderId generation and consistent computation/storage of `OrderRecord.totalAmount`, timestamps, and status.
- Expose functional backend methods expected by the existing frontend hooks: `createOrder`, `getMyOrders`, `getOrder`, `listEligibleDriverOrders`, `listAllOrders` (admin), and `updateOrderStatus` (admin), following existing authorization patterns.
- Ensure the Driver Dashboard eligible orders feed loads via `useListEligibleDriverOrders` and renders rows (id, item count, total, createdAt, status) without runtime errors; adjust frontend status display logic only if needed to match the backend “ready for delivery” status semantics while keeping English text.

**User-visible outcome:** Customers can place orders that are saved and viewable in their order history, admins can list and update order statuses, and drivers can open the Driver Dashboard to see a stable eligible orders table (or loading/error/empty states) for orders ready for pickup/delivery.
