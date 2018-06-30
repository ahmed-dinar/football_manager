'use strict';

var express = require('express');
var path = require('path');
var fs = require('fs');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('winston');

var methodOverride = require('method-override')

var helmet = require('helmet');
var entities = require('entities');

var forEach = require('lodash/forEach');
var expressValidator = require('express-validator');

global.appRequire = function(name) {
  return require(__dirname + '/' + name);
};


/**
 * Normalize a port into a number, string, or false.
 */
module.exports.normalizePort = function (val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
        // named pipe
    return val;
  }

  if (port >= 0) {
        // port number
    return port;
  }

  return false;
};


/**
 * Create express server based on ssl or not
 * @param app
 */
module.exports.initServer = function (app) {

  global.PORT = this.normalizePort('3000');

  //set port for express app server
  app.set('port', global.PORT);


  return require('http').createServer(app);
};


/**
 * Initialize and load express application, {base function}
 * @returns {*|Function}
 */
module.exports.init = function () {

  var _this = this;

  require('./config/logger');

  var app = express();


  app.use(helmet());

  app.use( morgan('dev', { stream: {
    write: function(message){
      logger.info(message.slice(0, -1));
    }
  }}));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride());
  app.use(expressValidator({
    customValidators: appRequire('config/custom-validator'),
    customSanitizers: {
      escapeInput: entities.encodeHTML
    }
  }));
  app.use(cookieParser());
  //app.use(serveStatic(path.join(__dirname, 'public/static')));


  //load client default routes
  var apiEndpoints = ['signin','signup','auth', 'team'];

  forEach(apiEndpoints, function(routeName) {
    app.use('/api/' + routeName, require('./api/' + routeName) );
  });

  
  app.use(function (err, req, res, next) {
    //express-jwt authentication
    if (err.name === 'UnauthorizedError'){
      logger.debug(err);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    logger.error(err.name);
    logger.error(err.code);
    logger.error(err.message);
    logger.error(err);


    res.status(500).json({ error: 'Internal Server Error' });
  });



    //create express server
  return _this.initServer(app);
};