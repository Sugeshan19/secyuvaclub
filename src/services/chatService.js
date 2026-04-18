import { io } from "socket.io-client";
import { apiRequest, postJson } from "./api";

const API_BASE = process.env.REACT_APP_API_URL;
let socketInstance = null;

export const getChatMessages = () => apiRequest("/api/chat/messages");

export const sendChatMessage = (text) =>
  postJson("/api/chat/messages", {
    text,
  });

export const connectChatSocket = (token) => {
  if (!token) {
    throw new Error("Auth token is required to connect chat");
  }

  if (socketInstance?.connected) {
    return socketInstance;
  }

  if (socketInstance) {
    socketInstance.disconnect();
  }

  socketInstance = io(API_BASE, {
    auth: { token },
    transports: ["websocket", "polling"],
  });

  return socketInstance;
};

export const disconnectChatSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
