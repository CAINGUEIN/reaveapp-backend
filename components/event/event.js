const EventModel = require("../../models/event");

const EventControllers = {
  async createEvent(req, res) {
    //creation des default data
    let createValues = req.body;
    createValues["owner.user_id"] = req.decodedToken._id;
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

  async dataEvent(req, res) {
    EventModel.findById(req.body._id)
      // ici c'est les key a populate avec les nested specifique
      .populate(
        "soldTicket owner.user_id staff.staff_id",
        "userTag profileName owner"
      )
      .exec((err, user) => {
        if (err)
          return res.status(400).send({
            success: false,
            message: "Erreur data event",
          });
        if (user === null) {
          return res.status(400).send({
            success: false,
            message: "Erreur event delete",
          });
        }
        return res.status(200).send({
          success: true,
          message: "Ok data event",
          data: user,
        });
      });
  },

  async recupTicket(req, res, next) {
    EventModel.findByIdAndUpdate(
      req.body.event_id,
      {
        $inc:
          //list des chose a changer pour cette route
          { ticket: -1 },
      },
      { new: true, runValidators: true }
    )
      .then((dataEvent) => {
        req.dataEvent = dataEvent;
        next();
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur ticket event",
          errors: err,
        });
      });
  },
  soldTicket(req, res, next) {
    EventModel.findByIdAndUpdate(req.body.event_id, {
      $addToSet: {
        soldTicket: req.ticket._id,
      },
    })
      .then(next())
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur ticket sold",
          errors: err,
        });
      });
  },

  personalOperator(req, res, next) {
    EventModel.find({
      $or: [
        { "owner.user_id": req.decodedToken._id },
        { staff: { $elemMatch: { staff_id: req.decodedToken._id } } },
      ],
    })
      .then((result) => {
        return res.status(200).send({
          success: true,
          message: "Ok personalOperator",
          data: result,
        });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur personalOperator",
          errors: err,
        });
      });
  },

  update(req, res) {
    let update = req.body;
    EventModel.findByIdAndUpdate(
      update.event_id,
      {
        //list des chose a changer pour cette route
        name: update.name,
        orga: update.orga,
        venueName: update.venueName,
        adress: update.adress,
        city: update.city,
        cp: update.cp,
        country: update.country,
        game: update.game,
        price: update.price,
        type: update.type,
        openDate: update.openDate,
      },
      { new: true, runValidators: true }
    )
      .then((event) => {
        res
          .status(200)
          .send({ success: true, message: "Ok update event", data: event });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: "Erreur update event",
          errors: err,
        });
      });
  },

  addStaff(req, res) {
    EventModel.findByIdAndUpdate(
      req.body.project_id,
      {
        $addToSet: {
          staff: {
            staff_id: req.body.staff_id,
            role: req.body.role,
            permission: req.body.permission,
            team: req.body.team,
          },
        },
      },
      { new: true, runValidators: true }
    )
      .then((event) => {
        res
          .status(200)
          .send({ success: true, message: "Ok add staff event", data: event });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur add Staff",
          errors: err,
        });
      });
  },

  addStaffAndSwitchOwner(req, res) {
    EventModel.findByIdAndUpdate(
      req.body.project_id,
      {
        $addToSet: {
          staff: {
            staff_id: req.decodedToken._id,
            permission: "Admin",
          },
        },
        "owner.user_id": req.body.staff_id,
      },
      { new: true, runValidators: true }
    )
      .then((event) => {
        res
          .status(200)
          .send({ success: true, message: "Ok add staff event", data: event });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur add Staff",
          errors: err,
        });
      });
  },

  modifyStaff(req, res) {
    console.log(req.body);
    EventModel.findOneAndUpdate(
      { "staff._id": req.body._id },
      {
        $set: {
          "staff.$": {
            staff_id: req.body.staff_id,
            role: req.body.role,
            permission: req.body.permission,
            team: req.body.team,
          },
        },
      },
      { new: true, runValidators: true }
    )
      .then((event) => {
        res
          .status(200)
          .send({ success: true, message: "Ok add staff event", data: event });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur add Staff",
          errors: err,
        });
      });
  },

  modifyStaffAndSwitchOwner(req, res) {
    EventModel.findByIdAndUpdate(
      req.body.project_id,
      {
        "owner.role": req.body.role,
        "owner.team": req.body.team,
      },
      { new: true, runValidators: true }
    )
      .then((event) => {
        res
          .status(200)
          .send({ success: true, message: "Ok add staff event", data: event });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur add Staff",
          errors: err,
        });
      });
  },
};

module.exports = EventControllers;
