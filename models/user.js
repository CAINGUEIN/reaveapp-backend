const { isEmail } = require("validator");

const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 38,
      unique: true,
    },
    profileTag: {
      type: String,
      minLength: 3,
      maxLength: 38,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      select: false,
    }, //String Hasher
    birthDay: {
      type: String,
    },
    newsLetter: {
      type: Boolean,
    },
    ecoRole: [
      {
        type: mongoose.ObjectId,
        ref: "ecoRole",
      },
    ],
    gameRole: [
      {
        type: mongoose.ObjectId,
        ref: "gameRole",
      },
    ],
    friends: [
      {
        type: mongoose.ObjectId,
        ref: "user",
      },
    ],
    invitationSended: [
      {
        type: { type: String },
        _targetUser_id: { type: mongoose.ObjectId, ref: "user" },
        _targetSpace_id: {
          type: mongoose.ObjectId,
          ref: "space",
        },
      },
    ],
    ban: [
      {
        type: mongoose.ObjectId,
        ref: "user",
      },
    ],
    spaces: [
      {
        type: mongoose.ObjectId,
        ref: "space",
      },
    ],
    picture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxLength: 158,
    },
    followers: [
      {
        type: mongoose.ObjectId,
        ref: "user",
      },
    ],
    following: [
      {
        type: mongoose.ObjectId,
        ref: "user",
      },
    ],
    dm: [
      {
        _id_users: [{ type: mongoose.ObjectId, ref: "user" }],
        show: { type: Boolean },
        messages: [
          {
            _id_Sended: { type: mongoose.ObjectId, ref: "user" },
            message: { type: String },
            date: { type: Date },
            options: { type: Object }, // tout les param specifique
          },
        ],
      },
    ],
    calendarSpacesShow: [
      {
        type: mongoose.ObjectId,
        ref: "space",
      },
    ],
    calendar: [
      {
        name: { type: String },
        bio: { type: String },
        color: { type: String },
        start: { type: Date },
        end: { type: Date },
      },
    ],
    notifications: [
      {
        type: { type: String },
        content: { type: String },
        url: { type: String },
        data: { type: Object },
      },
    ],
    lolData: {
      lolPuuid: { type: String },
      lolMatchs: [
        //peut etre ici recup les idriot des matchs
        //puis si on a recup les matchs mettre l'id mongoo
        //et peut etre meme mettre la date pour pourvoir faire un ordre croissant
        {
          _id_riot: { type: String },
          _id_lolMatch: {
            type: mongoose.ObjectId,
            ref: "lolMatch",
          },
          gameStartTimestamp: { type: Number },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
