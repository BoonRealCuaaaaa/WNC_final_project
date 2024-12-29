import { models } from "../lib/utils/database/index.js";
import { generateOTP } from "../lib/utils/otp/index.js";
import Decimal from "decimal.js";
import { Op } from "sequelize";
import { sendNotification } from "../services/socket.js";
import { sendOtpMail } from "../services/email.js";
import {
  INTERNAL_TRANSACTION_FEE,
  EXTERNAL_TRANSACTION_FEE,
} from "../constants/transaction-fee.js";
import "dotenv/config";
import {PGPPayTransferApi} from "./interbank.controller.js";

export const generateOtpForDebit = async (req, res) => {
  const { debitId } = req.body;
  const debit = await models.Debits.findOne({ where: { id: debitId } });
  const currentCustomer = await models.Customer.findOne({
    where: { userId: req.user.id },
  });

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
    const debtor = await models.Customer.findOne({
      where: { userId: req.user.id },
    });
    const creditor = await models.Customer.findOne({
      where: { id: debit.creditor },
    });
    const debtorPaymentAccount = await models.Paymentaccount.findOne({
      where: { customerId: debtor.id },
    });
    const creditorPaymentAccount = await models.Paymentaccount.findOne({
      where: { customerId: creditor.id },
    });

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

  console.log(currentCustomer.email);

  sendOtpMail(currentCustomer.email, otp, "OTP thanh toán nợ");

  return res.status(200).json({ message: "OTP generated" });
};

export const payDebit = async (req, res) => {
  const { debitId, otp } = req.body;
  const debit = await models.Debits.findOne({ where: { id: debitId } });

  if (!debit) {
    return res.status(404).json({ message: "Debit not found" });
  }

  const paymentTransaction = await models.Paymenttransaction.findOne({
    where: { id: debit.paymentTransactionsId },
  });
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
  const debtor = await models.Customer.findOne({
    where: { userId: req.user.id },
  });
  const creditor = await models.Customer.findOne({
    where: { id: debit.creditor },
  });
  const debtorPaymentAccount = await models.Paymentaccount.findOne({
    where: { customerId: debtor.id },
  });
  const creditorPaymentAccount = await models.Paymentaccount.findOne({
    where: { customerId: creditor.id },
  });

  const debtorBalance = new Decimal(debtorPaymentAccount.balance);
  const creditorBalance = new Decimal(creditorPaymentAccount.balance);
  const totalAmount = Number(debit.amount) + INTERNAL_TRANSACTION_FEE;
  const amount = new Decimal(totalAmount);

  if (debtorBalance.lessThan(amount)) {
    return res.status(400).json({ message: "Not enough balance" });
  }

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
    message: `${
      debtor.fullName
    } đã thanh toán nợ cho bạn với số tiền ${amount.toString()}`,
    customerId: debit.creditor,
    isRead: false,
  });
  sendNotification(creditor.id, notification);

  return res.status(200).json({ message: "Debit paid" });
};

