<div align="center">

# Finsight — Expense Tracker Dashboard

**A full-stack personal finance dashboard built as a portfolio project.**

Track income, manage budgets, and visualise your spending — with real-time insights that actually make sense.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat&logo=nodedotjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss)

</div>

---

## What is Finsight?

Finsight is a personal expense tracker dashboard that lets users:

- Log income and expenses with categories
- Set monthly budgets per category and track spending against them
- Visualise spending trends through interactive charts
- Get rule-based AI insights — spending spikes, budget warnings, savings summaries
- View historical performance across 6 months, 12 months, or full year

The UI is inspired by Parker's editorial design language — cream/off-white background, black navigation, Playfair Display serif headings, Cormorant Garamond for numbers, and DM Sans for body text.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework with hooks |
| **TypeScript** | Full type safety across all components |
| **Vite** | Fast dev server and build tool |
| **Tailwind CSS** | Utility-first styling with custom design tokens |
| **React Router v6** | Client-side routing with protected routes |
| **Recharts** | Bar charts and donut charts for analytics |
| **Axios** | HTTP client with JWT interceptor and 401 handling |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **TypeScript** | Typed controllers, services, and middleware |
| **PostgreSQL** | Primary relational database |
| **Prisma ORM** | Type-safe database queries and migrations |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **bcryptjs** | Password hashing (12 salt rounds) |
| **Google OAuth** | Social sign-in via passport-google-oauth20 |
| **express-validator** | Request body validation |

---

## Project Structure

```
Expense-Tracker-Dashboard/
│
├── finsight-frontend/              React + TypeScript app
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts           Axios instance — JWT interceptor + 401 redirect
│   │   │   └── index.ts            All API service functions
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   ├── OverviewBarChart.tsx      Income vs expenses (Recharts)
│   │   │   │   └── CategoryDonutChart.tsx    Spending by category (Recharts)
│   │   │   ├── forms/
│   │   │   │   ├── TransactionModal.tsx      Add/edit transaction
│   │   │   │   └── BudgetModal.tsx           Create/edit budget
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.tsx             Topbar + footer shell
│   │   │   │   ├── Topbar.tsx                Nav + avatar dropdown
│   │   │   │   └── ProtectedRoute.tsx        Auth guard
│   │   │   └── ui/
│   │   │       └── index.tsx                 SummaryCard, Modal, ConfirmDialog, Spinner, etc.
│   │   ├── context/
│   │   │   ├── AuthContext.tsx               User state, login/logout, localStorage
│   │   │   └── ToastContext.tsx              Global toast notifications
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx             Summary cards, charts, insights
│   │   │   ├── TransactionsPage.tsx          CRUD, search, filters, pagination
│   │   │   ├── BudgetsPage.tsx               Category budgets with progress bars
│   │   │   ├── AnalyticsPage.tsx             YTD summary, trends, category breakdown
│   │   │   └── ProfileSettingsPages.tsx      Profile edit, password, settings
│   │   ├── types/index.ts                    All TypeScript interfaces
│   │   └── utils/index.ts                    formatCurrency, formatDate, extractApiError
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── finsight-backend/               Node.js + Express API
    ├── src/
    │   ├── controllers/            Parse request → call service → return response
    │   │   ├── auth.controller.ts
    │   │   ├── transaction.controller.ts
    │   │   ├── budget.controller.ts
    │   │   ├── analytics.controller.ts
    │   │   └── category.controller.ts
    │   ├── services/               All business logic and database queries
    │   │   ├── auth.service.ts
    │   │   ├── transaction.service.ts
    │   │   ├── budget.service.ts
    │   │   └── analytics.service.ts
    │   ├── routes/                 Express routers with validation rules
    │   │   ├── auth.routes.ts
    │   │   ├── transaction.routes.ts
    │   │   ├── budget.routes.ts
    │   │   ├── analytics.routes.ts
    │   │   └── category.routes.ts
    │   ├── middleware/
    │   │   ├── auth.ts             JWT bearer token guard
    │   │   ├── validate.ts         express-validator error handler
    │   │   └── errorHandler.ts     Global Express error handler
    │   ├── utils/
    │   │   ├── prisma.ts           Prisma client singleton
    │   │   ├── jwt.ts              signToken / verifyToken
    │   │   └── response.ts         ok / created / badRequest / notFound helpers
    │   └── index.ts                Express app entry point
    ├── prisma/
    │   ├── schema.prisma           Database schema (4 tables)
    │   └── seed.ts                 11 default categories seeder
    ├── package.json
    ├── tsconfig.json
    └── .env.example
```

---

## Database Schema

```prisma
model User {
  id           String        @id @default(cuid())
  email        String        @unique
  name         String
  passwordHash String?
  googleId     String?       @unique
  currency     String        @default("INR")
  transactions Transaction[]
  budgets      Budget[]
}

model Category {
  id    String  @id @default(cuid())
  name  String  @unique
  icon  String
  color String
}

model Transaction {
  id          String          @id @default(cuid())
  userId      String
  categoryId  String
  type        TransactionType  // INCOME | EXPENSE
  amount      Decimal
  description String
  date        DateTime
}

model Budget {
  id         String  @id @default(cuid())
  userId     String
  categoryId String
  amount     Decimal
  month      Int
  year       Int
  @@unique([userId, categoryId, month, year])
}
```

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ✗ | Create account |
| POST | `/login` | ✗ | Login → returns JWT |
| POST | `/google` | ✗ | Google OAuth login |
| GET | `/me` | ✓ | Get current user |
| PATCH | `/profile` | ✓ | Update name / currency |
| PATCH | `/change-password` | ✓ | Change password |
| DELETE | `/account` | ✓ | Delete account + all data |

