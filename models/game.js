const mongoose = require("mongoose");

const gameLolSchema = mongoose.Schema(
  {
    //_id generé par mongoose
    players: [
      {
        _id_user: { type: mongoose.ObjectId, ref: "user" },
        puuid: String, //link du Puuid
        statTotal: Object, //link du Puuid
        participantId: Number,
        participantFrames: [
            {
                type: Object
            }
        ]
      },
    ],
    _id_match: String,
    info: {
      gameCreation: Number,
      gameDuration: Number,
      gameEndTimestamp: Number,
      gameId: Number,
      gameMode: String,
      gameName: String,
      gameStartTimestamp: Number,
      gameType: String,
      gameVersion: String,
      mapId: Number,
      platformId: String,
      queueId: Number,
      teams: [Object],
      tournamentCode: String,
    },
  },
  {
    timestamps: true,
  }
);

const GameLolModel = mongoose.model("lolMatch", gameLolSchema);

module.exports = GameLolModel;
