import { models } from "../lib/utils/database/index.js";
import { PGPSearchAccountApi } from "./interbank.controller.js";

export const getBeneficiaries = async (req, res) => {
  const customer = await models.Customer.findOne({
    where: { userId: req.user.id },
    attributes: ["id"],
  });
  const beneficiaries = await models.Beneficiaries.findAll({
    where: { customerId: customer.id },
  });

  return res.status(200).json(beneficiaries);
};

export const createBeneficiary = async (req, res) => {
  const { shortName, bankName, accountNumber } = req.body;

  const customer = await models.Customer.findOne({
    where: { userId: req.user.id },
    attributes: ["id"],
  });

  const beneficiary = await models.Beneficiaries.findOne({
    where: { bankName, accountNumber, customerId: customer.id },
  });

  if (beneficiary) {
    return res
      .status(400)
      .json({ message: `${accountNumber} in ${bankName} bank is existed` });
  }

  const paymentAccount = await models.Paymentaccount.findOne({where: {customerId: customer.id}});

  if (paymentAccount.accountNumber === accountNumber) {
    return res.status(400).json({ message: "Không thể thêm bản thân" });
  } 

  let receiver;

  if (bankName === process.env.BANK_NAME) {
    //Local
    receiver = await models.Paymentaccount.findOne({
      where: { accountNumber },
    });
  } else {
    //Interbank
    receiver = await PGPSearchAccountApi(bankName, accountNumber);
  }

  if (!receiver) {
    return res.status(404).json({ message: "Receiver not found" });
  }

  const beneficiaryEntity = await models.Beneficiaries.create({
    shortName,
    bankName,
    accountNumber,
    customerId: customer.id,
  });

  return res.status(201).json({ message: "Beneficiary created" });
};

export const deleteBeneficiary = async (req, res) => {
  const id = parseInt(req.params.id);

  const customer = await models.Customer.findOne({
    where: { userId: req.user.id },
    attributes: ["id"],
  });

  const beneficiary = await models.Beneficiaries.findOne({
    where: { id },
    include: {
      model: models.Customer,
      as: "customer",
      where: { id: customer.id },
    },
  });

  if (!beneficiary) {
    return res.status(404).json({ message: "Beneficiary not found" });
  }

  beneficiary.destroy();

  return res.status(200).json({ message: "Beneficiary deleted" });
};

export const updateBeneficiary = async (req, res) => {
  const { id, bankName, shortName, accountNumber } = req.body;

  const customer = await models.Customer.findOne({
    where: { userId: req.user.id },
    attributes: ["id"],
  });

  const beneficiary = await models.Beneficiaries.findOne({
    where: { id },
    include: {
      model: models.Customer,
      as: "customer",
      where: { id: customer.id },
    },
  });

  if (!beneficiary) {
    return res.status(404).json({ message: "Beneficiary not found" });
  }

  beneficiary.bankName = bankName;
  beneficiary.shortName = shortName;
  beneficiary.accountNumber = accountNumber;

  beneficiary.save();

  return res.status(200).json({ message: "Beneficiary updated" });
};
