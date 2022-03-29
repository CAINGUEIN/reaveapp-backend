//module express
let express = require('express');
let app = express();

let publicRouter = require('./routes/publicRoutes.js')

//extension d'express
let bodyParser = require('body-parser')

//module dotenv
require('dotenv').config();

//module mongoose
require('./plugin/mongoose')

//ajout des modules dans l'app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//ajout des routes dans l'app
app.use('/', publicRouter)

module.exports = app;