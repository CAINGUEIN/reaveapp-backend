const express = require("express");
const TokenHelpers = require("../components/core/tokenHelpers");
const TicketControllers = require("../components/event/ticket");
const ticketRouter = express.Router();

ticketRouter.post("/info", TokenHelpers.verifyTokenId, TicketControllers.infoTicket );

module.exports = ticketRouter;
