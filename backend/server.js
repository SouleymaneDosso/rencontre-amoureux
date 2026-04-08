const http = require("http");
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