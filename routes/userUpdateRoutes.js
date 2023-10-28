const express = require("express");
const userUpdateRouter = express.Router();

const VenueModel = require("../models/venue");

const TokenHelpers = require("../components/core/tokenHelpers");
const userControllers = require("../components/users/userControllers");
const DataSave = require("../components/data/dataSave");
const RequestApiLol = require("../components/api/requestApi");
const searchHelpers = require("../components/core/searchHelpers");
const DataCheck = require("../components/data/dataCheck");
const MediaSave = require("../components/media/mediaSave");
const DataReturnLol = require("../components/data/dataReturnLol");

///const storage = multer.memoryStorage();

// -Boatti- comment :
// Multer is used to upload pictures.
// Pictures are upload to the folder /uploads.
// Then url of the pic are stored to MongoDB.
// This system is a Local storage system. This is not a good system and is only used for the prototype.
// The solution is an Amazon S3 storage for exemple.

const multer = require('multer');
const { set } = require("..");
const EventControllers = require("../components/event/event");
///const storage = multer({ dest: 'uploads/' })
const storage = multer.diskStorage( {
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + file.originalname);
  },
})
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
  //m qui check si le puuid existe deja
  DataCheck.puuidMatch,
  //recup avec le puuid les xx derniers matchId
  RequestApiLol.requestMatchsListWithDataUser, // dans req.resultListMatchsApiLol
  //verifier si il existe deja des match enregistré par d'autre user pour ce user
  //faire 2 Array un oui et l'autre non
  DataReturnLol.lolMatch, // dans req.listMatchExist req.listMatchNoExist
  //si non recup les matchs comme avec requestManyMatchsInfo
  RequestApiLol.requestManyMatchsInfo,
  //si oui ajouter le user dans les data du match et le match dans les data du user
  DataSave.updateDataLolMatch,
  //pour finir un bon vieux DataSave.saveUpdateDataUser
  DataSave.saveUpdateDataUser,
  //mise en place d'une fin de route dite controllers qui va faire le retour d'info
  //ici les 20 dernier match
  DataReturnLol.multiMatch
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
  "/img/event",
  TokenHelpers.verifyTokenId,
  //m multer
  //recup l'image
  uploads.single('img'),
  //transforme l'image en toute les tailles
  MediaSave.imgResizeEvent
)

userUpdateRouter.post(
  "/pic/venue",
  TokenHelpers.verifyTokenId,
  uploads.single('selectedPic'),
  
  async (req, res) => {
    console.log('mmmmmmmmmm : ', req);
    console.log('SSSSSSSSSSS ' , req.body.venueId);
    const imageName = req.file.filename;
    const venueId = req.body.venueId;
    try {
      EventControllers.addPrimaryPicVenue(imageName, venueId, res);
      //await VenueModel.findOneAndUpdate({ owner : imageName}, {$set : {primaryPic : imageName}})
      //res.send("Successful upload");
    } catch (error) {
      //res.send(error);
    }
  }
  
);


userUpdateRouter.post(
  "/img/item",
  TokenHelpers.verifyTokenId,
  //m multer
  //recup l'image
  uploads.single('img'),
  //transforme l'image en toute les tailles
  MediaSave.imgResizeItem
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
  userControllers.updateUserIdentity
)

userUpdateRouter.post(
  "/description",
  TokenHelpers.verifyTokenId,
  userControllers.updateUserDescription
)

userUpdateRouter.post(
  "/coinBalance",
  TokenHelpers.verifyTokenId,
  userControllers.updateUserCoinBalance
)

userUpdateRouter.post(
  "/sendCoin",
  TokenHelpers.verifyTokenId,
  userControllers.updateUserSendCoin
)

userUpdateRouter.post(
  "/contactPro",
  TokenHelpers.verifyTokenId,
  //pour le moment juste true dans pro
  userControllers.updateUserTruePro
  //dans le body.email l'email de contact
)
module.exports = userUpdateRouter;