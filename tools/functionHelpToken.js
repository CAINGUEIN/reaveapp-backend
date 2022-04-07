function extractToken(req, res) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return res.status(401).send({ success: false, message: "auth pas ok" }).redirect('/login');
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ success: false, message: "token pas ok" }).redirect('/login');
    }
    return token;
  }
  
  module.exports = {
    extractToken,
  };