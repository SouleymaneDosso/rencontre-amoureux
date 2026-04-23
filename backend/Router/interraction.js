const express = require("express");
const router = express.Router()

const upload = require("../multer")

const {uploadCloudinary, getvideo } = require("../logiquemetier/interraction");

router.post("/videos", upload.array("video",10), uploadCloudinary)
router.get("/mesvideos", getvideo)

module.exports = router;