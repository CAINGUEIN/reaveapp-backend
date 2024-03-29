const jwt = require("jsonwebtoken");
const saltRounds = 10;
const JWT_KEY = process.env.JWT_SECRET;

const bcrypt = require("bcrypt");

const UserModel = require("../../models/user");

const AuthControllers = {
  createAccount(req, res, next) {
    console.log(req.body);
    UserModel.insertMany(req.body)
      .then((newUser) => {
        console.log(newUser);
        next();
      })
      .catch((err) => {
        console.log("pas cool", err);
        return res.status(400).send({
          success: false,
          data: err,
          errors: { email: "error", name: "error" },
        });
      });
  },

  async login(req, res) {
    const email = req.body.email;
    let password = "";
    if (req.body.passwordNoHash) {
      password = req.body.passwordNoHash;
    } else {
      password = req.body.password;
    }

    return UserModel.findOne({ email: email })
      .select("+password")
      .then((user) => {
        if (user === null) {
          return res.status(401).send({
            success: false,
            errors: { email: "Informations de connexion incorrectes" },
          });
        }
        let passwordsDoMatch = bcrypt.compareSync(
          password,
          user.password,
          saltRounds
        );
        if (!passwordsDoMatch) {
          return res.status(401).send({
            success: false,
            errors: { email: "Informations de connexion incorrectes" },
          });
        } else {
          jwt.sign(
            { _id: user._id },
            JWT_KEY,
            { expiresIn: "60 days" },
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
      .catch((err) => console.log("pas cool", err));
  },
};

module.exports = AuthControllers;
