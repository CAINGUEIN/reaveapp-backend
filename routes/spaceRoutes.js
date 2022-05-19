const express = require("express");
const spaceRouter = express.Router();

const TokenHelpers = require("../middlewares/tokenHelpers");
const SpaceControllers = require("../controllers/spacesControllers");

//TODO: prevoir un middleware pour recup et stocker une image
// l'image une fois stocker doit rendre un url pour le mettre dans la db

spaceRouter.post(
  "/create",
  TokenHelpers.verifyTokenId,
  SpaceControllers.createSpace,
);
spaceRouter.post(
  "/checkSpace",
  TokenHelpers.verifyTokenId,
  SpaceControllers.checkSpace,
);
spaceRouter.post(
  "/allRooms",
  TokenHelpers.verifyTokenId,
  SpaceControllers.allRooms,
);
spaceRouter.post(
  "/addRoom",
  TokenHelpers.verifyTokenId,
  SpaceControllers.addRoom,
);
spaceRouter.post(
  "/addCategory",
  TokenHelpers.verifyTokenId,
  SpaceControllers.addCategory,
);

module.exports = spaceRouter;
