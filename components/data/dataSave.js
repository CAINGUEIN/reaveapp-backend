const GameLolModel = require("../../models/game");
const UserModel = require("../../models/user");
const dataFormat = require("./formatData");

const DataSave = {
  savePuuidAndLastMatchInfo(req, res, next) {
    //si non on enregistre le PUUID
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        lolData: {
          lolPuuid: req.body.lolPuuid,
          lolMatchs: [
            {
              _id_riot: req.game._id_match,
              _id_lolMatch: req.game._id,
              gameStartTimestamp: req.game.info.gameStartTimestamp,
            },
          ],
        },
      },
      { new: true, runValidators: true }
    )
      .then((userUpdate) => {
        res.status(200).send({
          success: true,
          message: "Ok update last match for user",
          data: userUpdate,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send({
          success: false,
          message: "Erreur save ListMatchs",
          data: err,
        });
      });
  },

  saveMatchLol(req, res, next) {
    //passe par une fonction helper pour formater la data
    let data = dataFormat.infoLolMatch(
      req.decodedToken._id,
      req.resultLastMatchInfoApiLol,
      req.body.lolPuuid
    );
    console.log("data avant le create", data);
    //ici create une nouvelle entré dans la collection gamelol
    GameLolModel.create(data)
      .then((game) => {
        req.game = game;
        next();
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur save MatchLol",
          data: err,
        });
      });
  },

  saveUpdateDataUser(req, res, next) {
    req.dataUser.save((err, result) => {
      if (err !== null) {
        return res.status(400).send({
          success: false,
          message: "Erreur save last Match update",
          data: err,
        });
      } else {
        next()
      }
    });
  },

  updateDataLolMatch(req, res, next) {
    console.log(req.listMatchExist);
    if (req.listMatchExist) {
      for (let index = 0; index < req.listMatchExist.length; index++) {
        for (
          let indexBis = 0;
          indexBis < req.listMatchExist[index].players.length;
          indexBis++
        ) {
          if (
            req.dataUser.lolData.lolPuuid ===
            req.listMatchExist[index].players[indexBis].puuid
          ) {
            req.listMatchExist[index].players[indexBis]._id_user =
              req.decodedToken._id;
            let data = {
              _id_riot: req.listMatchExist[index]._id_match,
              _id_lolMatch: req.listMatchExist[index]._id,
              gameStartTimestamp: req.listMatchExist[index].info.gameStartTimestamp,
            };
            req.dataUser.lolData.lolMatchs.push(data);
          }
        }
        req.listMatchExist[index].save((err, result) => {
          if (err) {
            return res.status(400).send({
              success: false,
              message: "Erreur save lol match",
              data: err,
            });
          }
        });
      }
    }
    next();
  },
};

module.exports = DataSave;
