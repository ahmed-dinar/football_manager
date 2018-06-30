'use strict';

var jwt = require('jsonwebtoken');
var has = require('has');
var jwt_secret = 'thisisseretcode';
var logger = require('winston');


//
// if logged in decode and put in req.user, else leave
//
function authMiddleware(req, res, next){

  logger.debug('access_token = ', req.cookies.access_token);

  if( !has(req.cookies,'access_token') ){
    return next();
  }

  jwt.verify(
    req.cookies.access_token,
    jwt_secret,{
      issuer: 'https://football-manager-app/api/'
    },
    function(err, user) {
      if (err) {
        logger.debug(err);
        return next();
      }

      req.user = user;
      next();
    }
  );
}


module.exports = authMiddleware;