import express from "express";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import { createBeneficiary, deleteBeneficiary, getBeneficiaries, updateBeneficiary } from "../controllers/beneficiary.controller.js";
import { createBeneficiarySchema } from "../schemas/beneficiary.schema.js";

const router = express.Router();

router.get("/", getBeneficiaries);
router.post("/", validateMiddleware(createBeneficiarySchema),createBeneficiary);
router.delete("/:id", deleteBeneficiary);
router.put("/", updateBeneficiary);

export default router;