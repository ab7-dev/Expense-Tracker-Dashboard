# Finsight — Backend API

Node.js · Express · TypeScript · PostgreSQL · Prisma ORM · JWT Auth

---

## Quick start

### 1. Prerequisites

- Node.js 18+
- PostgreSQL running locally (or any hosted Postgres)

### 2. Install dependencies

```bash
cd finsight-backend
npm install
```

### 3. Set up environment

```bash
cp .env.example .env
# Edit .env — fill in DATABASE_URL and JWT_SECRET at minimum
```

### 4. Create the database

```bash
# In psql or any Postgres client:
CREATE DATABASE finsight;
```

### 5. Run migrations and seed categories

```bash
npm run db:migrate   # Creates all tables
npm run db:seed      # Inserts 11 default categories
```

### 6. Start the dev server

```bash
npm run dev
# API running at http://localhost:4000
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Path                  | Auth | Description           |
|--------|-----------------------|------|-----------------------|
| POST   | `/register`           | ✗    | Create account        |
| POST   | `/login`              | ✗    | Login → JWT token     |
| POST   | `/google`             | ✗    | Google OAuth login    |
| GET    | `/me`                 | ✓    | Current user          |
| PATCH  | `/profile`            | ✓    | Update name/currency  |
| PATCH  | `/change-password`    | ✓    | Change password       |
| DELETE | `/account`            | ✓    | Delete account        |

### Transactions — `/api/transactions`

| Method | Path    | Description                                      |
|--------|---------|--------------------------------------------------|
| GET    | `/`     | List (paginated, filterable by type/category/date/search) |
| GET    | `/:id`  | Single transaction                               |
| POST   | `/`     | Create transaction                               |
| PATCH  | `/:id`  | Update transaction                               |
| DELETE | `/:id`  | Delete transaction                               |

**Query params for GET /:** `page`, `limit`, `type`, `categoryId`, `from`, `to`, `search`

### Budgets — `/api/budgets`

| Method | Path    | Description                         |
|--------|---------|-------------------------------------|
| GET    | `/`     | List budgets with real spent amounts |
| POST   | `/`     | Create/upsert budget for a month    |
| PATCH  | `/:id`  | Update budget limit                 |
| DELETE | `/:id`  | Delete budget                       |

**Query params for GET /:** `month`, `year`

### Analytics — `/api/analytics`

| Method | Path          | Description                                      |
|--------|---------------|--------------------------------------------------|
| GET    | `/dashboard`  | Summary cards + category breakdown + recent tx   |
| GET    | `/trend`      | Monthly income/expense/savings (last N months)   |
| GET    | `/insights`   | Rule-based AI insights array                     |
| GET    | `/yearly`     | Full year totals + category breakdown            |

### Categories — `/api/categories`

| Method | Path | Description          |
|--------|------|----------------------|
| GET    | `/`  | List all categories  |

---

## Request / Response format

All responses follow:
```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "...", "errors": [...] }
```

Auth header for protected routes:
```
Authorization: Bearer <token>
```

---

## Database schema

```
users         id, email, name, passwordHash, googleId, currency
categories    id, name, icon, color
transactions  id, userId, categoryId, type, amount, description, date
budgets       id, userId, categoryId, amount, month, year
```

---

## Project structure

```
src/
├── controllers/     Request handlers (auth, transaction, budget, analytics, category)
├── routes/          Express routers with validation rules
├── middleware/       JWT auth guard, validation runner, error handler
├── utils/           Prisma client singleton, JWT helpers, response helpers
prisma/
├── schema.prisma    Database schema
└── seed.ts          Default categories seeder
```
