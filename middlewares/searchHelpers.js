const UserModel = require("../models/user");

const searchControllers = {
  //ici une suite de services pour faire des recherche
  async usersNameList(req, res, next) {
    UserModel.find({
      userName: { $regex: req.body.userName, $options: "i" },
    })
      .then((list) => {
        console.log("usersNameList");
        req.usersNameList = list;
        next();
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur user List",
          data: err,
        });
      });
  },
  async profileTagList(req, res, next) {
    UserModel.find({
      profileTag: { $regex: req.body.profileTag, $options: "i" },
    })
      .then((list) => {
        console.log("profileTagList");
        req.profileTagList = list;
        next();
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur profileTag List",
          data: err,
        });
      });
  },
};

module.exports = searchControllers;
