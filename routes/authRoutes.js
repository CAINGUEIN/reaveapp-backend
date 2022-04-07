const express = require("express");
const authRouter = express.Router();

const CreateUserValidateData = require("../middlewares/validatorSignup");
const BdHelpers = require("../middlewares/bdHelpers");
const AuthControllers = require("../controllers/authControllers");

authRouter.post(
  "/register",
  CreateUserValidateData.signup,
  CreateUserValidateData.hashPassword,
  BdHelpers.ifExist({
    bd: "user",
    target: "userName",
  }),
  BdHelpers.ifExist({
    bd: "user",
    target: "email",
  }),
  AuthControllers.createAccount
);

authRouter.post("/login", CreateUserValidateData.login, AuthControllers.login);

authRouter.get("/logout", () => {
  res.send({ success: true, message: "Déconnection" });
});

module.exports = authRouter;
