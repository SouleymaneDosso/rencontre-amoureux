const streamifier = require("streamifier");
const cloudinary = require("../cloudinary");
const Video = require("../models/interraction");


exports.uploadCloudinary = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const uploadpromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
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

    res.json(videos);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getvideo = async (req, res) => {
  try {
    const data = await Interraction.findOne({
      userId: req.auth.userId,
    });

    if (!data) return res.json([]);

    res.status(200).json(data.video);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la recuperation des videos " + error.message,
    });
  }
};

exports.getalldeo = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likes = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.auth.userId;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "vidéo introuvable" });
    }

    const existelike = video.likes.includes(userId);

    if (existelike) {
      video.likes = video.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      video.likes.push(userId);
    }

    await video.save();

    res.json({
      likes: video.likes,
      totalLikes: video.likes.length,
      dejaLike: existelike
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};