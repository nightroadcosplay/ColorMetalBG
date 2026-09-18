# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ColorMetalBG is a B2B e-commerce portal for Color Metal (Bulgarian instance). It has a Vue 3 frontend and a PHP Phalcon backend with PostgreSQL.

## Tech Stack

- **Frontend:** Vue 3 + TypeScript, Quasar 2 UI framework, Vuex 4 (with vuex-module-decorators), Vue Router 4, Axios, vue-i18n (BG/RO/EN/HU)
- **Backend:** PHP Phalcon Micro framework, PostgreSQL (database: `cmportal_bg`, schema: `portal_color`), DomPDF for PDF generation
- **Auth:** Session-based (file storage, 12h lifetime), hCaptcha on registration

## Common Commands

### Frontend (`cmportal-frontend/`)
```bash
npm install          # Install dependencies
npm run serve        # Dev server (hot reload)
npm run build        # Production build
npm run lint         # ESLint with auto-fix
```

### Backend
- No build step — PHP serves directly via `cmportal_backend/www/index.php`
- Dev server: run `cmportal_backend/www/startWebServerPhp.bat`
- DB init script: `cmportal_backend/script/portal-30-01-2025.sql`

## Architecture

### Frontend (`cmportal-frontend/src/`)
- **pages/** — Page-level Vue components (Admin, Login, Dashboard, BrowseArticles, etc.)
- **components/** — Reusable UI components
- **services/** — API service layer (one service per domain: ServiceUser, ServiceBasket, ServiceOffer, etc.)
- **store/** — Vuex modules (user, basket, favorites, nomenclatoare, mailbox, offers)
- **modules/** — Shared utilities (interceptors.ts for Axios, utils.ts, getBasket.ts, getFavorites.ts)
- **types/** — TypeScript interfaces (40+ type definitions)
- **language/** — i18n JSON files (bg.json, en.json, ro.json, hu.json)
- **config.ts** — API endpoint URLs (localhost:83 for dev, relative `/api` for production)

### Backend (`cmportal_backend/`)
- **www/index.php** — Main entry point with all Phalcon Micro route definitions (large file)
- **www/config.php** — Database connection config
- **controllers/** — 30+ controllers organized by domain (Admin*, User, Offer, Invoice, Browse*, etc.)
- **models/** — 28+ Phalcon ORM models
- **templates/** — Email and PDF templates (.phtml)
- **dompdf/** — Vendored PDF library

### API Structure
All API routes are prefixed with `/api` and organized by Phalcon Micro Collections:
- `/api/user/` — Auth, session, password management
- `/api/admin/*` — Admin CRUD (users, categories, products, companies)
- `/api/browse/` — Public product/category browsing
- `/api/basket/`, `/api/favorites/` — Cart and wishlist
- `/api/offer/` — Offer lifecycle (create, quote, accept)
- `/api/invoice/` — Invoice retrieval and filtering
- `/api/my_accounting_balance/` — Balance reports (PDF/JSON)
- `/api/nomenclatoare/` — Static reference data

## Key Patterns

- Frontend services in `services/` make Axios calls to backend API endpoints defined in `config.ts`
- Vuex stores use class-based decorators (`vuex-module-decorators`)
- Backend controllers return JSON responses; PDF endpoints stream files directly
- Multi-language support: Bulgarian is default in production, Romanian in dev
- Product images stored in `uploads_img_product/`, profile pics in `img_for_profiles/`
