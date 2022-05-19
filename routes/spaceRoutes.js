const express = require("express");
const friendsRouter = express.Router();

const TokenHelpers = require("../middlewares/tokenHelpers");
const SpaceControllers = require("../controllers/spacesControllers");

//TODO: prevoir un middleware pour recup et stocker une image
// l'image une fois stocker doit rendre un url pour le mettre dans la db

friendsRouter.post(
  "/create",
  TokenHelpers.verifyTokenId,
  SpaceControllers.createSpace,
);
friendsRouter.post(
  "/checkSpace",
  TokenHelpers.verifyTokenId,
  SpaceControllers.checkSpace,
);
friendsRouter.post(
  "/allRooms",
  TokenHelpers.verifyTokenId,
  SpaceControllers.allRooms,
);

module.exports = friendsRouter;
