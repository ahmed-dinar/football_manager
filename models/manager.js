'use strict';

var async = require('async');
var bcrypt = require('bcryptjs');
var moment = require('moment');
var crypto = require('crypto');
var assign = require('lodash/assign');
var jwt = require('jsonwebtoken');

var jwt_secret = 'thisisseretcode';

var logger = require('winston');
var DB = appRequire('db/DB');
var Query = appRequire('db/query');
var AppError = appRequire('lib/custom-error');
var jwtConfig = appRequire('config/jwt');


var teamTable = 'teams';
var playerTable = 'players';
var managerTable = 'managers';

function Manager(){}


//
// find a user in database
//
function findUser(email, cb){

  console.log('in findUser');

  var sql = Query
  .select()
  .from(managerTable)
  .where({
    'email': email
  })
  .limit(1);

  DB.execute(sql.toString(),function(err,user){
    if (err)
      return cb(err);

    if (user.length)
      return cb(null, user[0]);

    return cb(new AppError('not found','404'));
  });
}


Manager.getTeam = function(managerId, teamName, fn){

  if( !teamName ){
    return fn(new Error('teamName required'));    
  }

  var sql = Query
  .select()
  .from(teamTable)
  .where({
    'name': teamName,
    'mid': managerId
  })
  .limit(1);

  DB.execute(sql.toString(),fn);
};


Manager.getPlayer = function(teamId, playerName, fn){

  if( !teamName || !managerId ){
    return fn(new Error('teamName && managerId required'));    
  }

  var sql = Query
  .select()
  .from(playerTable)
  .where({
    'tid': teamId,
    'name': playerName
  })
  .limit(1);

  DB.execute(sql.toString(),fn);
};

Manager.teamNameExists = function(name, fn){

  console.log('in teamNameExists');

  if( !name ){
    return fn(new Error('email or password required'));    
  }

  var sql = Query
  .select()
  .from(teamTable)
  .where({
    'name': name
  })
  .limit(1);

  DB.execute(sql.toString(),fn);
}


Manager.playerNameExists = function(name, teamId, fn){

  console.log('in playerNameExists');

  if( !name ){
    return fn(new Error('email or password required'));    
  }

  var sql = Query
  .select()
  .from(playerTable)
  .where({
    'name': name,
    'tid': teamId
  })
  .limit(1);

  DB.execute(sql.toString(),fn);
}



//
// validate password
//
function validatePassword(password, user, cb){
  console.log('in validatePassword');
  bcrypt.compare(password, user.password, function(err, passed) {
    if(err)
      return cb(err);

    if(passed)
      return cb(null,user);

    return cb(new AppError('invalid','401'));
  });
}

//
//generate jwt token with user payload
//
function generateToken(user, cb){

   console.log('in gerenartetoken');

  var payLoad = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  jwt.sign(payLoad, jwt_secret, jwtConfig.options(), function(err, token) {

    console.log('gerated');

    if(err)
      return cb(err);



/*    delete payLoad.email;
    delete payLoad.id;*/

    console.log('returnd');

    return cb(null, payLoad, token);
  });
}

//
//user authentication/login
//
Manager.auth = function(email, password, fn){
  async.waterfall([
    async.apply(findUser, email),
    async.apply(validatePassword, password),
    generateToken
  ], fn);
};


//
// Check if a username or email already registered
//
Manager.available = function(email, fn){
  var sql;


  console.log('avauiable db call - ' + email);

  if( !email ){
    return fn(new Error('email or password required'));    
  }

  sql = Query
    .select('email')
    .from(managerTable)
    .where('email', email)
    .limit(1);

  DB.execute(sql.toString(),fn);
};



/**
 * Login process
 * @param username
 * @param password
 * @param fn
 */
