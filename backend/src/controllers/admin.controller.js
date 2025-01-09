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
    console.log(error);
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
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateTeller = async (req, res) => {
  const { tellerId } = req.params;
  console.log(tellerId);
  const t = await sequelize.transaction();

  const { username, email, phone, fullName } = req.body;
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
      console.log(teller);
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
    res.status(500).json({ error: error.message });
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
  if (from) whereClause["createdAt"][Op.gte] = new Date(from);
  if (to)
    whereClause["createdAt"][Op.lte] = new Date(
      new Date(to).setHours(23, 59, 59, 999)
    );
  if (bankName && bankName !== "") whereClause["desBankName"] = bankName;

  try {
    const transactions = await models.Paymenttransaction.findAll({
      where: whereClause,
    });

    res.status(200).json(transactions);
  } catch (error) {
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
