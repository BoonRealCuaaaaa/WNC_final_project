import express from "express";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import { cancelDebit, createDebit, getCreatedDebit, getReceivedDebit } from "../controllers/debit.controller.js";

const router = express.Router();

router.post("/", createDebit);
router.get("/created", getCreatedDebit);
router.get("/received", getReceivedDebit);
router.post("/cancel", cancelDebit);

export default router;
