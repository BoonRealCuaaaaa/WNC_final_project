import "dotenv/config";
import { models } from "../lib/utils/database/index.js";
import { generateAccountNumber } from "../lib/helper/account.helper.js";
import { hashPassword } from "../lib/utils/bcrypt/index.js";

export const createCustomerAccount = async (req, res) => {
  const { username, password, fullName, email, phone } = req.body;
  try {
    const existingUser = await models.User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await hashPassword(password);

    const user = await models.User.create({
      username,
      password: hashedPassword,
      role: "CUSTOMER",
    });
    const customer = await models.Customer.create({
      fullName,
      email,
      phone,
      userId: user.id,
    });

    let accountNumber;
    let exists = true;

    while (exists) {
      accountNumber = generateAccountNumber();
      const existingAccount = await models.Paymentaccount.findOne({
        where: { accountNumber },
      });
      if (!existingAccount) {
        exists = false;
      }
    }

    await models.Paymentaccount.create({
      accountNumber,
      balance: 0,
      customerId: customer.id,
    });
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const depositToAccount = async (req, res) => {
  console.log("depositToAccount");
  const { accountNumber, amount } = req.body;
  try {
    const account = await models.Paymentaccount.findOne({
      where: { accountNumber },
    });
    if (!account) {
      return res.status(404).json({ message: "Account does not exist" });
    }
    account.balance = Number(account.balance) + Number(amount);
    await account.save();
    res.status(200).json({ message: "Deposit successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
