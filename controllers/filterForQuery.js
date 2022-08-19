const dayjs = require("dayjs");

const FilterForQuery = {
  optionForLolHistory(req, res, next) {
    let option = {
      players: {
        $elemMatch: { _id_user: req.decodedToken._id },
      },
    };
    if (req.body.win !== undefined) {
      option.players.$elemMatch["statTotal.win"] = req.body.win;
    }
    if (req.body.championName !== undefined) {
      option.players.$elemMatch["statTotal.championName"] =
        req.body.championName;
    }
    if (req.body.lane !== undefined) {
      option.players.$elemMatch["statTotal.lane"] = req.body.lane;
    }
    if (req.body.mapId !== undefined) {
      option["info.mapId"] = req.body.mapId;
    }
    if (req.body.item !== undefined) {
      let item = parseInt(req.body.item);
      option.players.$elemMatch["$or"] = [
        { "statTotal.item0": item },
        { "statTotal.item1": item },
        { "statTotal.item2": item },
        { "statTotal.item3": item },
        { "statTotal.item4": item },
        { "statTotal.item5": item },
        { "statTotal.item6": item },
      ];
    }
    if (req.body.summonerName !== undefined) {
      option["players.statTotal.summonerName"] = req.body.summonerName;
    }
    req.optionQuery = option;
    next();
  },

  optionForLolDashboard(req, res, next) {
    //pour les x mois
    let timestamp = Date.now();
    let timeSubtract30days = dayjs(timestamp).subtract(30, "day").unix();
    let timeForOption = parseFloat(timeSubtract30days + "000") 
    let option = {
      players: {
        $elemMatch: { _id_user: req.decodedToken._id },
      },
      "info.gameStartTimestamp": { $gt: timeForOption },
    };
    req.optionQuery = option;
    console.log(option);
    next();
  },
};

module.exports = FilterForQuery;
