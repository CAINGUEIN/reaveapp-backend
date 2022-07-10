//module dotenv
require("dotenv").config();

//module express
const express = require("express");
const app = express();

const cors = require("cors");

const publicRouter = require("./routes/publicRoutes.js");
const authRouter = require("./routes/authRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const userUpdateRouter = require("./routes/userUpdateRoutes.js");
const socialRouter = require("./routes/socialRoutes.js");
const spaceRoutes = require("./routes/spaceRoutes.js");
const calendarPersonalRoutes = require("./routes/calendarPersonalRoutes.js");
const searchRoutes = require("./routes/searchRoutes");

//extension d'express
const bodyParser = require("body-parser");

//module mongoose
require("./plugin/mongoose/mongoose");

//ajout des modules dans l'app
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//ajout des routes dans l'app
app.use("/calendar/personal", calendarPersonalRoutes);
app.use("/auth", authRouter);
app.use("/user/update", userUpdateRouter);
app.use("/user", userRouter);
app.use("/social", socialRouter);
app.use("/space", spaceRoutes);
app.use("/search", searchRoutes);
app.use("/", publicRouter);


module.exports = app;
