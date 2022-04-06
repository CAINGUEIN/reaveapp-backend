const express = require("express");
const userRouter = express.Router();

const TokenHelpers = require("../middlewares/tokenHelpers");
const userControllers = require("../controllers/userControllers");

userRouter.get("/info", TokenHelpers.verifyTokenId, userControllers.infoUser);

userRouter.delete(
  "/delete",
  TokenHelpers.verifyTokenId,
  userControllers.deleteUser
);

module.exports = userRouter;