import prisma from "../utils/prisma";

export type TransactionType = "INCOME" | "EXPENSE";

export interface CreateTxInput {
  categoryId:  string;
  type:        TransactionType;
  amount:      number;
  description: string;
  date:        string;
}

export type UpdateTxInput = Partial<CreateTxInput>;

export interface TxFilters {
  type?:       TransactionType;
  categoryId?: string;
  from?:       string;
  to?:         string;
  search?:     string;
  page?:       number;
  limit?:      number;
}

const TX_INCLUDE = {
  category: { select: { id: true, name: true, icon: true, color: true } },
};

export async function listTransactions(userId: string, filters: TxFilters) {
  const { type, categoryId, from, to, search, page = 1, limit = 30 } = filters;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { userId };
  if (type)       where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (search)     where.description = { contains: search, mode: "insensitive" };
  if (from || to) {
    where.date = {
      ...(from && { gte: new Date(from) }),
      ...(to   && { lte: new Date(to)   }),
    };
  }

  const [total, items] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      include:  TX_INCLUDE,
      orderBy:  { date: "desc" },
      skip:     (page - 1) * limit,
      take:     limit,
    }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getTransaction(userId: string, id: string) {
  const tx = await prisma.transaction.findFirst({
    where:   { id, userId },
    include: TX_INCLUDE,
  });
  if (!tx) throw new Error("NOT_FOUND");
  return tx;
}

export async function createTransaction(userId: string, input: CreateTxInput) {
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) throw new Error("INVALID_CATEGORY");

  return prisma.transaction.create({
    data: {
      userId,
      categoryId:  input.categoryId,
      type:        input.type,
      amount:      input.amount,
      description: input.description,
      date:        new Date(input.date),
    },
    include: TX_INCLUDE,
  });
}

export async function updateTransaction(
  userId: string,
  id: string,
  input: UpdateTxInput
) {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("NOT_FOUND");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {};
  if (input.categoryId  !== undefined) data.categoryId  = input.categoryId;
  if (input.type        !== undefined) data.type        = input.type;
  if (input.amount      !== undefined) data.amount      = input.amount;
  if (input.description !== undefined) data.description = input.description;
  if (input.date        !== undefined) data.date        = new Date(input.date);

  return prisma.transaction.update({ where: { id }, data, include: TX_INCLUDE });
}

export async function deleteTransaction(userId: string, id: string) {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("NOT_FOUND");
  await prisma.transaction.delete({ where: { id } });
}
