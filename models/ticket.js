const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema(
  {
    owner_id: {
      type: mongoose.ObjectId,
      ref: "user",
    },
    event_id: {
      type: mongoose.ObjectId,
      ref: "event",
    },
    row: {
      type: Number,
    },
    column: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const TicketModel = mongoose.model("ticket", ticketSchema);

module.exports = TicketModel;
