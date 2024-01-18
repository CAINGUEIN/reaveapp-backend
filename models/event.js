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
    posterPic : {
      type: String,
      default : "",
    },
    descriptionPic : {
      type: String,
      default : "",
    },
    secondaryPics : [
      { type: String }
    ],
    spaceAssociated : {
      type: mongoose.ObjectId,
      ref:"space"
    },
    owner: {
      user_id: {
        type: mongoose.ObjectId,
        ref: "user",
      },
      role: {
        type: String,
        minLength: 2,
        maxLength: 38,
      },
      team: {
        type: String,
        minLength: 2,
        maxLength: 38,
      },
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
    openDate: { type: Date },
    platform: {
      //par la suite une ID de game
      type: String,
      minLength: 2,
      maxLength: 38,
    },
    equipements: [
      {
        name: { type: String },
        quantity: { type: Number },
        bundle: { type: String },
        kit: { type: String },
        tags: { type: String },
      },
    ],
    game: {
      //par la suite une ID de game
      type: String,
      minLength: 3,
      maxLength: 38,
    },
    description: {
      type: String,
      default: "",

      minLength: 0,
      maxLength: 1500,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    tickets: [
      {
        quantities: {
          type: Number,
          min: [0, "cannot be negative"],
        },
        cathegory: {
          type: String,
          minLength: 3,
          maxLength: 38,
        },
        price: { type: Number },
        color: { type: String },
        type: { type: String },
        column: { type: Number },
        row: { type: Number },
        soldTickets: [
          {
            ticket_id: {
              type: mongoose.ObjectId,
              ref: "ticket",
            },
            row: {
              type: Number,
            },
            column: {
              type: Number,
            },
          },
        ],
      },
    ],
    staff: [
      {
        staff_id: {
          type: mongoose.ObjectId,
          ref: "user",
        },
        role: {
          type: String,
          minLength: 2,
          maxLength: 38,
        },
        team: {
          type: String,
          minLength: 2,
          maxLength: 38,
        },
        permission: {
          type: String,
          minLength: 2,
          maxLength: 38,
        },
      },
    ],
    price: {
      type: Number,
    },
    //quand la salle sera choissisable remplissage auto
    venueName: {
      type: String,
      minLength: 3,
      maxLength: 72,
    },
    adress: {
      type: String,
      minLength: 3,
      maxLength: 72,
    },
    city: {
      type: String,
      minLength: 3,
      maxLength: 72,
    },
    cp: {
      type: String,
      minLength: 4,
      maxLength: 6,
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
