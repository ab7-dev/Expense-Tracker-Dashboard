import api from "./client";
import type {
  User, Category, Transaction, PaginatedTransactions,
  TransactionFilters, Budget, DashboardSummary,
  MonthlyTrend, Insight, YearlySummary,
} from "../types";

/* ── helpers ─────────────────────────────────────────── */
function data<T>(res: { data: { data: T } }): T {
  return res.data.data;
}

/* ── Auth ────────────────────────────────────────────── */
export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    api.post<{ data: { user: User; token: string } }>("/auth/register", body).then(data),

  login: (body: { email: string; password: string }) =>
    api.post<{ data: { user: User; token: string } }>("/auth/login", body).then(data),

  google: (body: { googleId: string; email: string; name: string }) =>
    api.post<{ data: { user: User; token: string } }>("/auth/google", body).then(data),

  me: () =>
    api.get<{ data: User }>("/auth/me").then(data),

  updateProfile: (body: { name?: string; currency?: string }) =>
    api.patch<{ data: User }>("/auth/profile", body).then(data),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    api.patch("/auth/change-password", body).then(data),

  deleteAccount: () =>
    api.delete("/auth/account").then(data),
};

/* ── Categories ──────────────────────────────────────── */
export const categoriesApi = {
  list: () =>
    api.get<{ data: Category[] }>("/categories").then(data),
};

/* ── Transactions ────────────────────────────────────── */
export const transactionsApi = {
  list: (filters: TransactionFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page)       params.set("page",       String(filters.page));
    if (filters.limit)      params.set("limit",      String(filters.limit));
    if (filters.type)       params.set("type",       filters.type);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.from)       params.set("from",       filters.from);
    if (filters.to)         params.set("to",         filters.to);
    if (filters.search)     params.set("search",     filters.search);
    return api
      .get<{ data: PaginatedTransactions }>(`/transactions?${params}`)
      .then(data);
  },

  get: (id: string) =>
    api.get<{ data: Transaction }>(`/transactions/${id}`).then(data),

  create: (body: {
    type: string; amount: number; description: string;
    categoryId: string; date: string;
  }) =>
    api.post<{ data: Transaction }>("/transactions", body).then(data),

  update: (id: string, body: Partial<{
    type: string; amount: number; description: string;
    categoryId: string; date: string;
  }>) =>
    api.patch<{ data: Transaction }>(`/transactions/${id}`, body).then(data),

  delete: (id: string) =>
    api.delete(`/transactions/${id}`),
};

/* ── Budgets ─────────────────────────────────────────── */
export const budgetsApi = {
  list: (month?: number, year?: number) => {
    const params = new URLSearchParams();
    if (month) params.set("month", String(month));
    if (year)  params.set("year",  String(year));
    return api.get<{ data: Budget[] }>(`/budgets?${params}`).then(data);
  },

  create: (body: { categoryId: string; amount: number; month: number; year: number }) =>
    api.post<{ data: Budget }>("/budgets", body).then(data),

  update: (id: string, amount: number) =>
    api.patch<{ data: Budget }>(`/budgets/${id}`, { amount }).then(data),

  delete: (id: string) =>
    api.delete(`/budgets/${id}`),
};

/* ── Analytics ───────────────────────────────────────── */
export const analyticsApi = {
  dashboard: (month?: number, year?: number) => {
    const params = new URLSearchParams();
    if (month) params.set("month", String(month));
    if (year)  params.set("year",  String(year));
    return api
      .get<{ data: DashboardSummary }>(`/analytics/dashboard?${params}`)
      .then(data);
  },

  trend: (months = 6) =>
    api
      .get<{ data: MonthlyTrend }>(`/analytics/trend?months=${months}`)
      .then(data),

  insights: () =>
    api.get<{ data: Insight[] }>("/analytics/insights").then(data),

  yearly: (year?: number) => {
    const params = year ? `?year=${year}` : "";
    return api
      .get<{ data: YearlySummary }>(`/analytics/yearly${params}`)
      .then(data);
  },
};
