import express from "express";
import {
  createCustomerAccount,
  depositToAccount,
  getAllCustomerAccount,
} from "../controllers/teller.controller.js";
import { getTransactionHistory } from "../controllers/payment-transaction.controller.js";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import {
  createCustomerAccountSchema,
  depositToAccountSchema,
} from "../schemas/customer.schema.js";
const router = express.Router();

router.post(
  "/customer/create",
  validateMiddleware(createCustomerAccountSchema),
  createCustomerAccount
);
router.post(
  "/deposit",
  validateMiddleware(depositToAccountSchema),
  depositToAccount
);
router.get("/customer/:id/history", getTransactionHistory);
router.get("/customer", getAllCustomerAccount);
export default router;