### Transactions — `/api/transactions`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List with pagination, search, type/category/date filters |
| GET | `/:id` | Single transaction |
| POST | `/` | Create transaction |
| PATCH | `/:id` | Update transaction |
| DELETE | `/:id` | Delete transaction |

### Budgets — `/api/budgets`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List budgets with real spent amounts calculated |
| POST | `/` | Create or upsert budget for a month |
| PATCH | `/:id` | Update budget limit |
| DELETE | `/:id` | Delete budget |

### Analytics — `/api/analytics`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Summary cards + category breakdown + recent transactions |
| GET | `/trend` | Monthly income/expense/savings (last N months) |
| GET | `/insights` | Rule-based AI insights array |
| GET | `/yearly` | Full year totals + category breakdown |

### Categories — `/api/categories`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all 11 default categories |

---

## How It Works

### Authentication Flow
1. User registers or logs in → backend hashes password with bcrypt (12 rounds)
2. Server signs a JWT with `userId` and `email`
3. Frontend stores the token in `localStorage`
4. Axios interceptor attaches `Authorization: Bearer <token>` to every request
5. On 401 response, interceptor clears storage and redirects to `/login`
6. `ProtectedRoute` component checks `AuthContext` — unauthenticated users are redirected to `/login`

### Dashboard Data Flow
```
DashboardPage mounts
  → analyticsApi.dashboard(month, year)   ← GET /api/analytics/dashboard
  → analyticsApi.trend(6)                 ← GET /api/analytics/trend?months=6
  → analyticsApi.insights()              ← GET /api/analytics/insights
        ↓
Backend queries PostgreSQL via Prisma
  → Groups transactions by type for summary totals
  → Calculates deltas vs previous month
  → Groups expenses by category for breakdown
  → Compares spending vs budgets
  → Generates rule-based insights
        ↓
Frontend renders real numbers, charts, and insights
```

### AI Insights Logic (Rule-Based)
The insights engine runs three checks on every request:
1. **Spending spike** — compares top spending category this month vs last month. Alerts if up >0%
2. **Budget warnings** — flags any category at ≥90% of its limit (error) or ≥70% (info)
3. **Savings summary** — positive or negative monthly savings with context message

---

## Features

| Feature | Details |
|---|---|
| **Authentication** | JWT + bcrypt, Google OAuth, auto-rehydrate from localStorage |
| **Dashboard** | Live summary cards with month-over-month deltas, 6M/12M bar chart, category donut, recent transactions, AI insights |
| **Transactions** | Full CRUD, search by description, filter by type/category/date range, pagination (20/page) |
| **Budgets** | Per-category monthly limits, real spending pulled from transactions, progress bars, status indicators |
| **Analytics** | YTD summary, full trend chart, category breakdown with horizontal bars, monthly savings spark chart, historical stats |
| **Profile** | Edit name/currency, change password, delete account |
| **Settings** | Notification toggles, display preferences (currency, date format), CSV export, Google unlink |
| **Design** | Parker-inspired cream/ink editorial aesthetic, Cormorant Garamond numbers, Playfair Display headings, DM Sans body |
| **Zero mock data** | Every number is a real database query — no hardcoded values anywhere |

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 1. Clone the repo
```bash
git clone https://github.com/ab7-dev/Expense-Tracker-Dashboard.git
cd Expense-Tracker-Dashboard
```

### 2. Set up the backend
```bash
cd finsight-backend
npm install

# Copy and fill in your environment variables
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/finsight"
JWT_SECRET="your_long_random_secret_here"
JWT_EXPIRES_IN="7d"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:4000/api/auth/google/callback"
PORT=4000
CLIENT_URL="http://localhost:5173"
```

```bash
# Create the database
createdb finsight

# Run migrations (creates all 4 tables)
npm run db:migrate

# Seed default categories
npm run db:seed

# Start the dev server
npm run dev
# → API running at http://localhost:4000
```

### 3. Set up the frontend
```bash
cd ../finsight-frontend
npm install
npm run dev
# → App running at http://localhost:5173
```

### 4. Open the app
Visit **http://localhost:5173** — register an account and start tracking.

---

## Design System

| Element | Font |
|---|---|
| Page titles, card titles, logo | Playfair Display (serif) |
| All numbers — amounts, percentages, stats | Cormorant Garamond (old-style serif) |
| Body text, labels, nav, buttons | DM Sans (geometric sans-serif) |

| Colour | Usage |
|---|---|
| `#f5f2ec` cream | Page background |
| `#0e0e0c` ink | Navigation, headings, buttons |
| `#1a6e3c` green | Income, positive values, success |
| `#c0382b` red | Expenses, negative values, errors |
| `#1a4d8f` blue | Balance, analytics, info states |
| `#8f5a1a` amber | Budget tracking, warnings |

---

## Architecture Decisions

- **3-layer backend** — Routes → Controllers → Services → Prisma. Each layer has one responsibility.
- **No mock data** — the frontend calls real API endpoints; the backend queries real PostgreSQL tables.
- **Owner checks** — every update and delete operation first verifies `userId` matches before touching data.
- **Fail-fast JWT** — server throws at startup if `JWT_SECRET` is not set.
- **Idempotent seed** — `prisma db seed` uses upsert so it's safe to run multiple times.
- **Decimal precision** — transaction amounts stored as `Decimal(12,2)` in PostgreSQL for financial accuracy.

---

## License

MIT © 2026 ab7-dev
