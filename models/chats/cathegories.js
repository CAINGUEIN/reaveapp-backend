const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: { require: true, type: String },
    _id_rooms: [{ type: mongoose.ObjectId, ref: "room" }],
    _id_writes: [{ type: mongoose.ObjectId, ref: "permission" }],
    _id_reads: [{ type: mongoose.ObjectId, ref: "permission" }],
    _id_updates: [{ type: mongoose.ObjectId, ref: "permission" }],
    _id_deletes: [{ type: mongoose.ObjectId, ref: "permission" }],
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;
