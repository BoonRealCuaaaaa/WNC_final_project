import express from "express";
import { getPaymentAccount, validateExistCustomer } from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/status", validateExistCustomer);
router.get("/payment-account", getPaymentAccount);

export default router;
