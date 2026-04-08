const express = require("express");
const Router = express.Router();

const mesInfos = require("../logiquemetier/index");
const upload = require("../multer");
const auth = require("../middleware/auth");

// Routes générales
Router.get("/",auth, mesInfos.getInfos);
Router.post("/", auth, mesInfos.createInfos);


Router.get("/me", auth, mesInfos.monProfil);
Router.get("/matchs", auth, mesInfos.mesMatchs);
Router.get("/verifier-match/:profilId", auth, mesInfos.verifierMatch);

// Likes / suggestions
Router.post("/like/:profilId", auth, mesInfos.likeProfil);
Router.post("/dislike/:profilId", auth, mesInfos.dislikeProfil);
Router.get("/suggestions", auth, mesInfos.suggestions);

// Photos / avatar
Router.delete("/photo/:id/:public_id", auth, mesInfos.deletePhotos);
Router.put("/avatar/:id", auth, upload.single("avatar"), mesInfos.setAvatar);

// Update
Router.put("/:id", auth, upload.array("photos", 10), mesInfos.updateInfos);
Router.put("/edit/:id", auth, mesInfos.updateInfos);

// Lecture / suppression
Router.get("/:id", mesInfos.getPublicProfil);
Router.delete("/:id", auth, mesInfos.deleteInfos);

module.exports = Router;