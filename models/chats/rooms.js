const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    name: { require: true, type: String },
    _id_category: { type: mongoose.ObjectId, ref: "category" },
    _id_messages: [{ type: mongoose.ObjectId, ref: "message" }],
    _id_writes: [{ type: mongoose.ObjectId, ref: "permission" }],
    _id_reads: [{ type: mongoose.ObjectId, ref: "permission" }],
    _id_updates: [{ type: mongoose.ObjectId, ref: "permission" }],
    _id_deletes: [{ type: mongoose.ObjectId, ref: "permission" }],
  },
  {
    timestamps: true,
  }
);

const RoomModel = mongoose.model("room", roomSchema);

module.exports = RoomModel;
