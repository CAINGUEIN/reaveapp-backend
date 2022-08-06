const express = require("express");
const DataControllers = require("../controllers/dataControllers");
const userDataRouter = express.Router()

const DataMatchReturnControllers = require("../controllers/dataMatchReturnControllers");
const DataSave = require("../middlewares/dataSave");
const RequestApiLol = require("../middlewares/requestApi");
const searchHelpers = require("../middlewares/searchHelpers");
const TokenHelpers = require("../middlewares/tokenHelpers");

userDataRouter.post(
    "/lol/lastMatchList",
    TokenHelpers.verifyTokenId,
    searchHelpers.findWithId,
    RequestApiLol.requestMatchsListWithDataUser,
    RequestApiLol.requestManyMatchsInfo,
    DataSave.saveUpdateDataUser,
    DataMatchReturnControllers.twentyMatchLol,
  );

  userDataRouter.post(
    "/lol/filteredMatchList",
    TokenHelpers.verifyTokenId,
    DataMatchReturnControllers.twentyFilteredMatchLol,
  );

userDataRouter.post(
    "/lol/matchSummary",
    TokenHelpers.verifyTokenId,
    DataControllers.lolMatchSummary
  );

module.exports = userDataRouter