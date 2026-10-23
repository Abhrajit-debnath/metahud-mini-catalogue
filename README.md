# MetaHUD — Mini Digital Product Catalogue

A full-stack web application built for the **Metahud Full-Stack Developer Technical Assessment**.  
It allows customers to browse products, search by name, filter by category, and view product details, while providing administrators with a secure panel to manage products and toggle availability.

---

## 🛠 Tech Stack

- **Frontend & Backend**: Next.js (App Router, TypeScript)
- **Styling & UI**: Mantine UI (`@mantine/core`, `@mantine/form`) + Tailwind CSS
- **Database**: PostgreSQL (Neon Serverless Postgres)
- **ORM**: Prisma ORM
- **Validation**: Zod
- **Authentication**: JWT stored in `httpOnly` Cookies

---

## ✨ Features

### Part 1: Admin Panel (`/admin`)
- **Secure Login**: Protected with JWT authentication.
- **Product Management**: Add, edit, and delete products (Name, Price, Category, Description, Image URL).
- **1-Click Availability Toggle**: Instantly mark products as "In Stock" or "Unavailable" without editing.
- **Admin Logout**: Clears authentication session cookie.

### Part 2: Customer Catalogue (`/products`)
- **Available Products View**: Only active/available products are shown to customers.
- **Search by Name**: Real-time search by product name and description via backend API.
- **Category Filter**: Filter products by category (Apparel, Accessories, Gear, etc.).
- **Product Details Page (`/products/[id]`)**: Full view showing high-resolution image, price, description, category, and availability badge.

### Part 3: Backend APIs & Database
- `GET /api/products`: Fetch available products (supports `?q=...`, `?category=...`, and `?all=true`).
- `GET /api/products/[id]`: Fetch single product by ID.
- `POST /api/products`: Create a product (Protected, validated with Zod).
- `PUT /api/products/[id]`: Update product details or availability (Protected, validated with Zod).
- `DELETE /api/products/[id]`: Delete a product (Protected).
- `POST /api/auth/login`: Admin authentication route returning JWT.
- `POST /api/auth/logout`: Clears authentication cookie.

---

## 🚀 Quick Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd metahud-mini-catalogue
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
DATABASE_URL="your-postgresql-database-url"
JWT_SECRET="your-jwt-secret-key"
ADMIN_EMAIL="admin@metahud.co"
ADMIN_PASSWORD="metahud123"
```

### 4. Run Database Migration & Seed Data
```bash
# Push schema migrations to PostgreSQL
npx prisma migrate dev

# Seed sample MetaHUD products
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Admin Credentials

To access the Admin Panel at `/admin` or `/admin/login`:
- **Email**: `admin@metahud.co`
- **Password**: `metahud123`

---

## 🏛 Application Architecture & Security Decisions

### Architecture
- **Next.js App Router**: Client components consume backend API routes (`/api/products`), keeping a clean separation between UI and business logic.
- **Prisma Client Singleton**: `lib/prisma.ts` uses a global singleton to prevent database connection exhaustion in serverless/development environments.
- **Backend Search**: Product searches query PostgreSQL directly via Prisma (`contains`, `mode: 'insensitive'`) rather than in-memory filtering.

### Security
1. **HTTP-only Cookies**: The authentication JWT token is stored inside an `httpOnly`, `SameSite` cookie to prevent JavaScript access and protect against Cross-Site Scripting (XSS).
2. **Proxy Middleware Guard (`proxy.ts`)**: 
   - Protects `/admin` routes from unauthorized access, redirecting unauthenticated users to `/admin/login`.
   - Protects all write operations (`POST`, `PUT`, `DELETE`) on `/api/products`, rejecting requests with a `401 Unauthorized` status if the token is missing.
3. **Input Validation**: All mutation requests are validated using **Zod** (`schema/product.schema.ts`) before touching the database to prevent invalid or malicious data.
