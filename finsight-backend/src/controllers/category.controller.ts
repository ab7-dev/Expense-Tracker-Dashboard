import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { ok, serverError } from "../utils/response";

export async function list(_req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return ok(res, categories);
  } catch (e) {
    return serverError(res);
  }
}
