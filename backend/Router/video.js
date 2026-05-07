const express = require("express");
const router = express.Router()
const auth = require("../middleware/auth");
const upload = require("../multer")

const {uploadCloudinary, getMyVideos, getAllVideos, likes } = require("../logiquemetier/video");

router.post("/videos",auth, upload.array("video",10), uploadCloudinary)
router.get("/mesvideos",auth, getMyVideos)
router.get("/videos/public", getAllVideos)
router.put("/likes/:videoId", auth, likes)

module.exports = router;