const mongoose = require("mongoose");

const spaceSchema = mongoose.Schema(
  {
    typeOfSpace: {
      type: String,
      require: true,
    },
    dataOfSpace: { type: mongoose.ObjectId, ref: "dataSpace" },
    nameSpace: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 38,
      unique: true,
    },
    birthDay: {
      type: String,
    },
    picture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxLength: 158,
    },
  },
  {
    timestamps: true,
  }
);

const SpaceModel = mongoose.model("space", spaceSchema);

module.exports = SpaceModel;
