const mongoose = require("mongoose");

const gameSchema = mongoose.Schema(
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
      gameCreation: String,
      gameDuration: String,
      gameEndTimestamp: String,
      gameId: String,
      gameMode: String,
      gameName: String,
      gameStartTimestamp: Number,
      gameType: String,
      gameVersion: Number,
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

const GameModel = mongoose.model("space", gameSchema);

module.exports = GameModel;
