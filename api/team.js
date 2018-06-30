'use strict';

var express = require('express');
var router = express.Router();
var logger = require('winston');
var async = require('async');
var has = require('has');
var AppError = appRequire('lib/custom-error');
var Schema = appRequire('config/validator-schema');
var authJwt = appRequire('middlewares/authJwt');
var Manager = appRequire('models/manager');


router.get('/list', authJwt, function(req, res, next) {

  var managerId = req.user.id;

  console.log('manager id: ' + managerId);


  Manager.teams(managerId, function(err, teams){

    if(err){
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('teams');
    console.log(teams);

    res.status(200).json(teams);

  });

});


router.post('/create', authJwt, function(req, res, next) {

  var managerId = req.user.id;

  console.log('manager id: ' + managerId);

  async.waterfall([
    function validateInput(callback){
      req.checkBody(Schema.team);
      req.checkBody('name','already taken').teamNameExists();

      logger.debug('validatin inputs..');

      req
        .getValidationResult()
        .then(function(result) {
          if (!result.isEmpty()){
            var e = result.array()[0];
            logger.debug(e);
            return callback(new AppError(e.param + ' ' + e.msg,'input'));
          }

          req.body.mid = managerId;

          return callback();
        });
    },
    async.apply(Manager.addTeam, req.body)
  ],
  function(err, data){
    if(err){
      if(err.name === 'input')
        return res.status(400).json({ error: err.message });

      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.sendStatus(200);
  });


});


router.get('/:tname', authJwt, function(req, res, next) {

  var managerId = req.user.id;
  var teamName = req.params.tname;


  Manager.getTeam(managerId, teamName, function(err, team){

    if(err){
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log(team);

    if(!team || !team.length){
      return res.status(404);
    }

    res.status(200).json(team[0]);

  });

});


router.get('/:tname/players', authJwt, function(req, res, next) {

  var managerId = req.user.id;
  var teamName = req.params.tname;


  Manager.players(managerId, teamName, function(err, players){

    if(err){
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log(players);

    res.status(200).json(players);

  });

});


router.get('/:tname/player/:pname', authJwt, function(req, res, next) {

  var managerId = req.user.id;
  var teamName = req.params.tname;
  var playerName = req.params.pname;

  async.waterfall([
    function validateTeam(callback){
      Manager.getTeam(managerId, teamName, function(err, rows){
        if(err){
          return callback(err);
        }

        if(!rows || !rows.length){
          return callback(new AppError(teamName + ' does not exists','input'));
        }

        console.log(rows);

        return callback(null, rows[0].id);

      });
    },
    function validatePlayer(teamId, callback){
      Manager.getPlayer(teamId, playerName, function(err, rows){
        if(err){
          return callback(err);
        }

        if(!rows || !rows.length){
          return callback(new AppError(playerName + ' does not exists','input'));
        }

        return callback(null, rows[0]);
      });
    }
  ],
  function(err, data){
    if(err){
      if(err.name === 'input')
        return res.status(400).json({ error: err.message });

      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log(data);

    res.status(200).json(data);
  });

});



router.post('/:tname/addplayer', authJwt, function(req, res, next) {

  var managerId = req.user.id;
  var teamName = req.params.tname;

  async.waterfall([
    function validateTeam(callback){
      Manager.getTeam(managerId, teamName, function(err, rows){
        if(err){
          return callback(err);
        }

        if(!rows || !rows.length){
          return callback(new AppError(teamName + ' does not exists','input'));
        }

        console.log(rows);

        return callback(null, rows[0].id);

      });
    },
    function validateInput(teamId, callback){
      req.checkBody(Schema.player);
      req.checkBody('name','already taken').playerNameExists(teamId);

      logger.debug('validatin inputs..');

      req
        .getValidationResult()
        .then(function(result) {
          if (!result.isEmpty()){
            var e = result.array()[0];
            logger.debug(e);
            return callback(new AppError(e.param + ' ' + e.msg,'input'));
          }

          req.body.tid = teamId;

          return callback();
        });
    },
    async.apply(Manager.addPlayer, req.body)
  ],
  function(err, data){


    if(err){
      if(err.name === 'input')
        return res.status(400).json({ error: err.message });

      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.sendStatus(200);
  });

});


router.post('/:tname/delete/:pname', authJwt, function(req, res, next) {


  var managerId = req.user.id;
  var teamName = req.params.tname;
  var playerName = req.params.pname;

  async.waterfall([
    function validateTeam(callback){
      Manager.getTeam(managerId, teamName, function(err, rows){
        if(err){
          return callback(err);
        }

        if(!rows || !rows.length){
          return callback(new AppError(teamName + ' does not exists','input'));
        }

        console.log(rows);

        return callback(null, rows[0].id);

      });
    },
    function validatePlayer(teamId, callback){
      Manager.getPlayer(teamId, playerName, function(err, rows){
        if(err){
          return callback(err);
        }

        if(!rows || !rows.length){
          return callback(new AppError(playerName + ' does not exists','input'));
        }

        console.log(rows);

        return callback(null, rows[0].id);

      });
    },
    Manager.deletePlayer
  ],
  function(err, data){

    if(err){
      if(err.name === 'input')
        return res.status(400).json({ error: err.message });

      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.sendStatus(200);
  });

});



router.post('/:tname/update/:pname', authJwt, function(req, res, next) {

  var managerId = req.user.id;
  var teamName = req.params.tname;
  var playerName = req.params.pname;

  if( !has(req.body,'position') && !has(req.body,'rating') && !has(req.body,'salary') ){
      return res.status(400).json({ error: 'Empty request' });
  }

  if( has(req.body,'name') ){
    return res.status(400).json({ error: 'Can\'t update player name' });
  }

  async.waterfall([
    function validateTeam(callback){
      Manager.getTeam(managerId, teamName, function(err, rows){
        if(err){
          return callback(err);
        }

        if(!rows || !rows.length){
          return callback(new AppError(teamName + ' does not exists','input'));
        }

        console.log(rows);

        return callback(null, rows[0].id);

      });
    },
    function validatePlayer(teamId, callback){
      Manager.getPlayer(teamId, playerName, function(err, rows){
        if(err){
          return callback(err);
        }


        if(!rows || !rows.length){
          return callback(new AppError(playerName + ' does not exists','input'));
        }

        console.log(rows);

        return callback(null, rows[0].id);

      });
    },
    function validateInput(playerId, callback){

      
      req.checkBody(Schema.updatePlayer);
 

      logger.debug('validatin inputs..');

      req
        .getValidationResult()
        .then(function(result) {
          if (!result.isEmpty()){
            var e = result.array()[0];
            logger.debug(e);
            return callback(new AppError(e.param + ' ' + e.msg,'input'));
          }



          Manager.updatePlayer(playerId, req.body, callback);

        });
    }
  ],
  function(err, data){

    if(err){
      if(err.name === 'input'){
        return res.status(400).json({ error: err.message });
      }

      console.log('ki somossa');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.sendStatus(200);
  });

});

module.exports = router;
