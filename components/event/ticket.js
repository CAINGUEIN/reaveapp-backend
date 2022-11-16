const TicketModel = require("../../models/ticket");

const TicketControllers = {
  createTicket(req, res, next) {
    let data = { owner: req.decodedToken._id, event: req.dataEvent._id };
    TicketModel.create(data)
      .then((result) => {
        req.ticket = result
        next()
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
};

module.exports = TicketControllers;
