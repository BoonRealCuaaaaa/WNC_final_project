import { models } from "../lib/utils/database/index.js";
import { generateOTP } from "../lib/utils/otp/index.js";
import { sendOtpMail } from "../services/email.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import 'dotenv/config';


export const login = async (req, res) => {
   const { username, password } = req.body;

   const user = await models.User.findOne({ where: { username } });

   if (!user) {
      return res.status(404).json({ message: "User not found" });
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await models.Customer.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email does not exist" });
    }
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiredAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
   await sendOtpMail(email, otp, "Confirm Forgot Password");
   res.status(200).json({ message: "OTP has been sent to your email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
   const user = await models.Customer.findOne({ where: { email } });
   if (!user) {
     return res.status(404).json({ message: "Email does not exist" });
   }
   if (!user || user.otp !== otp || user.otpExpiredAt < new Date()) {
     return res.status(400).json({ message: "Invalid or expired OTP" });
   }
   const userRecord = await models.User.findOne({ where: { id: user.userId } });
   if (!userRecord) {
     return res.status(404).json({ message: "User not found" });
   }
   const hashedPassword = await bcrypt.hash(newPassword, 10);
   userRecord.password = hashedPassword;
   await userRecord.save();
   user.otp = null;
   user.otpExpiredAt = null;
   await user.save();
   res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};