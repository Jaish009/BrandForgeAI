# BrandForge AI — Workflow Diagrams

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph Frontend["🖥️ Frontend (React + Vite)"]
        UI["Pages: Home, Design, Listings, Orders"]
        Canvas["Fabric.js Canvas Editor"]
        RQ["React Query (Data Fetching)"]
    end

    subgraph Backend["⚙️ Backend (Express + TypeScript)"]
        Auth["Better Auth (Sessions)"]
        API["REST API Controllers"]
        Services["Business Logic Services"]
        Webhook["Stripe Webhook Handler"]
    end

    subgraph Database["🗄️ Database"]
        Neon["Neon PostgreSQL"]
        Prisma["Prisma ORM"]
    end

    subgraph External["☁️ External Services"]
        Pollinations["Pollinations.ai (AI Generation)"]
        Cloudinary["Cloudinary (Images + Mockups)"]
        RemoveBG["remove.bg (Background Removal)"]
        Stripe["Stripe (Payments)"]
        Google["Google OAuth"]
    end

    UI --> RQ
    RQ -->|HTTP + Cookies| API
    Canvas -->|Artwork Data URL| API
    API --> Auth
    API --> Services
    Services --> Prisma
    Prisma --> Neon
    Services -->|Text + Image| Pollinations
    Services -->|Upload + Transform| Cloudinary
    Services -->|Remove BG| RemoveBG
    Services -->|Checkout Session| Stripe
    Stripe -->|Payment Events| Webhook
    Webhook --> Prisma
    Auth -->|OAuth| Google
```

---

## 2. AI Artwork Generation Pipeline

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend API
    participant Poll_T as Pollinations Text API
    participant Poll_I as Pollinations Image API
    participant CL as Cloudinary
    participant RBG as remove.bg

    User->>FE: Types "stay wild" in AI Art Studio
    FE->>BE: POST /api/listing/artwork/generate
    
    Note over BE: Step 1: Refine Prompt
    BE->>Poll_T: Send user prompt + system prompt
    Poll_T-->>BE: Refined art direction prompt
    
    Note over BE: Step 2: Generate Image
    BE->>Poll_I: GET /prompt/{refined_prompt}?model=flux
    Poll_I-->>BE: 1024x1024 PNG image buffer
    
    Note over BE: Step 3: Upload Raw Image
    BE->>CL: Upload base64 image
    CL-->>BE: Secure URL of raw image
    
    Note over BE: Step 4: Remove Background
    BE->>RBG: POST image_url to removebg
    RBG-->>BE: Transparent PNG buffer
    
    Note over BE: Step 5: Upload Final Image
    BE->>CL: Upload transparent PNG
    CL-->>BE: Final artwork URL
    
    BE-->>FE: { artworkUrl: "https://..." }
    FE->>FE: Place image on Fabric.js canvas
    User->>User: Drag, resize, position artwork
```

---

## 3. Listing Creation Flow

```mermaid
flowchart TD
    A["Seller opens Design Editor"] --> B["Chooses product (T-Shirt/Mug/Cap...)"]
    B --> C["Adds artwork to canvas"]
    
    C --> C1["Option 1: AI Art Studio"]
    C --> C2["Option 2: Upload Image"]
    C --> C3["Option 3: Add Text"]
    C --> C4["Option 4: Quick Artwork Preset"]
    
    C1 --> D["Position artwork on printable area"]
    C2 --> D
    C3 --> D
    C4 --> D
    
    D --> E["Select color variants (up to 4)"]
    E --> F["Set selling price (>= base price)"]
    F --> G["Enter title + description"]
    G --> H["Click 'Create Product'"]
    
    H --> I["Canvas captures artwork as PNG data URL"]
    I --> J["POST /api/listing/create"]
    
    J --> K["Backend validates with Zod"]
    K --> L["Upload artwork to Cloudinary"]
    L --> M["Generate URL slug (title + timestamp)"]
    M --> N["Create Listing in PostgreSQL"]
    N --> O["Link selected colors via ListingColor table"]
    O --> P["Redirect to Listings page ✅"]
```

---

## 4. Buyer Purchase & Checkout Flow

