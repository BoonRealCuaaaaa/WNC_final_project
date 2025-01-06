import "dotenv/config";
import { models } from "../lib/utils/database/index.js";
import { comparePassword, hashPassword } from "../lib/utils/bcrypt/index.js";

export const validateExistCustomer = async (req, res) => {
  const { accountNumber } = req.body;

  if (!accountNumber) {
    return res.status(400).json({ message: "Account number is required" });
  }
  const data = await models.Paymentaccount.findOne({
    where: { accountNumber },
    include: { model: models.Customer, as: "customer" },
  });

  if (!data) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const customer = data.customer.dataValues;

  return res.status(200).json({ fullName: customer.fullName });
};

export const validateUsernameExist = async (req, res) => {
  const { username } = req.body;

  const data = await models.User.findOne({ where: { username } });

  if (!data) {
    return res.status(404).json({ message: "Username not found" });
  }

  return res.status(200).json({ message: "Username exists" });
};

export const getPaymentAccount = async (req, res) => {
  const data = await models.Paymentaccount.findOne({
    include: {
      model: models.Customer,
      as: "customer",
      where: { userId: req.user.id },
    },
  });

  if (!data) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const paymentAccount = data.dataValues;

  return res.status(200).json({
    accountNumber: paymentAccount.accountNumber,
    balance: paymentAccount.balance,
  });
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await models.User.findByPk(req.user.id);

  if (!(await comparePassword(oldPassword, user.password))) {
    return res.status(402).json({ message: "Old password is incorrect" });
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();
  return res.status(200).json({ message: "Password changed" });
};