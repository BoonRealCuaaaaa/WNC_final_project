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

/**
 * @swagger
 * /payment-transaction/debit/otp:
 *   post:
 *     summary: Tạo OTP cho giao dịch nợ
 *     description: API tạo OTP để thực hiện thanh toán nợ, sử dụng khi tạo giao dịch thanh toán nợ giữa khách hàng nợ và khách hàng chủ nợ.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               debitId:
 *                 type: integer
 *                 description: ID của giao dịch nợ mà OTP sẽ được tạo cho.
 *                 example: 123
 *     responses:
 *       200:
 *         description: OTP được tạo thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP generated"
 *                   description: Thông báo khi OTP được tạo thành công.
 *       404:
 *         description: Không tìm thấy giao dịch nợ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Debit not found"
 *                   description: Thông báo khi không tìm thấy giao dịch nợ.
 *       500:
 *         description: Lỗi máy chủ khi tạo OTP hoặc giao dịch thanh toán nợ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 *                   description: Thông báo lỗi máy chủ khi tạo OTP.
 *     security:
 *       - jwt: []
 *     tags:
 *       - Payment Transaction
 */
router.post("/debit/otp", generateOtpForDebit);

/**
 * @swagger
 * /payment-transaction/debit:
 *   post:
 *     summary: Thanh toán nợ
 *     description: API thực hiện thanh toán nợ cho giao dịch nợ, yêu cầu người dùng cung cấp OTP để xác nhận thanh toán.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               debitId:
 *                 type: integer
 *                 description: ID của giao dịch nợ cần thanh toán.
 *                 example: 123
 *               otp:
 *                 type: string
 *                 description: Mã OTP để xác nhận thanh toán nợ.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Thanh toán thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Debit paid"
 *                   description: Thông báo khi thanh toán nợ thành công.
 *       400:
 *         description: Lỗi xác nhận OTP hoặc không đủ số dư.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP"
 *                   description: Thông báo khi OTP không hợp lệ hoặc OTP đã hết hạn.
 *       404:
 *         description: Không tìm thấy giao dịch nợ hoặc giao dịch thanh toán.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Debit not found"
 *                   description: Thông báo khi không tìm thấy giao dịch nợ hoặc giao dịch thanh toán.
 *       500:
 *         description: Lỗi máy chủ khi thanh toán nợ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 *                   description: Thông báo lỗi máy chủ trong quá trình thanh toán nợ.
 *     tags:
 *       - Payment Transaction
 */
router.post("/debit", validateMiddleware(payDebitSchema), payDebit);

/**
 * @openapi
 * /payment-transaction/history:
 *   get:
 *     tags:
 *       - Payment Transaction
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

/**
 * @swagger
 * /payment-transaction/bank-transfer:
 *   post:
 *     summary: Tạo OTP cho giao dịch chuyển khoản qua ngân hàng
 *     description: API tạo mã OTP để xác thực giao dịch chuyển khoản qua ngân hàng cho người dùng, bao gồm chuyển khoản nội bộ hoặc liên ngân hàng.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               desBankName:
 *                 type: string
 *                 description: Tên ngân hàng nhận.
 *                 example: "BANK_NAME"
 *               desAccount:
 *                 type: string
 *                 description: Số tài khoản người nhận.
 *                 example: "1234567890"
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Số tiền cần chuyển.
 *                 example: 100000
 *               content:
 *                 type: string
 *                 description: Nội dung chuyển khoản.
 *                 example: "Thanh toán hóa đơn"
 *               feePayer:
 *                 type: string
 *                 description: Người chịu phí giao dịch ("SENDER" hoặc "RECEIVER").
 *                 example: "SENDER"
 *     responses:
 *       200:
 *         description: Thành công, OTP được tạo và gửi qua email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID của giao dịch chuyển khoản.
 *                   example: 123
 *                 amount:
 *                   type: number
 *                   description: Số tiền chuyển thực tế.
 *                   example: 99900
 *                 content:
 *                   type: string
 *                   description: Nội dung chuyển khoản.
 *                   example: "Thanh toán hóa đơn"
 *                 desOwner:
 *                   type: string
 *                   description: Tên chủ tài khoản nhận.
 *                   example: "Nguyễn Văn A"
 *                 desAccount:
 *                   type: string
 *                   description: Số tài khoản nhận.
 *                   example: "1234567890"
 *                 desBankName:
 *                   type: string
 *                   description: Tên ngân hàng nhận.
 *                   example: "BANK_NAME"
 *                 fee:
 *                   type: number
 *                   description: Phí giao dịch.
 *                   example: 5000
 *                 feePayer:
 *                   type: string
 *                   description: Người chịu phí giao dịch ("SENDER" hoặc "RECEIVER").
 *                   example: "SENDER"
 *                 email:
 *                   type: string
 *                   description: Email của người gửi.
 *                   example: "user@example.com"
 *       400:
 *         description: Lỗi với thông tin chuyển khoản hoặc số dư không đủ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Số dư không đủ"
 *                   description: Thông báo khi số dư không đủ để thực hiện giao dịch.
 *       404:
 *         description: Người nhận không tồn tại.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Receiver not found"
 *                   description: Thông báo khi người nhận không tồn tại.
 *       500:
 *         description: Lỗi máy chủ khi tạo giao dịch chuyển khoản.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 *                   description: Thông báo lỗi máy chủ trong quá trình tạo giao dịch.
 */
router.post(
  "/bank-transfer",
  validateMiddleware(bankTransferSchema),
  generateOtpForBankTransfer
);

/**
 * @swagger
 * /payment-transaction/bank-transfer/pay:
 *   post:
 *     summary: Xác thực OTP và thực hiện chuyển khoản qua ngân hàng
 *     description: API để thực hiện thanh toán giao dịch chuyển khoản qua ngân hàng sau khi người dùng xác thực OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID của giao dịch chuyển khoản.
 *                 example: 123
 *               otp:
 *                 type: string
 *                 description: Mã OTP xác thực.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Thành công, giao dịch chuyển khoản đã được thực hiện.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo kết quả giao dịch.
 *                   example: "Chuyển khoản thành công"
 *       400:
 *         description: Lỗi xác thực OTP hoặc số dư không đủ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP không hợp lệ"
 *       404:
 *         description: Giao dịch không hợp lệ hoặc người nhận không tồn tại.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Giao dịch không hợp lệ"
 *       500:
 *         description: Lỗi hệ thống khi thực hiện giao dịch (đặc biệt trong trường hợp chuyển khoản liên ngân hàng).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi hệ thống (2)"
 */
router.post(
  "/bank-transfer/pay",
  validateMiddleware(payBankTransferSchema),
  payBankTransfer
);

export default router;
