const EventModel = require("../../models/event");
const fetch = require('node-fetch');

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
    req.optionQuery = {
      isPublished: true,
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
      .sort({
        date: 1
      })
      .limit(perpage)
      .skip(page * perpage)
      .populate("owner.user_id staff.staff_id", "userTag profileName owner")
      .exec((err, result) => {
        if (err) {
          return res.status(400).send({
            success: false,
            message: "Erreur data event",
            errors: err,
          });
        }
        console.log("RESULTAT: "+result)
        return res.status(200).send({
          success: true,
          message: "Ok twenty event",
          data: result,
        });
      })
  },

  async listCurrentEvent(req, res) {
    let timestamp = Date.now();
    req.optionQuery = {
      date: {
        $gt: timestamp
      },
      ticket: {
        $gt: 0
      },
      isPublished: true,
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
      .sort({
        date: 1
      })
      .limit(perpage)
      .skip(page * perpage)
      .populate("owner.user_id staff.staff_id", "userTag profileName owner")
      .exec((err, result) => {
        if (err) {
          return res.status(400).send({
            success: false,
            message: "Erreur data event",
            errors: err,
          });
        }
        console.log("RESULTAT: "+result)
        return res.status(200).send({
          success: true,
          message: "Ok twenty event",
          data: result,
        });
      })
  },

  async dataEvent(req, res) {
    EventModel.findById(req.body._id)
      // ici c'est les key a populate avec les nested specifique
      .populate("owner.user_id staff.staff_id", "userTag profileName owner")
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

  async addPosterPicEvent(imageName, routeId, res) {
    EventModel.findOneAndUpdate({
      _id: routeId
    }, {
      $set: {
        posterPic: imageName
      },
    }, {
      new: true,
      runValidators: true
    }).then((updatedVenue) => {
      if (updatedVenue) {
        res.status(200).send({
          success: true,
          message: "Success | Image added to poster pic",
          data: updatedVenue
        });
      } else {
        res.status(404).send({
          success: false,
          message: "Error | Event not found"
        });
      }
    })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: "Error | Adding image to poster pic",
          error: err
        });
      });
  },



  async recupTicket(req, res, next) {
    EventModel.findByIdAndUpdate(
      req.body.event_id, {
      $inc:
      //list des chose a changer pour cette route
      {
        ticket: -1
      },
    }, {
      new: true,
      runValidators: true
    }
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
      $or: [{
        $and: [
          {
            "owner.user_id": req.decodedToken._id
          },
          {

            "spaceAssociated": req.body.sendSpaceAssociated

          },
        ]
      },
      {
        staff: {
          $elemMatch: {
            staff_id: req.decodedToken._id
          }
        }
      },
      ],
    })
      .populate("owner.user_id staff.staff_id", "userTag profileName owner")
      .exec((err, result) => {
        if (err)
          return res.status(400).send({
            success: false,
            message: "Erreur personalOperator",
          });
        return res.status(200).send({
          success: true,
          message: "Ok personalOperator",
          data: result,
        });
      });
  },


  update(req, res) {
    let update = req.body;
    EventModel.findByIdAndUpdate(
      update.event_id, {
      //list des chose a changer pour cette route
      name: update.name,
      orga: update.orga,
      venueName: update.venueName,
      adress: update.adress,  
      city: update.city,
      cp: update.cp,
      country: update.country,
      game: update.game,
      platform: update.platform,
      price: update.price,
      type: update.type,
      openDate: update.openDate,
      date: update.date,
      description: update.description,
      isPublished: update.isPublished,
    }, {
      new: true,
      runValidators: true
    }
    )
      .then((event) => {
        res
          .status(200)
          .send({
            success: true,
            message: "Ok update event",
            data: event
          });
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
      req.body.project_id, {
      $addToSet: {
        staff: {
          staff_id: req.body.staff_id,
          role: req.body.role,
          permission: req.body.permission,
          team: req.body.team,
        },
      },
    }, {
      new: true,
      runValidators: true
    }
    )
      .then((event) => {
        res
          .status(200)
          .send({
            success: true,
            message: "Ok add staff event",
            data: event
          });
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
      req.body.project_id, {
      $addToSet: {
        staff: {
          staff_id: req.decodedToken._id,
          permission: "Admin",
        },
      },
      "owner.user_id": req.body.staff_id,
    }, {
      new: true,
      runValidators: true
    }
    )
      .then((event) => {
        res
          .status(200)
          .send({
            success: true,
            message: "Ok add staff event",
            data: event
          });
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
    EventModel.findOneAndUpdate({
      "staff._id": req.body._id
    }, {
      $set: {
        "staff.$": {
          staff_id: req.body.staff_id,
          role: req.body.role,
          permission: req.body.permission,
          team: req.body.team,
        },
      },
    }, {
      new: true,
      runValidators: true
    })
      .then((event) => {
        res
          .status(200)
          .send({
            success: true,
            message: "Ok add staff event",
            data: event
          });
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
      req.body.project_id, {
      "owner.role": req.body.role,
      "owner.team": req.body.team,
    }, {
      new: true,
      runValidators: true
    }
    )
      .then((event) => {
        res
          .status(200)
          .send({
            success: true,
            message: "Ok add staff event",
            data: event
          });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur add Staff",
          errors: err,
        });
      });
  },

  removeStaff(req, res) {
    EventModel.findByIdAndUpdate(
      req.body.project_id, {
      $pull: {
        staff: {
          _id: req.body.staff_id
        }
      }
    }, {
      new: true,
      runValidators: true
    }
    )
      .then((event) => {
        res.status(200).send({
          success: true,
          message: "Ok remove staff event",
          data: event,
        });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur remove Staff",
          errors: err,
        });
      });
  },

  async addSoldeTickets(req, res, next) {
    let soldTicket = [];
    const promises = req.checkCreateTickets.map(async (ticket) => {
      const query = {
        "tickets._id": ticket.event_id,
      };
      const data = {
        ticket_id: ticket._id,
        row: ticket.row,
        column: ticket.column,
      };
      const update = {
        $addToSet: {
          "tickets.$.soldTickets": [data],
        },
      };
      const options = {
        new: true,
      };
      const event = await EventModel.findOneAndUpdate(query, update, options);
      soldTicket.push(event);
    });

    await Promise.all(promises);
    console.log(soldTicket);
    if (soldTicket === null) {
      //ne peas oublier que pour le moment j'anule pas l'etape d'avant et donc les ticket sont deja crée il faudrait le delete mais pour la version demo pas besoin
      return res.status(400).send({
        success: false,
        message: "Erreur add ticket in event",
      });
    } else {
      req.updateEvent = soldTicket;
      next();
    }
  },
  addItem(req, res) {
    EventModel.findByIdAndUpdate(
      req.body.project_id, {
      $addToSet: {
        equipements: {
          name: req.body.name,
          quantity: req.body.quantity,
          bundle: req.body.bundle,
          kit: req.body.kit,
          tags: req.body.tags,
        },
      },
    }, {
      new: true,
      runValidators: true
    }
    )
      .then((event) => {
        res
          .status(200)
          .send({
            success: true,
            message: "Ok add item event",
            data: event
          });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur add item",
          errors: err,
        });
      });
  },

  modifyItem(req, res) {
    console.log(req.body);
    EventModel.findOneAndUpdate({
      "equipements._id": req.body._id
    }, {
      $set: {
        "equipements.$": {
          name: req.body.name,
          quantity: req.body.quantity,
          bundle: req.body.bundle,
          kit: req.body.kit,
          tags: req.body.tags,
        },
      },
    }, {
      new: true,
      runValidators: true
    })
      .then((event) => {
        res
          .status(200)
          .send({
            success: true,
            message: "Ok add item event",
            data: event
          });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur add item",
          errors: err,
        });
      });
  },

  removeItem(req, res) {
    EventModel.findByIdAndUpdate(
      req.body.project_id, {
      $pull: {
        equipements: {
          _id: req.body.equipements_id
        }
      }
    }, {
      new: true,
      runValidators: true
    }
    )
      .then((event) => {
        res.status(200).send({
          success: true,
          message: "Ok remove item event",
          data: event,
        });
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur remove item",
          errors: err,
        });
      });
  },
};

module.exports = EventControllers;