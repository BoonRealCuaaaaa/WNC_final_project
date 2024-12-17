import express from "express";
import { models } from "../lib/utils/database/index.js";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import { loginSchema, refreshTokenSchema } from "../schemas/auth.schema.js";
import { login, refreshToken , forgotPassword, resetPassword} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", validateMiddleware(loginSchema), login);

router.post("/refresh-token", validateMiddleware(refreshTokenSchema), refreshToken);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);
export default router;
