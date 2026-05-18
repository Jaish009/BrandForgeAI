# 🎨 BrandForge AI – Next-Gen AI-Powered Print-on-Demand Platform

BrandForge AI is a premium, full-stack **AI-Powered Print-on-Demand (POD) SaaS platform** that enables users to generate stunning AI artwork, design custom products in real time with an interactive canvas editor, generate high-quality dynamic product mockups, and securely checkout via Stripe.

Built using the modern MERN stack (**React 19, TypeScript, Express, PostgreSQL, Prisma, Tailwind CSS**), this platform is fully production-ready, highly optimized, and completely open source under your own brand!

---

## 🌟 Key Features

* 🔐 **Secure Authentication**: Built-in Email/Password & Google OAuth session-based authentication using **Better Auth** (HTTP-only cookies).
* 🤖 **AI Artwork Generator**: Automated 5-step pipeline utilizing **Pollinations.ai (Flux Model)** to generate high-resolution art from prompts, with integrated automatic background removal via the **remove.bg** API.
* 🎨 **Interactive Design Editor**: A robust **Fabric.js Canvas** allowing users to drag, resize, rotate, edit text, customize fonts, add presets, and view printable-area boundary markers.
* 🖼️ **Dynamic Cloudinary Mockups**: Generates premium product mockup visuals on-the-fly using advanced **Cloudinary** overlay transformations based on selected color and coordinates.
* 💳 **Full Checkout & Webhooks**: Integrated **Stripe Checkout** flow to handle secure transactions, with automated order processing powered by Stripe Webhooks.
* 📦 **Order & Listing Management**: Full-featured dashboards for sellers to create, view, share listings, and manage incoming orders.
* 🌓 **Dark & Light Modes**: Premium user experience with smooth transitions and an HSL-tailored dark theme.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI + shadcn/ui
- **Canvas Processing**: Fabric.js v7.2
- **State Management**: TanStack React Query v5
- **Routing**: React Router DOM v7

### Backend
- **Server**: Node.js + Express + TypeScript
- **Database**: Serverless PostgreSQL via **Neon**
- **ORM**: Prisma ORM
- **Authentication**: Better Auth
- **Payments**: Stripe SDK & Webhooks
- **Cloud Storage**: Cloudinary SDK

---

## 🚀 Getting Started

### 1. Clone & Setup Workspace
```bash
git clone https://github.com/Jaish009/BrandForgeAI.git
cd BrandForgeAI
```

### 2. Configure Environment Variables

#### Backend (`backend/.env`)
Create a `.env` file in the `backend/` folder and add the following keys:
```env
PORT=8000
DATABASE_URL="your-postgresql-neon-database-url"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-better-auth-secret-key"
BETTER_AUTH_URL="http://localhost:8000"

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Remove.bg
REMOVE_BG_API_KEY="your-remove-bg-api-key"

# Client URL
CLIENT_URL="http://localhost:5173"
```

#### Frontend (`client/.env`)
Create a `.env` file in the `client/` folder:
```env
VITE_API_URL="http://localhost:8000"
```

### 3. Install Dependencies & Run

#### Run the Backend
```bash
cd backend
npm install
npx prisma db push
npm run dev
```

#### Run the Frontend
```bash
cd client
npm install
npm run dev
```

---

## 📜 License

This project is fully open source and licensed under the **MIT License**. You are completely free to use, modify, distribute, and monetize this project for SaaS, personal, client, or production applications with absolutely no restrictions.
