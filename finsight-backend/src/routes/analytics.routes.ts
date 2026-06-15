import { Router } from "express";
import * as ctrl from "../controllers/analytics.controller";
import { authenticate } from "../middleware/auth";

const router: import("express").Router = Router();
router.use(authenticate);

router.get("/dashboard", ctrl.dashboardSummary);
router.get("/trend",     ctrl.monthlyTrend);
router.get("/insights",  ctrl.insights);
router.get("/yearly",    ctrl.yearlySummary);

export default router;
