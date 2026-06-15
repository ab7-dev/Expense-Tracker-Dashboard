import { Request, Response, NextFunction } from "express";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { validationResult } = require("express-validator");
import { badRequest } from "../utils/response";

export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return badRequest(res, "Validation failed", errors.array());
  }
  return next();
}
