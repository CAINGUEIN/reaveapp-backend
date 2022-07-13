const express = require("express");
const versionControllers = require("../controllers/versionControllers");
const versionRouter = express.Router();

const TokenHelpers = require("../middlewares/tokenHelpers");

versionRouter.get("/last", TokenHelpers.verifyTokenId, versionControllers.lastVersionLolData );

module.exports = versionRouter;
