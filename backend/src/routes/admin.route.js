import express from "express";
import { getTellers, getTransactions } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/tellers", getTellers);
router.get("/transactions-history", getTransactions);

export default router;