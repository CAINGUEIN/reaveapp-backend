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
