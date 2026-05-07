const mongoose = require("mongoose");

const interractionSchema = new mongoose.Schema(
  {
    video: [
      {
        url: {
          type: String,
          default: "",
        },
        public_id: {
          type: String,
          default: "",
        },

        nomoriginal: {
          type: String,
          default: "",
        },

        nomfichier: {
          type: String,
          default: "",
        },

        duree: {
          type: Number,
          default: 0,
        },
        taille: {
          type: Number,
          default: 0,
        },
        format: {
          type: String,
          default: "",
        },

        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Connexion",
          required: true,
        },

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
            texte: {
              type: String,
              default: "",
            },
            date: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },

  { timestamps: true },
);
module.exports = mongoose.model("Interraction", interractionSchema);
