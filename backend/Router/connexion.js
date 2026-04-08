const express = require("express")
const Router = express.Router()

const seconnecter = require("../logiquemetier/connexion")

Router.post("/connexion", seconnecter.login )

module.exports = Router;