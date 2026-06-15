export interface User {
  id:        string;
  email:     string;
  name:      string;
  currency:  string;
  googleId?: string | null;
  createdAt: string;
}

export interface Category {
  id:    string;
  name:  string;
  icon:  string;
  color: string;
}

export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  id:          string;
  userId:      string;
  categoryId:  string;
  category:    Category;
  type:        TransactionType;
  amount:      number;
  description: string;
  date:        string;
  createdAt:   string;
}

export interface TransactionFilters {
  page?:       number;
  limit?:      number;
  type?:       TransactionType | "";
  categoryId?: string;
  from?:       string;
  to?:         string;
  search?:     string;
}

export interface PaginatedTransactions {
  items:      Transaction[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface Budget {
  id:         string;
  userId:     string;
  categoryId: string;
  category:   Category;
  amount:     number;
  month:      number;
  year:       number;
  spent:      number;
  remaining:  number;
  pct:        number;
}

export interface DashboardSummary {
  period: { month: number; year: number };
  summary: {
    income:          number;
    incomeDelta:     number | null;
    expenses:        number;
    expensesDelta:   number | null;
    balance:         number;
    balanceDelta:    number | null;
    budgetPct:       number | null;
    totalBudget:     number;
    budgetRemaining: number;
  };
  categoryBreakdown:  { category: Category; amount: number; pct: number }[];
  recentTransactions: Transaction[];
}

export interface TrendRow {
  month:    number;
  year:     number;
  label:    string;
  income:   number;
  expenses: number;
  savings:  number;
}

export interface MonthlyTrend {
  trend: TrendRow[];
  historical: {
    bestMonth:    { label: string; year: number; savings: number };
    worstMonth:   { label: string; year: number; expenses: number };
    avgSpend:     number;
    avgSavings:   number;
    savingStreak: number;
  } | null;
}

export interface Insight {
  type:  "warn" | "good" | "info";
  title: string;
  body:  string;
}

export interface YearlySummary {
  year:        number;
  income:      number;
  expenses:    number;
  savings:     number;
  savingsRate: number;
  categoryBreakdown: { category: Category; amount: number; pct: number }[];
}
