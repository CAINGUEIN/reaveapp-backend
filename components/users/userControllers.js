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
        EventModel.findByIdAndUpdate(
          req.body.event_id,
          {
            $inc:
              //list des chose a changer pour cette route
              { ticket: 1 },
          },
          { new: true, runValidators: true }
        );
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
