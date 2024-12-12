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

   if (!debtorAccount) {
      return res.status(404).json({ message: "Debtor not found" });
   }

   const debitEntity = await models.Debits.create({
      amount: amount,
      content: content,
      creditor: creditor.id,
      debtor: debtorAccount.customerId,
      status: "Chưa thanh toán",
   });

   return res.status(201).json({ message: "Debit created" });
};

export const getCreatedDebit = async (req, res) => {
   const customer = await models.Customer.findOne({ where: { userId: req.user.id }, attributes: ["id"] });
   const debits = await models.Debits.findAll({
      where: { creditor: customer.id },
      include: [{ model: models.Customer, as: "debtorCustomer", attributes: ["id", "fullName"] }],
   });

   const flattenedDebits = debits.map((debit) => ({
      id: debit.id,
      amount: debit.amount,
      content: debit.content,
      creditor: debit.creditor,
      debtor: debit.debtor,
      status: debit.status,
      createdAt: debit.createdAt,
      updatedAt: debit.updatedAt,
      fullName: debit.debtorCustomer?.fullName,
   }));

   return res.status(200).json(flattenedDebits);
};

export const getReceivedDebit = async (req, res) => {
   const customer = await models.Customer.findOne({ where: { userId: req.user.id }, attributes: ["id"] });
   const debits = await models.Debits.findAll({
      where: { debtor: customer.id },
      include: [{ model: models.Customer, as: "creditorCustomer", attributes: ["id", "fullName"] }],
   });

   const flattenedDebits = debits.map((debit) => ({
      id: debit.id,
      amount: debit.amount,
      content: debit.content,
      creditor: debit.creditor,
      debtor: debit.debtor,
      status: debit.status,
      createdAt: debit.createdAt,
      updatedAt: debit.updatedAt,
      fullName: debit.creditorCustomer?.fullName,
   }));

   return res.status(200).json(flattenedDebits);
};
