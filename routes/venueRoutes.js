const express = require("express");
const venueRouter = express.Router();

const TokenHelpers = require("../components/core/tokenHelpers");
const DataCheck = require("../components/data/dataCheck");
const VenueControllers = require("../components/venue/venueControllers");
const PermissionsValidate = require("../components/permissions/permissionsValidate");
const userControllers = require("../components/users/userControllers");

venueRouter.post(
    "/createVenue",
    TokenHelpers.verifyTokenId,
    VenueControllers.createVenue
);

venueRouter.post(
    "/dataVenue",
    TokenHelpers.verifyTokenId,
    VenueControllers.dataVenue
);

venueRouter.post(
    "/sendData",
    TokenHelpers.verifyTokenId,
    async (req, res) => {
        const venueId = req.body.venueId;
        const venueName = req.body.venueName
        const street = req.body.street;
        const city = req.body.city;
        const pCode = req.body.pCode;
        const country = req.body.country;
        VenueControllers.addVenueAddressData(venueId, venueName, street, city, pCode, country, res);
    }
);

venueRouter.get(
    "/personalOperatorVenue",
    TokenHelpers.verifyTokenId,
    VenueControllers.personalOperatorVenue
);

venueRouter.post(
    "/publishVenue",
    TokenHelpers.verifyTokenId,
    VenueControllers.publishVenue
);

venueRouter.post(
    "/findPublishedVenue",
    TokenHelpers.verifyTokenId,
    VenueControllers.findPublishedVenue
);


module.exports = venueRouter;