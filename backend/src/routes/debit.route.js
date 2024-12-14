import express from "express";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import { cancelDebit, createDebit, getCreatedDebit, getReceivedDebit } from "../controllers/debit.controller.js";
import { cancelDebitSchema, createDebitSchema } from "./../schemas/debit.schema.js";

const router = express.Router();

router.post("/", validateMiddleware(createDebitSchema), createDebit);
router.get("/created", getCreatedDebit);
router.get("/received", getReceivedDebit);
router.post("/cancel", validateMiddleware(cancelDebitSchema), cancelDebit);

export default router;
