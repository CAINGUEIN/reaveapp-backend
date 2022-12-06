const EventModel = require("../../models/event");

function findByMatchingProperties(array, properties) {
  let result = array.filter(function (entry) {
    return Object.keys(properties).every(function (key) {
      if (entry[key] == properties[key]) {
        return entry[key] == properties[key];
      } else {
        return false;
      }
    });
  });
  return result[0];
}

const PermissionsValidate = {
  async isViewer(req, res, next) {
    EventModel.findById(req.body.project_id)
      .then((event) => {
        if (event.owner.user_id == req.decodedToken._id) {
          console.log("isAdmin owner");
          next();
        } else if (
          findByMatchingProperties(event.staff, {
            staff_id: req.decodedToken._id,
          })
        ) {
          let isAdmin = findByMatchingProperties(event.staff, {
            staff_id: req.decodedToken._id,
          });
          if (
            isAdmin.permission === "Admin" ||
            isAdmin.permission === "Editor" ||
            isAdmin.permission === "Viewer"
          ) {
            next();
          } else {
            res.status(400).send({
              success: false,
              message: "Erreur permission insufficient project",
            });
          }
        } else {
          res.status(400).send({
            success: false,
            message: "Erreur permission project",
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: "Erreur find project",
          errors: err,
        });
      });
  },
  async isEditor(req, res, next) {
    EventModel.findById(req.body.project_id)
      .then((event) => {
        if (event.owner.user_id == req.decodedToken._id) {
          console.log("isAdmin owner");
          next();
        } else if (
          findByMatchingProperties(event.staff, {
            staff_id: req.decodedToken._id,
          })
        ) {
          let isAdmin = findByMatchingProperties(event.staff, {
            staff_id: req.decodedToken._id,
          });
          if (
            isAdmin.permission === "Admin" ||
            isAdmin.permission === "Editor"
          ) {
            next();
          } else {
            res.status(400).send({
              success: false,
              message: "Erreur permission insufficient project",
            });
          }
        } else {
          res.status(400).send({
            success: false,
            message: "Erreur permission project",
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: "Erreur find project",
          errors: err,
        });
      });
  },
  async isAdmin(req, res, next) {
    EventModel.findById(req.body.project_id)
      .then((event) => {
        if (event.owner.user_id == req.decodedToken._id) {
          console.log("isAdmin owner");
          next();
        } else if (
          findByMatchingProperties(event.staff, {
            staff_id: req.decodedToken._id,
          })
        ) {
          let isAdmin = findByMatchingProperties(event.staff, {
            staff_id: req.decodedToken._id,
          });
          if (isAdmin.permission === "Admin") {
            next();
          } else {
            res.status(400).send({
              success: false,
              message: "Erreur permission insufficient project",
            });
          }
        } else {
          res.status(400).send({
            success: false,
            message: "Erreur permission project",
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: "Erreur find project",
          errors: err,
        });
      });
  },
  async isOwner(req, res, next) {
    EventModel.findById(req.body.project_id)
      .then((event) => {
        if (event.owner.user_id === req.decodedToken._id) {
          next();
        } else {
          res.status(400).send({
            success: false,
            message: "Erreur permission project",
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: "Erreur find project",
          errors: err,
        });
      });
  },
};

module.exports = PermissionsValidate;
