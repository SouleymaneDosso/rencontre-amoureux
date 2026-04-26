const express = require("express");
const router = express.Router()
const auth = require("../middleware/auth");
const upload = require("../multer")

const {uploadCloudinary, getvideo, getalldeo} = require("../logiquemetier/interraction");

router.post("/videos",auth, upload.array("video",10), uploadCloudinary)
router.get("/mesvideos",auth, getvideo)
router.get("/videos/public", getalldeo)

module.exports = router;