import { validRequest, validSignature } from "../middlewares/secure-interbank.middleware.js";
import { handleSearchInterbankAccountSchema, searchInterbankAccountSchema, handleTradeInterbankSchema} from "../schemas/interbank.schema.js";
import {handleTradeInterbank, searchInterbankAccount, handleSearchInterbankAccount, } from "../controllers/interbank.controller.js";
import validateMiddleware from "../middlewares/ajv-validate.middleware.js";
import { verifyToken } from "../middlewares/authenticate.middleware.js";

import express from "express";
const router = express.Router();

router.post("/handle-trade-interbank", validateMiddleware(handleTradeInterbankSchema), validRequest, validSignature, handleTradeInterbank);
router.post("/handle-search-interbank-account", validateMiddleware(handleSearchInterbankAccountSchema), validRequest, handleSearchInterbankAccount);
router.post("/search-interbank-account", verifyToken, validateMiddleware(searchInterbankAccountSchema), searchInterbankAccount);

export default router;