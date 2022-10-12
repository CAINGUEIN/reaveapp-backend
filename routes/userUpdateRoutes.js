const express = require("express");
const userUpdateRouter = express.Router();

const TokenHelpers = require("../coreMiddlewares/tokenHelpers");
const userControllers = require("../controllers/userControllers");
const DataSave = require("../middlewares/dataSave");
const RequestApiLol = require("../middlewares/requestApi");
const searchHelpers = require("../middlewares/searchHelpers");
const DataCheck = require("../middlewares/dataCheck");
const DataMatchReturnControllers = require("../controllers/dataMatchReturnControllers");
const MediaSave = require("../middlewares/mediaSave");

//multer
const multer = require('multer');
const storage = multer.memoryStorage();
const uploads = multer({storage}) 

userUpdateRouter.put(
  "/email",
  TokenHelpers.verifyTokenId,
  userControllers.updateUser
);

userUpdateRouter.put(
  "/lol/puuid",
  TokenHelpers.verifyTokenId,
  //recup l'objet user
  searchHelpers.findWithId, // dans req.dataUser
  //m qui check si le puuid exist deja
  DataCheck.puuidMatch,
  //recup avec le puuid les xx derniers matchId
  RequestApiLol.requestMatchsListWithDataUser, // dans req.resultListMatchsApiLol
  //verifier si il existe deja des match enregistré par d'autre user pour ce user
  //faire 2 Array un oui et l'autre non
  DataCheck.lolMatch, // dans req.listMatchExist req.listMatchNoExist
  //si non recup les matchs comme avec requestManyMatchsInfo
  RequestApiLol.requestManyMatchsInfo,
  //si oui ajouter le user dans les data du match et le match dans les data du user
  DataSave.updateDataLolMatch,
  //pour finir un bon vieux DataSave.saveUpdateDataUser
  DataSave.saveUpdateDataUser,
  //mise en place d'une fin de route dite controllers qui va faire le retour d'info
  //ici les 20 dernier match
  DataMatchReturnControllers.twentyMatchLol,
);

userUpdateRouter.post(
  "/img/avatar",
  TokenHelpers.verifyTokenId,
  //m multer
  //recup l'image
  uploads.single('img'),
  //transforme l'image en toute les tailles
  MediaSave.imgResizeAvatar
)

userUpdateRouter.post(
  "/img/banner",
  TokenHelpers.verifyTokenId,
  //m multer
  //recup l'image
  uploads.single('img'),
  //transforme l'image en toute les tailles
  MediaSave.imgResizeBanner
)

userUpdateRouter.post(
  "/img/profileFriend",
  TokenHelpers.verifyTokenId,
  //m multer
  //recup l'image
  uploads.single('img'),
  //transforme l'image en toute les tailles
  MediaSave.imgResizeProfileFriend
)

userUpdateRouter.post(
  "/identity",
  TokenHelpers.verifyTokenId,
  //m multer
  userControllers.updateUserIdentity
)

userUpdateRouter.post(
  "/description",
  TokenHelpers.verifyTokenId,
  //m multer
  userControllers.updateUserDescription
)

module.exports = userUpdateRouter;