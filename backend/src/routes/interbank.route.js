import { validRequest, validSignature } from "../middlewares/secure-interbank.middleware.js";
import { tradeInterbankSchema, handleSearchInterbankAccountSchema, searchInterbankAccountSchema} from "../schemas/interbank.schema.js";
import {tradeInterbank, searchInterbankAccount, handleSearchInterbankAccount} from "../controllers/interbank.controller.js";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import { verifyToken } from "../middlewares/authenticate.middleware.js";

import express from "express";
const router = express.Router();

router.post("/trade", validateMiddleware(tradeInterbankSchema), validRequest, validSignature, tradeInterbank);
router.post("/handle-search-interbank-account", validateMiddleware(handleSearchInterbankAccountSchema), validRequest, handleSearchInterbankAccount);
router.post("/search-interbank-account", verifyToken, validateMiddleware(searchInterbankAccountSchema), searchInterbankAccount);

export default router;