export const getTransactionHistory = async (req, res) => {
  let id;
  if (req.user.role === "TELLER") {
    id = req.params.id;
  }
  if (req.user.role === "CUSTOMER") {
    id = req.user.id;
  }
  try {
    const account = await models.Paymentaccount.findOne({
      where: { customerId: id },
      attributes: ["accountNumber"],
    });

    if (!account) {
      return res.status(404).json({ error: "Payment account not found." });
    }

    const accountNumber = account.accountNumber;

    const transactions = await models.Paymenttransaction.findAll({
      where: {
        [Op.or]: [{ srcAccount: accountNumber }, { desAccount: accountNumber }],
      },
      order: [["createdAt", "DESC"]],
    });

    const transactionIds = transactions.map((tx) => tx.id);

    const debits = await models.Debits.findAll({
      where: {
        paymentTransactionsId: {
          [Op.in]: transactionIds,
        },
      },
      attributes: ["paymentTransactionsId"],
    });

    // Extract unique related account numbers
    const relatedAccountNumbers = transactions.map((tx) =>
      tx.srcAccount === accountNumber ? tx.desAccount : tx.srcAccount
    );
    const uniqueRelatedAccounts = [...new Set(relatedAccountNumbers)];

    // Bulk fetch related Customers
    const relatedCustomers = await models.Customer.findAll({
      include: {
        model: models.Paymentaccount,
        as: "paymentaccounts",
        where: { accountNumber: uniqueRelatedAccounts },
        attributes: [],
      },
      attributes: ["id", "fullName"],
    });

    // Bulk fetch related Beneficiaries
    const relatedBeneficiaries = await models.Beneficiaries.findAll({
      where: {
        accountNumber: uniqueRelatedAccounts,
        customerId: id,
      },
      attributes: ["accountNumber", "name"],
    });

    // Create maps for quick lookup
    const customerMap = new Map();
    relatedCustomers.forEach((customer) => {
      customer.paymentaccounts.forEach((account) => {
        customerMap.set(account.accountNumber, customer.fullName);
      });
    });

    const beneficiaryMap = new Map();
    relatedBeneficiaries.forEach((beneficiary) => {
      beneficiaryMap.set(beneficiary.accountNumber, beneficiary.name);
    });

    // Assemble transaction history with type and related person
    const transactionsWithType = transactions.map((tx) => {
      const isDebit = debits.some(
        (debit) => debit.paymentTransactionsId === tx.id
      );
      const relatedAccount =
        tx.srcAccount === accountNumber ? tx.desAccount : tx.srcAccount;
      const relatedPerson =
        customerMap.get(relatedAccount) ||
        beneficiaryMap.get(relatedAccount) ||
        "Unknown";

      return {
        ...tx.dataValues,
        type: isDebit
          ? "Thanh toán nhắc nợ"
          : tx.srcAccount === accountNumber
          ? "Chuyển khoản"
          : "Nhận tiền",
        relatedPerson,
        accountNumber:
          tx.srcAccount === accountNumber ? tx.desAccount : tx.srcAccount,
        customerAccountNumber: accountNumber,
      };
    });

    res.status(200).json(transactionsWithType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateOtpForBankTransfer = async (req, res) => {
  const { desBankName, desAccount, amount, content, feePayer } = req.body;

  const customer = await models.Customer.findOne({
    where: { userId: req.user.id },
  });

  const otp = generateOTP();

  let receiver, interbank, fee;

  if (desBankName === process.env.BANK_NAME) {
    //Local banking
    receiver = await models.Paymentaccount.findOne({
      where: { accountNumber: desAccount },
    });
    fee = INTERNAL_TRANSACTION_FEE;
  } else {
    //Interbank banking
    interbank = await models.Partners.findOne({
      where: { bankName: desBankName },
    });

    fee = EXTERNAL_TRANSACTION_FEE;
  }

  if (!receiver && !interbank) {
    return res.status(404).json({ message: "Receiver not found" });
  }

  if (receiver && receiver.customerId === customer.id) {
    return res
      .status(400)
      .json({ message: "Không thể chuyển khoản cho bản thân" });
  }

  const actualAmount = amount - (feePayer === "RECEIVER" ? fee : 0); //So tien nguoi nhan nhan duoc

  if (actualAmount <= 0) {
    return res
      .status(400)
      .json({ message: "Số tiền chuyển thực tế sau phí phải lớn hơn 0đ" });
  }

  const sender = await models.Paymentaccount.findOne({
    where: { customerId: customer.id },
    include: [{ model: models.Customer, as: "customer" }],
  });

  if (sender.balance < amount) {
    return res.status(400).json({ message: "Số dư không đủ" });
  }

  const paymentTransaction = await models.Paymenttransaction.create({
    amount: actualAmount,
    content,
    otp,
    otpExpiredAt: new Date(Date.now() + 10 * 60 * 1000),
    status: "Chưa thanh toán",
    srcAccount: sender.accountNumber,
    srcBankName: process.env.BANK_NAME,
    desAccount,
    desBankName,
    fee,
    feePayer,
  });

  sendOtpMail(customer.email, otp, "OTP xác thực chuyển khoản");

  return res.status(200).json({
    id: paymentTransaction.id,
    amount: paymentTransaction.amount,
    content: paymentTransaction.content,
    desOwner: sender.customer.fullName,
    desAccount: paymentTransaction.desAccount,
    desBankName: paymentTransaction.desBankName,
    fee: paymentTransaction.fee,
    feePayer: paymentTransaction.feePayer,
  });
};

export const payBankTransfer = async (req, res) => {
  const { id, otp } = req.body;

  const customer = await models.Customer.findOne({
    where: { userId: req.user.id },
  });

  const sender = await models.Paymentaccount.findOne({
    where: { customerId: customer.id },
  });

  const transaction = await models.Paymenttransaction.findOne({
    where: {
      id: id,
      srcAccount: sender.accountNumber,
    },
  });

  if (!transaction) {
    return res.status(404).json({ message: "Giao dịch không hợp lệ" });
  }

  if (transaction.otp !== otp) {
    return res.status(400).json({ message: "OTP không hợp lệ" });
  }

  const amount = new Number(transaction.amount);
  const fee = new Number(transaction.fee);
  let senderBalance = new Number(sender.balance);

  if (amount + fee > senderBalance) {
    return res.status(400).json({ message: "Số dư không đủ" });
  }

  let receiver;

  if (transaction.desBankName === process.env.BANK_NAME) {
    //Local banking
    receiver = await models.Paymentaccount.findOne({
      where: { accountNumber: transaction.desAccount },
    });
  } else {
    //Interbank banking
    const partner = await models.Partners.findOne({
      where: { bankName: transaction.desBankName },
    });

    if (!partner) {
      return res.status(500).json({ message: "Lỗi hệ thống (2)" });
    }

    const success = await PGPPayTransferApi(
      req.headers.host,
      partner.domain,
      transaction.desAccount,
      amount,
      partner.ourPrivateKey,
      partner.partenerPublicKey
    );

    if (success) {
      senderBalance -= amount + fee;
      sender.balance = senderBalance;
      transaction.status = "Đã thanh toán";

      sender.save();
      transaction.save();

      return res.status(200).json({ message: "Chuyển khoản thành công" });
    } else {
      return res.status(200).json({ message: "Chuyển khoản thất bại" });
    }
  }

  if (!receiver) {
    return res.status(404).json({ message: "Người nhận không tồn tại" });
  }
  if (receiver.customerId === customer.id) {
    return res
      .status(400)
      .json({ message: "Không thể chuyển khoản cho bản thân" });
  }

  let receiverBalance = new Number(receiver.balance);

  //Start transfering
  console.log({
    senderBalance,
    receiverBalance,
    newSender: senderBalance - amount + fee,
    newReceiver: receiverBalance + amount,
  });
  senderBalance -= amount + fee;
  sender.balance = senderBalance;
  receiverBalance += amount;
  receiver.balance = receiverBalance;
  transaction.status = "Đã thanh toán";

  sender.save();
  receiver.save();
  transaction.save();

  return res.status(200).json({ message: "Chuyển khoản thành cônng" });
};
