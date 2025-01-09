import express from "express";
import {
  createCustomerAccount,
  depositToAccount,
  getAllCustomerAccount,
} from "../controllers/teller.controller.js";
import { getTransactionHistory } from "../controllers/payment-transaction.controller.js";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import {
  createCustomerAccountSchema,
  depositToAccountSchema,
} from "../schemas/customer.schema.js";
const router = express.Router();

/**
 * @openapi
 * /teller/customer/create:
 *   post:
 *     tags:
 *       - Teller
 *     summary: Tạo tài khoản khách hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: Group07
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: Password123@
 *               fullName:
 *                 type: string
 *                 example: Group 07 HCMUS
 *               email:
 *                 type: string
 *                 pattern: "^[\\w\\.-]+@([\\w\\.-]+\\.)+[A-Za-z]{2,4}$"
 *                 example: group07@gmail.com
 *               phone:
 *                 type: string
 *                 example: 0123456789
 *             required:
 *               - username
 *               - password
 *               - fullName
 *               - email
 *               - phone
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account created successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 18
 *                     username:
 *                       type: string
 *                       example: "Group07"
 *                     password:
 *                       type: string
 *                       example: "$2b$10$qIUQTSZUHmDIYi2dM31URO.DHvYEAuiFCIW/yHxfu45MCbD.18uu6"
 *                     role:
 *                       type: string
 *                       example: "CUSTOMER"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-08T07:57:43.612Z"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-08T07:57:43.612Z"
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post(
  "/customer/create",
  validateMiddleware(createCustomerAccountSchema),
  createCustomerAccount
);

/**
 * @openapi
 * /teller/deposit:
 *   post:
 *     tags:
 *       - Teller
 *     summary: Nạp tiền vào tài khoản khách hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 pattern: "^[0-9]+$"
 *                 example: 123456789012
 *               amount:
 *                 type: string
 *                 pattern: "^[0-9]+$"
 *                 example: 1000000
 *             required:
 *               - accountNumber
 *               - amount
 *     responses:
 *       200:
 *         description: Nạp tiền thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deposit successful
 *                 account:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     accountNumber:
 *                       type: string
 *                       example: 123456789012
 *                     balance:
 *                       type: number
 *                       example: 1010000
 *                     customerId:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-01-07T16:09:51.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-01-08T07:53:11.589Z
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Tài khoản không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Account does not exist."
 *       500:
 *         description: Server error
 */
router.post(
  "/deposit",
  validateMiddleware(depositToAccountSchema),
  depositToAccount
);

/**
 * @openapi
 * /teller/customer/{id}/history:
 *   get:
 *     tags:
 *       - Teller
 *     summary: Lấy lịch sử giao dịch của một khách hàng
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *         description: ID of the customer
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
 *       404:
 *         description: Không tìm thấy tài khoản khách hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Payment account not found."
 *       500:
 *         description: Lỗi server
 */
router.get("/customer/:id/history", getTransactionHistory);

/**
 * @openapi
 * /teller/customer:
 *   get:
 *     tags:
 *       - Teller
 *     summary: Get all customer accounts
 *     responses:
 *       200:
 *         description: A list of customer accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             example:
 *               - id: 1
 *                 accountNumber: "123456789012"
 *                 balance: "10000.00"
 *                 customer:
 *                   id: 1
 *                   fullName: "John Doe"
 *                   phone: "012-345-6789"
 *                   email: "john.doe@example.com"
 *                   user:
 *                     username: "john_doe"
 *       401:
 *         description: Unauthorized, chưa đăng nhập
 *       500:
 *         description: Lỗi server
 */
router.get("/customer", getAllCustomerAccount);
export default router;
