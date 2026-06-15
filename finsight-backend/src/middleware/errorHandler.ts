import { Request, Response, NextFunction } from "express";

export function errorHandler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const message =
    typeof err === "string"
      ? err
      : err?.message ?? "Internal server error";

  const status = typeof err?.status === "number" ? err.status : 500;

  console.error(`[ERROR ${status}]`, message);
  if (process.env.NODE_ENV === "development" && err?.stack) {
    console.error(err.stack);
  }

  res.status(status).json({ success: false, message });
}
