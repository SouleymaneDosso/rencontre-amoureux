const Video = require("../models/video");
const streamifier = require("streamifier");
const Profil = require("../models/profil");
const cloudinary = require("../cloudinary");
 
exports.uploadCloudinary = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "aucune video envoyée" });
    }

    const userId = req.auth.userId;

    const uploadpromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        if (!file.mimetype.startsWith("video/")) {
          return reject(new Error("fichier non valide"));
        }

        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "rencontre amoureuse",
            resource_type: "video",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({ result, file });
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    const results = await Promise.all(uploadpromises);

    const videos = await Promise.all(
      results.map(({ result, file }) =>
        Video.create({
          userId,
          url: result.secure_url,
          public_id: result.public_id,
          nomoriginal: file.originalname,
          nomfichier: result.original_filename,
          taille: result.bytes,
          format: result.format,
          duree: result.duration,
           description: req.body.description || "",
        })
      )
    );

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.auth.userId })
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;

    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const videosWithUser = await Promise.all(
      videos.map(async (video) => {
        // 👤 profil du créateur de la vidéo
        const profil = await Profil.findOne({ userId: video.userId });

        // ⚠️ sécurité si pas de commentaires
        const comments = video.comments || [];

        // 🚀 récupérer tous les profils d’un coup
        const userIds = [...new Set(comments.map(c => c.userId.toString()))];

        const profils = await Profil.find({
          userId: { $in: userIds },
        });

        // 🧠 enrichir les commentaires
        const commentsWithUser = comments.map((c) => {
          const p = profils.find(
            (p) => p.userId.toString() === c.userId.toString()
          );

          return {
            ...c._doc,
            user: p
              ? {
                  _id: p._id,
                  nom: p.nom,
                  prenom: p.prenom,
                  pseudo: p.pseudo,
                  avatar: p.avatar,
                }
              : null,
          };
        });

        return {
          ...video._doc,
          user: profil
            ? {
                _id: profil._id,
                nom: profil.nom,
                prenom: profil.prenom,
                pseudo: profil.pseudo,
                avatar: profil.avatar,
              }
            : null,
          comments: commentsWithUser,
        };
      })
    );

    res.status(200).json(videosWithUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.likes = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Vidéo introuvable" });
    }

    const existelike = video.likes.some(
      (id) => id.toString() === userId
    );

    const updated = await Video.findByIdAndUpdate(
      videoId,
      existelike
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true }
    );

    res.json({
      likes: updated.likes,
      totalLikes: updated.likes.length,
      dejaLike: !existelike,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.comment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { texte } = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Vidéo introuvable" });
    }

    // ✅ ajouter commentaire
    video.comments.push({
      userId: req.auth.userId,
      texte,
    });

    await video.save();

    const comments = video.comments || [];

    // 🚀 récupérer tous les profils en 1 seule requête
    const userIds = [...new Set(comments.map(c => c.userId.toString()))];

    const profils = await Profil.find({
      userId: { $in: userIds },
    });

    // 🧠 enrichir commentaires
    const commentsWithUser = comments.map((c) => {
      const profil = profils.find(
        (p) => p.userId.toString() === c.userId.toString()
      );

      return {
        ...c._doc,
        user: profil
          ? {
              _id: profil._id,
              nom: profil.nom,
              prenom: profil.prenom,
              pseudo: profil.pseudo,
              avatar: profil.avatar,
            }
          : null,
      };
    });

    res.status(200).json(commentsWithUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};