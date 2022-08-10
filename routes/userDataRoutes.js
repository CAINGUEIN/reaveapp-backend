const express = require("express");
const DataControllers = require("../controllers/dataControllers");
const userDataRouter = express.Router()

const DataMatchReturnControllers = require("../controllers/dataMatchReturnControllers");
const FilterForQuery = require("../controllers/filterForQuery");
const DataSave = require("../middlewares/dataSave");
const RequestApiLol = require("../middlewares/requestApi");
const searchHelpers = require("../middlewares/searchHelpers");
const TokenHelpers = require("../middlewares/tokenHelpers");

userDataRouter.post(
    "/lol/lastMatchList",
    TokenHelpers.verifyTokenId,
    searchHelpers.findWithId,
    RequestApiLol.requestAllMatchFor3MounthsWithDataUser,
    RequestApiLol.requestManyMatchsInfo,
    DataSave.saveUpdateDataUser,
    FilterForQuery.optionForLolHistory,
    DataMatchReturnControllers.twentyMatchLol,
  );

  userDataRouter.post(
    "/lol/filteredMatchList",
    TokenHelpers.verifyTokenId,
    FilterForQuery.optionForLolHistory,
    DataMatchReturnControllers.twentyFilteredMatchLol,
  );

userDataRouter.post(
    "/lol/matchSummary",
    TokenHelpers.verifyTokenId,
    DataControllers.lolMatchSummary
  );

module.exports = userDataRouter