# BrandForge AI — Complete Project Documentation

## 📌 Project Overview

**BrandForge AI** is a full-stack **AI-powered Print-on-Demand (POD) platform** that enables sellers to create custom merchandise (T-Shirts, Hoodies, Mugs, Phone Cases, Caps) using AI-generated artwork, publish product listings with real-time mockups, and sell them via Stripe-powered checkout — all without holding inventory.

**Architecture:** Monorepo with separate `client/` (React SPA) and `backend/` (Express API) directories.

---

## 🛠️ Technology Stack

### Backend

| Technology | Version | Why It's Used |
|-----------|---------|---------------|
| **Node.js + Express** | v4.22 | Lightweight, battle-tested REST API framework. Handles routing, middleware, and serves the SPA in production. |
| **TypeScript** | v5.9 | Type safety across the entire backend. Catches bugs at compile time, improves developer experience with autocompletion. |
| **Prisma ORM** | v7.8 | Type-safe database client for PostgreSQL. Auto-generates TypeScript types from schema. Handles migrations and seeding. |
| **PostgreSQL (Neon)** | — | Cloud-hosted serverless PostgreSQL. Chosen over MongoDB for relational data integrity (orders → listings → products → colors). |
| **Better Auth** | v1.6 | Modern auth library supporting email/password + Google OAuth. Session-based auth with cookie tokens. Integrates directly with Prisma. |
| **Stripe** | v20.4 | Industry-standard payment processing. Handles checkout sessions, webhooks for payment confirmation, and order status updates. |
| **Cloudinary** | v2.9 | Cloud image hosting + on-the-fly image transformations. Used for artwork storage AND dynamic mockup generation (overlaying artwork onto product images). |
| **Pollinations.ai** | — | **Free** AI image generation API (no API key needed). Replaces the paid Replicate API. Uses the Flux model for high-quality artwork. |
| **remove.bg** | — | Background removal API. Strips backgrounds from AI-generated artwork to create clean transparent PNGs for product mockups. |
| **Zod** | v3.25 | Runtime request validation. Validates all incoming API payloads (listings, orders) before they hit the database. |
| **Slugify** | v1.6 | Generates URL-safe slugs for listings (e.g., "Cool Tiger Design" → `cool-tiger-design-1717834567`). |
| **bcryptjs** | v3.0 | Password hashing for email/password authentication. |

### Frontend

| Technology | Version | Why It's Used |
|-----------|---------|---------------|
| **React** | v19.2 | Component-based UI library. Latest version with improved performance and concurrent features. |
| **Vite** | v8.0 | Ultra-fast build tool and dev server. Hot Module Replacement (HMR) for instant feedback during development. |
| **TypeScript** | v5.9 | Full type safety on the frontend. Shared type definitions with backend models. |
| **TailwindCSS** | v4.2 | Utility-first CSS framework. Enables rapid UI development with consistent spacing, colors, and responsive design. |
| **Radix UI** | — | Headless, accessible UI primitives (Dialog, Dropdown, Accordion, Tabs, etc.). Used via shadcn/ui component wrappers. |
| **Fabric.js** | v7.2 | **HTML5 Canvas library** — the core of the design editor. Handles artwork placement, text rendering, drag/resize/rotate on the canvas. |
| **TanStack React Query** | v5.99 | Server state management. Handles data fetching, caching, and background refetching for all API calls. |
| **React Router DOM** | v7.14 | Client-side routing. Handles navigation between pages (Home, Design Editor, Listings, Orders, Settings). |
| **React Hook Form** | v7.75 | Form management for the checkout flow. Handles validation, submission, and error states. |
| **Sonner** | v2.0 | Toast notification library. Shows success/error messages for actions like "Listing created" or "Payment failed". |
| **Axios** | v1.15 | HTTP client for API calls. Configured with base URL and credentials for cookie-based auth. |
| **Lucide React** | v0.577 | Icon library. Provides all UI icons (Sparkles, Eye, Pencil, DollarSign, etc.). |
| **next-themes** | v0.4 | Dark/Light mode toggle. Persists user preference in localStorage. |

---

## 📁 Project Structure

