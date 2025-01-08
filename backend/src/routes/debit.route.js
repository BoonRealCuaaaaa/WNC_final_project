import express from "express";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import {
  cancelDebit,
  createDebit,
  getCreatedDebit,
  getReceivedDebit,
} from "../controllers/debit.controller.js";
import {
  cancelDebitSchema,
  createDebitSchema,
} from "./../schemas/debit.schema.js";

const router = express.Router();

/**
 * @swagger
 * /debits:
 *   post:
 *     summary: Tạo giao dịch nợ
 *     description: API tạo giao dịch nợ mới từ người cho vay đến người vay.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "123456789"
 *                 description: Số tài khoản của người vay.
 *               amount:
 *                 type: number
 *                 example: 100000
 *                 description: Số tiền của giao dịch nợ.
 *               content:
 *                 type: string
 *                 example: "Thanh toán tiền mua hàng"
 *                 description: Nội dung của giao dịch nợ.
 *     responses:
 *       201:
 *         description: Giao dịch nợ được tạo thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Debit created"
 *                   description: Thông báo thành công.
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad Request"
 *                   description: Thông báo lỗi khi yêu cầu không hợp lệ.
 *       404:
 *         description: Không tìm thấy người cho vay hoặc người vay.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Creditor not found"
 *                   description: Thông báo khi không tìm thấy người cho vay hoặc người vay.
 *       401:
 *         description: Xác thực không hợp lệ. Cần JWT hợp lệ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                   description: Thông báo khi xác thực JWT không hợp lệ.
 *     security:
 *       - jwt: []
 *     tags:
 *       - Debit Management
 * components:
 *   securitySchemes:
 *     jwt:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post("/", validateMiddleware(createDebitSchema), createDebit);
/**
 * @swagger
 * /debits/created:
 *   get:
 *     summary: Lấy danh sách các giao dịch nợ đã tạo bởi bản thân
 *     description: API lấy danh sách các giao dịch nợ mà người dùng là người cho vay (creditor).
 *     responses:
 *       200:
 *         description: Danh sách giao dịch nợ đã được tạo thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID của giao dịch nợ.
 *                   amount:
 *                     type: number
 *                     description: Số tiền của giao dịch nợ.
 *                   content:
 *                     type: string
 *                     description: Nội dung của giao dịch nợ.
 *                   creditor:
 *                     type: integer
 *                     description: ID của người cho vay.
 *                   debtor:
 *                     type: integer
 *                     description: ID của người vay.
 *                   status:
 *                     type: string
 *                     description: Trạng thái của giao dịch nợ (Chưa thanh toán, Đã thanh toán, v.v).
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Thời gian tạo giao dịch nợ.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Thời gian cập nhật giao dịch nợ.
 *                   fullName:
 *                     type: string
 *                     description: Tên đầy đủ của người vay.
 *       401:
 *         description: Xác thực không hợp lệ. Cần JWT hợp lệ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                   description: Thông báo khi xác thực JWT không hợp lệ.
 *       404:
 *         description: Không tìm thấy khách hàng.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer not found"
 *                   description: Thông báo khi không tìm thấy khách hàng.
 *       500:
 *         description: Lỗi máy chủ khi lấy dữ liệu giao dịch nợ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 *                   description: Thông báo lỗi máy chủ khi truy vấn giao dịch nợ.
 *     security:
 *       - jwt: []
 *     tags:
 *       - Debit Management
 * components:
 *   securitySchemes:
 *     jwt:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get("/created", getCreatedDebit);
/**
 * @swagger
 * /debits/received:
 *   get:
 *     summary: Lấy danh sách các giao dịch nợ đã nhận
 *     description: API lấy danh sách các giao dịch nợ mà người dùng là người vay (debtor).
 *     responses:
 *       200:
 *         description: Danh sách giao dịch nợ đã nhận thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID của giao dịch nợ.
 *                   amount:
 *                     type: number
 *                     description: Số tiền của giao dịch nợ.
 *                   content:
 *                     type: string
 *                     description: Nội dung của giao dịch nợ.
 *                   creditor:
 *                     type: integer
 *                     description: ID của người cho vay.
 *                   debtor:
 *                     type: integer
 *                     description: ID của người vay.
 *                   status:
 *                     type: string
 *                     description: Trạng thái của giao dịch nợ (Chưa thanh toán, Đã thanh toán, v.v).
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Thời gian tạo giao dịch nợ.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Thời gian cập nhật giao dịch nợ.
 *                   fullName:
 *                     type: string
 *                     description: Tên đầy đủ của người cho vay.
 *       401:
 *         description: Xác thực không hợp lệ. Cần JWT hợp lệ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                   description: Thông báo khi xác thực JWT không hợp lệ.
 *       404:
 *         description: Không tìm thấy khách hàng.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer not found"
 *                   description: Thông báo khi không tìm thấy khách hàng.
 *       500:
 *         description: Lỗi máy chủ khi lấy dữ liệu giao dịch nợ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 *                   description: Thông báo lỗi máy chủ khi truy vấn giao dịch nợ.
 *     security:
 *       - jwt: []
 *     tags:
 *       - Debit Management
 * components:
 *   securitySchemes:
 *     jwt:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get("/received", getReceivedDebit);

/**
 * @swagger
 * /debits/cancel:
 *   post:
 *     summary: Hủy giao dịch nợ
 *     description: API cho phép hủy một giao dịch nợ dựa trên ID giao dịch và lý do hủy.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID của giao dịch nợ cần hủy.
 *                 example: 123
 *               reason:
 *                 type: string
 *                 description: Lý do hủy giao dịch nợ.
 *                 example: "Lý do hủy"
 *     responses:
 *       200:
 *         description: Hủy giao dịch nợ thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Debit canceled"
 *                   description: Thông báo giao dịch nợ đã bị hủy.
 *       401:
 *         description: Xác thực không hợp lệ. Cần JWT hợp lệ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                   description: Thông báo khi xác thực JWT không hợp lệ.
 *       404:
 *         description: Giao dịch nợ không tồn tại.
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
 *         description: Lỗi máy chủ khi thực hiện hủy giao dịch nợ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 *                   description: Thông báo lỗi máy chủ trong quá trình hủy giao dịch nợ.
 *     security:
 *       - jwt: []
 *     tags:
 *       - Debit Management
 * components:
 *   securitySchemes:
 *     jwt:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post("/cancel", validateMiddleware(cancelDebitSchema), cancelDebit);

export default router;
