import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./src/routes/auth.route.js";
import { verifyToken } from "./src/middlewares/authenticate.middleware.js";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.use("/auth", authRouter);

// Example of protected API
let cnt = 0;
app.get("/hello", verifyToken, (req, res) => {
   return res.send(`Hello world ${cnt++}`);
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
