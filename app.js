process.env.NODE_ENV = process.env.CONTANUITY_SERVER_ENV || process.env.NODE_ENV || 'development';


console.log('ENV: ', process.env.NODE_ENV);

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var config = require('./config/config');
var app = express();
var db = require('./config/db');
//initialize passport.js strategies
config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function (strategy) {
    require(path.resolve(strategy))();
});


config.getGlobbedFiles('./app/**/*.sequelize.model.js').forEach(function (file) {
  let v = require(path.resolve(file));
  if(v.$$app_addRelations){
      v.$$app_addRelations();
      delete v.$$app_addRelations;        
  }
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(passport.initialize());

app.use( bodyParser.json({limit: '5mb'}) );
app.use(bodyParser.urlencoded({
  limit: '5mb',
  extended: true,
  parameterLimit:5000
}));
var users = require('./app/user/user-auth.route');

app.use('/auth', users);

app.get("/", function(req, res) {
    res.json({message: "Express is up!"});
  });
  
  app.listen(3000, function() {
    console.log("Express running");
  });
  module.exports = app;