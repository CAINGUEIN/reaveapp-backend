const express = require("express");
const userRouter = express.Router();

const TokenHelpers = require("../middlewares/tokenHelpers");
const userControllers = require("../controllers/userControllers");

userRouter.get("/checkToken", TokenHelpers.verifyTokenId, userControllers.infoUser);

userRouter.put("/update", TokenHelpers.verifyTokenId, userControllers.updateUser)

userRouter.delete(
  "/delete",
  TokenHelpers.verifyTokenId,
  userControllers.deleteUser
);

module.exports = userRouter;
