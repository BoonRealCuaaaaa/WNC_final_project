import express from "express";
import { createCustomerAccount, depositToAccount } from "../controllers/employee.controller.js";
import { getTransactionHistory } from "../controllers/payment-transaction.controller.js";

const router = express.Router();

router.post("/create", createCustomerAccount);
router.post("/deposit", depositToAccount);
router.get("/customer/:accountNumber/history", getTransactionHistory);

export default router;