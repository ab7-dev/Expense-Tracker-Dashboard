import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { unauthorized } from "../utils/response";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return unauthorized(res);
  }
  const token = header.slice(7);
  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return unauthorized(res, "Token expired or invalid");
  }
}
