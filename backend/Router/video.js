const express = require("express");
const router = express.Router()
const auth = require("../middleware/auth");
const upload = require("../multer")

const videos = require("../logiquemetier/video");

router.post("/videos",auth, upload.array("video",10), videos.uploadCloudinary)
router.get("/mesvideos",auth, videos.getMyVideos)
router.get("/videos/public", videos.getAllVideos) 
router.put("/likes/:videoId", auth, videos.likes)
router.put("/commente/:videoId", auth, videos.comment)
router.put("/reply/:videoId/:commentId", auth, videos.replyComment);
module.exports = router;