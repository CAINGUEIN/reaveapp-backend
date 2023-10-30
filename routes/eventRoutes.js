const express = require("express");
const eventRouter = express.Router();

const TokenHelpers = require("../components/core/tokenHelpers");
const DataCheck = require("../components/data/dataCheck");
const EventControllers = require("../components/event/event");
const TicketControllers = require("../components/event/ticket");
const PermissionsValidate = require("../components/permissions/permissionsValidate");
const userControllers = require("../components/users/userControllers");

eventRouter.post(
  "/create",
  TokenHelpers.verifyTokenId,
  EventControllers.createEvent
);

eventRouter.post(
  "/createVenue",
  TokenHelpers.verifyTokenId,
  EventControllers.createVenue
);

eventRouter.post(
  "/sendData",
  TokenHelpers.verifyTokenId,
  async (req, res) => {
    const venueId = req.body.venueId;
    const venueName = req.body.venueName
    const street = req.body.street;
    const city = req.body.city;
    const pCode = req.body.pCode;
    const country = req.body.country;
    
    EventControllers.addVenueAddressData(venueId, venueName, street, city, pCode, country, res);
    
    }
  
);

eventRouter.post(
  "/list",
  TokenHelpers.verifyTokenId,
  EventControllers.listEvent
);

eventRouter.post(
  "/data",
  TokenHelpers.verifyTokenId,
  EventControllers.dataEvent
);

eventRouter.post(
  "/dataVenue",
  TokenHelpers.verifyTokenId,
  EventControllers.dataVenue
);

eventRouter.post(
  "/buy",
  TokenHelpers.verifyTokenId,
  EventControllers.recupTicket,
  userControllers.debitCoin,
  TicketControllers.generateTicket,
  EventControllers.soldTicket,
  userControllers.addTicket
);

eventRouter.get(
  "/personalOperator",
  TokenHelpers.verifyTokenId,
  EventControllers.personalOperator
);

eventRouter.get(
  "/personalOperatorVenue",
  TokenHelpers.verifyTokenId,
  EventControllers.personalOperatorVenue
);

eventRouter.post(
  "/update",
  TokenHelpers.verifyTokenId,
  EventControllers.update
);

eventRouter.post(
  "/addStaff",
  TokenHelpers.verifyTokenId,
  PermissionsValidate.isAdmin,
  DataCheck.verifyStaff,
  EventControllers.addStaff
);

eventRouter.post(
  "/addStaffAndSwitchOwner",
  TokenHelpers.verifyTokenId,
  PermissionsValidate.isAdmin,
  DataCheck.verifyStaff,
  EventControllers.addStaffAndSwitchOwner
);

eventRouter.post(
  "/modifyStaff",
  TokenHelpers.verifyTokenId,
  PermissionsValidate.isAdmin,
  EventControllers.modifyStaff
);

eventRouter.post(
  "/modifyStaffAndSwitchOwner",
  TokenHelpers.verifyTokenId,
  PermissionsValidate.isAdmin,
  EventControllers.modifyStaffAndSwitchOwner
);

eventRouter.post(
  "/createTicketForEvent",
  TokenHelpers.verifyTokenId,
  PermissionsValidate.isAdmin,
  TicketControllers.createTicketForEvent
);

eventRouter.post(
  "/removeStaff",
  TokenHelpers.verifyTokenId,
  PermissionsValidate.isAdmin,
  EventControllers.removeStaff
);

eventRouter.post(
  "/addItem",
  TokenHelpers.verifyTokenId,
  PermissionsValidate.isAdmin,
  EventControllers.addItem
);
eventRouter.post(
  "/modifyItem",
  TokenHelpers.verifyTokenId,
  PermissionsValidate.isAdmin,
  EventControllers.modifyItem
);
eventRouter.post(
  "/removeItem",
  TokenHelpers.verifyTokenId,
  PermissionsValidate.isAdmin,
  EventControllers.removeItem
);
module.exports = eventRouter;
