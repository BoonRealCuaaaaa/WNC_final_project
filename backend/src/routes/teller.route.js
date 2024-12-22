import express from "express";
import {
  createCustomerAccount,
  depositToAccount,
  getAllCustomerAccount,
} from "../controllers/teller.controller.js";
import { getTransactionHistory } from "../controllers/payment-transaction.controller.js";

const router = express.Router();

router.post("/customer/create", createCustomerAccount);
router.post("/deposit", depositToAccount);
router.get("/customer/:id/history", getTransactionHistory);
router.get("/customer", getAllCustomerAccount);
export default router;
