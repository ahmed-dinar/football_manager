'use strict';

var mysql = require('mysql');


var pool = mysql.createPool({
  host            : '127.0.0.1',
  user            : 'root',
  password        : '',
  database        : 'football_manager',
  connectionLimit : 10
});


exports.getConnection = function (callback) {
  pool.getConnection(callback);
};