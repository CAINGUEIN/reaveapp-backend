const mongoose = require("mongoose");

const roleEventSchema = mongoose.Schema(
  {
    roleEventName: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoleEventModel = mongoose.model("roleEvent", roleEventSchema);

module.exports = RoleEventModel;
