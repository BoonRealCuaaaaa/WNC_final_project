import express from "express";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import { createBeneficiary, deleteBeneficiary, getBeneficiaries, updateBeneficiary } from "../controllers/beneficiary.controller.js";
import { createBeneficiarySchema } from "../schemas/beneficiary.schema.js";

const router = express.Router();

/**
 * @swagger
 * /beneficiaries/:
 *   get:
 *     summary: Lấy danh sách người thụ hưởng
 *     description: API lấy danh sách người thụ hưởng của tài khoản khách hàng gọi tới
 *     responses:
 *       200:
 *         description: Lấy thành công
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
 *     tags:
 *       - Beneficiaries
 */
router.get("/", getBeneficiaries);
router.post("/", validateMiddleware(createBeneficiarySchema),createBeneficiary);
router.delete("/:id", deleteBeneficiary);
router.put("/", updateBeneficiary);

export default router;