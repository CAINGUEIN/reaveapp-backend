const EventModel = require("../../models/event");
const TicketModel = require("../../models/ticket");

const TicketControllers = {
  generateTicket(req, res, next) {
    let data = { owner: req.decodedToken._id, event: req.dataEvent._id };
    TicketModel.create(data)
      .then((result) => {
        req.ticket = result;
        next();
      })
      .catch((err) => {
        //si non rien on sort
        return res.status(400).send({
          success: false,
          message: "Erreur create ticket",
          data: err,
        });
      });
  },

  async infoTicket(req, res) {
    TicketModel.findById({ _id: req.body._id })
      .populate("event")
      .exec((err, user) => {
        if (err)
          return res.status(400).send({
            success: false,
            message: "Erreur data user",
          });
        if (user === null) {
          return res.status(400).send({
            success: false,
            message: "Erreur user delete",
          });
        }
        return res.status(200).send({
          success: true,
          message: "Ok data user",
          data: user,
        });
      });
  },

  createTicketForEvent(req, res) {

    EventModel.findByIdAndUpdate(
      req.body.project_id,
      {
        $addToSet: {
          tickets: {
            quantities: req.body.quantities,
            cathegory: req.body.cathegory,
            price: req.body.price,
            color: req.body.color,
            type: req.body.type,
            column: req.body.column,
            row: req.body.row,
          },
        },
      },
      { new: true, runValidators: true }
    )
      .then((event) => {
        res
          .status(200)
          .send({ success: true, message: "Ok add new ticket", data: event });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur add ticket",
          errors: err,
        });
      });
  },
};

module.exports = TicketControllers;
