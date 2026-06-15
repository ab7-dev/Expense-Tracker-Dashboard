# Finsight — Frontend

React 18 · TypeScript · Vite · Tailwind CSS · Recharts · React Router v6

---

## Quick start

### 1. Prerequisites
- Node.js 18+
- Finsight backend running on `http://localhost:4000`

### 2. Install & run

```bash
cd finsight-frontend
npm install
npm run dev
# App at http://localhost:5173
```

### 3. Environment
No `.env` needed — Vite proxies `/api` to `http://localhost:4000` automatically.

---

## Project structure

```
src/
├── api/
│   ├── client.ts          Axios instance — JWT interceptor + 401 redirect
│   └── index.ts           All API service functions (auth, transactions, budgets, analytics, categories)
├── components/
│   ├── charts/
│   │   ├── OverviewBarChart.tsx    Income vs expenses bar chart (Recharts)
│   │   └── CategoryDonutChart.tsx  Spending breakdown pie chart (Recharts)
│   ├── forms/
│   │   ├── TransactionModal.tsx    Add/edit transaction modal
│   │   └── BudgetModal.tsx         Create/edit budget modal
│   ├── layout/
│   │   ├── AppLayout.tsx           Topbar + footer wrapper for all auth pages
│   │   ├── Topbar.tsx              Nav links + avatar dropdown (profile/settings/logout)
│   │   └── ProtectedRoute.tsx      Redirects unauthenticated users to /login
│   └── ui/
│       └── index.tsx               SummaryCard, Modal, ConfirmDialog, Spinner, EmptyState, FormField
├── context/
│   ├── AuthContext.tsx     User state, login/register/logout, localStorage persistence
│   └── ToastContext.tsx    Global toast notifications (success/error/info)
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx         Summary cards + bar chart + insights — all live API data
│   ├── TransactionsPage.tsx      Full CRUD: search, filter by type/category/date, pagination
│   ├── BudgetsPage.tsx           Create/edit/delete budgets with real spending progress
│   ├── AnalyticsPage.tsx         YTD summary, trend chart, category breakdown, insights
│   └── ProfileSettingsPages.tsx  Profile edit, password change, delete account, settings toggles
├── types/index.ts          All TypeScript interfaces
└── utils/index.ts          formatCurrency, formatDate, extractApiError, currentMonthYear
```

---

## Features

| Feature | Implementation |
|---|---|
| Login / Register | Real API calls → JWT stored in localStorage |
| Google OAuth | Button wired — configure `GOOGLE_CLIENT_ID` in backend `.env` |
| Auto login | JWT rehydrated from localStorage on every page load |
| 401 handling | Axios interceptor clears token and redirects to `/login` |
| Dashboard | Live summary cards, 6M/12M bar chart, historical stats, category donut, recent transactions, AI insights |
| Transactions | Paginated table, search, filter by type/category/date range, add/edit/delete with modals |
| Budgets | Per-category limits with real spending progress bars, CRUD |
| Analytics | YTD cards, full trend chart, category breakdown, savings spark, all insights |
| Profile | Name, currency, change password — all saved to DB |
| Settings | Notification toggles, display preferences, CSV export, Google unlink |
| Toasts | Global success/error/info feedback on every action |

---

## Tech decisions

- **No mock data** — every number comes from the backend API
- **Cormorant Garamond** for all numbers, **Playfair Display** for headings, **DM Sans** for body
- **Parker-inspired design** — cream background, black nav, editorial serif, clean card layout
- **Recharts** for all charts with real data passed in as props
- **Tailwind CSS** with custom tokens matching the design system
