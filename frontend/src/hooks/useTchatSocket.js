import { useEffect, useState } from "react";
import { socket } from "../socket";

export function useTchatSocket(monProfilId, setMessages) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.connect();

    const handleConnect = () => {
      console.log("✅ Socket connecté :", socket.id);
    };

    const handleDisconnect = () => {
      console.log("❌ Socket déconnecté");
    };

    const handleConnectError = (err) => {
      console.error("💥 Erreur connexion socket :", err.message);
    };

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    const handleReceiveMessage = (messageData) => {
      setMessages((prev) => {
        const existeDeja = prev.some((msg) => msg._id === messageData._id);
        if (existeDeja) return prev;

        return [...prev, messageData];
      });
    };

    const handleMessagesRead = ({ idsMessagesLus }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          idsMessagesLus.includes(msg._id) ? { ...msg, statut: "seen" } : msg,
        ),
      );
    };

    const handleMessageDelivered = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, statut: "delivered" } : msg,
        ),
      );
    };

    const handleMessageDeleted = ({ messageId }) => {
      console.log("🗑️ messageDeleted reçu :", messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                contenu: "↩ Message supprimé",
                type: "system",
                media: {},
              }
            : msg,
        ),
      );
    };

    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageDelivered", handleMessageDelivered);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageDelivered", handleMessageDelivered);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [setMessages]);

  useEffect(() => {
    if (!monProfilId) return;

    const registerIfConnected = () => {
      console.log("👤 Enregistrement utilisateur socket :", monProfilId);
      console.log("🔌 socket.connected ?", socket.connected);
      socket.emit("registerUser", monProfilId);
    };

    if (socket.connected) {
      registerIfConnected();
    } else {
      socket.on("connect", registerIfConnected);
    }

    return () => {
      socket.off("connect", registerIfConnected);
    };
  }, [monProfilId]);

  return {
    onlineUsers,
    socket,
  };
}
