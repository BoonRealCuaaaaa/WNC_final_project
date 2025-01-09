import { where } from "sequelize";
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

  console.log(req.body);

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

  let receiver, name;

  if (bankName === process.env.BANK_NAME) {
    //Local
    receiver = await models.Paymentaccount.findOne({
      where: { accountNumber },
    });
  } else {
    //Interbank
    const partner = await models.Partners.findOne({
      where: { bankName },
    });
  
    receiver = await PGPSearchAccountApi(partner.domain, accountNumber, partner.partenerSecretKey);
  }

  if (!receiver) {
    return res.status(404).json({ message: "Không tìm thấy người thụ hưởng" });
  }

  if (bankName === process.env.BANK_NAME) {
    const receiverInfo = await models.Customer.findOne({
      where: { id: receiver.customerId}
    })
    name = receiverInfo.fullName;
  }
  else {
    //TODO: Add search name interbank
    name = receiver.fullName;
  }

  const beneficiaryEntity = await models.Beneficiaries.create({
    name,
    shortName,
    bankName,
    accountNumber,
    customerId: customer.id,
  });

  return res.status(201).json({ message: "Thêm người thụ hưởng thành công" });
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
    return res.status(404).json({ message: "Không tìm thấy người thụ hưởng" });
  }

  beneficiary.destroy();

  return res.status(200).json({ message: "Xóa người thụ hưởng thành công" });
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
    return res.status(404).json({ message: "Không tìm thấy người thụ hưởng" });
  }

  const beneficiaryTemp = await models.Beneficiaries.findOne({
    where: { accountNumber, bankName },
    include: {
      model: models.Customer,
      as: "customer",
      where: { id: customer.id },
    }
  });

  if (beneficiaryTemp && beneficiaryTemp.id !== id) {
    return res
      .status(400)
      .json({ message: `${accountNumber} in ${bankName} bank is existed` });
  }

  const paymentAccount = await models.Paymentaccount.findOne({where: {customerId: customer.id}});

  if (paymentAccount.accountNumber === accountNumber) {
    return res.status(400).json({ message: "Không thể thêm bản thân" });
  } 

  beneficiary.bankName = bankName;
  beneficiary.shortName = shortName;
  beneficiary.accountNumber = accountNumber;

  beneficiary.save();

  return res.status(200).json({ message: "Thông tin người thụ hưởng đã được cập nhật" });
};
