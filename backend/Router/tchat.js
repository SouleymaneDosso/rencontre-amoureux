const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../multer");

const {
  envoyerMessage,
  getMessages,
  mesConversations,
  marquerMessagesCommeLus,
  supprimerpourMoi,
  supprimertous,
} = require("../logiquemetier/tchat");

router.post("/envoyer/:profilId", auth , upload.single("media"), envoyerMessage);
router.get("/messages/:profilId", auth, getMessages);
router.get("/conversations", auth, mesConversations);
router.patch("/lire/:profilId", auth, marquerMessagesCommeLus);
router.put("/supprimemoi/:messageId", auth, supprimerpourMoi);
router.put("/supprimetous/:messageId", auth, supprimertous);
module.exports = router;