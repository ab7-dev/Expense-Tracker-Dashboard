import prisma from "../utils/prisma";

export interface CreateBudgetInput {
  categoryId: string;
  amount:     number;
  month:      number;
  year:       number;
}

const BUDGET_INCLUDE = {
  category: { select: { id: true, name: true, icon: true, color: true } },
};

export async function listBudgets(userId: string, month: number, year: number) {
  const from = new Date(year, month - 1, 1);
  const to   = new Date(year, month,     1);

  const [budgets, spending] = await Promise.all([
    prisma.budget.findMany({
      where:   { userId, month, year },
      include: BUDGET_INCLUDE,
      orderBy: { category: { name: "asc" } },
    }),
    prisma.transaction.groupBy({
      by:    ["categoryId"],
      where: { userId, type: "EXPENSE", date: { gte: from, lt: to } },
      _sum:  { amount: true },
    }),
  ]);

  const spendMap = new Map<string, number>(
    spending.map((s: { categoryId: string; _sum: { amount: unknown } }) => [
      s.categoryId,
      Number(s._sum.amount ?? 0),
    ])
  );

  return budgets.map((b: { id: string; categoryId: string; amount: unknown; month: number; year: number; userId: string; createdAt: Date; updatedAt: Date; category: unknown }) => {
    const spent     = spendMap.get(b.categoryId) ?? 0;
    const limit     = Number(b.amount);
    const remaining = limit - spent;
    const pct       = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    return { ...b, spent, remaining, pct };
  });
}

export async function createBudget(userId: string, input: CreateBudgetInput) {
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) throw new Error("INVALID_CATEGORY");

  return prisma.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId,
        categoryId: input.categoryId,
        month:      input.month,
        year:       input.year,
      },
    },
    update: { amount: input.amount },
    create: {
      userId,
      categoryId: input.categoryId,
      amount:     input.amount,
      month:      input.month,
      year:       input.year,
    },
    include: BUDGET_INCLUDE,
  });
}

export async function updateBudget(userId: string, id: string, amount: number) {
  const existing = await prisma.budget.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("NOT_FOUND");
  return prisma.budget.update({
    where:   { id },
    data:    { amount },
    include: BUDGET_INCLUDE,
  });
}

export async function deleteBudget(userId: string, id: string) {
  const existing = await prisma.budget.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("NOT_FOUND");
  await prisma.budget.delete({ where: { id } });
}
