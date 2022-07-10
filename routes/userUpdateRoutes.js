const express = require("express");
const userUpdateRouter = express.Router();

const TokenHelpers = require("../middlewares/tokenHelpers");
const userControllers = require("../controllers/userControllers");
const DataSave = require("../middlewares/dataSave");
const RequestApiLol = require("../middlewares/requestApi");
const searchHelpers = require("../middlewares/searchHelpers");

userUpdateRouter.put(
  "/email",
  TokenHelpers.verifyTokenId,
  userControllers.updateUser
);

userUpdateRouter.put(
  "/lol/puuid",
  TokenHelpers.verifyTokenId,
  //m qui recup la list des match
  RequestApiLol.requestMatchsListWithBody, // dans req.resultListMatchsApiLol
  //m faire une verification pour savoir si le match est deja save
  // si oui rajouter le joueur dans la data du match et return le match
  //m qui recup les data du last match du joueur
  RequestApiLol.dataMatchInfo,
  //m qui save dans la collection match
  DataSave.saveMatchLol,
  //m qui save la list dans le user
  DataSave.savePuuidAndLastMatchInfo,
  //C qui le save dans la db
  userControllers.updateMatchUser
);

userUpdateRouter.put(
  "/lol/lastTeenMatchList",
  TokenHelpers.verifyTokenId,
  //recup l'objet user
  searchHelpers.findWithId, // dans req.dataUser
  //recup avec le puuid les xx derniers matchId
  RequestApiLol.requestMatchsListWithDataUser, // dans req.resultListMatchsApiLol
  /* 
  comparer avec les matchId en data user
  faire une boucle pour recup les xx match info et a chaque boucle faire une save dans le user des match recup 
  ajouté dans le data user les ref des match recup
  */
  RequestApiLol.requestManyMatchsInfo,
  //save de modification apporté dans req.dataUser
  DataSave.saveUpdateDataUser,
  //retourner la liste des 10 derniers match du data user
);

module.exports = userUpdateRouter;
