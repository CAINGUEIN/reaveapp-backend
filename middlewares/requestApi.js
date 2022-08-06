const DataFormateHelper = require("../functionHelper/dataFormate");
const GameLolModel = require("../models/game");
const ServicesApiLol = require("../plugin/axios/servicesApiLol");

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
      console.log(result.data);
      if (result.status === 200) {
        // création du array pour le push dans la DB
        let data = DataFormateHelper.infoLolMatch(
          req.decodedToken._id,
          result.data,
          req.dataUser.lolData.lolPuuid
        );
        dataInsert.push(data);
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
