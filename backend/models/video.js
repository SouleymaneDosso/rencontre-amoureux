const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Connexion",
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    public_id: String,
    nomoriginal: String,
    nomfichier: String,
    duree: Number,
    taille: Number,
    format: String,

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Connexion",
      },
    ],

    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Connexion",
        },
        texte: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Video", videoSchema);
