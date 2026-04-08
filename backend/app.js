const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// ============================
// LOGS DE DEMARRAGE
// ============================
console.log("🔍 ENV CHECK");
console.log("PORT:", process.env.PORT);
console.log("MONGOOSE_URL existe ?", !!process.env.MONGOOSE_URL);
console.log("JWT_SECRET existe ?", !!process.env.JWT_SECRET);

// ============================
// CONNEXION MONGODB
// ============================
mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => console.log("✅ Connexion à MongoDB réussie"))
  .catch((err) => {
    console.error("❌ Connexion MongoDB échouée :", err.message);
    process.exit(1);
  });

// ============================
// CORS
// ============================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://rencontre-amoureux.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.error("❌ CORS bloqué pour :", origin);
      return callback(new Error("CORS bloqué : " + origin));
    },
    methods: ["GET", "PUT", "DELETE", "POST", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ============================
// MIDDLEWARE
// ============================
app.use(express.json());

// Petit log des requêtes
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});

// ============================
// ROUTES
// ============================
const mesInfosRoute = require("./Router/index");
const routerConnexion = require("./Router/connexion");
const routerInscription = require("./Router/inscription");
const tchatRoutes = require("./Router/tchat");

app.use("/api/mesInfos", mesInfosRoute);
app.use("/api", routerConnexion);
app.use("/api", routerInscription);
app.use("/api/tchat", tchatRoutes);

// ============================
// ROUTE DE TEST
// ============================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend rencontre-amoureux actif 🚀",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// ============================
// HEALTH CHECK
// ============================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    backend: "running",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString(),
  });
});

// ============================
// GESTION D'ERREURS GLOBALE
// ============================
app.use((err, req, res, next) => {
  console.error("💥 Erreur serveur :", err.message);
  res.status(500).json({
    message: "Erreur interne serveur",
    error: err.message,
  });
});

module.exports = app;