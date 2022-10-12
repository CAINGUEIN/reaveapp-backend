const UserModel = require("../../models/user");

const friends = {
  //TODO: penser a faire la notification
  addFriend(req, res) {
    console.log(req.body);
    if (req.decodedToken._id === req.body._targetUser_id) {
      return res.status(400).send({
        success: false,
        message: "Erreur impossible d'etre ami avec sois meme",
      });
    }
    //target le user ciblant
    //TODO: voir a faire une verification pour bloquer la reinvitation de personne deja ami
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        //push invitationSended
        $push: {
          // dans la notification _id et userName ciblé et ciblant plus text
          invitationSended: {
            type: "addFriend",
            _targetUser_id: req.body._targetUser_id,
          },
        },
      },
      { new: true, runValidators: true }
    )
      .then((userTargeter) => {
        UserModel.findByIdAndUpdate(
          req.body._targetUser_id,
          {
            //push une notification d'invitation
            $push: {
              // dans la notification _id et userName ciblé et ciblant plus text
              notifications: {
                type: "addFriend",
                content:
                  userTargeter.userName + " invite you for add friend List",
                data: {
                  _targeter_id: userTargeter._id,
                  targeterName: userTargeter.userName,
                },
              },
            },
          },
          { runValidators: true }
        )
          .then(() => {
            res.status(200).send({
              success: true,
              message: "Ok invitation user",
              data: userTargeter.invitationSended,
            });
          })
          .catch((err) => {
            res.status(400).send({
              success: false,
              message: "Erreur invitation notification user",
              data: err,
            });
          });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: "Erreur invitation sended user",
          data: err,
        });
      });
    //push dans le user ciblant le friend en attente
  },
  validateAddFriend(req, res) {
    //une fois l'invitation validé mettre le _id ciblé dans ciblant et inverse comme pour le follow
    UserModel.findByIdAndUpdate(
      req.body._targeter_id,
      {
        $addToSet: { friends: [req.decodedToken._id] },
        //supprimé invitationSended
        $pull: { invitationSended: { _targetUser_id: req.decodedToken._id } },
      },
      { new: true, runValidators: true }
    )
      .then((result) => {
        console.log(result);
        UserModel.findByIdAndUpdate(
          req.decodedToken._id,
          {
            $addToSet: { friends: [result._id] },
            // suppr la notification
            $pull: { notifications: { _id: req.body._notification_id } },
          },
          { new: true, runValidators: true }
        )
          .then((resultEnd) => {
            res.status(200).send({
              success: true,
              message: "Ok update friends list",
              data: resultEnd,
            });
          })
          .catch((err) => {
            res.status(400).send({
              success: false,
              message: "Erreur add 2 friend",
              data: err,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          success: false,
          message: "Erreur add 1 friend",
          data: err,
        });
      });
  },
  declineFriend(req, res) {
    //supprimé invitationSended et la notification
    UserModel.findByIdAndUpdate(
      req.body._targeter_id,
      {
        //supprimé invitationSended
        $pull: { invitationSended: { _targetUser_id: req.decodedToken._id } },
      },
      { new: true, runValidators: true }
    )
      .then((result) => {
        console.log(result);
        UserModel.findByIdAndUpdate(
          req.decodedToken._id,
          {
            // suppr la notification
            $pull: { notifications: { _id: req.body._notification_id } },
          },
          { new: true, runValidators: true }
        )
          .then((resultEnd) => {
            res.status(200).send({
              success: true,
              message: "Ok decline friend add",
              data: resultEnd,
            });
          })
          .catch((err) => {
            res.status(400).send({
              success: false,
              message: "Erreur decline 2 friend",
              data: err,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          success: false,
          message: "Erreur decline 1 friend",
          data: err,
        });
      });
  },
};

module.exports = friends;
