const UserModel = require("../models/user");

const followControllers = {
  follow(req, res) {
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        $addToSet: { following: [req.body._id] },
      },
      { runValidators: true }
    )
      .then(() => {
        UserModel.findByIdAndUpdate(
          req.body._id,
          {
            $addToSet: { followers: req.decodedToken._id },
          },
          { runValidators: true }
        )
          .then(() => {
            res
              .status(200)
              .send({ success: true, message: "Ok update follow" });
          })
          .catch((err) => {
            res.status(400).send({
              success: false,
              message: "Erreur followers user",
            });
          });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: "Erreur following user",
        });
      });
  },

  unfollow(req, res) {
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        $pull: { following: req.body._id },
      },
      { runValidators: true }
    )
      .then(() => {
        UserModel.findByIdAndUpdate(
          req.body._id,
          {
            $pull: { followers: req.decodedToken._id },
          },
          { runValidators: true }
        )
          .then(() => {
            res
              .status(200)
              .send({ success: true, message: "Ok update unfollow" });
          })
          .catch((err) => {
            res.status(400).send({
              success: false,
              message: "Erreur unfollowing user",
            });
          });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: "Erreur unfollowing user",
        });
      });
  },
};

module.exports = followControllers;
