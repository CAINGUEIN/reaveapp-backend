const express = require("express");
const authRouter = express.Router();

const CreateUserValidateData = require("../middlewares/validatorSignup");
const BdHelpers = require("../middlewares/bdHelpers");
const AuthControllers = require("../controllers/authControllers");
const TokenHelpers = require("../middlewares/tokenHelpers");

authRouter.post(
  "/create",
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

authRouter.get("/info", TokenHelpers.verifyTokenId, )

module.exports = authRouter;
