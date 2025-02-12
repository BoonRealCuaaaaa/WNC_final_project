import express from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "./src/routes/auth.route.js";
import customerRouter from "./src/routes/customer.route.js";
import debitRouter from "./src/routes/debit.route.js";
import interbankRouter from "./src/routes/interbank.route.js";
import notificationRouter from "./src/routes/notification.route.js";
import beneficiaryRouter from "./src/routes/beneficiary.route.js";
import paymentTransactionRouter from "./src/routes/payment-transaction.route.js";
import adminRouter from "./src/routes/admin.route.js";
import tellerRouter from "./src/routes/teller.route.js";
import partnerRouter from "./src/routes/partner.route.js";
import { verifyToken } from "./src/middlewares/authenticate.middleware.js";
import http from "http";
import { initializeSocket } from "./src/services/socket.js";
import {
  verifyTellerAccount,
  verifyAdminAccount,
} from "./src/middlewares/verify-teller-account.middleware.js";
import { sendOtpMail } from "./src/services/email.js";
import { swaggerUi, swaggerSpecs } from "./src/lib/utils/swagger/index.js";

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
initializeSocket(server);

const port = process.env.PORT || 3000;

app.use("/auth", authRouter);
app.use("/interbanks", interbankRouter);
app.use("/notification", verifyToken, notificationRouter);
app.use("/customer", verifyToken, customerRouter);
app.use("/debits", verifyToken, debitRouter);
app.use("/beneficiaries", verifyToken, beneficiaryRouter);
app.use("/payment-transaction", verifyToken, paymentTransactionRouter);
app.use("/admin", verifyToken, verifyAdminAccount, adminRouter);
app.use("/teller", verifyToken, verifyTellerAccount, tellerRouter);
app.use("/partners", verifyToken, partnerRouter);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger docs is running on http://localhost:${port}/api-docs`);
});
