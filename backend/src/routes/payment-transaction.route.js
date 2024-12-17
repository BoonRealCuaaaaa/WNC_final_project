import express from "express";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import {
  generateOtpForDebit,
  payDebit,
  getTransactionHistory
} from "../controllers/payment-transaction.controller.js";
import { payDebitSchema } from "../schemas/payment-transaction.schema.js";

const router = express.Router();

router.post("/debit/otp", generateOtpForDebit);
router.post("/debit", validateMiddleware(payDebitSchema), payDebit);

router.get("/history/:accountNumber", getTransactionHistory);

export default router;
