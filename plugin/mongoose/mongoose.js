const mongoose = require("mongoose");

const DB_URI = process.env.MONGOOSE_DB;

mongoose.connect(DB_URI).then(
  (data) => {
    console.log(`Db Mongoose connecté`);
  },
  (err) => {
    console.log(`Db Mongoose erreur`, err);
  }
);
