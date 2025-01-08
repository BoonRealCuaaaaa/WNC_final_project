/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       404:
 *         description: User không tồn tại
 *       402:
 *         description: Mật khẩu không chính xác hoặc User đang bị khóa
 */

import express from "express";
import { models } from "../lib/utils/database/index.js";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import { loginSchema, refreshTokenSchema } from "../schemas/auth.schema.js";
import {
  generateOtpForForgotPassword,
  login,
  refreshToken,
  resetPassword,
  verifyOtpForForgotPassword,
  forgotPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", validateMiddleware(loginSchema), login);

router.post(
  "/refresh-token",
  validateMiddleware(refreshTokenSchema),
  refreshToken
);

router.post("/otp", generateOtpForForgotPassword);

router.post("/verify-otp", verifyOtpForForgotPassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
