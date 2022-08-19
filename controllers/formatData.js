const FormatData = {
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
          dataPush["KDA"] =
            Math.round(player.statTotal.challenges.kda * 100) / 100;
        }
      }
      dataFormated.push(dataPush)
    }
    console.log(dataFormated);
    return res.status(200).send({
      success: true,
      message: "Ok twenty filtered match lol",
      data: dataFormated,
    });
  },
};
module.exports = FormatData;
