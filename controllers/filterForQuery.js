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
      option.players.$elemMatch["statTotal.championName"] = {
        $in: req.body.championName,
      };
    }
    if (req.body.lane !== undefined) {
      option.players.$elemMatch["statTotal.lane"] = req.body.lane;
    }
    if (req.body.mapId !== undefined) {
      option["info.mapId"] = req.body.mapId;
    }
    if (req.body.item !== undefined) {
      let item = []
      for (let index = 0; index < req.body.item.length; index++) {
        item.push(parseInt(req.body.item[index].key)) ;
      }
      option.players.$elemMatch["$or"] = [
        { "statTotal.item0": { $in: item } },
        { "statTotal.item1": { $in: item } },
        { "statTotal.item2": { $in: item } },
        { "statTotal.item3": { $in: item } },
        { "statTotal.item4": { $in: item } },
        { "statTotal.item5": { $in: item } },
        { "statTotal.item6": { $in: item } },
      ];
    }
    if (req.body.summonerName !== undefined) {
      option["players.statTotal.summonerName"] = { $in: req.body.summonerName};
    }
    req.optionQuery = option;
    next();
  },

  optionForLolDashboard(req, res, next) {
    //pour les x mois
    let timestamp = Date.now();
    let timeSubtract30days = dayjs(timestamp).subtract(30, "day").unix();
    let timeForOption = parseFloat(timeSubtract30days + "000");
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
