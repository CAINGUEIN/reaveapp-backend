const mongoose = require("mongoose");

const spaceSchema = mongoose.Schema(
  {
    typeOfSpace: {
      type: String,
      require: true,
    },
    dataOfSpace: {
      users: [
        {
          _id_user: { type: mongoose.ObjectId, ref: "user" },
          pseudo: String,
          _id_roles: [String /* { type: mongoose.ObjectId, ref: "role" } */],
          _id_permissions: [
            String /* { type: mongoose.ObjectId, ref: "permission" } */,
          ],
        },
      ],
      categories: [
        {
          name: { require: true, type: String },
          rooms: [
            {
              name: { require: true, type: String },
              messages: [
                {
                  _id_sender: {
                    type: mongoose.ObjectId,
                    ref: "user",
                  },
                  _id_receiver: { type: mongoose.ObjectId, ref: "user" },
                  message: { require: true, type: String },
                },
              ],
              _id_writes: [{ type: mongoose.ObjectId, ref: "permission" }],
              _id_reads: [{ type: mongoose.ObjectId, ref: "permission" }],
              _id_updates: [{ type: mongoose.ObjectId, ref: "permission" }],
              _id_deletes: [{ type: mongoose.ObjectId, ref: "permission" }],
            },
          ],
          _id_writes: [{ type: mongoose.ObjectId, ref: "permission" }],
          _id_reads: [{ type: mongoose.ObjectId, ref: "permission" }],
          _id_updates: [{ type: mongoose.ObjectId, ref: "permission" }],
          _id_deletes: [{ type: mongoose.ObjectId, ref: "permission" }],
        },
      ],
    },
    nameSpace: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 38,
      unique: true,
    },
    birthDay: {
      type: String,
    },
    picture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxLength: 158,
    },
    calendar: [
      {
        name: { require: true, type: String },
        bio: { type: String },
        color: { require: true, type: String },
        start: { require: true, type: Date },
        end: { require: true, type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SpaceModel = mongoose.model("space", spaceSchema);

module.exports = SpaceModel;
