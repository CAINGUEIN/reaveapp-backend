const UserModel = require("../../models/user");

const searchHelpers = {
  //ici une suite de services pour faire des recherche
  async usersTagList(req, res, next) {
    UserModel.find({
      // ici un regex
      userTag: { $regex: req.body.userTag, $options: "i" },
    })
      .then((list) => {
        console.log("usersTagList");
        req.usersTagList = list;
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
  async profileNameList(req, res, next) {
    UserModel.find({
      profileName: { $regex: req.body.profileName, $options: "i" },
    })
      .then((list) => {
        console.log("profileNameList");
        req.profileNameList = list;
        next();
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur profileName List",
          data: err,
        });
      });
  },
/**
 * @info recup les datas du user avec un trie _id_match
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @return {Object} req.dataUser 
 */
  async findWithId(req, res, next) {
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
