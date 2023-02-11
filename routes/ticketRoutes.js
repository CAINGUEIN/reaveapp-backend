const express = require("express");
const TokenHelpers = require("../components/core/tokenHelpers");
const EventControllers = require("../components/event/event");
const TicketControllers = require("../components/event/ticket");
const userControllers = require("../components/users/userControllers");
const ticketRouter = express.Router();

ticketRouter.post(
  "/info",
  TokenHelpers.verifyTokenId,
  TicketControllers.infoTicket
);

ticketRouter.post(
  "/buy",
  TokenHelpers.verifyTokenId,
  // check la solavabilité

  //check coin et debit
  userControllers.debitCoinForNewTicket,
  // pour faire bien verifier si tu le ticket acheté sont toujours dispo
  TicketControllers.checkTicket,
  // si dispo generer les ticket
  TicketControllers.createTicket,
  /* ici je créer 2 variable
    req.erreurCreateTickets = erreurCreateTickets;
    req.checkCreateTickets = checkCreateTickets;
  */
  // enregistré les ticket dans l'event
  EventControllers.addSoldeTickets,
  /* ici je créer 1 variable
    req.updateEvent = updateEvent;
  */
  // enregistré les ticket dans les user Owner
  userControllers.addNewTicket
);

module.exports = ticketRouter;
