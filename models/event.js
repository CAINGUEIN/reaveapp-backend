const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    name: {
      unique: true,
      type: String,
      require: true,
      minLength: 3,
      maxLength: 38,
    },
    owner: {
      type: mongoose.ObjectId,
      ref: "user",},
    orga: {
      //par la suite une ID d'orga
      type: String,
      require: true,
      minLength: 3,
      maxLength: 38,
    },
    date: { type: Date, require: true },
    game: {
      //par la suite une ID de game
      type: String,
      require: true,
      minLength: 3,
      maxLength: 38,
    },
    ticket: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    //quand la salle sera choissisable remplissage auto
    adress: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 72,
    },
    cp: {
      type: Number,
      require: true,
    },
    country: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 72,
    },
    type: {
      //par la suite une ID type
      type: String,
      require: true,
      minLength: 3,
      maxLength: 72,
    },
  },
  {
    timestamps: true,
  }
);

const EventModel = mongoose.model("event", eventSchema);

module.exports = EventModel;
