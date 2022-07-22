const UserModel = require("../models/user");

const searchHelpers = {
  //ici une suite de services pour faire des recherche
  async usersNameList(req, res, next) {
    UserModel.find({
      // ici un regex
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

  async findWithId(req, res, next) {
    console.log("findWithId");
    UserModel.findById(req.decodedToken._id).sort({_id_match: -1})
      .then((result) => {
        req.dataUser = result;
        next();
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "erreur d'_id",
          data: err,
        });
      });
  },
};

module.exports = searchHelpers;
