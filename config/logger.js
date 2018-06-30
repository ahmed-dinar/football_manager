'use strict';


var winston = require('winston');
var path = require('path');
var chalk = require('chalk');

console.log( chalk.cyan('Loading and setup logger...') );

var ENV =  'development';

Date.prototype.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
Date.prototype.getMonthName = function() {
  return this.monthNames[this.getMonth()];
};


//logger custom log levels
var levels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
  },
  colors: {
    fatal: 'magenta',
    error: 'red',
    warning: 'yellow',
    info: 'cyan',
    debug: 'blue'
  }
};


winston.addColors(levels.colors);



/*
winston.add(new winston.transports.File({
  filename: path.resolve(__dirname, '../logs/logs.log'),
  handleExceptions: true,
  json: false,
  colorize: false,
  levels: levels.levels,
  timestamp: function () {
    var date = new Date();
    return '[' + date.getDate() + '/' + date.getMonthName() + '/' + date.getFullYear() + ':' + date.toLocaleTimeString() + ']';
  }
}));
*/

winston.remove(new winston.transports.Console());
winston.add(new winston.transports.Console ({
  levels: levels.levels,
  level: ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf((info) => {

      console.log(info);

      const {
        timestamp, level, message, ...args
      } = info;

      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
    })
  ),
  handleExceptions: true
}));


