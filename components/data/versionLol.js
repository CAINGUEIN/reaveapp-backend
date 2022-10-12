const ModelVersion = require("../../models/LOLVersion/versionJSON");

const DataVersionLol = {
  lastVersion(req, res, next) {
    ModelVersion.find()
      .sort({ version: -1 })
      .then((dataVersion) => {
        res
          .status(200)
          .send({
            success: true,
            message: "Ok data version",
            data: dataVersion[0],
          });
      })
      .catch((err) => {
        res
          .status(400)
          .send({ success: false, message: "Erreur data version" });
      });
  },
};

module.exports = DataVersionLol;
