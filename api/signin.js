'use strict';

var express = require('express');
var router = express.Router();
var logger = require('winston');
var has = require('has');
var moment = require('moment');

var Manager = appRequire('models/manager');


router.post('/',function(req, res, next) {

  var email = req.body.email || '';
  var password = req.body.password || '';

  Manager.auth(email, password, function (err, payLoad, token){

    console.log('auth done');

    if(err){
      if( err.name === '404' || err.name === '401' ){
        return res.status(401).json({ error: 'email or password is invalid' });
      }

      logger.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    //hours * 3600000 = milliseconds
    // 1 minutes = 60000 milliseconds
    var sessionTimeout = 1;
    var jwtExpiresIn = new Date(Date.now() + (sessionTimeout * 3600000));
    var sessionExpiresIn = moment.utc()
      .add(sessionTimeout,'hours')
      .format();

    payLoad.expires = sessionExpiresIn;


    return res.status(200).json({ access_token: token, payLoad: payLoad });
      



    // //TODO: add sameSite: 'Strict'
    // res
    //   .cookie('access_token', token, {
    //     domain: config.get('domain') || 'localhost',
    //     expires: jwtExpiresIn,
    //     httpOnly: true,
    //     secure: true
    //   })
    //   .status(200)
    //   .json(payLoad);
  });
});


router.post('/signout',function(req, res, next) {

  logger.debug(req.cookies);

  if( !has(req.cookies,'access_token') ){
    return res.status(200).json();
  }

  res
    .clearCookie('access_token', {
      domain: config.get('domain') || 'localhost',
      HttpOnly: true,
      secure: true
    })
    .status(200)
    .json();
});

module.exports = router;
