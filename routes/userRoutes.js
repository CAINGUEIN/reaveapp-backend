const express = require("express");
const userRouter = express.Router();

const TokenHelpers = require("../middlewares/tokenHelpers");
const userControllers = require("../controllers/userControllers");
const FriendControllers = require("../controllers/friendsControllers");

userRouter.get(
  "/checkToken",
  TokenHelpers.verifyTokenId,
  userControllers.infoUser
);

userRouter.put(
  "/update",
  TokenHelpers.verifyTokenId,
  userControllers.updateUser
);

userRouter.delete(
  "/delete",
  TokenHelpers.verifyTokenId,
  userControllers.deleteUser
);

userRouter.post(
  "/friend/add",
  TokenHelpers.verifyTokenId,
  FriendControllers.addFriend
);
userRouter.get(
  "friend/validate",
  TokenHelpers.verifyTokenId,
  FriendControllers.validateAddFriend
);

module.exports = userRouter;
