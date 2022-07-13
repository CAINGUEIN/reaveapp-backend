const mongoose = require("mongoose");

const versionMAJ = mongoose.Schema(
  {
    version: String,
    summoner: Object,
    runesReforged: Object,
    map: Object,
    item: Object,
    champion: Object,
    championFull: Object,
    item: Object,
  },
  {
    timestamps: true,
  }
);

const ModelVersion = mongoose.model("version", versionMAJ);

module.exports = ModelVersion;
