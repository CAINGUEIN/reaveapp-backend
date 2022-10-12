const GameLolModel = require("../../models/game");

const DataReturnLol = {
  oneMatch(req, res, next) {
    //in req.body === mongo_id
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
  async multiMatch(req, res, next) {
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
      .sort({ "info.gameStartTimestamp": -1 })
      .limit(perpage)
      .skip(page * perpage)
      .then((result) => {
        return res.status(200).send({
          success: true,
          message: "Ok twenty match lol",
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
  async multiFilteredMatch(req, res, next) {
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
      .sort({ "info.gameStartTimestamp": -1 })
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
  async forDashboard(req, res, next) {
    GameLolModel.find(req.optionQuery)
      .sort({ "info.gameStartTimestamp": -1 })
      .then((result) => {
        req.dataForReturn = result;
        next();
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur data dashboard",
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
module.exports = DataReturnLol;
