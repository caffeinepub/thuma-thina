# Specification

## Summary
**Goal:** Fix the Internet Identity login flow so it never results in a blank screen, even when post-login initialization hits errors or empty admin token/secret initialization paths.

**Planned changes:**
- Backend: Make access-control/secret initialization safe when called with empty token(s) (e.g., empty `caffeineAdminToken`) so it does not trap and does not prevent creating/using the authenticated actor for normal browsing.
- Frontend: Add a clear loading state during the Internet Identity round-trip and immediate post-login initialization phase (without modifying any immutable hook files).
- Frontend: Add a non-blank runtime error fallback UI for unexpected errors during/after login, showing an English error message and at least one recovery action (reload and/or return home).

**User-visible outcome:** After clicking “Login,” users see a loading state, and after successful sign-in the app continues to render normally (no blank screen). If something goes wrong during/after login, an English error panel appears with a recovery option instead of a blank page.
