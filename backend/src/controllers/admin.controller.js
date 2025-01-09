import "dotenv/config";
import { models } from "../lib/utils/database/index.js";
import User from "../models/User.js";
import { col, where } from "sequelize";
import { sequelize } from "../lib/utils/database/index.js";
import { hashPassword } from "../lib/utils/bcrypt/index.js";
import { Op } from "sequelize";

export const getTellers = async (req, res) => {
  try {
    const tellers = await models.Teller.findAll({
      attributes: [
        "id",
        "fullName",
        "user.username",
        "phone",
        "email",
        [col("user.username"), "username"],
      ],
      include: {
        model: User,
        as: "user",
        attributes: [],
      },
    });
    res.status(200).json(tellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addTeller = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const hashedPassword = await hashPassword(req.body.password);

    const user = await models.User.create(
      {
        username: req.body.username,
        password: hashedPassword,
        role: "TELLER",
      },
      {
        transaction: t,
      }
    );

    const teller = await models.Teller.create(
      {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        userId: user.id,
      },
      {
        transaction: t,
      }
    );

    await t.commit();
    res.status(200).json(teller);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const updateTeller = async (req, res) => {
  const { tellerId } = req.params;
  const t = await sequelize.transaction();

  const { username, email, phone, fullName } = req.body;
  console.log(req.body);
  try {
    if (
      fullName.length != null &&
      email.length != null &&
      phone.length != null
    ) {
      await models.Teller.update(
        {
          fullName: fullName,
          email: email,
          phone: phone,
        },
        { where: { id: +tellerId }, transaction: t }
      );
    }

    if (username.length != null) {
      const teller = await models.Teller.findOne({
        where: { id: tellerId },
        transaction: t,
      });

      await models.User.update(
        {
          username: username,
        },
        { where: { id: teller.userId }, transaction: t }
      );
    }

    await t.commit();
    res.status(200).json({ updated: true });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message, updated: false });
  }
};

export const deleteTeller = async (req, res) => {
  const { tellerId } = req.params;
  try {
    const result = await models.Teller.destroy({ where: { id: +tellerId } });

    if (result > 0) {
      return res.status(200).json({ deleted: true });
    }

    res.status(200).json({ deleted: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  const { from, to, bankName } = req.query;

  const whereClause = { createdAt: {} };

  if (from) {
    const parsedFrom = new Date(from);
    if (!isNaN(parsedFrom)) {
      whereClause["createdAt"][Op.gte] = parsedFrom;
    }
  }

  if (to) {
    const parsedTo = new Date(to);
    if (!isNaN(parsedTo)) {
      // Ensure the `to` date is valid and set it to the end of the day in UTC
      const endOfDay = new Date(parsedTo);
      endOfDay.setUTCHours(23, 59, 59, 999);
      whereClause["createdAt"][Op.lte] = endOfDay;
    }
  }

  if (bankName && bankName !== "") {
    whereClause[Op.or] = [{ srcBankName: bankName }, { desBankName: bankName }];
  }

  try {
    const transactions = await models.Paymenttransaction.findAll({
      where: whereClause,
      order: [["createdAt", "ASC"]],
    });

    const [relatedCustomers, relatedBeneficiaries] = await Promise.all([
      models.Customer.findAll({
        include: {
          model: models.Paymentaccount,
          as: "paymentaccounts",
          attributes: ["accountNumber", "balance"],
        },
        attributes: ["id", "fullName"],
      }),
      models.Beneficiaries.findAll({
        attributes: ["accountNumber", "name", "shortName"],
      }),
    ]);

    const customerMap = new Map();
    relatedCustomers.forEach((customer) => {
      if (customer.paymentaccounts) {
        customer.paymentaccounts.forEach((acc) =>
          customerMap.set(acc.accountNumber, customer.fullName)
        );
      }
    });

    const beneficiaryMap = new Map();
    relatedBeneficiaries.forEach((b) =>
      beneficiaryMap.set(b.accountNumber, b.name || b.shortName)
    );

    const transactionsWithType = transactions.map((tx) => {
      const srcPerson =
        customerMap.get(tx.srcAccount) ||
        beneficiaryMap.get(tx.srcAccount) ||
        "Unknown";
        const desPerson =
        customerMap.get(tx.desAccount) ||
        beneficiaryMap.get(tx.desAccount) ||
        "Unknown";

      return {
        ...tx.dataValues,
        srcPerson,
        desPerson
      };
    });

    res.status(200).json(transactionsWithType);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


export const addPartner = async (req, res) => {
  const { bankName, domain, partnerPublicKey, partnerAlgo, partnerSecretKey, ourPrivateKey, ourPublicKey } =
    req.body;
  const partner = await models.Partners.create({
    bankName: bankName,
    domain: domain,
    partnerAlgo: partnerAlgo,
    partnerSecretKey: partnerSecretKey,
    partenerPublicKey: partnerPublicKey,
    ourPrivateKey: ourPrivateKey,
    ourPublicKey: ourPublicKey,
  });

  res.status(200).json(partner);
};