import express from "express";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import { createBeneficiary, deleteBeneficiary, getBeneficiaries, updateBeneficiary } from "../controllers/beneficiary.controller.js";
import { createBeneficiarySchema, updateBeneficiarySchema } from "../schemas/beneficiary.schema.js";

const router = express.Router();

/**
 * @swagger
 * /beneficiaries/:
 *   get:
 *     summary: Lấy danh sách người thụ hưởng
 *     description: API lấy danh sách người thụ hưởng của tài khoản khách hàng gọi tới
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             example:
 *               - id: 1
 *                 name: "John Snow"
 *                 shortName: "Snow"
 *                 bankName: "BANK A"
 *                 accountNumber: "123413123"
 *                 customerId: 1
 *                 createdAt: "2025-01-08T10:24:18.000Z"
 *                 updatedAt: "2025-01-08T10:24:18.000Z"
 *     tags:
 *       - Beneficiaries
 */
router.get("/", getBeneficiaries);

/**
 * @swagger
 * /beneficiaries/:
 *   post:
 *     summary: Thêm người thụ hưởng
 *     description: API thêm người thụ hưởng cho tài khoản khách hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shortName:
 *                 type: string
 *                 example: Chủ nợ
 *                 description: Tên gợi nhớ
 *               bankName:
 *                 type: string
 *                 example: MyBank
 *                 description: Ngân hàng của người thụ hưởng
 *               accountNumber:
 *                 type: string
 *                 example: 123456789012
 *                 description: Ngân hàng của người thụ hưởng
 *     responses:
 *       201:
 *         description: Thêm người thụ hưởng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thêm người thụ hưởng thành công
 *       400:
 *         description: Thêm người thụ hưởng thất bại. Có thể là do người này đã thêm vào danh sách hoặc thông tin người thụ hưởng là bản thân.
 *         content:
 *           application/json:
  *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không thể thêm bản thân
 *       404:
 *         description: Không tìm thấy người thụ hưởng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy người thụ hưởng
 *     tags:
 *       - Beneficiaries
 */
router.post("/", validateMiddleware(createBeneficiarySchema),createBeneficiary);

/**
 * @swagger
 * /beneficiaries/{id}:
 *   delete:
 *     summary: Xóa người thụ hưởng
 *     description: API xóa người thụ hưởng khỏi tài khoản khách hàng
 *     parameters:
 *       - in: path
 *         name: id
 *         type: integer
 *         required: true
 *         description: ID người thụ hưởng lưu ở bảng Beneficiaries
 *     responses:
 *       200:
 *         description: Xóa người thụ hưởng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Xóa người thụ hưởng thành công
 *       404:
 *         description: Xóa người thụ hưởng thất bại, có thể là do id người thụ hưởng không hợp lệ hoặc không nằm trong danh sách của tài khoản
 *         content:
 *           application/json:
  *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy người thụ hưởng
 *     tags:
 *       - Beneficiaries
 */
router.delete("/:id", deleteBeneficiary);

/**
 * @swagger
 * /beneficiaries/:
 *   put:
 *     summary: Sửa thông tin người thụ hưởng
 *     description: API sửa thông tin người thụ hưởng của tài khoản khách hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *                 description: ID của người thụ hưởng
 *               shortName:
 *                 type: string
 *                 example: Chủ nợ
 *                 description: Tên gợi nhớ
 *               bankName:
 *                 type: string
 *                 example: MyBank
 *                 description: Ngân hàng của người thụ hưởng
 *               accountNumber:
 *                 type: string
 *                 example: 123456789012
 *                 description: Ngân hàng của người thụ hưởng
 *     responses:
 *       200:
 *         description: Thông tin người thụ hưởng đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thông tin người thụ hưởng đã được cập nhật
 *       400:
 *         description: Sửa thông tin người thụ hưởng thất bại. Có thể là do thông tin sửa là của người đã thêm vào danh sách hoặc là bản thân.
 *         content:
 *           application/json:
  *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không thể thêm bản thân
 *       404:
 *         description: Không tìm thấy người thụ hưởng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy người thụ hưởng
 *     tags:
 *       - Beneficiaries
 */
router.put("/", validateMiddleware(updateBeneficiarySchema), updateBeneficiary);

export default router;