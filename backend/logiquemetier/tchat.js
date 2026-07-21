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
        chunk_size: 9000000,
        timeout: 600000,
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
    const { contenu = "", duration = 0 } = req.body;

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
      // 🔒 2. vérifier format autorisé
      const isImage = req.file.mimetype.startsWith("image");
      const isVideo = req.file.mimetype.startsWith("video");
      const isAudio = req.file.mimetype.startsWith("audio");

      if (!isImage && !isVideo && !isAudio) {
        return res.status(400).json({ message: "Format non supporté" });
      }
      // 🔥 3. détecter si vidéo

      // ☁️ 4. upload Cloudinary
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        `site-de-rencontre/messages/${conversation._id}`,
        isVideo || isAudio ? "video" : "image",
      );

      // 🧠 5. définir type
      type = isAudio ? "audio" : isVideo ? "video" : "image";

      // 📦 6. stocker données
      mediaData = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,

        duration: isAudio ? Number(duration) : 0,

        thumbnail: isVideo
          ? uploadResult.secure_url.replace("/upload/", "/upload/so_1/")
          : "",
      };
    }

    const reponseA = req.body.reponseA || null;

    // créer le message
    const nouveauMessage = new Message({
      conversationId: conversation._id,
      expediteur: monProfil._id,
      destinataire: profilCible._id,
      contenu: contenu.trim(),
      type,
      media: mediaData,
      reponseA: reponseA,
    });

    await nouveauMessage.save();

    // mettre à jour la conversation
    conversation.dernierMessage =
      type === "image"
        ? contenu?.trim()
          ? `📷 ${contenu.trim()}`
          : "📷 Image"
        : type === "video"
          ? contenu?.trim()
            ? `🎥 ${contenu.trim()}`
            : "🎥 Vidéo"
          : type === "audio"
            ? contenu?.trim()
              ? `🎤 ${contenu.trim()}`
              : "🎤 Message vocal"
            : contenu?.trim() || "";

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
      return res.status(404).json({
        message: "Mon profil est introuvable",
      });
    }

    // retrouver le profil cible
    const profilCible = await Profil.findById(profilId);

    if (!profilCible) {
      return res.status(404).json({
        message: "Profil cible introuvable",
      });
    }

    // vérifier le match
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
      participants: {
        $all: [monProfil._id, profilCible._id],
      },
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    // pagination
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);

    const filtre = {
      conversationId: conversation._id,
      supprimePourMoi: {
        $nin: [monProfil._id],
      },
    };

    const messages = await Message.find(filtre)
      .populate({
        path: "reponseA",
        select: "contenu type media expediteur supprimePourTous",
      })
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    messages.forEach((message) => {
      if (message.reponseA && message.reponseA.supprimePourTous) {
        message.reponseA.contenu = "↩ Message supprimé";
        message.reponseA.type = "system";
      }

      if (message.supprimePourTous) {
        message.contenu = "↩ Message supprimé";
        message.type = "system";
      }
    });

    // ancien -> récent
    messages.reverse();

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Erreur getMessages :", error);

    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

exports.supprimerpourMoi = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const { messageId } = req.params;

    const monprofil = await Profil.findOne({ userId });

    if (!monprofil) {
      return res.status(400).json({ message: "Profil introuvable" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        message: "Message introuvable",
      });
    }

    const autorisation =
      message.expediteur.toString() === monprofil._id.toString() ||
      message.destinataire.toString() === monprofil._id.toString();

    if (!autorisation) {
      return res
        .status(403)
        .json({ message: "vous n'avez pas l'authorisation" });
    }

    const dejasupprimer = message.supprimePourMoi.some(
      (id) => id.toString() === monprofil._id.toString(),
    );

    if (!dejasupprimer) {
      message.supprimePourMoi.push(monprofil._id);
      await message.save();
    }

    return res.status(200).json({
      message: "Message supprimé pour vous",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.supprimertous = async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    return res.status(400).json({ message: "Ce message existe pas" });
  }
  message.supprimePourTous = true;
  message.contenu = "";
  message.media = {
    url: "",
    public_id: "",
    originalname: "",
    mimetype: "",
    size: 0,
    duration: 0,
    thumbnail: "",
  };

  await message.save();
  res.status(200).json({ message: "Message supprimé avec succes" });
};

exports.mesConversations = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const monProfil = await Profil.findOne({ userId });

    if (!monProfil) {
      return res.status(404).json({
        message: "Mon profil est introuvable",
      });
    }

    const conversations = await Conversation.find({
      participants: monProfil._id,
    })
      .populate("participants", "pseudo avatar age ville pays")
      .sort({ dernierMessageDate: -1 });

    // Compteur non lus + expéditeur du dernier message
    const conversationsAvecNonLus = await Promise.all(
      conversations.map(async (conv) => {
        // Les appels ne sont pas comptés comme messages non lus
        const nonLus = await Message.countDocuments({
          conversationId: conv._id,
          destinataire: monProfil._id,
          type: { $ne: "call" },
          statut: { $ne: "seen" },
        });

        // Récupérer le dernier message réel de la conversation
        const dernierMessageDoc = await Message.findOne({
          conversationId: conv._id,
        })
          .sort({
            createdAt: -1,
            _id: -1,
          })
          .select("expediteur");

        return {
          ...conv.toObject(),
          nonLus,
          dernierMessageExpediteur:
            dernierMessageDoc?.expediteur?.toString() || null,
        };
      }),
    );

    res.status(200).json(conversationsAvecNonLus);
  } catch (error) {
    console.error("Erreur mesConversations :", error);

    res.status(500).json({
      message: "Erreur serveur",
    });
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
      type: { $ne: "call" },
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
        type: { $ne: "call" },
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

exports.createCallMessage = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const monProfil = await Profil.findOne({ userId });

    if (!monProfil) {
      return res.status(404).json({
        message: "Mon profil est introuvable",
      });
    }
    const expediteur = req.auth.userId;

    const { destinataire, conversationId, status, duration } = req.body;

    const message = await Message.create({
      conversationId,
      expediteur: monProfil._id,
      destinataire,
      type: "call",

      call: {
        status,
        duration: duration || 0,
      },
    });
    let dernierMessage = "📞 Appel";
    switch (status) {
      case "missed":
        dernierMessage = "📞 Appel manqué";
        break;

      case "accepted":
        dernierMessage = "📞 Appel accepté";
        break;

      case "rejected":
        dernierMessage = "📞 Appel refusé";
        break;

      case "cancelled":
        dernierMessage = "📞 Appel annulé";
        break;

      case "ended":
        dernierMessage = "📞 Appel terminé";
        break;
    }

    await Conversation.findByIdAndUpdate(conversationId, {
      dernierMessage,
      dernierMessageDate: new Date(),
      dernierMessageStatut: "sent",
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
