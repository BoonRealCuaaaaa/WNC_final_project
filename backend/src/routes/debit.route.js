import express from "express";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import { createDebit } from "../controllers/debit.controller.js";

const router = express.Router();

router.post("/", createDebit);

export default router;
