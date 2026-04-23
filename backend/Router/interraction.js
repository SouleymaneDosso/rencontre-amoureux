const express = require("express");
const router = express.Router()

const upload = require("../multer")

const {uploadCloudinary} = require("../logiquemetier/interraction");

router.post("/videos", upload.array("video",10), uploadCloudinary)

module.exports = router;