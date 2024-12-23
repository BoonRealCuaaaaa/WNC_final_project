import express from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "./src/routes/auth.route.js";
import customerRouter from "./src/routes/customer.route.js";
import debitRouter from "./src/routes/debit.route.js";
import notificationRouter from "./src/routes/notification.route.js";
import beneficiariesRouter from "./src/routes/beneficiaries.route.js";
import paymentTransactionRouter from "./src/routes/payment-transaction.route.js";
import employeeRouter from "./src/routes/employee.route.js";
import adminRouter from "./src/routes/admin.route.js";
import { verifyToken } from "./src/middlewares/authenticate.middleware.js";
import { Server } from "socket.io";
import http from "http";
import { initializeSocket } from "./src/services/socket.js";
import { sendOtpMail } from "./src/services/email.js";
import { verifyTellerAccount } from "./src/middlewares/verify-teller-account.middleware.js";

const app = express();
app.use(express.json());
app.use(cors());


const server = http.createServer(app);
initializeSocket(server);

const port = process.env.PORT || 3000;

app.use("/auth", authRouter);
app.use("/notification", verifyToken, notificationRouter);
app.use("/customer", verifyToken, customerRouter);
app.use("/debits", verifyToken, debitRouter);
app.use("/beneficiaries", verifyToken, beneficiariesRouter);
app.use("/payment-transaction", verifyToken, paymentTransactionRouter);
app.use("/employee", verifyToken, verifyTellerAccount, employeeRouter);
app.use("/admin", adminRouter);

// Example of protected API
let cnt = 0;
app.get("/hello", verifyToken, (req, res) => {
  return res.send(`Hello world ${cnt++}`);
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
