const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_SECRET;
const tools = require("../tools/functionHelpToken")

const TokenHelpers = {
  verifyTokenId(req, res, next) {
    req.decodedToken = jwt.verify(tools.extractToken(req, res), JWT_KEY);
    next()
  },
};

module.exports = TokenHelpers;