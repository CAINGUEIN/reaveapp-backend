const express = require("express");
const SearchRouter = express.Router();

const TokenHelpers = require("../coreMiddlewares/tokenHelpers");
const searchControllers = require("../controllers/searchControllers");
const searchHelpers = require("../middlewares/searchHelpers");

SearchRouter.post(
  "/users",
  TokenHelpers.verifyTokenId,
  searchHelpers.usersNameList,
  searchHelpers.profileTagList,
  searchControllers.usersList
);

module.exports = SearchRouter;
