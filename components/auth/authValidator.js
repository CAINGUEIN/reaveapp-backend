const bcrypt = require("bcrypt");
const saltRounds = 10;

const validator = require("validator");

const CreateUserValidateData = {
  signup(req, res, next) {
    let errors = {};
    let { userTag, profileName, email, password } = req.body;
    if (!userTag || !profileName || !email || !password) {
      errors["email"] = "Les champs obligatoires ne sont pas tous remplis";
    }
    if (!validator.isEmail(email)) {
      errors["email"] = "L'email saisis n'est pas valide";
    }
    if (!validator.isAlphanumeric(userTag, ["fr-FR"])) {
      errors["userTag"] = "L'userTag n'est pas valide";
    }
    if (!validator.isAlphanumeric(profileName, ["fr-FR"])) {
      errors["profileName"] = "Le profileName n'est pas valide";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).send({
        success: false,
        errors: errors,
      });
    } else {
      next();
    }
  },
  hashPassword(req, res, next) {
    req.body.passwordNoHash = req.body.password;
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    next();
  },
  login(req, res, next) {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        errors: {
          email: "error",
          password: "error",
        },
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).send({
        success: false,
        errors: {
          email: "email not invalable",
        },
      });
    }
    next();
  },
};

module.exports = CreateUserValidateData;
