const express = require("express");
const userRouter = express.Router();

const TokenHelpers = require("../components/core/tokenHelpers");
const userControllers = require("../components/users/userControllers");
const FriendControllers = require("../components/social/friends");

userRouter.get(
  "/checkToken",
  TokenHelpers.verifyTokenId,
  userControllers.infoUser
);

userRouter.delete(
  "/delete",
  TokenHelpers.verifyTokenId,
  userControllers.deleteUser
);

userRouter.post(
  "/ban",
  TokenHelpers.verifyTokenId,
  userControllers.banUser
);

userRouter.post(
  "/friend/add",
  TokenHelpers.verifyTokenId,
  FriendControllers.addFriend
);
userRouter.post(
  "/friend/validate",
  TokenHelpers.verifyTokenId,
  FriendControllers.validateAddFriend
);
userRouter.post(
  "/friend/decline",
  TokenHelpers.verifyTokenId,
  FriendControllers.declineFriend
);

module.exports = userRouter;
