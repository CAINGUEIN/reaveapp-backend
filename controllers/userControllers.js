const UserModel = require("../models/user");

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

  async infoUser(req, res) {
    UserModel.findOne({ _id: req.decodedToken._id })
      .populate("spaces")
      .exec((err, user) => {
        console.log(user);
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
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        //list des chose a changer pour cette route
        userName: req.body.userName,
        email: req.body.email,
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
};

module.exports = userControllers;
