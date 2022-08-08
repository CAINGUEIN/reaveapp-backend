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
    let perpage = "";
    let page = "";
    if (req.body.perpage === undefined) {
      perpage = 20;
    } else {
      perpage = req.body.perpage;
    }
    if (req.body.page === undefined) {
      page = 0;
    } else {
      page = req.body.page;
    }
    GameLolModel.find(req.optionQuery)
      .sort({ "info.gameStartTimestamp": 1 })
      .limit(perpage)
      .skip(page * perpage)
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
