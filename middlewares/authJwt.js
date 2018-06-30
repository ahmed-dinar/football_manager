'use strict';

var jwt = require('express-jwt');
var jwt_secret = 'thisisseretcode';
var has = require('has');

var jwtMiddleware = jwt({
  secret: jwt_secret,
  issuer: 'https://football-manager-app/api/',
  getToken: fromHeader
});

//
// extract jwt from header
//
function fromHeader(req) {

	console.log(req.headers);

  if( !has(req.headers,'access_token') )
    return null;

  return req.headers.access_token;
}

module.exports = jwtMiddleware;