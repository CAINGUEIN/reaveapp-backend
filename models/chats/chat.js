const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    user: {
      type: String,
      require: true,
      /* type: mongoose.ObjectId,
      ref: "user", */
    },
    msg: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model("chat", chatSchema);

module.exports = ChatModel;
