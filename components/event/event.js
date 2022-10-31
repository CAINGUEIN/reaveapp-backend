
const EventModel = require("../../models/event");

const EventControllers = {
  async createEvent(req, res) {
    //creation des default data
    let createValues = req.body;
    createValues["owner"] = req.decodedToken._id
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
};

module.exports = EventControllers;
