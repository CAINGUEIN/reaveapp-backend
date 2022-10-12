const express = require("express");
const SearchRouter = express.Router();

const TokenHelpers = require("../components/core/tokenHelpers");
const searchControllers = require("../components/social/searchUsers");
const searchHelpers = require("../components/core/searchHelpers");

SearchRouter.post(
  "/users",
  TokenHelpers.verifyTokenId,
  searchHelpers.usersNameList,
  searchHelpers.profileTagList,
  searchControllers.usersList
);

module.exports = SearchRouter;
