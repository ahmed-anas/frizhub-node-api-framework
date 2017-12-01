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
var SwaggerExpress = require('swagger-express-mw');

//initialize passport.js strategies
config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function (strategy) {
  require(path.resolve(strategy))();
});
config.getGlobbedFiles('./app/**/*.sequelize.model.js').forEach(function (file) {
  let v = require(path.resolve(file));
  if (v.$$app_addRelations) {
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

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({
  limit: '5mb',
  extended: true,
  parameterLimit: 5000
}));

//Swagger

var swaggerConfig = {
  appRoot: `${__dirname}`,
  swaggerFile: `${__dirname}/swagger/swagger.yaml`,
  swaggerSecurityHandlers: {
    "jwt": function securityHandler1(req, authOrSecDef, scopes, callback) {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) return callback(new Error('Error in passport authenticate'));
        if (!user) return callback(new Error('Failed to authenticate token'));
        req.user = user;
        return callback();
      })(req, null, callback);

    },

  }
};
SwaggerExpress.create(swaggerConfig, function (err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = config.env === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  let port = process.env.PORT || 3000;
  app.listen(port, function () {
    console.log("Express running");
  })


});



module.exports = app;