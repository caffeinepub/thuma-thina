# Specification

## Summary
**Goal:** Deliver a Shop-only MVP for “Thuma Thina” focused on location-based browsing and viewing a retailer product catalog, excluding all ordering, payment, token, KYC, dashboard, and notification features.

**Planned changes:**
- Backend (single Motoko main actor): add on-chain models and CRUD/query APIs for Provinces, Towns/Suburbs, Retailers, and Products (category, price, description, image reference), including catalog browsing and search-by-text + filter-by-category queries with stable storage persistence.
- Backend: add “Request new product/retailer” submission storage with update method to create requests and query method to list submitted requests, persisted on-chain.
- Frontend: build mobile-first Shop pages for Province list → Town/Suburb list → Retailer list → Retailer product listing → Product detail (image, name, description, category, price) with graceful fallback when an image is missing.
- Frontend: add product search, category filtering (including “All categories”), and basic sorting (price low→high / high→low) within a retailer’s product listing.
- Frontend: add a “Request new product/retailer” form with client-side validation and English success/error states.
- Frontend: apply a consistent warm, modern African-inspired theme (greens, yellows, earth tones; avoid blue/purple) with readable, accessible contrast across all Shop pages.
- Frontend: add generated static brand assets under `frontend/public/assets/generated` and render the logo in Shop header/navigation (and optionally a hero image on the Shop entry view), without routing images through the backend.

**User-visible outcome:** Users can browse Provinces → Towns/Suburbs → Retailers, view each retailer’s product catalog with images/prices/descriptions, search/filter/sort products, view product details, and submit a request for a new product or retailer—without any cart, checkout, payment, or token-related UI.
