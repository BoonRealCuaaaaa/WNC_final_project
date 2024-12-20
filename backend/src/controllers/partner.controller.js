import { models } from "../lib/utils/database/index.js";

export const getPartners = async (req, res) => {
   const partners = await models.Partners.findAll();

   return res.status(200).json(partners);
};