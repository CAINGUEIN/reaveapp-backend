const UserModel = require("../models/user");

const userControllers = {
  deleteUser(req, res) {
    UserModel.deleteOne({ _id: req.decodedToken._id })
      .then(() =>  {
        res.status(200).send({ success: true, message: "Suppression Ok" });
      })
      .catch(() =>  {
        res.status(400).send({ success: false, message: "Erreur suppression" });
      });
  },
  infoUser(req, res) {
      UserModel.findOne({ _id: req.decodedToken._id })
      .then((user) =>  {
        res.status(200).send({ success: true, message: "Ok data user", data: user });
      })
      .catch(() =>  {
        res.status(400).send({ success: false, message: "Erreur data user" });
      });
  }
};

module.exports = userControllers;
