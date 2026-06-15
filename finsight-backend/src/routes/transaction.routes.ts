import { Router } from "express";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { body, query } = require("express-validator");
import * as ctrl        from "../controllers/transaction.controller";
import { authenticate } from "../middleware/auth";
import { validate }     from "../middleware/validate";

const router: import("express").Router = Router();
router.use(authenticate);

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("type").optional().isIn(["income", "expense", "INCOME", "EXPENSE"]),
    query("from").optional().isISO8601(),
    query("to").optional().isISO8601(),
  ],
  validate,
  ctrl.list
);

router.get("/:id", ctrl.getOne);

router.post(
  "/",
  [
    body("type").isIn(["INCOME", "EXPENSE", "income", "expense"])
      .withMessage("type must be INCOME or EXPENSE"),
    body("amount").isFloat({ gt: 0 })
      .withMessage("amount must be a positive number"),
    body("description").trim().notEmpty()
      .withMessage("description is required"),
    body("categoryId").notEmpty()
      .withMessage("categoryId is required"),
    body("date").isISO8601()
      .withMessage("date must be a valid ISO 8601 date"),
  ],
  validate,
  ctrl.create
);

router.patch(
  "/:id",
  [
    body("amount").optional().isFloat({ gt: 0 }),
    body("date").optional().isISO8601(),
    body("type").optional().isIn(["INCOME", "EXPENSE", "income", "expense"]),
  ],
  validate,
  ctrl.update
);

router.delete("/:id", ctrl.remove);

export default router;
