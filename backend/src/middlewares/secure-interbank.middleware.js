import { models } from "../lib/utils/database/index.js";
import { generateHash, verifySignature } from "../lib/utils/cryptoUtils/index.js";

export const validRequest = async (req, res, next) => {
  const { domain, time, token } = req.body;

  try {
    const bank = await models.Partners.findOne({ where: { domain } });

    if (!bank) {
      return res.status(403).json({ message: "Unauthorized bank" });
    }
    
    const maxPeriod = 5 * 60; // seconds
    if (Math.floor((Date.now() - time) / 1000) > maxPeriod) {
      return res.status(400).json({ message: "Request expired" });
    }

    const verifyToken = generateHash("sha256", req.url + "" + time + "" + process.env.SECRET_KEY);

    if (token !== verifyToken) {
      return res.status(400).json({ message: "Data tampering detected" });
    }

    req['partenerPublicKey'] = bank.partenerPublicKey;

    return next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const validSignature = async (req, res, next) => {
    const {payload, signature} = req.body;

    const partenerPublicKey = req["partenerPublicKey"];

    const isValidSignature = verifySignature(JSON.stringify(payload), signature, partenerPublicKey);
    
    if (!isValidSignature) {
        return res.status(401).json({ message: 'Invalid RSA signature' });
    }
    return next();
}
