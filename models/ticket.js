const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.ObjectId,
      ref: "user",
    },
    event: {
      type: mongoose.ObjectId,
      ref: "event",
    }
  },
  {
    timestamps: true,
  }
);

const TicketModel = mongoose.model("ticket", ticketSchema);

module.exports = TicketModel;
