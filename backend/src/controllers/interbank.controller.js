import { models } from "../lib/utils/database/index.js";
import axios from "axios";
import {
  generateHash,
  generateSignature,
  verifySignature,
} from "../lib/utils/cryptoUtils/index.js";
import * as dotenv from "dotenv";
import Decimal from "decimal.js";
dotenv.config();

export const RSASearchAccountApi = async (domain, accountNumber, secretKey) => {
  try {
    const desUrl = `/interbanks/handle-search-interbank-account`;
    const time = Date.now();
    const data = (
      await axios.post("http://" + domain + desUrl, {
        payload: {
          accountNumber: accountNumber,
        },
        time: time,
        domain: domain,
        token: generateHash(
          "sha256",
          desUrl + "" + time + "" + secretKey,
          secretKey
        ),
      })
    ).data;
    console.log(data);
    return data?.account;
  } catch (error) {
    console.error(error);
  }
};

export const PGPSearchAccountApi = async (domain, accountNumber, secretKey) => {
  try {
    const desUrl = `/api/transfer/external/account-info`;
    const time = Date.now();
    const bankCode = process.env.BANK_NAME || "MyBank";
    const data = (
      await axios.post("http://" + domain + desUrl, {
        bank_code: bankCode,
        account_number: accountNumber,
        timestamp: time,
        hash: generateHash(
          "sha256",
          JSON.stringify({
            bank_code: bankCode,
            account_number: accountNumber,
            timestamp: time,
          }),
          secretKey
        ),
      })
    ).data;
    return { accountNumber: data.account_number, fullName: data.id };
  } catch (error) {
    console.error(error);
  }
};

export const PGPPayTransferApi = async (
  partnerDomain,
  accountNumber,
  amount,
  privateKey,
  partnerPublicKey,
  partnerAlgo,
  partnerSecretKey
) => {
  try {
    const desUrl = `/api/transfer/external/deposit`;
    const time = Date.now();
    const bankCode = process.env.BANK_NAME || "MyBank";
    const payload = {
      bank_code: bankCode,
      account_number: accountNumber,
      amount,
      timestamp: time,
    };

    const data = (
      await axios.post("http://" + partnerDomain + desUrl, {
        bank_code: bankCode,
        account_number: accountNumber,
        amount,
        timestamp: time,
        signature: await generateSignature(
          process.env.ASYMMETRIC_ENCRYPTION_ALGORITHM || "RSA",
          JSON.stringify(payload),
          privateKey
        ),
        hash: generateHash("sha256", JSON.stringify(payload), partnerSecretKey),
      })
    ).data;

    const { account_number, new_balance, bank_code, signature } = data;

    const isValidSignature = await verifySignature(
      partnerAlgo,
      JSON.stringify({ account_number, new_balance, bank_code }),
      signature,
      partnerPublicKey
    );

    if (isValidSignature) {
      return true;
    }

    return false;
  } catch (error) {
    console.error(error);
  }
};

export const RSAPayTransferApi = async (
  ourDomain,
  partnerDomain,
  accountNumber,
  amount,
  srcAccount,
  content,
  privateKey,
  partnerPublicKey,
  partnerAlgo,
  partnerSecretKey
) => {
  const payload = {
    accountNumber,
    amount,
    srcAccount,
    content,
  };

  try {
    const desUrl = `/interbanks/handle-trade-interbank`;
    const time = Date.now();
    const data = (
      await axios.post("http://" + partnerDomain + desUrl, {
        payload,
        time: time,
        domain: ourDomain,
        token: generateHash(
          "sha256",
          desUrl + "" + time + "" + partnerSecretKey,
          partnerSecretKey
        ),
        signature: await generateSignature(
          process.env.ASYMMETRIC_ENCRYPTION_ALGORITHM || "RSA",
          JSON.stringify(payload),
          privateKey
        ),
      })
    ).data;

    const { message, signature } = data;

    const isValidSignature = await verifySignature(
      partnerAlgo,
      JSON.stringify({ message }),
      signature,
      partnerPublicKey
    );

    if (message === "success" && isValidSignature) {
      return true;
    }

    return false;
  } catch (error) {
    console.error(error);
  }
};

export const handleTradeInterbank = async (req, res) => {
  const accountNumber = req.body.payload.accountNumber || "";
  const amount = isNaN(req.body.payload.amount)
    ? 0
    : Number(req.body.payload.amount);
  const srcAccount = req.body.payload.srcAccount || "";
  const content = req.body.payload.content || "";

  const partner = req["bank"];
  const partenerAlgo = process.env.ASYMMETRIC_ENCRYPTION_ALGORITHM || "RSA";

  const failMessage = JSON.stringify({ message: "fail" });
  const successMessage = JSON.stringify({ message: "success" });

  if (amount < 1000) {
    return res.status(400).json({
      message: "fail",
      signature: await generateSignature(
        partenerAlgo,
        failMessage,
        partner.ourPrivateKey
      ),
    });
  }

  const paymentAccount = await models.Paymentaccount.findOne({
    where: { accountNumber: accountNumber },
  });

  const balance = new Decimal(paymentAccount.balance);
  paymentAccount.balance = balance.plus(new Decimal(amount)).toString();

  paymentAccount.save();

  await models.Paymenttransaction.create({
    amount: amount,
    content,
    otp: "",
    otpExpiredAt: new Date(),
    status: "Đã thanh toán",
    srcAccount,
    srcBankName: partner.bankName,
    desAccount: accountNumber,
    desBankName: process.env.BANK_NAME,
  });

  try {
    return res.status(200).json({
      message: "success",
      signature: await generateSignature(
        partenerAlgo,
        successMessage,
        partner.ourPrivateKey
      ),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "fail",
      signature: await generateSignature(
        partenerAlgo,
        failMessage,
        partner.ourPrivateKey
      ),
    });
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

  console.log(account);

  try {
    return res.status(200).json({
      code: 1,
      account: {
        accountNumber,
        fullName: account ? account.customer.fullName : "",
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json({ code: 0, account: {} });
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
    let account = null;
    if (partner.partenerAlgo.toUpperCase() === "RSA") {
      account = await RSASearchAccountApi(
        partnerDomain,
        accountNumber,
        partner.partenerSecretKey
      );
    } else {
      account = await PGPSearchAccountApi(
        partnerDomain,
        accountNumber,
        partner.partenerSecretKey
      );
    }
    return res.status(200).json(account);
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
  }
};
