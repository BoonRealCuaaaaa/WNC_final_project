import { models } from "../lib/utils/database/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

export const createDebit = async (req, res) => {
   const { accountNumber, amount, content } = req.body;
   const creditor = await models.Customer.findOne({ where: { userId: req.user.id } });
   const debtorAccount = await models.Paymentaccount.findOne({ where: { accountNumber: accountNumber } });

   if (!creditor) {
      return res.status(404).json({ message: "Creditor not found" });
   }

   const debitEntity = models.Debits.create({
      amount: amount,
      content: content,
      creditorId: creditor.id,
      debtor: debtorAccount.customerId,
      status:"Chưa thanh toán",
      
   });

   return res.status(201).json({ message: "Debit created" });
};
