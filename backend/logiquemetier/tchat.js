const Conversation = require("../models/conversation");
const Message = require("../models/message");
const Profil = require("../models/profil");
const cloudinary = require("../cloudinary");
const streamifier = require("streamifier");


const uploadToCloudinary = (fileBuffer, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

exports.envoyerMessage = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { profilId } = req.params;
    const { contenu = "" } = req.body;

    // retrouver mon profil
    const monProfil = await Profil.findOne({ userId });

    if (!monProfil) {
      return res.status(404).json({ message: "Mon profil est introuvable" });
    }

    // retrouver le profil cible
    const profilCible = await Profil.findById(profilId);

    if (!profilCible) {
      return res.status(404).json({ message: "Profil cible introuvable" });
    }

    // sécurité : il faut un match
    const estMatch = monProfil.matchs.some(
      (matchId) => matchId.toString() === profilId,
    );

    if (!estMatch) {
      return res.status(403).json({
        message: "Vous ne pouvez pas discuter sans match",
      });
    }

    // sécurité : il faut au moins un texte ou un fichier
    if (!contenu.trim() && !req.file) {
      return res.status(400).json({ message: "Le message est vide" });
    }

    // chercher si une conversation existe déjà
    let conversation = await Conversation.findOne({
      participants: { $all: [monProfil._id, profilCible._id] },
    });

    // si non, la créer
    if (!conversation) {
      conversation = new Conversation({
        participants: [monProfil._id, profilCible._id],
      });

      await conversation.save();
    }

    let type = "text";
    let mediaData = {
      url: "",
      public_id: "",
      originalname: "",
      mimetype: "",
    };

    // Si fichier image envoyé
    if (req.file) {
      // 🔒 1. vérifier taille fichier
      if (req.file.size > 10 * 1024 * 1024) {
        return res
          .status(400)
          .json({ message: "Fichier trop lourd (max 10MB)" });
      }

      // 🔒 2. vérifier format autorisé
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "video/mp4",
      ];

      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Format non supporté" });
      }

      // 🔥 3. détecter si vidéo
      const isVideo = req.file.mimetype.startsWith("video");

      // ☁️ 4. upload Cloudinary
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        `site-de-rencontre/messages/${conversation._id}`,
        isVideo ? "video" : "image",
      );

      // 🧠 5. définir type
      type = isVideo ? "video" : "image";

      // 📦 6. stocker données
      mediaData = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
      };
    }

    // créer le message
    const nouveauMessage = new Message({
      conversationId: conversation._id,
      expediteur: monProfil._id,
      destinataire: profilCible._id,
      contenu: contenu.trim(),
      type,
      media: mediaData,
    });

    await nouveauMessage.save();

    // mettre à jour la conversation
  conversation.dernierMessage =
  type === "image"
    ? contenu.trim()
      ? `📷 ${contenu.trim()}`
      : "📷 Image"
    : type === "video"
    ? contenu.trim()
      ? `🎥 ${contenu.trim()}`
      : "🎥 Vidéo"
    : contenu.trim();

    conversation.dernierMessageStatut = "sent";
    conversation.dernierMessageDate = new Date();

    await conversation.save();

    res.status(201).json({
      message: "Message envoyé avec succès",
      conversation,
      nouveauMessage,
    });
  } catch (error) {
    console.error("Erreur envoyerMessage :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { profilId } = req.params;

    // retrouver mon profil
    const monProfil = await Profil.findOne({ userId });

    if (!monProfil) {
      return res.status(404).json({ message: "Mon profil est introuvable" });
    }

    // retrouver le profil cible
    const profilCible = await Profil.findById(profilId);

    if (!profilCible) {
      return res.status(404).json({ message: "Profil cible introuvable" });
    }

    // sécurité : il faut un match
    const estMatch = monProfil.matchs.some(
      (matchId) => matchId.toString() === profilId,
    );

    if (!estMatch) {
      return res.status(403).json({
        message: "Accès interdit : pas de match",
      });
    }

    // retrouver la conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [monProfil._id, profilCible._id] },
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    // récupérer les messages

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(messages.reverse());
  } catch (error) {
    console.error("Erreur getMessages :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.mesConversations = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const monProfil = await Profil.findOne({ userId });

    if (!monProfil) {
      return res.status(404).json({ message: "Mon profil est introuvable" });
    }

    const conversations = await Conversation.find({
      participants: monProfil._id,
    })
      .populate("participants", "pseudo avatar age ville pays")
      .sort({ dernierMessageDate: -1 });

    // 🔥 AJOUT COMPTEUR NON LUS
    const conversationsAvecNonLus = await Promise.all(
      conversations.map(async (conv) => {
        const nonLus = await Message.countDocuments({
          conversationId: conv._id,
          destinataire: monProfil._id,
          statut: { $ne: "seen" },
        });

        return {
          ...conv.toObject(),
          nonLus,
        };
      }),
    );

    res.status(200).json(conversationsAvecNonLus);
  } catch (error) {
    console.error("Erreur mesConversations :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
exports.marquerMessagesCommeLus = async (req, res) => {
  try {
    // =======================
    // 1) récupérer les infos utiles
    // =======================
    const userId = req.auth.userId;
    const { profilId } = req.params;

    // =======================
    // 2) récupérer io et onlineUsers depuis app
    // =======================
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    // =======================
    // 3) retrouver mon profil
    // =======================
    const monProfil = await Profil.findOne({ userId });

    if (!monProfil) {
      return res.status(404).json({ message: "Mon profil est introuvable" });
    }

    // =======================
    // 4) retrouver le profil cible
    // =======================
    const profilCible = await Profil.findById(profilId);

    if (!profilCible) {
      return res.status(404).json({ message: "Profil cible introuvable" });
    }

    // =======================
    // 5) sécurité : il faut un match
    // =======================
    const estMatch = monProfil.matchs.some(
      (matchId) => matchId.toString() === profilId,
    );

    if (!estMatch) {
      return res.status(403).json({
        message: "Accès interdit : pas de match",
      });
    }

    // =======================
    // 6) retrouver la conversation
    // =======================
    const conversation = await Conversation.findOne({
      participants: { $all: [monProfil._id, profilCible._id] },
    });

    if (!conversation) {
      return res.status(200).json({
        message: "Aucune conversation trouvée",
        idsMessagesLus: [],
      });
    }

    // =======================
    // 7) récupérer les messages non lus
    // envoyés par profilCible vers moi
    // =======================
    const messagesNonLus = await Message.find({
      conversationId: conversation._id,
      expediteur: profilCible._id,
      destinataire: monProfil._id,
      statut: { $ne: "seen" },
    });

    // =======================
    // 8) les marquer comme lus
    // =======================
    await Message.updateMany(
      {
        conversationId: conversation._id,
        expediteur: profilCible._id,
        destinataire: monProfil._id,
        statut: { $ne: "seen" },
      },
      {
        $set: { statut: "seen" },
      },
    );
    if (messagesNonLus.length > 0) {
      conversation.dernierMessageStatut = "seen";
      await conversation.save();
    }

    // =======================
    // 9) récupérer les ids des messages lus
    // =======================
    const idsMessagesLus = messagesNonLus.map((msg) => msg._id.toString());

    // =======================
    // 10) prévenir l'expéditeur en temps réel
    // =======================
    const expediteurSocketId = onlineUsers.get(profilCible._id.toString());

    if (expediteurSocketId && idsMessagesLus.length > 0) {
      io.to(expediteurSocketId).emit("messagesRead", {
        expediteurId: profilCible._id.toString(),
        lecteurId: monProfil._id.toString(),
        idsMessagesLus,
      });

      console.log(
        "👁️ Notification messages lus envoyée à :",
        profilCible._id.toString(),
      );
    }

    // =======================
    // 11) réponse API
    // =======================
    return res.status(200).json({
      message: "Messages marqués comme lus",
      idsMessagesLus,
      expediteurId: profilCible._id.toString(),
      lecteurId: monProfil._id.toString(),
    });
  } catch (error) {
    console.error("Erreur marquerMessagesCommeLus :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
