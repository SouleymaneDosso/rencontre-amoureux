const Connexion = require("../models/connexion");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.inscription = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Tous les champs sont nécessaires !" });
    }

    const existe = await Connexion.findOne({ email });

    if (existe) {
      return res.status(400).json({ message: "Cet email est déjà utilisé !" });
    }

    const hash = await bcrypt.hash(code, 10);

    const valeur = new Connexion({
      email,
      code: hash,
      profilCree: false
    });

    await valeur.save();

    const token = jwt.sign(
      { userId: valeur._id },
      process.env.JWT_SECRET || "TOKEN_SECRET"
    );

    res.status(201).json({
      message: "Inscription réussie !",
      token,
      userId: valeur._id,
      profilCree: valeur.profilCree
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};