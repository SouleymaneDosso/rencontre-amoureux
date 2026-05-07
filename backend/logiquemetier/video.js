const Video = require("../models/video");
const streamifier = require("streamifier");
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
    const videos = await Video.find()
      .sort({ createdAt: -1 }) 
    res.status(200).json(videos);
  } catch(error) {
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
      dejaLike: existelike,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.comment = async (req, res) => {
//   try {
//     const { videoId } = req.params;
//     const { texte } = req.body;

//     const video = await Video.findById(videoId);

//     video.comments.push({
//       userId: req.auth.userId,
//       texte,
//     });
//     await video.save();

//     res.json(video.comments);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };