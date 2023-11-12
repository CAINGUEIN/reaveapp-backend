const express = require("express");
const uploadImageRouter = express.Router();

const VenueModel = require("../models/venue");

const TokenHelpers = require("../components/core/tokenHelpers");
const VenueControllers = require("../components/venue/venueControllers");

// -Boatti- comment :
// Multer is used to upload pictures.
// Pictures are upload to the folder /uploads.
// Then url of the pic are stored to MongoDB.
// This system is a Local storage system. This is not a good system and is only used for the prototype.
// The solution is an Amazon S3 storage for exemple.

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const uploads = multer({ storage });

uploadImageRouter.post(
  "/venue/primaryPic",
  TokenHelpers.verifyTokenId,
  uploads.single('selectedPic'),
  async (req, res) => {
    const imageName = req.file.filename;
    const venueId = req.body.venueId;
    try {
      VenueControllers.addPrimaryPicVenue(imageName, venueId, res);
    } catch (error) {
    }
  }
);

module.exports = uploadImageRouter;