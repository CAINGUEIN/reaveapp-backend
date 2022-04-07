const mongoose = require("mongoose");

const roleOrganisationSchema = mongoose.Schema(
  {
    roleOrganisationName: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoleOrganisationModel = mongoose.model("roleOrganisation", roleOrganisationSchema);

module.exports = RoleOrganisationModel;
