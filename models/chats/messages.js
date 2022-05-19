const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    _id_sender: { require: true, type: mongoose.ObjectId, ref: "user" },
    _id_receiver: { type: mongoose.ObjectId, ref: "user" },
    content: { require: true, type: String },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("message", messageSchema);

module.exports = MessageModel;
