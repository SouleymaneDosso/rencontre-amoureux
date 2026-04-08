const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

mongoose.connect(process.env.MONGOOSE_URL)
  .then(() => console.log("connexion à la base de donnée réussie"))
  .catch(err => {
    console.error("connexion échouée", err.message);
    process.exit(1);
  });

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://rencontre-amoureux.vercel.app"
  ],
  methods: ["GET", "PUT", "DELETE", "POST", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

const mesInfosRoute = require("./Router/index");
const routerConnexion = require("./Router/connexion");
const routerInscription = require("./Router/inscription");
const tchatRoutes = require("./Router/tchat");

app.use("/api/mesInfos", mesInfosRoute);
app.use("/api", routerConnexion);
app.use("/api", routerInscription);
app.use("/api/tchat", tchatRoutes);

app.get("/", (req, res) => {
  res.send("Backend rencontre-amoureux actif 🚀");
});

module.exports = app;