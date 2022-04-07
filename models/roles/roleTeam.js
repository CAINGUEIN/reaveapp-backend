const mongoose = require("mongoose");

const roleTeamSchema = mongoose.Schema(
  {
    roleTeamName: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoleTeamModel = mongoose.model("roleTeam", roleTeamSchema);

module.exports = RoleTeamModel;
