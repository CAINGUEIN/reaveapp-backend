const UserModel = require("../models/user");
const functionBd = require("../tools/functionHelpBD");

const BdHelpers = {
  ifExist(params) {
    return (req, res, next) => {
      return functionBd
        .exist(params.bd, params.target, req.body[params.target])
        .then((result) => {
          if (result) {
            return res.status(400).send({
              success: false,
              message: params.target + " deja existant",
            });
          } else {
            next();
          }
        });
    };
  },
};

module.exports = BdHelpers;
