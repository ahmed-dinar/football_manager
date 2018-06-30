'use strict';


var express = require('express');
var router = express.Router();

var has = require('has');
var authJwt = appRequire('middlewares/authJwt');

router.get('/role', authJwt, function(req, res, next) {

  var status = ( !has(req.query,'role') || req.user.role !== req.query.role )
    ? 403
    : 200;

  res.sendStatus(status);
});


module.exports = router;
