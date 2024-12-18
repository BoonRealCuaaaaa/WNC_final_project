import express from "express";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import {
  generateOtpForDebit,
  payDebit,
  tradeInterbank,
} from "../controllers/payment-transaction.controller.js";
import { payDebitSchema, tradeInterbankSchema } from "../schemas/payment-transaction.schema.js";
import { validRequest, validSignature } from "../middlewares/secure-interbank.middleware.js";

const router = express.Router();

router.post("/debit/otp", generateOtpForDebit);
router.post("/debit", validateMiddleware(payDebitSchema), payDebit);
router.post("/interbank-transactions", validateMiddleware(tradeInterbankSchema), validRequest, validSignature, tradeInterbank);

export default router;
