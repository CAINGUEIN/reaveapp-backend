const mongoose = require("mongoose");

const roleFriendSchema = mongoose.Schema(
  {
    roleFriendName: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoleFriendModel = mongoose.model("roleFriend", roleFriendSchema);

module.exports = RoleFriendModel;
