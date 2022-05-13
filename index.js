//module dotenv
require('dotenv').config();

//module express
const express = require('express');
const app = express();

const cors = require('cors')

const publicRouter = require('./routes/publicRoutes.js')
const authRouter = require('./routes/authRoutes.js')
const userRouter = require('./routes/userRoutes.js')
const socialRouter = require('./routes/socialRoutes.js')
const spaceRoutes = require('./routes/spaceRoutes.js')

//extension d'express
const bodyParser = require('body-parser')

//module mongoose
require('./plugin/mongoose')

//ajout des modules dans l'app
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//ajout des routes dans l'app
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/social', socialRouter)
app.use('/space', spaceRoutes)
app.use('/', publicRouter)

module.exports = app;