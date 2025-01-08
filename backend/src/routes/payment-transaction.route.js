import express from "express";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import {
  generateOtpForDebit,
  payDebit,
  getTransactionHistory,
  generateOtpForBankTransfer,
  payBankTransfer,
} from "../controllers/payment-transaction.controller.js";
import {
  bankTransferSchema,
  payBankTransferSchema,
  payDebitSchema,
} from "../schemas/payment-transaction.schema.js";

const router = express.Router();

router.post("/debit/otp", generateOtpForDebit);

router.post("/debit", validateMiddleware(payDebitSchema), payDebit);

/**
 * @openapi
 * /payment-transaction/history:
 *   get:
 *     tags:
 *       - PaymentTransaction
 *     summary: Lấy lịch sử giao dịch
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             example:
 *               - id: 1
 *                 amount: "1000.00"
 *                 content: "Thanh toán dịch vụ"
 *                 otp: "123456"
 *                 otpExpiredAt: "2024-12-12T12:00:00.000Z"
 *                 status: "ĐANG XỬ LÝ"
 *                 srcAccount: "123456789012"
 *                 srcBankName: "Bank A"
 *                 desAccount: "9870009876"
 *                 desBankName: "Bank B"
 *                 fee: "100.00"
 *                 feePayer: "RECEIVER"
 *                 createdAt: "2025-01-07T16:09:51.000Z"
 *                 updatedAt: "2025-01-07T16:09:51.000Z"
 *                 type: "Thanh toán nhắc nợ"
 *                 relatedPerson: "Bob Brown"
 *                 accountNumber: "9870009876"
 *                 customerAccountNumber: "123456789012"
 *                 relatedBank: "Bank B"
 *       401:
 *         description: Unauthorized, chưa đăng nhập
 *       500:
 *         description: Lỗi server
 */
router.get("/history", getTransactionHistory);

router.post(
  "/bank-transfer",
  validateMiddleware(bankTransferSchema),
  generateOtpForBankTransfer
);

router.post(
  "/bank-transfer/pay",
  validateMiddleware(payBankTransferSchema),
  payBankTransfer
);

export default router;
