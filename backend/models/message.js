const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    expediteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profil",
      required: true,
      index: true,
    },

    destinataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profil",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "system"],
      default: "text",
    },

    contenu: {
      type: String,
      trim: true,
      default: "",
    },

    media: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
      originalname: {
        type: String,
        default: "",
      },
      mimetype: {
        type: String,
        default: "",
      },
      size: {
        type: Number,
        default: 0,
      },
      duration: {
        type: Number,
        default: 0,
      },
      thumbnail: {
        type: String,
        default: "",
      },
    },

    statut: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },

    dateLecture: {
      type: Date,
      default: null,
    },

    supprimePourMoi: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profil",
      },
    ],

    supprimePourTous: {
      type: Boolean,
      default: false,
    },

    modifie: {
      type: Boolean,
      default: false,
    },

    reponseA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Profil",
        },
        emoji: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);