import { Response } from "express";
import * as analyticsService from "../services/analytics.service";
import { AuthRequest } from "../middleware/auth";
import { ok, serverError } from "../utils/response";

export async function dashboardSummary(req: AuthRequest, res: Response) {
  try {
    const now   = new Date();
    const month = parseInt((req.query.month as string) ?? String(now.getMonth() + 1));
    const year  = parseInt((req.query.year  as string) ?? String(now.getFullYear()));
    const data  = await analyticsService.getDashboardSummary(req.user!.userId, month, year);
    return ok(res, data);
  } catch (e) {
    console.error(e);
    return serverError(res);
  }
}

export async function monthlyTrend(req: AuthRequest, res: Response) {
  try {
    const months = parseInt((req.query.months as string) ?? "6");
    const data   = await analyticsService.getMonthlyTrend(req.user!.userId, months);
    return ok(res, data);
  } catch (e) {
    console.error(e);
    return serverError(res);
  }
}

export async function insights(req: AuthRequest, res: Response) {
  try {
    const data = await analyticsService.getInsights(req.user!.userId);
    return ok(res, data);
  } catch (e) {
    console.error(e);
    return serverError(res);
  }
}

export async function yearlySummary(req: AuthRequest, res: Response) {
  try {
    const year = parseInt((req.query.year as string) ?? String(new Date().getFullYear()));
    const data = await analyticsService.getYearlySummary(req.user!.userId, year);
    return ok(res, data);
  } catch (e) {
    console.error(e);
    return serverError(res);
  }
}
