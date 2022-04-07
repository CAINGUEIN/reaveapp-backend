const mongoose = require("mongoose");

const roleCommunitySchema = mongoose.Schema(
  {
    roleCommunityName: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoleCommunityModel = mongoose.model("roleCommunity", roleCommunitySchema);

module.exports = RoleCommunityModel;
