const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_SECRET;
const tools = require("../functionHelper/functionHelpToken");

const TokenHelpers = {
  verifyTokenId(req, res, next) {
    console.log(JWT_KEY);
    //console.log("JWT verify", jwt.verify(tools.extractToken(req, res), JWT_KEY));
    let decodedToken = jwt.verify(tools.extractToken(req, res), JWT_KEY);
    if (decodedToken._id) {
      console.log("dans le OK token",decodedToken);
      req.decodedToken = decodedToken;
      next();
    } else {
      console.log("dans le pas ok ",decodedToken);
      return res.status(400).send({
        success: false,
        errors: "Bad token"
      });
    }
  },
};

module.exports = TokenHelpers;
