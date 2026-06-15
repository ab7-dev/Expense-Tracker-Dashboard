import { Response } from "express";
import * as budgetService from "../services/budget.service";
import { AuthRequest } from "../middleware/auth";
import { ok, created, noContent, notFound, serverError } from "../utils/response";

export async function list(req: AuthRequest, res: Response) {
  try {
    const now   = new Date();
    const month = parseInt(String(req.query.month ?? now.getMonth() + 1));
    const year  = parseInt(String(req.query.year  ?? now.getFullYear()));
    const budgets = await budgetService.listBudgets(req.user!.userId, month, year);
    return ok(res, budgets);
  } catch (e) {
    console.error(e);
    return serverError(res);
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const { categoryId, amount, month, year } = req.body as {
      categoryId: string;
      amount: number | string;
      month:  number | string;
      year:   number | string;
    };
    const budget = await budgetService.createBudget(req.user!.userId, {
      categoryId,
      amount: parseFloat(String(amount)),
      month:  parseInt(String(month)),
      year:   parseInt(String(year)),
    });
    return created(res, budget);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "INVALID_CATEGORY")
      return notFound(res, "Category not found");
    console.error(e);
    return serverError(res);
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const budget = await budgetService.updateBudget(
      req.user!.userId,
      req.params.id,
      parseFloat(String(req.body.amount))
    );
    return ok(res, budget);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND")
      return notFound(res, "Budget not found");
    return serverError(res);
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    await budgetService.deleteBudget(req.user!.userId, req.params.id);
    return noContent(res);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND")
      return notFound(res, "Budget not found");
    return serverError(res);
  }
}
