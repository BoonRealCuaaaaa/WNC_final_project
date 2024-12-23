import "dotenv/config";
import { models } from "../lib/utils/database/index.js";
import User from "../models/User.js";
import { col } from "sequelize";

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
        attributes: []
      },
    });
    res.status(200).json(tellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await models.Paymenttransaction.findAll();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTeller = async (req, res) => {
  const { tellerId } = req.params;
  try {
    const tellers = models.Teller.update();
    res.status(200).json(tellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
