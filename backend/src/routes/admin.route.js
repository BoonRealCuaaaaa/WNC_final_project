import express from "express";
import {
  getTellers,
  addTeller,
  getTransactions,
  updateTeller,
  deleteTeller,
  addPartner,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/tellers", getTellers);
router.post("/tellers", addTeller);
router.patch("/tellers/:tellerId", updateTeller);
router.delete("/tellers/:tellerId", deleteTeller);
router.get("/transactions-history", getTransactions);
router.post("/partner", addPartner);

export default router;
