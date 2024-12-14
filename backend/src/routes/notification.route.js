import express from "express";
import {
  getNotifications,
  readNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", getNotifications);

router.post("/read", readNotification);

export default router;
