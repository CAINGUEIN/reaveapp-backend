const DataFormateHelper = {
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
        console.log(matchUser, match);
        if (match === matchUser._id_riot) return true
      });
      if (found) {
        console.log("match find");
      } else {
        //si pas de match alors push dans la ListMatchsForRequest
        ListMatchsForRequest.push(match);
      }
    });
    return ListMatchsForRequest
  }
};

module.exports = DataFormateHelper;
