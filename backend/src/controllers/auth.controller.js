import { models } from "../lib/utils/database/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config";
import { generateOTP } from "../lib/utils/otp/index.js";

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
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: "2h",
  });
  let refreshToken = await models.Refreshtoken.findOne({
    where: { userId: user.id },
  });

  if (!refreshToken) {
    refreshToken = crypto
      .createHash("sha512", process.env.REFRESH_TOKEN)
      .update(crypto.randomBytes(32).toString("hex"))
      .digest("hex");

    await models.Refreshtoken.create({
      refreshToken: refreshToken,
      userId: user.id,
    });
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

  const payload = {
    id: dbRecord.user.id,
    username: dbRecord.user.username,
    role: dbRecord.user.role,
  };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: "1h",
  });
  return res.status(201).json({ accessToken });
};

export const generateOtpForForgotPassword = async (req, res) => {
  const { email } = req.body;
  const customer = await models.Customer.findOne({ where: { email } });

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const otp = generateOTP();
  customer.otp = otp;
  customer.otpExpires = new Date(Date.now() + 600000);
  await customer.save();

  // sendOtpMail(email, otp, "OTP cho việc lấy lại mật khẩu");

  return res.status(200).json({ message: "OTP sent" });
};

export const verifyOtpForForgotPassword = async (req, res) => {
  const { email, otp } = req.body;
  const customer = await models.Customer.findOne({ where: { email } });

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  if (customer.otp !== otp) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  if (new Date() > customer.otpExpires) {
    return res.status(401).json({ message: "OTP expired" });
  }

  return res.status(200).json({ message: "OTP verified" });
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  const customer = await models.Customer.findOne({
    where: { email },
    include: { model: models.User, as: "user" },
  });

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const user = customer.user;
  user.password = password;
  await user.save();

  console.log(user)
  return res.status(200).json({ message: "Password updated" });
};
