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
 * /interbanks/handle-trade-interbank:
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
 *               time:
 *                 type: number
 *                 example: 1736311549783
 *                 description: Thời gian gửi gói tin.
 *               token:
 *                 type: string
 *                 example: token
 *                 description: Token để kiểm tra gói tin có bị chỉnh sửa không. Hash theo thuật toán sha256 chuỗi "/interbanks/handle-trade-interbank" + time + secretKey.
 *               signature:
 *                 type: string
 *                 example: signature
 *                 description: Chữ ký của đối tác tạo dựa vào JSON.stringify({amount, accountNumber, srcAccount, content}).
 *               payload:
 *                 type: object
 *                 properties:
 *                   accountNumber:
 *                     type: string
 *                   srcAccount:
 *                     type: string
 *                   amount:
 *                     type: number
 *                     example: 50000
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
 *                   description: success or fail
 *                 signature:
 *                   type: string
 *                   description: Chữ ký của công ty tạo dựa vào JSON.stringify({message}).
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
 *                       example: Thời gian đã quá hạn
 *                   description: Thời gian đã quá hạn
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Gói tin đã bị thay đổi
 *                   description: Gói tin đã bị thay đổi
 *       401:
 *         description: Chữ kí không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chữ kí không hợp lệ 
 *       403:
 *         description: Không tìm thấy ngân hàng tương ứng với domain
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy ngân hàng
 *       500:
 *         description: Lỗi server
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
 *                   description: Gói tin hợp lệ tuy nhiên gặp lỗi server
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Lỗi server
 *                   description: Gặp lỗi server khi kiểm tra gói tin có hợp lệ hay không
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
 * /interbanks/handle-search-interbank-account:
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
 *               domain:
 *                 type: string
 *                 description: Tên miền của đối tác.
 *               time:
 *                 type: number
 *                 example: 1736311549783
 *                 description: Thời gian gửi gói tin.
 *               token:
 *                 type: string
 *                 example: token
 *                 description: Token để kiểm tra gói tin có bị chỉnh sửa không. Hash theo thuật toán sha256 chuỗi "/interbanks/handle-search-interbank-account" + time + secretKey.
 *               payload:
 *                 type: object
 *                 properties:
 *                   accountNumber:
 *                     type: string
 *                     description: Số tài khoản ngân hàng cần tìm kiếm.
 *                     example: "987654321098"
 *     responses:
 *       200:
 *         description: Trả về thông tin tài khoản hoặc thông báo lỗi nếu không tìm thấy.
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
 *                       example: Thời gian đã quá hạn
 *                   description: Thời gian đã quá hạn
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Gói tin đã bị thay đổi
 *                   description: Gói tin đã bị thay đổi
 *       403:
 *         description: Không tìm thấy ngân hàng tương ứng với domain
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy ngân hàng
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 0
 *                     account:
 *                       type: object
 *                       properties:
 *                   description: Gói tin hợp lệ tuy nhiên gặp lỗi server
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Lỗi server
 *                   description: Gặp lỗi server khi kiểm tra gói tin có hợp lệ hay không
 *     tags:
 *       - Interbank Account Search
 */
router.post(
  "/handle-search-interbank-account",
  validateMiddleware(handleSearchInterbankAccountSchema),
  validRequest,
  handleSearchInterbankAccount
);

router.post(
  "/search-interbank-account",
  verifyToken,
  validateMiddleware(searchInterbankAccountSchema),
  searchInterbankAccount
);

export default router;
