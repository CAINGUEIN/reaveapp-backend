const bcrypt = require("bcrypt");
const saltRounds = 10;

const validator = require("validator");

const CreateUserValidateData = {
  signup(req, res, next) {
    let {
      email,
      userName,
      password,
      confirmPassword,
      birthDay,
      cgu,
    } = req.body;
    if (
      !email ||
      !userName ||
      !birthDay ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).send({
        success: false,
        errors: {email: "Les champs obligatoires ne sont pas tous remplis"}
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).send({
        success: false,
        errors: {email: "L'email saisis n'est pas valide"}
      });
    }
    if (cgu === "true") {
      cgu = true;
    }
    if (cgu !== true) {
      return res.status(400).send({
        success: false,
        message: "La C.G.U n'est pas validé",
      });
    }
    if (!validator.isAlphanumeric(userName, ["fr-FR"])) {
      return res.status(400).send({
        success: false,
        message: "L'userName n'est pas valide",
      });
    }
    if (password != confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Les mots de passe saisis ne sont pas identiques",
      });
    }
    next();
  },
  hashPassword(req, res, next) {
    req.body.passwordNoHash = req.body.password
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
          password: "error"
        }
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).send({
        success: false,
        errors: {
          email: "email not invalable"
        }
      });
    }
    next();
  },
};

module.exports = CreateUserValidateData;
