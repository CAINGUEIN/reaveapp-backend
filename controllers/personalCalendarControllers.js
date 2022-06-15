const UserModel = require("../models/user");
const mongoose = require("mongoose");


const personalCalendarControllers = {
  createEvent(req, res) {
    UserModel.findByIdAndUpdate(
      req.decodedToken._id,
      {
        $addToSet: {
          calendar: [
            {
              _id_calendar: new mongoose.mongo.ObjectId(),
              name: req.body.name,
              bio: req.body.bio,
              color: req.body.color,
              start: req.body.start,
              end: req.body.end,
            },
          ],
        },
      },
      { new: true, runValidators: true }
    )
      .then((doc) => {
        res.status(200).send({
          success: true,
          data: doc.calendar,
          message: "Create Event Calendar Ok",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          data: err,
          message: "Create Event Calendar Error",
        });
      });
  },
  readEvent(req, res) {
    UserModel.findOne({ _id: req.decodedToken._id })
      .then((doc) => {
        res.status(200).send({
          success: true,
          data: doc.calendar,
          message: "Read Event Calendar Ok",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          data: err,
          message: "Read Event Calendar Error",
        });
      });
  },
  updateEvent(req, res) {},
  deleteEvent(req, res) {},
};

module.exports = personalCalendarControllers;
