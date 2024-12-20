import express from "express";
import {
  changePassword,
  getPaymentAccount,
  validateExistCustomer,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/status", validateExistCustomer);

router.get("/payment-account", getPaymentAccount);

router.post("/change-password", changePassword);

export default router;
