const mongoose = require("mongoose");

const teamSchema = mongoose.Schema(
  {
    teamName: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 38,
      unique: true,
    },
    birthDay: {
      type: String,
      require: true,
    },
    teams: [{ 
        user: {type: mongoose.ObjectId, ref: 'user'}, 
        role: { type: [mongoose.ObjectId], ref: 'role'},
        Permission: { type: [mongoose.ObjectId], ref: 'permission'},
    }],
    chat: [{
        message: {type: String},
        user: {type: mongoose.ObjectId, ref: 'user'},
        time: {type: Date, default: new Date}
    }],
    picture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxLength: 158,
    },
  },
  {
    timestamps: true,
  }
);

const TeamModel = mongoose.model("team", teamSchema);

module.exports = TeamModel;