```mermaid
sequenceDiagram
    actor Buyer
    participant LP as Listing Page
    participant BE as Backend
    participant CL as Cloudinary
    participant ST as Stripe

    Buyer->>LP: Opens /listing/{slug}
    LP->>BE: GET /api/listing/{slug}
    BE-->>LP: Listing data + colors
    
    LP->>BE: GET /api/listing/mockup/{slug}/{color}.jpg
    BE->>CL: Build transformation URL
    Note over CL: Overlays artwork on<br/>colored product mockup
    CL-->>LP: Rendered mockup image
    
    Buyer->>LP: Selects color + size
    Buyer->>LP: Clicks "Buy Now"
    LP->>LP: Opens checkout dialog
    
    Buyer->>LP: Fills name, email, shipping address
    Buyer->>LP: Clicks "Place Order"
    
    LP->>BE: POST /api/order/create
    BE->>BE: Create Order (pending, unpaid)
    BE->>ST: Create Checkout Session
    ST-->>BE: Checkout URL
    BE-->>LP: { url: "https://checkout.stripe.com/..." }
    
    LP->>Buyer: Redirect to Stripe Checkout
    Buyer->>ST: Enters card details & pays
    ST-->>Buyer: Redirect to /thank-you
```

---

## 5. Stripe Payment Webhook Flow

```mermaid
flowchart TD
    A["Stripe sends POST /api/webhook/stripe"] --> B["Verify webhook signature"]
    B -->|Invalid| C["Return 400 Bad Request"]
    B -->|Valid| D{"Event Type?"}
    
    D -->|checkout.session.completed| E["Extract orderId from metadata"]
    E --> F["Update Order: isPaid=true, status=awaiting_shipment"]
    F --> G["Return 200 OK ✅"]
    
    D -->|checkout.session.expired| H["Extract orderId from metadata"]
    H --> I["Update Order: isPaid=false, status=failed"]
    I --> G
    
    D -->|Other events| J["Log and ignore"]
    J --> G
```

---

## 6. Dynamic Mockup Generation (Cloudinary)

```mermaid
flowchart LR
    A["Request: /mockup/cool-tiger/black.jpg"] --> B["Find listing by slug"]
    B --> C["Find color by name"]
    C --> D["Get printable area coordinates"]
    
    D --> E["Build Cloudinary URL"]
    
    subgraph CloudinaryTransform["Cloudinary Transformation Pipeline"]
        F["1. Fetch base mockup image (colored product)"]
        G["2. Overlay artwork (public_id)"]
        H["3. Resize artwork to printable area (width × height)"]
        I["4. Position at (x, y) from top-left"]
        J["5. Output as JPG quality 90"]
    end
    
    E --> F --> G --> H --> I --> J
    J --> K["Return rendered mockup URL"]
```

---

## 7. Complete User Journey (End-to-End)

```mermaid
flowchart TD
    START(("🚀 Start")) --> REG["Sign Up / Sign In"]
    REG --> HOME["Homepage: Browse Product Catalog"]
    
    HOME --> SELECT["Select Product Type"]
    SELECT --> EDITOR["Open Design Editor"]
    
    EDITOR --> ART{"Add Artwork"}
    ART -->|AI| AI["Type prompt → AI generates art"]
    ART -->|Upload| UPLOAD["Upload custom image"]
    ART -->|Text| TEXT["Add custom text"]
    ART -->|Preset| PRESET["Pick from 10 presets"]
    
    AI --> CANVAS["Position on canvas"]
    UPLOAD --> CANVAS
    TEXT --> CANVAS
    PRESET --> CANVAS
    
    CANVAS --> COLORS["Select color variants"]
    COLORS --> PRICE["Set selling price"]
    PRICE --> DETAILS["Enter title + description"]
    DETAILS --> PUBLISH["Publish Listing"]
    
    PUBLISH --> SHARE["Share listing URL"]
    SHARE --> BUYER(("👤 Buyer visits link"))
    
    BUYER --> VIEW["View product mockup"]
    VIEW --> PICK["Select color + size"]
    PICK --> CHECKOUT["Fill shipping + checkout"]
    CHECKOUT --> PAY["Pay via Stripe"]
    PAY --> CONFIRM["Order confirmed ✅"]
    
    CONFIRM --> SELLER["Seller sees order in dashboard"]
    SELLER --> SHIP["Ship product"]
    SHIP --> DONE(("✅ Complete"))
```
