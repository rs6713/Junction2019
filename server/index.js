const express = require('express')
const bodyParser = require('body-parser')
const http = require("http");
//const cookieParser= require('cookie-parser')

// const path = require('path')
// var https = require('https')
// var fs=require('fs')
//const logger = require('morgan');
require("dotenv").config();


const cors = require("cors");

// Set up the express app
const app = express();

//#region App settings
// Log requests to the console.
//app.use(logger('dev'));
app.use(cors());
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//#endregion

//Routing configuration
require("./models/routes")(app);

// This will be our application entry. We'll setup our server here.
const port = parseInt(process.env.PORT, 10) || 8000;
app.set("port", port);

const server = http.createServer(app);
server.listen(port, console.log("Server is running on port: " + port));

module.exports = app;
