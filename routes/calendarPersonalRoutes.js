const express = require("express");
const calendarPersonalRouter = express.Router();

const TokenHelpers = require("../coreMiddlewares/tokenHelpers");
const personalCalendarControllers = require("../controllers/personalCalendarControllers")

calendarPersonalRouter.post("/create", TokenHelpers.verifyTokenId, personalCalendarControllers.createEvent);
calendarPersonalRouter.get("/read", TokenHelpers.verifyTokenId);
calendarPersonalRouter.put("/update", TokenHelpers.verifyTokenId);
calendarPersonalRouter.delete("/delete", TokenHelpers.verifyTokenId);

module.exports = calendarPersonalRouter;