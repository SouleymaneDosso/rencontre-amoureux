const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

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

// Test simple connexion socket
io.on("connection", (socket) => {
  console.log("🟢 Un utilisateur socket est connecté :", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Utilisateur socket déconnecté :", socket.id);
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