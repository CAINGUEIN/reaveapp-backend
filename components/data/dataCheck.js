const EventModel = require("../../models/event");
const UserModel = require("../../models/user");

const DataCheck = {
  puuidMatch(req, res, next) {
    //TODO: utiliser le validateur mongoose pour ça
    UserModel.findOne({ "lolData.lolPuuid": req.body.lolPuuid })
      .then((userMatch) => {
        if (userMatch === null) {
          req.dataUser.lolData.lolPuuid = req.body.lolPuuid;
          next();
        } else {
          return res.status(400).send({
            success: false,
            message: "Erreur Puuid if exist",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send({
          success: false,
          message: "Erreur Puuid",
          data: err,
        });
      });
  },

  verifyStaff(req, res, next) {
    EventModel.find({
      $and: [
        { _id: req.body.project_id },
        {
          $or: [
            { "owner.user_id": req.body.staff_id },
            { staff: { $elemMatch: { staff_id: req.body.staff_id } } },
          ],
        },
      ],
    })
      .then((result) => {
        console.log(result.length);
        if (result.length > 0) {
          return res.status(400).send({
            success: false,
            message: "Erreur verifyStaff user exist",
            data: result,
          });
        } else {
          next();
        }
      })
      .catch((err) => {
        return res.status(400).send({
          success: false,
          message: "Erreur verifyStaff",
          errors: err,
        });
      });
  },
};

module.exports = DataCheck;
