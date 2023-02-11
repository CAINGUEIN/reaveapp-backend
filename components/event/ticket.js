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
      .populate("owner_id")
      .exec((err, ticket) => {
        if (err)
          return res.status(400).send({
            success: false,
            message: "Erreur data user",
          });
        if (ticket === null) {
          return res.status(400).send({
            success: false,
            message: "Erreur user delete",
          });
        }
        EventModel.findOne({ "tickets.ticket_id": ticket.event_id })
          .populate("owner.user_id")
          .exec((err, event) => {
            if (err)
              return res.status(400).send({
                success: false,
                message: "Erreur data user",
              });
            if (event === null) {
              return res.status(400).send({
                success: false,
                message: "Erreur user delete",
              });
            } else {
              return res.status(200).send({
                success: true,
                message: "Ok data user",
                data: { ticket, event },
              });
            }
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

  async checkTicket(req, res, next) {
    let checkTickets = [];
    // faire une boucle avec le array de ticket
    // voir si des ticket hexiste deja pour les place acheté
    // si rien passer au suivant si non retournée le tableau des tickets indispo
    const promises = req.body.arrayTickets.map(async (dataTicket) => {
      const query = {
        event_id: dataTicket.ticket._id,
        row: dataTicket.row,
        column: dataTicket.column,
      };
      const event = await TicketModel.findOne(query);
      if (event !== null) {
        checkTickets.push(event);
      }
    });

    await Promise.all(promises);

    if (checkTickets.length !== 0) {
      return res.status(400).send({
        success: false,
        message: "Erreur add ticket",
        errors: checkTickets,
      });
    } else {
      next();
    }
  },

  async createTicket(req, res, next) {
    let checkCreateTickets = [];
    let erreurCreateTickets = [];

    // Create an array of promises
    const promises = req.body.arrayTickets.map(async (dataTicket) => {
      let create = "";
      if (dataTicket.owner_id) {
        create = {
          owner_id: dataTicket.owner_id,
          event_id: dataTicket.ticket._id,
          row: dataTicket.row,
          column: dataTicket.column,
        };
      } else {
        create = {
          owner_id: req.decodedToken._id,
          event_id: dataTicket.ticket._id,
          row: dataTicket.row,
          column: dataTicket.column,
        };
      }

      const event = await TicketModel.create(create);

      if (event === null) {
        erreurCreateTickets.push(create);
      } else {
        checkCreateTickets.push(event);
      }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    if (checkCreateTickets.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Erreur add ticket",
        errors: erreurCreateTickets,
      });
    } else {
      req.erreurCreateTickets = erreurCreateTickets;
      req.checkCreateTickets = checkCreateTickets;
      next();
    }
  },
};

module.exports = TicketControllers;
