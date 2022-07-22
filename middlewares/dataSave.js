const DataFormateHelper = require("../functionHelper/dataFormate");
const GameLolModel = require("../models/game");
const UserModel = require("../models/user");

const DataSave = {
  savePuuidAndLastMatchInfo(req, res, next) {
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
    //passer par une fonction helper pour formater la data
    let data = DataFormateHelper.infoLolMatch(
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
    console.log("save update");
    req.dataUser.save((err, result) => {
      if (err !== null) {
        return res.status(400).send({
          success: false,
          message: "Erreur save last Match update",
          data: err,
        });
      } else {
        console.log(result);
        UserModel.populate(
          result,
          {
            path: "lolData.lolMatchs._id_lolMatch",
          },
          (err, result) => {
            if (err) {
              return res.status(400).send({
                success: false,
                message: "Erreur populate last Match update",
                data: err,
              });
            } else {
              let cut = result.lolData.lolMatchs.length
              return res.status(200).send({
                success: true,
                message: "Ok pour la recup des 20 dernier matchs",
                data: result.lolData.lolMatchs.slice(0, 20)
              })
            }
          }
        );
      }
    });
  },
};

module.exports = DataSave;
