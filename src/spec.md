# Specification

## Summary
**Goal:** Make the towns module UI accessible to all authenticated users, not just admins.

**Planned changes:**
- Remove admin-only conditional rendering from MyTownsPage component
- Display towns list and default town selection dropdown to all authenticated users
- Show the searchable town selector interface (matching current admin UI) even though save functionality won't persist until backend integration

**User-visible outcome:** All authenticated users can view and interact with the towns selection interface, including searching and selecting a default town from the dropdown (visual feedback only, no persistence until backend integration).
