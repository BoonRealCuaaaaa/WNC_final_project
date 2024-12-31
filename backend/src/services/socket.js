import { Server } from "socket.io";
import { models } from "../lib/utils/database/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config";

let io = null;
export const connectedUsers = {};

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.on("connection", async (socket) => {
    const accessToken = socket.handshake.auth?.token;
    try {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN, async (err, user) => {
        if (err) return socket.disconnect();

        console.log("HEHE");

        const userId = user.id;
        const currentCustomer = await models.Customer.findOne({
          where: { id: userId },
        });
        connectedUsers[currentCustomer.id] = socket.id;

        console.log(connectedUsers);
      });
    } catch (error) {
      console.log(error);
      socket.disconnect();
    }

    socket.on("disconnect", () => {
      for (const userId in connectedUsers) {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });
};

export const sendNotification = async (userId, notification) => {
  if (!io) {
    console.error("Socket.IO is not initialized");
    return;
  }

  const socketId = connectedUsers[userId];

  if (socketId) {
    io.to(socketId).emit("notify", notification);
  }
};
