const express = require("express");
const authRouter = express.Router();

const authValidator = require("../auth/authValidator");
const AuthControllers = require("../auth/authControllers");

authRouter.post(
  "/register",
  authValidator.signup,
  authValidator.hashPassword,
  AuthControllers.createAccount,
  AuthControllers.login
);

authRouter.post("/login", AuthControllers.login);

authRouter.get("/logout", (req, res) => {
  res.send({ success: true, message: "Déconnection" });
});

module.exports = authRouter;
