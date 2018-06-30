'use strict';

/**
 * Module dependencies.
 */
var app = require('./app').init();
var logger = require('winston');

logger.info('start listening process...');

/**
 * Listen on provided port, on all network interfaces.
 */
var server = app.listen(global.PORT);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
  logger.info('Listening on ' + bind);
}


/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof app.get('port') === 'string'
        ? 'Pipe ' + app.get('port')
        : 'Port ' + app.get('port');

    // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.fatal(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.fatal(bind + ' is already in use');  //  if EADDRINUSE error run  $sudo killall -9 node
      process.exit(1);
      break;
    default:
      logger.fatal('server error unknown error code');
      throw error;
  }
}
