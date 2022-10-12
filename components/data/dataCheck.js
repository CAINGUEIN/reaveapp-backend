const GameLolModel = require("../../models/game");
const UserModel = require("../../models/user");

const DataCheck = {
  puuidMatch(req, res, next) {
    //TODO: utiliser le validateur mongoose pour ça
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
 
};

module.exports = DataCheck;
