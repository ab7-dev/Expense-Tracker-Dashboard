import { Router } from "express";
import * as ctrl from "../controllers/category.controller";

const router: import("express").Router = Router();
router.get("/", ctrl.list);

export default router;
