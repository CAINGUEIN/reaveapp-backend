const EventModel = require("../../models/event");
const UserModel = require("../../models/user");

const userControllers = {
  deleteUser(req, res) {
    UserModel.findByIdAndRemove(req.decodedToken._id)
      .then(() => {
        res.status(200).send({ success: true, message: "Suppression Ok" });
      })
      .catch(() => {
        res.status(400).send({ success: false, message: "Erreur suppression" });
      });
  },

  banUser(req, res) {
    //TODO: on devrais pouvoir ban a plusieur endroit donc peut etre passé par des middleware pour la condition d'arrivé au ban
    //exemple si c'est avec un invite passer par supprimé invitationSended et la notification en middleware
    //puis le controller qui place la personne en ban
    //TODO: faire un middleware qui regard si la personne a ban ou a etait ban tout depend la route
    //exemple le A a ban le B
    // A peut tout voir de B mais ne ressois rien
    // B peut tout voir de A si en publique mais aucune interaction abboutie mais sans message d'erreur
    //push dans le ban
  },

  async infoUser(req, res) {
    UserModel.findOne({ _id: req.decodedToken._id })
      .populate("friends", "userTag profileName")
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

  updateUser(req, res) {
    let update = req.body;
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        //list des chose a changer pour cette route
        profileName: update.profileName,
        email: update.email,
      },
      { new: true, runValidators: true }
    )
      .then((user) => {
        res
          .status(200)
          .send({ success: true, message: "Ok update user", data: user });
      })
      .catch((err) => {
        res.status(400).send({ success: false, message: "Erreur update user" });
      });
  },

  updateUserIdentity(req, res) {
    let update = req.body;
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        //list des chose a changer pour cette route
        userTag: update.userTag,
        profileName: update.profileName,
        firstName: update.firstName,
        lastName: update.lastName,
      },
      { new: true, runValidators: true }
    )
      .then((user) => {
        res
          .status(200)
          .send({ success: true, message: "Ok update user", data: user });
      })
      .catch((err) => {
        res.status(400).send({ success: false, message: "Erreur update user" });
      });
  },

  updateUserDescription(req, res) {
    let update = req.body;
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        //list des chose a changer pour cette route
        status: update.status,
        bio: update.bio,
        birthDate: update.birthDate,
        location: update.location,
        link: update.link,
      },
      { new: true, runValidators: true }
    )
      .then((user) => {
        res
          .status(200)
          .send({ success: true, message: "Ok update user", data: user });
      })
      .catch((err) => {
        res.status(400).send({ success: false, message: "Erreur update user" });
      });
  },

  updateUserCoinBalance(req, res) {
    let update = req.body;
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        $inc:
          //list des chose a changer pour cette route
          { coin: update.coin },
        $addToSet: { historiesCoin: { type: "coin", value: update.coin } },
      },
      { new: true, runValidators: true }
    )
      .then((user) => {
        res
          .status(200)
          .send({ success: true, message: "Ok update user", data: user });
      })
      .catch((err) => {
        res.status(400).send({ success: false, message: "Erreur update Coin" });
      });
  },

  updateUserSendCoin(req, res) {
    let update = req.body;
    console.log(update);
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        $inc:
          //list des chose a changer pour cette route
          { coin: -update.value },
        $addToSet: {
          historiesCoin: {
            type: "sendCoin",
            message: update.message,
            value: 0 - update.value,
          },
        },
      },
      { new: true, runValidators: true }
    )
      .then((user) => {
        console.log("ICI");
        UserModel.findByIdAndUpdate(
          update.target._id,
          {
            $inc:
              //list des chose a changer pour cette route
              { coin: update.value },
            $addToSet: {
              historiesCoin: {
                type: "sendCoin",
                message: update.message,
                value: update.value,
              },
            },
          },
          { new: true, runValidators: true }
        )
          .then(
            res
              .status(200)
              .send({ success: true, message: "Ok update user", data: user })
          )
          .catch((err) => {
            res
              .status(400)
              .send({ success: false, message: "Erreur receved Coin" });
          });
      })
      .catch((err) => {
        res
          .status(400)
          .send({ success: false, message: "Erreur send Coin", data: err });
      });
  },
  async debitCoinForNewTicket(req, res, next) {
    let totalPrice = 0;
    let historierPush = [];
    const promises = req.body.arrayTickets.map(async (dataTicket) => {
      totalPrice = totalPrice - dataTicket.ticket.price;
      let query = "";
      let owner = "";
      if (dataTicket.owner_id !== undefined) {
        owner = dataTicket.owner_id._id;
        query = {
          $addToSet: {
            historiesCoin: {
              type: "GiftTicket",
              value: 0,
              message:
                "ticket" +
                dataTicket.ticket.category +
                "pour " +
                req.body.eventName,
            },
          },
        };
        historierPush.push({
          type: "GiftedTicket",
          value: -dataTicket.ticket.price,
          message: "ticket offert pour " + req.body.eventName,
        });
      } else {
        owner = req.decodedToken._id;
        query = {
          $addToSet: {
            historiesCoin: {
              type: "BuyTicket",
              value: -dataTicket.ticket.price,
              message:
                "achat d'un ticket" +
                dataTicket.ticket.category +
                "pour " +
                req.body.eventName,
            },
          },
        };
      }

      const event = await UserModel.findByIdAndUpdate(owner, query);
    });
    await Promise.all(promises);

    const price = await UserModel.findByIdAndUpdate(req.decodedToken._id, {
      $inc:
        //list des chose a changer pour cette route
        { coin: totalPrice },
      $addToSet: {
        historiesCoin: historierPush,
      },
    });
    next();
  },
  debitCoin(req, res, next) {
    ticket = req.dataEvent;
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        $inc:
          //list des chose a changer pour cette route
          { coin: -ticket.price },
        $addToSet: {
          historiesCoin: {
            type: "BuyTicket",
            value: -ticket.price,
            message: "achat d'un ticket pour " + ticket.name,
          },
        },
      },
      { new: true, runValidators: true }
    )
      .then(next())
      .catch((err) => {
        res.status(400).send({ success: false, message: "Erreur update Coin" });
      });
  },

  addTicket(req, res, next) {
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        $addToSet: { ticket: req.ticket._id },
      },
      { new: true, runValidators: true }
    )
      .then((user) => {
        res
          .status(200)
          .send({ success: true, message: "Ok ticket add", data: user });
      })
      .catch((err) => {
        res.status(400).send({ success: false, message: "Erreur add ticket" });
      });
  },

  async addNewTicket(req, res, next) {
    let erreurTicketUser = [];
    let ticketUser = [];
    const promises = req.checkCreateTickets.map(async (ticket) => {
      const query = {
        _id: ticket.owner_id,
      };
      const options = {
        new: true,
      };
      const update = {
        $addToSet: {
          ticket: ticket._id,
        },
      };
      const event = await UserModel.findOneAndUpdate(query, update, options);
      if (event === null) {
        erreurTicketUser.push(event);
      } else {
        ticketUser.push(event);
      }
    });
    await Promise.all(promises);

    if (ticketUser.length === 0) {
      //ne peas oublier que pour le moment j'anule pas l'etape d'avant et donc les ticket sont deja crée il faudrait le delete mais pour la version demo pas besoin
      return res.status(400).send({
        success: false,
        message: "Erreur add ticket in user",
      });
    } else {
      UserModel.findById(req.decodedToken._id).populate("friends", "userTag profileName")
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
          message: "add ticket in user",
          data: user,
        });
      });
      
    }
  },

  updateUserTruePro(req, res) {
    let update = req.body;
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        pro: true,
      },
      { new: true, runValidators: true }
    )
      .then((user) => {
        res
          .status(200)
          .send({ success: true, message: "Ok update user", data: user });
      })
      .catch((err) => {
        res.status(400).send({ success: false, message: "Erreur update pro" });
      });
  },

  updateMatchUser(req, res) {
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      //target le bon _id_riot de la request
      {
        //list des chose a changer pour cette route
        _id_lolMatch: req.body.userName,
        dateStart: req.body.email,
      },
      { new: true, runValidators: true }
    )
      .then((user) => {
        res.status(200).send({
          success: true,
          message: "Ok update last match for user",
          data: user,
        });
      })
      .catch((err) => {
        res
          .status(400)
          .send({ success: false, message: "Erreur update last match" });
      });
  },
};

module.exports = userControllers;
