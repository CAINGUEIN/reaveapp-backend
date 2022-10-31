const express = require("express");
const eventRouter = express.Router();

const TokenHelpers = require("../components/core/tokenHelpers");
const EventControllers = require("../components/event/event");

eventRouter.post(
  "/create",
  TokenHelpers.verifyTokenId,
  EventControllers.createEvent
);

module.exports = eventRouter;
