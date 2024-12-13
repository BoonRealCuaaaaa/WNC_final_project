import { models } from "../lib/utils/database/index.js";
import { generateOTP } from "../lib/utils/otp/index.js";
import Decimal from "decimal.js";
import { sendNotification } from "../services/socket.js";

export const generateOtpForDebit = async (req, res) => {
   const { debitId } = req.body;
   const debit = await models.Debits.findOne({ where: { id: debitId } });
   const otp = generateOTP();

   if (!debit) {
      return res.status(404).json({ message: "Debit not found" });
   }

   if (debit.paymentTransactionsId !== null) {
      console.log(debit);
      const paymentTransaction = await models.Paymenttransaction.findOne({
         where: { id: debit.paymentTransactionsId },
      });
      paymentTransaction.otp = otp;
      paymentTransaction.otpExpiredAt = new Date(Date.now() + 300000);
      paymentTransaction.save();
   } else {
      const debtor = await models.Customer.findOne({ where: { userId: req.user.id } });
      const creditor = await models.Customer.findOne({ where: { id: debit.creditor } });
      const debtorPaymentAccount = await models.Paymentaccount.findOne({ where: { customerId: debtor.id } });
      const creditorPaymentAccount = await models.Paymentaccount.findOne({ where: { customerId: creditor.id } });

      const newPaymentTransaction = await models.Paymenttransaction.create({
         amount: debit.amount,
         otp: otp,
         otpExpiredAt: new Date(Date.now() + 10 * 60 * 1000),
         status: "Chưa thanh toán",
         srcAccount: debtorPaymentAccount.accountNumber,
         srcBankName: "OWN_BANK",
         desAccount: creditorPaymentAccount.accountNumber,
         desBankName: "OWN_BANK",
      });

      debit.paymentTransactionsId = newPaymentTransaction.id;
      console.log(debit);
      debit.save();
      newPaymentTransaction.save();
   }

   return res.status(200).json({ message: "OTP generated" });
};

export const payDebit = async (req, res) => {
   const { debitId, otp } = req.body;
   const debit = await models.Debits.findOne({ where: { id: debitId } });

   if (!debit) {
      return res.status(404).json({ message: "Debit not found" });
   }

   const paymentTransaction = await models.Paymenttransaction.findOne({ where: { id: debit.paymentTransactionsId } });
   if (!paymentTransaction) {
      return res.status(404).json({ message: "Payment transaction not found" });
   }

   if (paymentTransaction.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
   }

   if (paymentTransaction.otpExpiredAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
   }

   //TODO: refactor
   const debtor = await models.Customer.findOne({ where: { userId: req.user.id } });
   const creditor = await models.Customer.findOne({ where: { id: debit.creditor } });
   const debtorPaymentAccount = await models.Paymentaccount.findOne({ where: { customerId: debtor.id } });
   const creditorPaymentAccount = await models.Paymentaccount.findOne({ where: { customerId: creditor.id } });

   const debtorBalance = new Decimal(debtorPaymentAccount.balance);
   const creditorBalance = new Decimal(creditorPaymentAccount.balance);
   const amount = new Decimal(debit.amount);

   debtorPaymentAccount.balance = debtorBalance.minus(amount).toString();
   creditorPaymentAccount.balance = creditorBalance.plus(amount).toString();
   debit.status = "Đã thanh toán";
   paymentTransaction.status = "Đã thanh toán";
   debtorPaymentAccount.save();
   creditorPaymentAccount.save();
   debit.save();
   paymentTransaction.save();

   const notification = await models.Notification.create({
      title: "Đã thanh toán nợ",
      message: `${debtor.fullName} đã thanh toán nợ cho bạn với số tiền ${amount.toString()}`,
      customerId: debit.creditor,
      isRead: false,
   });
   sendNotification(creditor.id, notification);

   return res.status(200).json({ message: "Debit paid" });
};
