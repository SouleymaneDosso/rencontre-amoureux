const multer = require("multer");

// 📦 stockage en mémoire (buffer)
const storage = multer.memoryStorage();

// 🔒 filtre types autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format non supporté"), false);
  }
};

// ⚙️ configuration multer
const upload = multer({
  storage,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter,
});

module.exports = upload;