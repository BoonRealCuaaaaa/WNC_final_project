import express from "express";
import {
  getPaymentAccount,
  validateExistCustomer,
  validateUsernameExist,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/status", validateExistCustomer);
router.post("/username/status", validateUsernameExist);
router.get("/payment-account", getPaymentAccount);

export default router;
