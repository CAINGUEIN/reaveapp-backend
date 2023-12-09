const express = require("express");
const spaceRouter = express.Router();

const TokenHelpers = require("../components/core/tokenHelpers");
const SpaceControllers = require("../components/space/spacesControllers");

//TODO: prevoir un middleware pour recup et stocker une image
// l'image une fois stocker doit rendre un url pour le mettre dans la db

spaceRouter.post(
  "/allSpaces",
  SpaceControllers.checkSpace
);
spaceRouter.post(
  "/checkSpace",
  TokenHelpers.verifyTokenId,
  SpaceControllers.infoAllSpaceForUser
);
spaceRouter.post(
  "/allRooms",
  TokenHelpers.verifyTokenId,
  SpaceControllers.allRooms
);

//TODO: prevoir un middleware qui verifie les droits
spaceRouter.post(
  "/create",
  TokenHelpers.verifyTokenId,
  SpaceControllers.createSpace
);
spaceRouter.put(
  "/addRoom",
  TokenHelpers.verifyTokenId,
  SpaceControllers.addRoom
);

spaceRouter.post(
  "/delete",
  TokenHelpers.verifyTokenId,
  SpaceControllers.deleteSpace
);

spaceRouter.post(
  "/deleteRoom",
  TokenHelpers.verifyTokenId,
  SpaceControllers.deleteRoom
);
spaceRouter.put(
  "/addCategory",
  TokenHelpers.verifyTokenId,
  SpaceControllers.addCategory
);
spaceRouter.post(
  "/deleteCategory",
  TokenHelpers.verifyTokenId,
  SpaceControllers.deleteCategory
);

module.exports = spaceRouter;
