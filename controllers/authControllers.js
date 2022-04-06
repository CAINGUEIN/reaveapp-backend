const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_SECRET;

const bcrypt = require("bcrypt");

const UserModel = require("../models/user");

const AuthControllers = {
  createAccount(req, res) {
    return UserModel.insertMany(req.body).then((newUser) => {
      jwt.sign(
        { _id: newUser._id },
        JWT_KEY,
        { expiresIn: "24h" },
        (err, token) => {
          if (err) console.log(err);
          res.status(200).send({
            token: token,
            success: true,
            message: "Félicitation ! Vous êtes désormais inscrit",
          });
        }
      );
    });
  },
  login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    return UserModel.findOne({ email: email })
      .then((user) => {
        if (user === null) {
          return res.status(401).send({
            success: false,
            message: "Informations de connexion incorrectes",
          });
        }
        let passwordsDoMatch = bcrypt.compareSync(password, user.password);
        if (!passwordsDoMatch) {
          return res.status(401).send({
            success: false,
            message: "Informations de connexion incorrectes",
          });
        } else {
          jwt.sign(
            { _id: user._id },
            JWT_KEY,
            { expiresIn: "24h" },
            (err, token) => {
              if (err) console.log(err);
              res.status(200).send({
                token: token,
                success: true,
                message: "Login ok",
              });
            }
          );
        }
      })
      .catch((err) => console.log("pas cool"));
  },
};

module.exports = AuthControllers;
