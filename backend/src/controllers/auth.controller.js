import { models } from "../lib/utils/database/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config";
import { generateOTP } from "../lib/utils/otp/index.js";
import { sendOtpMail } from "../services/email.js";
import { comparePassword, hashPassword } from "../lib/utils/bcrypt/index.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await models.User.findOne({ where: { username } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!(await comparePassword(password, user.password))) {
    return res.status(402).json({ message: "Invalid password" });
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

  sendOtpMail(email, otp, "OTP cho việc lấy lại mật khẩu");

  return res.status(200).json({ message: "OTP sent" });
};

export const verifyOtpForForgotPassword = async (req, res) => {
  const { email, otp } = req.body;
  const customer = await models.Customer.findOne({ where: { email } });

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  if (customer.otp !== otp) {
    return res.status(402).json({ message: "Invalid OTP" });
  }

  if (new Date() > customer.otpExpires) {
    return res.status(402).json({ message: "OTP expired" });
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
  const hashedPassword = await hashPassword(password);
  user.password = hashedPassword;
  await user.save();

  console.log(user);
  return res.status(200).json({ message: "Password updated" });
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
