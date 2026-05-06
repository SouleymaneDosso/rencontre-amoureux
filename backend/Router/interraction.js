const express = require("express");
const router = express.Router()
const auth = require("../middleware/auth");
const upload = require("../multer")

const {uploadCloudinary, getvideo, getalldeo, likes } = require("../logiquemetier/interraction");

router.post("/videos",auth, upload.array("video",10), uploadCloudinary)
router.get("/mesvideos",auth, getvideo)
router.get("/videos/public", getalldeo)
router.put("/likes/:videoId", auth, likes)

module.exports = router;