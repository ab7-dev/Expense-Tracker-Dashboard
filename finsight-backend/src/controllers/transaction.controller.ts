import { Response } from "express";
import * as txService from "../services/transaction.service";
import { TransactionType } from "../services/transaction.service";
import { AuthRequest } from "../middleware/auth";
import {
  ok, created, noContent, badRequest, notFound, serverError,
} from "../utils/response";

export async function list(req: AuthRequest, res: Response) {
  try {
    const {
      page, limit, type, categoryId, from, to, search,
    } = req.query as Record<string, string>;

    const result = await txService.listTransactions(req.user!.userId, {
      page:       page       ? parseInt(page)  : undefined,
      limit:      limit      ? parseInt(limit) : undefined,
      type:       type       ? (type.toUpperCase() as TransactionType) : undefined,
      categoryId: categoryId || undefined,
      from:       from       || undefined,
      to:         to         || undefined,
      search:     search     || undefined,
    });
    return ok(res, result);
  } catch (e) {
    console.error(e);
    return serverError(res);
  }
}

export async function getOne(req: AuthRequest, res: Response) {
  try {
    const tx = await txService.getTransaction(req.user!.userId, req.params.id);
    return ok(res, tx);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND")
      return notFound(res, "Transaction not found");
    return serverError(res);
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const { type, amount, description, categoryId, date } = req.body as {
      type: string; amount: string | number; description: string;
      categoryId: string; date: string;
    };
    const tx = await txService.createTransaction(req.user!.userId, {
      type:        type.toUpperCase() as TransactionType,
      amount:      parseFloat(String(amount)),
      description,
      categoryId,
      date,
    });
    return created(res, tx);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "INVALID_CATEGORY")
      return badRequest(res, "Invalid category ID");
    console.error(e);
    return serverError(res);
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const { type, amount, description, categoryId, date } = req.body as {
      type?: string; amount?: string | number; description?: string;
      categoryId?: string; date?: string;
    };
    const tx = await txService.updateTransaction(req.user!.userId, req.params.id, {
      ...(type        && { type: type.toUpperCase() as TransactionType }),
      ...(amount      && { amount: parseFloat(String(amount)) }),
      ...(description && { description }),
      ...(categoryId  && { categoryId }),
      ...(date        && { date }),
    });
    return ok(res, tx);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND")
      return notFound(res, "Transaction not found");
    return serverError(res);
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    await txService.deleteTransaction(req.user!.userId, req.params.id);
    return noContent(res);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND")
      return notFound(res, "Transaction not found");
    return serverError(res);
  }
}
