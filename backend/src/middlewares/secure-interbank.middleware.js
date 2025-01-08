import { models } from "../lib/utils/database/index.js";
import { generateHash, verifyPGPSignature } from "../lib/utils/cryptoUtils/index.js";
import dotenv from "dotenv";
dotenv.config();

export const validRequest = async (req, res, next) => {
  const { domain, time, token } = req.body;

  try {
    const bank = await models.Partners.findOne({ where: { domain } });

    if (!bank) {
      return res.status(403).json({ message: "Không tìm thấy ngân hàng" });
    }
    
    const maxPeriod = 5 * 60; // seconds
    if (Math.floor((Date.now() - time) / 1000) > maxPeriod) {
      return res.status(400).json({ message: "Thời gian đã quá hạn" });
    }

    console.log("desUrl::",req.originalUrl);

    const verifyToken = generateHash("sha256", req.originalUrl + "" + time + "" + process.env.SECRET_KEY);

    if (token !== verifyToken) {
      return res.status(400).json({ message: "Gói tin đã bị thay đổi" });
    }

    req['partenerPublicKey'] = bank.partenerPublicKey;

    return next();
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const validSignature = async (req, res, next) => {
    const {payload, signature} = req.body;

    const partenerPublicKey = req["partenerPublicKey"];

    const isValidSignature = await verifyPGPSignature(JSON.stringify(payload), signature, partenerPublicKey);
    
    console.log("isValidSignature", isValidSignature);

    if (!isValidSignature) {
        return res.status(401).json({ message: 'Chữ kí không hợp lệ' });
    }
    return next();
}
