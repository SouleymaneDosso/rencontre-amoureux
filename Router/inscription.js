const express = require("express");
const router = express.Router();


const sinscrire = require("../logiquemetier/inscription");

router.post("/inscription", sinscrire.inscription);

module.exports = router;
