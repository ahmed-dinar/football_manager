'use strict';


var express = require('express');
var router = express.Router();
var async = require('async');
var logger = require('winston');

var Schema = appRequire('config/validator-schema');
var AppError = appRequire('lib/custom-error');
var Manager = appRequire('models/manager');

router.post('/', function(req, res, next) {

  console.log('sign up body');



  console.log(req.body);

  async.waterfall([
    function validateInput(callback){
      req.checkBody(Schema.resistration);
      req.checkBody('email','already taken').emailExists();
      req.assert('confirmPassword', 'does not match').equals(req.body.password);

      logger.debug('validatin inputs..');

      req
        .getValidationResult()
        .then(function(result) {
          if (!result.isEmpty()){
            var e = result.array()[0];
            logger.debug(e);
            return callback(new AppError(e.param + ' ' + e.msg,'input'));
          }

          return callback();
        });
    },
    async.apply(Manager.save, req.body)
   // async.apply(sendVarificationToken, req)
  ],
  function(err, data){
    if(err){
      if(err.name === 'input')
        return res.status(400).json({ error: err.message });

      logger.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.sendStatus(200);
  });
});





module.exports = router;