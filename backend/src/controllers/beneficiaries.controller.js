import { models } from "../lib/utils/database/index.js";

export const getBeneficiaries = async (req, res) => {
   const customer = await models.Customer.findOne({ where: { userId: req.user.id }, attributes: ["id"] });
   const beneficiaries = await models.Beneficiaries.findAll({
      where: { customerId: customer.id, bankName: "OWN_BANK" },
   });

   return res.status(200).json(beneficiaries);
};
