const express = require("express");
const publicRouter = express.Router();

// route test
publicRouter.get("/", function (req, res, next) {
  res.send("Coucou");
});

module.exports = publicRouter;
