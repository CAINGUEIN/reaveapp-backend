const express = require("express");
const eventRouter = express.Router();

const TokenHelpers = require("../components/core/tokenHelpers");
const EventControllers = require("../components/event/event");
const TicketControllers = require("../components/event/ticket");
const userControllers = require("../components/users/userControllers");

eventRouter.post(
  "/create",
  TokenHelpers.verifyTokenId,
  EventControllers.createEvent
);

eventRouter.post(
  "/list",
  TokenHelpers.verifyTokenId,
  EventControllers.listEvent
);

eventRouter.post(
  "/buy",
  TokenHelpers.verifyTokenId,
  //check ticket dispo dans event retrait 1
  EventControllers.recupTicket,
  //check coin et debit
  userControllers.debitCoin,
  //création du ticket id user et id event
  TicketControllers.createTicket,
  //dans event push du id ticket
  EventControllers.soldTicket,
  //dans user push du id ticket
  userControllers.addTicket
);

eventRouter.get("/personalOperator", TokenHelpers.verifyTokenId , EventControllers.personalOperator,);

module.exports = eventRouter;