```
BrandForge_Ai/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema (Products, Orders, Users, etc.)
│   └── src/
│       ├── index.ts               # Express app entry point
│       ├── config/                 # Env, Cloudinary, Stripe, HTTP status configs
│       ├── lib/                    # Prisma client, Better Auth setup
│       ├── controllers/           # Route handlers (product, listing, order)
│       ├── services/              # Business logic (AI generation, mockups, CRUD)
│       ├── middlewares/           # Auth guard, error handler, async wrapper
│       ├── routes/                # API route definitions
│       ├── validators/            # Zod schemas for request validation
│       ├── webhooks/              # Stripe webhook handler
│       ├── utils/                 # AI prompt, error classes, helpers
│       └── script/                # Database seed scripts
│
├── client/
│   └── src/
│       ├── main.tsx               # React app entry point
│       ├── App.tsx                # Router setup
│       ├── index.css              # Global styles + design editor CSS
│       ├── pages/                 # Page components
│       │   ├── home/              # Dashboard + product catalog
│       │   ├── design/            # Canvas editor + sidebar
│       │   ├── listings/          # My Listings + public listing page
│       │   ├── orders/            # Seller order management
│       │   ├── settings/          # User settings
│       │   └── auth/              # Sign in / Sign up
│       ├── components/            # Shared UI components (shadcn/ui)
│       ├── context/               # Canvas context (shared editor state)
│       ├── lib/                   # API functions, auth client, utils
│       ├── types/                 # TypeScript interfaces
│       └── routes/                # Route definitions
```

---

## 🔑 Database Schema (6 Core Models)

```
┌──────────┐     ┌──────────────┐     ┌─────────┐
│  Product  │────▶│ ProductColor │◀────│ Listing │
│           │     │              │     │         │
│ id        │     │ id           │     │ id      │
│ type      │     │ templateId   │     │ userId  │
│ template  │     │ name         │     │ slug    │
│ name      │     │ color (rgb)  │     │ title   │
│ basePrice │     │ mockupUrl    │     │ price   │
│ baseUrl   │     └──────────────┘     │ artwork │
│ printArea │                          └────┬────┘
└──────────┘                               │
                                    ┌──────┴──────┐
  ┌──────┐     ┌───────┐          │ ListingColor │
  │ User │────▶│Session│          │ (junction)   │
  │      │     └───────┘          └──────────────┘
  │      │────▶│Account│
  └──┬───┘     └───────┘          ┌──────────┐
     │                            │  Order   │
     └───────────────────────────▶│ listing  │
                                  │ color    │
                                  │ size     │
                                  │ customer │
                                  │ shipping │
                                  │ isPaid   │
                                  │ status   │
                                  └──────────┘
```

**Enums:**
- `ProductType`: TSHIRT, HOODIE, MUG, PHONECASE, CAP
- `Section`: catalog, featured
- `OrderStatus`: pending, failed, awaiting_shipment, shipped, fulfilled

---

## ✨ Features — Detailed Breakdown

### 1. Authentication System
- **Email/Password** sign up with bcrypt password hashing
- **Google OAuth** social login
- **Session-based** auth using HTTP-only cookies (not JWT)
- **Auth middleware** protects all `/api/*` routes except public listing pages
- **Better Auth** handles session lifecycle, token refresh, and account linking

### 2. Product Catalog
- **5 product types**: T-Shirt, Hoodie, Coffee Mug, Phone Case, Cap
- **Template products** (designable) vs **display-only products** (catalog visuals)
- Each template has a **transparent base image**, **printable area coordinates**, **base price**, and **available sizes**
- Products are split into **Starter Essentials** (catalog) and **Featured** sections on the homepage

### 3. AI Art Studio (Artwork Generation)
The crown feature. A 5-step pipeline:

| Step | What Happens | Service Used |
|------|-------------|-------------|
| 1 | User types a prompt (e.g., "stay wild") | Frontend textarea |
| 2 | Prompt is refined by AI into a detailed art direction | Pollinations.ai text API |
| 3 | Refined prompt generates a 1024×1024 image | Pollinations.ai image API (Flux model) |
| 4 | Generated image is uploaded to cloud storage | Cloudinary |
| 5 | Background is removed for clean product overlay | remove.bg API |

**System Prompt Engineering:** A carefully crafted system prompt instructs the AI to act as a "prompt engineer for print-on-demand apparel" with rules about composition (1:1 square, white background), style matching (graffiti, retro, minimal, etc.), and output format.

### 4. Design Editor (Fabric.js Canvas)
- **Canvas-based editor** where users design their product
- **Add Image**: Upload custom artwork (PNG/JPG) onto the canvas
- **Add Text**: Place editable text with font selection (Helvetica, Impact, Arial, Georgia, Times New Roman, Courier New), bold/italic/underline toggles, and color picker
- **AI Art Studio**: Generate artwork from text prompt and place it directly on canvas
- **Quick Artworks**: 10 pre-made artwork presets for instant use
- **Drag, resize, rotate** any element on the canvas with custom controls
- **Design/Preview toggle**: Switch between editing mode and mockup preview
- **Color swatches**: Click to see the product in different colors (swaps product image)
- **Printable area guide**: Dashed pink border showing where artwork will be printed
- **Real-time artwork capture**: Canvas state is captured as a data URL whenever objects are modified

