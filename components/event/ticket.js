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
};

module.exports = TicketControllers;
