const express = require("express");
const socialRouter = express.Router();

const TokenHelpers = require("../coreMiddlewares/tokenHelpers");
const followControllers = require("../controllers/followControllers")

socialRouter.post("/following", TokenHelpers.verifyTokenId, followControllers.follow);

socialRouter.post("/unfollowing", TokenHelpers.verifyTokenId, followControllers.unfollow);

module.exports = socialRouter;
