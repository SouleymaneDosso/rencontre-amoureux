import { useEffect, useState } from "react";
import { socket } from "../socket";

export function useTchatSocket(monProfilId, setMessages) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    console.log("🧪 Tchat monté - test socket");

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
      console.log("🟢 Utilisateurs en ligne :", users);
      setOnlineUsers(users);
    };

    const handleReceiveMessage = (messageData) => {
      console.log("📩 Nouveau message reçu en temps réel :", messageData);

      setMessages((prev) => {
        const existeDeja = prev.some((msg) => msg._id === messageData._id);
        if (existeDeja) return prev;

        return [...prev, messageData];
      });

      // 🔥 ACCUSÉ DE RÉCEPTION
      socket.emit("messageDelivered", {
        messageId: messageData._id,
        expediteurId: messageData.expediteur,
      });
    };

    const handleMessagesRead = ({ idsMessagesLus }) => {
      console.log("👁️ Messages lus :", idsMessagesLus);

      setMessages((prev) =>
        prev.map((msg) =>
          idsMessagesLus.includes(msg._id) ? { ...msg, statut: "seen" } : msg,
        ),
      );
    };

    const handleMessageDelivered = ({ messageId }) => {
      console.log("📬 Message livré :", messageId);

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, statut: "delivered" } : msg,
        ),
      );
    };
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
