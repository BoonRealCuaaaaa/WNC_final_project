import { getAccessToken } from "@/utils/auth";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_APP;
const socket = io(SOCKET_URL, {
   autoConnect: false,
});

export const connectSocket = () => {
   const token = getAccessToken();

   if (!token) {
      console.error("Token not found");
   }

   socket.auth = { token };
   socket.connect();

   socket.on("connect", () => {
      console.log(`Connected with socket ID: ${socket.id}`);
   });

   socket.on("disconnect", () => {
      console.log("Socket disconnected");
   });
};

export const onNotify = (callback) => {
   socket.on("notify", callback);
};

export const emitEvent = (event, data) => {
   socket.emit(event, data);
};

export default socket;
