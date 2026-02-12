# Specification

## Summary
**Goal:** Add minimal backend canister support for Pickup Point applications: authenticated user submission plus admin review (list pending) and decisions (approve/reject).

**Planned changes:**
- Add a new authenticated `shared ({ caller })` backend method in `backend/main.mo` for users to create a Pickup Point application, persisted in `pickupPointApplications : Map<Principal, PickupPointApplication>`.
- Enforce access control for creation (`#user` required) and prevent duplicate submissions per caller.
- Store created applications with `status = #pending`, `submittedAt = Time.now()`, and `reviewedBy = null`, including support for a business image using the existing `Storage.ExternalBlob` (stored without changing the public `PickupPointApplication` type).
- Add a new admin-only `query ({ caller })` backend method to list only `#pending` Pickup Point applications.
- Add new admin-only `shared ({ caller })` backend methods to approve or reject an application by applicant `Principal`, updating application status and `reviewedBy`.
- On approval, assign a pickup point id via `nextPickupPointId` and record the mapping in `approvedPickupPoints : Map<Nat, Principal>`, ensuring deterministic handling of re-approval/re-rejection without corrupting state.
- Use English trap/error messages for permission checks, missing applications, duplicates, and invalid state transitions.

**User-visible outcome:** No UI changes; backend now exposes methods for users to submit Pickup Point applications and for admins to list pending applications and approve or reject them.
