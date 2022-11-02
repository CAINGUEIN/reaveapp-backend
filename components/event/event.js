const EventModel = require("../../models/event");

const EventControllers = {
  async createEvent(req, res) {
    //creation des default data
    let createValues = req.body;
    createValues["owner"] = req.decodedToken._id;
    // creation de l'event
    EventModel.create(createValues)
      .then((result) => {
        return res.status(200).send({
          success: true,
          message: "event data",
          data: result,
        });
      })
      .catch((err) => {
        //si non rien on sort
        return res.status(400).send({
          success: false,
          message: "Erreur data space",
          data: err,
        });
      });
  },

  async listEvent(req, res) {
    let timestamp = Date.now();
    req.optionQuery = {
      date: { $gt: timestamp },
      ticket: { $gt: 0 },
    };
    // recup des 20 prochain
    let perpage = "";
    let page = "";
    if (req.body.perpage === undefined) {
      perpage = 20;
    } else {
      perpage = req.body.perpage;
    }
    if (req.body.page === undefined) {
      page = 0;
    } else {
      page = req.body.page;
    }
    EventModel.find(req.optionQuery)
      .sort({ date: 1 })
      .limit(perpage)
      .skip(page * perpage)
      .then((result) => {
        return res.status(200).send({
          success: true,
          message: "Ok twenty event",
          data: result,
        });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur data event",
          errors: err,
        });
      });
  },
};

module.exports = EventControllers;
