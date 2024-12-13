import { models } from "../lib/utils/database/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config";
import { sendNotification } from "../services/socket.js";

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

export const cancelDebit = async (req, res) => {
   const { id, reason } = req.body;
   const user = req.user;

   const currentCustomer = await models.Customer.findOne({ where: { userId: user.id } });

   const debit = await models.Debits.findOne({ where: { id: id } });

   if (!debit) {
      return res.status(404).json({ message: "Debit not found" });
   }
   debit.status = "Đã hủy";
   debit.cancelReason = reason;
   await debit.save();

   if (currentCustomer.id == debit.debtor) {
      const notification = await models.Notification.create({
         title: "Debit canceled",
         message: `Debit ${debit.id} has been canceled`,
         customerId: debit.creditor,
         isRead: false,
      });

      sendNotification(debit.creditor, notification);
   } else {
      const notification = await models.Notification.create({
         title: "Debit canceled",
         message: `Debit ${debit.id} has been canceled`,
         customerId: debit.debtor,
         isRead: false,
      });
      
      sendNotification(debit.debtor, notification);
   }

   return res.status(200).json({ message: "Debit canceled" });
};
