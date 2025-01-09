import express from "express";
import {
  getTellers,
  addTeller,
  getTransactions,
  updateTeller,
  deleteTeller,
  addPartner,
} from "../controllers/admin.controller.js";

const router = express.Router();

/**
 * @swagger
 * /admin/tellers/:
 *   get:
 *     summary: Lấy danh sách người các giao dịch viên
 *     description: API lấy danh sách người các giao dịch viên
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             example:
 *               - id: 1
 *                 fullName: "John Snow"
 *                 username: "jogn_snow"
 *                 phone: "093-256-1452"
 *                 email: "example@gmail.com"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *               description: Lỗi server
 *     tags:
 *       - Admin
 */
router.get("/tellers", getTellers);


/**
 * @swagger
 * /admin/tellers/:
 *   post:
 *     summary: Thêm một giao dịch viên
 *     description: API thêm một giao dịch viên
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "teller_account"
 *                 description: Tên tài khoản của giao dịch viên
 *               password:
 *                 type: number
 *                 example: password123
 *                 description: Password của giao dịch viên.
 *               fullName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *                 description: Họ tên của giao dịch viên
 *               email:
 *                 type: string
 *                 example: "nva@gmail.com"
 *                 description: Email của giao dịch viên
 *               phone:
 *                 type: string
 *                 example: "093-563-1478"
 *                 description: Số điện thoại của giao dịch viên
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: 1
 *                 fullName: "John Snow"
 *                 username: "jogn_snow"
 *                 phone: "093-256-1452"
 *                 email: "example@gmail.com"
 *                 createdAt: "2025-01-07 13:47:02" 
 *                 updatedAt: "2025-01-07 13:47:02"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *               description: Lỗi server
 *     tags:
 *       - Admin
 */
router.post("/tellers", addTeller);


/**
 * @swagger
 * /admin/tellers/{tellerId}:
 *   patch:
 *     summary: Chỉnh sửa thông tin giao dịch viên
 *     description: API chỉnh sửa thông tin giao dịch viên
 *     parameters:
 *       - in: path
 *         name: tellerId
 *         type: integer
 *         required: true
 *         description: ID của giao dịch viên cần chỉnh sửa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "teller_account"
 *                 description: Tên tài khoản của giao dịch viên
 *               password:
 *                 type: number
 *                 example: password123
 *                 description: Password của giao dịch viên.
 *               fullName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *                 description: Họ tên của giao dịch viên
 *               email:
 *                 type: string
 *                 example: "nva@gmail.com"
 *                 description: Email của giao dịch viên
 *               phone:
 *                 type: string
 *                 example: "093-563-1478"
 *                 description: Số điện thoại của giao dịch viên
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *               description: Lỗi server
 *     tags:
 *       - Admin
 */
router.patch("/tellers/:tellerId", updateTeller);


/**
 * @swagger
 * /admin/tellers/{tellerId}:
 *   delete:
 *     summary: Lấy danh sách người các giao dịch viên
 *     description: API lấy Lấy danh sách người các giao dịch viên
 *     parameters:
 *       - in: path
 *         name: tellerId
 *         type: integer
 *         required: true
 *         description: ID của giao dịch viên cần xóa
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *               description: Lỗi server
 *     tags:
 *       - Admin
 */
router.delete("/tellers/:tellerId", deleteTeller);


/**
 * @swagger
 * /admin/transactions-history:
 *   get:
 *     summary: Lấy danh sách người các giao dịch viên
 *     description: API lấy Lấy danh sách người các giao dịch viên
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             example:
 *               - id: 1
 *                 fullName: "John Snow"
 *                 username: "jogn_snow"
 *                 phone: "093-256-1452"
 *                 email: "example@gmail.com"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *               description: Lỗi server
 *     tags:
 *       - Admin
 */
router.get("/transactions-history", getTransactions);
/**
 * @swagger
 * /admin/partner:
 *   post:
 *     summary: Thêm ngân hàng liên kết
 *     description: API thêm ngân hàng liên kết
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankName:
 *                 type: string
 *                 example: "teller_account"
 *                 description: Tên tài khoản của giao dịch viên
 *               domain:
 *                 type: number
 *                 example: password123
 *                 description: Password của giao dịch viên.
 *               partnerPublicKey:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *                 description: Họ tên của giao dịch viên
 *               partnerAlgo:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *                 description: Họ tên của giao dịch viên
 *               partnerSecretKey:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *                 description: Họ tên của giao dịch viên
 *               ourPrivateKey:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *                 description: Họ tên của giao dịch viên
 *               ourPublicKey:
 *                 type: string
 *                 example: "nva@gmail.com"
 *                 description: Email của giao dịch viên
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             example:
 *               - id: 1
 *                 fullName: "John Snow"
 *                 username: "jogn_snow"
 *                 phone: "093-256-1452"
 *                 email: "example@gmail.com"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *               description: Lỗi server
 *     tags:
 *       - Admin
 */
router.post("/partner", addPartner);

export default router;
