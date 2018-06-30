'use strict';

var uniqid = require('uniqid');

var configObj = {

  options: function(){

    return {
      algorithm: 'HS256',
      expiresIn: 12*60*60,
      issuer: 'https://football-manager-app/api/',
      jwtid: uniqid(),
      subject: 'Auth',
      header: {
        typ: 'JWT'
      }
    };
  }
};

module.exports = configObj;