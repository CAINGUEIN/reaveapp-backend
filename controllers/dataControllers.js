const GameLolModel = require("../models/game");

const DataControllers = {
  lolMatchSummary(req, res, next) {
    GameLolModel.find(req.body)
      .then((result) => {
        res.status(200).send({
          success: true,
          message: "Ok find match",
          data: result,
        });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur find match",
          data: err,
        });
      });
  },
};
module.exports = DataControllers;