### 5. Listing Creation & Management
When a seller clicks "Create Product":
1. Artwork is captured from the canvas as a PNG data URL
2. Artwork is uploaded to Cloudinary
3. A URL-safe slug is generated (title + timestamp)
4. Listing is created in the database with artwork placement coordinates
5. Selected color variants are linked via the ListingColor junction table

**Listings page** shows a table with artwork thumbnail, title, description, price, and a "Share Link" button.

### 6. Public Listing Page (Buyer View)
- Accessible via `/listing/{slug}` — **no login required**
- Shows product mockup with artwork overlaid (generated via Cloudinary transformations)
- **Color selector**: Click to see the product in different colors (each color has its own mockup)
- **Size selector**: Grid of available sizes
- **Checkout button** opens a dialog with shipping form
- **Accordion sections**: Description, Product Details, Shipping & Returns
- **BrandForge logo** header for brand consistency

### 7. Dynamic Mockup Generation (Cloudinary)
The most technically complex feature. When a buyer views a listing:
1. Backend fetches the listing's artwork and selected color mockup
2. Cloudinary URL is constructed with **transformation pipeline**:
   - Overlay the artwork image on top of the mockup
   - Scale artwork to match printable area dimensions
   - Position artwork using `gravity: north_west` with x/y offsets
3. Returns a single URL that Cloudinary renders on-the-fly
4. No server-side image processing needed — Cloudinary does it all via URL parameters

### 8. Checkout & Payment (Stripe)
1. Buyer fills checkout form (name, email, shipping address)
2. Backend creates an Order record (status: pending, isPaid: false)
3. Stripe Checkout Session is created with:
   - Line item (listing title + price)
   - Order ID in metadata
   - Success/cancel redirect URLs
4. Buyer is redirected to Stripe's hosted checkout page
5. After payment, Stripe sends a webhook:
   - `checkout.session.completed` → Order marked as paid, status → `awaiting_shipment`
   - `checkout.session.expired` → Order marked as failed

### 9. Order Management (Seller View)
- Shows all orders across the seller's listings
- Each order displays: listing title, artwork, customer info, color, size, amount, payment status
- Orders sorted by creation date (newest first)

### 10. Dark/Light Mode
- Toggle in the header using `next-themes`
- Persists preference in localStorage
- Custom color palette using oklch color space for both modes
- Purple-tinted accent colors for a premium feel

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| `ALL` | `/api/auth/*` | — | Better Auth handles login/signup/session |
| `GET` | `/api/product/all` | ✅ | Get all products (catalog + featured) |
| `GET` | `/api/product/:id` | ✅ | Get product template + colors for editor |
| `POST` | `/api/listing/create` | ✅ | Create a new listing |
| `GET` | `/api/listing/user` | ✅ | Get current user's listings |
| `GET` | `/api/listing/:slug` | — | Get public listing by slug |
| `GET` | `/api/listing/mockup/:slug/:color.jpg` | — | Get dynamic mockup image URL |
| `POST` | `/api/listing/artwork/generate` | ✅ | Generate AI artwork from prompt |
| `POST` | `/api/order/create` | — | Create order + Stripe checkout session |
| `GET` | `/api/order/user` | ✅ | Get seller's received orders |
| `POST` | `/api/webhook/stripe` | — | Stripe payment webhook (raw body) |

---

## 🔐 Security Measures

- **Session-based auth** with HTTP-only cookies (not JWT — immune to XSS token theft)
- **CORS** restricted to frontend origin only
- **Zod validation** on all API inputs (prevents injection/malformed data)
- **bcrypt** password hashing (never stored in plain text)
- **Stripe webhook signature verification** (prevents spoofed payment events)
- **Auth middleware** on all protected routes
- **10MB request body limit** (prevents abuse)

---

## 🌐 External Services & API Keys

| Service | Purpose | Cost |
|---------|---------|------|
| **Neon PostgreSQL** | Database hosting | Free tier available |
| **Cloudinary** | Image hosting + transformations | Free tier (25 credits/month) |
| **Pollinations.ai** | AI text + image generation | **Free, no API key** |
| **remove.bg** | Background removal | Free tier (50 calls/month) |
| **Stripe** | Payment processing | 2.9% + $0.30 per transaction |
| **Google OAuth** | Social login | Free |
