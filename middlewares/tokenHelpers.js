const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_SECRET;
const tools = require("../tools/functionHelpToken");

const TokenHelpers = {
  verifyTokenId(req, res, next) {
    let decodedToken = jwt.verify(tools.extractToken(req, res), JWT_KEY);
    if (decodedToken._id) {
      console.log(decodedToken);
      req.decodedToken = decodedToken;
      next();
    } else {
      console.log(decodedToken);
    }
  },
};

module.exports = TokenHelpers;
