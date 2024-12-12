import express from "express";
import { generateOtpForDebit, payDebit } from "../controllers/payment-transaction.controller.js";

const router = express.Router();

router.post("/debit/otp", generateOtpForDebit);
router.post("/debit", payDebit);

export default router;
