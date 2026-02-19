# Specification

## Summary
**Goal:** Enforce mandatory default town selection for all users to ensure every user has a town set before using the app.

**Planned changes:**
- Make default town field mandatory in ProfileSetupDialog and prevent dialog dismissal until town is selected
- Add authentication flow check to display DefaultTownSetupDialog immediately after login for users without a default town
- Update ShopLayout to render blocking DefaultTownSetupDialog for authenticated users missing a default town

**User-visible outcome:** New users must select a default town during registration to proceed. Existing users without a default town will be prompted with a non-dismissible modal after login, preventing app access until a town is selected.
