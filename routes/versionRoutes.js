const express = require("express");
const VersionLol = require("../components/data/versionLol");
const versionRouter = express.Router();

versionRouter.get("/last", VersionLol.lastVersion );

module.exports = versionRouter;
