import express from "express";
import { getBeneficiaries } from "../controllers/beneficiaries.controller.js";

const router = express.Router();

router.get("/", getBeneficiaries);

export default router;
