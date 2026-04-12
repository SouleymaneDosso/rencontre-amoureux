const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const Conversation = require("./models/conversation");
const Message = require("./models/message"); 

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(process.env.PORT || 3000);
app.set("port", port);

const server = http.createServer(app);

// =======================
// SOCKET.IO
// =======================
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://rencontre-amoureux.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// =======================
// Stockage utilisateurs connectés
// =======================
const onlineUsers = new Map();

// rendre accessibles io et onlineUsers dans toute l'app
app.set("io", io);
app.set("onlineUsers", onlineUsers);

io.on("connection", (socket) => {
  console.log("🟢 Un utilisateur socket est connecté :", socket.id);

  // =======================
  // Enregistrer un utilisateur connecté
  // =======================
socket.on("registerUser", async (userId) => {
  onlineUsers.set(userId, socket.id);

  io.emit("onlineUsers", Array.from(onlineUsers.keys()));

  try {
    const messagesNonLivres = await Message.find({
      destinataire: userId,
      statut: "sent",
    });

    console.log("🔍 messagesNonLivres:", messagesNonLivres.length);

    for (let msg of messagesNonLivres) {
      
      // 🔥 1. ENVOYER LE MESSAGE À A
      io.to(socket.id).emit("receiveMessage", msg);

      // 🔥 2. notifier B (expéditeur)
      const senderSocketId = onlineUsers.get(
        msg.expediteur.toString()
      );

      if (senderSocketId) {
        io.to(senderSocketId).emit("messageDelivered", {
          messageId: msg._id,
        });
      }

      // 🔥 3. mettre à jour statut
      msg.statut = "delivered";
      await msg.save();
    }
  } catch (err) {
    console.error(err);
  }
});

  // =======================
  // Envoyer un message en temps réel
  // =======================
  socket.on("sendMessage", (messageData) => {
    const receiverSocketId = onlineUsers.get(messageData.destinataire);
    const senderSocketId = onlineUsers.get(messageData.expediteur);

    console.log("📨 Message temps réel reçu :", messageData);

    // 🔥 envoyer au destinataire
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", messageData);
      Conversation.findByIdAndUpdate(messageData.conversationId, {
        dernierMessageStatut: "delivered",
      }).catch(console.error);
      // 🔥 IMPORTANT : dire à A que c'est livré
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageDelivered", {
          messageId: messageData._id,
        });
      }

      console.log("✅ Message envoyé + livré");
    } else {
      console.log("⚠️ Destinataire non connecté");
    }
  });

  // =======================
  // Messages lus
  // =======================
  socket.on("messagesRead", ({ expediteurId, idsMessagesLus }) => {
    const expediteurSocketId = onlineUsers.get(expediteurId);
    

    console.log("👁️ messagesRead reçu :", idsMessagesLus);

    if (expediteurSocketId) {
      io.to(expediteurSocketId).emit("messagesRead", {
        idsMessagesLus,
      });

      console.log("✅ Lu envoyé à l'expéditeur");
    }
  });

  // =======================
  // Déconnexion
  // =======================
  socket.on("disconnect", () => {
    console.log("🔴 Utilisateur socket déconnecté :", socket.id);

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log("❌ Utilisateur retiré :", userId);
        break;
      }
    }

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

// IMPORTANT POUR RENDER
server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Serveur lancé sur le port ${port}`);
});

server.on("error", (error) => {
  console.error("❌ Erreur serveur :", error);
});

// Pour attraper les crashs silencieux
process.on("uncaughtException", (err) => {
  console.error("💥 uncaughtException :", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("💥 unhandledRejection :", reason);
});
