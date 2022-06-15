const UserModel = require("../models/user");

const FriendControllers = {
  //TODO: penser a faire la notification
  addFriend(req, res) {
    console.log(req.body);
    //target le user ciblant
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
      { runValidators: true }
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
            res
              .status(200)
              .send({ success: true, message: "Ok invitation user" });
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
  },
};

module.exports = FriendControllers;
