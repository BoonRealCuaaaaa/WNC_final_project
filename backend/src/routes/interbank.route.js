import {
  validRequest,
  validSignature,
} from "../middlewares/secure-interbank.middleware.js";
import {
  handleSearchInterbankAccountSchema,
  searchInterbankAccountSchema,
  handleTradeInterbankSchema,
} from "../schemas/interbank.schema.js";
import {
  handleTradeInterbank,
  searchInterbankAccount,
  handleSearchInterbankAccount,
} from "../controllers/interbank.controller.js";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import { verifyToken } from "../middlewares/authenticate.middleware.js";

import express from "express";
const router = express.Router();

/**
 * @swagger
 * /trade/interbank:
 *   post:
 *     summary: Xử lý giao dịch liên ngân hàng
 *     description: API xử lý giao dịch chuyển tiền liên ngân hàng từ tài khoản nguồn tới tài khoản đích.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domain:
 *                 type: string
 *                 description: Tên miền của đối tác.
 *               payload:
 *                 type: object
 *                 properties:
 *                   accountNumber:
 *                     type: string
 *                   srcAccount:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   content:
 *                     type: string
 *     responses:
 *       200:
 *         description: Giao dịch thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 signature:
 *                   type: string
 *       400:
 *         description: Giao dịch thất bại
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: fail
 *                     signature:
 *                       type: string
 *                   description: Số tiền không đủ
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: fail
 *                     signature:
 *                       type: string
 *                   description: Đối tác không tồn tại
 *     tags:
 *       - Interbank Transaction
 */
router.post(
  "/handle-trade-interbank",
  validateMiddleware(handleTradeInterbankSchema),
  validRequest,
  validSignature,
  handleTradeInterbank
);

/**
 * @swagger
 * /handle-search-interbank-account:
 *   post:
 *     summary: Tìm kiếm thông tin tài khoản của ngân hàng bản thân
 *     description: API tìm kiếm thông tin tài khoản ngân hàng bằng số tài khoản và trả về tên chủ tài khoản nếu có.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payload:
 *                 type: object
 *                 properties:
 *                   accountNumber:
 *                     type: string
 *                     description: Số tài khoản ngân hàng cần tìm kiếm.
 *                     example: "123456789"
 *     responses:
 *       200:
 *         description: Trả về thông tin tài khoản hoặc thông báo lỗi nếu không tìm thấy.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 1
 *                     account:
 *                       type: object
 *                       properties:
 *                         accountNumber:
 *                           type: string
 *                           example: "123456789"
 *                         fullName:
 *                           type: string
 *                           example: "Nguyễn Văn A"
 *                     message:
 *                       type: string
 *                       example: "Tìm thấy tài khoản"  # Thông báo thành công
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 0
 *                     account:
 *                       type: object
 *                       properties:
 *                         accountNumber:
 *                           type: string
 *                           example: ""
 *                         fullName:
 *                           type: string
 *                           example: ""
 *                     message:
 *                       type: string
 *                       example: "Lỗi hệ thống hoặc không tìm thấy tài khoản"
 *     tags:
 *       - Interbank Account Search
 */
router.post(
  "/handle-search-interbank-account",
  validateMiddleware(handleSearchInterbankAccountSchema),
  validRequest,
  handleSearchInterbankAccount
);

/**
 * @swagger
 * /search-interbank-account:
 *   post:
 *     summary: Tìm kiếm tài khoản của ngân hàng đối tác
 *     description: API tìm kiếm thông tin tài khoản ngân hàng dựa trên tên ngân hàng và số tài khoản.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankName:
 *                 type: string
 *                 description: Tên ngân hàng cần kiểm tra.
 *                 example: "Techcombank"
 *               accountNumber:
 *                 type: string
 *                 description: Số tài khoản cần tìm kiếm.
 *                 example: "123456789"
 *     responses:
 *       200:
 *         description: Thành công - Trả về thông tin tài khoản hoặc thông tin mặc định nếu có lỗi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 1
 *                 account:
 *                   type: object
 *                   properties:
 *                     accountNumber:
 *                       type: string
 *                       example: "123456789"
 *                     fullName:
 *                       type: string
 *                       example: "Nguyễn Văn A"
 *                     status:
 *                       type: string
 *                       example: "Active"
 *                 message:
 *                   type: string
 *                   example: "Tìm thấy tài khoản"
 *       400:
 *         description: Thất bại khi không tìm thấy partner hoặc lỗi trong quá trình tìm kiếm tài khoản.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 0
 *                     message:
 *                       type: string
 *                       example: "Bad request: BankName is not existed"
 *                     account:
 *                       type: object
 *                       properties:
 *                         accountNumber:
 *                           type: string
 *                           example: ""
 *                         fullName:
 *                           type: string
 *                           example: ""
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 0
 *                     message:
 *                       type: string
 *                       example: "Lỗi hệ thống hoặc không tìm thấy tài khoản"
 *                     account:
 *                       type: object
 *                       properties:
 *                         accountNumber:
 *                           type: string
 *                           example: ""
 *                         fullName:
 *                           type: string
 *                           example: ""
 *     tags:
 *       - Interbank Account Search
 */

router.post(
  "/search-interbank-account",
  verifyToken,
  validateMiddleware(searchInterbankAccountSchema),
  searchInterbankAccount
);

export default router;
