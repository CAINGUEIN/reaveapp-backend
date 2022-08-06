const GameLolModel = require("../models/game");
const UserModel = require("../models/user");

const DataCheck = {
  puuidMatch(req, res, next) {
    UserModel.findOne({ "lolData.lolPuuid": req.body.lolPuuid })
      .then((userMatch) => {
        if (userMatch === null) {
          req.dataUser.lolData.lolPuuid = req.body.lolPuuid
          next();
        } else {
          return res.status(400).send({
            success: false,
            message: "Erreur Puuid if exist",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send({
          success: false,
          message: "Erreur Puuid",
          data: err,
        });
      });
  },
  /**
   * @info check if exist _id_match
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @need req.resultListMatchsApiLol
   * @return 2 array req.listMatchExist req.listMatchNoExist
   */
  lolMatch(req, res, next) {
    GameLolModel.find({
      _id_match: { $in: req.resultListMatchsApiLol },
    }).then((matchs) => {
      req.listMatchExist = matchs
      console.log(matchs);
      let matchsIds = matchs.map((item) => item._id_match);
      req.listMatchNoExist = req.resultListMatchsApiLol.filter(
        (item) => !matchsIds.includes(item)
      );
      console.log(req.listMatchExist, req.listMatchNoExist);
      next()
    }).catch((err) => {
      console.log(err);
      return res.status(400).send({
        success: false,
        message: "Erreur filters match",
        data: err,
      });
    });
  },
};

module.exports = DataCheck;
