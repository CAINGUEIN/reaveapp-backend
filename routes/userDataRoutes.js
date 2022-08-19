const express = require("express");
const DataControllers = require("../controllers/dataControllers");
const userDataRouter = express.Router();

const DataMatchReturnControllers = require("../controllers/dataMatchReturnControllers");
const FilterForQuery = require("../controllers/filterForQuery");
const FormatData = require("../controllers/formatData");
const DataSave = require("../middlewares/dataSave");
const RequestApiLol = require("../middlewares/requestApi");
const searchHelpers = require("../middlewares/searchHelpers");
const TokenHelpers = require("../middlewares/tokenHelpers");

userDataRouter.post(
  "/lol/lastMatchList",
  TokenHelpers.verifyTokenId,
  searchHelpers.findWithId,
  RequestApiLol.requestAllMatchFor1MounthsWithDataUser,
  RequestApiLol.requestManyMatchsInfo,
  DataSave.saveUpdateDataUser,
  FilterForQuery.optionForLolHistory,
  DataMatchReturnControllers.twentyMatchLol
);

userDataRouter.post(
  "/lol/filteredMatchList",
  TokenHelpers.verifyTokenId,
  searchHelpers.findWithId,
  RequestApiLol.requestAllMatchFor1MounthsWithDataUser,
  RequestApiLol.requestManyMatchsInfo,
  DataSave.saveUpdateDataUser,
  FilterForQuery.optionForLolHistory,
  DataMatchReturnControllers.twentyFilteredMatchLol
);

userDataRouter.post(
  "/lol/matchSummary",
  TokenHelpers.verifyTokenId,
  DataControllers.lolMatchSummary
);

userDataRouter.post(
  "/lol/dashboard",
  TokenHelpers.verifyTokenId,
  searchHelpers.findWithId,
  FilterForQuery.optionForLolDashboard,
  DataMatchReturnControllers.dataForDashboard,
  //TODO: penser a renomer et range tout les M et C
  FormatData.dashboard
);

module.exports = userDataRouter;
