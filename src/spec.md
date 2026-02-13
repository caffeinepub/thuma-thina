# Specification

## Summary
**Goal:** Add a new authenticated Pickup Point Dashboard route that renders an empty placeholder page.

**Planned changes:**
- Create a new Pickup Point Dashboard page component under `frontend/src/pages/shop` that displays an H1 title and short English placeholder description only.
- Add a new protected route in `frontend/src/router/HashRouter.tsx` (wrapped by `RequireAuth`) to render the placeholder page at `/pickup-point-dashboard`.

**User-visible outcome:** Logged-in users can navigate to `/pickup-point-dashboard` and see a placeholder Pickup Point Dashboard page; logged-out users are gated by the existing authentication flow.
