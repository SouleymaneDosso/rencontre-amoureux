const express = require("express");
import Video from './../../frontend/src/pages/videos/index';
const router = express.Router()
const auth = require("../middleware/auth");
const upload = require("../multer")

const {uploadCloudinary, getvideo, getalldeo } = require("../logiquemetier/interraction");

router.post("/videos",auth, upload.array("video",10), uploadCloudinary)
router.get("/mesvideos",auth, getvideo)
router.get("/publicdeo", getalldeo)

module.exports = router;