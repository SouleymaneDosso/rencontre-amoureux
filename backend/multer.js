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
    "video/quicktime",
    "video/webm",
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
  fileFilter,
});

module.exports = upload;
