import express from "express";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import {
  generateOtpForDebit,
  payDebit,
  getTransactionHistory,
  generateOtpForBanking,
  banking,
  searchAccount
} from "../controllers/payment-transaction.controller.js";
import { payDebitSchema, generateOtpForBankingSchema, bankingSchema, searchAccountSchema } from "../schemas/payment-transaction.schema.js";

const router = express.Router();

router.post("/debit/otp", generateOtpForDebit);
router.post("/debit", validateMiddleware(payDebitSchema), payDebit);
router.post("/banking/otp", validateMiddleware(generateOtpForBankingSchema), generateOtpForBanking);
router.post("/banking", validateMiddleware(bankingSchema), banking);
router.post("/banking/search-account", validateMiddleware(searchAccountSchema), searchAccount);
router.get("/history/", getTransactionHistory);

export default router;
