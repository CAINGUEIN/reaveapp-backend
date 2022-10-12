const express = require("express");
const calendarPersonalRouter = express.Router();

const TokenHelpers = require("../components/core/tokenHelpers");
const personalCalendarControllers = require("../components/social/personalCalendar")

calendarPersonalRouter.post("/create", TokenHelpers.verifyTokenId, personalCalendarControllers.createEvent);
calendarPersonalRouter.get("/read", TokenHelpers.verifyTokenId);
calendarPersonalRouter.put("/update", TokenHelpers.verifyTokenId);
calendarPersonalRouter.delete("/delete", TokenHelpers.verifyTokenId);

module.exports = calendarPersonalRouter;