# Specification

## Summary
**Goal:** Add an admin-only towns management module (CRUD) with persistent storage and a dedicated Admin Towns page.

**Planned changes:**
- Implement a persistent Towns data model in the Motoko main actor, including stable unique IDs, server-side created/updated timestamps, and a removal state (soft remove) that preserves records for future referential integrity.
- Add admin-only backend methods to list, create, update, and remove towns, returning clear errors for non-admin callers.
- Update `frontend/src/hooks/useTowns.ts` React Query hooks to call the new backend towns methods and invalidate caches using existing `townKeys` (including an update-town mutation).
- Create a new Admin Towns management page that lets admins view towns, add, edit, and remove towns with basic validation (name + province required), removal confirmation, loading states, and clear English error messages.
- Add a new admin route (e.g., `/admin/towns`) in the hash router and link to it from the existing admin area UI (e.g., admin dashboard), protected by existing RequireAuth + RequireAdmin guards.
- Apply a coherent, non-blue/non-purple visual treatment for the Admin Towns page using existing shadcn + Tailwind components and patterns, with all user-facing text in English.

**User-visible outcome:** Admins can navigate to an Admin Towns page to add, edit, and remove towns from a curated list, with changes saved persistently and reflected in the UI without full refresh; non-admin users cannot access or mutate towns.
