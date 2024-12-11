import express from "express";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import { validateExistCustomer } from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/status", validateExistCustomer);

export default router;
