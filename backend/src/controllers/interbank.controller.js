import { models } from "../lib/utils/database/index.js";
import axios from "axios";
import { generateHash } from "../lib/utils/cryptoUtils/index.js";
import dotenv from "dotenv";
dotenv.config();

const PartnerSearchAccountPrototype = {};

const PGSearchAccountApi = async (domain, accountNumber) => {
  try {
    const desUrl = `/interbanks/handle-search-interbank-account`;
    const time = Date.now();
    const data = (
      await axios.post(domain + desUrl, {
        payload: {
          accountNumber: accountNumber,
        },
        time: time,
        domain: domain,
        token: generateHash(
          "sha256",
          desUrl + "" + time + "" + process.env.SECRET_KEY
        ),
      })
    ).data;
    console.log(data);
    return data?.account;
  } catch (error) {
    console.error(error);
  }
};

PartnerSearchAccountPrototype["PG"] = PGSearchAccountApi;

export const tradeInterbank = async (req, res) => {
  const {
    payload: { amount, desAccount, otp, paymentTransactionId },
  } = req.body;

  const transaction = await models.sequelize.transaction(); // Start a transaction

  try {
    const paymentTransaction = await models.Paymenttransaction.findOne(
      {
        where: { id: paymentTransactionId },
      },
      {
        transaction: transaction,
      }
    );

    if (!paymentTransaction) {
      return res.status(404).json({ message: "Payment transaction not found" });
    }

    if (paymentTransaction.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (paymentTransaction.otpExpiredAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const receiverPaymentAccount = await models.Paymentaccount.findOne(
      {
        accountNumber: paymentTransaction.desAccount,
      },
      {
        transaction: transaction,
      }
    );

    if (!receiverPaymentAccount || !amount) {
      return res
        .status(400)
        .json({
          code: 0,
          message: "Bad request: Invalid account number or amount",
        });
    }

    paymentTransaction.status = "Đã thanh toán";
    const balance = new Decimal(receiverPaymentAccount.balance);
    receiverPaymentAccount.balance = balance
      .plus(new Decimal(amount))
      .toString();

    paymentTransaction.save();
    receiverPaymentAccount.save();

    await transaction.commit(); // Commit transaction

    const payload = { code: 1, message: "success" };

    return res
      .status(200)
      .json({ ...payload, signature: generateSignature(payload) });
  } catch (error) {
    await transaction.rollback(); // Rollback on error
    console.error(error);
    const payload = { code: 1, message: "fail" };
    return res
      .status(400)
      .json({ ...payload, signature: generateSignature(payload) });
  }
};

export const handleSearchInterbankAccount = async (req, res) => {
  const accountNumber = req.body.payload.accountNumber || "";

  const account = await models.Paymentaccount.findOne({
    where: { accountNumber: accountNumber },
    include: [
      {
        model: models.Customer,
        as: "customer",
        required: true,
      },
    ],
  });

  try {
    return res
      .status(200)
      .json({
        code: 1,
        account: {
          accountNumber,
          fullName: account ? account.customer.fullName : "",
        },
      });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ code: 0, account: { accountNumber, fullName } });
  }
};

export const searchInterbankAccount = async (req, res) => {
  const { bankName, accountNumber } = req.body;

  const partner = await models.Partners.findOne({ where: { bankName } });

  if (!partner) {
    return res
      .status(400)
      .json({ code: 0, message: "Bad request: BankName is not existed" });
  }

  const partnerDomain = partner.domain;

  try {
    if (!PartnerSearchAccountPrototype[bankName]) {
      return res.status(400).json({});
    }

    const account = await PartnerSearchAccountPrototype[bankName](
      partnerDomain,
      accountNumber
    );
    return res.status(200).json(account);
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
  }
};
