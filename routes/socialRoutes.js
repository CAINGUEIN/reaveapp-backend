const express = require("express");
const socialRouter = express.Router();

const TokenHelpers = require("../components/core/tokenHelpers");
const followControllers = require("../components/social/follow")

socialRouter.post("/following", TokenHelpers.verifyTokenId, followControllers.follow);

socialRouter.post("/unfollowing", TokenHelpers.verifyTokenId, followControllers.unfollow);

module.exports = socialRouter;
