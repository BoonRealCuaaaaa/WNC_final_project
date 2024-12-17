import 'dotenv/config';
import { models } from "../lib/utils/database/index.js";

export const validateExistCustomer = async (req, res) => {
   const { accountNumber } = req.body;

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