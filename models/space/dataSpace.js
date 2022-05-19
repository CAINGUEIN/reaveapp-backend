const mongoose = require("mongoose");

/**
 * mon but ici c'est d'avoir un peut la bd qui centralise et interconnect
 */

const dataSpaceSchema = mongoose.Schema(
  {
    users: [
      {
        _id_user: { type: mongoose.ObjectId, ref: "user" },
        pseudo: String,
        _id_roles: [String/* { type: mongoose.ObjectId, ref: "role" } */],
        _id_permissions: [String/* { type: mongoose.ObjectId, ref: "permission" } */],
      },
    ],
    _id_space: [{ type: mongoose.ObjectId, ref: "space" }],
    _id_categories: [{ type: mongoose.ObjectId, ref: "category" }],
    _id_events: [{ type: mongoose.ObjectId, ref: "event" }],
  },
  {
    timestamps: true,
  }
);

const DataSpaceModel = mongoose.model("dataSpace", dataSpaceSchema);

module.exports = DataSpaceModel;
