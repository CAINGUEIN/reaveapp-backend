function extractToken(req, res) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return res.status(401).send({ success: false, message: "auth pas ok" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ success: false, message: "token pas ok" });
    }
    return token;
  }
  
  module.exports = {
    extractToken,
  };