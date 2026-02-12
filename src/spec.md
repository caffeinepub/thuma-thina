# Specification

## Summary
**Goal:** Fully revert the deployed application (frontend + backend canisters) to the exact state of Version 34.

**Planned changes:**
- Revert the frontend canister code and deployed assets to Version 34, removing all Version 35+ changes.
- Revert the backend canister code (methods/state logic) to Version 34 with no retained post–Version 34 changes.
- Restore Version 34 admin recognition behavior so the same caller principal is recognized as admin and admin-only routes/actions work.

**User-visible outcome:** The app behaves and looks exactly as it did in Version 34, and the caller’s admin account works again as it did in Version 34 (admin-only actions/routes accessible).
