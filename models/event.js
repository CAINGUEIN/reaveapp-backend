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
      ref: "user",
    },
    status: {
      type: String,
      require: true,
    },
    orga: {
      //par la suite une ID d'orga
      type: String,
      minLength: 3,
      maxLength: 38,
    },
    date: { type: Date },
    game: {
      //par la suite une ID de game
      type: String,
      minLength: 3,
      maxLength: 38,
    },
    ticket: {
      type: Number,
      min: [0, 'cannot be negative']
    },
    soldTicket: [
      {
        type: mongoose.ObjectId,
        ref: "ticket",
      },
    ],
    price: {
      type: Number,
    },
    //quand la salle sera choissisable remplissage auto
    adress: {
      type: String,
      minLength: 3,
      maxLength: 72,
    },
    cp: {
      type: Number,
    },
    country: {
      type: String,
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
