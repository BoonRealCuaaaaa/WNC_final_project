import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./src/routes/auth.route.js";
import customerRouter from "./src/routes/customer.route.js";
import debitRouter from "./src/routes/debit.route.js";
import beneficiariesRouter from "./src/routes/beneficiaries.route.js";
import { verifyToken } from "./src/middlewares/authenticate.middleware.js";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.use("/auth", authRouter);
app.use("/customer", verifyToken, customerRouter);
app.use("/debits", verifyToken, debitRouter);
app.use("/beneficiaries", verifyToken, beneficiariesRouter);

// Example of protected API
let cnt = 0;
app.get("/hello", verifyToken, (req, res) => {
   return res.send(`Hello world ${cnt++}`);
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
