const dataFormat = {
  dashboard(req, res, next) {
    let data = req.dataForReturn;
    let dataFormated = [];
    for (let index = 0; index < data.length; index++) {
      let dataPush = {};
      const match = data[index];
      dataPush["start"] = match.info.gameStartTimestamp;
      for (let index = 0; index < match.players.length; index++) {
        const player = match.players[index];
        if (player.puuid === req.dataUser.lolData.lolPuuid) {
          dataPush["champion"] = player.statTotal.championName;
          dataPush["goldEarned"] = player.statTotal.goldEarned;
          if (player.statTotal.challenges) {
            dataPush["KDA"] =
              Math.round(player.statTotal.challenges.kda * 100) / 100;
            dataPush["visionScorePerMinute"] =
              Math.round(
                player.statTotal.challenges.visionScorePerMinute * 100
              ) / 100;
            dataPush["visionScoreAdvantageLaneOpponent"] =
              Math.round(
                player.statTotal.challenges.visionScoreAdvantageLaneOpponent *
                  100
              ) / 100;
          }
        }
      }
      dataFormated.push(dataPush);
    }
    console.log(dataFormated);
    return res.status(200).send({
      success: true,
      message: "Ok twenty filtered match lol",
      data: dataFormated,
    });
  },
  infoLolMatch(_id, infoLolMatch, puuid) {
    //ici va faloire créer 10 data une par key
    let players = [];
    let participants = infoLolMatch.metadata.participants;
    for (let index = 0; index < participants.length; index++) {
      let dataPush = {};
      if (puuid === participants[index]) {
        dataPush = {
          _id_user: _id,
          puuid: participants[index],
          statTotal: infoLolMatch.info.participants[index],
        };
      } else {
        dataPush = {
          puuid: participants[index],
          statTotal: infoLolMatch.info.participants[index],
        };
      }
      players.push(dataPush);
    }
    //la data a push dans la bd
    return {
      players: players,
      _id_match: infoLolMatch.metadata.matchId,
      info: {
        gameCreation: infoLolMatch.info.gameCreation,
        gameDuration: infoLolMatch.info.gameDuration,
        gameEndTimestamp: infoLolMatch.info.gameEndTimestamp,
        gameId: infoLolMatch.info.gameId,
        gameMode: infoLolMatch.info.gameMode,
        gameName: infoLolMatch.info.gameName,
        gameStartTimestamp: infoLolMatch.info.gameStartTimestamp,
        gameType: infoLolMatch.info.gameType,
        gameVersion: infoLolMatch.info.gameVersion,
        mapId: infoLolMatch.info.mapId,
        platformId: infoLolMatch.info.platformId,
      },
    };
  },

  listMatchForRequest(listMatchs, matchsUser) {
    let ListMatchsForRequest = [];
    listMatchs.map((match) => {
      let found = matchsUser.find((matchUser) => {
        if (match === matchUser._id_riot) return true;
      });
      if (found) {
        console.log("match find");
      } else {
        //si pas de match alors push dans la ListMatchsForRequest
        ListMatchsForRequest.push(match);
      }
    });
    return ListMatchsForRequest;
  },
};
module.exports = dataFormat;
