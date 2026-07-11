const mongoose = require('mongoose');

const profilSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Connexion",
    required: true,
    unique: true
  },

  // Identité visible
  pseudo: { type: String, trim: true, unique: true },
  nom: { type: String, trim: true },
  prenom: { type: String, trim: true },
  age: { type: Number, required: true, min: 18, max: 100 },

  // Localisation
  pays: { type: String, required: true, trim: true },
  ville: { type: String, required: true, trim: true },

  // Profil public
  bio: { type: String, maxlength: 500, default: "" },

  photos: [
    {
      url: String,
      public_id: String,
    }
  ],

  avatar: {
    url: String,
    public_id: String,
  },

  // Matching
  genre: {
    type: String,
    enum: ['homme', 'femme', 'autre'],
    required: true
  },

  recherche: {
    type: String,
    enum: ['homme', 'femme', 'tous'],
    required: true
  },

  centresInteret: [{ type: String, trim: true }],

  // Statut
  enLigne: { type: Boolean, default: false },
  verifie: { type: Boolean, default: false },

  // Visibilité
  profilPublic: { type: Boolean, default: true },

  // Matching social
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profil' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profil' }],
  matchs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profil' }],

}, { timestamps: true });

module.exports = mongoose.model('Profil', profilSchema);