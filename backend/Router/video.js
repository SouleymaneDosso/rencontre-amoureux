const express = require("express");
const router = express.Router()
const auth = require("../middleware/auth");
const upload = require("../multer")

const {uploadCloudinary, getMyVideos, getAllVideos, likes, description , comment} = require("../logiquemetier/video");

router.post("/videos",auth, upload.array("video",10), uploadCloudinary)
router.get("/mesvideos",auth, getMyVideos)
router.get("/videos/public", getAllVideos)
router.put("/likes/:videoId", auth, likes)
router.put("/commente/:videoId", auth, comment)
router.put("/videos/description/:videoId", auth, description);

module.exports = router;