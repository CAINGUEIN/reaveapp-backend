const express = require("express");
const versionControllers = require("../controllers/versionControllers");
const versionRouter = express.Router();

const TokenHelpers = require("../coreMiddlewares/tokenHelpers");

versionRouter.get("/last", versionControllers.lastVersionLolData );

module.exports = versionRouter;
