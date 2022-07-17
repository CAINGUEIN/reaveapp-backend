const express = require("express");
const DataControllers = require("../controllers/dataControllers");
const TokenHelpers = require("../middlewares/tokenHelpers");
const lolDataRouter = express.Router();

lolDataRouter.post(
  "/matchSummary",
  TokenHelpers.verifyTokenId,
  DataControllers.lolMatchSummary
);

module.exports = lolDataRouter;