Manager.login = function(email, password, fn) {

  async.waterfall([
        //find user by username
    function (callback) {
      var sql = Query.select()
                .from(managerTable)
                .where({
                  'email': email
                })
                .limit(1);

      DB.execute(
                sql.toString()
                ,function(err,rows){
                  if (err) { return callback(err,null); }

                  if (rows.length) { return callback(null, rows[0]); }

                  callback('invalid email or password');
                });
    },
        //comapare password with hash
    function (rows, callback) {
      bcrypt.compare(password, rows.password, function(err, res) {

        if(err) return callback('Error compare password');

        if(res) return callback(null,rows);

        callback('invalid username or password');
      });
    }
  ], fn);
};

//
//
//
Manager.put = function(uid, colums, fn){
  var sql = Query(managerTable)
  .update(colums)
  .where('id', uid)
  .toString();

  return DB.execute(sql, fn);
};



Manager.getProfile = function (email , fn) {

  async.waterfall([
    function (callback) {

      var sql = Query.select()
      .from(managerTable)
      .where('email', email)
      .limit(1);

      DB.execute(sql.toString(),function (err,rows) {
        if(err) return callback(err);

        if(!rows || !rows.length) return callback('404');

        callback(null,rows[0]);
      });
    }
  ], fn);
};


Manager.teams = function (managerId , callback) {


  var sql = Query.select()
      .from(teamTable + ' as tm')
      .leftJoin(playerTable + ' as pl')
      .where('mid', managerId);

      DB.execute(sql.toString(),function (err,rows) {
        if(err) return callback(err);

        console.log(rows.length);
        console.log(rows);

        callback(null, rows);
      });

};


Manager.players = function (managerId, teamName, callback) {


    var sql = Query.select('pl.*')
      .from(teamTable + ' as tm')
      .leftJoin(playerTable + ' as pl', 'tm.id', 'pl.tid')
      .where('tm.mid', managerId)
      .andWhere('tm.name', teamName);

      DB.execute(sql.toString(),function (err,rows) {
        if(err) return callback(err);

        console.log(rows.length);
        console.log(rows);

        callback(null, rows);
      });

};



Manager.addTeam = function (data , fn) {

  var sql = Query
        .insert(data)
        .into(teamTable)
        .toString();

      DB.execute(sql, fn);
};


Manager.addPlayer = function (data , fn) {

  var sql = Query
        .insert(data)
        .into(playerTable)
        .toString();

      DB.execute(sql, fn);
};


Manager.deletePlayer = function (playerId, fn) {

  var sql = Query(playerTable)
    .where('id', playerId)
    .del()
    .toString();

  DB.execute(sql, fn);
};


Manager.updatePlayer = function (playerId, data, fn) {

  var sql = Query(playerTable)
    .update(data)
    .where({ 'id': playerId });
    .toString();

  DB.execute(sql, fn);
};



Manager.save = function(user, fn){
  var data = {
    name: user.name,
    email: user.email
  };

  logger.debug('saving started');

  async.waterfall([
    function(callback) {
      logger.debug('generating salt');
      bcrypt.genSalt(10, callback);
    },
    function(salt, callback) {
      logger.debug('generating hash');
      bcrypt.hash(user.password, salt, callback);
    },
    function (hashedPassword, callback) {
      logger.debug('generating token');
      crypto.randomBytes(20, function(err, buf) {
        if(err)
          return callback(err);

        return callback(null, hashedPassword, buf.toString('hex'));
      });
    },
    function(hashedPassword, token, callback) {

      var now = moment();
      var created = moment(now).format('YYYY-MM-DD HH:mm:ss');
      var expire = moment(now)
        .add(72, 'hours')
        .format('YYYY-MM-DD HH:mm:ss');

      data = assign(data,{
        password: hashedPassword,
        joined: created,
        token_expires: expire,
        reset_token: token
      });

      var sql = Query
        .insert(data)
        .into(managerTable)
        .toString();

      DB.execute(sql, function(err,rows){
        if (err)
          return callback(err);

        return callback(null, token);
      });
    }
  ], fn);
};


module.exports = Manager;










