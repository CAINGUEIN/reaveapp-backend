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
      require: true,
    },
    newsLetter: {
      type: Boolean,
      require: true,
    },
    ecoRole: {
      type: [mongoose.ObjectId], ref: 'ecoRole'
    },
    gameRole: {
      type: [mongoose.ObjectId], ref: 'gameRole'
    },
    friends: {
      type: [mongoose.ObjectId], ref: 'user'
    },
    teams: {
      type: [mongoose.ObjectId], ref: 'team'
    },
    picture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxLength: 158,
    },
    followers: {
      type: [mongoose.ObjectId], ref: 'user'
    },
    following: {
      type: [mongoose.ObjectId], ref: 'user'
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
