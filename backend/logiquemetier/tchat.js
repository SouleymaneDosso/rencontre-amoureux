const Conversation = require("../models/conversation");
const Message = require("../models/message");
const Profil = require("../models/profil");
const cloudinary = require("../cloudinary");
const streamifier = require("streamifier");

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
      (matchId) => matchId.toString() === profilId
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
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: `site-de-rencontre/messages/${conversation._id}` },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      type = "image";
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
        : contenu.trim();

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
      (matchId) => matchId.toString() === profilId
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
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
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
      .populate("participants", "pseudo avatar age ville pays enLigne")
      .sort({ dernierMessageDate: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Erreur mesConversations :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};