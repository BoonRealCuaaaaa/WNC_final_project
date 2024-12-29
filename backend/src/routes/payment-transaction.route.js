import express from "express";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import {
  generateOtpForDebit,
  payDebit,
  getTransactionHistory,
  generateOtpForBankTransfer,
  payBankTransfer,
} from "../controllers/payment-transaction.controller.js";
import { bankTransferSchema, payBankTransferSchema, payDebitSchema } from "../schemas/payment-transaction.schema.js";

const router = express.Router();

router.post("/debit/otp", generateOtpForDebit);
router.post("/debit", validateMiddleware(payDebitSchema), payDebit);
router.get("/history/", getTransactionHistory);
router.post("/bank-transfer", validateMiddleware(bankTransferSchema), generateOtpForBankTransfer);
router.post("/bank-transfer/pay", validateMiddleware(payBankTransferSchema), payBankTransfer);

export default router;
