const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    expediteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profil",
      required: true,
    },

    destinataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profil",
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "video", "audio"],
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
      duration: {
        type: Number,
        default: 0,
      },
    },

    lu: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);