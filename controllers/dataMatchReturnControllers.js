const GameLolModel = require("../models/game");
const UserModel = require("../models/user");

const DataMatchReturnControllers = {
  async twentyMatchLol(req, res, next) {
    UserModel.findById(req.decodedToken._id)
      .populate("lolData.lolMatchs._id_lolMatch")
      .exec((err, result) => {
        if (err)
          return res.status(400).send({
            success: false,
            message: "Erreur data user",
          });
        if (result === null) {
          return res.status(400).send({
            success: false,
            message: "Erreur user delete",
          });
        }
        return res.status(200).send({
          success: true,
          message: "Ok twenty match lol",
          data: result.lolData.lolMatchs.slice(0, 20),
        });
      });
  },

  async twentyFilteredMatchLol(req, res, next) {
    //pour les match gagné perdu value = boolean
    //"statTotal.win": value, _id_user: req.decodedToken._id
    //pour les match joué avec un champions value = string
    //"statTotal.championName" : value, _id_user: req.decodedToken._id
    //pour les match avec comme position value = string
    //""
    GameLolModel.find({
      players: {
        $elemMatch: { "statTotal.win": true, _id_user: req.decodedToken._id },
      },
    }).limite(20)
      .then((result) => {
        return res.status(200).send({
          success: true,
          message: "Ok twenty filtered match lol",
          data: result,
        });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur data user",
        });
      });
  },
};

module.exports = DataMatchReturnControllers;
