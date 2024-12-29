import { models } from "../lib/utils/database/index.js";
import axios from "axios";
import { generateHash, generateRSASignature, verifyPGPSignature } from "../lib/utils/cryptoUtils/index.js";
import "dotenv/config";
import Decimal from "decimal.js";

export const PGPSearchAccountApi = async (domain, accountNumber) => {
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


export const PGPPayTransferApi = async (ourDomain, partnerDomain, accountNumber, amount, privateKey, parnerPublicKey) => {
  const payload = {
    accountNumber,
    amount,
  }

  try {
    const desUrl = `/interbanks/handle-trade-interbank`;
    const time = Date.now();
    const data = (
      await axios.post("http://" +partnerDomain + desUrl, {
        payload,
        time: time,
        domain: ourDomain,
        token: generateHash(
          "sha256",
          desUrl + "" + time + "" + process.env.SECRET_KEY
        ),
        signature: generateRSASignature(JSON.stringify(payload), privateKey)
      })
    ).data;
    
    const {message, signature} = data;
    
    const isValidSignature = await verifyPGPSignature(JSON.stringify({message}), signature, parnerPublicKey)

    if (message === 'success' && isValidSignature) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(error);
  }
};

export const handleTradeInterbank = async (req, res) => {
  const accountNumber = req.body.payload.accountNumber || "";
  const amount = isNaN(req.body.payload.amount) ? 0 : Number(req.body.payload.amount);
  
  const domain = req.body.domain;

  const failMessage = JSON.stringify({message: "fail"});
  const successMessage = JSON.stringify({message: "success"});
  
  const partner = await models.Partners.findOne({where: {domain}});

  if (amount < 1000) {
    return res
    .status(400)
    .json({ message: "fail", signature: generateRSASignature(failMessage, partner.ourPrivateKey)});
  }

  if (!partner) {
    res
    .status(400)
    .json({ message: "fail",signature: generateRSASignature(failMessage, partner.ourPrivateKey)});
  }
  
  const paymentAccount = await models.Paymentaccount.findOne({
    where: { accountNumber: accountNumber },
  });

  const balance = new Decimal(paymentAccount.balance);
  paymentAccount.balance = balance
      .plus(new Decimal(amount))
      .toString();

      paymentAccount.save();

  try {
    return res
      .status(200)
      .json({message: "success", signature: generateRSASignature(successMessage, partner.ourPrivateKey)});
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: "fail", signature: generateRSASignature(failMessage, partner.ourPrivateKey)});
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
      .status(200)
      .json({ code: 0, account: { } });
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
    const account = await PGPSearchAccountApi(
      partnerDomain,
      accountNumber
    );
    return res.status(200).json(account);
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
  }
};
