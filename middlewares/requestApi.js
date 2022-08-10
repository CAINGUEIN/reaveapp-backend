const DataFormateHelper = require("../functionHelper/dataFormate");
const GameLolModel = require("../models/game");
const ServicesApiLol = require("../plugin/axios/servicesApiLol");
const dayjs = require("dayjs");

//TODO: voir a faire un system pour evité de requete trop l'api

const RequestApiLol = {
  /**
   * @info recup les 20 dernier match du User chez riot
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @need req.body.lolPuuid
   * @returns {Array} list of 20 matchs in req.resultListMatchsApiLol
   */
  async requestMatchsListWithBody(req, res, next) {
    let result = await ServicesApiLol.matchsList(req.body.lolPuuid);
    if (result.status === 200) {
      req.resultListMatchsApiLol = result.data;
      next();
    } else {
      return res.status(400).send({
        success: false,
        message: "Erreur call Api List Lol",
        data: result.data,
      });
    }
  },

  /**
   * @info recup les 20 dernier match du User chez riot
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @need req.dataUser
   * @returns {Array} list of 20 matchs in req.resultListMatchsApiLol
   */
  async requestMatchsListWithDataUser(req, res, next) {
    let result = await ServicesApiLol.matchsList(req.dataUser.lolData.lolPuuid);
    if (result.status === 200) {
      req.resultListMatchsApiLol = result.data;
      next();
    } else {
      return res.status(400).send({
        success: false,
        message: "Erreur call Api List Lol",
        data: result.data,
      });
    }
  },

  /**
   *
   */
  async requestAllMatchFor3MounthsWithDataUser(req, res, next) {
    //pour les 3 mois
    let timestamp = Date.now();
    let timeSubtract3Mounth = dayjs(timestamp).subtract(1, "month").unix();
    //pour la boucle en cas de plus de 100 match sur 3 mois
    let shouldContinue = true;
    let start = 0;
    //array des match sur 3 mois
    let all3MonthMatch = [];
    //data request
    let puuid = req.dataUser.lolData.lolPuuid;
    do {
      let result = await ServicesApiLol.matchsListWithQuery(
        puuid,
        timeSubtract3Mounth,
        start
      );
      if (result.status === 200) {
        all3MonthMatch.push(result.data);
        shouldContinue = result.data.length === 100;
        start = start + 100;
      } else {
        return res.status(400).send({
          success: false,
          message: "Erreur call Api List Lol",
          data: result.data,
        });
      }
    } while (shouldContinue === true);
    req.resultListMatchsApiLol = all3MonthMatch.flat();
    next();
  },

  async dataMatchInfo(req, res, next) {
    let result = await ServicesApiLol.dataMatchInfo(req.lastMatch);
    if (result.status === 200) {
      req.resultLastMatchInfoApiLol = result.data;
      next();
    } else {
      return res.status(400).send({
        success: false,
        message: "Erreur call Api Info Lol",
        data: result.data,
      });
    }
  },

  async dataMatchTimeline(req, res, next) {
    let result = await ServicesApiLol.dataMatchTimeline(req.lastMatch);
    if (result.status === 200) {
      req.resultLastMatchTimelineApiLol = result.data;
      next();
    } else {
      return res.status(400).send({
        success: false,
        message: "Erreur call Api Timeline Lol",
        data: result.data,
      });
    }
  },

  async requestManyMatchsInfo(req, res, next) {
    let ListMatchsForRequest = "";
    if (req.listMatchNoExist) {
      ListMatchsForRequest = req.listMatchNoExist;
    } else {
      ListMatchsForRequest = DataFormateHelper.listMatchForRequest(
        req.resultListMatchsApiLol,
        req.dataUser.lolData.lolMatchs
      );
    }
    //fonction de tri des matchlist

    //fonction de request des matchs
    let dataInsert = [];
    for (let index = 0; index < ListMatchsForRequest.length; index++) {
      let result = await ServicesApiLol.dataMatchInfo(
        ListMatchsForRequest[index]
      );
      if (result.status === 200) {
        // création du array pour le push dans la DB
        let data = DataFormateHelper.infoLolMatch(
          req.decodedToken._id,
          result.data,
          req.dataUser.lolData.lolPuuid
        );
        dataInsert.push(data);
      } else if (result.status === 429) {
        console.log('Dans la 429');
        let data = DataFormateHelper.infoLolMatch(
          req.decodedToken._id,
          result.data,
          req.dataUser.lolData.lolPuuid
        );
        dataInsert.push(data);
        break;
      } else {
        return res.status(400).send({
          success: false,
          message: "Erreur call Api Info Lol",
          data: result.data,
        });
      }
    }
    //save dans la DB game
    GameLolModel.insertMany(dataInsert)
      .then((games) => {
        //puis ajoue de la modif dans le userlolmatchs
        games.map((game) => {
          let data = {
            _id_riot: game._id_match,
            _id_lolMatch: game._id,
            gameStartTimestamp: game.info.gameStartTimestamp,
          };
          req.dataUser.lolData.lolMatchs.push(data);
        });
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
};

module.exports = RequestApiLol;
