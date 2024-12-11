import { models } from "../lib/utils/database/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

export const login = async (req, res) => {
   const { username, password } = req.body;

   const user = await models.User.findOne({ where: { username } });

   if (!user) {
      return res.status(404).json({ message: "User not found" });
   }

   if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
   }

   const payload = { id: user.id, username: user.username, role: user.role };
   const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "2h" });
   let refreshToken = await models.Refreshtoken.findOne({ where: { userId: user.id } });

   if (!refreshToken) {
      refreshToken = crypto
         .createHash("sha512", process.env.REFRESH_TOKEN)
         .update(crypto.randomBytes(32).toString("hex"))
         .digest("hex");

      await models.Refreshtoken.create({ refreshToken: refreshToken, userId: user.id });
   } else {
      refreshToken = refreshToken.refreshToken;
   }

   return res.status(200).json({ accessToken, refreshToken, role: user.role });
};

export const refreshToken = async (req, res) => {
   const { refreshToken } = req.body;

   const dbRecord = await models.Refreshtoken.findOne({
      where: { refreshToken },
      include: { model: models.User, as: "user" },
   });

   if (!dbRecord) {
      return res.status(404).json({ message: "Refresh token not found" });
   }

   const payload = { id: dbRecord.user.id, username: dbRecord.user.username, role: dbRecord.user.role };
   const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
   return res.status(201).json({ accessToken });
};
