const express = require("express");
const userDataRouter = express.Router();


const DataReturnLol = require("../components/data/dataReturnLol");
const FilterForQuery = require("../components/data/filterForQuery");
const FormatData = require("../components/data/formatData");
const DataSave = require("../components/data/dataSave");
const RequestApiLol = require("../components/api/requestApi");
const searchHelpers = require("../components/core/searchHelpers");
const TokenHelpers = require("../components/core/tokenHelpers");

userDataRouter.post(
  "/lol/lastMatchList",
  TokenHelpers.verifyTokenId,
  searchHelpers.findWithId,
  RequestApiLol.requestAllMatchFor1MounthsWithDataUser,
  RequestApiLol.requestManyMatchsInfo,
  DataSave.saveUpdateDataUser,
  FilterForQuery.optionForLolHistory,
  DataReturnLol.multiFilteredMatch
);

userDataRouter.post(
  "/lol/filteredMatchList",
  TokenHelpers.verifyTokenId,
  searchHelpers.findWithId,
  RequestApiLol.requestAllMatchFor1MounthsWithDataUser,
  RequestApiLol.requestManyMatchsInfo,
  DataSave.saveUpdateDataUser,
  FilterForQuery.optionForLolHistory,
  DataReturnLol.multiFilteredMatch
);

userDataRouter.post(
  "/lol/matchSummary",
  TokenHelpers.verifyTokenId,
  DataReturnLol.oneMatch
);

userDataRouter.post(
  "/lol/dashboard",
  TokenHelpers.verifyTokenId,
  searchHelpers.findWithId,
  FilterForQuery.optionForLolDashboard,
  DataReturnLol.forDashboard,
  FormatData.dashboard
);

module.exports = userDataRouter;
