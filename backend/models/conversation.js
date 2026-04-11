const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profil",
        required: true,
      },
    ],
    dernierMessage: {
      type: String,
      default: "",
    },
    dernierMessageDate: {
      type: Date,
      default: null,
    },
    dernierMessageStatut: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);