import { validRequest, validSignature } from "../middlewares/secure-interbank.middleware.js";
import { tradeInterbankSchema, searchAccountsSchema } from "../schemas/interbank.schema.js";
import {tradeInterbank, searchAccounts} from "../controllers/interbank.controller.js";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import express from "express";

const router = express.Router();

router.post("/trade", validateMiddleware(tradeInterbankSchema), validRequest, validSignature, tradeInterbank);
router.post("/search-accounts", validateMiddleware(searchAccountsSchema), validRequest, searchAccounts);

export default router;