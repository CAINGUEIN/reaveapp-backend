function extractToken(req, res) {
    console.log(req.headers);
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return res.status(400).send({ success: false, message: "auth pas ok" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(400).send({ success: false, message: "token pas ok" });
    }
    console.log("dans le token");
    return token;
  }
  
  module.exports = {
    extractToken,
  };