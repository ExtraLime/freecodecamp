"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const pug = require("pug");
const session = require("express-session");
const passport = require("passport");
const mongo = require("mongodb").MongoClient;
const LocalStrategy = require("passport-local");
const bcrypt = require('bcrypt')
const routes = require('./routes.js')
const auth = require('./auth.js')

const ObjectID = require("mongodb").ObjectID;
const app = express();

fccTesting(app); //For FCC testing purposes

app.use("/public", express.static(process.cwd() + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongo.connect(process.env.DB_URI, { useUnifiedTopology: true }, (err, db) => {
  if (err) {
    console.log("Database error: " + err);
  } else {
    console.log("Successful database connection");
    auth(app,db);
    routes(app,db);

    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  }
});
